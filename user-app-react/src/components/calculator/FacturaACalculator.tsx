import { useMemo } from "react";
import { Form, Card, Row, Col, Button } from "react-bootstrap";
import { useCalculatorState } from "../../hooks/calculator/useCalculatorState";
import { useMarkups } from "../../hooks/calculator/useMarkups";
import { formatCurrency } from "../../utils/formatters";
import { MarkupCard } from "./shared/MarkupCard";
import { CalculatorHeader } from "./shared/CalculatorHeader";
import { TaxRatesCard, TaxConfig } from "./shared/TaxRatesCard";

export function FacturaACalculator() {
  const s = useCalculatorState();
  const { markups, isEditingMarkups, setIsEditingMarkups, calculatePrices } =
    useMarkups();

  const { costoUnitario, taxes, costoTotal } = useMemo(() => {
    const numImporte = Number(s.importe) || 0;
    const numCantidad = Number(s.cantidad) || 1;

    const iva = numImporte * (s.ivaRate / 100);
    const iibb = numImporte * (s.iibbRate / 100);
    const rg5329 = s.isRg5329Enabled ? numImporte * (s.rg5329Rate / 100) : 0;
    const finalCost = numImporte + iva + iibb + rg5329;

    const taxConfig: TaxConfig[] = [
      { label: "IVA", rate: s.ivaRate, setRate: s.setIvaRate, amount: iva },
      { label: "IIBB", rate: s.iibbRate, setRate: s.setIibbRate, amount: iibb },
      {
        label: "RG 5329",
        rate: s.rg5329Rate,
        setRate: s.setRg5329Rate,
        amount: rg5329,
        show: s.isRg5329Enabled,
      },
    ];

    return {
      costoUnitario: finalCost > 0 ? finalCost / numCantidad : 0,
      taxes: taxConfig,
      costoTotal: finalCost,
    };
  }, [s]);

  const { venta50, venta70, venta100 } = calculatePrices(costoUnitario);

  return (
    <Card bg="dark" text="white">
      <CalculatorHeader
        title="Calculadora - Factura A"
        onClear={s.clearInputs}
      />
      <Card.Body>
        <Row className="mb-3">
          <Col md={8}>
            <Form>
              <Row className="g-2">
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label>Neto</Form.Label>
                    <Form.Control
                      type="text"
                      value={s.importe}
                      onChange={(e: any) =>
                        s.handleInputChange(e, s.setImporte)
                      }
                      onFocus={(e) => e.target.select()}
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label>Cant.</Form.Label>
                    <Form.Control
                      type="text"
                      value={s.cantidad}
                      onChange={(e: any) =>
                        s.handleInputChange(e, s.setCantidad)
                      }
                      onFocus={(e) => e.target.select()}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col md={4} className="p-3">
            <TaxRatesCard
              taxes={taxes}
              isEditing={s.isEditingRates}
              setIsEditing={s.setIsEditingRates}
              showTaxes={s.showTaxes}
              setShowTaxes={s.setShowTaxes}
              switches={
                <Form.Check
                  type="switch"
                  label="Aplicar RG 5329"
                  checked={s.isRg5329Enabled}
                  onChange={(e) => s.setIsRg5329Enabled(e.target.checked)}
                  className="small"
                />
              }
            />
          </Col>
        </Row>

        <Card bg="secondary" className="p-2 mb-3 border-0">
          <Row className="text-center g-1 small">
            <Col>
              <h6 className="mb-0">Neto</h6>
              {formatCurrency(Number(s.importe))}
            </Col>
            {taxes
              .filter((t) => t.show !== false)
              .map((t, i) => (
                <Col key={i}>
                  <h6 className="mb-0">+{t.label}</h6>
                  {formatCurrency(t.amount)}
                </Col>
              ))}
            <Col className="border-start">
              <h6 className="mb-0">= Total</h6>
              <strong className="text-light">
                {formatCurrency(costoTotal)}
              </strong>
            </Col>
          </Row>
        </Card>

        <div className="d-flex justify-content-between align-items-center mb-2 px-1">
          <div className="d-flex align-items-center">
            <span className="fw-bold small me-2">MÁRGENES</span>
            <Button
              variant="outline-light"
              size="sm"
              className="py-0 px-1 border-0"
              onClick={() => setIsEditingMarkups(!isEditingMarkups)}>
              <i
                className={`bi ${isEditingMarkups ? "bi-floppy-fill text-success" : "bi-pencil-square"} small`}></i>
            </Button>
          </div>
          <div className="text-end">
            <span className="opacity-75 small me-2">COSTO UNIT.:</span>
            <span className="fw-bold text-info fs-5">
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
