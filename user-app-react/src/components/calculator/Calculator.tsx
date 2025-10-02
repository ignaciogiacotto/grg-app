import { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";

export function Calculator() {
  const [displayValue, setDisplayValue] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === "0" ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue("0.");
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".");
    }
  };

  const clearDisplay = () => {
    setDisplayValue("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplayValue(result.toLocaleString("es-AR"));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (first: number, second: number, op: string) => {
    switch (op) {
      case "+":
        return first + second;
      case "-":
        return first - second;
      case "*":
        return first * second;
      case "/":
        return first / second;
      case "%":
        return (first / 100) * second;
      default:
        return second;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key >= "0" && event.key <= "9") {
      inputDigit(event.key);
    }
    if (event.key === ".") {
      inputDecimal();
    }
    if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/") {
      performOperation(event.key);
    }
    if (event.key === "Enter" || event.key === "=") {
      performOperation("=");
    }
    if (event.key === "Backspace") {
      setDisplayValue(displayValue.slice(0, -1) || "0");
    }
    if (event.key === "Escape") {
      clearDisplay();
    }
  };

  return (
    <Card bg="dark" text="white" onKeyDown={handleKeyDown} tabIndex={0}> 
      <Card.Header>
        <Card.Title as="h5">Calculadora</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="mx-auto" style={{ maxWidth: "400px" }}>
          <div 
            className="bg-secondary text-white text-end p-2 mb-3 rounded"
            style={{ height: "60px", fontSize: "2em" }}
          >
            {displayValue}
          </div>
          <Row className="g-2">
            <Col xs={3}><Button variant="secondary" className="w-100 h-100" onClick={() => performOperation("%")}>%</Button></Col>
            <Col xs={3}><Button variant="secondary" className="w-100 h-100" onClick={clearDisplay}>C</Button></Col>
            <Col xs={3}><Button variant="secondary" className="w-100 h-100" onClick={() => setDisplayValue(displayValue.slice(0, -1) || "0")}>&larr;</Button></Col>
            <Col xs={3}><Button variant="warning" className="w-100 h-100" onClick={() => performOperation("/")}>&divide;</Button></Col>
          </Row>
          <Row className="g-2 mt-1">
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={() => inputDigit("7")}>7</Button></Col>
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={() => inputDigit("8")}>8</Button></Col>
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={() => inputDigit("9")}>9</Button></Col>
            <Col xs={3}><Button variant="warning" className="w-100 h-100" onClick={() => performOperation("*")}>&times;</Button></Col>
          </Row>
          <Row className="g-2 mt-1">
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={() => inputDigit("4")}>4</Button></Col>
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={() => inputDigit("5")}>5</Button></Col>
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={() => inputDigit("6")}>6</Button></Col>
            <Col xs={3}><Button variant="warning" className="w-100 h-100" onClick={() => performOperation("-")}>-</Button></Col>
          </Row>
          <Row className="g-2 mt-1">
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={() => inputDigit("1")}>1</Button></Col>
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={() => inputDigit("2")}>2</Button></Col>
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={() => inputDigit("3")}>3</Button></Col>
            <Col xs={3}><Button variant="warning" className="w-100 h-100" onClick={() => performOperation("+")}>+</Button></Col>
          </Row>
          <Row className="g-2 mt-1">
            <Col xs={6}><Button variant="light" className="w-100 h-100" onClick={() => inputDigit("0")}>0</Button></Col>
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={inputDecimal}>.</Button></Col>
            <Col xs={3}><Button variant="success" className="w-100 h-100" onClick={() => performOperation("=")}>=</Button></Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
}