import { useSearchParams, Link } from 'react-router-dom';
import { MdError } from 'react-icons/md';
import { Button } from '../components/shared';

const PaymentFailedPage = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message') || 'Thanh toán thất bại';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <MdError className="w-12 h-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Thanh toán thất bại
        </h1>
        
        <p className="text-gray-600 mb-8">
          {message}
        </p>

        <div className="space-y-3">
          <Link to="/gio-hang">
            <Button variant="primary" fullWidth>
              Quay lại giỏ hàng
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" fullWidth>
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
