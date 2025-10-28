using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Models;

namespace SalesManagementAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }


        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<PaymentLog> PaymentLogs { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Khóa chính phức hợp cho OrderDetail
            modelBuilder.Entity<OrderDetail>()
                .HasKey(od => new { od.OrderID, od.ProductID });

            // 1 - N: Order → Invoices
            modelBuilder.Entity<Order>()
                .HasMany(o => o.Invoices)
                .WithOne(i => i.Order)
                .HasForeignKey(i => i.OrderID)
                .OnDelete(DeleteBehavior.Cascade);

            // 1 - N: User (Staff) → Invoices
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Staff)
                .WithMany(u => u.Invoices)
                .HasForeignKey(i => i.StaffID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Payment>()
                .HasMany(p => p.PaymentLogs)
                .WithOne(pl => pl.Payment)
                .HasForeignKey(pl => pl.PaymentID)
                .OnDelete(DeleteBehavior.Cascade);


            // 1 - N: Order → OrderDetails
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderDetails)
                .WithOne(od => od.Order)
                .HasForeignKey(od => od.OrderID);

            // 1 - N: Customer → Orders
            modelBuilder.Entity<Customer>()
                .HasMany(c => c.Orders)
                .WithOne(o => o.Customer)
                .HasForeignKey(o => o.CustomerID);

            modelBuilder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryID)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Product>()
                .Property(p => p.UnitPrice)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Invoice>()
                .Property(i => i.TotalAmount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<OrderDetail>()
                .Property(od => od.UnitPrice)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<OrderDetail>()
                .Property(od => od.SubTotal)
                .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Invoice>()
                .Property(i => i.Tax)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Order>()
                .Property(o => o.OrderDate)
                .HasColumnType("datetime2");

            modelBuilder.Entity<Invoice>()
                .Property(i => i.IssueDate)
                .HasColumnType("datetime2");



        }

    }
}
