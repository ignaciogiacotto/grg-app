import { useState, useMemo } from "react";
import { Form, Card, Row, Col, InputGroup, Button } from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";

export function BebidasCalculator() {
  // Manual inputs
  const [importe, setImporte] = useState<number | string>("");
  const [cantidad, setCantidad] = useState<number | string>(1);
  const [impuestosInternos, setImpuestosInternos] = useState<number | string>(
    ""
  );
  const [descuento, setDescuento] = useState<number | string>("");

  // Tax rates and controls
  const [ivaRate, setIvaRate] = useState<number>(21);
  const [iibbRate, setIibbRate] = useState<number>(4);
  const [isEditingRates, setIsEditingRates] = useState(false);
  const [isIibbEnabled, setIsIibbEnabled] = useState(false);

  // State for editable markups
  const [markup50, setMarkup50] = useState(50);
  const [markup70, setMarkup70] = useState(70);
  const [markup100, setMarkup100] = useState(100);
  const [isEditingMarkups, setIsEditingMarkups] = useState(false);

  const { costoUnitario, subtotalPositivo, subtotalNegativo, costoTotal } =
    useMemo(() => {
      const numImporte =
        Number(String(importe).replace(/\./g, "").replace(",", ".")) || 0;
      const numCantidad = Number(cantidad) || 1;
      const numImpInternos =
        Number(
          String(impuestosInternos).replace(/\./g, "").replace(",", ".")
        ) || 0;
      const numDescuento =
        Number(String(descuento).replace(/\./g, "").replace(",", ".")) || 0;

      const ivaAmount = numImporte * (ivaRate / 100);
      const iibbBase = numImporte - numDescuento + numImpInternos;
      const iibbAmount = isIibbEnabled
        ? Math.max(0, iibbBase) * (iibbRate / 100)
        : 0;
      const ivaDescuentoAmount = numDescuento * (ivaRate / 100);

      const totalPositivo =
        numImporte + numImpInternos + ivaAmount + iibbAmount;
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
      isIibbEnabled,
    ]);

  const venta50 = useMemo(
    () => costoUnitario * (1 + markup50 / 100),
    [costoUnitario, markup50]
  );
  const venta70 = useMemo(
    () => costoUnitario * (1 + markup70 / 100),
    [costoUnitario, markup70]
  );
  const venta100 = useMemo(
    () => costoUnitario * (1 + markup100 / 100),
    [costoUnitario, markup100]
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
        <Card.Title as="h5">Calculadora de Precios - Bebidas</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={8}>
            <Form>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Importe</Form.Label>
                    <CurrencyInput
                      name="importe"
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
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Imp. Internos</Form.Label>
                    <CurrencyInput
                      name="impuestosInternos"
                      value={impuestosInternos}
                      onValueChange={(value) => setImpuestosInternos(value ?? "")}
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
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Descuento</Form.Label>
                    <CurrencyInput
                      name="descuento"
                      value={descuento}
                      onValueChange={(value) => setDescuento(value ?? "")}
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
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
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
            <Card bg="secondary" className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Tasas de Impuestos</h6>
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
              <Row className="align-items-center mb-2">
                <Col xs={2} className="ps-1 pe-0">
                  <Form.Label className="mb-0 small">IVA</Form.Label>
                </Col>
                <Col xs={4} className="px-1">
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
                <Col xs={6} className="ps-1 pe-0">
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
                <Row className="align-items-center">
                  <Col xs={2} className="ps-1 pe-0">
                    <Form.Label className="mb-0 small">IIBB</Form.Label>
                  </Col>
                  <Col xs={4} className="px-1">
                    <InputGroup size="sm">
                      <Form.Control
                        type="number"
                        value={iibbRate}
                        onChange={(e) => setIibbRate(Number(e.target.value))}
                        readOnly={!isEditingRates}
                        className="text-end"
                      />
                      <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
                  </Col>
                  <Col xs={6} className="ps-1 pe-0">
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
              <hr className="border-light" />
              <Form.Check
                type="switch"
                id="iibb-switch"
                label="Calcular IIBB (Coca-Cola)"
                checked={isIibbEnabled}
                onChange={(e) => setIsIibbEnabled(e.target.checked)}
              />
            </Card>
          </Col>
        </Row>
        <hr />
        <Card bg="secondary" className="p-3 mb-4">
          <Row className="text-center">
            <Col>
              <h6>Subtotal</h6>
              <span className="small">
                {formatCurrency(subtotalPositivo.importe)}
              </span>
            </Col>
            <Col>
              <h6>+ Int.</h6>
              <span className="small">
                {formatCurrency(subtotalPositivo.internos)}
              </span>
            </Col>
            <Col>
              <h6>+ IVA</h6>
              <span className="small">
                {formatCurrency(subtotalPositivo.iva)}
              </span>
            </Col>
            {isIibbEnabled && (
              <Col>
                <h6>+ IIBB</h6>
                <span className="small">
                  {formatCurrency(subtotalPositivo.iibb)}
                </span>
              </Col>
            )}
            {Number(descuento) > 0 && (
              <Col>
                <h6>- Desc.</h6>
                <span className="small">
                  {formatCurrency(subtotalNegativo.descuento)}
                </span>
              </Col>
            )}
            {Number(descuento) > 0 && (
              <Col>
                <h6>- IVA Desc.</h6>
                <span className="small">
                  {formatCurrency(subtotalNegativo.ivaDescuento)}
                </span>
              </Col>
            )}
            <Col>
              <h6>= Costo Total</h6>
              <strong className="text-light">
                {formatCurrency(costoTotal)}
              </strong>
            </Col>
          </Row>
        </Card>
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
};
