import { useParams } from "react-router-dom";
import { useUserForm } from "../../hooks/users/useUserForm";

export const UserForm = () => {
  const { id } = useParams<{ id?: string }>();
  const { register, handleSubmit, errors, isEditing, loggedInUser, navigate } =
    useUserForm(id);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">
            {isEditing ? "Editar Usuario" : "Crear Usuario"}
          </h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                id="name"
                {...register("name")}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                id="username"
                {...register("username")}
              />
              {errors.username && (
                <div className="invalid-feedback">
                  {errors.username.message}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                id="email"
                {...register("email")}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password {isEditing && "(dejar en blanco para no cambiar)"}
              </label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                id="password"
                {...register("password")}
              />
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>
            {(loggedInUser?.role === "role_admin" ||
              loggedInUser?.role === "role_manager") && (
              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <select
                  id="role"
                  className={`form-select ${errors.role ? "is-invalid" : ""}`}
                  {...register("role")}>
                  <option value="role_employee">Employee</option>
                  <option value="role_manager">Manager</option>
                  {loggedInUser?.role === "role_admin" && (
                    <option value="role_admin">Admin</option>
                  )}
                </select>
                {errors.role && (
                  <div className="invalid-feedback">{errors.role.message}</div>
                )}
              </div>
            )}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/users")}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditing ? "Guardar cambios" : "Crear Usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
