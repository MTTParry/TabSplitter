export function GetTipAmount(props) {
  let tipAmount = Math.round(props.subtotal * props.tip_rate) / 100;

  return tipAmount;
}
