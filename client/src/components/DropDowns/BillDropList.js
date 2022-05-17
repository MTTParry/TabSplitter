import { useState, useEffect } from "react";

const BillDropDown = (prop) => {
  const [billList, setBillList] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5005/db/bills`)
      .then((response) => response.json())
      .then((billList) => {
        setBillList(billList);
        // setReady(true);
      });
  }, []);

  useEffect(() => {
    setReady(true);
  }, [billList]);

  //Listing Bills
  if (ready) {
    return (
      <div>
        <label>{prop.label}</label>
        {"      "}
        <select onChange={prop.handleChange} name={prop.name} required>
          <option hidden>Select</option>
          {billList.map((bill) => (
            <option value={bill.bill_id} key={bill.bill_id}>
              #{bill.bill_id}: {bill.location} on{" "}
              {bill.transaction_date.slice(0, 10)}
            </option>
          ))}
        </select>
      </div>
    );
  } else {
    return <div>Drop Down is loading</div>;
  }
};

export default BillDropDown;
