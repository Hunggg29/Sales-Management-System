// http_filelist_server.c (UPDATED VERSION)
#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <pthread.h>
#include <ctype.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <dirent.h>
#include <limits.h>
#include <time.h>

#define BACKLOG 64
#define BUF 4096

struct server_conf
{
  char root[PATH_MAX];
  int port;
};

static struct server_conf conf;

static void *client_thread(void *arg);
static int start_listen(int port);
static void http_send(int fd, const char *status, const char *content_type, const void *body, size_t bodylen);
static int send_file(int fd, const char *filepath);
static const char *get_mime(const char *filename);
static char *build_listing_html(const char *root_real, const char *req_relpath);
static char *url_decode(const char *src);
static int is_subpath(const char *parent, const char *child);
static ssize_t send_all(int fd, const void *buf, size_t len);

// MAIN

int main(int argc, char **argv)
{
  int port = 8000;
  const char *root = ".";
  if (argc >= 2)
    port = atoi(argv[1]);
  if (argc >= 3)
    root = argv[2];

  if (!realpath(root, conf.root))
  {
    perror("realpath root");
    return 1;
  }
  conf.port = port;

  int listen_fd = start_listen(port);
  if (listen_fd < 0)
    return 1;

  printf("HTTP file-list server listening on port %d, root: %s\n", port, conf.root);

  while (1)
  {
    struct sockaddr_in cli;
    socklen_t cli_len = sizeof(cli);
    int client_fd = accept(listen_fd, (struct sockaddr *)&cli, &cli_len);
    if (client_fd < 0)
    {
      if (errno == EINTR)
        continue;
      perror("accept");
      break;
    }
    pthread_t tid;
    int *pfd = malloc(sizeof(int));
    if (!pfd)
    {
      close(client_fd);
      continue;
    }
    *pfd = client_fd;
    pthread_create(&tid, NULL, client_thread, pfd);
    pthread_detach(tid);
  }

  close(listen_fd);
  return 0;
}

// SOCKET SETUP

