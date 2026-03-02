import { Card, Button, Collapse, Row, Col, Form, InputGroup } from "react-bootstrap";
import { formatCurrency } from "../../../utils/formatters";

export interface TaxConfig {
  label: string;
  rate: number;
  setRate: (val: number) => void;
  amount: number;
  show?: boolean;
}

interface TaxRatesCardProps {
  taxes: TaxConfig[];
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  showTaxes: boolean;
  setShowTaxes: (val: boolean) => void;
  switches?: React.ReactNode;
}

export const TaxRatesCard = ({ 
  taxes, 
  isEditing, 
  setIsEditing, 
  showTaxes, 
  setShowTaxes,
  switches 
}: TaxRatesCardProps) => {
  return (
    <Card bg="secondary" className="p-1 p-sm-2 border-0 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-1 mb-sm-2">
        <h6 className="mb-0 small fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>
          Tasas de Impuestos
        </h6>
        <div>
          <Button
            variant="outline-light"
            size="sm"
            className="me-1 border-0"
            onClick={() => setShowTaxes(!showTaxes)}>
            <i className={showTaxes ? "bi bi-eye-slash" : "bi bi-eye"}></i>
          </Button>
          <Button
            variant="outline-light"
            size="sm"
            className="border-0"
            onClick={() => setIsEditing(!isEditing)}>
            <i className={`bi ${isEditing ? "bi-floppy-fill text-success" : "bi-pencil-square"}`}></i>
          </Button>
        </div>
      </div>
      <Collapse in={showTaxes}>
        <div>
          {taxes.filter(t => t.show !== false).map((tax, idx) => (
            <Row key={idx} className="align-items-center mb-1 g-1">
              <Col xs={3} className="text-start">
                <Form.Label className="mb-0 small" style={{ fontSize: '0.75rem' }}>{tax.label}</Form.Label>
              </Col>
              <Col xs={4}>
                <InputGroup size="sm">
                  <Form.Control
                    type="number"
                    value={tax.rate}
                    onChange={(e) => tax.setRate(Number(e.target.value))}
                    readOnly={!isEditing}
                    className="text-end p-1"
                  />
                  <InputGroup.Text className="p-1" style={{ fontSize: '0.7rem' }}>%</InputGroup.Text>
                </InputGroup>
              </Col>
              <Col xs={5}>
                <div className="form-control form-control-sm text-end bg-dark text-light border-0 py-1 px-2" style={{ fontSize: '0.8rem' }}>
                  {formatCurrency(tax.amount)}
                </div>
              </Col>
            </Row>
          ))}
          {switches && (
            <>
              <hr className="border-light my-1 opacity-25" />
              <div className="mt-1">
                {switches}
              </div>
            </>
          )}
        </div>
      </Collapse>
    </Card>
  );
};
