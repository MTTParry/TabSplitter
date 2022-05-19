export function GetDebtTotal(bill, subtotal) {
  if (subtotal === 0) {
    return 0;
  }
  //convert the tip rate to a percentage
  let newBillTipRate = bill.tip_rate / 100;

  //calculate the multiplier for the subtotal
  let multiplier = 1 + parseFloat(bill.tax_rate) + newBillTipRate;

  //apply the multiplier to the subtotal
  let getTotal = multiplier * subtotal;

  //only return it in cents, not fractions of a cent
  return getTotal.toFixed(2);
}
