import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Spinner } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface DistributionChartProps {
  kioscoTotal: number;
  pfTotal: number;
  loading: boolean;
}

const DistributionChart: React.FC<DistributionChartProps> = ({
  kioscoTotal,
  pfTotal,
  loading,
}) => {
  const data = {
    labels: ["Kiosco", "Pago Fácil"],
    datasets: [
      {
        data: [kioscoTotal, pfTotal],
        backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Distribución de Ganancia",
        font: {
          size: 16,
        },
      },
      datalabels: {
        color: "#fff",
        formatter: (value: number, ctx: any) => {
          const datasets = ctx.chart.data.datasets;
          if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
            const sum = datasets[0].data.reduce(
              (a: number, b: number) => a + b,
              0,
            );
            const percentage =
              sum > 0 ? ((value / sum) * 100).toFixed(1) + "%" : "0%";
            return percentage;
          } else {
            return "";
          }
        },
        font: {
          size: 14,
        },
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowBlur: 4,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw || 0;
            return ` $${value.toLocaleString("es-AR")}`;
          },
        },
      },
    },
    cutout: "60%",
  };

  return (
    <div className="card shadow-sm" style={{ height: "400px" }}>
      <div className="card-body">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div style={{ height: "100%" }}>
            {kioscoTotal === 0 && pfTotal === 0 ? (
              <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                No hay datos para este período
              </div>
            ) : (
              <Doughnut data={data} options={options} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributionChart;
