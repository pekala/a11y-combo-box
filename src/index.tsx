import * as React from "react";
import { render } from "react-dom";
import ComboBox from "./ComboBox";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <ComboBox />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
