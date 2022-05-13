export function GetTotal(bill) {
  let total =
    parseFloat(bill.subtotal) +
    parseFloat(bill.tip_total) +
    parseFloat(bill.tax_total);
    
  return total;
}
