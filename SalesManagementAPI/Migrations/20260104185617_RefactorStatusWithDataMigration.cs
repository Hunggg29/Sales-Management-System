using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class RefactorStatusWithDataMigration : Migration
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
            // Orders Status: Pending->1, Confirmed->2, Processing->3, Completed->5, Cancelled->6, else->0
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

            // Payments PaymentStatus: Pending/AwaitingPayment->0, Completed/Paid->1, Cancelled/Failed->2, Refunded->3
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

            // Payments PaymentMethod: COD->0, Bank Transfer->1, Cash->2
            migrationBuilder.Sql(@"
                UPDATE Payments
                SET PaymentMethodNew = CASE 
                    WHEN PaymentMethod LIKE '%COD%' THEN 0
                    WHEN PaymentMethod LIKE '%Bank%' OR PaymentMethod LIKE '%Transfer%' THEN 1
                    WHEN PaymentMethod LIKE '%Cash%' THEN 2
                    ELSE 0
                END
            ");

            // Step 3: Drop old columns
            migrationBuilder.DropColumn(name: "Status", table: "Orders");
            migrationBuilder.DropColumn(name: "PaymentStatus", table: "Payments");
            migrationBuilder.DropColumn(name: "PaymentMethod", table: "Payments");

            // Step 4: Rename new columns
            migrationBuilder.RenameColumn(name: "StatusNew", table: "Orders", newName: "Status");
            migrationBuilder.RenameColumn(name: "PaymentStatusNew", table: "Payments", newName: "PaymentStatus");
            migrationBuilder.RenameColumn(name: "PaymentMethodNew", table: "Payments", newName: "PaymentMethod");

            // Step 5: Make non-nullable
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
            migrationBuilder.AlterColumn<string>(
                name: "PaymentStatus",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "PaymentMethod",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
