import { Link } from "react-router-dom";
import { useDataFetcher } from "../../hooks/useDataFetcher";
import cierrePfService from "../../services/cierrePfService";

interface ICierrePf {
  _id: string;
  date: string;
  totalGanancia: number;
}

const CierrePfHistory = () => {
  const { data: history, handleDelete } = useDataFetcher<ICierrePf>(
    cierrePfService.getCierresPf,
    cierrePfService.deleteCierrePf
  );

  return (
    <div className="container mt-5">
      <h2>Historial de Cierres PF</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Ganancia Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {history.map((cierre) => (
            <tr key={cierre._id}>
              <td>{new Date(cierre.date).toLocaleDateString()}</td>
              <td>$ {cierre.totalGanancia}</td>
              <td>
                <Link
                  to={`/cierre-pf/edit/${cierre._id}`}
                  className="btn btn-warning me-2">
                  <i className="bi bi-pencil-square"></i>
                </Link>
                <button
                  onClick={() => handleDelete(cierre._id)}
                  className="btn btn-danger">
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CierrePfHistory;
