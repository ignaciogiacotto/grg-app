import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getCierrePfById,
  createCierrePf,
  updateCierrePf,
} from "../services/cierrePfService";

interface ICierrePf {
  western: number;
  mp: number;
  liga: number;
  santander: number;
  giros: number;
  uala: number;
  naranjaX: number;
  nsaAgencia: number;
  brubank: number;
  direcTv: number;
  extracciones: number;
  recargas: number;
  cantTotalFacturas: number;
}

export const useCierrePfForm = (id?: string) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ICierrePf>({
    western: 0,
    mp: 0,
    liga: 0,
    santander: 0,
    giros: 0,
    uala: 0,
    naranjaX: 0,
    nsaAgencia: 0,
    brubank: 0,
    direcTv: 0,
    extracciones: 0,
    recargas: 0,
    cantTotalFacturas: 0,
  });

  const [editableValores, setEditableValores] = useState<{
    [key: string]: { value: number; editable: boolean };
  }>({
    mp: { value: 500, editable: false },
    liga: { value: 0, editable: false },
    santander: { value: 500, editable: false },
    giros: { value: 1000, editable: false },
    uala: { value: 500, editable: false },
    naranjaX: { value: 500, editable: false },
    nsaAgencia: { value: 500, editable: false },
    brubank: { value: 500, editable: false },
    direcTv: { value: 500, editable: false },
    extracciones: { value: 500, editable: false },
    cantTotalFacturas: { value: 100, editable: false },
  });

  const [descFacturas, setDescFacturas] = useState(0);
  const [totalGanancia, setTotalGanancia] = useState(0);
  const [recargasSubtotal, setRecargasSubtotal] = useState(0);
  const [recargasSubtotalEditable, setRecargasSubtotalEditable] =
    useState(false);

  useEffect(() => {
    if (id) {
      const fetchCierre = async () => {
        try {
          const data = await getCierrePfById(id);
          setFormData(data);
        } catch (error) {
          console.error("Error fetching cierre:", error);
        }
      };
      fetchCierre();
    }
  }, [id]);

  useEffect(() => {
    const desc =
      formData.mp +
      formData.liga +
      formData.santander +
      formData.giros +
      formData.uala +
      formData.naranjaX +
      formData.nsaAgencia +
      formData.brubank +
      formData.direcTv +
      formData.extracciones +
      formData.recargas;
    setDescFacturas(desc);

    const totalMp = formData.mp * editableValores.mp.value;
    const totalLiga = formData.liga * editableValores.liga.value;
    const totalSantander = formData.santander * editableValores.santander.value;
    const totalGiros = formData.giros * editableValores.giros.value;
    const totalUala = formData.uala * editableValores.uala.value;
    const totalNaranjaX = formData.naranjaX * editableValores.naranjaX.value;
    const totalNsaAgencia =
      formData.nsaAgencia * editableValores.nsaAgencia.value;
    const totalBrubank = formData.brubank * editableValores.brubank.value;
    const totalDirecTv = formData.direcTv * editableValores.direcTv.value;
    const totalExtracciones =
      formData.extracciones * editableValores.extracciones.value;
    const totalCantFacturasCalculated =
      Math.max(0, formData.cantTotalFacturas - desc) *
      editableValores.cantTotalFacturas.value;

    const ganancia =
      formData.western +
      totalMp +
      totalLiga +
      totalSantander +
      totalGiros +
      totalUala +
      totalNaranjaX +
      totalNsaAgencia +
      totalBrubank +
      totalDirecTv +
      totalExtracciones +
      recargasSubtotal +
      totalCantFacturasCalculated;
    setTotalGanancia(ganancia);
  }, [formData, editableValores, recargasSubtotal]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    Swal.fire({
      title: id ? "¿Actualizar cierre?" : "¿Guardar cierre?",
      text: "¿Estás seguro de que quieres guardar los cambios?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: id ? "Sí, actualizar" : "Sí, guardar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const cierreData = { ...formData, descFacturas, totalGanancia };

        try {
          if (id) {
            await updateCierrePf(id, cierreData);
          } else {
            await createCierrePf(cierreData);
          }
          Swal.fire(
            "¡Guardado!",
            `Cierre ${id ? "actualizado" : "guardado"} exitosamente`,
            "success"
          );
          navigate("/dashboard");
        } catch (error) {
          console.error(
            `Error ${id ? "actualizando" : "guardando"} el cierre:`,
            error
          );
          Swal.fire(
            "Error",
            `Error ${id ? "actualizando" : "guardando"} el cierre`,
            "error"
          );
        }
      }
    });
  };

  const handleQuantityChange = (name: keyof ICierrePf, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValueChange = (name: string, value: number) => {
    setEditableValores((prev) => ({
      ...prev,
      [name]: { ...prev[name], value },
    }));
  };

  const toggleEdit = (name: string) => {
    setEditableValores((prev) => ({
      ...prev,
      [name]: { ...prev[name], editable: !prev[name].editable },
    }));
  };

  const items = [
    {
      id: "western",
      label: "Western Union",
      stateKey: "western",
      type: "simple",
    },
    { id: "mp", label: "Mercado Pago/Libre", stateKey: "mp", type: "both" },
    { id: "liga", label: "Liga", stateKey: "liga", type: "both" },
    {
      id: "santander",
      label: "Santander",
      stateKey: "santander",
      type: "both",
    },
    { id: "giros", label: "Giros", stateKey: "giros", type: "both" },
    { id: "uala", label: "Uala", stateKey: "uala", type: "both" },
    { id: "naranjaX", label: "Naranja X", stateKey: "naranjaX", type: "both" },
    {
      id: "nsaAgencia",
      label: "NSA Agencia",
      stateKey: "nsaAgencia",
      type: "both",
    },
    { id: "brubank", label: "Brubank", stateKey: "brubank", type: "both" },
    { id: "direcTv", label: "DirecTV", stateKey: "direcTv", type: "both" },
    {
      id: "extracciones",
      label: "Extracciones",
      stateKey: "extracciones",
      type: "both",
    },
    {
      id: "recargas",
      label: "Recargas",
      stateKey: "recargas",
      type: "recargas",
    },
    {
      id: "cantTotalFacturas",
      label: "Cant. Total Facturas",
      stateKey: "cantTotalFacturas",
      type: "both",
    },
  ];

  return {
    formData,
    editableValores,
    descFacturas,
    totalGanancia,
    recargasSubtotal,
    recargasSubtotalEditable,
    setRecargasSubtotal,
    setRecargasSubtotalEditable,
    handleSubmit,
    handleQuantityChange,
    handleValueChange,
    toggleEdit,
    items,
  };
};
