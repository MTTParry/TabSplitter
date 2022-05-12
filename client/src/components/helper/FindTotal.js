export function GetTotal(props) {
  let total = props.subtotal + props.tip_total + props.tax_total;

  return total;
}