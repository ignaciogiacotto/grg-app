import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

export const usePaginatedData = <T,>(
  fetcher: (page: number) => Promise<PaginatedResponse<T>>,
  deleter: (id: string) => Promise<any>,
  pageSize: number = 5
) => {
  const { page: pageParam = "0" } = useParams<{ page?: string }>();
  const [data, setData] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const page = parseInt(pageParam, 10);
      const result = await fetcher(page);
      setData(result.content);
      setTotalPages(Math.ceil(result.totalElements / pageSize));
    } catch (error) {
      console.error("Error fetching paginated data:", error);
      Swal.fire("Error", "No se pudo cargar la lista de datos.", "error");
    }
  }, [fetcher, pageParam, pageSize]);

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

  return { data, totalPages, handleDelete };
};
