import React, { useState } from "react";
import Square from "./Square";
import Container from "react-bootstrap/Container";

function Game() {
  const [levelBeaten, setLevelBeaten] = useState(false);
  const [rows, setRows] = useState("");
  const [cols, setCols] = useState("");
  const [gameBoard, setGameBoard] = useState([]);
  const [revGameBoard, setRevGameBoard] = useState([]);
  const [imageTrack, setImageTrack] = useState([]);
  const [colHints, setColHints] = useState([]);
  const [rowHints, setRowHints] = useState([]);
  const [filledSquares, setFilledSquares] = useState([]);
  const [selectedSquares, setSelectedSquares] = useState([]);
  const [chance, setChance] = useState(50);
  const [mouseDown, setMouseDown] = useState(false);
  const [fillStyle, setFillStyle] = useState("blank");


//   useEffect(() => {

// }, []);

  const createBoard = (rows, cols) => {
    // Fail if Rows or Columns are not valid
    if (!validNumber(rows) || !validNumber(cols)) {
        return false;
      }
  
      // Hard reset of all parameters on board creation
      setLevelBeaten(false);
      setGameBoard([]);
      setImageTrack ([]);
      colHints([]);
      rowHints([]);
      filledSquares([]);
      selectedSquares([]);
      chance(50);
      mouseDown(false);
      fillStyle("blank");
     
      // For x amount of rows and y amount of cols create a grid to match
      // where each grid item has a Square object
      var eRow = [];
      var eCol = [];
  
      // Create imageTracking list for filled and unfilled squares
      var imgHold = [];
      var i = 1;
  
      for (var x = 1; x <= rows; x++) {
        var element = [];
        for (var y = 1; y <= cols; y++) {
          element.push({ x: x, y: y, num: i });
          imgHold.push("empty");
          i++;
        }
  
        eRow.push({ row: element });
      }
  
      // Create a reversed board for the column hints
      for (var t = 1; t <= cols; t++) {
        var colElement = [];
        for (var u = 1; u <= rows; u++) {
          colElement.push({ x: u, y: t, num: i });
          imgHold.push("empty");
          i++;
        }
  
        eCol.push({ row: colElement });
      }
  
      // Board is created now randomly choose which squares get filled
      this.setFilled(rows, cols);
  
      // Set hint values
      setTimeout(() => {
        this.setHints(this.state.filledSquares, rows, cols);
      }, 1000);
  
      // Instantiate, basically
      this.setState({ gameBoard: eRow, revGameBoard: eCol, imageTrack: imgHold });
  };

  // Move to Util
  const validNumber = (num) => {
    var regex = new RegExp("^$|[-+]?[1-9]\\d*");
    var valid = false;

    if (regex.test(num) && parseInt(num) <= 20) {
      valid = true;
    }

    return valid;
  };

  const rowsUpdate = (e) => {
    if (validNumber(e.target.value.toString())) {
      setRows(e.target.value.toString());
    }
  };

  const colsUpdate = (e) => {
    if (validNumber(e.target.value)) {
      setCols(e.target.value);
    }
  };

  const rowCheck =(val, rows, cols) => {
    for (var i = 1; i <= rows; i++) {
      if (val <= cols * i) {
        return i;
      }
    }
  }

  const colCheck = (val, cols) =>{
    if (val % cols === 0) {
      return parseInt(cols);
    } else {
      return val % cols;
    }
  }

  const setFilled = (rows, cols)=> {
    var totalCount = rows * cols;
    var squares = [];

    for (var i = 1; i <= totalCount; i++) {
      var rand = 1 + Math.random() * (100 - 1);

      if (rand > 50) {
        filledSquares.push({
          x: this.rowCheck(i, rows, cols),
          y: this.colCheck(i, cols),
        });
      }
    }

    this.setState({ filledSquares: filledSquares });
  }

  const setHintR=(arr, rows, cols)=> {
    var hint = "";
    var hintArr = [];
    var count = 0;
    var found = false;

    // Set rowHints first
    for (var i = 1; i <= rows; i++) {
      count = 0;
      found = false;
      hint = "";
      hintArr = this.state.rowHints;

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
  }
  const setHintsC =(arr, rows, cols) =>{
    var hint = "";
    var hintArr = [];
    var count = 0;
    var found = false;

    // Set colHints second
    for (var j = 1; j <= cols; j++) {
      count = 0;
      found = false;
      hint = "";
      hintArr = this.state.colHints;

      for (var i = 1; i <= rows; i++) {
        found = false;

        for (var k = 0; k < arr.length; k++) {
          if (i === arr[k].x && j === arr[k].y) {
            found = true;
            count++;
          }
        }

        if (!found || i == rows) {
          if (count > 0) {
            hint = hint + count;
            count = 0;
          }
        }

        if (hint === "" && i == rows && !found) {
          hint = "0";
        }
      }

      hintArr.push(hint);
    }

    return hintArr;
  }

  const setHints = (filledArr, rows, cols) => {
    // Iterate through filledArr and create colHint array and rowHint array to pass to state
   setRowHints(setHintR(filledArr, rows, cols)) 

    setColHints(setHintsC(filledArr, rows, cols));
  }


  const fillSelection = (e) => {
    // Decide what is done when a square is clicked based on what mouse button was pressed
    // Then set fillstyle to be used for drag selection while mouse button remains down
    var mouseState = e.buttons;
    this.mouseDown(e);

    switch (mouseState) {
      case 1:
        if (
          this.state.imageTrack[
            parseInt(e.target.attributes.sqnum.value) - 1
          ] === "empty"
        ) {
          this.setSelected(
            parseInt(e.target.attributes.xpos.value),
            parseInt(e.target.attributes.ypos.value),
            parseInt(e.target.attributes.sqnum.value)
          );
          this.setState({ fillStyle: "fill" });
        } else {
          this.setEmpty(
            parseInt(e.target.attributes.xpos.value),
            parseInt(e.target.attributes.ypos.value),
            parseInt(e.target.attributes.sqnum.value)
          );
          this.setState({ fillStyle: "empty" });
        }
        break;
      case 2:
        if (
          this.state.imageTrack[
            parseInt(e.target.attributes.sqnum.value) - 1
          ] === "empty"
        ) {
          this.setXMark(
            parseInt(e.target.attributes.xpos.value),
            parseInt(e.target.attributes.ypos.value),
            parseInt(e.target.attributes.sqnum.value)
          );
          this.setState({ fillStyle: "x" });
        } else {
          this.setEmpty(
            parseInt(e.target.attributes.xpos.value),
            parseInt(e.target.attributes.ypos.value),
            parseInt(e.target.attributes.sqnum.value)
          );
          this.setState({ fillStyle: "empty" });
        }
        break;
      default:
        break;
    }
  };

  const mouseEntry = (e) => {
    // Decide if a square is filled, emptied, or X'd on mouse entry by what the fillStyle is
    switch (this.state.fillStyle) {
        case "fill":
          if (
            this.state.imageTrack[
              parseInt(e.target.attributes.sqnum.value) - 1
            ] === "empty" ||
            this.state.imageTrack[
              parseInt(e.target.attributes.sqnum.value) - 1
            ] === "X"
          ) {
            this.setSelected(
              parseInt(e.target.attributes.xpos.value),
              parseInt(e.target.attributes.ypos.value),
              parseInt(e.target.attributes.sqnum.value)
            );
          }
          break;
        case "x":
          if (
            this.state.imageTrack[
              parseInt(e.target.attributes.sqnum.value) - 1
            ] === "empty"
          ) {
            this.setXMark(
              parseInt(e.target.attributes.xpos.value),
              parseInt(e.target.attributes.ypos.value),
              parseInt(e.target.attributes.sqnum.value)
            );
          }
          break;
        case "empty":
          if (
            this.state.imageTrack[
              parseInt(e.target.attributes.sqnum.value) - 1
            ] === "filled" ||
            this.state.imageTrack[
              parseInt(e.target.attributes.sqnum.value) - 1
            ] === "X"
          ) {
            this.setEmpty(
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

  const setSelected = (row, col, num) => {
    var newSelected = this.state.selectedSquares.sort();
    var emptySelected = [];

    // Fill current square
    // Check to see if filling square solved the puzzle
    this.setState({
      imageTrack: this.state.imageTrack.fill("filled", num - 1, num),
    });
    newSelected.push({ x: row, y: col });
    this.setState({ selectedSquares: newSelected });

    setTimeout(() => {
      this.checkSolve();
    }, 500);
  };

  const setXMark = (row, col, num) => {
    var newSelected = this.state.selectedSquares.sort();
    var emptySelected = [];

    // Fill current square with X
    this.setState({
      imageTrack: this.state.imageTrack.fill("X", num - 1, num),
    });
    newSelected.forEach((s) => {
      if (JSON.stringify(s) !== JSON.stringify({ x: row, y: col })) {
        emptySelected.push(s);
      }
    });

    this.setState({ selectedSquares: emptySelected });
  };

  const setEmpty = (row, col, num) => {
    var newSelected = this.state.selectedSquares.sort();
    var emptySelected = [];

    // Remove entry in current square
    // Check to see if removing square solved the puzzle
    this.setState({
      imageTrack: this.state.imageTrack.fill("empty", num - 1, num),
    });

    newSelected.forEach((s) => {
      if (JSON.stringify(s) !== JSON.stringify({ x: row, y: col })) {
        emptySelected.push(s);
      }
    });

    this.setState({ selectedSquares: emptySelected });

    setTimeout(() => {
      this.checkSolve();
    }, 500);
  };

  const mouseDownHandler = (e) => {
    e.preventDefault();
    setMouseDown(true);
  };

  const mouseUpHandler = (e) => {
    e.preventDefault();
    setMouseDown(false);
    setFillStyle("blank");
  };

  const prevDef = (e) => {
    e.preventDefault();
  };

  const checkSolve = () => {
    var solved = true;

    this.state.selectedSquares.forEach((s) => {
      var found = false;
      this.state.filledSquares.forEach((f) => {
        if (JSON.stringify(f) === JSON.stringify(s)) {
          found = true;
        }
      });

      if (!found) {
        solved = false;
      }
    });

    if (
      solved &&
      this.state.selectedSquares.length === this.state.filledSquares.length
    ) {
      alert("YOU DID IT");
    }
  };

  const getAnswer = () => {
    console.log(gameBoard);
  };

  const getClicked = () => {
    console.log(filledSquares);
  };

  return (
    <Container>
      <div className="gameWrapper" onMouseUp={mouseUpHandler}>
        <p>Grid Size: </p>
        <input
          size="10"
          placeholder="Row Amount"
          value={rows}
          onChange={rowsUpdate}
        ></input>
        X
        <input
          size="10"
          placeholder="Col Amount"
          value={cols}
          onChange={colsUpdate}
        ></input>
        <button onClick={() => createBoard(rows, cols)}>
          {" "}
          Create Board{" "}
        </button>
        <div className="gameField" id="gameField" onContextMenu={prevDef}>
          <div className="columnHint">
            {revGameBoard.map((column, key) => (
              <div className="colHint" key={key}>
                {colHints[key]}
              </div>
            ))}
          </div>
          {gameBoard.map((fubar, key) => (
            <div className="row" key={key}>
              <div className="rowHint">{rowHints[key]}</div>
              {fubar.row.map((item, num) => (
                <Square
                  key={num}
                  image={imageTrack[item.num - 1]}
                  xpos={item.x}
                  ypos={item.y}
                  sqnum={item.num}
                  onMouseDown={fillSelection}
                  onContextMenu={prevDef}
                  onMouseEnter={mouseEntry}
                ></Square>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default Game;
