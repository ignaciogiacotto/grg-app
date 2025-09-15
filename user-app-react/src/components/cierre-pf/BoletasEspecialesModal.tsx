import { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import {
  getBoletasEspeciales,
  createBoletaEspecial,
  updateBoletaEspecial,
  deleteBoletaEspecial,
  IBoletaEspecialDB,
} from "../../services/cierrePfService";
import Swal from "sweetalert2";

interface BoletasEspecialesModalProps {
  show: boolean;
  onHide: () => void;
}

const BoletasEspecialesModal = ({
  show,
  onHide,
}: BoletasEspecialesModalProps) => {
  const [boletas, setBoletas] = useState<IBoletaEspecialDB[]>([]);
  const [newBoletaName, setNewBoletaName] = useState("");
  const [newBoletaValue, setNewBoletaValue] = useState(0);
  const [editingBoleta, setEditingBoleta] = useState<IBoletaEspecialDB | null>(
    null
  );

  useEffect(() => {
    if (show) {
      fetchBoletas();
    }
  }, [show]);

  const fetchBoletas = async () => {
    try {
      const data = await getBoletasEspeciales();
      setBoletas(data);
    } catch (error) {
      console.error("Error fetching boletas especiales:", error);
    }
  };

  const handleCreate = async () => {
    try {
      await createBoletaEspecial({
        name: newBoletaName,
        value: newBoletaValue,
      });
      setNewBoletaName("");
      setNewBoletaValue(0);
      fetchBoletas();
      Swal.fire("Creada!", "La boleta ha sido creada.", "success");
    } catch (error) {
      console.error("Error creating boleta especial:", error);
      Swal.fire("Error", "Hubo un error al crear la boleta.", "error");
    }
  };

  const handleUpdate = async () => {
    if (editingBoleta) {
      try {
        await updateBoletaEspecial(editingBoleta._id, {
          name: editingBoleta.name,
          value: editingBoleta.value,
        });
        setEditingBoleta(null);
        fetchBoletas();
        Swal.fire("Actualizada!", "La boleta ha sido actualizada.", "success");
      } catch (error) {
        console.error("Error updating boleta especial:", error);
        Swal.fire("Error", "Hubo un error al actualizar la boleta.", "error");
      }
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, bórrala!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBoletaEspecial(id);
          fetchBoletas();
          Swal.fire("Borrada!", "La boleta ha sido borrada.", "success");
        } catch (error) {
          console.error("Error deleting boleta especial:", error);
          Swal.fire("Error", "Hubo un error al borrar la boleta.", "error");
        }
      }
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Gestionar Boletas Especiales</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Crear Nueva Boleta</h5>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={newBoletaName}
            onChange={(e) => setNewBoletaName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Valor</Form.Label>
          <Form.Control
            type="number"
            value={newBoletaValue}
            onChange={(e) => setNewBoletaValue(Number(e.target.value))}
          />
        </Form.Group>
        <Button onClick={handleCreate} className="mb-3">
          Crear
        </Button>

        <hr />

        <h5>Lista de Boletas</h5>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Valor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {boletas.map((boleta) => (
              <tr key={boleta._id}>
                <td>
                  {editingBoleta?._id === boleta._id ? (
                    <Form.Control
                      type="text"
                      value={editingBoleta.name}
                      onChange={(e) =>
                        setEditingBoleta({
                          ...editingBoleta,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    boleta.name
                  )}
                </td>
                <td>
                  {editingBoleta?._id === boleta._id ? (
                    <Form.Control
                      type="number"
                      value={editingBoleta.value}
                      onChange={(e) =>
                        setEditingBoleta({
                          ...editingBoleta,
                          value: Number(e.target.value),
                        })
                      }
                    />
                  ) : (
                    boleta.value
                  )}
                </td>
                <td>
                  {editingBoleta?._id === boleta._id ? (
                    <Button variant="success" onClick={handleUpdate}>
                      Guardar
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => setEditingBoleta(boleta)}>
                      Editar
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    className="ms-2"
                    onClick={() => handleDelete(boleta._id)}>
                    Borrar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BoletasEspecialesModal;
