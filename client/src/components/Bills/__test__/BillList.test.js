import React from 'react'
import BillList from "../BillList"
import { render, screen, cleanup } from '@testing-library/react'
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer"
import TestBill from "./TestBill";
import { act } from "react-dom/test-utils";

afterEach(cleanup);

// Basic Test
it("renders without crashing", () => {
    render(<BillList  />)
    expect(screen.getByTestId('bill_list')).toHaveTextContent("Bill List")
})

// Snapshot test (tracks snapshots? not as useful for )
it("matches snapshot", () => {
    const tree = renderer.create(<BillList />).toJSON();
    expect(tree).toMatchSnapshot()
})

// trying to mock fetch - cant figure out rn
beforeEach(() => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    json: jest.fn().mockResolvedValue([TestBill]),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("renders one bill correctly", async () => {
    // fetch.mockResponseOnce(() => Promise.reject("API is Down"))
    act( () => {
        render(<BillList/>)
    })
    const element = await screen.findByTestId("bill_list")
    expect(element).toBeInTheDocument();
})