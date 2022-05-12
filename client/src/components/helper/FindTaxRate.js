export function GetTaxRate(props) {
  let getTaxRate = Math.round((props.tax_total / props.subtotal) * 10000) / 100;

  return getTaxRate;
}
