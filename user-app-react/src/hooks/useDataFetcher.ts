import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

export const useDataFetcher = <T,>(
  fetcher: () => Promise<T[]>,
  deleter: (id: string) => Promise<any>
) => {
  const [data, setData] = useState<T[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const result = await fetcher();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "No se pudo cargar la lista de datos.", "error");
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, ¡bórralo!",
    });

    if (result.isConfirmed) {
      try {
        await deleter(id);
        Swal.fire("¡Borrado!", "El registro ha sido borrado.", "success");
        fetchData(); // Refresh the list
      } catch (error) {
        console.error("Error deleting item:", error);
        Swal.fire("Error", "Ocurrió un error al borrar el registro.", "error");
      }
    }
  };

  return { data, handleDelete };
};
