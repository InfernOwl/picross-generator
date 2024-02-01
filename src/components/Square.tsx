import React, { useEffect, useState } from "react";
import EMPTY_SQUARE from "../assets/iconmonstr-square-4.svg";
import FILLED_SQUARE from "../assets/iconmonstr-square-1.svg";
import FILLED_X from "../assets/iconmonstr-x-mark-1.svg";
import { FillStyle } from "./shared/constants";

export interface SquareProps {
  // draggable:boolean;
  fillstyle: FillStyle;
  xpos: any;
  ypos: any;
  sqnum: any;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Square = (props: SquareProps) => {
  const {
    xpos,
    ypos,
    sqnum,
    fillstyle,
    onMouseDown,
    onContextMenu,
    onMouseEnter,
  } = props;

  const [square, setSquare] = useState(EMPTY_SQUARE);

  useEffect(() => {
    switch (fillstyle) {
      case FillStyle.EMPTY:
        setSquare(EMPTY_SQUARE);
        break;
      case FillStyle.FILLED:
        setSquare(FILLED_SQUARE);
        break;
      case FillStyle.X:
        setSquare(FILLED_X);
        break;
      default:
        break;
    }
  }, [fillstyle]);

  return (
    <img
      alt=""
      src={square}
      className="Test"
      draggable="false"
      data-xpos={xpos}
      data-ypos={ypos}
      data-sqnum={sqnum}
      onMouseDown={(e) => onMouseDown(e)}
      onContextMenu={(e) => onContextMenu(e)}
      onMouseEnter={(e) => onMouseEnter(e)}
      style={{ width: "24px", height: "24px", padding: "1px" }}
    />
  );
};

export default Square;
