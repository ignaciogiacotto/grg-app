import { useState } from "react";
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
  const [expanded, setExpanded] = useState(false);

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

  const closeNav = () => setExpanded(false);

  return (
    <RBNavbar bg="dark" variant="dark" expand="lg" expanded={expanded} onToggle={setExpanded}>
      <Container fluid>
        <RBNavbar.Brand as={NavLink} to={user ? "/extractions" : "/login"} onClick={closeNav}>
          {user ? `Bienvenid@ ${user.name}` : "Maxikiosco GRG"}
        </RBNavbar.Brand>
        <RBNavbar.Toggle aria-controls="basic-navbar-nav" />
        <RBNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {(user?.role === "role_admin" || user?.role === "role_manager") && (
              <>
                <NavLink className="nav-link" to="/dashboard" onClick={closeNav}>
                  Dashboard
                </NavLink>
                <NavLink className="nav-link" to="/cierre-kiosco" onClick={closeNav}>
                  Cierre Kiosco
                </NavLink>
                <NavLink className="nav-link" to="/cierre-pf" onClick={closeNav}>
                  Cierre PF
                </NavLink>
                <NavLink className="nav-link" to="/providers" onClick={closeNav}>
                  Pedidos
                </NavLink>
                <NavDropdown title="Historial" id="basic-nav-dropdown">
                  <NavDropdown.Item as={NavLink} to="/cierre-kiosco/history" onClick={closeNav}>
                    Historial Kiosco
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/cierre-pf/history" onClick={closeNav}>
                    Historial PF
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
            {(user?.role === "role_employee") && (
              <NavLink className="nav-link" to="/cierre-pf" onClick={closeNav}>
                Cierre PF
              </NavLink>
            )}
            {user && (
              <>
                <NavLink className="nav-link" to="/users" onClick={closeNav}>
                  Usuarios
                </NavLink>
                <NavLink className="nav-link" to="/calculator" onClick={closeNav}>
                  Calculadora
                </NavLink>
                <NavLink className="nav-link" to="/extractions" onClick={closeNav}>
                  Retiros
                </NavLink>
                <NavLink className="nav-link" to="/notes" onClick={closeNav}>
                  Notas
                </NavLink>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <button className="btn btn-outline-light" onClick={() => { closeNav(); handleLogout(); }}>
                Salir
              </button>
            ) : (
              <NavLink className="nav-link" to="/login" onClick={closeNav}>
                Ingresar
              </NavLink>
            )}
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
};
