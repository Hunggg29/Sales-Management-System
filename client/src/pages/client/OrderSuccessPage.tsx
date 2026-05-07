import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdLocalShipping, MdHistory, MdCheckCircle, MdPayment, MdReceipt } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getOrderById, createBankTransferQR, getInvoiceByOrderId } from '../../services/api';
import { OrderStatusBadge } from '../../components/shared';
import QRPaymentModal from '../../components/QRPaymentModal';
import type { Order } from '../../types';

const OrderSuccessPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [hasInvoice, setHasInvoice] = useState(false);

  const normalizeStatus = (status?: string) => (status || '').toUpperCase();

  const refreshOrderData = useCallback(async () => {
    if (!orderId) return;

    const parsedOrderId = parseInt(orderId);
    const data = await getOrderById(parsedOrderId);
    setOrder(data);

    if (normalizeStatus(data.payment?.paymentStatus) === 'PAID') {
      try {
        await getInvoiceByOrderId(parsedOrderId);
        setHasInvoice(true);
      } catch {
        setHasInvoice(false);
      }
    } else {
      setHasInvoice(false);
    }
  }, [orderId]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        await refreshOrderData();
      } catch (err) {
        toast.error('Không thể tải thông tin đơn hàng');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [navigate, orderId, refreshOrderData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!order) return null;

  const getPaymentMethodText = (method: string) => {
    const methods: Record<string, string> = {
      COD: 'Thanh toán khi nhận hàng',
      BANK_TRANSFER: 'Chuyển khoản ngân hàng',
      CASH: 'Tiền mặt',
    };
    return methods[normalizeStatus(method)] || method;
  };

  const getPageTitle = (status: string) => {
    switch (normalizeStatus(status)) {
      case 'CREATED':
        return 'Đơn hàng đang chờ duyệt!';
      case 'APPROVED':
        return 'Đơn hàng đã được xác nhận!';
      case 'SHIPPING':
        return 'Đơn hàng đang được vận chuyển!';
      case 'DELIVERED':
        return 'Đơn hàng đã giao thành công!';
      case 'COMPLETED':
        return 'Đơn hàng giao thành công!';
      case 'CANCELLED':
        return 'Đơn hàng đã bị hủy!';
      default:
        return 'Thông tin đơn hàng';
    }
  };

  const getPageMessage = (status: string) => {
    switch (normalizeStatus(status)) {
      case 'CREATED':
        return 'Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận và đang chờ nhân viên xác nhận.';
      case 'APPROVED':
        return 'Đơn hàng của bạn đã được nhân viên xác nhận và đang được chuẩn bị.';
      case 'SHIPPING':
        return 'Đơn hàng của bạn đang trên đường vận chuyển đến địa chỉ nhận hàng.';
      case 'DELIVERED':
        return 'Đơn hàng đã giao thành công. Bạn có thể hoàn tất thanh toán ngay bằng QR.';
      case 'COMPLETED':
        return 'Đơn hàng đã được giao thành công. Cảm ơn bạn đã tin tưởng và mua sắm tại cửa hàng!';
      case 'CANCELLED':
        return 'Rất tiếc, đơn hàng của bạn đã bị hủy. Vui lòng liên hệ bộ phận CSKH nếu có thắc mắc.';
      default:
        return '';
    }
  };
  const handlePayNow = async () => {
    if (!order) return;
    
    setIsProcessingPayment(true);
    try {
      const qrResponse = await createBankTransferQR(order.orderID);
      
      if (qrResponse.success) {
        setQrData(qrResponse);
        setShowQRModal(true);
        toast.success('Vui lòng quét mã QR để thanh toán');
      } else {
        throw new Error(qrResponse.message || 'Không thể tạo mã QR thanh toán');
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Không thể tạo mã thanh toán';
      toast.error(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const normalizedOrderStatus = normalizeStatus(order?.status);
  const normalizedPaymentStatus = normalizeStatus(order?.payment?.paymentStatus);
  const isPaymentUnpaid = normalizedPaymentStatus === 'UNPAID';
  const isPaymentPaid = normalizedPaymentStatus === 'PAID';
  const canPayOnline = isPaymentUnpaid && ['APPROVED', 'SHIPPING', 'DELIVERED', 'COMPLETED'].includes(normalizedOrderStatus);
  const canViewInvoice = isPaymentPaid && hasInvoice;
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Status Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="transform scale-150">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {getPageTitle(order.status)}
          </h1>
          <p className="text-gray-600 mb-4">
            {getPageMessage(order.status)}
          </p>
          <div className="inline-block bg-gray-100 px-6 py-3 rounded-lg">
            <p className="text-sm text-gray-600">Mã đơn hàng</p>
            <p className="text-2xl font-bold text-red-600">#{order.orderID}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <MdLocalShipping className="w-6 h-6 mr-2 text-red-600" />
            Chi tiết đơn hàng
          </h2>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Ngày đặt hàng:</span>
              <span className="font-semibold">
                {new Date(order.orderDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Trạng thái:</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="font-semibold">
                {order.payment && getPaymentMethodText(order.payment.paymentMethod)}
              </span>
            </div>
            {order.payment && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-mono text-sm">{order.payment.transactionCode}</span>
              </div>
            )}
            {order.payment && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Trạng thái thanh toán:</span>
                <span className={`font-semibold ${isPaymentPaid ? 'text-green-600' : 'text-amber-600'}`}>
                  {isPaymentPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </div>
            )}
          </div>

          {/* Products */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Sản phẩm:</h3>
            <div className="space-y-3">
              {order.orderDetails?.map((item) => (
                <div key={item.productID} className={`flex justify-between items-center py-3 border-b ${normalizedOrderStatus === 'CANCELLED' ? 'opacity-50' : ''}`}>
                  <div className="flex-1">
                    <p className={`font-medium text-gray-800 ${normalizedOrderStatus === 'CANCELLED' ? 'line-through' : ''}`}>
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.unitPrice.toLocaleString('vi-VN')}₫ x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-red-600 ${normalizedOrderStatus === 'CANCELLED' ? 'line-through' : ''}`}>
                      {item.totalPrice.toLocaleString('vi-VN')}₫
                    </p>
                    {normalizedOrderStatus === 'CANCELLED' && <span className="text-xs text-red-500 font-medium">Đã hủy</span>}
                    {normalizedOrderStatus === 'APPROVED' && <span className="text-xs text-green-500 font-medium">Đã xác nhận</span>}
                    {normalizedOrderStatus === 'SHIPPING' && <span className="text-xs text-blue-500 font-medium flex items-center justify-end gap-1"><MdLocalShipping className="w-3 h-3" /> Đang giao</span>}
                    {normalizedOrderStatus === 'DELIVERED' && <span className="text-xs text-cyan-600 font-medium flex items-center justify-end gap-1"><MdCheckCircle className="w-3 h-3" /> Đã giao</span>}
                    {normalizedOrderStatus === 'COMPLETED' && <span className="text-xs text-emerald-500 font-medium flex items-center justify-end gap-1"><MdCheckCircle className="w-3 h-3" /> Thành công</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 pt-4 border-t-2 border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Tổng cộng:</span>
              <span className="text-2xl font-bold text-red-600">
                {order.totalAmount.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {/* Payment Button for Confirmed+ and Unpaid Orders */}
          {canPayOnline && (
            <button
              onClick={handlePayNow}
              disabled={isProcessingPayment}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdPayment className="w-6 h-6" />
              {isProcessingPayment ? 'Đang xử lý...' : 'Thanh toán ngay'}
            </button>
          )}

          {/* View Invoice Button for Paid Orders */}
          {canViewInvoice && (
            <button
              onClick={() => navigate(`/hoa-don/${orderId}`)}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <MdReceipt className="w-6 h-6" />
              Xem hóa đơn thanh toán
            </button>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              <MdArrowBack className="w-5 h-5" />
              Về trang chủ
            </button>
            <button
              onClick={() => navigate('/lich-su-don-hang')}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <MdHistory className="w-5 h-5" />
              Lịch sử đơn hàng
            </button>
          </div>
        </div>
      </div>

      {/* QR Payment Modal */}
      <QRPaymentModal
        isOpen={showQRModal}
        onClose={() => {
          setShowQRModal(false);
          refreshOrderData().catch(console.error);
        }}
        onPaymentSuccess={() => {
          refreshOrderData().catch(console.error);
        }}
        qrData={qrData}
      />
    </div>
  );
};

export default OrderSuccessPage;

