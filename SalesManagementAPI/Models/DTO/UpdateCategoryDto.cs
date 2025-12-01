namespace SalesManagementAPI.Models.DTO
{
  public class UpdateCategoryDto
  {
    public string CategoryName { get; set; } = null!;
    public string? Description { get; set; }
  }
}
