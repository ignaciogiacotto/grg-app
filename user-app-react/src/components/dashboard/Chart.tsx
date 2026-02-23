import React from "react";
import { Bar } from "react-chartjs-2";
import { Spinner } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

interface ChartProps {
  chartData: any; // Replace with a more specific type if available
  loading: boolean;
  error: string | null;
}

const Chart: React.FC<ChartProps> = ({ chartData, loading, error }) => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Historial de Ganancias Diarias",
        font: {
          size: 16,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            size: 12,
          },
        },
      },
      datalabels: {
        color: "#444",
        anchor: "end" as const,
        align: "top" as const,
        offset: 5,
        formatter: (value: number, ctx: any) => {
          // Solo mostramos la etiqueta en el último dataset para ver el total acumulado
          const datasets = ctx.chart.data.datasets;
          if (ctx.datasetIndex === datasets.length - 1) {
            const sum = datasets.reduce(
              (acc: number, ds: any) => acc + ds.data[ctx.dataIndex],
              0,
            );
            return sum > 0 ? `$${sum.toLocaleString("es-AR")}` : "";
          } else {
            return "";
          }
        },
        font: {
          size: 11,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.raw || 0;
            return ` ${label}: $${value.toLocaleString("es-AR")}`;
          },
          footer: (tooltipItems: any) => {
            const sum = tooltipItems.reduce(
              (acc: number, item: any) => acc + item.raw,
              0,
            );
            return `TOTAL: $${sum.toLocaleString("es-AR")}`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `$${value.toLocaleString("es-AR")}`,
        },
      },
    },
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