static int start_listen(int port)
{
  int s = socket(AF_INET, SOCK_STREAM, 0);
  if (s < 0)
  {
    perror("socket");
    return -1;
  }
  int opt = 1;
  setsockopt(s, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
  struct sockaddr_in addr = {0};
  addr.sin_family = AF_INET;
  addr.sin_addr.s_addr = INADDR_ANY;
  addr.sin_port = htons(port);
  if (bind(s, (struct sockaddr *)&addr, sizeof(addr)) < 0)
  {
    perror("bind");
    close(s);
    return -1;
  }
  if (listen(s, BACKLOG) < 0)
  {
    perror("listen");
    close(s);
    return -1;
  }
  return s;
}

// THREAD PER REQUEST

static void *client_thread(void *arg)
{
  int fd = *(int *)arg;
  free(arg);
  char buf[BUF];
  ssize_t r = recv(fd, buf, sizeof(buf) - 1, 0);
  if (r <= 0)
  {
    close(fd);
    return NULL;
  }
  buf[r] = 0;

  char method[16] = {0}, pathraw[PATH_MAX] = {0};
  sscanf(buf, "%15s %4095s", method, pathraw);

  if (strcasecmp(method, "GET") != 0)
  {
    http_send(fd, "405 Method Not Allowed", "text/plain", "Method not allowed", 18);
    close(fd);
    return NULL;
  }

  char *decoded = url_decode(pathraw);
  if (!decoded)
  {
    http_send(fd, "400 Bad Request", "text/plain", "Bad URL", 7);
    close(fd);
    return NULL;
  }

  const char *rel = decoded;
  while (*rel == '/')
    rel++;

  char candidate[PATH_MAX];
  if (*rel == 0)
  {
    strncpy(candidate, conf.root, sizeof(candidate));
  }
  else
  {
    char tmp[PATH_MAX];
    snprintf(tmp, sizeof(tmp), "%s/%s", conf.root, rel);
    if (!realpath(tmp, candidate))
    {
      http_send(fd, "404 Not Found", "text/plain", "Not found", 9);
      free(decoded);
      close(fd);
      return NULL;
    }
  }

  if (!is_subpath(conf.root, candidate))
  {
    http_send(fd, "403 Forbidden", "text/plain", "Forbidden", 9);
    free(decoded);
    close(fd);
    return NULL;
  }

  struct stat st;
  if (stat(candidate, &st) < 0)
  {
    http_send(fd, "404 Not Found", "text/plain", "Not found", 9);
    free(decoded);
    close(fd);
    return NULL;
  }

  if (S_ISDIR(st.st_mode))
  {
    char *html = build_listing_html(conf.root, rel);
    if (!html)
    {
      http_send(fd, "500 Internal Server Error", "text/plain", "Server error", 12);
    }
    else
    {
      http_send(fd, "200 OK", "text/html; charset=utf-8", html, strlen(html));
      free(html);
    }
  }
  else
  {
    send_file(fd, candidate);
  }

  free(decoded);
  close(fd);
  return NULL;
}

// SEND FILE

static int send_file(int fd, const char *filepath)
{
  FILE *f = fopen(filepath, "rb");
  if (!f)
  {
    http_send(fd, "404 Not Found", "text/plain", "Not found", 9);
    return -1;
  }

  struct stat st;
  stat(filepath, &st);

  const char *mime = get_mime(filepath);

  char header[512];
  int hl = snprintf(header, sizeof(header),
                    "HTTP/1.1 200 OK\r\n"
                    "Content-Type: %s\r\n"
                    "Content-Length: %lld\r\n"
                    "Connection: close\r\n\r\n",
                    mime, (long long)st.st_size);

  send_all(fd, header, hl);

  char buffer[4096];
  size_t n;
  while ((n = fread(buffer, 1, sizeof(buffer), f)) > 0)
  {
    send_all(fd, buffer, n);
  }

  fclose(f);
  return 0;
}

// MIME TYPES

static const char *get_mime(const char *filename)
{
  const char *ext = strrchr(filename, '.');
  if (!ext)
    return "application/octet-stream";
  ext++;

  if (!strcasecmp(ext, "jpg") || !strcasecmp(ext, "jpeg"))
    return "image/jpeg";
  if (!strcasecmp(ext, "png"))
    return "image/png";
  if (!strcasecmp(ext, "gif"))
    return "image/gif";
  if (!strcasecmp(ext, "ico"))
    return "image/x-icon";
  if (!strcasecmp(ext, "html") || !strcasecmp(ext, "htm"))
    return "text/html";
  if (!strcasecmp(ext, "txt"))
    return "text/plain";

  return "application/octet-stream";
}

// DIRECTORY LISTING + FIXED LINKS

static char *build_listing_html(const char *root_real, const char *req_relpath)
{
  char full[PATH_MAX];
  if (req_relpath && strlen(req_relpath))
    snprintf(full, sizeof(full), "%s/%s", root_real, req_relpath);
  else
    snprintf(full, sizeof(full), "%s", root_real);

  char realdir[PATH_MAX];
  if (!realpath(full, realdir))
    return NULL;

  DIR *d = opendir(realdir);
  if (!d)
    return NULL;

  char **dirs = NULL, **files = NULL;
  size_t nd = 0, nf = 0;
  struct dirent *ent;

  while ((ent = readdir(d)))
  {
    if (!strcmp(ent->d_name, "."))
      continue;

    char path[PATH_MAX];
    snprintf(path, sizeof(path), "%s/%s", realdir, ent->d_name);

    struct stat st;
    if (stat(path, &st) < 0)
      continue;

    if (S_ISDIR(st.st_mode))
    {
      dirs = realloc(dirs, (nd + 1) * sizeof(char *));
      dirs[nd++] = strdup(ent->d_name);
    }
    else
    {
      files = realloc(files, (nf + 1) * sizeof(char *));
      files[nf++] = strdup(ent->d_name);
    }
  }
  closedir(d);

  size_t cap = 8192, pos = 0;
  char *out = malloc(cap);

  pos += snprintf(out + pos, cap - pos,
                  "<!doctype html><html><head><meta charset='utf-8'>"
                  "<title>Index of /%s</title></head><body>"
                  "<h2>Index of /%s</h2><hr><ul>",
                  req_relpath ? req_relpath : "",
                  req_relpath ? req_relpath : "");

  // Parent folder link
  if (req_relpath && strlen(req_relpath))
  {
    char parent[PATH_MAX];
    strcpy(parent, req_relpath);
    char *slash = strrchr(parent, '/');
    if (slash)
      *slash = 0;
    else
      parent[0] = 0;

    pos += snprintf(out + pos, cap - pos,
                    "<li><a href=\"/%s\">.. (parent)</a></li>",
                    parent);
  }

  // Directory links
  for (size_t i = 0; i < nd; i++)
  {
    pos += snprintf(out + pos, cap - pos,
                    "<li><b><a href=\"/%s%s%s/\">%s/</a></b></li>",
                    req_relpath ? req_relpath : "",
                    req_relpath && strlen(req_relpath) ? "/" : "",
                    dirs[i],
                    dirs[i]);
  }

  // File links
  for (size_t i = 0; i < nf; i++)
  {
    pos += snprintf(out + pos, cap - pos,
                    "<li><a href=\"/%s%s%s\">%s</a></li>",
                    req_relpath ? req_relpath : "",
                    req_relpath && strlen(req_relpath) ? "/" : "",
                    files[i],
                    files[i]);
  }

  pos += snprintf(out + pos, cap - pos, "</ul><hr></body></html>");
  out = realloc(out, pos + 1);

  for (size_t i = 0; i < nd; i++)
    free(dirs[i]);
  for (size_t i = 0; i < nf; i++)
    free(files[i]);
  free(dirs);
  free(files);

  return out;
}

static char *url_decode(const char *src)
{
  size_t len = strlen(src);
  char *out = malloc(len + 1);
  char *o = out;

  for (size_t i = 0; i < len; i++)
  {
    if (src[i] == '%' && isxdigit(src[i + 1]) && isxdigit(src[i + 2]))
    {
      char hex[3] = {src[i + 1], src[i + 2], 0};
      *o++ = strtol(hex, NULL, 16);
      i += 2;
    }
    else if (src[i] == '+')
    {
      *o++ = ' ';
    }
    else
    {
      *o++ = src[i];
    }
  }
  *o = 0;
  return out;
}

static int is_subpath(const char *parent, const char *child)
{
  size_t lp = strlen(parent);
  return strncmp(parent, child, lp) == 0;
}

static ssize_t send_all(int fd, const void *buf, size_t len)
{
  const char *p = buf;
  while (len > 0)
  {
    ssize_t n = send(fd, p, len, 0);
    if (n <= 0)
      return -1;
    p += n;
    len -= n;
  }
  return 0;
}

static void http_send(int fd, const char *status, const char *type, const void *body, size_t len)
{
  char hdr[BUF];
  int hl = snprintf(hdr, sizeof(hdr),
                    "HTTP/1.1 %s\r\nContent-Type: %s\r\nContent-Length: %zu\r\nConnection: close\r\n\r\n",
                    status, type, len);
  send_all(fd, hdr, hl);
  send_all(fd, body, len);
}
