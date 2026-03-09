using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class RefactorOrderAndPaymentStatusWithDataMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Step 1: Add temporary columns for new enum values
            migrationBuilder.AddColumn<int>(
                name: "StatusNew",
                table: "Orders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PaymentStatusNew",
                table: "Payments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PaymentMethodNew",
                table: "Payments",
                type: "int",
                nullable: true);

            // Step 2: Migrate data from string to enum
            // Orders Status Mapping:
            // "Pending" -> 1 (PENDING_APPROVAL)
            // "Confirmed" -> 2 (APPROVED)
            // "Processing" -> 3 (PROCESSING)
            // "Completed" -> 5 (COMPLETED)
            // "Cancelled" -> 6 (CANCELLED)
            // Everything else -> 0 (NEW)
            migrationBuilder.Sql(@"
                UPDATE Orders
                SET StatusNew = CASE Status
                    WHEN 'Pending' THEN 1
                    WHEN 'Confirmed' THEN 2
                    WHEN 'Processing' THEN 3
                    WHEN 'Completed' THEN 5
                    WHEN 'Cancelled' THEN 6
                    ELSE 0
                END
            ");

            // Payments PaymentStatus Mapping:
            // "Pending" or "AwaitingPayment" -> 0 (UNPAID)
            // "Completed" or "Paid" -> 1 (PAID)
            // "Cancelled" or "Failed" -> 2 (FAILED)
            // "Refunded" -> 3 (REFUNDED)
            migrationBuilder.Sql(@"
                UPDATE Payments
                SET PaymentStatusNew = CASE 
                    WHEN PaymentStatus IN ('Pending', 'AwaitingPayment') THEN 0
                    WHEN PaymentStatus IN ('Completed', 'Paid') THEN 1
                    WHEN PaymentStatus IN ('Cancelled', 'Failed') THEN 2
                    WHEN PaymentStatus = 'Refunded' THEN 3
                    ELSE 0
                END
            ");

            // Payments PaymentMethod Mapping:
            // "COD" -> 0 (COD)
            // "Bank Transfer" or "BankTransfer" -> 1 (BANK_TRANSFER)
            // "Cash" -> 2 (CASH)
            migrationBuilder.Sql(@"
                UPDATE Payments
                SET PaymentMethodNew = CASE 
                    WHEN PaymentMethod LIKE '%COD%' THEN 0
                    WHEN PaymentMethod LIKE '%Bank%' OR PaymentMethod LIKE '%Transfer%' THEN 1
                    WHEN PaymentMethod LIKE '%Cash%' THEN 2
                    ELSE 0
                END
            ");

            // Step 3: Drop old string columns
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "PaymentStatus",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "Payments");

            // Step 4: Rename new columns to original names
            migrationBuilder.RenameColumn(
                name: "StatusNew",
                table: "Orders",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "PaymentStatusNew",
                table: "Payments",
                newName: "PaymentStatus");

            migrationBuilder.RenameColumn(
                name: "PaymentMethodNew",
                table: "Payments",
                newName: "PaymentMethod");

            // Step 5: Make columns non-nullable
            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "PaymentStatus",
                table: "Payments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "PaymentMethod",
                table: "Payments",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverse migration: Convert back to strings
            migrationBuilder.AddColumn<string>(
                name: "StatusOld",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentStatusOld",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethodOld",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: true);

            // Convert enums back to strings
            migrationBuilder.Sql(@"
                UPDATE Orders
                SET StatusOld = CASE Status
                    WHEN 0 THEN 'New'
                    WHEN 1 THEN 'Pending'
                    WHEN 2 THEN 'Confirmed'
                    WHEN 3 THEN 'Processing'
                    WHEN 4 THEN 'Shipping'
                    WHEN 5 THEN 'Completed'
                    WHEN 6 THEN 'Cancelled'
                    ELSE 'New'
                END
            ");

            migrationBuilder.Sql(@"
                UPDATE Payments
                SET PaymentStatusOld = CASE PaymentStatus
                    WHEN 0 THEN 'Pending'
                    WHEN 1 THEN 'Completed'
                    WHEN 2 THEN 'Failed'
                    WHEN 3 THEN 'Refunded'
                    ELSE 'Pending'
                END
            ");

            migrationBuilder.Sql(@"
                UPDATE Payments
                SET PaymentMethodOld = CASE PaymentMethod
                    WHEN 0 THEN 'COD'
                    WHEN 1 THEN 'Bank Transfer'
                    WHEN 2 THEN 'Cash'
                    ELSE 'COD'
                END
            ");

            migrationBuilder.DropColumn(name: "Status", table: "Orders");
            migrationBuilder.DropColumn(name: "PaymentStatus", table: "Payments");
            migrationBuilder.DropColumn(name: "PaymentMethod", table: "Payments");

            migrationBuilder.RenameColumn(name: "StatusOld", table: "Orders", newName: "Status");
            migrationBuilder.RenameColumn(name: "PaymentStatusOld", table: "Payments", newName: "PaymentStatus");
            migrationBuilder.RenameColumn(name: "PaymentMethodOld", table: "Payments", newName: "PaymentMethod");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false);

            migrationBuilder.AlterColumn<string>(
                name: "PaymentStatus",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: false);

            migrationBuilder.AlterColumn<string>(
                name: "PaymentMethod",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: false);
        }
    }
}
