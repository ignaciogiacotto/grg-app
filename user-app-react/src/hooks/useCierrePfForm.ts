import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import cierrePfService, {
  IBoletaEspecialCierre,
} from "../services/cierrePfService";
import {
  useCierrePfQuery,
  useBoletasEspecialesQuery,
  useCreateCierrePfMutation,
  useUpdateCierrePfMutation,
  useUpdateBoletaEspecialMutation,
  useCreateBoletaEspecialMutation,
} from "./useCierrePfQuery";

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
  date: string;
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
  date: new Date().toISOString().split("T")[0],
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

  const { data: boletasDB = [] } = useBoletasEspecialesQuery();
  const { data: cierreData, isLoading: isLoadingCierre } = useCierrePfQuery(id);
  const createMutation = useCreateCierrePfMutation();
  const updateMutation = useUpdateCierrePfMutation();
  const updateBoletaMutation = useUpdateBoletaEspecialMutation();
  const createBoletaMutation = useCreateBoletaEspecialMutation();

  const {
    boletas,
    cantidadTotalBoletas,
    recargas,
    recargasSubtotal,
    westernUnionQuantity,
    westernUnionValue,
    valorFacturaNormal,
    totalGanancia,
  } = state;

  // Initial data fetch and sync
  useEffect(() => {
    if (boletasDB.length === 0) return;

    const syncData = async () => {
      let wuBoleta = boletasDB.find((b) => b.name === "Western Union Value");
      let vfnBoleta = boletasDB.find((b) => b.name === "Valor Factura Normal");

      // Auto-create essential boletas if they don't exist
      if (!wuBoleta) {
        wuBoleta = await createBoletaMutation.mutateAsync({ name: "Western Union Value", value: 0 });
      }
      if (!vfnBoleta) {
        vfnBoleta = await createBoletaMutation.mutateAsync({ name: "Valor Factura Normal", value: 100 });
      }

      const otherBoletas = boletasDB
        .filter((b) => b.name !== "Western Union Value" && b.name !== "Valor Factura Normal")
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name))
        .map((b) => ({
          id: b._id,
          label: b.name,
          quantity: 0,
          value: b.value,
          editable: false,
        }));

      const initialStateUpdate: Partial<IState> = {
        westernUnionValue: wuBoleta!.value,
        westernUnionValueId: wuBoleta!._id,
        valorFacturaNormal: vfnBoleta!.value,
        valorFacturaNormalId: vfnBoleta!._id,
      };

      if (id && cierreData) {
        cierreData.boletasEspeciales.forEach((be: IBoletaEspecialCierre) => {
          const boletaIndex = otherBoletas.findIndex((b) => b.label === be.name);
          if (boletaIndex !== -1) {
            otherBoletas[boletaIndex].quantity = be.quantity;
          }
        });

        initialStateUpdate.boletas = otherBoletas;
        if (cierreData.date) {
          initialStateUpdate.date = new Date(cierreData.date).toISOString().split("T")[0];
        }
        initialStateUpdate.cantidadTotalBoletas = cierreData.cantidadTotalBoletas || 0;
        initialStateUpdate.recargas = Number(cierreData.recargas) || 0;
        initialStateUpdate.recargasSubtotal = Number(cierreData.recargasSubtotal) || 0;
        initialStateUpdate.westernUnionQuantity = Number(cierreData.westernUnionQuantity) || 0;
      } else {
        initialStateUpdate.boletas = otherBoletas;
      }

      dispatch({ type: "SET_STATE", payload: initialStateUpdate });
    };

    syncData();
  }, [id, cierreData, boletasDB]);

  // Calculations
  useEffect(() => {
    const cantidadBoletasEspeciales = boletas.reduce((acc, boleta) => acc + boleta.quantity, 0);
    const subtotalBoletasEspeciales = boletas.reduce(
      (acc, boleta) => acc + (boleta.quantity * (typeof boleta.value === "number" ? boleta.value : 0)),
      0
    );
    const cantidadBoletasNormales = Math.max(0, cantidadTotalBoletas - (cantidadBoletasEspeciales + recargas));
    const subtotalBoletasNormales = cantidadBoletasNormales * valorFacturaNormal;
    const subtotalWesternUnion = westernUnionQuantity * westernUnionValue;

    dispatch({
      type: "SET_STATE",
      payload: {
        descFacturas: cantidadBoletasEspeciales + recargas,
        totalGanancia: subtotalBoletasNormales + subtotalBoletasEspeciales + recargasSubtotal + subtotalWesternUnion,
        totalFacturasSubtotal: subtotalBoletasNormales,
      },
    });
  }, [boletas, cantidadTotalBoletas, recargas, recargasSubtotal, westernUnionQuantity, westernUnionValue, valorFacturaNormal]);

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
      const dataToSubmit = {
        date: state.date,
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

      const mutation = id ? updateMutation : createMutation;
      const mutationParams = id ? { id, cierre: dataToSubmit } : dataToSubmit;

      // @ts-ignore
      mutation.mutate(mutationParams, {
        onSuccess: () => {
          Swal.fire("¡Guardado!", `Cierre ${id ? "actualizado" : "guardado"} con éxito.`, "success");
          navigate("/dashboard");
        },
        onError: (error: any) => {
          console.error("Error saving cierre:", error);
          const errorMessage = error.response?.data?.message || "Ocurrió un error al guardar el cierre.";
          Swal.fire("Error", errorMessage, "error");
        }
      });
    }
  };

  const handleUpdatePersistentValue = async (valueId: string | null, name: string, value: number, field: keyof IState) => {
    if (!valueId) return;
    updateBoletaMutation.mutate({ id: valueId, boleta: { name, value } }, {
      onSuccess: () => {
        dispatch({ type: "SET_FIELD", payload: { field, value: false } });
        Swal.fire("Guardado", `El valor de ${name} ha sido actualizado.`, "success");
      },
      onError: (error) => {
        console.error(`Error updating ${name}:`, error);
        Swal.fire("Error", `No se pudo actualizar el valor de ${name}.`, "error");
      }
    });
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
    loading: isLoadingCierre || createMutation.isPending || updateMutation.isPending || updateBoletaMutation.isPending,
  };
};