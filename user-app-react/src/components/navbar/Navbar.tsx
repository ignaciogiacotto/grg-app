import {
  Navbar as RBNavbar,
  Container,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../store/auth";
import Swal from "sweetalert2";

export const Navbar = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Estas seguro que deseas salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, salir!",
    });

    if (result.isConfirmed) {
      logout();
      navigate("/login");
    }
  };

  return (
    <RBNavbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <RBNavbar.Brand as={NavLink} to={user ? "/extractions" : "/login"}>
          {user ? `Bienvenid@ ${user.name}` : "Maxikiosco GRG"}
        </RBNavbar.Brand>
        <RBNavbar.Toggle aria-controls="basic-navbar-nav" />
        <RBNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {(user?.role === "role_admin" || user?.role === "role_manager") && (
              <>
                <NavLink className="nav-link" to="/dashboard">
                  Dashboard
                </NavLink>
                <NavLink className="nav-link" to="/cierre-kiosco">
                  Cierre Kiosco
                </NavLink>
                <NavLink className="nav-link" to="/cierre-pf">
                  Cierre PF
                </NavLink>
                <NavLink className="nav-link" to="/providers">
                  Pedidos
                </NavLink>
                <NavDropdown title="Historial" id="basic-nav-dropdown">
                  <NavDropdown.Item as={NavLink} to="/cierre-kiosco/history">
                    Historial Kiosco
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/cierre-pf/history">
                    Historial PF
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
            {(user?.role === "role_employee") && (
              <NavLink className="nav-link" to="/cierre-pf">
                Cierre PF
              </NavLink>
            )}
            {user && (
              <>
                <NavLink className="nav-link" to="/users">
                  Usuarios
                </NavLink>
                <NavLink className="nav-link" to="/calculator">
                  Calculadora
                </NavLink>
                <NavLink className="nav-link" to="/extractions">
                  Retiros
                </NavLink>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Salir
              </button>
            ) : (
              <NavLink className="nav-link" to="/login">
                Ingresar
              </NavLink>
            )}
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
};
