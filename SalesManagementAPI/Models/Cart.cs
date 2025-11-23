// Models/Cart.cs
namespace SalesManagementAPI.Models
{
  public class Cart
  {
    public int CartID { get; set; }
    public int CustomerID { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public Customer? Customer { get; set; }
    public ICollection<CartItem>? CartItems { get; set; }
  }
}
