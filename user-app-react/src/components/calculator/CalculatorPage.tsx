import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { FacturaBCalculator } from "./FacturaBCalculator";
import { FacturaACalculator } from "./FacturaACalculator";
import { BebidasCalculator } from "./BebidasCalculator";
import { Calculator } from "./Calculator";
import { GolomaxCalculator } from "./GolomaxCalculator";

const TAB_KEYS = [
  "bebidas",
  "factura-a",
  "factura-b",
  "golomax",
  "calculator",
] as const;

export function CalculatorPage() {
  const [activeKey, setActiveKey] = useState<string>("bebidas");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + 1..5: ir a la calculadora correspondiente (solo en esta página, evitamos que el navegador cambie de pestaña)
      if (e.ctrlKey && !e.shiftKey && e.key >= "1" && e.key <= "5") {
        e.preventDefault();
        const index = parseInt(e.key, 10) - 1;
        setActiveKey(TAB_KEYS[index]);
        return;
      }
      // Ctrl + Shift + Flecha derecha: siguiente calculadora
      if (e.ctrlKey && e.shiftKey && e.key === "ArrowRight") {
        e.preventDefault();
        const idx = TAB_KEYS.indexOf(activeKey as (typeof TAB_KEYS)[number]);
        setActiveKey(TAB_KEYS[(idx + 1) % TAB_KEYS.length]);
        return;
      }
      // Ctrl + Shift + Flecha izquierda: calculadora anterior
      if (e.ctrlKey && e.shiftKey && e.key === "ArrowLeft") {
        e.preventDefault();
        const idx = TAB_KEYS.indexOf(activeKey as (typeof TAB_KEYS)[number]);
        setActiveKey(TAB_KEYS[(idx - 1 + TAB_KEYS.length) % TAB_KEYS.length]);
        return;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeKey]);

  return (
    <div className="container-fluid p-1">
      <h1 className="text-dark mb-2">Calculadora de Precios</h1>
      <p className="text-muted small mb-2"></p>
      <Tabs
        activeKey={activeKey}
        onSelect={(k) => k != null && setActiveKey(k)}
        id="calculator-tabs"
        className="mb-2"
        variant="pills">
        <Tab eventKey="bebidas" title="Bebidas">
          <BebidasCalculator />
        </Tab>
        <Tab eventKey="factura-a" title="Factura A">
          <FacturaACalculator />
        </Tab>
        <Tab eventKey="factura-b" title="Factura B">
          <FacturaBCalculator />
        </Tab>
        <Tab eventKey="golomax" title="Golomax">
          <GolomaxCalculator />
        </Tab>
        <Tab eventKey="calculator" title="Calculator">
          <Calculator />
        </Tab>
      </Tabs>
    </div>
  );
}
