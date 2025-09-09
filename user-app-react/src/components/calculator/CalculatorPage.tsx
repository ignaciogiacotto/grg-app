import { Tab, Tabs } from 'react-bootstrap';
import { FacturaBCalculator } from "./FacturaBCalculator";
import { FacturaACalculator } from './FacturaACalculator';
import { BebidasCalculator } from './BebidasCalculator';

export function CalculatorPage() {
  return (
    <div className="container-fluid p-1">
      <h1 className="text-dark mb-2">Calculadora de Precios</h1>
      <Tabs defaultActiveKey="bebidas" id="calculator-tabs" className="mb-2" variant='pills'>
        <Tab eventKey="bebidas" title="Bebidas">
          <BebidasCalculator />
        </Tab>
        <Tab eventKey="factura-a" title="Factura A">
          <FacturaACalculator />
        </Tab>
        <Tab eventKey="factura-b" title="Factura B">
          <FacturaBCalculator />
        </Tab>
      </Tabs>
    </div>
  );
}
