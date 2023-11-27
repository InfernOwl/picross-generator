import React, { useEffect, useState } from "react";
import { Cell, Grid } from "./shared/interfaces";
interface GameContextProps {
  createBoard: (rows: number, columns: number) => void;
  filledSquares: { x: any; y: any }[];
  gameBoard: Grid[];
  revGameBoard: Grid[];
  imageTrack: any[];
  fillSelection: (e: any) => void;
  mouseEntry: (e: any) => void;
  colHints: any[];
  rowHints: any[];
}

export const GameContext = React.createContext<GameContextProps>(
  {} as GameContextProps
);

export const GameContextProvider = (props: any) => {
  const [filledSquares, setFilledSquares] = useState<{ x: any; y: any }[]>([]);
  const [gameBoard, setGameBoard] = useState<Grid[]>([]);
  const [revGameBoard, setRevGameBoard] = useState<Grid[]>([]);
  const [imageTrack, setImageTrack] = useState<any[]>([]);
  const [fillStyle, setFillStyle] = useState<string>("blank");

  const [selectedSquares, setSelectedSquares] = useState<{ x: any; y: any }[]>(
    []
  );

  const [colHints, setColHints] = useState<any[]>([]);
  const [rowHints, setRowHints] = useState<any[]>([]);

  // useEffect(() => {
  //   if (gameBoard.length === 0) clearState();

  //   // // Set hint values
  //   // setTimeout(() => {
  //   //   setHints(filledSquares, rows, cols);
  //   // }, 1000);
  // }, [gameBoard]);

  const clearState = () => {
    setGameBoard([]);
    setRevGameBoard([]);

    setColHints([]);
    setRowHints([]);
    setImageTrack([]);

    setSelectedSquares([]);
    setFillStyle("blank");
  };

  const createBoard = (rows: number, cols: number) => {
    clearState();
    console.log("Context: here");
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
    setGameBoard(eRow);
    setRevGameBoard(eCol);
    setImageTrack(imgHold);
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

  const fillSelection = (e: any) => {
    console.log("FillSelection");
    // Decide what is done when a square is clicked based on what mouse button was pressed
    // Then set fillstyle to be used for drag selection while mouse button remains down
    var mouseState = e.buttons;
    //mouseDown(e:any);

    switch (mouseState) {
      case 1:
        if (
          imageTrack[parseInt(e.target.attributes.sqnum.value) - 1] === "empty"
        ) {
          setSelected(
            parseInt(e.target.attributes.xpos.value),
            parseInt(e.target.attributes.ypos.value),
            parseInt(e.target.attributes.sqnum.value)
          );
          setFillStyle("fill");
        } else {
          setEmpty(
            parseInt(e.target.attributes.xpos.value),
            parseInt(e.target.attributes.ypos.value),
            parseInt(e.target.attributes.sqnum.value)
          );
          setFillStyle("empty");
        }
        break;
      case 2:
        if (
          imageTrack[parseInt(e.target.attributes.sqnum.value) - 1] === "empty"
        ) {
          setXMark(
            parseInt(e.target.attributes.xpos.value),
            parseInt(e.target.attributes.ypos.value),
            parseInt(e.target.attributes.sqnum.value)
          );
          setFillStyle("x");
        } else {
          setEmpty(
            parseInt(e.target.attributes.xpos.value),
            parseInt(e.target.attributes.ypos.value),
            parseInt(e.target.attributes.sqnum.value)
          );

          setFillStyle("empty");
        }
        break;
      default:
        break;
    }
  };

  const setSelected = (row: any, col: any, num: any) => {
    var newSelected = selectedSquares.sort();

    // Fill current square
    // Check to see if filling square solved the puzzle
    setImageTrack(imageTrack.fill("filled", num - 1, num));
    newSelected.push({ x: row, y: col });
    setSelectedSquares(newSelected);

    setTimeout(() => {
      checkSolve();
    }, 500);
  };

  const setEmpty = (row: any, col: any, num: any) => {
    var newSelected: { x: any; y: any }[] = selectedSquares.sort();
    var emptySelected: { x: any; y: any }[] = [];

    // Remove entry in current square
    // Check to see if removing square solved the puzzle
    setImageTrack(imageTrack.fill("empty", num - 1, num));

    newSelected.forEach((s) => {
      if (JSON.stringify(s) !== JSON.stringify({ x: row, y: col })) {
        emptySelected.push(s);
      }
    });
    setSelectedSquares(emptySelected);

    setTimeout(() => {
      checkSolve();
    }, 500);
  };

  const setXMark = (row: any, col: any, num: any) => {
    var newSelected: { x: any; y: any }[] = selectedSquares.sort();
    var emptySelected: { x: any; y: any }[] = [];

    // Fill current square with X
    setImageTrack(imageTrack.fill("X", num - 1, num));
    newSelected.forEach((s) => {
      if (JSON.stringify(s) !== JSON.stringify({ x: row, y: col })) {
        emptySelected.push(s);
      }
    });

    setSelectedSquares(emptySelected);
  };

  const checkSolve = () => {
    var solved = true;

    selectedSquares.forEach((s: any) => {
      var found = false;
      filledSquares.forEach((f: any) => {
        if (JSON.stringify(f) === JSON.stringify(s)) {
          found = true;
        }
      });

      if (!found) {
        solved = false;
      }
    });

    if (solved && selectedSquares.length === filledSquares.length) {
      alert("YOU DID IT");
    }
  };

  const mouseEntry = (e: any) => {
    // Decide if a square is filled, emptied, or X'd on mouse entry by what the fillStyle is
    switch (fillStyle) {
      case "fill":
        if (
          imageTrack[parseInt(e.target.attributes.sqnum.value) - 1] ===
            "empty" ||
          imageTrack[parseInt(e.target.attributes.sqnum.value) - 1] === "X"
        ) {
          setSelected(
            parseInt(e.target.attributes.xpos.value),
            parseInt(e.target.attributes.ypos.value),
            parseInt(e.target.attributes.sqnum.value)
          );
        }
        break;
      case "x":
        if (
          imageTrack[parseInt(e.target.attributes.sqnum.value) - 1] === "empty"
        ) {
          setXMark(
            parseInt(e.target.attributes.xpos.value),
            parseInt(e.target.attributes.ypos.value),
            parseInt(e.target.attributes.sqnum.value)
          );
        }
        break;
      case "empty":
        if (
          imageTrack[parseInt(e.target.attributes.sqnum.value) - 1] ===
            "filled" ||
          imageTrack[parseInt(e.target.attributes.sqnum.value) - 1] === "X"
        ) {
          setEmpty(
            parseInt(e.target.attributes.xpos.value),
            parseInt(e.target.attributes.ypos.value),
            parseInt(e.target.attributes.sqnum.value)
          );
        }
        break;
      default:
        break;
    }
  };

  const setHints = (filledArr: any, rows: any, cols: any) => {
    // Iterate through filledArr and create colHint array and rowHint array to pass to state
    setRowHints(setHintR(filledArr, rows, cols));

    setColHints(setHintsC(filledArr, rows, cols));
  };

  const setHintR = (arr: any, rows: any, cols: any): any[] => {
    var hint = "";
    var hintArr: String[] = [];
    var count = 0;
    var found = false;

    // Set rowHints first
    for (var i = 1; i <= rows; i++) {
      count = 0;
      found = false;
      hint = "";
      hintArr = rowHints;

      for (var j = 1; j <= cols; j++) {
        found = false;

        for (var k = 0; k < arr.length; k++) {
          if (i === arr[k].x && j === arr[k].y) {
            found = true;
            count++;
          }
        }

        if (!found || j === cols) {
          if (count > 0) {
            hint = hint + count;
            count = 0;
          }
        }

        if (hint === "" && j === cols && !found) {
          hint = "0";
        }
      }

      hintArr.push(hint);
    }

    return hintArr;
  };

  const setHintsC = (arr: any, rows: any, cols: any) => {
    var hint = "";
    var hintArr: String[] = [];
    var count = 0;
    var found = false;

    // Set colHints second
    for (var j = 1; j <= cols; j++) {
      count = 0;
      found = false;
      hint = "";
      hintArr = colHints;

      for (var i = 1; i <= rows; i++) {
        found = false;

        for (var k = 0; k < arr.length; k++) {
          if (i === arr[k].x && j === arr[k].y) {
            found = true;
            count++;
          }
        }

        if (!found || i === rows) {
          if (count > 0) {
            hint = hint + count;
            count = 0;
          }
        }

        if (hint === "" && i === rows && !found) {
          hint = "0";
        }
      }

      hintArr.push(hint);
    }

    return hintArr;
  };

  return (
    <GameContext.Provider
      value={{
        createBoard,
        filledSquares,
        gameBoard,
        revGameBoard,
        imageTrack,
        colHints,
        rowHints,
        fillSelection,
        mouseEntry,
      }}>
      {props.children}
    </GameContext.Provider>
  );
};
