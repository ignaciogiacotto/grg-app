import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../store/auth";
import { jwtDecode } from "jwt-decode";
import { login as loginService } from "../../services/authService";
import Swal from "sweetalert2";

export const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginService(username, password);
      if (data.token) {
        const decoded: {
          id: string;
          role: string;
          name: string;
          email: string;
          username: string;
        } = jwtDecode(data.token);
        const user = { ...decoded, _id: decoded.id };
        login(data.token, user);
        
        // Toast de bienvenida opcional
        Swal.fire({
          icon: 'success',
          title: `Bienvenido, ${user.name}`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        if (user.role === "role_admin" || user.role === "role_manager") {
          navigate("/dashboard");
        } else {
          navigate("/extractions");
        }
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError("Usuario o contraseña incorrectos");
      } else {
        setError("Ocurrió un error inesperado. Intente más tarde.");
        console.error("Login error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="mb-0 fw-bold">GRG App</h2>
              <small>Ingreso al sistema</small>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger text-center py-2" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-semibold">
                    Usuario
                  </label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-person"></i></span>
                    <input
                      type="text"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ingrese su usuario"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Contraseña
                  </label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input
                      type="password"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingrese su contraseña"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg shadow-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                    )}
                    {loading ? 'Ingresando...' : 'Ingresar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
