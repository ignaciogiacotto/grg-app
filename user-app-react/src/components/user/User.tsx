import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../store/auth";
import { getUsers, deleteUser } from "../../services/userService";
import { usePaginatedData } from "../../hooks/usePaginatedData";

interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  password?: string;
}

const formatRole = (role: string) => {
  switch (role) {
    case "role_admin":
      return "Dueño";
    case "role_manager":
      return "Encargado";
    case "role_employee":
      return "Empleado";
    default:
      return role;
  }
};

export const User = () => {
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuthContext();
  const { data: users, totalPages, handleDelete } = usePaginatedData<IUser>(
    getUsers,
    deleteUser
  );

  return (
    <div className="container">
      <h2>Listado de Usuarios</h2>
      <div className="mb-3">
        {(loggedInUser?.role === "role_admin" ||
          loggedInUser?.role === "role_manager") && (
          <button
            className="btn btn-success"
            onClick={() => navigate("/users/create")}>
            Crear Usuario
          </button>
        )}
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Email</th>
            {loggedInUser?.role === "role_admin" && <th>Rol</th>}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              {loggedInUser?.role === "role_admin" && (
                <td>{formatRole(user.role)}</td>
              )}
              <td>
                {loggedInUser?.role === "role_admin" && (
                  <>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => navigate(`/users/edit/${user._id}`)}
                      disabled={user.role === "role_admin"}>
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(user._id)}
                      disabled={user.role === "role_admin"}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from(Array(totalPages).keys()).map((p) => (
          <Link
            key={p}
            to={`/users/page/${p}`}
            className="btn btn-primary me-1">
            {p + 1}
          </Link>
        ))}
      </div>
    </div>
  );
};
