import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthContext } from "../store/auth";
import {
  getCierreKioscoById,
  createCierreKiosco,
  updateCierreKiosco,
} from "../services/cierreKioscoService";

interface ICierreKiosco {
  fac1: number;
  fac2: number;
  cyber: number;
  cargVirt: number;
  cigarros: {
    facturaB: { totalVenta: number; ganancia: number };
    remito: { totalVenta: number; ganancia: number };
  };
}

export const useCierreKioscoForm = (id?: string) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ICierreKiosco>({
    fac1: 0,
    fac2: 0,
    cyber: 0,
    cargVirt: 0,
    cigarros: {
      facturaB: { totalVenta: 0, ganancia: 0 },
      remito: { totalVenta: 0, ganancia: 0 },
    },
  });

  const [totalCaja, setTotalCaja] = useState(0);
  const [totalCigarros, setTotalCigarros] = useState(0);
  const [isDiscountEnabled, setIsDiscountEnabled] = useState(true);
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchCierre = async () => {
        try {
          const data = await getCierreKioscoById(id);
          setFormData(data);
        } catch (error) {
          console.error("Error fetching cierre de kiosco:", error);
          Swal.fire(
            "Error",
            "No se pudo cargar el cierre de kiosco.",
            "error"
          );
        }
      };
      fetchCierre();
    }
  }, [id]);

  useEffect(() => {
    const { fac1, fac2, cyber, cargVirt } = formData;
    const totalIngresos = fac1 + fac2 + cyber + cargVirt;

    let finalTotalCaja = totalIngresos;
    let calculatedDiscount = 0;

    if (isDiscountEnabled) {
      calculatedDiscount = (totalIngresos * discountPercentage) / 100;
      finalTotalCaja -= calculatedDiscount;
    }

    setDiscountAmount(calculatedDiscount);
    setTotalCaja(finalTotalCaja);

    const costoFacturaB =
      formData.cigarros.facturaB.totalVenta -
      formData.cigarros.facturaB.ganancia;
    const costoRemito =
      formData.cigarros.remito.totalVenta - formData.cigarros.remito.ganancia;
    setTotalCigarros(costoFacturaB + costoRemito);
  }, [formData, isDiscountEnabled, discountPercentage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleCigarrosChange = (
    group: "facturaB" | "remito",
    field: "totalVenta" | "ganancia",
    value: number
  ) => {
    setFormData({
      ...formData,
      cigarros: {
        ...formData.cigarros,
        [group]: { ...formData.cigarros[group], [field]: value },
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de campos requeridos
    const { fac1, fac2, cyber, cargVirt, cigarros } = formData;
    if (
      fac1 === 0 ||
      fac2 === 0 ||
      cyber === 0 ||
      cargVirt === 0 ||
      cigarros.facturaB.totalVenta === 0 ||
      cigarros.facturaB.ganancia === 0 ||
      cigarros.remito.totalVenta === 0 ||
      cigarros.remito.ganancia === 0
    ) {
      Swal.fire("Campos Incompletos", "Por favor, complete todos los campos. Si algún valor es cero, ingrese 0.", "warning");
      return;
    }

    const costoFacturaB =
      formData.cigarros.facturaB.totalVenta -
      formData.cigarros.facturaB.ganancia;
    const costoRemito =
      formData.cigarros.remito.totalVenta - formData.cigarros.remito.ganancia;

    const dataToSubmit = {
      ...formData,
      totalCaja,
      totalCigarros: costoFacturaB + costoRemito,
      cigarros: {
        facturaB: { ...formData.cigarros.facturaB, costo: costoFacturaB },
        remito: { ...formData.cigarros.remito, costo: costoRemito },
      },
      createdBy: user?._id,
    };

    const result = await Swal.fire({
      title: id ? "¿Actualizar Cierre?" : "¿Guardar Cierre?",
      text: "¿Estás seguro de que quieres guardar este cierre?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
    });

    if (result.isConfirmed) {
      try {
        if (id) {
          await updateCierreKiosco(id, dataToSubmit);
        } else {
          await createCierreKiosco(dataToSubmit);
        }
        Swal.fire(
          "¡Guardado!",
          "El cierre ha sido guardado exitosamente.",
          "success"
        );
        navigate("/dashboard");
      } catch (error) {
        console.error("Error saving cierre:", error);
        Swal.fire(
          "Error",
          "Ocurrió un error al guardar el cierre.",
          "error"
        );
      }
    }
  };

  return {
    formData,
    totalCaja,
    totalCigarros,
    isDiscountEnabled,
    discountPercentage,
    discountAmount,
    setIsDiscountEnabled,
    setDiscountPercentage,
    handleSubmit,
    handleChange,
    handleCigarrosChange,
  };
};