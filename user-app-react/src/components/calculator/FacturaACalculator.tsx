import { useState, useMemo } from "react";
import {
  Form,
  Card,
  Row,
  Col,
  InputGroup,
  Button,
  Collapse,
} from "react-bootstrap";

export function FacturaACalculator() {
  // State for calculator inputs
  const [importe, setImporte] = useState<number | string>("");
  const [cantidad, setCantidad] = useState<number | string>(1);

  // State for editable tax rates
  const [ivaRate, setIvaRate] = useState<number>(21);
  const [iibbRate, setIibbRate] = useState<number>(4);
  const [rg5329Rate, setRg5329Rate] = useState<number>(3);
  const [isEditingRates, setIsEditingRates] = useState(false);
  const [isRg5329Enabled, setIsRg5329Enabled] = useState(false);
  const [showTaxes, setShowTaxes] = useState(true);

  // State for editable markups
  const [markup50, setMarkup50] = useState(50);
  const [markup70, setMarkup70] = useState(70);
  const [markup100, setMarkup100] = useState(100);
  const [isEditingMarkups, setIsEditingMarkups] = useState(false);

  const { costoUnitario, iva, iibb, rg5329, costoConImpuestos } =
    useMemo(() => {
      const numImporte = Number(String(importe).replace(",", ".")) || 0;
      const numCantidad = Number(cantidad) || 1;

      const ivaAmount = numImporte * (ivaRate / 100);
      const iibbAmount = numImporte * (iibbRate / 100);
      const rg5329Amount = isRg5329Enabled
        ? numImporte * (rg5329Rate / 100)
        : 0;
      const totalCostWithTaxes =
        numImporte + ivaAmount + iibbAmount + rg5329Amount;

      const finalUnitCost =
        totalCostWithTaxes > 0 && numCantidad > 0
          ? totalCostWithTaxes / numCantidad
          : 0;

      return {
        costoUnitario: finalUnitCost,
        iva: ivaAmount,
        iibb: iibbAmount,
        rg5329: rg5329Amount,
        costoConImpuestos: totalCostWithTaxes,
      };
    }, [importe, cantidad, ivaRate, iibbRate, rg5329Rate, isRg5329Enabled]);

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
    () => costoUnitario * (1 + markup50 / 100),
    [costoUnitario, markup50],
  );
  const venta70 = useMemo(
    () => costoUnitario * (1 + markup70 / 100),
    [costoUnitario, markup70],
  );
  const venta100 = useMemo(
    () => costoUnitario * (1 + markup100 / 100),
    [costoUnitario, markup100],
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
          Calculadora de Precios - Factura A
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
        <Row>
          <Col md={8}>
            <Form>
              <Row className="mb-2">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Importe Neto (sin impuestos)</Form.Label>
                    <Form.Control
                      type="text"
                      name="importe"
                      placeholder="100"
                      value={importe}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, setImporte)
                      }
                      onFocus={(e) => e.target.select()}
                    />
                  </Form.Group>{" "}
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Cantidad de Unidades</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="1"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      onFocus={(e) => e.target.select()}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col md={4}>
            <Card bg="secondary" className="p-1 p-sm-2">
              <div className="d-flex justify-content-between align-items-center mb-1 mb-sm-2">
                <h6 className="mb-0 small">Tasas de Impuestos</h6>
                <div>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="me-1 me-sm-2"
                    onClick={() => setShowTaxes(!showTaxes)}>
                    <i
                      className={
                        showTaxes ? "bi bi-eye-slash" : "bi bi-eye"
                      }></i>
                  </Button>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => setIsEditingRates(!isEditingRates)}>
                    {isEditingRates ? (
                      <i className="bi bi-floppy"></i>
                    ) : (
                      <i className="bi bi-pencil-square"></i>
                    )}
                  </Button>
                </div>
              </div>
              <Collapse in={showTaxes}>
                <div>
                  <Row className="align-items-center mb-1 g-1">
                    <Col xs={12} sm={3} className="text-start text-sm-center">
                      <Form.Label className="mb-0 small">IVA</Form.Label>
                    </Col>
                    <Col xs={5} sm={3}>
                      <InputGroup size="sm">
                        <Form.Control
                          type="text"
                          value={ivaRate}
                          onChange={(e) => setIvaRate(Number(e.target.value))}
                          readOnly={!isEditingRates}
                          className="text-end"
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup>
                    </Col>
                    <Col xs={7} sm={6}>
                      <Form.Control
                        size="sm"
                        readOnly
                        disabled
                        value={formatCurrency(iva)}
                        className="text-end"
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center mb-1 g-1">
                    <Col xs={12} sm={3} className="text-start text-sm-center">
                      <Form.Label className="mb-0 small">IIBB</Form.Label>
                    </Col>
                    <Col xs={5} sm={3}>
                      <InputGroup size="sm">
                        <Form.Control
                          type="text"
                          value={iibbRate}
                          onChange={(e) => setIibbRate(Number(e.target.value))}
                          readOnly={!isEditingRates}
                          className="text-end"
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup>
                    </Col>
                    <Col xs={7} sm={6}>
                      <Form.Control
                        size="sm"
                        readOnly
                        disabled
                        value={formatCurrency(iibb)}
                        className="text-end"
                      />
                    </Col>
                  </Row>
                  {isRg5329Enabled && (
                    <Row className="align-items-center g-1">
                      <Col xs={12} sm={3} className="text-start text-sm-center">
                        <Form.Label className="mb-0 small">5329</Form.Label>
                      </Col>
                      <Col xs={5} sm={3}>
                        <InputGroup size="sm">
                          <Form.Control
                            type="number"
                            value={rg5329Rate}
                            onChange={(e) =>
                              setRg5329Rate(Number(e.target.value))
                            }
                            readOnly={!isEditingRates}
                            className="text-end"
                          />
                          <InputGroup.Text>%</InputGroup.Text>
                        </InputGroup>
                      </Col>
                      <Col xs={7} sm={6}>
                        <Form.Control
                          size="sm"
                          readOnly
                          disabled
                          value={formatCurrency(rg5329)}
                          className="text-end"
                        />
                      </Col>
                    </Row>
                  )}
                  <hr className="border-light my-1" />
                  <Form.Check
                    type="switch"
                    id="rg5329-switch"
                    label="Aplicar RG 5329"
                    checked={isRg5329Enabled}
                    onChange={(e) => setIsRg5329Enabled(e.target.checked)}
                    className="small"
                  />
                </div>
              </Collapse>
            </Card>
          </Col>
        </Row>
        <hr className="my-2" />
        <Card bg="secondary" className="p-1 p-sm-2 mb-2">
          <Row className="text-center mb-1 mb-sm-2 g-1">
            <Col>
              <h6 className="small mb-0 mb-sm-1">Neto</h6>
              <span>
                <small className="text-muted">
                  {formatCurrency(Number(importe))}
                </small>
              </span>
            </Col>
            <Col>
              <h6 className="small mb-0 mb-sm-1">+IVA</h6>
              <span>
                <small className="text-muted">{formatCurrency(iva)}</small>
              </span>
            </Col>
            <Col>
              <h6 className="small mb-0 mb-sm-1">+IIBB</h6>
              <span>
                <small className="text-muted">{formatCurrency(iibb)}</small>
              </span>
            </Col>
            {isRg5329Enabled && (
              <Col>
                <h6 className="small mb-0 mb-sm-1">+5329</h6>
                <span>
                  <small className="text-muted">{formatCurrency(rg5329)}</small>
                </span>
              </Col>
            )}
            <Col>
              <h6 className="small mb-0 mb-sm-1">= Costo Total</h6>
              <span>
                <strong className="text-light">
                  {formatCurrency(costoConImpuestos)}
                </strong>
              </span>
            </Col>
          </Row>
        </Card>
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
            <h4 className="fw-bold">{formatCurrency(costoUnitario)}</h4>
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
