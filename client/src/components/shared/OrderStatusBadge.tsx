import { MdPending, MdCheckCircle, MdCancel, MdLocalShipping, MdDoneAll, MdThumbUp, MdBuild } from 'react-icons/md';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    const upperStatus = status.toUpperCase();
    
    switch (upperStatus) {
      case 'PENDING_APPROVAL':
        return {
          text: 'Chờ duyệt',
          classes: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-2 border-yellow-300 shadow-sm',
          icon: MdPending
        };
      case 'APPROVED':
        return {
          text: 'Đã duyệt',
          classes: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-2 border-green-300 shadow-sm',
          icon: MdThumbUp
        };
      case 'PROCESSING':
        return {
          text: 'Đang xử lý',
          classes: 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-2 border-indigo-300 shadow-sm',
          icon: MdBuild
        };
      case 'SHIPPING':
        return {
          text: 'Đang giao hàng',
          classes: 'bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 border-2 border-blue-300 shadow-sm',
          icon: MdLocalShipping
        };
      case 'COMPLETED':
        return {
          text: 'Hoàn thành',
          classes: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-2 border-emerald-400 shadow-md',
          icon: MdDoneAll
        };
      case 'CANCELLED':
        return {
          text: 'Đã hủy',
          classes: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-300 shadow-sm',
          icon: MdCancel
        };
      // Legacy status support
      case 'PENDING':
        return {
          text: 'Chờ duyệt',
          classes: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-2 border-yellow-300 shadow-sm',
          icon: MdPending
        };
      case 'CONFIRMED':
        return {
          text: 'Đã duyệt',
          classes: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-2 border-green-300 shadow-sm',
          icon: MdThumbUp
        };
      case 'PROCESSING':
        return {
          text: 'Đang vận chuyển',
          classes: 'bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 border-2 border-blue-300 shadow-sm',
          icon: MdLocalShipping
        };
      default:
        return {
          text: status,
          classes: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-2 border-gray-300 shadow-sm',
          icon: MdPending
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${config.classes} transition-all duration-200 hover:scale-105`}>
      <Icon className="w-4 h-4" />
      {config.text}
    </span>
  );
};

export default OrderStatusBadge;
