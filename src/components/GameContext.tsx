import React, { useState } from "react";
import { Cell, Grid } from "./shared/interfaces";
interface GameContextProps {
  rows: number;
  cols: number;
  setRows: (val: number) => void;
  setCols: (val: number) => void;
  createBoard: () => void;
  filledSquares: { x: any; y: any }[];
}

export const GameContext = React.createContext<GameContextProps>(
  {} as GameContextProps
);

export const GameContextProvider = (props: any) => {
  const [rows, setRows] = useState<number>(0);
  const [cols, setCols] = useState<number>(0);

  const [filledSquares, setFilledSquares] = useState<{ x: any; y: any }[]>([]);

  const createBoard = () => {
    setFilledSquares([]);

    // For x amount of rows and y amount of cols create a grid to match
    // where each grid item has a Square object
    var eRow: Grid[] = [];
    var eCol: Grid[] = [];

    // Create imageTracking list for filled and unfilled squares
    var imgHold: any[] = [];
    var i = 1;

    for (var x = 1; x <= rows; x++) {
      var element: Cell[] = [];
      for (var y = 1; y <= cols; y++) {
        element.push({ x: x, y: y, num: i });
        imgHold.push("empty");
        i++;
      }

      eRow.push({ grid: element });
    }

    // Create a reversed board for the column hints
    for (var t = 1; t <= cols; t++) {
      var colElement: Cell[] = [];
      for (var u = 1; u <= rows; u++) {
        colElement.push({ x: u, y: t, num: i });
        imgHold.push("empty");
        i++;
      }

      eCol.push({ grid: colElement });
    }

    // Board is created now randomly choose which squares get filled
    setFilled(rows, cols);

    // Instantiate, basically
    // setGameBoard(eRow);
    // setRevGameBoard(eCol);
    // setImageTrack(imgHold);
  };

  const rowCheck = (val: any, rows: any, cols: any) => {
    for (var i = 1; i <= rows; i++) {
      if (val <= cols * i) {
        return i;
      }
    }
  };

  const colCheck = (val: any, cols: any) => {
    if (val % cols === 0) {
      return parseInt(cols);
    } else {
      return val % cols;
    }
  };

  const setFilled = (rows: any, cols: any) => {
    var totalCount = rows * cols;

    for (var i = 1; i <= totalCount; i++) {
      var rand = 1 + Math.random() * (100 - 1);

      if (rand > 50) {
        filledSquares.push({
          x: rowCheck(i, rows, cols),
          y: colCheck(i, cols),
        });
      }
    }

    setFilledSquares(filledSquares);
  };

  return (
    <GameContext.Provider
      value={{ rows, setRows, cols, setCols, createBoard, filledSquares }}>
      {props.children}
    </GameContext.Provider>
  );
};
