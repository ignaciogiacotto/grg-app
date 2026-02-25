import { useParams } from "react-router-dom";
import { useUserForm } from "../../hooks/useUserForm";

export const UserForm = () => {
  const { id } = useParams<{ id?: string }>();
  const {
    name,
    setName,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    isEditing,
    loggedInUser,
    handleSubmit,
    navigate,
  } = useUserForm(id);

  return (
    <div className="container">
      <h2>{isEditing ? "Editar Usuario" : "Crear Usuario"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!isEditing}
          />
        </div>
        {(loggedInUser?.role === "role_admin" ||
          loggedInUser?.role === "role_manager") && (
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              id="role"
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}>
              <option value="role_employee">Employee</option>
              <option value="role_manager">Manager</option>
              {loggedInUser?.role === "role_admin" && (
                <option value="role_admin">Admin</option>
              )}
            </select>
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/users")}>
          Cancelar
        </button>
      </form>
    </div>
  );
};
