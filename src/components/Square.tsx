import React from "react";
import { EMPTY_SQUARE, FILLED_SQUARE, FILLED_X } from "../assets/svgAssets";

export interface SquareProps {
  // draggable:boolean;
  image: string;
  xpos: any;
  ypos: any;
  sqnum: any;
  onMouseDown: (e: React.MouseEvent<HTMLImageElement>) => void;
  onContextMenu: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseEnter: (e: React.MouseEvent<HTMLImageElement>) => void;
}

const Square = (props: SquareProps) => {
  const { image, xpos, ypos, sqnum, onMouseDown, onContextMenu, onMouseEnter } =
    props;

  const imageSelect = (image: string) => {
    let newImage;

    switch (image) {
      case "empty":
        newImage = EMPTY_SQUARE;
        break;
      case "filled":
        newImage = FILLED_SQUARE;
        break;
      case "X":
        newImage = FILLED_X;
        break;
      default:
        break;
    }

    return newImage;
  };

  return (
    <img
      draggable="false"
      src={imageSelect(image)}
      alt=""
      className="Test"
      data-xpos={xpos}
      data-ypos={ypos}
      data-sqnum={sqnum}
      onMouseDown={(e) => onMouseDown(e)}
      onContextMenu={(e) => onContextMenu(e)}
      onMouseEnter={(e) => onMouseEnter(e)}
    />
  );
};

export default Square;
