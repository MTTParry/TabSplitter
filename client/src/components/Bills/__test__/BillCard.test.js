import React from 'react'
import BillCard from "../BillCard"
import { render, screen, cleanup } from '@testing-library/react'
import "@testing-library/jest-dom/extend-expect";
// for snapshots
import renderer from "react-test-renderer"

import TestBill from "./TestBill"

afterAll(cleanup);

// it("renders the card without crashing", () => {
test("that it renders the card without crashing", () => {
    render(<BillCard bill={TestBill}/>) // off-screen (w/o browser)
    const expectView = expect(screen.getByTestId("bill-card-"+TestBill.bill_id))
    expectView.toHaveTextContent("Bill ID")
    expectView.toHaveTextContent("Subtotal")
    expectView.toHaveTextContent("Tax Amount")
    expectView.toHaveTextContent("Tip Amount")
    
});

it("renders the bill information", () => {
    render(<BillCard bill={TestBill}/>)
    const expectView = expect(screen.getByTestId("bill-card-"+TestBill.bill_id))
    expectView.toHaveTextContent("Bill ID #"+TestBill.bill_id)
    expectView.toHaveTextContent("Tax Amount (" + TestBill.tax_rate * 100 + "%)")
    expectView.toHaveTextContent(TestBill.tip_rate)
    expectView.toHaveTextContent(TestBill.full_total)
    expectView.toHaveTextContent(TestBill.bill_notes)
    
});