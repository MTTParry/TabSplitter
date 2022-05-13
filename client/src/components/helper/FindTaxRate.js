export function GetTaxRate(bill) {
  let getTaxRate = Math.round((bill.tax_total / bill.subtotal) * 10000) / 100;

  return getTaxRate;
}
