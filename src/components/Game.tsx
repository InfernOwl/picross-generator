import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import GameOptions from "./GameOptions";
import GameBoard from "./GameBoard";
import { Cell, Grid, SquarePosition } from "./shared/interfaces";
import { FillStyle } from "./shared/constants";

const Game = () => {
  const { EMPTY, FILLED, X: XMARK } = FillStyle;

  const [rows, setRows] = useState<number>(0);
  const [cols, setCols] = useState<number>(0);

  const [gameBoard, setGameBoard] = useState<Grid[]>([]);
  const [revGameBoard, setRevGameBoard] = useState<Grid[]>([]);

  const [filledSquares, setFilledSquares] = useState<SquarePosition[]>([]);
  const [selectedSquares, setSelectedSquares] = useState<SquarePosition[]>([]);
  const [colHints, setColHints] = useState<String[]>([]);
  const [rowHints, setRowHints] = useState<String[]>([]);

  const [fillStyle, setFillStyle] = useState<FillStyle>(EMPTY);
  const [imageTrack, setImageTrack] = useState<string[]>([]);

  useEffect(() => {
    setFillStyle(EMPTY);

    // Set hint values
    setTimeout(() => {
      setHints(filledSquares, rows, cols);
    }, 1000);
  }, [gameBoard, filledSquares]);

  const mouseEntry = (e: any) => {
    const sqNum = parseInt(e.target.attributes["data-sqnum"].value);
    const xpos = parseInt(e.target.attributes["data-xpos"].value);
    const ypos = parseInt(e.target.attributes["data-ypos"].value);
    // Decide if a square is filled, emptied, or X'd on mouse entry by what the fillStyle is
    switch (fillStyle) {
      case FILLED:
        if (
          imageTrack[sqNum - 1] === EMPTY ||
          imageTrack[sqNum - 1] === XMARK
        ) {
          setSelected(xpos, ypos, sqNum);
        }
        break;
      case XMARK:
        if (imageTrack[sqNum - 1] === EMPTY) {
          setXMark(xpos, ypos, sqNum);
        }
        break;
      case EMPTY:
        if (
          imageTrack[sqNum - 1] === FILLED ||
          imageTrack[sqNum - 1] === XMARK
        ) {
          setEmpty(xpos, ypos, sqNum);
        }
        break;
      default:
        break;
    }
  };

  const prevDef = (e: any) => {
    e.preventDefault();
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

  const fillSelection = (e: any) => {
    const sqNum = parseInt(e.target.attributes["data-sqnum"].value);
    const xpos = parseInt(e.target.attributes["data-xpos"].value);
    const ypos = parseInt(e.target.attributes["data-ypos"].value);

    console.log(`fillselection: ${imageTrack}`);
    // Decide what is done when a square is clicked based on what mouse button was pressed
    // Then set fillstyle to be used for drag selection while mouse button remains down
    var mouseState = e.buttons;
    //mouseDown(e:any);

    switch (mouseState) {
      case 1:
        if (imageTrack[sqNum - 1] === EMPTY) {
          setSelected(xpos, ypos, sqNum);
          setFillStyle(FILLED);
        } else {
          setEmpty(xpos, ypos, sqNum);
          setFillStyle(EMPTY);
        }
        break;
      case 2:
        if (imageTrack[sqNum - 1] === EMPTY) {
          setXMark(xpos, ypos, sqNum);
          setFillStyle(XMARK);
        } else {
          setEmpty(xpos, ypos, sqNum);
          setFillStyle(EMPTY);
        }
        break;
      default:
        break;
    }
  };

  const setXMark = (row: any, col: any, num: any) => {
    var newSelected: SquarePosition[] = selectedSquares.sort();
    var emptySelected: SquarePosition[] = [];

    // Fill current square with X
    setImageTrack(imageTrack.fill(XMARK, num - 1, num));
    newSelected.forEach((s) => {
      if (JSON.stringify(s) !== JSON.stringify({ x: row, y: col })) {
        emptySelected.push(s);
      }
    });

    setSelectedSquares(emptySelected);
  };

  const setSelected = (row: any, col: any, num: any) => {
    var newSelected = selectedSquares.sort();

    // Fill current square
    // Check to see if filling square solved the puzzle
    setImageTrack(imageTrack.fill(FILLED, num - 1, num));
    newSelected.push({ x: row, y: col });
    setSelectedSquares(newSelected);

    setTimeout(() => {
      checkSolve();
    }, 500);
  };

  const setEmpty = (row: any, col: any, num: any) => {
    var newSelected: SquarePosition[] = selectedSquares.sort();
    var emptySelected: SquarePosition[] = [];

    // Remove entry in current square
    // Check to see if removing square solved the puzzle
    setImageTrack(imageTrack.fill(EMPTY, num - 1, num));

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

  const setHints = (filledArr: any, rows: any, cols: any) => {
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

  const createBoard = (rows: number, cols: number) => {
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
        imgHold.push(EMPTY);
        i++;
      }

      eRow.push({ grid: element });
    }

    // Create a reversed board for the column hints
    for (var t = 1; t <= cols; t++) {
      var colElement: Cell[] = [];
      for (var u = 1; u <= rows; u++) {
        colElement.push({ x: u, y: t, num: i });
        imgHold.push(EMPTY);
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
    setHints(filledSquares, rows, cols);
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
    <Container className="gameWrapper">
      <GameOptions
        cols={cols}
        rows={rows}
        setCols={setCols}
        setRows={setRows}
        createBoard={createBoard}
      />
      <GameBoard
        colHints={colHints}
        rowHints={rowHints}
        imageTrack={imageTrack}
        gameBoard={gameBoard}
        revGameBoard={revGameBoard}
        onMouseDown={fillSelection}
        onContextMenu={prevDef}
        onMouseEnter={mouseEntry}
      />
    </Container>
  );
};

export default Game;
