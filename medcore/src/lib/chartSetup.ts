import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend
)