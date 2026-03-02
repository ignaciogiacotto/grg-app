import { useState, useMemo } from "react";
import { Form, Card, Row, Col, Button } from "react-bootstrap";
import { useMarkups } from "../../hooks/calculator/useMarkups";
import { formatCurrency } from "../../utils/formatters";
import { MarkupCard } from "./shared/MarkupCard";
import { CalculatorHeader } from "./shared/CalculatorHeader";

export function FacturaBCalculator() {
  const [importe, setImporte] = useState<string>("");
  const [cantidad, setCantidad] = useState<string>("1");
  const { markups, isEditingMarkups, setIsEditingMarkups, calculatePrices } = useMarkups();

  const costoUnitario = useMemo(() => {
    const numImporte = Number(importe.replace(",", ".")) || 0;
    const numCantidad = Number(cantidad) || 1;
    return numCantidad > 0 ? numImporte / numCantidad : 0;
  }, [importe, cantidad]);

  const { venta50, venta70, venta100 } = calculatePrices(costoUnitario);

  const handleClear = () => {
    setImporte("");
    setCantidad("1");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const val = e.target.value.replace(/,/, ".").replace(/[^\d.]/g, "");
    if (val.split(".").length <= 2) setter(val);
  };

  return (
    <Card bg="dark" text="white">
      <CalculatorHeader title="Calculadora de Precios - Factura B" onClear={handleClear} />
      <Card.Body>
        <Form>
          <Row className="mb-4 g-2 g-md-3">
            <Col xs={6}>
              <Form.Group>
                <Form.Label>Importe Total Factura</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="15000"
                  value={importe}
                  onChange={(e: any) => handleInputChange(e, setImporte)}
                  onFocus={(e) => e.target.select()}
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group>
                <Form.Label>Unidades</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="10"
                  value={cantidad}
                  onChange={(e) => handleInputChange(e, setCantidad)}
                  onFocus={(e) => e.target.select()}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        <hr className="my-2 border-secondary opacity-25" />

        <div className="d-flex justify-content-between align-items-center mb-2 px-1">
          <div className="d-flex align-items-center">
            <span className="fw-bold text-uppercase small me-2 text-white">Márgenes</span>
            <Button
              variant="outline-light"
              size="sm"
              className="py-0 px-1 border-0"
              onClick={() => setIsEditingMarkups(!isEditingMarkups)}>
              <i className={`bi ${isEditingMarkups ? "bi-floppy-fill text-success" : "bi-pencil-square text-white-50"} small`}></i>
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
          {markups.map((m, idx) => (
            <Col key={idx} xs={12} md={4}>
              <MarkupCard 
                value={m.value} 
                setter={m.setter} 
                price={idx === 0 ? venta50 : idx === 1 ? venta70 : venta100} 
                isEditing={isEditingMarkups} 
              />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
}
