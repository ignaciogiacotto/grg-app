import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { useAuthContext } from "../../store/auth";
import {
  useCierreKioscoQuery,
  useCreateCierreKioscoMutation,
  useUpdateCierreKioscoMutation,
} from "./useCierreKioscoQuery";
import {
  cierreKioscoSchema,
  CierreKioscoInput,
} from "../../schemas/cierreKioscoSchema";

export const useCierreKioscoForm = (id?: string) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { data: cierreData, isLoading: isLoadingCierre } =
    useCierreKioscoQuery(id);
  const createMutation = useCreateCierreKioscoMutation();
  const updateMutation = useUpdateCierreKioscoMutation();

  const [isDiscountEnabled, setIsDiscountEnabled] = useState(true);
  const [discountPercentage, setDiscountPercentage] = useState(10);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CierreKioscoInput>({
    resolver: zodResolver(cierreKioscoSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      fac1: 0,
      fac2: 0,
      cyber: 0,
      cargVirt: 0,
      cigarros: {
        facturaB: { totalVenta: 0, ganancia: 0 },
        remito: { totalVenta: 0, ganancia: 0 },
      },
    },
  });

  const watchedFields = watch();

  const totalIngresos =
    (watchedFields.fac1 || 0) +
    (watchedFields.fac2 || 0) +
    (watchedFields.cyber || 0) +
    (watchedFields.cargVirt || 0);

  const discountAmount = isDiscountEnabled
    ? (totalIngresos * discountPercentage) / 100
    : 0;
  const totalCaja = totalIngresos - discountAmount;

  const costoFacturaB =
    (watchedFields.cigarros?.facturaB?.totalVenta || 0) -
    (watchedFields.cigarros?.facturaB?.ganancia || 0);
  const costoRemito =
    (watchedFields.cigarros?.remito?.totalVenta || 0) -
    (watchedFields.cigarros?.remito?.ganancia || 0);
  const totalCigarros = costoFacturaB + costoRemito;

  useEffect(() => {
    if (cierreData && cierreData.date) {
      const dateValue = new Date(cierreData.date);
      const formattedDate = !isNaN(dateValue.getTime())
        ? dateValue.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      reset({
        date: formattedDate,
        fac1: cierreData.fac1,
        fac2: cierreData.fac2,
        cyber: cierreData.cyber,
        cargVirt: cierreData.cargVirt,
        cigarros: {
          facturaB: {
            totalVenta: cierreData.cigarros.facturaB.totalVenta,
            ganancia: cierreData.cigarros.facturaB.ganancia,
          },
          remito: {
            totalVenta: cierreData.cigarros.remito.totalVenta,
            ganancia: cierreData.cigarros.remito.ganancia,
          },
        },
      });
    }
  }, [cierreData, reset]);

  const onFormSubmit: SubmitHandler<CierreKioscoInput> = async (data) => {
    const dataToSubmit = {
      ...data,
      totalCaja,
      totalCigarros,
      cigarros: {
        facturaB: { ...data.cigarros.facturaB, costo: costoFacturaB },
        remito: { ...data.cigarros.remito, costo: costoRemito },
      },
    };

    const result = await Swal.fire({
      title: id ? "¿Actualizar Cierre?" : "¿Guardar Cierre?",
      text: "¿Estás seguro de que quieres guardar este cierre?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
    });

    if (result.isConfirmed) {
      if (id) {
        updateMutation.mutate(
          { id, cierre: dataToSubmit as any },
          {
            onSuccess: () => {
              Swal.fire("¡Guardado!", "Actualizado exitosamente.", "success");
              navigate("/dashboard");
            },
            onError: (error: any) => {
              const msg =
                error.response?.data?.message || "Error al actualizar.";
              Swal.fire("Error", msg, "error");
            },
          },
        );
      } else {
        createMutation.mutate(dataToSubmit as any, {
          onSuccess: () => {
            Swal.fire("¡Guardado!", "Guardado exitosamente.", "success");
            navigate("/dashboard");
          },
          onError: (error: any) => {
            const msg = error.response?.data?.message || "Error al guardar.";
            Swal.fire("Error", msg, "error");
          },
        });
      }
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    errors,
    totalCaja,
    totalCigarros,
    isDiscountEnabled,
    discountPercentage,
    discountAmount,
    setIsDiscountEnabled,
    setDiscountPercentage,
    loading:
      isLoadingCierre || createMutation.isPending || updateMutation.isPending,
  };
};
