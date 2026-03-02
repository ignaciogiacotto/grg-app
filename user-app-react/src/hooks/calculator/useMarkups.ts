import { useState } from "react";

export const useMarkups = () => {
  const [markup50, setMarkup50] = useState(50);
  const [markup70, setMarkup70] = useState(70);
  const [markup100, setMarkup100] = useState(100);
  const [isEditingMarkups, setIsEditingMarkups] = useState(false);

  const calculatePrices = (costoUnitario: number) => {
    return {
      venta50: costoUnitario * (1 + markup50 / 100),
      venta70: costoUnitario * (1 + markup70 / 100),
      venta100: costoUnitario * (1 + markup100 / 100),
    };
  };

  return {
    markups: [
      { value: markup50, setter: setMarkup50, label: "50%" },
      { value: markup70, setter: setMarkup70, label: "70%" },
      { value: markup100, setter: setMarkup100, label: "100%" },
    ],
    isEditingMarkups,
    setIsEditingMarkups,
    calculatePrices,
  };
};
