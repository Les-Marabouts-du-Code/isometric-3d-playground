import React from "react";
import "jest-canvas-mock";
import "canvas";
import { render } from "@testing-library/react";
import App from "./App";
//import { render } from "react-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";

describe("App", () => {
  xit("should not crash", () => {
    render(
      <Router>
        <Switch>
          <App />
        </Switch>
      </Router>
    );
    //render(<p>oui</p>);
  });
});
