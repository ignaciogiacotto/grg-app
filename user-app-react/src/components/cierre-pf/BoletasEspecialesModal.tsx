import { useState, useEffect } from "react";
import { Modal, Button, Form, Table, Row, Col, Spinner } from "react-bootstrap";
import cierrePfService, {
  IBoletaEspecialDB,
} from "../../services/cierrePfService";
import Swal from "sweetalert2";
import { formatCurrency } from "../../utils/formatters";

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
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      fetchBoletas();
    }
  }, [show]);

  const fetchBoletas = async () => {
    try {
      setIsLoading(true);
      const data = await cierrePfService.getBoletasEspeciales();
      setBoletas(
        data.sort(
          (a, b) =>
            (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)
        )
      );
    } catch (error) {
      console.error("Error fetching boletas especiales:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newBoletaName.trim()) {
      Swal.fire(
        "Nombre requerido",
        "Escribí un nombre para la boleta especial.",
        "warning"
      );
      return;
    }
    if (!newBoletaValue || newBoletaValue <= 0) {
      Swal.fire(
        "Valor inválido",
        "Ingresá un valor mayor a 0.",
        "warning"
      );
      return;
    }

    try {
      setIsSaving(true);
      await cierrePfService.createBoletaEspecial({
        name: newBoletaName,
        value: newBoletaValue,
        order:
          boletas.length === 0
            ? 0
            : Math.max(...boletas.map((b) => b.order ?? 0)) + 1,
      });
      setNewBoletaName("");
      setNewBoletaValue(0);
      fetchBoletas();
      Swal.fire("Creada!", "La boleta ha sido creada.", "success");
    } catch (error) {
      console.error("Error creating boleta especial:", error);
      Swal.fire("Error", "Hubo un error al crear la boleta.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (editingBoleta) {
      try {
        setIsSaving(true);
        await cierrePfService.updateBoletaEspecial(editingBoleta._id, {
          name: editingBoleta.name,
          value: editingBoleta.value,
        });
        setEditingBoleta(null);
        fetchBoletas();
        Swal.fire("Actualizada!", "La boleta ha sido actualizada.", "success");
      } catch (error) {
        console.error("Error updating boleta especial:", error);
        Swal.fire("Error", "Hubo un error al actualizar la boleta.", "error");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleMoveBoleta = async (id: string, direction: "up" | "down") => {
    const sorted = [...boletas].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)
    );
    const index = sorted.findIndex((b) => b._id === id);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    // Reordenar: sacar el ítem y ponerlo en la nueva posición
    const reordered = [...sorted];
    const [removed] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, removed);

    // Persistir orden 0, 1, 2, ... para todos (evita empates y documentos sin order)
    try {
      setIsSaving(true);
      await Promise.all(
        reordered.map((b, i) =>
          cierrePfService.updateBoletaEspecial(b._id, {
            name: b.name,
            value: b.value,
            order: i,
          })
        )
      );
      await fetchBoletas();
    } catch (error) {
      console.error("Error reordenando boletas especiales:", error);
      Swal.fire(
        "Error",
        "No se pudo reordenar las boletas especiales.",
        "error"
      );
    } finally {
      setIsSaving(false);
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
          await cierrePfService.deleteBoletaEspecial(id);
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
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Gestionar Boletas especiales</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={5} className="mb-3">
            <h5 className="mb-2">Nueva boleta especial</h5>
            <Form.Text className="text-muted d-block mb-3">
              Definí un nombre y el valor fijo que se usará en el cierre PF.
            </Form.Text>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Nombre</Form.Label>
              <Form.Control
                type="text"
                value={newBoletaName}
                placeholder="Ej: Boleta municipal"
                onChange={(e) => setNewBoletaName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Valor</Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={newBoletaValue}
                onChange={(e) => setNewBoletaValue(Number(e.target.value) || 0)}
              />
              <Form.Text className="text-muted">
                Se guarda como monto fijo por boleta.
              </Form.Text>
            </Form.Group>
            <Button
              onClick={handleCreate}
              className="mt-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                  />
                  Creando...
                </>
              ) : (
                "Crear boleta"
              )}
            </Button>
          </Col>

          <Col md={7}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Boletas configuradas</h5>
              {isLoading && (
                <span className="text-muted small">
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-1"
                  />
                  Cargando...
                </span>
              )}
            </div>
            <div className="border rounded">
              <Table striped hover responsive size="sm" className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "5%" }}></th>
                    <th>Nombre</th>
                    <th>Valor</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {boletas.map((boleta, index) => (
                    <tr key={boleta._id}>
                      <td className="text-center align-middle">
                        <div className="btn-group-vertical btn-group-sm">
                          <Button
                            variant="link"
                            className="p-0"
                            disabled={index === 0 || isSaving}
                            onClick={() => handleMoveBoleta(boleta._id, "up")}
                          >
                            <i className="bi bi-chevron-up" />
                          </Button>
                          <Button
                            variant="link"
                            className="p-0"
                            disabled={index === boletas.length - 1 || isSaving}
                            onClick={() => handleMoveBoleta(boleta._id, "down")}
                          >
                            <i className="bi bi-chevron-down" />
                          </Button>
                        </div>
                      </td>
                      <td style={{ width: "45%" }}>
                        {editingBoleta?._id === boleta._id ? (
                          <Form.Control
                            type="text"
                            size="sm"
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
                      <td style={{ width: "25%" }}>
                        {editingBoleta?._id === boleta._id ? (
                          <Form.Control
                            type="number"
                            size="sm"
                            value={editingBoleta.value}
                            onChange={(e) =>
                              setEditingBoleta({
                                ...editingBoleta,
                                value: Number(e.target.value) || 0,
                              })
                            }
                          />
                        ) : (
                          <span className="fw-semibold">
                            {formatCurrency(boleta.value)}
                          </span>
                        )}
                      </td>
                      <td
                        className="text-end"
                        style={{ width: "160px", whiteSpace: "nowrap" }}
                      >
                        <Button
                          variant={
                            editingBoleta?._id === boleta._id
                              ? "success"
                              : "outline-primary"
                          }
                          size="sm"
                          className="me-2"
                          onClick={
                            editingBoleta?._id === boleta._id
                              ? handleUpdate
                              : () => setEditingBoleta(boleta)
                          }
                          disabled={editingBoleta?._id === boleta._id && isSaving}
                        >
                          {editingBoleta?._id === boleta._id ? "Guardar" : "Editar"}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(boleta._id)}
                        >
                          Borrar
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {boletas.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={3} className="text-center text-muted py-3">
                        No hay boletas especiales configuradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSaving}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BoletasEspecialesModal;
