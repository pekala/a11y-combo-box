import * as React from "react";
import ComboBox from "./ComboBox";

describe("Combo Box", () => {
  it(`works`, () => {
    expect(<ComboBox label="Select Fruit" />).toBeInstanceOf(Object);
  });
});
