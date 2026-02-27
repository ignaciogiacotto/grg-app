import { Link } from "react-router-dom";
import {
  useCierresKioscoQuery,
  useDeleteCierreKioscoMutation,
} from "../../hooks/useCierreKioscoQuery";
import { formatDate } from "../../utils/formatters";
import { Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

interface ICierreKiosco {
  _id: string;
  date: string;
  totalCaja: number;
  totalCigarros: number;
  createdBy: { name: string };
}

export const CierreKioscoHistory = () => {
  const { data: history = [], isLoading } = useCierresKioscoQuery();
  const deleteMutation = useDeleteCierreKioscoMutation();

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, ¡bórralo!",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Cargando historial...</p>
      </div>
    );
  }

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
          {(history as unknown as ICierreKiosco[]).map((cierre) => (
            <tr key={cierre._id}>
              <td>{formatDate(cierre.date)}</td>
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
                  className="btn btn-danger"
                  disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending ? <Spinner size="sm" /> : <i className="bi bi-trash"></i>}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};