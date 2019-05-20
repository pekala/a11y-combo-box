import * as React from "react";
import { render, cleanup } from "react-testing-library";
import "jest-dom/extend-expect";
import ComboBox from "./ComboBox";

afterEach(cleanup);

describe("Combo Box", () => {
  it(`initially renders a comboxbox with closed dropdown`, () => {
    const utils = render(<ComboBox label="Select Fruit" />);
    const comboBox = utils.getByRole("combobox");
    const listBox = utils.getByRole("listbox");
    expect(comboBox).toHaveAttribute("aria-expanded", "false");
    expect(listBox).toBeEmpty();
  });
});
