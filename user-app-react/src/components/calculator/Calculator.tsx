import { useState, useRef } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";

export function Calculator() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState("0");
  const [expression, setExpression] = useState("");
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
    setExpression("");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handlePercent = () => {
    const inputValue = parseFloat(displayValue.replace(",", "."));
    if (firstOperand !== null && operator) {
      const percentValue = (firstOperand / 100) * inputValue;
      setDisplayValue(String(percentValue));
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue.replace(",", "."));

    if (nextOperator === "=") {
      if (firstOperand !== null && operator) {
        const result = calculate(firstOperand, inputValue, operator);
        setExpression(
          `${firstOperand} ${operator} ${inputValue} =`
        );
        setDisplayValue(String(result));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
      }
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
      setExpression(`${inputValue} ${nextOperator}`);
    } else if (operator) {
      // Handle changing operator
      if (waitingForSecondOperand) {
        setExpression(`${firstOperand} ${nextOperator}`);
        setOperator(nextOperator);
        return;
      }

      const result = calculate(firstOperand, inputValue, operator);
      setExpression(`${result} ${nextOperator}`);
      setDisplayValue(String(result));
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
      default:
        return second;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key >= "0" && event.key <= "9") {
      event.preventDefault();
      inputDigit(event.key);
      return;
    }
    if (event.key === "." || event.key === ",") {
      event.preventDefault();
      inputDecimal();
      return;
    }
    if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/") {
      event.preventDefault();
      performOperation(event.key);
      return;
    }
    if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();
      performOperation("=");
      return;
    }
    if (event.key === "Backspace") {
      event.preventDefault();
      setDisplayValue(displayValue.slice(0, -1) || "0");
      return;
    }
    if (event.key === "Escape" || event.key === "c" || event.key === "C") {
      event.preventDefault();
      clearDisplay();
      return;
    }
    if (event.key === "%") {
      event.preventDefault();
      handlePercent();
    }
  };

  const handleClick = (action: () => void) => {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      action();
      e.currentTarget.blur();
      // Devolver el foco a la card para seguir usando el teclado sin hacer click de nuevo
      setTimeout(() => cardRef.current?.focus(), 0);
    };
  };

  return (
    <Card bg="dark" text="white" onKeyDown={handleKeyDown} tabIndex={0} ref={cardRef}> 
      <Card.Header>
        <Card.Title as="h5">Calculadora</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="mx-auto" style={{ maxWidth: "400px" }}>
          <div 
            className="bg-secondary text-white text-end p-2 mb-3 rounded d-flex flex-column justify-content-center"
            style={{ height: "80px", cursor: "pointer" }}
            onClick={() => cardRef.current?.focus()}
            role="application"
            aria-label="Pantalla de la calculadora. Haz clic o usa el teclado para operar."
          >
            <div style={{ fontSize: "0.75em", color: "#aaa", lineHeight: "1" }}>{expression || " "}</div>
            <div style={{ fontSize: "1.5em", lineHeight: "1.5" }}>{displayValue}</div>
          </div>
          <Row className="g-2">
            <Col xs={3}><Button variant="secondary" className="w-100 h-100" onClick={handleClick(handlePercent)}>%</Button></Col>
            <Col xs={3}><Button variant="secondary" className="w-100 h-100" onClick={handleClick(clearDisplay)}>C</Button></Col>
            <Col xs={3}><Button variant="secondary" className="w-100 h-100" onClick={handleClick(() => setDisplayValue(displayValue.slice(0, -1) || "0"))}>&larr;</Button></Col>
            <Col xs={3}><Button variant="warning" className="w-100 h-100" onClick={handleClick(() => performOperation("/"))}>&divide;</Button></Col>
          </Row>
          <Row className="g-2 mt-1">
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={handleClick(() => inputDigit("7"))}>7</Button></Col>
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={handleClick(() => inputDigit("8"))}>8</Button></Col>
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={handleClick(() => inputDigit("9"))}>9</Button></Col>
            <Col xs={3}><Button variant="warning" className="w-100 h-100" onClick={handleClick(() => performOperation("*"))}>&times;</Button></Col>
          </Row>
          <Row className="g-2 mt-1">
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={handleClick(() => inputDigit("4"))}>4</Button></Col>
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={handleClick(() => inputDigit("5"))}>5</Button></Col>
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={handleClick(() => inputDigit("6"))}>6</Button></Col>
            <Col xs={3}><Button variant="warning" className="w-100 h-100" onClick={handleClick(() => performOperation("-"))}>-</Button></Col>
          </Row>
          <Row className="g-2 mt-1">
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={handleClick(() => inputDigit("1"))}>1</Button></Col>
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={handleClick(() => inputDigit("2"))}>2</Button></Col>
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={handleClick(() => inputDigit("3"))}>3</Button></Col>
            <Col xs={3}><Button variant="warning" className="w-100 h-100" onClick={handleClick(() => performOperation("+"))}>+</Button></Col>
          </Row>
          <Row className="g-2 mt-1">
            <Col xs={6}><Button variant="light" className="w-100 h-100" onClick={handleClick(() => inputDigit("0"))}>0</Button></Col>
            <Col xs={3}><Button variant="light" className="w-100 h-100" onClick={handleClick(inputDecimal)}>.</Button></Col>
            <Col xs={3}><Button variant="success" className="w-100 h-100" onClick={handleClick(() => performOperation("="))}>=</Button></Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
}