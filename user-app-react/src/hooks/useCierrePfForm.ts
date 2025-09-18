import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import cierrePfService, {
  IBoletaEspecialCierre,
} from "../services/cierrePfService";

// Interfaces
export interface IBoletaFormItem {
  id: string;
  label: string;
  quantity: number;
  value: number | string;
  editable?: boolean;
  type: string;
  subtotal: number | string;
}

interface IState {
  boletas: Omit<IBoletaFormItem, "subtotal" | "type">[];
  boletasVersion: number;
  cantidadTotalBoletas: number;
  recargas: number;
  recargasSubtotal: number;
  recargasSubtotalEditable: boolean;
  westernUnionQuantity: number;
  westernUnionValue: number;
  westernUnionValueId: string | null;
  westernUnionValueEditable: boolean;
  valorFacturaNormal: number;
  valorFacturaNormalId: string | null;
  valorFacturaNormalEditable: boolean;
  descFacturas: number;
  totalGanancia: number;
  totalFacturasSubtotal: number;
}

// Reducer
type Action =
  | { type: "SET_STATE"; payload: Partial<IState> }
  | { type: "SET_FIELD"; payload: { field: keyof IState; value: any } }
  | {
      type: "UPDATE_BOLETA";
      payload: { id: string; field: "quantity" | "value"; value: number };
    }
  | { type: "TOGGLE_BOLETA_EDIT"; payload: string }
  | { type: "REFETCH_BOLETAS" };

const initialState: IState = {
  boletas: [],
  boletasVersion: 0,
  cantidadTotalBoletas: 0,
  recargas: 0,
  recargasSubtotal: 0,
  recargasSubtotalEditable: false,
  westernUnionQuantity: 0,
  westernUnionValue: 0,
  westernUnionValueId: null,
  westernUnionValueEditable: false,
  valorFacturaNormal: 100,
  valorFacturaNormalId: null,
  valorFacturaNormalEditable: false,
  descFacturas: 0,
  totalGanancia: 0,
  totalFacturasSubtotal: 0,
};

const reducer = (state: IState, action: Action): IState => {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...action.payload };
    case "SET_FIELD":
      return { ...state, [action.payload.field]: action.payload.value };
    case "UPDATE_BOLETA":
      return {
        ...state,
        boletas: state.boletas.map((b) =>
          b.id === action.payload.id
            ? { ...b, [action.payload.field]: action.payload.value }
            : b
        ),
      };
    case "TOGGLE_BOLETA_EDIT":
      return {
        ...state,
        boletas: state.boletas.map((b) =>
          b.id === action.payload ? { ...b, editable: !b.editable } : b
        ),
      };
    case "REFETCH_BOLETAS":
      return { ...state, boletasVersion: state.boletasVersion + 1 };
    default:
      return state;
  }
};

