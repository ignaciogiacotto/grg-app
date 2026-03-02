import { Card, Button } from "react-bootstrap";

interface CalculatorHeaderProps {
  title: string;
  onClear: () => void;
}

export const CalculatorHeader = ({ title, onClear }: CalculatorHeaderProps) => {
  return (
    <Card.Header className="d-flex justify-content-between align-items-center">
      <Card.Title as="h5" className="mb-0">
        {title}
      </Card.Title>
      <Button
        variant="outline-light"
        size="sm"
        onClick={onClear}
        title="Limpiar campos">
        <i className="bi bi-arrow-counterclockwise me-1"></i>
        Limpiar
      </Button>
    </Card.Header>
  );
};
