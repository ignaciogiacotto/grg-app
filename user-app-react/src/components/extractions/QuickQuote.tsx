import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  InputGroup,
} from "react-bootstrap";
import { getExchangeRate } from "../../services/exchangeRateService";
import CurrencyInput from "react-currency-input-field";
import CountrySelector from "./CountrySelector";

const countryCurrency: { [key: string]: string } = {
  PY: "PYG",
  US: "USD",
  ES: "EUR",
  PE: "PEN",
  BO: "BOB",
  CL: "CLP",
};

export const QuickQuote = () => {
  const [selectedCountry, setSelectedCountry] = useState("PY");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [amounts, setAmounts] = useState<{ ars: string; foreign: string; total: string }>({ ars: "", foreign: "", total: "" });
  const [lastEdited, setLastEdited] = useState<"ars" | "foreign" | "total" | null>(
    null
  );
  const [loadingRate, setLoadingRate] = useState(true);
  const [errorRate, setErrorRate] = useState<string | null>(null);
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState<number | null>(
    null
  );

  const fetchRate = useCallback(async () => {
    try {
      setLoadingRate(true);
      setErrorRate(null);
      const rateData = await getExchangeRate(selectedCountry);
      setExchangeRate(rateData.rate);
      setLastFetchTimestamp(Date.now());
    } catch (err) {
      setErrorRate("No se pudo obtener la tasa de cambio.");
      setExchangeRate(null);
    } finally {
      setLoadingRate(false);
    }
  }, [selectedCountry]);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  useEffect(() => {
    if (!exchangeRate) return;

    const costFactor = 1.0605; // 1 + (0.05 * 1.21)

    const parseValue = (value: string) => parseFloat(value.replace(/\./g, "").replace(",", "."));

    const calculate = () => {
      if (lastEdited === "ars") {
        const principalArs = parseValue(amounts.ars);
        if (isNaN(principalArs) || principalArs <= 0) {
          setAmounts((prev) => ({ ...prev, foreign: "", total: "" }));
          return;
        }
        const foreignAmount = principalArs * exchangeRate;
        const total = principalArs * costFactor;
        setAmounts((prev) => ({
          ...prev,
          foreign: foreignAmount.toFixed(2),
          total: total.toFixed(2),
        }));
      } else if (lastEdited === "foreign") {
        const foreignAmount = parseValue(amounts.foreign);
        if (isNaN(foreignAmount) || foreignAmount <= 0) {
          setAmounts((prev) => ({ ...prev, ars: "", total: "" }));
          return;
        }
        const principalArs = foreignAmount / exchangeRate;
        const total = principalArs * costFactor;
        setAmounts((prev) => ({
          ...prev,
          ars: principalArs.toFixed(2),
          total: total.toFixed(2),
        }));
      } else if (lastEdited === "total") {
        const totalAmount = parseValue(amounts.total);
        if (isNaN(totalAmount) || totalAmount <= 0) {
          setAmounts((prev) => ({ ...prev, ars: "", foreign: "" }));
          return;
        }
        const principalArs = totalAmount / costFactor;
        const foreignAmount = principalArs * exchangeRate;
        setAmounts((prev) => ({
          ...prev,
          ars: principalArs.toFixed(2),
          foreign: foreignAmount.toFixed(2),
        }));
      }
    };
    calculate();
  }, [amounts.ars, amounts.foreign, amounts.total, lastEdited, exchangeRate]);

  const handleFocus = () => {
    const tenMinutes = 10 * 60 * 1000;
    if (!lastFetchTimestamp || Date.now() - lastFetchTimestamp > tenMinutes) {
      fetchRate();
    }
  };

  const handleValueChange = (
    value: string | undefined,
    name: "ars" | "foreign" | "total"
  ) => {
    const sanitizedValue = value || "";
    if (name === "ars") {
      setAmounts({ ars: sanitizedValue, foreign: "", total: "" });
    } else if (name === "foreign") {
      setAmounts({ ars: "", foreign: sanitizedValue, total: "" });
    } else {
      setAmounts({ ars: "", foreign: "", total: sanitizedValue });
    }
    setLastEdited(name);
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body className="py-2 px-3">
        <Row className="g-2 align-items-start">
          <Form.Label className="fw-medium mb-0">Cotización Rápida</Form.Label>
          <Col xs={12} sm={6} md={3}>
            <Form.Group className="mb-1">
              <Form.Label className="small fw-medium mb-0">
                Usted envía (ARS)
              </Form.Label>
              <CurrencyInput
                name="ars"
                value={amounts.ars}
                onValueChange={(value) => handleValueChange(value, "ars")}
                onFocus={handleFocus}
                placeholder="$ 1.000"
                className="form-control form-control-sm"
                prefix="$ "
                groupSeparator="."
                decimalSeparator=","
                decimalsLimit={2}
              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Form.Group className="mb-0">
              <Form.Label className="small fw-medium mb-0">
                Destinatario recibe
              </Form.Label>
              <InputGroup size="sm">
                <CurrencyInput
                  name="foreign"
                  value={amounts.foreign}
                  onValueChange={(value) => handleValueChange(value, "foreign")}
                  onFocus={handleFocus}
                  placeholder="4.986,30"
                  className="form-control"
                  groupSeparator="."
                  decimalSeparator=","
                  decimalsLimit={2}
                />
                <CountrySelector
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                  className="form-select"
                  style={{ maxWidth: "160px" }}
                />
              </InputGroup>
              {exchangeRate && !loadingRate && (
                <Form.Text className="text-muted small">
                  1 ARS = {exchangeRate.toFixed(4)}{" "}
                  {countryCurrency[selectedCountry]}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group className="mb-0">
              <Form.Label className="small fw-medium mb-0">
                Total a pagar (ARS)
              </Form.Label>
              <CurrencyInput
                name="total"
                value={amounts.total}
                onValueChange={(value) => handleValueChange(value, "total")}
                onFocus={handleFocus}
                placeholder="$ 1.060,50"
                className="form-control form-control-sm fw-bold text-primary"
                prefix="$ "
                groupSeparator="."
                decimalSeparator=","
                decimalsLimit={2}
              />
            </Form.Group>
          </Col>
        </Row>
        {loadingRate && (
          <div className="text-center text-muted pt-1 small">
            Cargando tasa...
          </div>
        )}
        {errorRate && (
          <div className="text-center text-danger pt-1 small">
            {errorRate}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
