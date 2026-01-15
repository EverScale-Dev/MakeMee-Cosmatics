import "../../lib/chart"; // make sure this is imported once
import { Line , Doughnut } from "react-chartjs-2";
import {
  lineData,
  lineOptions,
  doughnutData,
  doughnutOptions,
} from "../../lib/data";
import RecentOrders from "../RecentOrder";



export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Weekly Sales"
          value="$15,000"
          note="Increased by 60%"
          gradient="from-pink-400 to-pink-500"
        />
        <StatCard
          title="Weekly Orders"
          value="45,634"
          note="Decreased by 10%"
          gradient="from-blue-400 to-blue-500"
        />
        <StatCard
          title="Visitors Online"
          value="95,574"
          note="Increased by 5%"
          gradient="from-green-400 to-teal-400"
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




function StatCard({ title, value, note, gradient }) {
  return (
    <div
      className={`rounded-xl p-6 text-white bg-gradient-to-r ${gradient} relative overflow-hidden`}
    >
      <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
      <p className="text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
      <p className="text-xs mt-2 opacity-90">{note}</p>
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
