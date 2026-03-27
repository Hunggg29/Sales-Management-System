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
  MdAttachMoney,
  MdWarning,
  MdPrint,
  MdBarChart,
  MdAccountBalance,
  MdDashboard,
} from 'react-icons/md';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const AdminReportsPage = () => {
  const [report, setReport] = useState<DetailedReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'6' | '12'>('12');
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

      // Lọc các đơn hàng chưa thanh toán (đã được duyệt nhưng chưa thanh toán)
      const unpaid = data.filter(order => 
        order.payment && 
        order.payment.paymentStatus.toUpperCase() === 'UNPAID' &&
        ['APPROVED', 'SHIPPING', 'DELIVERED'].includes(order.status.toUpperCase())
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

  const totalPayableAmount = 0;

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

  const debtCard = { receivable: totalUnpaidAmount, payable: totalPayableAmount };

  const generateReport = (type: 'overview' | 'revenue' | 'debt') => {
    if (!report) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const fmt = (v: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
    const fmtNum = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

    const styles = `<style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Arial, sans-serif; font-size: 13px; color: #111; background: white; }
      .page { width: 21cm; min-height: 29.7cm; margin: 0 auto; padding: 1.5cm 1.5cm; }
      .header { text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 14px; margin-bottom: 20px; }
      .company { font-size: 13px; font-weight: 600; text-transform: uppercase; color: #555; letter-spacing: 1px; }
      .report-title { font-size: 22px; font-weight: 800; text-transform: uppercase; margin: 10px 0 4px; color: #dc2626; letter-spacing: 2px; }
      .report-date { font-size: 12px; color: #777; }
      h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #333; border-left: 4px solid #dc2626; padding-left: 10px; margin: 20px 0 12px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
      th { background: #dc2626; color: white; border: 1px solid #b91c1c; padding: 7px 10px; text-align: left; font-weight: 600; }
      td { border: 1px solid #e5e7eb; padding: 6px 10px; }
      tr:nth-child(even) td { background: #fafafa; }
      .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
      .stat-box { border: 2px solid #e5e7eb; border-radius: 8px; padding: 14px; text-align: center; }
      .stat-label { font-size: 11px; color: #6b7280; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
      .stat-value { font-size: 18px; font-weight: 800; }
      .red { color: #dc2626; } .green { color: #16a34a; } .blue { color: #2563eb; } .orange { color: #ea580c; }
      .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 12px; }
      .tr { text-align: right; } .tc { text-align: center; } .bold { font-weight: 700; }
      .sign-row { display: flex; justify-content: space-around; margin-top: 40px; }
      .sign-box { text-align: center; }
      .sign-label { font-size: 12px; font-weight: 600; text-transform: uppercase; }
      .sign-sub { font-size: 11px; color: #888; margin-bottom: 50px; }
      @media print { @page { size: A4; margin: 0; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { padding: 1.2cm; } }
    </style>`;

    const mkHeader = (title: string) =>
      `<div class="header"><div class="company">Hệ thống Quản lý Bán hàng</div><div class="report-title">${title}</div><div class="report-date">Ngày xuất: ${dateStr} lúc ${timeStr}</div></div>`;

    const signBlock =
      `<div class="sign-row"><div class="sign-box"><div class="sign-label">Người lập báo cáo</div><div class="sign-sub">(Độc lập, ký, ghi rõ họ tên)</div></div><div class="sign-box"><div class="sign-label">Giám đốc / Quản lý</div><div class="sign-sub">(Ký, đóng dấu)</div></div></div><div class="footer">Báo cáo được tạo tự động bởi Hệ thống Quản lý Bán hàng &middot; ${dateStr} ${timeStr}</div>`;

    let body = '';

    if (type === 'overview') {
      body = mkHeader('Báo cáo Tổng quan') +
        `<div class="stat-grid">
          <div class="stat-box"><div class="stat-label">Tổng doanh thu</div><div class="stat-value green">${fmt(report.overallStats?.totalRevenue || 0)}</div></div>
          <div class="stat-box"><div class="stat-label">Tổng đơn hàng</div><div class="stat-value blue">${fmtNum(report.overallStats?.totalOrders || 0)}</div></div>
          <div class="stat-box"><div class="stat-label">Tổng khách hàng</div><div class="stat-value blue">${fmtNum(report.overallStats?.totalCustomers || 0)}</div></div>
          <div class="stat-box"><div class="stat-label">Tổng sản phẩm</div><div class="stat-value blue">${fmtNum(report.overallStats?.totalProducts || 0)}</div></div>
          <div class="stat-box"><div class="stat-label">Công nợ phải thu</div><div class="stat-value red">${fmt(totalUnpaidAmount)}</div></div>
          <div class="stat-box"><div class="stat-label">Công nợ phải trả</div><div class="stat-value orange">${fmt(totalPayableAmount)}</div></div>
        </div>` +
        '<h2>Doanh thu theo tháng</h2>' +
        '<table><thead><tr><th class="tc">Tháng</th><th class="tr">Doanh thu</th><th class="tc">Số đơn hàng</th><th class="tr">Tăng trưởng</th></tr></thead><tbody>' +
        (report.monthlyRevenues || []).map((m, i, arr) => {
          const prev = i > 0 ? arr[i - 1].revenue : null;
          const growth = prev && prev > 0 ? ((m.revenue - prev) / prev * 100).toFixed(1) : null;
          const gc = growth !== null && parseFloat(growth) >= 0 ? 'green' : 'red';
          return `<tr><td class="tc">${m.monthName}</td><td class="tr bold">${fmt(m.revenue)}</td><td class="tc">${fmtNum(m.orderCount)}</td><td class="tr ${gc}">${growth !== null ? (parseFloat(growth) >= 0 ? '+' : '') + growth + '%' : '-'}</td></tr>`;
        }).join('') +
        '</tbody></table>' + signBlock;

    } else if (type === 'revenue') {
      const totalRev = (report.monthlyRevenues || []).reduce((s, m) => s + m.revenue, 0);
      const totalOrd = (report.monthlyRevenues || []).reduce((s, m) => s + m.orderCount, 0);
      let cum = 0;
      const monthRows = (report.monthlyRevenues || []).map(m => {
        cum += m.revenue;
        const pct = totalRev > 0 ? (m.revenue / totalRev * 100).toFixed(1) : '0';
        return `<tr><td class="tc">${m.monthName}</td><td class="tr bold">${fmt(m.revenue)}</td><td class="tc">${fmtNum(m.orderCount)}</td><td class="tr">${fmt(cum)}</td><td class="tr">${pct}%</td></tr>`;
      }).join('');
      const productRows = (report.topProducts || []).map((p, i) => {
        const pct = totalRev > 0 ? (p.totalRevenue / totalRev * 100).toFixed(1) : '0';
        return `<tr><td class="tc">${i + 1}</td><td class="bold">${p.productName}</td><td class="tc">${fmtNum(p.totalSold)}</td><td class="tr green bold">${fmt(p.totalRevenue)}</td><td class="tr">${pct}%</td></tr>`;
      }).join('');
      body = mkHeader('Báo cáo Doanh thu') +
        '<h2>Doanh thu theo tháng</h2>' +
        '<table><thead><tr><th class="tc">Tháng</th><th class="tr">Doanh thu</th><th class="tc">Số đơn</th><th class="tr">Doanh thu tích lũy</th><th class="tr">% trên tổng</th></tr></thead><tbody>' +
        monthRows +
        `<tr style="background:#fef2f2"><td class="bold">TỔNG CỘNG</td><td class="tr bold red">${fmt(totalRev)}</td><td class="tc bold">${fmtNum(totalOrd)}</td><td></td><td class="tc bold">100%</td></tr>` +
        '</tbody></table>' +
        '<h2>Top 10 sản phẩm bán chạy nhất</h2>' +
        '<table><thead><tr><th class="tc">#</th><th>Sản phẩm</th><th class="tc">Số lượng đã bán</th><th class="tr">Doanh thu</th><th class="tr">% doanh thu</th></tr></thead><tbody>' +
        productRows +
        '</tbody></table>' + signBlock;

    } else {
      const netSign = 'green';
      const debtRows = debtList.map((d, i) =>
        `<tr><td class="tc">${i + 1}</td><td class="bold">${d.customerName}</td><td class="tc">${d.orderCount}</td><td class="tr red bold">${fmt(d.totalDebt)}</td></tr>`
      ).join('');
      body = mkHeader('Báo cáo Công nợ') +
        `<div class="stat-grid">
          <div class="stat-box"><div class="stat-label">Tổng công nợ phải thu</div><div class="stat-value red">${fmt(totalUnpaidAmount)}</div></div>
          <div class="stat-box"><div class="stat-label">Số khách còn nợ</div><div class="stat-value blue">${fmtNum(debtList.length)}</div></div>
          <div class="stat-box"><div class="stat-label">Giá trị trung bình / khách</div><div class="stat-value ${netSign}">${fmt(debtList.length > 0 ? totalUnpaidAmount / debtList.length : 0)}</div></div>
        </div>` +
        '<h2>Công nợ phải thu (từ khách hàng)</h2>' +
        (debtList.length > 0
          ? '<table><thead><tr><th class="tc">#</th><th>Khách hàng</th><th class="tc">Số đơn chưa TT</th><th class="tr">Tổng nợ</th></tr></thead><tbody>' +
            debtRows +
            `<tr style="background:#fef2f2"><td colspan="3" class="bold">TỔNG CỘNG</td><td class="tr bold red">${fmt(totalUnpaidAmount)}</td></tr></tbody></table>`
          : '<p style="color:#888;text-align:center;padding:16px">Không có công nợ phải thu</p>') +
        signBlock;
    }

    const win = window.open('', '_blank', 'width=960,height=720');
    if (!win) { alert('Vui lòng cho phép popup để xuất báo cáo.'); return; }
    win.document.write(`<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><title>Báo cáo - ${dateStr}</title>${styles}</head><body><div class="page">${body}</div></body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 600);
  };

  return (
    <AdminLayout title="Báo cáo" subtitle="Phân tích chi tiết doanh thu và hiệu suất">
      <div className="space-y-6">
        {/* Export Report Buttons */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gray-700 p-2.5 rounded-lg">
              <MdPrint className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Xuất báo cáo</h3>
              <p className="text-sm text-gray-500">Tạo và in báo cáo dạng PDF phục vụ công tác quản lý</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => generateReport('overview')}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <MdDashboard className="w-5 h-5" />
              Báo cáo tổng quan
            </button>
            <button
              onClick={() => generateReport('revenue')}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <MdBarChart className="w-5 h-5" />
              Báo cáo doanh thu
            </button>
            <button
              onClick={() => generateReport('debt')}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <MdAccountBalance className="w-5 h-5" />
              Báo cáo công nợ
            </button>
          </div>
        </div>

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
          {/* Combined debt card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-orange-50 p-3 rounded-lg">
                <MdWarning className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-3">Công nợ</h3>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Phải thu</span>
                <span className="text-base font-bold text-red-600">{formatFullCurrency(debtCard.receivable)}</span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Phải trả</span>
                <span className="text-base font-bold text-blue-600">{formatFullCurrency(debtCard.payable)}</span>
              </div>
            </div>
          </div>
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

        {/* Công nợ Section */}
        {unpaidOrders.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-orange-500 p-3 rounded-lg">
                  <MdWarning className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Tổng hợp công nợ</h3>
                  <p className="text-sm text-gray-600">Công nợ phải thu từ khách hàng</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <p className="text-sm text-gray-500 mb-1">Phải thu (từ khách hàng)</p>
                  <p className="text-xl font-bold text-red-600">{formatFullCurrency(totalUnpaidAmount)}</p>
                  <p className="text-xs text-gray-400 mt-1">{unpaidOrders.length} đơn · {debtList.length} khách hàng</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-sm text-gray-500 mb-1">Giá trị trung bình / khách</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatFullCurrency(debtList.length > 0 ? totalUnpaidAmount / debtList.length : 0)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Dùng để ưu tiên thu hồi công nợ</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {debtList.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số đơn hàng</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng nợ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {debtList.map((debt, index) => (
                        <tr key={debt.customerId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-600 font-bold rounded-full">{index + 1}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-800">{debt.customerName}</div>
                            <div className="text-sm text-gray-500">ID: {debt.customerId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">{debt.orderCount} đơn</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-red-600 font-bold text-lg">{formatFullCurrency(debt.totalDebt)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <details className="cursor-pointer">
                              <summary className="text-blue-600 hover:text-blue-800 font-medium">Xem chi tiết ({debt.orders.length} đơn)</summary>
                              <div className="mt-2 space-y-2 ml-4">
                                {debt.orders.map(order => (
                                  <div key={order.orderID} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                                    <div>
                                      <span className="font-medium">Đơn #{order.orderID}</span>
                                      <span className="text-gray-500 ml-2">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                        order.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        order.status === 'SHIPPING' ? 'bg-purple-100 text-purple-800' :
                                        order.status === 'DELIVERED' ? 'bg-indigo-100 text-indigo-800' :
                                        order.status === 'COMPLETED' ? 'bg-green-600 text-white' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>{order.status}</span>
                                      <span className="font-semibold text-red-600">{formatFullCurrency(order.totalAmount)}</span>
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
              ) : (
                <div className="text-center py-12">
                  <MdWarning className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Không có công nợ phải thu</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
