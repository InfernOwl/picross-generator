import React from "react";
import Square from "./Square";
import Container from "react-bootstrap/Container";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      levelBeaten: false, // boolean to check if level is solved
      rows: "", // Number of rows in grid
      cols: "", // Number of columns in grid
      gameBoard: [], // Game Board Array
      revGameBoard: [], // Reverse game board???
      imageTrack: [], // Image tracking dictionary to decide what square should be filled/X'd/empty
      colHints: [], // Array of column hints
      rowHints: [], // Array of Row Hints
      filledSquares: [], // Array of squares needed to be filled
      selectedSquares: [], // Array of squares the player has filled
      chance: 50, // Random chance seed TODO: Figure out a better way to randomly choose squares
      mouseDown: false, // Boolean to track mouse state
      fillStyle: "blank", // Track fill style for square entry
    };
  }

  createBoard(rows, cols) {
    // Fail if Rows or Columns are not valid
    if (!this.validNumber(rows) || !this.validNumber(cols)) {
      return false;
    }

    // Hard reset of all parameters on board creation
    this.setState({
      levelBeaten: false,
      gameBoard: [],
      revGameboard: [],
      imageTrack: [],
      colHints: [],
      rowHints: [],
      filledSquares: [],
      selectedSquares: [],
      chance: 50,
      mouseDown: false,
      fillStyle: "blank",
    });

    this.rowsUpdate = this.rowsUpdate.bind(this);
    this.colsUpdate = this.colsUpdate.bind(this);

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
  }

  validNumber(num) {
    var regex = new RegExp("^$|[-+]?[1-9]\\d*");
    var valid = false;

    if (regex.test(num) && parseInt(num) <= 20) {
      valid = true;
    }

    return valid;
  }

  rowsUpdate(e) {
    if (this.validNumber(e.target.value.toString())) {
      this.setState({ rows: e.target.value.toString() });
    }
  }

  colsUpdate(e) {
    if (this.validNumber(e.target.value)) {
      this.setState({ cols: e.target.value });
    }
  }

  rowCheck(val, rows, cols) {
    for (var i = 1; i <= rows; i++) {
      if (val <= cols * i) {
        return i;
      }
    }
  }

  colCheck(val, cols) {
    if (val % cols === 0) {
      return parseInt(cols);
    } else {
      return val % cols;
    }
  }

  // Loop through the grid and at each square randomly decide if cell should be filled or empty
  // TODO - Figure out a better random seed algorithm. Possibly a difficulty modifier.
  //      - Add check to ensure a set minimum of squares get filled.
  setFilled(rows, cols) {
    var totalCount = rows * cols;
    var filledSquares = [];

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

  // Takes the passed Array (arr), loops through the rows x cols grid and checks to see if
  // the cartesian point is present in arr.
  // If so, the count is increased and the next point is checked.
  // Count is added to the hint array if a break is found or the end of the row is found.
  //
  // Returns the array of rowHints
  setRowHints(arr, rows, cols) {
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

  // Takes the passed Array (arr), loops through the rows x cols grid and checks to see if
  // the cartesian point is present in arr.
  // If so, the count is increased and the next point is checked.
  // Count is added to the hint array if a break is found or the end of the col is found.
  //
  // Returns the array of colHints
  setColHints(arr, rows, cols) {
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

  setHints(filledArr, rows, cols) {
    // Iterate through filledArr and create colHint array and rowHint array to pass to state
    this.setState({ rowHints: this.setRowHints(filledArr, rows, cols) });

    this.setState({ colHints: this.setColHints(filledArr, rows, cols) });
  }

  fillSelection(e) {
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
  }

  mouseEntry(e) {
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
  }

  setSelected(row, col, num) {
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
  }

  setXMark(row, col, num) {
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
  }

  setEmpty(row, col, num) {
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
  }

  // Code to change the state of mouse position
  mouseDown(e) {
    e.preventDefault();
    this.setState({ mouseDown: true });
  }

  mouseUp(e) {
    e.preventDefault();
    this.setState({ mouseDown: false, fillStyle: "blank" });
  }

  prevDef(e) {
    // Helper function specifically to prevent default right click action
    // We'll clean it up later
    e.preventDefault();
  }

  // Check after each cell fill/unfill to see if the squares the user has selected match
  // the cells in the filledSquares array in this.state
  checkSolve() {
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
  }

  getAnswer() {
    console.log(this.state.gameBoard);
  }

  getClicked() {
    console.log(this.state.filledSquares);
  }

  render() {
    return (
      <Container>
        <div className="gameWrapper" onMouseUp={(e) => this.mouseUp(e)}>
          <p>Grid Size: </p>
          <input
            size="10"
            placeholder="Row Amount"
            value={this.state.rows}
            onChange={(e) => this.rowsUpdate(e)}></input>
          X
          <input
            size="10"
            placeholder="Col Amount"
            value={this.state.cols}
            onChange={(e) => this.colsUpdate(e)}></input>
          <button
            onClick={() => this.createBoard(this.state.rows, this.state.cols)}>
            {" "}
            Create Board{" "}
          </button>
          <div
            className="gameField"
            id="gameField"
            onContextMenu={(e) => this.prevDef(e)}>
            <div className="columnHint">
              {this.state.revGameBoard.map((column, key) => (
                <div className="colHint" key={key}>
                  {this.state.colHints[key]}
                </div>
              ))}
            </div>
            {this.state.gameBoard.map((fubar, key) => (
              <div className="row" key={key}>
                <div className="rowHint">{this.state.rowHints[key]}</div>
                {fubar.row.map((item, num) => (
                  <Square
                    key={num}
                    image={this.state.imageTrack[item.num - 1]}
                    xpos={item.x}
                    ypos={item.y}
                    sqnum={item.num}
                    onMouseDown={(e) => this.fillSelection(e)}
                    onContextMenu={(e) => this.prevDef(e)}
                    onMouseEnter={(e) => this.mouseEntry(e)}></Square>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }
}

export default Game;
