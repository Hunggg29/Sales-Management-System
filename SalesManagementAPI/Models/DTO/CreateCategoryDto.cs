namespace SalesManagementAPI.Models.DTO
{
  public class CreateCategoryDto
  {
    public string CategoryName { get; set; } = null!;
    public string? Description { get; set; }
  }
}
