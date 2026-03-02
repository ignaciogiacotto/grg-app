import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { useAuthContext } from "../../store/auth";
import {
  getUserById,
  createUser,
  updateUser,
} from "../../services/userService";
import { userSchema, UserInput } from "../../schemas/userSchema";

export const useUserForm = (id?: string) => {
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      role: "role_employee",
    },
  });

  const loadUser = useCallback(async (userId: string) => {
    try {
      const data = await getUserById(userId);
      reset({
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.role as any,
        password: "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      Swal.fire("Error", "No se pudo cargar el usuario.", "error");
    }
  }, [reset]);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadUser(id);
    } else {
      setIsEditing(false);
      reset({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "role_employee",
      });
    }
  }, [id, loadUser, reset]);

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

  const onFormSubmit: SubmitHandler<UserInput> = (data) => {
    const userToSave = { ...data };
    
    // Si estamos editando y el password está vacío, lo eliminamos
    if (isEditing && !userToSave.password) {
      delete userToSave.password;
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
            await updateUser(id, userToSave as any);
          } else {
            await createUser(userToSave as any);
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
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    errors,
    isEditing,
    loggedInUser,
    navigate,
    setValue,
  };
};
