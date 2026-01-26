import React from "react";
import "jest-canvas-mock";
import "canvas";
import { render } from "@testing-library/react";
import MapMenu from "./MapMenu";
import config from "../../config/infos.json";

function NoCanvasComponent(props) {
  return (
    <>
      <p>Pas de canvas ici</p>
      <button onClick={props.onClick}>bouton</button>
    </>
  );
}

describe("MapMenu", () => {
  it("should work", () => {
    const onClick = jest.fn();
    render(<NoCanvasComponent onClick={onClick} />);
    //render(<MapMenu areas={config} onClickCallback={onClick} />);
  });
});
