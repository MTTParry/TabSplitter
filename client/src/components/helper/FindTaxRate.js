export function GetTaxRate(bill) {
  let getTaxRate = (bill.tax_total / bill.subtotal);

  return getTaxRate.toFixed(4);
}
