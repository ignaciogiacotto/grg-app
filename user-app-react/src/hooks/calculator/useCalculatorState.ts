import { useState, useCallback } from "react";

export const useCalculatorState = () => {
  // Entradas manuales comunes
  const [importe, setImporte] = useState<string>("");
  const [cantidad, setCantidad] = useState<string>("1");
  const [impuestosInternos, setImpuestosInternos] = useState<string>("");
  const [descuento, setDescuento] = useState<string>("");

  // Tasas de impuestos (todas las posibles)
  const [ivaRate, setIvaRate] = useState<number>(21);
  const [iibbRate, setIibbRate] = useState<number>(4);
  const [percIvaRate, setPercIvaRate] = useState<number>(3);
  const [rg5329Rate, setRg5329Rate] = useState<number>(3);

  // Estados de control
  const [isEditingRates, setIsEditingRates] = useState(false);
  const [showTaxes, setShowTaxes] = useState(true);
  
  // Switches opcionales
  const [isIibbEnabled, setIsIibbEnabled] = useState(false);
  const [isPercIvaEnabled, setIsPercIvaEnabled] = useState(false);
  const [isRg5329Enabled, setIsRg5329Enabled] = useState(false);
  const [isCashDiscountEnabled, setIsCashDiscountEnabled] = useState(true);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const val = e.target.value.replace(/,/, ".").replace(/[^\d.]/g, "");
    if (val.split(".").length <= 2) setter(val);
  }, []);

  const clearInputs = useCallback(() => {
    setImporte("");
    setImpuestosInternos("");
    setDescuento("");
    setCantidad("1");
  }, []);

  return {
    importe, setImporte,
    cantidad, setCantidad,
    impuestosInternos, setImpuestosInternos,
    descuento, setDescuento,
    ivaRate, setIvaRate,
    iibbRate, setIibbRate,
    percIvaRate, setPercIvaRate,
    rg5329Rate, setRg5329Rate,
    isEditingRates, setIsEditingRates,
    showTaxes, setShowTaxes,
    isIibbEnabled, setIsIibbEnabled,
    isPercIvaEnabled, setIsPercIvaEnabled,
    isRg5329Enabled, setIsRg5329Enabled,
    isCashDiscountEnabled, setIsCashDiscountEnabled,
    handleInputChange,
    clearInputs
  };
};
