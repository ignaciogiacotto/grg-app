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
  period?: string;
}

const Chart: React.FC<ChartProps> = ({ chartData, loading, error, period }) => {
  const numLabels = chartData?.labels?.length || 0;
  const isCompact = numLabels > 15;

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Historial de Ganancias",
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
        offset: isCompact ? 12 : 5,
        rotation: isCompact ? -90 : 0,
        formatter: (value: number, ctx: any) => {
          // Solo mostramos la etiqueta en el último dataset para ver el total acumulado
          const datasets = ctx.chart.data.datasets;
          if (ctx.datasetIndex === datasets.length - 1) {
            const sum = datasets.reduce(
              (acc: number, ds: any) => acc + ds.data[ctx.dataIndex],
              0,
            );
            // Redondeamos al entero más cercano para evitar decimales en el gráfico
            return sum > 0 ? `$${Math.round(sum).toLocaleString("es-AR")}` : "";
          } else {
            return "";
          }
        },
        font: {
          size: isCompact ? 9 : 11,
        },
        clip: false, // Permitir que las etiquetas se salgan del área del gráfico si es necesario
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
    layout: {
      padding: {
        top: isCompact ? 40 : 10, // Más espacio arriba para las etiquetas rotadas
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          maxRotation: isCompact ? 90 : 45,
          minRotation: isCompact ? 45 : 0,
          font: {
            size: isCompact ? 10 : 12,
          },
        },
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
