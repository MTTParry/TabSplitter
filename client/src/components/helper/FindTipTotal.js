export function GetTipAmount(bill) {
  let tipAmount = bill.subtotal * (bill.tip_rate / 100);

  return tipAmount.toFixed(2);
}
