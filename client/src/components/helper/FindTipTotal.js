export function GetTipAmount(bill) {
  let tipAmount = Math.round(bill.subtotal * bill.tip_rate) / 100;

  return tipAmount;
}
