// TODO import test data
const TestPayee = {
  first_name: "Samuel",
  last_name: "Biggins",
  email: "TheBigSamowski@gmail.com",
  preferred_payment_method: "PayPal",
};

const TestBill = {
  bill_id: "id500",
  transaction_date: "2022-11-16",
  subtotal: 100,
  tax_rate: 0.05,
  tax_total: 5,
  tip_rate: 20,
  tip_total: 20,
  payee: TestPayee,
  paid_up: false,
  bill_notes: "We celebrated Jane's Birthday",
  full_total: 125,
  location: "Dogfish Alehouse",
};

// TODO fill out data
const RandomBill = () => {
  return {}
};

export default TestBill;
export { TestBill, RandomBill };