export const useCierrePfForm = (id?: string) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    boletas,
    boletasVersion,
    cantidadTotalBoletas,
    recargas,
    recargasSubtotal,
    westernUnionQuantity,
    westernUnionValue,
    valorFacturaNormal,
    totalGanancia,
  } = state;

  // Initial data fetch
  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const boletasDB = await cierrePfService.getBoletasEspeciales();

        const wuBoleta = boletasDB.find(
          (b) => b.name === "Western Union Value"
        );
        const vfnBoleta = boletasDB.find(
          (b) => b.name === "Valor Factura Normal"
        );

        let finalWuBoleta = wuBoleta;
        if (!wuBoleta) {
          finalWuBoleta = await cierrePfService.createBoletaEspecial({
            name: "Western Union Value",
            value: 0,
          });
        }

        let finalVfnBoleta = vfnBoleta;
        if (!vfnBoleta) {
          finalVfnBoleta = await cierrePfService.createBoletaEspecial({
            name: "Valor Factura Normal",
            value: 100,
          });
        }

        const otherBoletas = boletasDB
          .filter(
            (b) =>
              b.name !== "Western Union Value" &&
              b.name !== "Valor Factura Normal"
          )
          .map((b) => ({
            id: b._id,
            label: b.name,
            quantity: 0,
            value: b.value,
            editable: false,
          }));

        const initialStateUpdate: Partial<IState> = {
          westernUnionValue: finalWuBoleta!.value,
          westernUnionValueId: finalWuBoleta!._id,
          valorFacturaNormal: finalVfnBoleta!.value,
          valorFacturaNormalId: finalVfnBoleta!._id,
        };

        if (id) {
          const cierreData = await cierrePfService.getCierrePfById(id);
          cierreData.boletasEspeciales.forEach((be: IBoletaEspecialCierre) => {
            const boletaIndex = otherBoletas.findIndex(
              (b) => b.label === be.name
            );
            if (boletaIndex !== -1) {
              otherBoletas[boletaIndex].quantity = be.quantity;
            }
          });

          initialStateUpdate.boletas = otherBoletas;
          initialStateUpdate.cantidadTotalBoletas =
            cierreData.cantidadTotalBoletas || 0;
          initialStateUpdate.recargas = Number(cierreData.recargas) || 0;
          initialStateUpdate.recargasSubtotal =
            Number(cierreData.recargasSubtotal) || 0;
          initialStateUpdate.westernUnionQuantity =
            Number(cierreData.westernUnionQuantity) || 0;
        } else {
          initialStateUpdate.boletas = otherBoletas;
          initialStateUpdate.cantidadTotalBoletas = 0;
          initialStateUpdate.recargas = 0;
          initialStateUpdate.recargasSubtotal = 0;
          initialStateUpdate.westernUnionQuantity = 0;
        }

        dispatch({ type: "SET_STATE", payload: initialStateUpdate });
      } catch (error) {
        console.error("Error initializing form data:", error);
      }
    };

    fetchAndSetData();
  }, [id, boletasVersion]);

  // Calculations
  useEffect(() => {
    const cantidadBoletasEspeciales = boletas.reduce(
      (acc, boleta) => acc + boleta.quantity,
      0
    );
    const subtotalBoletasEspeciales = boletas.reduce(
      (acc, boleta) =>
        acc +
        (boleta.quantity * (typeof boleta.value === "number" ? boleta.value : 0)),
      0
    );
    const cantidadBoletasNormales = Math.max(
      0,
      cantidadTotalBoletas - (cantidadBoletasEspeciales + recargas)
    );
    const subtotalBoletasNormales =
      cantidadBoletasNormales * valorFacturaNormal;
    const subtotalWesternUnion = westernUnionQuantity * westernUnionValue;

    dispatch({
      type: "SET_STATE",
      payload: {
        descFacturas: cantidadBoletasEspeciales + recargas,
        totalGanancia:
          subtotalBoletasNormales +
          subtotalBoletasEspeciales +
          recargasSubtotal +
          subtotalWesternUnion,
        totalFacturasSubtotal: subtotalBoletasNormales,
      },
    });
  }, [
    boletas,
    cantidadTotalBoletas,
    recargas,
    recargasSubtotal,
    westernUnionQuantity,
    westernUnionValue,
    valorFacturaNormal,
  ]);

  // Handlers
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await Swal.fire({
      title: id ? "¿Actualizar cierre?" : "¿Guardar cierre?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: id ? "Sí, actualizar" : "Sí, guardar",
    });

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
          await cierrePfService.updateCierrePf(id, cierreData);
        } else {
          await cierrePfService.createCierrePf(cierreData);
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
  };

  const handleUpdatePersistentValue = async (
    valueId: string | null,
    name: string,
    value: number,
    field: keyof IState
  ) => {
    if (!valueId) return;
    try {
      await cierrePfService.updateBoletaEspecial(valueId, { name, value });
      dispatch({ type: "SET_FIELD", payload: { field, value: false } });
      Swal.fire(
        "Guardado",
        `El valor de ${name} ha sido actualizado.`,
        "success"
      );
    } catch (error) {
      console.error(`Error updating ${name}:`, error);
      Swal.fire("Error", `No se pudo actualizar el valor de ${name}.`, "error");
    }
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
      subtotal: state.totalFacturasSubtotal,
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
    state,
    dispatch,
    items,
    handleSubmit,
    handleUpdatePersistentValue,
  };
};