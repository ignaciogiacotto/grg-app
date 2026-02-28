import { useState, useMemo } from "react";
import { Form, Card, Row, Col, InputGroup, Button } from "react-bootstrap";

export function FacturaBCalculator() {
  const [importe, setImporte] = useState<number | string>("");
  const [cantidad, setCantidad] = useState<number | string>(1);

  // State for editable markups
  const [markup50, setMarkup50] = useState(50);
  const [markup70, setMarkup70] = useState(70);
  const [markup100, setMarkup100] = useState(100);
  const [isEditingMarkups, setIsEditingMarkups] = useState(false);

  const costo = useMemo(() => {
    const numImporte = Number(String(importe).replace(",", ".")) || 0;
    const numCantidad = Number(cantidad);
    if (numCantidad === 0 || isNaN(numImporte) || isNaN(numCantidad)) return 0;
    return numImporte / numCantidad;
  }, [importe, cantidad]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: number | string) => void,
  ) => {
    const value = e.target.value;
    // Allow only numbers and one decimal separator ("." or ",")
    const sanitizedValue = value.replace(/,/, ".").replace(/[^\d.]/g, "");
    const parts = sanitizedValue.split(".");
    if (parts.length > 2) {
      // More than one decimal separator, ignore the last one
      return;
    }
    setter(sanitizedValue);
  };

  const venta50 = useMemo(
    () => costo * (1 + markup50 / 100),
    [costo, markup50],
  );
  const venta70 = useMemo(
    () => costo * (1 + markup70 / 100),
    [costo, markup70],
  );
  const venta100 = useMemo(
    () => costo * (1 + markup100 / 100),
    [costo, markup100],
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  const handleLimpiar = () => {
    setImporte("");
    setCantidad(1);
  };

  return (
    <Card bg="dark" text="white">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Card.Title as="h5" className="mb-0">
          Calculadora de Precios - Factura B
        </Card.Title>
        <Button
          variant="outline-light"
          size="sm"
          onClick={handleLimpiar}
          title="Borrar importe y cantidad">
          <i className="bi bi-arrow-counterclockwise me-1"></i>
          Limpiar
        </Button>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row className="mb-4 g-2 g-md-3">
            <Col xs={6} md={6}>
              <Form.Group>
                <Form.Label>Importe Total de Factura</Form.Label>
                <Form.Control
                  type="text"
                  name="importe"
                  placeholder="15000"
                  value={importe}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, setImporte)
                  }
                  onFocus={(e) => e.target.select()}
                />
              </Form.Group>{" "}
            </Col>
            <Col xs={6} md={6}>
              <Form.Group>
                <Form.Label>Cantidad de Unidades</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="10"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  onFocus={(e) => e.target.select()}
                />{" "}
              </Form.Group>
            </Col>
          </Row>
        </Form>

        <hr className="my-2 border-secondary opacity-25" />

        <div className="d-flex justify-content-between align-items-center mb-2 px-1">
          <div className="d-flex align-items-center">
            <span
              className="fw-bold text-uppercase small me-2 text-white"
              style={{ letterSpacing: "0.5px" }}>
              Márgenes
            </span>
            <Button
              variant="outline-light"
              size="sm"
              className="py-0 px-1 border-0"
              onClick={() => setIsEditingMarkups(!isEditingMarkups)}>
              {isEditingMarkups ? (
                <i className="bi bi-floppy-fill text-success small"></i>
              ) : (
                <i className="bi bi-pencil-square text-white-50 small"></i>
              )}
            </Button>
          </div>
          <div className="text-end">
            <span className="text-white opacity-75 me-2">COSTO UNIT.:</span>
            <span className="fw-bold text-info" style={{ fontSize: "1.3rem" }}>
              {formatCurrency(costo)}
            </span>
          </div>
        </div>

        <Row className="g-2">
          {[
            { value: markup50, setter: setMarkup50, price: venta50 },
            { value: markup70, setter: setMarkup70, price: venta70 },
            { value: markup100, setter: setMarkup100, price: venta100 },
          ].map((item, idx) => (
            <Col key={idx} xs={12} md={4}>
              <Card
                bg="secondary"
                className="border-0 shadow-sm overflow-hidden">
                <div
                  className="d-flex align-items-stretch"
                  style={{ minHeight: "45px" }}>
                  {/* Lado del Porcentaje (Configuración) */}
                  <div
                    className="bg-white d-flex align-items-center px-3"
                    style={{ minWidth: "100px" }}>
                    <Form.Control
                      type="number"
                      value={item.value}
                      onChange={(e) => item.setter(Number(e.target.value))}
                      readOnly={!isEditingMarkups}
                      className={`p-0 border-0 bg-transparent text-dark fw-bold ${!isEditingMarkups ? "pe-none" : "border-bottom border-dark"}`}
                      style={{
                        width: "60px",
                        fontSize: "1rem",
                        textAlign: "center",
                        outline: "none",
                        boxShadow: "none",
                      }}
                    />
                    <span className="ms-1 small text-dark opacity-75 fw-bold">
                      %
                    </span>
                  </div>

                  {/* Lado del Precio (Resultado) */}
                  <div className="flex-grow-1 d-flex align-items-center justify-content-end px-3 py-2">
                    <span
                      className="fw-bold text-white"
                      style={{ fontSize: "1.2rem" }}>
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
}
