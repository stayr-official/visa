import currencyMap from "../currency-map.json";

export const currencyFromISONumber = (isoNumber: string | number) => {
  const isoNumberString = String(isoNumber);
  const currency = currencyMap.find((i) => i.number === isoNumberString);
  if (!currency) {
    throw new Error(`Currency with ISO number ${isoNumberString} not found`);
  }
  return currency;
};

export const currencyFromISOCode = (isoCode: string) => {
  const currency = currencyMap.find((i) => i.code === isoCode);
  if (!currency) {
    throw new Error(`Currency with ISO code ${isoCode} not found`);
  }
  return currency;
};
