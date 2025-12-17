import { MdPending, MdCheckCircle, MdCancel, MdLocalShipping, MdDoneAll } from 'react-icons/md';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Pending':
        return {
          text: 'Chờ duyệt',
          classes: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
          icon: MdPending
        };
      case 'Confirmed':
        return {
          text: 'Đã duyệt',
          classes: 'bg-green-100 text-green-800 border border-green-200',
          icon: MdCheckCircle
        };
      case 'Processing':
        return {
          text: 'Đang vận chuyển',
          classes: 'bg-blue-100 text-blue-800 border border-blue-200',
          icon: MdLocalShipping
        };
      case 'Completed':
        return {
          text: 'Giao thành công',
          classes: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
          icon: MdDoneAll
        };
      case 'Cancelled':
        return {
          text: 'Đã hủy',
          classes: 'bg-red-100 text-red-800 border border-red-200',
          icon: MdCancel
        };
      default:
        return {
          text: status,
          classes: 'bg-gray-100 text-gray-800 border border-gray-200',
          icon: MdPending
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.classes}`}>
      <Icon className="w-4 h-4" />
      {config.text}
    </span>
  );
};

export default OrderStatusBadge;
