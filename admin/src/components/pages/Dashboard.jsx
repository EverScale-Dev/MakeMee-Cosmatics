import { useState, useEffect } from "react";
import "../../lib/chart";
import { Line, Doughnut } from "react-chartjs-2";
import { lineOptions, doughnutOptions } from "../../lib/data";
import RecentOrders from "../RecentOrder";
import { metricsService } from "../../services";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0
  });
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsData, chartsData] = await Promise.all([
          metricsService.getMetrics(),
          metricsService.getChartData()
        ]);
        setMetrics(metricsData);
        setChartData(chartsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Line chart data - Revenue & Orders by month
  const lineData = chartData ? {
    labels: chartData.monthlySales.labels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: chartData.monthlySales.revenue,
        borderColor: "#ec4899",
        tension: 0.4,
        fill: false,
        yAxisID: 'y'
      },
      {
        label: "Orders",
        data: chartData.monthlySales.orders,
        borderColor: "#3b82f6",
        tension: 0.4,
        fill: false,
        yAxisID: 'y1'
      }
    ]
  } : null;

  // Doughnut chart data - Orders by status
  const doughnutData = chartData ? {
    labels: Object.keys(chartData.ordersByStatus),
    datasets: [
      {
        data: Object.values(chartData.ordersByStatus),
        backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]
      }
    ]
  } : null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          gradient="from-pink-400 to-pink-500"
        />
        <StatCard
          title="Total Orders"
          value={metrics.totalOrders.toLocaleString()}
          gradient="from-blue-400 to-blue-500"
        />
        <StatCard
          title="Total Customers"
          value={metrics.totalCustomers.toLocaleString()}
          gradient="from-green-400 to-teal-400"
        />
        <StatCard
          title="Total Products"
          value={metrics.totalProducts.toLocaleString()}
          gradient="from-purple-400 to-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartBox title="Revenue & Orders (Last 6 Months)">
          {lineData ? (
            <Line data={lineData} options={{
              ...lineOptions,
              scales: {
                y: {
                  type: 'linear',
                  position: 'left',
                  title: { display: true, text: 'Revenue (₹)' }
                },
                y1: {
                  type: 'linear',
                  position: 'right',
                  title: { display: true, text: 'Orders' },
                  grid: { drawOnChartArea: false }
                }
              }
            }} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No data available
            </div>
          )}
        </ChartBox>

        <ChartBox title="Orders by Status">
          {doughnutData && Object.values(chartData.ordersByStatus).some(v => v > 0) ? (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No orders yet
            </div>
          )}
        </ChartBox>
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  );
}

function StatCard({ title, value, gradient }) {
  return (
    <div
      className={`rounded-xl p-6 text-white bg-gradient-to-r ${gradient} relative overflow-hidden`}
    >
      <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
      <p className="text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}

function ChartBox({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="h-[280px]">{children}</div>
    </div>
  );
}
