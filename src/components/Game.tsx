import React, { useState } from "react";
import Square from "./Square";
import Container from "react-bootstrap/Container";

interface Cell {
  x: number;
  y: number;
  num: number;
}

interface Grid {
  grid: Cell[];
}

const Game = () => {
  const [levelBeaten, setLevelBeaten] = useState<boolean>(false);
  const [rows, setRows] = useState<string>("");
  const [cols, setCols] = useState<string>("");
  const [gameBoard, setGameBoard] = useState<Grid[]>([]);
  const [revGameBoard, setRevGameBoard] = useState<Grid[]>([]);
  const [imageTrack, setImageTrack] = useState<any[]>([]);
  const [colHints, setColHints] = useState<any[]>([]);
  const [rowHints, setRowHints] = useState<any[]>([]);
  const [filledSquares, setFilledSquares] = useState<{ x: any; y: any }[]>([]);
  const [selectedSquares, setSelectedSquares] = useState<{ x: any; y: any }[]>(
    []
  );
  const [chance, setChance] = useState<Number>(50);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [fillStyle, setFillStyle] = useState<string>("blank");

  //   useEffect(() => {

  // }, []);

  const createBoard = (rows: any, cols: any) => {
    // Fail if Rows or Columns are not valid
    if (!validNumber(rows) || !validNumber(cols)) {
      return false;
    }

    // Hard reset of all parameters on board creation
    setLevelBeaten(false);
    setGameBoard([]);
    setRevGameBoard([]);
    setImageTrack([]);
    setColHints([]);
    setRowHints([]);
    setFilledSquares([]);
    setSelectedSquares([]);
    setChance(50);
    setMouseDown(false);
    setFillStyle("blank");

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

    // Set hint values
    setTimeout(() => {
      setHints(filledSquares, rows, cols);
    }, 1000);

    // Instantiate, basically
    setGameBoard(eRow);
    setRevGameBoard(eCol);
    setImageTrack(imgHold);
  };

  // Move to Util
  const validNumber = (num: any) => {
    var regex = new RegExp("^$|[-+]?[1-9]\\d*");
    var valid = false;

    if (regex.test(num) && parseInt(num) <= 20) {
      valid = true;
    }

    return valid;
  };

  const rowsUpdate = (e: any) => {
    if (validNumber(e.target.value.toString())) {
      setRows(e.target.value.toString());
    }
  };

  const colsUpdate = (e: any) => {
    if (validNumber(e.target.value)) {
      setCols(e.target.value);
    }
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

  const setHints = (filledArr: any, rows: any, cols: any) => {
    // Iterate through filledArr and create colHint array and rowHint array to pass to state
    setRowHints(setHintR(filledArr, rows, cols));

    setColHints(setHintsC(filledArr, rows, cols));
  };

  const fillSelection = (e: any) => {
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

  // const mouseDownHandler = (e:any) => {
  //   e.preventDefault();
  //   setMouseDown(true);
  // };

  const mouseUpHandler = (e: any) => {
    e.preventDefault();
    setMouseDown(false);
    setFillStyle("blank");
  };

  const prevDef = (e: any) => {
    e.preventDefault();
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

  // const getAnswer = () => {
  //   console.log(gameBoard);
  // };

  // const getClicked = () => {
  //   console.log(filledSquares);
  // };

  return (
    <div className="gameWrapper" onMouseUp={mouseUpHandler}>
      <p>Grid Size: </p>
      <input
        size={10}
        placeholder="Row Amount"
        value={rows}
        onChange={rowsUpdate}
      />
      X
      <input
        size={10}
        placeholder="Col Amount"
        value={cols}
        onChange={colsUpdate}
      />
      <button onClick={() => createBoard(rows, cols)}> Create Board </button>
      <div className="gameField" id="gameField" onContextMenu={prevDef}>
        <div className="columnHint">
          {revGameBoard.map((column, key) => (
            <div className="colHint" key={key}>
              {colHints[key]}
            </div>
          ))}
        </div>
        {gameBoard.map((board, key) => (
          <div className="row" key={key}>
            <div className="rowHint">{rowHints[key]}</div>
            {board.grid.map((item, num) => (
              <Square
                key={num}
                image={imageTrack[item.num - 1]}
                xpos={item.x}
                ypos={item.y}
                sqnum={item.num}
                onMouseDown={fillSelection}
                onContextMenu={prevDef}
                onMouseEnter={mouseEntry}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
