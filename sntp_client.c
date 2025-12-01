#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <time.h>

#define NTP_TIMESTAMP_DELTA 2208988800ull

typedef struct
{
  uint8_t li_vn_mode; // Leap Indicator (2 bits), Version (3 bits), Mode (3 bits)
  uint8_t stratum;
  uint8_t poll;
  uint8_t precision;
  uint32_t rootDelay;
  uint32_t rootDispersion;
  uint32_t refId;
  uint64_t refTimestamp;
  uint64_t origTimestamp;
  uint64_t recvTimestamp;
  uint64_t transmitTimestamp;
} NTPPacket;

uint64_t ntohll(uint64_t val)
{
  return ((uint64_t)ntohl(val & 0xFFFFFFFF) << 32) | ntohl(val >> 32);
}

int main()
{
  const char *server = "pool.ntp.org"; // NTP pool server
  int sockfd;
  struct sockaddr_in server_addr;
  NTPPacket packet;

  memset(&packet, 0, sizeof(NTPPacket));

  // First byte: LI = 0 (no leap), VN = 4, Mode = 3 (Client)
  packet.li_vn_mode = (0 << 6) | (4 << 3) | 3;

  sockfd = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
  if (sockfd < 0)
  {
    perror("Socket error");
    return 1;
  }

  // 3-second timeout
  struct timeval timeout = {3, 0};
  setsockopt(sockfd, SOL_SOCKET, SO_RCVTIMEO, &timeout, sizeof(timeout));

  memset(&server_addr, 0, sizeof(server_addr));
  server_addr.sin_family = AF_INET;
  server_addr.sin_port = htons(123); // SNTP/NTP port

  if (inet_pton(AF_INET, "129.6.15.28", &server_addr.sin_addr) <= 0)
  {
    // fallback to DNS resolve
    server_addr.sin_addr.s_addr = inet_addr("129.6.15.28");
  }

  printf("Sending SNTP request...\n");

  if (sendto(sockfd, &packet, sizeof(packet), 0,
             (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0)
  {
    perror("Send error");
    return 1;
  }

  socklen_t addr_len = sizeof(server_addr);
  if (recvfrom(sockfd, &packet, sizeof(packet), 0,
               (struct sockaddr *)&server_addr, &addr_len) < 0)
  {
    perror("Receive error");
    return 1;
  }

  close(sockfd);

  uint64_t ntp_time = ntohll(packet.transmitTimestamp);
  time_t unix_time = (time_t)(ntp_time >> 32) - NTP_TIMESTAMP_DELTA;

  printf("NTP Timestamp (raw): %llu\n", (unsigned long long)ntp_time);
  printf("Unix Time         : %ld\n", unix_time);
  printf("UTC Time          : %s", ctime(&unix_time));

  return 0;
}
