import { useMemo } from "react";
import { Form, Card, Row, Col, Button } from "react-bootstrap";
import { useCalculatorState } from "../../hooks/calculator/useCalculatorState";
import { useMarkups } from "../../hooks/calculator/useMarkups";
import { formatCurrency } from "../../utils/formatters";
import { MarkupCard } from "./shared/MarkupCard";
import { CalculatorHeader } from "./shared/CalculatorHeader";
import { TaxRatesCard, TaxConfig } from "./shared/TaxRatesCard";

export function BebidasCalculator() {
  const s = useCalculatorState();
  const { markups, isEditingMarkups, setIsEditingMarkups, calculatePrices } =
    useMarkups();

  const {
    costoUnitario,
    taxes,
    subtotalPositivo,
    subtotalNegativo,
    costoTotal,
  } = useMemo(() => {
    const numImporte = Number(s.importe) || 0;
    const numCantidad = Number(s.cantidad) || 1;
    const numInt = Number(s.impuestosInternos) || 0;
    const numDesc = Number(s.descuento) || 0;

    const iva = numImporte * (s.ivaRate / 100);
    const iibb = s.isIibbEnabled
      ? Math.max(0, numImporte - numDesc + numInt) * (s.iibbRate / 100)
      : 0;
    const percIva = s.isPercIvaEnabled ? numImporte * (s.percIvaRate / 100) : 0;
    const ivaDesc = numDesc * (s.ivaRate / 100);

    const totalPos = numImporte + numInt + iva + iibb + percIva;
    const totalNeg = numDesc + ivaDesc;
    const finalCost = totalPos - totalNeg;

    const taxConfig: TaxConfig[] = [
      { label: "IVA", rate: s.ivaRate, setRate: s.setIvaRate, amount: iva },
      {
        label: "IIBB",
        rate: s.iibbRate,
        setRate: s.setIibbRate,
        amount: iibb,
        show: s.isIibbEnabled,
      },
      {
        label: "Perc. IVA",
        rate: s.percIvaRate,
        setRate: s.setPercIvaRate,
        amount: percIva,
        show: s.isPercIvaEnabled,
      },
    ];

    return {
      costoUnitario: finalCost > 0 ? finalCost / numCantidad : 0,
      taxes: taxConfig,
      subtotalPositivo: { neto: numImporte, int: numInt, iva, iibb, percIva },
      subtotalNegativo: { desc: numDesc, ivaDesc },
      costoTotal: finalCost,
    };
  }, [s]);

  const { venta50, venta70, venta100 } = calculatePrices(costoUnitario);

  return (
    <Card bg="dark" text="white">
      <CalculatorHeader title="Calculadora - Bebidas" onClear={s.clearInputs} />
      <Card.Body>
        <Row className="mb-3">
          <Col md={8}>
            <Form>
              <Row className="g-2">
                <Col xs={3}>
                  <Form.Group>
                    <Form.Label className="small">Neto</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      value={s.importe}
                      onChange={(e: any) =>
                        s.handleInputChange(e, s.setImporte)
                      }
                      onFocus={(e) => e.target.select()}
                    />
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group>
                    <Form.Label className="small">Imp. Int.</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      value={s.impuestosInternos}
                      onChange={(e: any) =>
                        s.handleInputChange(e, s.setImpuestosInternos)
                      }
                      onFocus={(e) => e.target.select()}
                    />
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group>
                    <Form.Label className="small">Desc.</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      value={s.descuento}
                      onChange={(e: any) =>
                        s.handleInputChange(e, s.setDescuento)
                      }
                      onFocus={(e) => e.target.select()}
                    />
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group>
                    <Form.Label className="small">Cant.</Form.Label>
                    <Form.Control
                      size="sm"
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
          <Col md={4}>
            <TaxRatesCard
              taxes={taxes}
              isEditing={s.isEditingRates}
              setIsEditing={s.setIsEditingRates}
              showTaxes={s.showTaxes}
              setShowTaxes={s.setShowTaxes}
              switches={
                <>
                  <Form.Check
                    type="switch"
                    label="IIBB (Coca)"
                    checked={s.isIibbEnabled}
                    onChange={(e) => s.setIsIibbEnabled(e.target.checked)}
                    className="small mb-1"
                  />
                  <Form.Check
                    type="switch"
                    label="Perc. IVA (3%)"
                    checked={s.isPercIvaEnabled}
                    onChange={(e) => s.setIsPercIvaEnabled(e.target.checked)}
                    className="small"
                  />
                </>
              }
            />
          </Col>
        </Row>

        <Card bg="secondary" className="p-2 mb-3 border-0">
          <Row className="text-center g-1 flex-nowrap overflow-auto small">
            <Col className="min-width-col">
              <h6 className="mb-0">Neto</h6>
              {formatCurrency(subtotalPositivo.neto)}
            </Col>
            <Col className="min-width-col">
              <h6 className="mb-0">+Int.</h6>
              {formatCurrency(subtotalPositivo.int)}
            </Col>
            <Col className="min-width-col">
              <h6 className="mb-0">+IVA</h6>
              {formatCurrency(subtotalPositivo.iva)}
            </Col>
            {s.isIibbEnabled && (
              <Col className="min-width-col">
                <h6 className="mb-0">+IIBB</h6>
                {formatCurrency(subtotalPositivo.iibb)}
              </Col>
            )}
            {s.isPercIvaEnabled && (
              <Col className="min-width-col">
                <h6 className="mb-0">+P.IVA</h6>
                {formatCurrency(subtotalPositivo.percIva)}
              </Col>
            )}
            {subtotalNegativo.desc > 0 && (
              <Col className="min-width-col text-warning">
                <h6 className="mb-0">-Desc.</h6>
                {formatCurrency(subtotalNegativo.desc)}
              </Col>
            )}
            <Col className="min-width-col border-start">
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
