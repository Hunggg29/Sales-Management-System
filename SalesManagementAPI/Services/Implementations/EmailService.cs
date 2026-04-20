using System.Net;
using System.Net.Mail;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendAsync(string toEmail, string subject, string htmlBody)
        {
            var host = _configuration["Smtp:Host"]?.Trim();
            var username = _configuration["Smtp:Username"]?.Trim();
            var password = _configuration["Smtp:Password"]?.Trim();
            var fromEmail = _configuration["Smtp:FromEmail"]?.Trim();
            var fromName = _configuration["Smtp:FromName"] ?? "Sales Management";
            var enableSsl = bool.TryParse(_configuration["Smtp:EnableSsl"], out var parsedSsl) && parsedSsl;
            var port = int.TryParse(_configuration["Smtp:Port"], out var parsedPort) ? parsedPort : 587;

            if (string.IsNullOrWhiteSpace(host) ||
                string.IsNullOrWhiteSpace(username) ||
                string.IsNullOrWhiteSpace(password) ||
                string.IsNullOrWhiteSpace(fromEmail))
            {
                throw new InvalidOperationException("Thiếu cấu hình SMTP cần thiết.");
            }

            using var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail, fromName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            mailMessage.To.Add(toEmail.Trim());

            using var smtpClient = new SmtpClient(host, port)
            {
                EnableSsl = enableSsl,
                Credentials = new NetworkCredential(username, password)
            };

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}
