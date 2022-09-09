import { GetTotal } from "../FindTotal";

it("finds the total for a bill", () => {
    const fakeBill = {
        subtotal: 100,
        tip_total: 5,
        tax_total: 10,
    }
    const result = GetTotal(fakeBill)
    expect(result).toBe("115.00")
})

it("converts strings", () => {
    const fakeBill = {
        subtotal: 100,
        tip_total: 5,
        tax_total: "10",
    }
    const result = GetTotal(fakeBill)
    expect(result).toBe("115.00")
})

it("handles decimals", () => {
    const fakeBill = {
        subtotal: 100.06,
        tip_total: 5,
        tax_total: "10.10",
    }
    const result = GetTotal(fakeBill)
    expect(result).toBe("115.16")
})