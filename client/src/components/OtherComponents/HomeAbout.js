import React from "react";

const Home = () => {
  return (
    <div>
      <h1>TabSplitter</h1>
      <h2>How it works</h2>
      <ul>
        <p>This is a calculator app that allows you to:</p>
        <li>
          Create contacts{" "}
          <i>
            (first name, last name, email, & how they prefer to be paid back)
          </i>
        </li>
        <br />
        <li>
          Calculate how much to give in tip on a bill <i>(percentage-based)</i>
        </li>
        <br />
        <li>
          Log paid bills{" "}
          <i>(including tax, tip, subtotal, total, who paid, & more)</i>
        </li>
        <br />
        <li>Create debts, based off bills, which account for individual's portion of tax & tip</li>
        <br />
        <li>
          Email the people who owe debts, telling them how much they owe and how
          to pay back the person they owe money to.
        </li>
      </ul>
    </div>
  );
};

export default Home;
