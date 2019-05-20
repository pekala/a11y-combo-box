import * as React from "react";
import { render } from "react-dom";
import ComboBox from "./ComboBox";

import "./styles.css";

const options = [
  { label: "Banana", id: "banana" },
  { label: "Pineapple", id: "pineapple" }
];

function App() {
  return (
    <div className="App">
      <ComboBox label="Select Fruit" options={options} />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
