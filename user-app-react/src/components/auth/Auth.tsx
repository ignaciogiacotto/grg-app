import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../store/auth';
import { jwtDecode } from 'jwt-decode';
import { login as loginService } from '../../services/authService';

export const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const data = await loginService(username, password);
      if (data.token) {
        const decoded: { id: string, role: string, name: string, email: string, username: string } = jwtDecode(data.token);
        const user = { ...decoded, _id: decoded.id };
        login(data.token, user);
        if (user.role === 'role_admin' || user.role === 'role_manager') {
          navigate('/dashboard');
        } else {
          navigate('/extractions'); // Navigate to user list for other roles
        }
      } else {
        alert('Credenciales invalidas');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      alert('Error durante el login');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2>Ingreso al sistema</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Usuario</label>
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
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Ingresar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};