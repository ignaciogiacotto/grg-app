import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  ListGroup,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useExtractions } from "../../hooks/useExtractions";
import { format } from "date-fns";
import { getExchangeRate } from "../../services/exchangeRateService";

const Extractions: React.FC = () => {
  // --- State original del componente ---
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"Western Union" | "Debit/MP">(
    "Western Union"
  );

  // --- State para la calculadora ---
  const [selectedCountry, setSelectedCountry] = useState("PY");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [amounts, setAmounts] = useState({ ars: "", foreign: "" });
  const [lastEdited, setLastEdited] = useState<"ars" | "foreign" | null>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);
  const [loadingRate, setLoadingRate] = useState(true);
  const [errorRate, setErrorRate] = useState<string | null>(null);

  // --- State para la edición en línea ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<{
    description: string;
    type: "Western Union" | "Debit/MP";
  }>({ description: "", type: "Western Union" });

  const {
    extractions,
    loading: loadingExtractions,
    fetchExtractions,
    handleCreate,
    handleUpdate,
    handleArchiveAll,
  } = useExtractions();

  // --- Lógica para la calculadora (sin cambios) ---
  const countryCurrency: { [key: string]: string } = {
    PY: "PYG",
    US: "USD",
    ES: "EUR",
    PE: "PEN",
    BO: "BOB",
    CL: "CLP",
  };
  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoadingRate(true);
        setErrorRate(null);
        const rateData = await getExchangeRate(selectedCountry);
        setExchangeRate(rateData.rate);
      } catch (err) {
        setErrorRate("No se pudo obtener la tasa de cambio.");
        setExchangeRate(null);
      } finally {
        setLoadingRate(false);
      }
    };
    fetchRate();
  }, [selectedCountry]);

  useEffect(() => {
    if (!exchangeRate) return;
    const calculate = () => {
      if (lastEdited === "ars") {
        const principalArs = parseFloat(amounts.ars);
        if (isNaN(principalArs) || principalArs <= 0) {
          setAmounts((prev) => ({ ...prev, foreign: "" }));
          setShippingCost(0);
          setTotalPayable(0);
          return;
        }
        const foreignAmount = principalArs * exchangeRate;
        setAmounts((prev) => ({ ...prev, foreign: foreignAmount.toFixed(2) }));
        const cost = principalArs * 0.05 * 1.21;
        setShippingCost(cost);
        setTotalPayable(principalArs + cost);
      } else if (lastEdited === "foreign") {
        const foreignAmount = parseFloat(amounts.foreign);
        if (isNaN(foreignAmount) || foreignAmount <= 0) {
          setAmounts((prev) => ({ ...prev, ars: "" }));
          setShippingCost(0);
          setTotalPayable(0);
          return;
        }
        const principalArs = foreignAmount / exchangeRate;
        setAmounts((prev) => ({ ...prev, ars: principalArs.toFixed(2) }));
        const cost = principalArs * 0.05 * 1.21;
        setShippingCost(cost);
        setTotalPayable(principalArs + cost);
      }
    };
    calculate();
  }, [amounts.ars, amounts.foreign, lastEdited, exchangeRate]);

  const handleArsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmounts({ ars: e.target.value, foreign: "" });
    setLastEdited("ars");
  };

  const handleForeignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmounts({ ars: "", foreign: e.target.value });
    setLastEdited("foreign");
  };

  // --- Lógica para la edición en línea ---
  const handleStartEdit = (extraction: any) => {
    setEditingId(extraction._id);
    setEditingData({
      description: extraction.description,
      type: extraction.type,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({ description: "", type: "Western Union" });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    await handleUpdate(editingId, editingData);
    setEditingId(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Lógica original del componente ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreate(description, type);
    setDescription("");
  };

  const getStatusVariant = (status: string) => {
    if (status === "Disponible") return "success";
    if (status === "Completado") return "secondary";
    return "primary";
  };

  const getBackgroundClass = (status: string) => {
    if (status === "Disponible") return "bg-success-subtle";
    if (status === "Completado") return "bg-light";
    return "";
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4 text-center fw-bold">
        💸 Solicitudes de extraccion de dinero
      </h1>
      {/* --- Calculadora de Envíos Compacta --*/}
      <Card className="mb-3 shadow-sm">
        <Card.Body className="py-2 px-3">
          <Row className="g-2 align-items-start">
            <Form.Label className="fw-medium mb-0">
              Cotización Rápida
            </Form.Label>

            <Col xs={12} sm={6} md={3}>
              <Form.Group className="mb-1">
                <Form.Label className="small fw-medium mb-0">
                  Usted envía (ARS)
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  value={amounts.ars}
                  onChange={handleArsChange}
                  placeholder="1000"
                />
              </Form.Group>
            </Col>

            <Col xs={12} sm={6} md={4}>
              <Form.Group className="mb-0">
                <Form.Label className="small fw-medium mb-0">
                  Destinatario recibe
                </Form.Label>
                <InputGroup size="sm">
                  <Form.Control
                    type="text"
                    value={amounts.foreign}
                    onChange={handleForeignChange}
                    placeholder="4986.30"
                  />
                  <Form.Select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    style={{ maxWidth: "160px" }}>
                    <option value="PY">PYG (Paraguay)</option>
                    <option value="US">USD (EEUU)</option>
                    <option value="ES">EUR (España)</option>
                    <option value="PE">PEN (Peru)</option>
                    <option value="BO">BOB (Bolivia)</option>
                    <option value="CL">CLP (Chile)</option>
                  </Form.Select>
                </InputGroup>
                {exchangeRate && !loadingRate && (
                  <Form.Text className="text-muted small">
                    1 ARS = {exchangeRate.toFixed(4)}{" "}
                    {countryCurrency[selectedCountry]}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group className="mb-0">
                <Form.Label className="small fw-medium mb-0">
                  Total a pagar (ARS)
                </Form.Label>
                <div
                  className="form-control form-control-sm bg-light fw-bold text-primary"
                  style={{ minHeight: "28px", padding: "4px 8px" }}>
                  {totalPayable > 0
                    ? totalPayable.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })
                    : "-"}
                </div>
              </Form.Group>
            </Col>
          </Row>

          {loadingRate && (
            <div className="text-center text-muted pt-1 small">
              Cargando tasa...
            </div>
          )}
          {errorRate && (
            <div className="text-center text-danger pt-1 small">
              {errorRate}
            </div>
          )}
        </Card.Body>
      </Card>

      <Card className="mb-4 shadow-sm">
        {" "}
        {/* Formulario Original */}
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="align-items-end g-3">
              <Col sm={12} md={6}>
                <Form.Label
                  htmlFor="description-extraction"
                  className="fw-medium">
                  Nueva Solicitud
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    id="description-extraction"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej., $5000 Cliente..."
                  />
                </InputGroup>
              </Col>
              <Col sm={12} md={4}>
                <Form.Label className="fw-medium">Tipo</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    label="Western Union"
                    name="typeExtraction"
                    id="type-wu"
                    checked={type === "Western Union"}
                    onChange={() => setType("Western Union")}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Debito/MP"
                    name="typeExtraction"
                    id="type-mp"
                    checked={type === "Debit/MP"}
                    onChange={() => setType("Debit/MP")}
                  />
                </div>
              </Col>
              <Col sm={12} md={2} className="d-grid">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loadingExtractions}>
                  <i className="bi bi-plus-lg me-1"></i> Agregar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      <Card className="shadow-sm">
        {" "}
        {/* Lista Original */}
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 d-inline-block">Solicitudes pendientes</h5>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => fetchExtractions()}
              disabled={loadingExtractions}
              className="ms-2">
              {loadingExtractions ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                <i className="bi bi-arrow-clockwise"></i>
              )}
            </Button>
          </div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleArchiveAll}
            disabled={loadingExtractions}>
            <i className="bi bi-archive-fill me-1"></i> Eliminar completadas
          </Button>
        </Card.Header>
        <ListGroup variant="flush">
          {extractions.length > 0 ? (
            extractions.map((e) => (
              <ListGroup.Item
                key={e._id}
                className={`d-flex justify-content-between align-items-center ${getBackgroundClass(
                  e.status
                )}`}>
                <div className="d-flex align-items-center flex-grow-1">
                  {/* --- Botón Editar (Izquierda) --- */}
                  {editingId !== e._id && e.status === "Pendiente" && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleStartEdit(e)}
                      className="me-3">
                      <i className="bi bi-pencil"></i>
                    </Button>
                  )}

                  {/* --- Descripción o Formulario de Edición --- */}
                  <div className="flex-grow-1">
                    {editingId === e._id ? (
                      <>
                        <InputGroup className="gap-2 mb-2">
                          <Form.Control
                            name="description"
                            value={editingData.description}
                            onChange={handleEditFormChange}
                          />
                          <div className="d-flex gap-2 mt-2">
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={handleSaveEdit}
                              style={{ minWidth: "90px" }}>
                              <i className="bi bi-check-lg"></i> Guardar
                            </Button>

                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={handleCancelEdit}
                              style={{ minWidth: "90px" }}>
                              <i className="bi bi-x-lg"></i> Cancelar
                            </Button>
                          </div>
                        </InputGroup>

                        <div className="d-flex gap-3">
                          <Form.Check
                            type="radio"
                            id={`wu-${e._id}`}
                            label="Western Union"
                            name="type"
                            value="Western Union"
                            checked={editingData.type === "Western Union"}
                            onChange={handleEditFormChange}
                          />
                          <Form.Check
                            type="radio"
                            id={`mp-${e._id}`}
                            label="Débito/MP"
                            name="type"
                            value="Debit/MP"
                            checked={editingData.type === "Debit/MP"}
                            onChange={handleEditFormChange}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <span
                          className={
                            e.status === "Completado"
                              ? "text-muted text-decoration-line-through"
                              : "fw-medium"
                          }>
                          {e.description}
                        </span>
                        <br />
                        <small className="text-muted">
                          {e.createdBy?.name} -{" "}
                          {format(new Date(e.createdAt), "HH:mm")}hs
                          <Badge
                            pill
                            bg={e.type === "Western Union" ? "warning" : "info"}
                            className="ms-2">
                            {e.type}
                          </Badge>
                          <Badge
                            pill
                            bg={getStatusVariant(e.status)}
                            className="ms-2 text-capitalize">
                            {e.status}
                          </Badge>
                        </small>
                      </>
                    )}
                  </div>
                </div>

                {/* --- Botones de Acción (Derecha, cuando NO está editando) --- */}
                <div>
                  {editingId !== e._id && (
                    <>
                      {e.status === "Pendiente" && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() =>
                            handleUpdate(e._id, { status: "Disponible" })
                          }>
                          <i className="bi bi-check-lg"></i> Disponible
                        </Button>
                      )}
                      {e.status === "Disponible" && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            handleUpdate(e._id, { status: "Completado" })
                          }>
                          <i className="bi bi-check-all"></i> Completado
                        </Button>
                      )}
                      {e.status === "Completado" && (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            handleUpdate(e._id, { isArchived: true })
                          }>
                          <i className="bi bi-archive"></i> Archivar
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item className="text-center text-muted">
              No hay solicitudes pendientes.
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </Container>
  );
};

export default Extractions;
