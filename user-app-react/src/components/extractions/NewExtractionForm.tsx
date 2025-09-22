import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";

interface NewExtractionFormProps {
  handleCreate: (amount: string, clientNumber: string, type: "Western Union" | "Debit/MP") => void;
  loading: boolean;
}

export const NewExtractionForm = ({ handleCreate, loading }: NewExtractionFormProps) => {
  const [amount, setAmount] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [type, setType] = useState<"Western Union" | "Debit/MP">(
    "Western Union"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreate(amount, clientNumber, type);
    setAmount("");
    setClientNumber("");
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Form.Label className="fw-medium mb-2">Nueva Solicitud</Form.Label>
        <Form onSubmit={handleSubmit}>
          <Row className="align-items-end g-3">
            <Col sm={12} md={3}>
              <Form.Label htmlFor="amount-extraction" className="fw-medium">
                Monto
              </Form.Label>
              <InputGroup>
                <CurrencyInput
                  id="amount-extraction"
                  name="amount"
                  value={amount}
                  onValueChange={(value) => setAmount(value || "")}
                  placeholder="$ 100.000"
                  className="form-control"
                  prefix="$ "
                  groupSeparator="."
                  decimalSeparator=","
                  decimalsLimit={2}
                  onFocus={(e) => e.target.select()}
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
                  placeholder="Ej., 312"
                  onFocus={(e) => e.target.select()}
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
              <Button type="submit" variant="primary" disabled={loading}>
                <i className="bi bi-plus-lg me-1"></i> Agregar
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};
