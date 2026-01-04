import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdShoppingCart, 
  MdPeople, 
  MdInventory,
  MdAttachMoney,
  MdBarChart,
  MdTrendingUp,
  MdTrendingDown
} from 'react-icons/md';
import AdminLayout from '../../components/AdminLayout';
import { getDashboardStats, getRecentOrders, getTopProducts } from '../../services/api';
import type { DashboardStats, RecentOrder, TopProduct } from '../../types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsData, ordersData, productsData] = await Promise.all([
        getDashboardStats(),
        getRecentOrders(5),
        getTopProducts(5)
      ]);
      
      setStats(statsData);
      setRecentOrders(ordersData);
      setTopProducts(productsData);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipping':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'shipping': 'Đang giao',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard" subtitle={`Chào mừng trở lại, ${currentUser.userName}!`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const statsCards = [
    { 
      title: 'Tổng đơn hàng', 
      value: formatNumber(stats?.totalOrders || 0),
      change: stats?.ordersGrowthPercentage || 0,
      icon: MdShoppingCart, 
      color: 'bg-blue-500',
    },
    { 
      title: 'Khách hàng', 
      value: formatNumber(stats?.totalCustomers || 0),
      change: stats?.customersGrowthPercentage || 0,
      icon: MdPeople, 
      color: 'bg-purple-500',
    },
    { 
      title: 'Doanh thu', 
      value: formatCurrency(stats?.totalRevenue || 0),
      change: stats?.revenueGrowthPercentage || 0,
      icon: MdAttachMoney, 
      color: 'bg-green-500',
    },
    { 
      title: 'Sản phẩm', 
      value: formatNumber(stats?.totalProducts || 0),
      change: stats?.productsGrowthPercentage || 0,
      icon: MdInventory, 
      color: 'bg-orange-500',
    },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle={`Chào mừng trở lại, ${currentUser.userName}!`}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Đơn hàng gần đây</h3>
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                Xem tất cả →
              </button>
            </div>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Chưa có đơn hàng nào</p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.orderID}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate('/admin/orders')}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">#{order.orderID}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.orderDate).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{formatCurrency(order.totalAmount)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Sản phẩm bán chạy</h3>
              <button
                onClick={() => navigate('/admin/products')}
                className="text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                Xem tất cả →
              </button>
            </div>
            <div className="space-y-3">
              {topProducts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Chưa có dữ liệu</p>
              ) : (
                topProducts.map((product, index) => (
                  <div
                    key={product.productID}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xl font-bold text-gray-600">
                      #{index + 1}
                    </div>
                    {product.imageURL && (
                      <img
                        src={product.imageURL}
                        alt={product.productName}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{product.productName}</p>
                      <p className="text-sm text-gray-600">Đã bán: {formatNumber(product.totalSold)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{formatCurrency(product.totalRevenue)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/admin/orders')}
              className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all duration-200"
            >
              <MdShoppingCart className="w-8 h-8 text-red-600" />
              <span className="font-medium text-gray-700">Quản lý đơn hàng</span>
            </button>
            <button
              onClick={() => navigate('/admin/products')}
              className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all duration-200"
            >
              <MdInventory className="w-8 h-8 text-red-600" />
              <span className="font-medium text-gray-700">Quản lý sản phẩm</span>
            </button>
            <button 
              onClick={() => navigate('/admin/customers')}
              className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all duration-200"
            >
              <MdPeople className="w-8 h-8 text-red-600" />
              <span className="font-medium text-gray-700">Quản lý khách hàng</span>
            </button>
            <button 
              onClick={() => navigate('/admin/reports')}
              className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all duration-200"
            >
              <MdBarChart className="w-8 h-8 text-red-600" />
              <span className="font-medium text-gray-700">Xem báo cáo</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
