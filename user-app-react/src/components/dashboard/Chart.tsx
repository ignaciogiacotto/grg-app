import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Spinner } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  chartData: any; // Replace with a more specific type if available
  loading: boolean;
  error: string | null;
}

const Chart: React.FC<ChartProps> = ({ chartData, loading, error }) => {
  const options = {
    plugins: { title: { display: false } },
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { stacked: true }, y: { stacked: true } },
  };

  return (
    <div className="card shadow-sm" style={{ height: "400px" }}>
      <div className="card-body">
        {loading && (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" variant="primary" />
            <span className="ms-2">Cargando gráfico...</span>
          </div>
        )}
        {error && <div className="alert alert-danger mb-0">{error}</div>}
        {!loading && !error && (
          <div style={{ height: "100%" }}>
            <Bar options={options} data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;
