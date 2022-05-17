export function GetTaxRate(bill) {
  if (bill.subtotal === 0) {
    return 0;
  }

  let getTaxRate = bill.tax_total / bill.subtotal;

  return getTaxRate.toFixed(4);
}
