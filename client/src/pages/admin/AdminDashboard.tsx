import { useNavigate } from 'react-router-dom';
import { 
  MdShoppingCart, 
  MdPeople, 
  MdInventory,
  MdAttachMoney,
  MdBarChart
} from 'react-icons/md';
import AdminLayout from '../../components/AdminLayout';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const statsCards = [
    { 
      title: 'Tổng đơn hàng', 
      value: '1,234', 
      change: '+12.5%', 
      icon: MdShoppingCart, 
      color: 'bg-blue-500',
      changeColor: 'text-green-600'
    },
    { 
      title: 'Khách hàng', 
      value: '567', 
      change: '+8.2%', 
      icon: MdPeople, 
      color: 'bg-purple-500',
      changeColor: 'text-green-600'
    },
    { 
      title: 'Doanh thu', 
      value: '₫45.2M', 
      change: '+23.1%', 
      icon: MdAttachMoney, 
      color: 'bg-green-500',
      changeColor: 'text-green-600'
    },
    { 
      title: 'Sản phẩm', 
      value: '89', 
      change: '+5.3%', 
      icon: MdInventory, 
      color: 'bg-orange-500',
      changeColor: 'text-green-600'
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
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-semibold ${stat.changeColor}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-2">
            Chào mừng đến với Admin Dashboard! 🎉
          </h3>
          <p className="text-red-100 mb-4">
            Đây là trang quản trị cho hệ thống Sales Management. Bạn có thể quản lý đơn hàng, 
            khách hàng, sản phẩm và nhiều tính năng khác.
          </p>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors">
              Bắt đầu
            </button>
            <button className="px-6 py-2 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition-colors">
              Tìm hiểu thêm
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all duration-200">
              <MdShoppingCart className="w-8 h-8 text-red-600" />
              <span className="font-medium text-gray-700">Đơn hàng mới</span>
            </button>
            <button
              onClick={() => navigate('/admin/products')}
              className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all duration-200"
            >
              <MdInventory className="w-8 h-8 text-red-600" />
              <span className="font-medium text-gray-700">Thêm sản phẩm</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all duration-200">
              <MdPeople className="w-8 h-8 text-red-600" />
              <span className="font-medium text-gray-700">Khách hàng</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all duration-200">
              <MdBarChart className="w-8 h-8 text-red-600" />
              <span className="font-medium text-gray-700">Báo cáo</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
