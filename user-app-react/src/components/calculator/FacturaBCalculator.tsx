import { useState, useMemo } from "react";
import { Form, Card, Row, Col, InputGroup, Button } from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";

export function FacturaBCalculator() {
  const [importe, setImporte] = useState<number | string>("");
  const [cantidad, setCantidad] = useState<number | string>(1);

  // State for editable markups
  const [markup50, setMarkup50] = useState(50);
  const [markup70, setMarkup70] = useState(70);
  const [markup100, setMarkup100] = useState(100);
  const [isEditingMarkups, setIsEditingMarkups] = useState(false);

  const costo = useMemo(() => {
    const numImporte =
      Number(String(importe).replace(/\./g, "").replace(",", ".")) || 0;
    const numCantidad = Number(cantidad);
    if (numCantidad === 0 || isNaN(numImporte) || isNaN(numCantidad)) return 0;
    return numImporte / numCantidad;
  }, [importe, cantidad]);

  const venta50 = useMemo(
    () => costo * (1 + markup50 / 100),
    [costo, markup50]
  );
  const venta70 = useMemo(
    () => costo * (1 + markup70 / 100),
    [costo, markup70]
  );
  const venta100 = useMemo(
    () => costo * (1 + markup100 / 100),
    [costo, markup100]
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  return (
    <Card bg="dark" text="white">
      <Card.Header>
        <Card.Title as="h5">Calculadora de Precios - Factura B</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          Ingresa el importe total y la cantidad de unidades de la factura para
          calcular el costo unitario y los precios de venta sugeridos.
        </Card.Text>
        <Form>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Importe Total de Factura</Form.Label>
                <CurrencyInput
                  name="importe"
                  placeholder="15000"
                  value={importe}
                  onValueChange={(value) => setImporte(value ?? "")}
                  onFocus={(e) => e.target.select()}
                  className="form-control"
                  prefix="$"
                  decimalSeparator=","
                  groupSeparator="."
                  allowDecimals={true}
                  decimalScale={2}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Cantidad de Unidades</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="10"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  />              </Form.Group>
            </Col>
          </Row>
        </Form>

        <hr />

        <div className="d-flex justify-content-end align-items-center mb-3">
          <h5 className="mb-0 me-3">Márgenes de Ganancia</h5>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => setIsEditingMarkups(!isEditingMarkups)}>
            {isEditingMarkups ? (
              <i className="bi bi-floppy"></i>
            ) : (
              <i className="bi bi-pencil-square"></i>
            )}
          </Button>
        </div>

        <Row className="text-center">
          <Col md={3} className="mb-3">
            <h6 className="text-white">Costo Unitario Final</h6>
            <h4 className="fw-bold">{formatCurrency(costo)}</h4>
          </Col>
          <Col md={3} className="mb-3">
            <Card bg="secondary" text="white" className="h-100">
              <Card.Body>
                <InputGroup size="sm" className="mb-2">
                  <Form.Control
                    type="number"
                    value={markup50}
                    onChange={(e) => setMarkup50(Number(e.target.value))}
                    readOnly={!isEditingMarkups}
                    className="text-end"
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                <Card.Text as="h5" className="fw-semibold">
                  {formatCurrency(venta50)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card bg="secondary" text="white" className="h-100">
              <Card.Body>
                <InputGroup size="sm" className="mb-2">
                  <Form.Control
                    type="number"
                    value={markup70}
                    onChange={(e) => setMarkup70(Number(e.target.value))}
                    readOnly={!isEditingMarkups}
                    className="text-end"
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                <Card.Text as="h5" className="fw-semibold">
                  {formatCurrency(venta70)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card bg="secondary" text="white" className="h-100">
              <Card.Body>
                <InputGroup size="sm" className="mb-2">
                  <Form.Control
                    type="number"
                    value={markup100}
                    onChange={(e) => setMarkup100(Number(e.target.value))}
                    readOnly={!isEditingMarkups}
                    className="text-end"
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                <Card.Text as="h5" className="fw-semibold">
                  {formatCurrency(venta100)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
