import React from "react";
import emptySquare from "./assets/iconmonstr-square-4.svg";
import filledSquare from "./assets/iconmonstr-square-1.svg";
import filledX from "./assets/iconmonstr-x-mark-1.svg";

function Square(props) {
  const imageSelect = (image) => {
    let newImage;

    switch (image) {
      case "empty":
        newImage = emptySquare;
        break;
      case "filled":
        newImage = filledSquare;
        break;
      case "X":
        newImage = filledX;
        break;
      default:
        break;
    }

    return newImage;
  };

  return (
    <img
      draggable="false"
      src={imageSelect(props.image)}
      alt=""
      className="Test"
      xpos={props.xpos}
      ypos={props.ypos}
      sqnum={props.sqnum}
      onMouseDown={(e) => props.onMouseDown(e)}
      onContextMenu={(e) => props.onContextMenu(e)}
      onMouseEnter={(e) => props.onMouseEnter(e)}></img>
  );
}

export default Square;
