import * as React from "react";
import { render, cleanup, fireEvent } from "react-testing-library";
import userEvent from "user-event";
import "jest-dom/extend-expect";
import ComboBox from "./ComboBox";

const enterEvent = {
  key: "Enter",
  keyCode: 13,
  which: 13
};
const arrowDownEvent = {
  key: "ArrowDown",
  keyCode: 40,
  which: 40
};
const arrowUpEvent = {
  key: "ArrowUp",
  keyCode: 38,
  which: 38
};
const escapeEvent = {
  key: "Escape",
  keyCode: 27,
  which: 27
};

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
      triggerLabel="Show Select Fruit Options"
      options={options}
      onChange={onChange}
    />
  );
  const comboBox = utils.getByRole("combobox");
  const listBox = utils.getByRole("listbox");
  const input = utils.getByLabelText("Select Fruit");
  const trigger = utils.getByLabelText("Show Select Fruit Options");
  return { ...utils, comboBox, listBox, input, onChange, trigger };
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

  it(`opens the dropdown 
      when focusing the input field`, () => {
    const utils = setup();

    userEvent.click(utils.input);

    assertDropdownOpen(utils, 3);
  });

  it(`closes the dropdown 
      when blurring the input field`, () => {
    const utils = setup();

    userEvent.click(utils.input);
    userEvent.click(utils.container);

    assertDropdownClosed(utils);
  });

  it("opens the dropdown when clicking on the toggle icon", () => {
    const utils = setup();

    userEvent.click(utils.trigger);

    assertDropdownOpen(utils, 3);
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

  it(`selects the first option 
      and filters the dropdown 
      when starting to type`, () => {
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

  it.skip(`clears the selection 
      when typing a label that doesn't have any matches`, () => {
    const utils = setup();

    userEvent.click(utils.input);
    userEvent.type(utils.input, "Coco");

    assertInputValue(utils, "Coco");
    assertDropdownOpen(utils, 0);
    assertNoOptionSelected(utils);
  });

  it(`selects the highlighted option
      and closes the dropdown 
      when pressing enter while typing`, () => {
    const utils = setup();

    userEvent.type(utils.input, "Blue");
    fireEvent.keyDown(utils.input, enterEvent);

    assertDropdownClosed(utils);
    assertInputValue(utils, "Blueberry");
    assertOptionSelected(utils, options[2]);

    userEvent.click(utils.input);
    assertDropdownOpen(utils, 1);
    expect(utils.getAllByRole("option")[0]).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it(`selects the first option 
      when pressing the arrow down`, () => {
    const utils = setup();

    userEvent.click(utils.input);
    fireEvent.keyDown(utils.input, arrowDownEvent);

    assertDropdownOpen(utils, 3);
    assertInputValue(utils, options[0].label);
    assertOptionSelected(utils, options[0]);
  });

  it(`selects the last option
      when pressing the arrow up`, () => {
    const utils = setup();

    userEvent.click(utils.input);
    fireEvent.keyDown(utils.input, arrowUpEvent);

    assertDropdownOpen(utils, 3);
    assertInputValue(utils, options[2].label);
    assertOptionSelected(utils, options[2]);
  });

  it(`selects the highlighted option 
      and closes the dropdown 
      when pressing enter while using arrows`, () => {
    const utils = setup();

    userEvent.click(utils.input);
    fireEvent.keyDown(utils.input, arrowDownEvent);
    fireEvent.keyDown(utils.input, enterEvent);

    assertDropdownClosed(utils);
    assertInputValue(utils, "Banana");
    assertOptionSelected(utils, options[0]);

    userEvent.click(utils.input);
    assertDropdownOpen(utils, 1);
    expect(utils.getAllByRole("option")[0]).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it(`cycles through options 
      when using arrow up`, () => {
    const utils = setup();

    userEvent.click(utils.input);
    for (let i = 0; i <= 4; i++) {
      fireEvent.keyDown(utils.input, arrowUpEvent);
    }

    assertDropdownOpen(utils, 3);
    assertInputValue(utils, options[1].label);
    assertOptionSelected(utils, options[1]);
  });

  it(`cycles through options 
      when using arrow down`, () => {
    const utils = setup();

    userEvent.click(utils.input);
    for (let i = 0; i <= 4; i++) {
      fireEvent.keyDown(utils.input, arrowDownEvent);
    }

    assertDropdownOpen(utils, 3);
    assertInputValue(utils, options[1].label);
    assertOptionSelected(utils, options[1]);
  });

  it(`clears the selection 
      and closes the dropdown 
      when pressing escape`, () => {
    const utils = setup();

    userEvent.click(utils.input);
    userEvent.type(utils.input, "B");
    fireEvent.keyDown(utils.input, escapeEvent);

    assertNoOptionSelected(utils);
    assertInputValue(utils, "");
    assertDropdownClosed(utils);
  });

  it(`completes the label in input 
      when blurring without typing the entire label`, () => {
    const utils = setup();

    userEvent.click(utils.input);
    userEvent.type(utils.input, "B");
    userEvent.click(utils.container);

    assertDropdownClosed(utils);
    assertInputValue(utils, "Banana");
    assertOptionSelected(utils, options[0]);
  });

  it(`clears the input 
      when blurring when typing non-existing label`, () => {
    const utils = setup();

    userEvent.click(utils.input);
    userEvent.type(utils.input, "Apple");
    userEvent.click(utils.container);

    assertDropdownClosed(utils);
    assertNoOptionSelected(utils);
    assertInputValue(utils, "");
  });

  it(`closes the dropdown 
      and clears selection 
      when deleting the last character in input
     `, () => {
    const utils = setup();

    userEvent.click(utils.input);
    userEvent.type(utils.input, "B");
    fireEvent.change(utils.input, { target: { value: "" } });

    expect(utils.onChange).toHaveBeenLastCalledWith(null);
    assertDropdownClosed(utils);
    assertNoOptionSelected(utils);
    assertInputValue(utils, "");

    fireEvent.keyDown(utils.input, arrowDownEvent);
    assertDropdownOpen(utils, 3);
  });
});
