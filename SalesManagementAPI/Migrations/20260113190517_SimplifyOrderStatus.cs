using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class SimplifyOrderStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Map old status values to new simplified status
            // Old enum: PENDING_APPROVAL=0, APPROVED=1, PROCESSING=2, SHIPPING=3, COMPLETED=4, CANCELLED=5
            // New enum: CREATED=0, PENDING=1, APPROVED=2, COMPLETED=3, CANCELLED=4

            // Update existing orders with new status mapping
            migrationBuilder.Sql(@"
                UPDATE Orders SET Status = CASE
                    WHEN Status = 0 THEN 1  -- PENDING_APPROVAL (0) -> PENDING (1)
                    WHEN Status = 1 THEN 2  -- APPROVED (1) -> APPROVED (2)
                    WHEN Status = 2 THEN 2  -- PROCESSING (2) -> APPROVED (2)
                    WHEN Status = 3 THEN 2  -- SHIPPING (3) -> APPROVED (2)
                    WHEN Status = 4 THEN 3  -- COMPLETED (4) -> COMPLETED (3)
                    WHEN Status = 5 THEN 4  -- CANCELLED (5) -> CANCELLED (4)
                    ELSE 1                  -- Default to PENDING
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverse mapping (best effort - some info is lost)
            migrationBuilder.Sql(@"
                UPDATE Orders SET Status = CASE
                    WHEN Status = 1 THEN 0  -- PENDING (1) -> PENDING_APPROVAL (0)
                    WHEN Status = 2 THEN 1  -- APPROVED (2) -> APPROVED (1)
                    WHEN Status = 3 THEN 4  -- COMPLETED (3) -> COMPLETED (4)
                    WHEN Status = 4 THEN 5  -- CANCELLED (4) -> CANCELLED (5)
                    ELSE 0                  -- Default to PENDING_APPROVAL
                END
            ");
        }
    }
}
