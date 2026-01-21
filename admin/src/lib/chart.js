import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);
