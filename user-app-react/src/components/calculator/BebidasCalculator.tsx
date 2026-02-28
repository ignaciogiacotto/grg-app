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

export function BebidasCalculator() {
  // Manual inputs
  const [importe, setImporte] = useState<number | string>("");
  const [cantidad, setCantidad] = useState<number | string>(1);
  const [impuestosInternos, setImpuestosInternos] = useState<number | string>(
    "",
  );
  const [descuento, setDescuento] = useState<number | string>("");

  // Tax rates and controls
  const [ivaRate, setIvaRate] = useState<number>(21);
  const [iibbRate, setIibbRate] = useState<number>(4);
  const [percIvaRate, setPercIvaRate] = useState<number>(3);
  const [isEditingRates, setIsEditingRates] = useState(false);
  const [isIibbEnabled, setIsIibbEnabled] = useState(false);
  const [isPercIvaEnabled, setIsPercIvaEnabled] = useState(false);
  const [showTaxes, setShowTaxes] = useState(true);

  // State for editable markups
  const [markup50, setMarkup50] = useState(50);
  const [markup70, setMarkup70] = useState(70);
  const [markup100, setMarkup100] = useState(100);
  const [isEditingMarkups, setIsEditingMarkups] = useState(false);

  const { costoUnitario, subtotalPositivo, subtotalNegativo, costoTotal } =
    useMemo(() => {
      const numImporte = Number(String(importe).replace(",", ".")) || 0;
      const numCantidad = Number(cantidad) || 1;
      const numImpInternos =
        Number(String(impuestosInternos).replace(",", ".")) || 0;
      const numDescuento = Number(String(descuento).replace(",", ".")) || 0;

      const ivaAmount = numImporte * (ivaRate / 100);
      const iibbBase = numImporte - numDescuento + numImpInternos;
      const iibbAmount = isIibbEnabled
        ? Math.max(0, iibbBase) * (iibbRate / 100)
        : 0;

      const percIvaAmount = isPercIvaEnabled
        ? numImporte * (percIvaRate / 100)
        : 0;

      const ivaDescuentoAmount = numDescuento * (ivaRate / 100);

      const totalPositivo =
        numImporte + numImpInternos + ivaAmount + iibbAmount + percIvaAmount;
      const totalNegativo = numDescuento + ivaDescuentoAmount;
      const finalCost = totalPositivo - totalNegativo;

      const finalUnitCost =
        finalCost > 0 && numCantidad > 0 ? finalCost / numCantidad : 0;

      return {
        costoUnitario: finalUnitCost,
        subtotalPositivo: {
          importe: numImporte,
          internos: numImpInternos,
          iva: ivaAmount,
          iibb: iibbAmount,
          percIva: percIvaAmount,
        },
        subtotalNegativo: {
          descuento: numDescuento,
          ivaDescuento: ivaDescuentoAmount,
        },
        costoTotal: finalCost,
      };
    }, [
      importe,
      cantidad,
      impuestosInternos,
      descuento,
      ivaRate,
      iibbRate,
      percIvaRate,
      isIibbEnabled,
      isPercIvaEnabled,
    ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: number | string) => void,
  ) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/,/, ".").replace(/[^\d.]/g, "");
    const parts = sanitizedValue.split(".");
    if (parts.length > 2) {
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
    setImpuestosInternos("");
    setDescuento("");
    setCantidad(1);
  };

  return (
    <Card bg="dark" text="white">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Card.Title as="h5" className="mb-0">
          Calculadora de Precios - Bebidas
        </Card.Title>
        <Button
          variant="outline-light"
          size="sm"
          onClick={handleLimpiar}
          title="Borrar importe, impuestos, descuento y cantidad">
          <i className="bi bi-arrow-counterclockwise me-1"></i>
          Limpiar
        </Button>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={8}>
            <Form>
              <Row className="g-1 g-md-2">
                <Col xs={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '0.7rem' }}>Importe</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      name="importe"
                      value={importe}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, setImporte)
                      }
                      onFocus={(e) => e.target.select()}
                    />
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '0.7rem' }}>Imp. Int.</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      name="impuestosInternos"
                      value={impuestosInternos}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, setImpuestosInternos)
                      }
                      onFocus={(e) => e.target.select()}
                    />
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '0.7rem' }}>Desc.</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      name="descuento"
                      value={descuento}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, setDescuento)
                      }
                      onFocus={(e) => e.target.select()}
                    />
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '0.7rem' }}>Cant.</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
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
                          type="number"
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
                        value={formatCurrency(subtotalPositivo.iva)}
                        className="text-end"
                      />
                    </Col>
                  </Row>
                  {isIibbEnabled && (
                    <Row className="align-items-center mb-1 g-1">
                      <Col xs={12} sm={3} className="text-start text-sm-center">
                        <Form.Label className="mb-0 small">IIBB</Form.Label>
                      </Col>
                      <Col xs={5} sm={3}>
                        <InputGroup size="sm">
                          <Form.Control
                            type="number"
                            value={iibbRate}
                            onChange={(e) =>
                              setIibbRate(Number(e.target.value))
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
                          value={formatCurrency(subtotalPositivo.iibb)}
                          className="text-end"
                        />
                      </Col>
                    </Row>
                  )}
                  {isPercIvaEnabled && (
                    <Row className="align-items-center g-1">
                      <Col xs={12} sm={3} className="text-start text-sm-center">
                        <Form.Label className="mb-0 small">Perc. IVA</Form.Label>
                      </Col>
                      <Col xs={5} sm={3}>
                        <InputGroup size="sm">
                          <Form.Control
                            type="number"
                            value={percIvaRate}
                            onChange={(e) =>
                              setPercIvaRate(Number(e.target.value))
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
                          value={formatCurrency(subtotalPositivo.percIva)}
                          className="text-end"
                        />
                      </Col>
                    </Row>
                  )}
                  <hr className="border-light my-1" />
                  <Form.Check
                    type="switch"
                    id="iibb-switch"
                    label="Calcular IIBB (Coca-Cola)"
                    checked={isIibbEnabled}
                    onChange={(e) => setIsIibbEnabled(e.target.checked)}
                    className="small mb-1"
                  />
                  <Form.Check
                    type="switch"
                    id="perc-iva-switch"
                    label="Calcular Perc. IVA (3%)"
                    checked={isPercIvaEnabled}
                    onChange={(e) => setIsPercIvaEnabled(e.target.checked)}
                    className="small"
                  />
                </div>
              </Collapse>
            </Card>
          </Col>
        </Row>

        <hr className="my-2 border-secondary opacity-25" />
        <Card bg="secondary" className="p-1 p-sm-2 mb-2">
          <Row className="text-center mb-1 mb-sm-2 g-1 flex-nowrap flex-sm-wrap overflow-auto">
            <Col className="min-width-col">
              <h6 className="small mb-0 mb-sm-1">Neto</h6>
              <span className="small">{formatCurrency(subtotalPositivo.importe)}</span>
            </Col>
            <Col className="min-width-col">
              <h6 className="small mb-0 mb-sm-1">+Int.</h6>
              <span className="small">{formatCurrency(subtotalPositivo.internos)}</span>
            </Col>
            <Col className="min-width-col">
              <h6 className="small mb-0 mb-sm-1">+IVA</h6>
              <span className="small">{formatCurrency(subtotalPositivo.iva)}</span>
            </Col>
            {isIibbEnabled && (
              <Col className="min-width-col">
                <h6 className="small mb-0 mb-sm-1">+IIBB</h6>
                <span className="small">{formatCurrency(subtotalPositivo.iibb)}</span>
              </Col>
            )}
            {isPercIvaEnabled && (
              <Col className="min-width-col">
                <h6 className="small mb-0 mb-sm-1">+Perc.IVA</h6>
                <span className="small">{formatCurrency(subtotalPositivo.percIva)}</span>
              </Col>
            )}
            {Number(descuento) > 0 && (
              <Col className="min-width-col">
                <h6 className="small mb-0 mb-sm-1">-Desc.</h6>
                <span className="small">{formatCurrency(subtotalNegativo.descuento)}</span>
              </Col>
            )}
            {Number(descuento) > 0 && (
              <Col className="min-width-col">
                <h6 className="small mb-0 mb-sm-1">-IVA Desc.</h6>
                <span className="small">{formatCurrency(subtotalNegativo.ivaDescuento)}</span>
              </Col>
            )}
            <Col className="min-width-col">
              <h6 className="small mb-0 mb-sm-1">= Total</h6>
              <strong className="text-light">{formatCurrency(costoTotal)}</strong>
            </Col>
          </Row>
        </Card>

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
              {formatCurrency(costoUnitario)}
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
