import { useState, useEffect } from "react";
import "../../lib/chart";
import { Line, Doughnut } from "react-chartjs-2";
import { lineOptions, doughnutOptions } from "../../lib/data";
import RecentOrders from "../RecentOrder";
import { metricsService, orderService } from "../../services";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await metricsService.getMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // Dynamic chart data based on metrics
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [30, 40, 35, 50, 49, 60],
        borderColor: "#ec4899",
        tension: 0.4,
        fill: false
      },
      {
        label: "Visits",
        data: [50, 60, 55, 70, 65, 80],
        borderColor: "#3b82f6",
        tension: 0.4,
        fill: false
      }
    ]
  };

  const doughnutData = {
    labels: ["Direct", "Social", "Referral"],
    datasets: [
      {
        data: [55, 25, 20],
        backgroundColor: ["#ec4899", "#3b82f6", "#10b981"]
      }
    ]
  };

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
        <ChartBox title="Visit And Sales Statistics">
          <Line data={lineData} options={lineOptions} />
        </ChartBox>

        <ChartBox title="Traffic Sources">
          <Doughnut data={doughnutData} options={doughnutOptions} />
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
