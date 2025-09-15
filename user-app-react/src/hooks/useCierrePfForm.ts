import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getCierrePfById,
  createCierrePf,
  updateCierrePf,
  getBoletasEspeciales,
  createBoletaEspecial,
  updateBoletaEspecial,
  IBoletaEspecialCierre,
} from "../services/cierrePfService";

interface IBoletaFormItem {
  id: string;
  label: string;
  quantity: number;
  value: number | string;
  editable?: boolean;
  type: string;
  subtotal: number | string;
}

export const useCierrePfForm = (id?: string) => {
  const navigate = useNavigate();
  const [boletas, setBoletas] = useState<
    Omit<IBoletaFormItem, "subtotal" | "type">[]
  >([]);
  const [boletasVersion, setBoletasVersion] = useState(0);

  const [cantidadTotalBoletas, setCantidadTotalBoletas] = useState(0);
  const [recargas, setRecargas] = useState(0);
  const [recargasSubtotal, setRecargasSubtotal] = useState(0);
  const [recargasSubtotalEditable, setRecargasSubtotalEditable] =
    useState(false);

  // Western Union is special. Its VALUE is persistent (like a boleta especial),
  // but its QUANTITY is transactional (like a recarga).
  const [westernUnionQuantity, setWesternUnionQuantity] = useState(0);
  const [westernUnionValue, setWesternUnionValue] = useState(0);
  const [westernUnionValueId, setWesternUnionValueId] = useState<string | null>(
    null
  );
  const [westernUnionValueEditable, setWesternUnionValueEditable] =
    useState(false);

  const [valorFacturaNormal, setValorFacturaNormal] = useState(100); // Default to 100
  const [valorFacturaNormalId, setValorFacturaNormalId] = useState<
    string | null
  >(null);
  const [valorFacturaNormalEditable, setValorFacturaNormalEditable] =
    useState(false);

  const [descFacturas, setDescFacturas] = useState(0);
  const [totalGanancia, setTotalGanancia] = useState(0);

  const refetchBoletas = () => {
    setBoletasVersion((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        // First, always get the definitions of all special boletas
        const boletasDB = await getBoletasEspeciales();

        // Find and set persistent WU value
        const wuBoleta = boletasDB.find(
          (b) => b.name === "Western Union Value"
        );
        if (wuBoleta) {
          setWesternUnionValue(wuBoleta.value);
          setWesternUnionValueId(wuBoleta._id);
        } else {
          const newWuBoleta = await createBoletaEspecial({
            name: "Western Union Value",
            value: 0,
          });
          setWesternUnionValue(newWuBoleta.value);
          setWesternUnionValueId(newWuBoleta._id);
        }

        // Find and set persistent VFN value
        const vfnBoleta = boletasDB.find(
          (b) => b.name === "Valor Factura Normal"
        );
        if (vfnBoleta) {
          setValorFacturaNormal(vfnBoleta.value);
          setValorFacturaNormalId(vfnBoleta._id);
        } else {
          const newVfnBoleta = await createBoletaEspecial({
            name: "Valor Factura Normal",
            value: 100,
          });
          setValorFacturaNormal(newVfnBoleta.value);
          setValorFacturaNormalId(newVfnBoleta._id);
        }

        // Filter out the special values to get the list of actual boletas
        const otherBoletas = boletasDB.filter(
          (b) =>
            b.name !== "Western Union Value" &&
            b.name !== "Valor Factura Normal"
        );
        const initialBoletas = otherBoletas.map((b) => ({
          id: b._id,
          label: b.name,
          quantity: 0,
          value: b.value,
          editable: false,
        }));

        if (id) {
          // EDIT MODE: Fetch the specific Cierre and populate quantities
          const cierreData = await getCierrePfById(id);

          cierreData.boletasEspeciales.forEach((be: IBoletaEspecialCierre) => {
            const boletaIndex = initialBoletas.findIndex(
              (b) => b.label === be.name
            );
            if (boletaIndex !== -1) {
              initialBoletas[boletaIndex].quantity = be.quantity;
            }
          });

          setBoletas(initialBoletas);
          setCantidadTotalBoletas(cierreData.cantidadTotalBoletas || 0);
          setRecargas(Number(cierreData.recargas) || 0);
          setRecargasSubtotal(Number(cierreData.recargasSubtotal) || 0);
          setWesternUnionQuantity(Number(cierreData.westernUnionQuantity) || 0);
        } else {
          // CREATE MODE: Reset transactional fields to 0
          setBoletas(initialBoletas); // Boletas with 0 quantity
          setCantidadTotalBoletas(0);
          setRecargas(0);
          setRecargasSubtotal(0);
          setWesternUnionQuantity(0);
        }
      } catch (error) {
        console.error("Error initializing form data:", error);
      }
    };

    fetchAndSetData();
  }, [id, boletasVersion]);

  useEffect(() => {
    const cantidadBoletasEspeciales = boletas.reduce(
      (acc, boleta) => acc + boleta.quantity,
      0
    );
    const subtotalBoletasEspeciales = boletas.reduce(
      (acc, boleta) =>
        acc +
        boleta.quantity * (typeof boleta.value === "number" ? boleta.value : 0),
      0
    );

    const cantidadBoletasNormales = Math.max(
      0,
      cantidadTotalBoletas - (cantidadBoletasEspeciales + recargas)
    );
    const subtotalBoletasNormales =
      cantidadBoletasNormales * valorFacturaNormal;

    // --- ÚNICO CAMBIO DE LÓGICA AQUÍ ---
    setDescFacturas(cantidadBoletasEspeciales + recargas);
    // -----------------------------------

    const subtotalWesternUnion = westernUnionQuantity * westernUnionValue;

    setTotalGanancia(
      subtotalBoletasNormales +
        subtotalBoletasEspeciales +
        recargasSubtotal +
        subtotalWesternUnion
    );
  }, [
    boletas,
    cantidadTotalBoletas,
    recargas,
    recargasSubtotal,
    westernUnionQuantity,
    westernUnionValue,
    valorFacturaNormal,
  ]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    Swal.fire({
      title: id ? "¿Actualizar cierre?" : "¿Guardar cierre?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: id ? "Sí, actualizar" : "Sí, guardar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const cierreData = {
          boletasEspeciales: boletas.map((b) => ({
            name: b.label,
            quantity: b.quantity,
            value: typeof b.value === "number" ? b.value : 0,
          })),
          cantidadTotalBoletas,
          recargas,
          recargasSubtotal,
          westernUnionQuantity,
          totalGanancia,
        };

        try {
          if (id) {
            await updateCierrePf(id, cierreData);
          } else {
            await createCierrePf(cierreData);
          }
          Swal.fire(
            "¡Guardado!",
            `Cierre ${id ? "actualizado" : "guardado"} con éxito.`,
            "success"
          );
          navigate("/dashboard");
        } catch (error) {
          console.error("Error guardando el cierre:", error);
          Swal.fire("Error", "No se pudo guardar el cierre.", "error");
        }
      }
    });
  };

  const handleUpdateWesternUnionValue = async () => {
    if (!westernUnionValueId) return;
    try {
      await updateBoletaEspecial(westernUnionValueId, {
        name: "Western Union Value",
        value: westernUnionValue,
      });
      setWesternUnionValueEditable(false);
      Swal.fire(
        "Guardado",
        "El valor de Western Union ha sido actualizado.",
        "success"
      );
    } catch (error) {
      console.error("Error updating Western Union value:", error);
      Swal.fire(
        "Error",
        "No se pudo actualizar el valor de Western Union.",
        "error"
      );
    }
  };

  const handleUpdateValorFacturaNormal = async () => {
    if (!valorFacturaNormalId) return;
    try {
      await updateBoletaEspecial(valorFacturaNormalId, {
        name: "Valor Factura Normal",
        value: valorFacturaNormal,
      });
      setValorFacturaNormalEditable(false);
      Swal.fire(
        "Guardado",
        "El valor de Factura Normal ha sido actualizado.",
        "success"
      );
    } catch (error) {
      console.error("Error updating Valor Factura Normal:", error);
      Swal.fire(
        "Error",
        "No se pudo actualizar el valor de Factura Normal.",
        "error"
      );
    }
  };

  const handleBoletaChange = (
    id: string,
    field: "quantity" | "value",
    value: number
  ) => {
    setBoletas((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const toggleBoletaEdit = (id: string) => {
    setBoletas((prev) =>
      prev.map((b) => (b.id === id ? { ...b, editable: !b.editable } : b))
    );
  };

  const items: IBoletaFormItem[] = [
    {
      id: "western-union",
      label: "Western Union",
      quantity: westernUnionQuantity,
      value: westernUnionValue,
      type: "western-union",
      subtotal: westernUnionQuantity * westernUnionValue,
    },
    {
      id: "total-facturas",
      label: "Total Facturas Cobradas",
      quantity: cantidadTotalBoletas,
      value: valorFacturaNormal,
      type: "total-facturas",
      subtotal:
        Math.max(
          0,
          cantidadTotalBoletas -
            (boletas.reduce((acc, b) => acc + b.quantity, 0) + recargas)
        ) * valorFacturaNormal,
    },
    ...boletas.map((b) => ({
      ...b,
      type: "especial",
      subtotal: b.quantity * (typeof b.value === "number" ? b.value : 0),
    })),
    {
      id: "recargas",
      label: "Recargas",
      quantity: recargas,
      value: "",
      type: "recargas",
      subtotal: recargasSubtotal,
    },
  ];

  return {
    items,
    descFacturas,
    totalGanancia,
    recargasSubtotal,
    recargasSubtotalEditable,
    setRecargasSubtotal,
    setRecargasSubtotalEditable,
    setRecargas,
    setCantidadTotalBoletas,
    westernUnionQuantity,
    setWesternUnionQuantity,
    westernUnionValue,
    setWesternUnionValue,
    westernUnionValueEditable,
    setWesternUnionValueEditable,
    handleUpdateWesternUnionValue,
    valorFacturaNormal,
    setValorFacturaNormal,
    valorFacturaNormalEditable,
    setValorFacturaNormalEditable,
    handleUpdateValorFacturaNormal,
    handleSubmit,
    handleBoletaChange,
    toggleBoletaEdit,
    refetchBoletas,
  };
};
