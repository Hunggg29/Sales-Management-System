import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getDetailedReport, getAllOrders } from '../../services/api';
import type { DetailedReport, Order } from '../../types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  MdShoppingCart,
  MdPeople,
  MdInventory,
  MdAttachMoney,
  MdWarning
} from 'react-icons/md';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const AdminReportsPage = () => {
  const [report, setReport] = useState<DetailedReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'6' | '12'>('12');
  const [orders, setOrders] = useState<Order[]>([]);
  const [unpaidOrders, setUnpaidOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchReport();
    fetchOrders();
  }, []);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const data = await getDetailedReport();
      setReport(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
      
      // Lọc các đơn hàng chưa thanh toán (đã được duyệt nhưng chưa thanh toán)
      const unpaid = data.filter(order => 
        order.payment && 
        order.payment.paymentStatus.toUpperCase() === 'UNPAID' &&
        ['APPROVED', 'PROCESSING', 'SHIPPING', 'COMPLETED'].includes(order.status.toUpperCase())
      );
      setUnpaidOrders(unpaid);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value);
  };

  const formatFullCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Báo cáo" subtitle="Phân tích chi tiết doanh thu và hiệu suất">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!report) {
    return (
      <AdminLayout title="Báo cáo" subtitle="Phân tích chi tiết doanh thu và hiệu suất">
        <div className="text-center py-12">
          <p className="text-gray-500">Không thể tải dữ liệu báo cáo</p>
        </div>
      </AdminLayout>
    );
  }

  // Lọc dữ liệu theo period
  const filteredMonthlyData = selectedPeriod === '6' 
    ? (report.monthlyRevenues || []).slice(-6)
    : (report.monthlyRevenues || []);

  // Chuẩn bị dữ liệu cho biểu đồ tròn
  const pieData = (report.topProducts || []).slice(0, 5).map(product => ({
    name: product.productName,
    value: product.totalRevenue
  }));

  // Tính tổng công nợ phải thu
  const totalUnpaidAmount = unpaidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

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

  const stats = [
    {
      title: 'Tổng doanh thu',
      value: formatFullCurrency(report.overallStats?.totalRevenue || 0),
      change: report.overallStats?.revenueGrowthPercentage || 0,
      icon: MdAttachMoney,
      color: 'bg-green-500'
    },
    {
      title: 'Công nợ phải thu',
      value: formatFullCurrency(totalUnpaidAmount),
      change: 0,
      icon: MdWarning,
      color: 'bg-yellow-500'
    },
    {
      title: 'Tổng đơn hàng',
      value: formatNumber(report.overallStats?.totalOrders || 0),
      change: report.overallStats?.ordersGrowthPercentage || 0,
      icon: MdShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Khách hàng',
      value: formatNumber(report.overallStats?.totalCustomers || 0),
      change: report.overallStats?.customersGrowthPercentage || 0,
      icon: MdPeople,
      color: 'bg-purple-500'
    }
  ];

  return (
    <AdminLayout title="Báo cáo" subtitle="Phân tích chi tiết doanh thu và hiệu suất">
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
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

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Doanh thu theo tháng</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPeriod('6')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === '6'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                6 tháng
              </button>
              <button
                onClick={() => setSelectedPeriod('12')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === '12'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                12 tháng
              </button>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="monthName" 
                tick={{ fill: '#6b7280' }}
                tickLine={{ stroke: '#6b7280' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280' }}
                tickLine={{ stroke: '#6b7280' }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip 
                formatter={(value: number | undefined) => value ? formatFullCurrency(value) : '0₫'}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Doanh thu"
                dot={{ fill: '#ef4444', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders Bar Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Số lượng đơn hàng</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="monthName" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="orderCount" fill="#3b82f6" name="Số đơn hàng" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products Pie Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Doanh thu theo sản phẩm</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number | undefined) => value ? formatFullCurrency(value) : '0₫'} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Top 10 sản phẩm bán chạy nhất</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đã bán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(report.topProducts || []).map((product, index) => (
                  <tr key={product.productID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 font-bold rounded-full">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.imageURL && (
                          <img
                            src={product.imageURL}
                            alt={product.productName}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <span className="font-medium text-gray-800">{product.productName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900 font-medium">{formatNumber(product.totalSold)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-green-600 font-bold">{formatFullCurrency(product.totalRevenue)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Công nợ phải thu Section */}
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
              <p className="text-2xl font-bold text-red-600">{formatFullCurrency(totalUnpaidAmount)}</p>
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
                          <span className="text-red-600 font-bold text-lg">{formatFullCurrency(debt.totalDebt)}</span>
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
                                      {formatFullCurrency(order.totalAmount)}
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

          {debtList.length === 0 && (
            <div className="bg-white rounded-lg p-8 shadow-sm text-center">
              <MdWarning className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Không có công nợ phải thu</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
