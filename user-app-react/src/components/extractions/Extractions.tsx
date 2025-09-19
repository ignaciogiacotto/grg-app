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
import { IExtraction } from "../../services/extractionService";

const formatCurrency = (value: number) => {
  if (isNaN(value) || value === 0) return "";
  return `$${new Intl.NumberFormat("es-AR").format(value)}`;
};

// Helper component for each column
const ExtractionColumn: React.FC<{
  title: string;
  extractions: IExtraction[];
  loading: boolean;
  onUpdate: (id: string, updates: any) => void;
  onStartEdit: (extraction: IExtraction) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditFormChange: (name: string, value: string) => void;
  editingId: string | null;
  editingData: any;
  isEditingAmountFocused: boolean;
  setIsEditingAmountFocused: (isFocused: boolean) => void;
}> = ({
  title,
  extractions,
  loading,
  onUpdate,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditFormChange,
  editingId,
  editingData,
  isEditingAmountFocused,
  setIsEditingAmountFocused,
}) => {
  const getStatusVariant = (status: string) => {
    if (status === "Disponible") return "success";
    if (status === "Avisado") return "info";
    if (status === "Completado") return "secondary";
    return "primary";
  };

  const getBackgroundClass = (status: string) => {
    if (status === "Disponible") return "bg-success-subtle";
    if (status === "Avisado") return "bg-info-subtle";
    if (status === "Completado") return "bg-light";
    return "";
  };

  return (
    <Card className="shadow-sm h-100">
      <Card.Header>
        <h5 className="mb-0">{title}</h5>
      </Card.Header>
      <ListGroup
        variant="flush"
        style={{ overflowY: "auto", maxHeight: "60vh" }}>
        {loading ? (
          <div className="text-center p-3">
            <Spinner animation="border" />
          </div>
        ) : extractions.length > 0 ? (
          extractions.map((e) => (
            <ListGroup.Item
              key={e._id}
              className={`d-flex justify-content-between align-items-center ${getBackgroundClass(
                e.status
              )}`}>
              <div className="d-flex align-items-center flex-grow-1">
                {editingId !== e._id && e.status === "Pendiente" && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => onStartEdit(e)}
                    className="me-3">
                    <i className="bi bi-pencil"></i>
                  </Button>
                )}

                <div className="flex-grow-1">
                  {editingId === e._id ? (
                    <>
                      <InputGroup className="gap-2 mb-2">
                        <Form.Control
                          name="amount"
                          value={
                            isEditingAmountFocused
                              ? editingData.amount
                              : formatCurrency(editingData.amount)
                          }
                          onChange={(ev) =>
                            onEditFormChange(
                              "amount",
                              ev.target.value.replace(/[^0-9]/g, "")
                            )
                          }
                          onFocus={() => setIsEditingAmountFocused(true)}
                          onBlur={() => setIsEditingAmountFocused(false)}
                        />
                        <Form.Control
                          name="clientNumber"
                          value={editingData.clientNumber}
                          onChange={(e) =>
                            onEditFormChange(e.target.name, e.target.value)
                          }
                        />
                        <div className="d-flex gap-2 mt-2">
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={onSaveEdit}
                            style={{ minWidth: "90px" }}>
                            <i className="bi bi-check-lg"></i> Guardar
                          </Button>

                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={onCancelEdit}
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
                          onChange={(e) =>
                            onEditFormChange(e.target.name, e.target.value)
                          }
                        />
                        <Form.Check
                          type="radio"
                          id={`mp-${e._id}`}
                          label="Débito/MP"
                          name="type"
                          value="Debit/MP"
                          checked={editingData.type === "Debit/MP"}
                          onChange={(e) =>
                            onEditFormChange(e.target.name, e.target.value)
                          }
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
                        {`${formatCurrency(e.amount)} - N°: ${e.clientNumber}`}
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

              <div>
                {editingId !== e._id && (
                  <>
                    {e.status === "Pendiente" && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() =>
                          onUpdate(e._id, { status: "Disponible" })
                        }>
                        <i className="bi bi-check-lg"></i> Disponible
                      </Button>
                    )}
                    {e.status === "Disponible" && (
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => onUpdate(e._id, { status: "Avisado" })}>
                        <i className="bi bi-bell"></i> Avisado
                      </Button>
                    )}
                    {e.status === "Avisado" && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          onUpdate(e._id, { status: "Completado" })
                        }>
                        <i className="bi bi-check-all"></i> Completado
                      </Button>
                    )}
                    {e.status === "Completado" && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => onUpdate(e._id, { isArchived: true })}>
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
            No hay solicitudes.
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

const Extractions: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const [isEditingAmountFocused, setIsEditingAmountFocused] = useState(false);
  const [type, setType] = useState<"Western Union" | "Debit/MP">(
    "Western Union"
  );

  // --- State para la calculadora ---
  const [selectedCountry, setSelectedCountry] = useState("PY");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [amounts, setAmounts] = useState({ ars: "", foreign: "" });
  const [lastEdited, setLastEdited] = useState<"ars" | "foreign" | null>(null);
  const [totalPayable, setTotalPayable] = useState(0);
  const [loadingRate, setLoadingRate] = useState(true);
  const [errorRate, setErrorRate] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<{
    amount: number;
    clientNumber: string;
    type: "Western Union" | "Debit/MP";
  }>({ amount: 0, clientNumber: "", type: "Western Union" });

  const {
    pendingExtractions,
    confirmedExtractions,
    completedExtractions,
    loading: loadingExtractions,
    fetchExtractions,
    handleCreate,
    handleUpdate,
    handleArchiveAll,
  } = useExtractions();

  // --- Lógica para la calculadora ---
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
          setTotalPayable(0);
          return;
        }
        const foreignAmount = principalArs * exchangeRate;
        setAmounts((prev) => ({ ...prev, foreign: foreignAmount.toFixed(2) }));
        const cost = principalArs * 0.05 * 1.21;
        setTotalPayable(principalArs + cost);
      } else if (lastEdited === "foreign") {
        const foreignAmount = parseFloat(amounts.foreign);
        if (isNaN(foreignAmount) || foreignAmount <= 0) {
          setAmounts((prev) => ({ ...prev, ars: "" }));
          setTotalPayable(0);
          return;
        }
        const principalArs = foreignAmount / exchangeRate;
        setAmounts((prev) => ({ ...prev, ars: principalArs.toFixed(2) }));
        const cost = principalArs * 0.05 * 1.21;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreate(amount, clientNumber, type);
    setAmount("");
    setClientNumber("");
  };

  const handleStartEdit = (extraction: IExtraction) => {
    setEditingId(extraction._id);
    setEditingData({
      amount: extraction.amount,
      clientNumber: extraction.clientNumber,
      type: extraction.type,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    await handleUpdate(editingId, editingData);
    setEditingId(null);
  };

  const handleEditFormChange = (name: string, value: string) => {
    setEditingData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4 text-center fw-bold">
        💸 Solicitudes de extracción de dinero
      </h1>

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

      <Card className="mb-3 shadow-sm">
        <Card.Body>
        <Form.Label className="fw-medium mb-2">
              Nueva Solicitud
            </Form.Label>
          <Form onSubmit={handleSubmit}>
            <Row className="align-items-end g-3">
              <Col sm={12} md={3}>
                <Form.Label htmlFor="amount-extraction" className="fw-medium">
                  Monto
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    id="amount-extraction"
                    value={
                      isAmountFocused ? amount : formatCurrency(Number(amount))
                    }
                    onChange={(e) =>
                      setAmount(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    onFocus={() => setIsAmountFocused(true)}
                    onBlur={() => setIsAmountFocused(false)}
                    placeholder="Ej., 100000"
                  />
                </InputGroup>
              </Col>
              <Col sm={12} md={3}>
                <Form.Label
                  htmlFor="client-number-extraction"
                  className="fw-medium">
                  Número de Cliente
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    id="client-number-extraction"
                    value={clientNumber}
                    onChange={(e) => setClientNumber(e.target.value)}
                    placeholder="Ej., 123456789"
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

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => fetchExtractions()}
            disabled={loadingExtractions}>
            {loadingExtractions ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              <i className="bi bi-arrow-clockwise"></i>
            )}
            <span className="ms-2">Refrescar</span>
          </Button>
        </div>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={handleArchiveAll}
          disabled={loadingExtractions}>
          <i className="bi bi-archive-fill me-1"></i> Eliminar completadas
        </Button>
      </div>

      <Row>
        <Col md={4}>
          <ExtractionColumn
            title="Pendientes"
            extractions={pendingExtractions}
            loading={loadingExtractions}
            onUpdate={handleUpdate}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            onEditFormChange={handleEditFormChange}
            editingId={editingId}
            editingData={editingData}
            isEditingAmountFocused={isEditingAmountFocused}
            setIsEditingAmountFocused={setIsEditingAmountFocused}
          />
        </Col>
        <Col md={4}>
          <ExtractionColumn
            title="Confirmadas"
            extractions={confirmedExtractions}
            loading={loadingExtractions}
            onUpdate={handleUpdate}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            onEditFormChange={handleEditFormChange}
            editingId={editingId}
            editingData={editingData}
            isEditingAmountFocused={isEditingAmountFocused}
            setIsEditingAmountFocused={setIsEditingAmountFocused}
          />
        </Col>
        <Col md={4}>
          <ExtractionColumn
            title="Completadas"
            extractions={completedExtractions}
            loading={loadingExtractions}
            onUpdate={handleUpdate}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            onEditFormChange={handleEditFormChange}
            editingId={editingId}
            editingData={editingData}
            isEditingAmountFocused={isEditingAmountFocused}
            setIsEditingAmountFocused={setIsEditingAmountFocused}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Extractions;
