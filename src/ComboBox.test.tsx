import * as React from "react";
import { render, cleanup } from "react-testing-library";
import userEvent from "user-event";
import "jest-dom/extend-expect";
import ComboBox from "./ComboBox";

afterEach(cleanup);

const options = [
  { label: "Banana", id: "banana" },
  { label: "Pineapple", id: "pineapple" }
];

describe("Combo Box", () => {
  it(`initially renders a comboxbox with closed dropdown`, () => {
    const utils = render(<ComboBox label="Select Fruit" options={options} />);
    const comboBox = utils.getByRole("combobox");
    const listBox = utils.getByRole("listbox");
    expect(comboBox).toHaveAttribute("aria-expanded", "false");
    expect(listBox).toBeEmpty();
  });

  // focus

  it(`opens the dropdown when focusing the input field`, () => {
    const utils = render(<ComboBox label="Select Fruit" options={options} />);
    const comboBox = utils.getByRole("combobox");
    const listBox = utils.getByRole("listbox");
    const input = utils.getByLabelText("Select Fruit");

    userEvent.click(input);

    expect(comboBox).toHaveAttribute("aria-expanded", "true");
    expect(listBox.children).toHaveLength(2);
  });

  it(`closes the dropdown when blurring the input field`, () => {
    const utils = render(<ComboBox label="Select Fruit" options={options} />);
    const comboBox = utils.getByRole("combobox");
    const listBox = utils.getByRole("listbox");
    const input = utils.getByLabelText("Select Fruit");

    userEvent.click(input);
    userEvent.click(utils.container);

    expect(comboBox).toHaveAttribute("aria-expanded", "false");
    expect(listBox).toBeEmpty();
  });

  it(`closes the dropdown, 
      selects the option 
      and triggers a callback 
      when selecting an option in dropdown`, () => {
    const onChange = jest.fn();
    const utils = render(
      <ComboBox
        id="fruit"
        label="Select Fruit"
        options={options}
        onChange={onChange}
      />
    );
    const comboBox = utils.getByRole("combobox");
    const listBox = utils.getByRole("listbox");
    const input = utils.getByLabelText("Select Fruit");

    userEvent.click(input);
    userEvent.click(utils.getAllByRole("option")[0]);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(options[0]);
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      `fruit-option-${options[0].id}`
    );
    expect(input).toHaveAttribute("value", options[0].label);
    expect(comboBox).toHaveAttribute("aria-expanded", "false");
    expect(listBox).toBeEmpty();

    userEvent.click(input);
    expect(utils.getAllByRole("option")[0]).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});
