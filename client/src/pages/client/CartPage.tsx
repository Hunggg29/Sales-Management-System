import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdDelete, MdShoppingCart, MdAdd, MdRemove, MdArrowBack } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getCartByUserId, updateCartItem, removeCartItem, clearCart } from '../../services/api';
import type { Cart, User } from '../../types';
import { useCart } from '../../contexts/CartContext';
import CheckoutModal from '../../components/CheckoutModal';

const CartPage = () => {
  const { refreshCart } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      // Don't redirect, just set loading to false and show login message
      setIsLoading(false);
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchCart(userData.userID);
    } catch (err) {
      console.error('Error parsing user data:', err);
      setIsLoading(false);
    }
  }, []);

  const showConfirmToast = (message: string, onConfirm: () => Promise<void>) => {
    const ConfirmToast = ({ closeToast }: { closeToast?: () => void }) => (
      <div>
        <p className="mb-3 font-medium">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              closeToast?.();
            }}
            className="px-4 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-semibold"
          >
            Hủy
          </button>
          <button
            onClick={async () => {
              closeToast?.();
              await onConfirm();
            }}
            className="px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold"
          >
            Xác nhận
          </button>
        </div>
      </div>
    );

    toast(<ConfirmToast />, {
      position: 'top-center',
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
    });
  };

  const fetchCart = async (userId: number) => {
    try {
      setIsLoading(true);
      const cartData = await getCartByUserId(userId);
      setCart(cartData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải giỏ hàng';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (!user || newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    try {
      const updatedCart = await updateCartItem(user.userID, cartItemId, { quantity: newQuantity });
      setCart(updatedCart);
      await refreshCart();
      toast.success('Cập nhật số lượng thành công!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể cập nhật số lượng';
      toast.error(errorMessage);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = (cartItemId: number) => {
    if (!user) return;

    showConfirmToast('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?', async () => {
      try {
        await removeCartItem(user.userID, cartItemId);
        await fetchCart(user.userID);
        await refreshCart();
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể xóa sản phẩm';
        toast.error(errorMessage);
      }
    });
  };

  const handleClearCart = () => {
    if (!user) return;

    showConfirmToast('Bạn có chắc muốn xóa toàn bộ sản phẩm trong giỏ hàng?', async () => {
      try {
        await clearCart(user.userID);
        await fetchCart(user.userID);
        await refreshCart();
        toast.success('Đã xóa toàn bộ giỏ hàng!');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể xóa giỏ hàng';
        toast.error(errorMessage);
      }
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl font-bold mb-2">Giỏ Hàng Của Bạn</h1>
          <p className="text-red-100">Quản lý sản phẩm và thanh toán</p>
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {!user ? (
            <div className="bg-white rounded-lg shadow-md text-center py-12 px-6">
              <MdShoppingCart className="w-24 h-24 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">Vui lòng đăng nhập</h3>
              <p className="text-gray-500 mb-6">Bạn cần đăng nhập để xem giỏ hàng của mình</p>
              <Link to="/">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                  <MdArrowBack />
                  Về trang chủ
                </button>
              </Link>
            </div>
          ) : !cart || cart.cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md text-center py-12 px-6">
              <MdShoppingCart className="w-24 h-24 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">Giỏ hàng trống</h3>
              <p className="text-gray-500 mb-6">Chưa có sản phẩm nào trong giỏ hàng của bạn</p>
              <Link to="/san-pham">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                  <MdArrowBack />
                  Tiếp tục mua sắm
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Sản phẩm ({cart.totalItems})</h2>
                  <button
                    onClick={handleClearCart}
                    className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                  >
                    Xóa tất cả
                  </button>
                </div>

                {cart.cartItems.map((item) => (
                  <div key={item.cartItemID} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link to={`/san-pham/${item.productID}`} className="flex-shrink-0">
                        <img
                          src={item.productImage || '/placeholder-product.png'}
                          alt={item.productName}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1">
                        <Link to={`/san-pham/${item.productID}`}>
                          <h3 className="text-lg font-semibold hover:text-red-600 transition-colors mb-2">{item.productName}</h3>
                        </Link>
                        <p className="text-red-600 font-bold text-lg mb-2">
                          {formatCurrency(item.unitPrice)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Còn lại: {item.stockQuantity} sản phẩm
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => handleRemoveItem(item.cartItemID)}
                          className="text-red-600 hover:text-red-700 p-2"
                          title="Xóa sản phẩm"
                        >
                          <MdDelete className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.cartItemID, item.quantity - 1)}
                            disabled={updatingItems.has(item.cartItemID) || item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <MdRemove />
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.cartItemID, item.quantity + 1)}
                            disabled={updatingItems.has(item.cartItemID) || item.quantity >= item.stockQuantity}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <MdAdd />
                          </button>
                        </div>

                        <p className="text-lg font-bold text-gray-800 mt-2">
                          {formatCurrency(item.subTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                  <h3 className="text-xl font-semibold mb-6 pb-4 border-b">Tóm tắt đơn hàng</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính:</span>
                      <span className="font-semibold">{formatCurrency(cart.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển:</span>
                      <span className="font-semibold">Liên hệ</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-red-600">{formatCurrency(cart.totalAmount)}</span>
                    </div>
                  </div>

                  <button className="w-full py-4 mb-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() => setShowCheckoutModal(true)}
                  >
                    Đặt hàng
                  </button>

                  <Link to="/san-pham">
                    <button className="w-full py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors inline-flex items-center justify-center gap-2">
                      <MdArrowBack />
                      Tiếp tục mua sắm
                    </button>
                  </Link>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-3">Chính sách mua hàng</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>✓ Miễn phí vận chuyển cho đơn hàng trên 500.000đ</li>
                      <li>✓ Đổi trả trong vòng 7 ngày</li>
                      <li>✓ Bảo hành chính hãng</li>
                      <li>✓ Thanh toán an toàn</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Checkout Modal */}
      {user && cart && (
        <CheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => {
            setShowCheckoutModal(false);
            // Refresh cart để cập nhật UI sau khi checkout
            if (user) {
              fetchCart(user.userID);
            }
          }}
          cart={cart}
          user={user}
        />
      )}
    </div>
  );
};

export default CartPage;
