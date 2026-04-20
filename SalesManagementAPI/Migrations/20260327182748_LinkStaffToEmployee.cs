using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class LinkStaffToEmployee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Users_StaffID",
                table: "Invoices");

            migrationBuilder.Sql(@"
                UPDATE i
                SET i.StaffID = e.EmployeeID
                FROM Invoices i
                LEFT JOIN Employees e ON e.UserID = i.StaffID
                WHERE i.StaffID IS NOT NULL;

                UPDATE i
                SET i.StaffID = NULL
                FROM Invoices i
                LEFT JOIN Employees e ON e.EmployeeID = i.StaffID
                WHERE i.StaffID IS NOT NULL AND e.EmployeeID IS NULL;

                UPDATE o
                SET o.StaffID = e.EmployeeID
                FROM Orders o
                LEFT JOIN Employees e ON e.UserID = o.StaffID
                WHERE o.StaffID IS NOT NULL;

                UPDATE o
                SET o.StaffID = NULL
                FROM Orders o
                LEFT JOIN Employees e ON e.EmployeeID = o.StaffID
                WHERE o.StaffID IS NOT NULL AND e.EmployeeID IS NULL;
            ");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_StaffID",
                table: "Orders",
                column: "StaffID");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Employees_StaffID",
                table: "Invoices",
                column: "StaffID",
                principalTable: "Employees",
                principalColumn: "EmployeeID",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Employees_StaffID",
                table: "Orders",
                column: "StaffID",
                principalTable: "Employees",
                principalColumn: "EmployeeID",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Employees_StaffID",
                table: "Invoices");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Employees_StaffID",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_StaffID",
                table: "Orders");

            migrationBuilder.Sql(@"
                UPDATE i
                SET i.StaffID = u.UserID
                FROM Invoices i
                LEFT JOIN Employees e ON e.EmployeeID = i.StaffID
                LEFT JOIN Users u ON u.UserID = e.UserID
                WHERE i.StaffID IS NOT NULL;

                UPDATE i
                SET i.StaffID = NULL
                FROM Invoices i
                LEFT JOIN Users u ON u.UserID = i.StaffID
                WHERE i.StaffID IS NOT NULL AND u.UserID IS NULL;

                UPDATE o
                SET o.StaffID = u.UserID
                FROM Orders o
                LEFT JOIN Employees e ON e.EmployeeID = o.StaffID
                LEFT JOIN Users u ON u.UserID = e.UserID
                WHERE o.StaffID IS NOT NULL;

                UPDATE o
                SET o.StaffID = NULL
                FROM Orders o
                LEFT JOIN Users u ON u.UserID = o.StaffID
                WHERE o.StaffID IS NOT NULL AND u.UserID IS NULL;
            ");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Users_StaffID",
                table: "Invoices",
                column: "StaffID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
