import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdPrint, MdDownload, MdCheckCircle } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getInvoiceByOrderId } from '../../services/api';

interface Invoice {
  invoiceID: number;
  orderID: number;
  invoiceNumber: string;
  issueDate: string;
  totalAmount: number;
  tax: number;
  customerName: string;
  customerAddress: string;
  order?: {
    orderDate: string;
    orderDetails?: Array<{
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
  };
}

const InvoicePage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!orderId) return;

      try {
        const data = await getInvoiceByOrderId(parseInt(orderId));
        setInvoice(data);
      } catch (err) {
        console.error('Error fetching invoice:', err);
        toast.error('Hóa đơn chưa được tạo. Vui lòng đợi admin xác nhận thanh toán.');
        setTimeout(() => {
          navigate(`/don-hang/${orderId}`);
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [orderId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!invoice) return null;

  const subtotal = invoice.totalAmount - invoice.tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Action Buttons - Hidden when printing */}
        <div className="mb-6 flex gap-3 print:hidden">
          <button
            onClick={() => navigate(`/don-hang/${orderId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            <MdArrowBack className="w-5 h-5" />
            Quay lại
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <MdPrint className="w-5 h-5" />
            In hóa đơn
          </button>
        </div>

        {/* Invoice Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">HÓA ĐƠN THANH TOÁN</h1>
            <p className="text-green-600 font-semibold flex items-center justify-center gap-2">
              <MdCheckCircle className="w-5 h-5" />
              Đã thanh toán
            </p>
          </div>

          {/* Invoice Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">Thông tin hóa đơn</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Số hóa đơn:</span>{' '}
                  <span className="font-semibold text-red-600">{invoice.invoiceNumber}</span>
                </p>
                <p>
                  <span className="text-gray-600">Ngày xuất:</span>{' '}
                  <span className="font-medium">{formatDate(invoice.issueDate)}</span>
                </p>
                <p>
                  <span className="text-gray-600">Mã đơn hàng:</span>{' '}
                  <span className="font-medium">#{invoice.orderID}</span>
                </p>
                {invoice.order?.orderDate && (
                  <p>
                    <span className="text-gray-600">Ngày đặt:</span>{' '}
                    <span className="font-medium">{formatDate(invoice.order.orderDate)}</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">Thông tin khách hàng</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Tên:</span>{' '}
                  <span className="font-medium">{invoice.customerName}</span>
                </p>
                <p>
                  <span className="text-gray-600">Địa chỉ:</span>{' '}
                  <span className="font-medium">{invoice.customerAddress}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Products Table */}
          {invoice.order?.orderDetails && invoice.order.orderDetails.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Chi tiết sản phẩm</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sản phẩm</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">SL</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Đơn giá</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.order.orderDetails.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm">{item.productName}</td>
                        <td className="px-4 py-3 text-sm text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          {formatCurrency(item.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Total Summary */}
          <div className="border-t-2 border-gray-200 pt-6">
            <div className="flex flex-col items-end space-y-2">
              <div className="flex justify-between w-full md:w-80">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between w-full md:w-80">
                <span className="text-gray-600">Thuế VAT (10%):</span>
                <span className="font-medium">{formatCurrency(invoice.tax)}</span>
              </div>
              <div className="flex justify-between w-full md:w-80 text-xl font-bold pt-3 border-t border-gray-200">
                <span>Tổng cộng:</span>
                <span className="text-red-600">{formatCurrency(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p className="mb-2">Cảm ơn quý khách đã mua hàng!</p>
            <p>Hóa đơn này là bằng chứng xác nhận giao dịch đã hoàn tất.</p>
          </div>
        </div>

        {/* Print-specific styles */}
        <style>{`
          @media print {
            body {
              background: white;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default InvoicePage;
