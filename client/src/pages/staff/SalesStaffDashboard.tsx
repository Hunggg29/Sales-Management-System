import { useState, useEffect } from 'react';
import { MdPeople, MdShoppingCart, MdTrendingUp, MdPayment, MdWarning } from 'react-icons/md';
import SalesStaffLayout from '../../components/SalesStaffLayout';
import { getAllCustomers, getAllOrders } from '../../services/api';
import type { Order } from '../../types';

const SalesStaffDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [unpaidOrders, setUnpaidOrders] = useState<Order[]>([]);
  const [totalDebt, setTotalDebt] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [customers, orders] = await Promise.all([
        getAllCustomers(),
        getAllOrders(),
      ]);

      // Lọc các đơn hàng chưa thanh toán
      const unpaid = orders.filter(order => 
        order.payment && 
        order.payment.paymentStatus.toUpperCase() === 'UNPAID' &&
        ['APPROVED', 'PROCESSING', 'SHIPPING', 'COMPLETED'].includes(order.status.toUpperCase())
      );
      setUnpaidOrders(unpaid);

      // Tính tổng công nợ
      const debt = unpaid.reduce((sum, order) => sum + order.totalAmount, 0);
      setTotalDebt(debt);

      setStats({
        totalCustomers: customers.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => ['PENDING', 'APPROVED'].includes(o.status)).length,
        completedOrders: orders.filter(o => o.status === 'COMPLETED').length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  // Nhóm công nợ theo khách hàng
  const debtByCustomer = unpaidOrders.reduce((acc, order) => {
    const customerId = order.customer?.customerID || 0;
    const customerName = order.customer?.fullName || 'Khách vãng lai';
    
    if (!acc[customerId]) {
      acc[customerId] = {
        customerId,
        customerName,
        totalDebt: 0,
        orderCount: 0,
        orders: []
      };
    }
    
    acc[customerId].totalDebt += order.totalAmount;
    acc[customerId].orderCount += 1;
    acc[customerId].orders.push(order);
    
    return acc;
  }, {} as Record<number, { customerId: number; customerName: string; totalDebt: number; orderCount: number; orders: Order[] }>);

  const debtList = Object.values(debtByCustomer).sort((a, b) => b.totalDebt - a.totalDebt);

  const statCards = [
    {
      title: 'Tổng khách hàng',
      value: stats.totalCustomers,
      icon: MdPeople,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      isNumber: true,
    },
    {
      title: 'Tổng đơn hàng',
      value: stats.totalOrders,
      icon: MdShoppingCart,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
      isNumber: true,
    },
    {
      title: 'Đơn đang xử lý',
      value: stats.pendingOrders,
      icon: MdTrendingUp,
      color: 'bg-yellow-500',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      isNumber: true,
    },
    {
      title: 'Công nợ phải thu',
      value: totalDebt,
      icon: MdWarning,
      color: 'bg-red-500',
      bgLight: 'bg-red-50',
      textColor: 'text-red-600',
      isNumber: false,
    },
  ];

  if (isLoading) {
    return (
      <SalesStaffLayout title="Tổng quan">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </SalesStaffLayout>
    );
  }

  return (
    <SalesStaffLayout title="Tổng quan">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Xin chào!</h2>
          <p className="text-blue-100">Quản lý khách hàng và đơn hàng hiệu quả</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgLight}`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {stat.isNumber ? stat.value : formatCurrency(stat.value as number)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/staff/customers"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <MdPeople className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Quản lý khách hàng</p>
                <p className="text-sm text-gray-600">Xem và quản lý khách hàng</p>
              </div>
            </a>
            <a
              href="/staff/orders"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <MdShoppingCart className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">Quản lý đơn hàng</p>
                <p className="text-sm text-gray-600">Xem và xử lý đơn hàng</p>
              </div>
            </a>
            <a
              href="/staff/payments"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <MdPayment className="w-6 h-6 text-purple-600" />
              <div>
                <p className="font-semibold text-gray-900">Thanh toán</p>
                <p className="text-sm text-gray-600">Quản lý thanh toán</p>
              </div>
            </a>
          </div>
        </div>

        {/* Công nợ phải thu */}
        {unpaidOrders.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-md p-6 border-2 border-yellow-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <MdWarning className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Công nợ phải thu</h3>
                <p className="text-sm text-gray-600">Các đơn hàng đã duyệt nhưng chưa thanh toán</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Tổng công nợ</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Số đơn chưa thanh toán</p>
                <p className="text-2xl font-bold text-orange-600">{formatNumber(unpaidOrders.length)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Khách hàng còn nợ</p>
                <p className="text-2xl font-bold text-yellow-600">{formatNumber(debtList.length)}</p>
              </div>
            </div>

            {/* Danh sách khách hàng còn nợ */}
            {debtList.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Danh sách khách hàng còn nợ</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Khách hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số đơn hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tổng nợ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chi tiết
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {debtList.map((debt, index) => (
                        <tr key={debt.customerId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-600 font-bold rounded-full">
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-800">{debt.customerName}</div>
                            <div className="text-sm text-gray-500">ID: {debt.customerId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                              {debt.orderCount} đơn
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-red-600 font-bold text-lg">{formatCurrency(debt.totalDebt)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <details className="cursor-pointer">
                              <summary className="text-blue-600 hover:text-blue-800 font-medium">
                                Xem chi tiết ({debt.orders.length} đơn)
                              </summary>
                              <div className="mt-2 space-y-2 ml-4">
                                {debt.orders.map(order => (
                                  <div key={order.orderID} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                                    <div>
                                      <span className="font-medium">Đơn #{order.orderID}</span>
                                      <span className="text-gray-500 ml-2">
                                        {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                        order.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'SHIPPING' ? 'bg-purple-100 text-purple-800' :
                                        order.status === 'COMPLETED' ? 'bg-green-600 text-white' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {order.status}
                                      </span>
                                      <span className="font-semibold text-red-600">
                                        {formatCurrency(order.totalAmount)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </SalesStaffLayout>
  );
};

export default SalesStaffDashboard;
