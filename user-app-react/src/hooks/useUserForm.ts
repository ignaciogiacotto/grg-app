import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthContext } from "../store/auth";
import {
  getUserById,
  createUser,
  updateUser,
  IUser,
} from "../services/userService";

export const useUserForm = (id?: string) => {
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuthContext();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("role_employee");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchUser = async () => {
        try {
          const data = await getUserById(id);
          setName(data.name);
          setUsername(data.username);
          setEmail(data.email);
          setRole(data.role);
        } catch (error) {
          console.error("Error fetching user:", error);
          Swal.fire("Error", "No se pudo cargar el usuario.", "error");
        }
      };
      fetchUser();
    } else {
      setIsEditing(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditing) {
      if (loggedInUser?.role !== "role_admin") {
        navigate("/users");
      }
    } else {
      if (
        loggedInUser?.role !== "role_admin" &&
        loggedInUser?.role !== "role_manager"
      ) {
        navigate("/users");
      }
    }
  }, [loggedInUser, isEditing, navigate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const user: IUser = { name, username, email, role };
    if (password) {
      user.password = password;
    }

    Swal.fire({
      title: isEditing
        ? "¿Estás seguro de que quieres editar este usuario?"
        : "¿Estás seguro de que quieres crear este usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isEditing ? "Sí, editar!" : "Sí, crear!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (isEditing && id) {
            await updateUser(id, user);
          } else {
            await createUser(user);
          }
          Swal.fire(
            "¡Guardado!",
            "El usuario ha sido guardado.",
            "success"
          );
          navigate("/users");
        } catch (error) {
          Swal.fire("Error!", "No se pudo guardar el usuario.", "error");
          console.error("Failed to save user:", error);
        }
      }
    });
  };

  return {
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
  };
};