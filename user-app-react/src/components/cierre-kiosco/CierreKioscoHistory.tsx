import { Link } from "react-router-dom";
import { useDataFetcher } from "../../hooks/useDataFetcher";
import {
  getCierresKiosco,
  deleteCierreKiosco,
} from "../../services/cierreKioscoService";

interface ICierreKiosco {
  _id: string;
  date: string;
  totalCaja: number;
  totalCigarros: number;
  createdBy: { name: string };
}

export const CierreKioscoHistory = () => {
  const { data: history, handleDelete } = useDataFetcher<ICierreKiosco>(
    getCierresKiosco,
    deleteCierreKiosco
  );

  return (
    <div className="container mt-5">
      <h2>Historial de Cierres de Kiosco</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Total Caja</th>
            <th>Total Cigarros (Costo)</th>
            <th>Creado por</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {history.map((cierre) => (
            <tr key={cierre._id}>
              <td>{new Date(cierre.date).toLocaleDateString()}</td>
              <td>$ {cierre.totalCaja}</td>
              <td>$ {cierre.totalCigarros}</td>
              <td>{cierre.createdBy?.name}</td>
              <td>
                <Link
                  to={`/cierre-kiosco/edit/${cierre._id}`}
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