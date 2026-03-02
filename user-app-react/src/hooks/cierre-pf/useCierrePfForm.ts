import { useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import {
  useCierrePfQuery,
  useBoletasEspecialesQuery,
  useCreateCierrePfMutation,
  useUpdateCierrePfMutation,
  useUpdateBoletaEspecialMutation,
  useCreateBoletaEspecialMutation,
} from "./useCierrePfQuery";
import { cierrePfSchema, CierrePfInput } from "../../schemas/cierrePfSchema";

export const useCierrePfForm = (id?: string) => {
  const navigate = useNavigate();
  const initialized = useRef(false);

  const { data: boletasDB = [] } = useBoletasEspecialesQuery();
  const { data: cierreData, isLoading: isLoadingCierre } = useCierrePfQuery(id);
  const createMutation = useCreateCierrePfMutation();
  const updateMutation = useUpdateCierrePfMutation();
  const updateBoletaMutation = useUpdateBoletaEspecialMutation();
  const createBoletaMutation = useCreateBoletaEspecialMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CierrePfInput>({
    resolver: zodResolver(cierrePfSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      boletasEspeciales: [],
      cantidadTotalBoletas: 0,
      recargas: 0,
      recargasSubtotal: 0,
      westernUnionQuantity: 0,
    },
    mode: "onChange", // Validar y observar en cada cambio
  });

  const { fields } = useFieldArray({
    control,
    name: "boletasEspeciales",
  });

  // Observadores específicos para cálculos reactivos
  const watchedBoletas = useWatch({ control, name: "boletasEspeciales" }) || [];
  const watchedRecargas = useWatch({ control, name: "recargas" }) || 0;
  const watchedCantTotal =
    useWatch({ control, name: "cantidadTotalBoletas" }) || 0;
  const watchedWUQuantity =
    useWatch({ control, name: "westernUnionQuantity" }) || 0;
  const watchedRecargasSubtotal =
    useWatch({ control, name: "recargasSubtotal" }) || 0;

  const wuBoleta = boletasDB.find((b) => b.name === "Western Union Value");
  const vfnBoleta = boletasDB.find((b) => b.name === "Valor Factura Normal");
  const westernUnionValue = wuBoleta?.value || 0;
  const valorFacturaNormal = vfnBoleta?.value || 100;

  // Contador de boletas (Especiales + Recargas) - AHORA REALMENTE REACTIVO
  const totalBoletasEspeciales = useMemo(() => {
    const cantEspeciales = watchedBoletas.reduce(
      (acc, b) => acc + (Number(b?.quantity) || 0),
      0,
    );
    return cantEspeciales + (Number(watchedRecargas) || 0);
  }, [watchedBoletas, watchedRecargas]);

  const subtotalBoletasEspeciales = useMemo(() => {
    return watchedBoletas.reduce(
      (acc, b) => acc + (Number(b?.quantity) || 0) * (Number(b?.value) || 0),
      0,
    );
  }, [watchedBoletas]);

  const cantidadBoletasNormales = Math.max(
    0,
    (Number(watchedCantTotal) || 0) - totalBoletasEspeciales,
  );
  const subtotalBoletasNormales = cantidadBoletasNormales * valorFacturaNormal;
  const subtotalWesternUnion =
    (Number(watchedWUQuantity) || 0) * westernUnionValue;

  const totalGanancia =
    subtotalBoletasNormales +
    subtotalBoletasEspeciales +
    (Number(watchedRecargasSubtotal) || 0) +
    subtotalWesternUnion;

  useEffect(() => {
    if (boletasDB.length > 0 && !initialized.current) {
      if (id && !cierreData) return;

      const otherBoletas = boletasDB
        .filter(
          (b) =>
            b.name !== "Western Union Value" &&
            b.name !== "Valor Factura Normal",
        )
        .sort(
          (a, b) =>
            (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name),
        );

      const boletasArray = otherBoletas.map((b) => {
        const savedBoleta = cierreData?.boletasEspeciales?.find(
          (be: any) => be.name === b.name,
        );
        return {
          name: b.name,
          quantity: savedBoleta?.quantity || 0,
          value: b.value,
        };
      });

      reset({
        date: cierreData?.date
          ? new Date(cierreData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        boletasEspeciales: boletasArray,
        cantidadTotalBoletas: cierreData?.cantidadTotalBoletas || 0,
        recargas: cierreData?.recargas || 0,
        recargasSubtotal: cierreData?.recargasSubtotal || 0,
        westernUnionQuantity: cierreData?.westernUnionQuantity || 0,
      });

      initialized.current = true;
    }
  }, [boletasDB, cierreData, id, reset]);

  const onFormSubmit: SubmitHandler<CierrePfInput> = async (data) => {
    const result = await Swal.fire({
      title: id ? "¿Actualizar cierre?" : "¿Guardar cierre?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: id ? "Sí, actualizar" : "Sí, guardar",
    });

    if (result.isConfirmed) {
      const dataToSubmit = {
        ...data,
        totalGanancia,
      };

      if (id) {
        updateMutation.mutate(
          { id, cierre: dataToSubmit as any },
          {
            onSuccess: () => {
              Swal.fire(
                "¡Guardado!",
                "Cierre actualizado con éxito.",
                "success",
              );
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
            Swal.fire("¡Guardado!", "Cierre guardado con éxito.", "success");
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

  const onInvalid = useCallback((errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      Swal.fire("Atención", firstError.message, "warning");
    } else if (errors.root?.message) {
      Swal.fire("Atención", errors.root.message, "warning");
    } else if (errors.cantidadTotalBoletas?.message) {
      // Zod coloca el error del refine aquí según nuestro esquema
      Swal.fire("Atención", errors.cantidadTotalBoletas.message, "warning");
    }
  }, []);

  const handleUpdatePersistentValue = async (name: string, value: number) => {
    const targetBoleta = boletasDB.find((b) => b.name === name);
    if (!targetBoleta) return;

    updateBoletaMutation.mutate(
      { id: targetBoleta._id, boleta: { name, value } },
      {
        onSuccess: () => {
          Swal.fire("Guardado", `Valor de ${name} actualizado.`, "success");
        },
        onError: () => {
          Swal.fire("Error", `No se pudo actualizar ${name}.`, "error");
        },
      },
    );
  };

  const handleEnterKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputs = Array.from(
        document.querySelectorAll(".cantidad-input"),
      ) as HTMLInputElement[];
      const currentIndex = inputs.indexOf(e.target as HTMLInputElement);
      if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
        inputs[currentIndex + 1].select();
      }
    }
  };

  return {
    register,
    control,
    handleSubmit: handleSubmit(onFormSubmit, onInvalid),
    errors,
    fields,
    watchedBoletas,
    totalGanancia,
    totalBoletasEspeciales,
    subtotalBoletasNormales,
    subtotalWesternUnion,
    westernUnionValue,
    valorFacturaNormal,
    handleUpdatePersistentValue,
    handleEnterKey,
    loading:
      isLoadingCierre ||
      createMutation.isPending ||
      updateMutation.isPending ||
      updateBoletaMutation.isPending,
  };
};
