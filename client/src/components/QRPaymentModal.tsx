import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from '../components/shared';
import { MdContentCopy, MdCheckCircle, MdInfo } from 'react-icons/md';
import { toast } from 'react-toastify';
import { checkPaymentStatus } from '../services/api';

const PAYMENT_POLL_INTERVAL = 5000; // 5 giây

interface QRPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
  qrData: {
    qrCodeUrl: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderId: number;
  } | null;
}

const QRPaymentModal = ({ isOpen, onClose, onPaymentSuccess, qrData }: QRPaymentModalProps) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(600); // 10 phút = 600 giây
  const [isPaid, setIsPaid] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset trạng thái mỗi lần mở modal
  useEffect(() => {
    if (isOpen) {
      setCountdown(600);
      setIsPaid(false);
    }
  }, [isOpen]);

  // Polling kiểm tra trạng thái thanh toán mỗi 5 giây
  useEffect(() => {
    if (!isOpen || !qrData) return;

    const stopPolling = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    pollRef.current = setInterval(async () => {
      try {
        const data = await checkPaymentStatus(qrData.orderId);
        if (data.paymentStatus?.toUpperCase() === 'PAID') {
          stopPolling();
          setIsPaid(true);
          toast.success('Đơn hàng đã được thanh toán thành công!');
          onPaymentSuccess?.();
        }
      } catch {
        // bỏ qua lỗi mạng tạm thời
      }
    }, PAYMENT_POLL_INTERVAL);

    return stopPolling;
  }, [isOpen, onPaymentSuccess, qrData]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  const handleViewOrder = () => {
    if (qrData) {
      onClose();
      navigate(`/don-hang/${qrData.orderId}`);
    }
  };

  if (!qrData) return null;

  // Giao diện sau khi thanh toán thành công
  if (isPaid) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Thanh toán thành công"
        closeOnBackdropClick={false}
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <MdCheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Đã xác nhận thanh toán!</h3>
            <p className="text-gray-600">Hệ thống đã ghi nhận giao dịch của bạn.</p>
            <p className="text-gray-600">Hóa đơn sẽ được xuất tự động.</p>
          </div>
          <div className="flex gap-3 w-full">
            <Button variant="secondary" onClick={onClose} fullWidth>
              Đóng
            </Button>
            <Button variant="primary" onClick={() => { onClose(); navigate(`/don-hang/${qrData.orderId}`); }} fullWidth>
              Xem đơn hàng
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thanh toán chuyển khoản"
      closeOnBackdropClick={false}
    >
      <div className="space-y-6">
        {/* Thông báo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <MdInfo className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Hướng dẫn thanh toán:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Quét mã QR bằng app ngân hàng của bạn</li>
              <li>Hoặc chuyển khoản theo thông tin bên dưới</li>
              <li>Đơn hàng sẽ được xử lý sau khi nhận được thanh toán</li>
            </ul>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Thời gian còn lại</p>
          <p className={`text-2xl font-bold ${countdown < 60 ? 'text-red-600' : 'text-gray-800'}`}>
            {formatTime(countdown)}
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
            <img
              src={qrData.qrCodeUrl}
              alt="QR Code thanh toán"
              className="w-64 h-64 object-contain"
            />
          </div>
        </div>

        {/* Thông tin chuyển khoản */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-800 mb-3">Thông tin chuyển khoản</h3>
          
          {/* Ngân hàng */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Ngân hàng:</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{qrData.bankName}</span>
            </div>
          </div>

          {/* Số tài khoản */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Số tài khoản:</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold font-mono">{qrData.accountNumber}</span>
              <button
                onClick={() => copyToClipboard(qrData.accountNumber, 'số tài khoản')}
                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title="Sao chép số tài khoản"
              >
                <MdContentCopy className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Tên tài khoản */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tên tài khoản:</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{qrData.accountName}</span>
              <button
                onClick={() => copyToClipboard(qrData.accountName, 'tên tài khoản')}
                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title="Sao chép tên tài khoản"
              >
                <MdContentCopy className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Số tiền */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-600">Số tiền:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-red-600">
                {qrData.amount.toLocaleString('vi-VN')}₫
              </span>
              <button
                onClick={() => copyToClipboard(qrData.amount.toString(), 'số tiền')}
                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title="Sao chép số tiền"
              >
                <MdContentCopy className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Nội dung chuyển khoản */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Nội dung:</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold font-mono text-red-600">{qrData.description}</span>
              <button
                onClick={() => copyToClipboard(qrData.description, 'nội dung chuyển khoản')}
                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title="Sao chép nội dung"
              >
                <MdContentCopy className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Lưu ý quan trọng */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MdCheckCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
              <p>
                Vui lòng <strong>giữ nguyên nội dung chuyển khoản "{qrData.description}"</strong> để 
                hệ thống tự động xác nhận thanh toán của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            fullWidth
          >
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={handleViewOrder}
            fullWidth
          >
            Xem đơn hàng
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QRPaymentModal;
