import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import {
  dropTargetForElements,
  draggable,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  getProviders,
  updateProvider,
  createProvider,
  IProvider,
} from "../../services/providerService";
import Swal from "sweetalert2";

const weekDays = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];

const Providers: React.FC = () => {
  const [days, setDays] = useState<IProvider[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [newProviderName, setNewProviderName] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      let providers = await getProviders();
      if (providers.length === 0) {
        for (const day of weekDays) {
          await createProvider(day);
        }
        providers = await getProviders();
      }
      setDays(providers);
    };
    fetchProviders();
  }, []);

  const handleAddProvider = async () => {
    if (selectedDay && newProviderName.trim() !== "") {
      const day = days.find((d) => d.day === selectedDay);
      if (day) {
        const newProviders = [...day.providers, newProviderName.trim()];
        await updateProvider(selectedDay, newProviders);
        const providers = await getProviders();
        setDays(providers);
        setShowModal(false);
        setNewProviderName("");
      }
    }
  };

  const handleDeleteProvider = async (dayId: string, providerName: string) => {
    const day = days.find((d) => d.day === dayId);
    if (day) {
      const newProviders = day.providers.filter((p) => p !== providerName);
      await updateProvider(dayId, newProviders);
      const providers = await getProviders();
      setDays(providers);
    }
  };

  const DraggableProvider = ({
    provider,
    dayId,
  }: {
    provider: string;
    dayId: string;
  }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const el = ref.current;
      if (el) {
        const cleanup = draggable({
          element: el,
          getInitialData: () => ({ provider, dayId }),
        });
        return cleanup;
      }
    }, [provider, dayId]);

    return (
      <div
        ref={ref}
        className="row align-items-center bg-light border rounded px-3 py-2 mb-2 shadow-sm g-2">
        <div className="col fw-medium text-wrap text-break">{provider}</div>

        <div className="col-auto">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() =>
              Swal.fire({
                title: "¿Eliminar proveedor?",
                text: `Se eliminará "${provider}".`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#d33",
                cancelButtonColor: "#6c757d",
              }).then((result) => {
                if (result.isConfirmed) {
                  handleDeleteProvider(dayId, provider);
                  Swal.fire({
                    icon: "success",
                    title: "Eliminado",
                    text: `El proveedor "${provider}" fue eliminado.`,
                    timer: 1500,
                    showConfirmButton: false,
                  });
                }
              })
            }>
            <i className="bi bi-trash3"></i>
          </Button>
        </div>
      </div>
    );
  };

  const DroppableDay = ({ day }: { day: IProvider }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const el = ref.current;
      if (el) {
        const cleanup = dropTargetForElements({
          element: el,
          getData: () => ({ dayId: day.day }),
          onDragEnter: () => el.classList.add("drag-over"),
          onDragLeave: () => el.classList.remove("drag-over"),
          onDrop: async ({ source, location }) => {
            el.classList.remove("drag-over");

            const sourceData = source.data as {
              provider: string;
              dayId: string;
            };
            const targetData = location.current.dropTargets[0].data as {
              dayId: string;
            };

            if (sourceData.dayId === targetData.dayId) {
              return;
            }

            const sourceDay = days.find((d) => d.day === sourceData.dayId);
            const targetDay = days.find((d) => d.day === targetData.dayId);

            if (sourceDay && targetDay) {
              const newSourceProviders = sourceDay.providers.filter(
                (p) => p !== sourceData.provider
              );
              const newTargetProviders = [
                ...targetDay.providers,
                sourceData.provider,
              ];

              await updateProvider(sourceData.dayId, newSourceProviders);
              await updateProvider(targetData.dayId, newTargetProviders);

              const providers = await getProviders();
              setDays(providers);
            }
          },
        });
        return cleanup;
      }
    }, [day]);

    return (
      <Card.Body ref={ref} className="min-vh-25">
        {day.providers.length > 0 ? (
          day.providers.map((provider) => (
            <DraggableProvider
              key={provider}
              provider={provider}
              dayId={day.day}
            />
          ))
        ) : (
          <div className="text-muted text-center py-3 fst-italic">
            No hay proveedores
          </div>
        )}
      </Card.Body>
    );
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4 text-center fw-bold">📦 Planificador de Pedidos</h1>
      <Row className="g-4">
        {days.map((day) => (
          <Col key={day.day} md={4} lg={2}>
            <Card className="shadow-sm rounded-3 h-100">
              <Card.Header className="bg-primary text-white text-center fw-bold">
                {day.day.toUpperCase()}
              </Card.Header>
              <DroppableDay day={day} />
              <Card.Footer className="text-center">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    setSelectedDay(day.day);
                    setShowModal(true);
                  }}>
                  <i className="bi bi-plus-lg me-1"></i>
                  Agregar
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre del Proveedor</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                value={newProviderName}
                isInvalid={newProviderName.trim() === ""}
                onChange={(e) => setNewProviderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddProvider()}
              />
              <Form.Control.Feedback type="invalid">
                Ingrese un nombre válido
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleAddProvider}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Extra styles */}
      <style>{`
        .drag-over {
          background-color: #e9f7ef !important;
          border: 2px dashed #28a745;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }
      `}</style>
    </Container>
  );
};

export default Providers;
