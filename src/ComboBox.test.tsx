import * as React from "react";
import { render, cleanup } from "react-testing-library";
import userEvent from "user-event";
import "jest-dom/extend-expect";
import ComboBox from "./ComboBox";

afterEach(cleanup);

const options = [
  { label: "Banana", id: "banana" },
  { label: "Pineapple", id: "pineapple" },
  { label: "Blueberry", id: "blueberry" }
];

const setup = () => {
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
  return { ...utils, comboBox, listBox, input, onChange };
};

const assertDropdownClosed = ({ comboBox, listBox }) => {
  expect(comboBox).toHaveAttribute("aria-expanded", "false");
  expect(listBox).toBeEmpty();
};

const assertDropdownOpen = ({ comboBox, listBox }, optionsCount: number) => {
  expect(comboBox).toHaveAttribute("aria-expanded", "true");
  expect(listBox.children).toHaveLength(optionsCount);
};

const assertNoOptionSelected = ({ input }) => {
  expect(input).not.toHaveAttribute("aria-activedescendant");
};

const assertInputValue = ({ input }, value) => {
  expect(input).toHaveAttribute("value", value);
};

const assertOptionSelected = ({ input }, option) => {
  expect(input).toHaveAttribute(
    "aria-activedescendant",
    `fruit-option-${option.id}`
  );
};

describe("Combo Box", () => {
  it(`initially renders a comboxbox with closed dropdown`, () => {
    const utils = setup();
    assertDropdownClosed(utils);
    assertNoOptionSelected(utils);
  });

  it(`opens the dropdown when focusing the input field`, () => {
    const utils = setup();
    userEvent.click(utils.input);
    assertDropdownOpen(utils, 3);
  });

  it(`closes the dropdown when blurring the input field`, () => {
    const utils = setup();
    userEvent.click(utils.input);
    userEvent.click(utils.container);
    assertDropdownClosed(utils);
  });

  it(`closes the dropdown, 
      selects the option 
      and triggers a callback 
      when selecting an option in dropdown`, () => {
    const utils = setup();

    userEvent.click(utils.input);
    userEvent.click(utils.getAllByRole("option")[1]);

    expect(utils.onChange).toHaveBeenCalledTimes(1);
    expect(utils.onChange).toHaveBeenCalledWith(options[1]);
    assertOptionSelected(utils, options[1]);
    assertInputValue(utils, options[1].label);
    assertDropdownClosed(utils);

    userEvent.click(utils.input);
    assertDropdownOpen(utils, 1);
    expect(utils.getAllByRole("option")[0]).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it(`selects the first option and filters the dropdown when starting to type`, () => {
    const utils = setup();

    userEvent.click(utils.input);
    userEvent.type(utils.input, "B");

    assertDropdownOpen(utils, 2);
    expect(utils.onChange).toHaveBeenCalledTimes(1);
    expect(utils.onChange).toHaveBeenCalledWith(options[0]);
    assertInputValue(utils, "B");
    assertOptionSelected(utils, options[0]);
    expect(utils.getAllByRole("option")[0]).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});
