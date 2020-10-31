import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Square from './Square';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            levelBeaten: false,
            rows: "",
            cols: "",
            gameBoard: [],
            revGameBoard: [],
            imageTrack: [],
            colHints: [],
            rowHints: [],
            filledSquares: [],
            selectedSquares: [],
            chance: 50,
            mouseDown: false,
            fillStyle: "blank",
        };
    }

    createBoard (rows, cols) {

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

        for (var x=1; x <= rows; x++) {

            var element = [];
            for (var y=1; y <= cols; y++) {
                    element.push({x: x, y: y, num: i});
                    imgHold.push( 'empty' );
                    i++;
            }

            eRow.push({row: element});
            
        }

        // Create a reversed board for the column hints
        for (var t=1; t <= cols; t++) {

            var colElement = [];
            for (var u=1; u <= rows; u++) {
                    colElement.push({x: u, y: t, num: i});
                    imgHold.push( 'empty' );
                    i++;
            }

            eCol.push({row: colElement});
            
        }

        // Board is created now randomly choose which squares get filled
        this.setFilled(rows, cols);

        // Set hint values
        setTimeout(() => {
            this.setHints(this.state.filledSquares, rows, cols)
        }, 1000);


        // Instantiate, basically
        this.setState({gameBoard: eRow, revGameBoard: eCol, imageTrack: imgHold});
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
            this.setState({rows: e.target.value.toString()});
        }
    }

    colsUpdate(e) {
        if (this.validNumber(e.target.value)) {
            this.setState({cols: e.target.value});
        }
    }

    rowCheck(val, rows, cols) {
        for (var i=1; i <= rows; i++) {
            if (val <= cols*i) {
                return i;
            }
        }
    }

    colCheck(val, cols) {
        if ( ((val % cols) === 0)) {
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

        for (var i=1; i <= totalCount; i++) {
            var rand = 1 + Math.random() * (100 - 1);

            if (rand > 50) {
                filledSquares.push({x: this.rowCheck(i, rows, cols), y: this.colCheck(i, cols)});
            }
        }

        this.setState({filledSquares: filledSquares});
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
        for (var i=1; i <= rows; i++) {
            count = 0;
            found = false;
            hint = "";
            hintArr = this.state.rowHints;
            

            for (var j=1; j <= cols; j++) {
                found = false;

                for (var k=0; k < arr.length; k++) {
                    
                    if (i === arr[k].x && j === arr[k].y) {
                        found = true;
                        count++;
                    }
                }

                if (!found || j == cols) {
                    if (count > 0) {
                        hint = hint + count;
                        count = 0;    
                    }
                }

                
                if (hint === "" && j == cols && !found) {
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
        for (var j=1; j <= cols; j++) {
            count = 0;
            found = false;
            hint = "";
            hintArr = this.state.colHints;
            

            for (var i=1; i <= rows; i++) {
                found = false;

                for (var k=0; k < arr.length; k++) {
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
        this.setState({rowHints: this.setRowHints(filledArr, rows, cols)});

        this.setState({colHints: this.setColHints(filledArr, rows, cols)});
        
    }

    fillSelection(e) {
        var mouseState = e.buttons;
        this.mouseDown(e);

        switch (mouseState) {
            case 1: 
                this.setSelected(parseInt(e.target.attributes.xpos.value), parseInt(e.target.attributes.ypos.value), parseInt(e.target.attributes.sqnum.value));
                break;
            case 2:
                this.setXMark(parseInt(e.target.attributes.xpos.value), parseInt(e.target.attributes.ypos.value), parseInt(e.target.attributes.sqnum.value));
                break;
            default:
                break;
        }

    }

    mouseEntry(e) {
        console.log("Made it into mouseEntry");
        switch (this.state.fillStyle) {
            case "solid": 
                this.setSelected(parseInt(e.target.attributes.xpos.value), parseInt(e.target.attributes.ypos.value), parseInt(e.target.attributes.sqnum.value));
                this.setState({fillStyle: "solid"});
                break;
            case "x":
                this.setXMark(parseInt(e.target.attributes.xpos.value), parseInt(e.target.attributes.ypos.value), parseInt(e.target.attributes.sqnum.value));
                this.setState({fillStyle: "x"});
                break;
            default:
                break;
        }
    }

    setSelected(row, col, num) {

        var newSelected = this.state.selectedSquares.sort();
        var emptySelected = [];

        // If square is not already selected, change image to show that it is and add it to the selected list.
        // If square is already selected, change image to show it isn't now, and remove it from the selected list.
        if (this.state.imageTrack[num-1] === 'empty') {
            this.setState({
                imageTrack: this.state.imageTrack.fill('filled', num-1, num),
                fillStyle: "solid"});
            newSelected.push({x:row, y:col});
            this.setState({selectedSquares: newSelected});
        } else {
            this.setState({
                imageTrack: this.state.imageTrack.fill('empty', num-1, num),
                fillStyle: "blank"});
            newSelected.forEach(s => {
                if (JSON.stringify(s) !== JSON.stringify({x: row, y: col})) {
                    emptySelected.push(s);
                }
            });

            this.setState({selectedSquares: emptySelected});
        }

        setTimeout(() => {
            this.checkSolve();
        }, 500);
    }

    setXMark(row, col, num) {
        var newSelected = this.state.selectedSquares.sort();
        var emptySelected = [];

        // If square is not already selected, change image to show that it is and add it to the selected list.
        // If square is already selected, change image to show it isn't now, and remove it from the selected list.
        if (this.state.imageTrack[num-1] === 'empty') {
            this.setState({
                imageTrack: this.state.imageTrack.fill('X', num-1, num),
                fillStyle: "x"});
        } else if (this.state.imageTrack[num-1] === 'filled') {
            this.setState({
                imageTrack: this.state.imageTrack.fill('X', num-1, num),
                fillStyle: "blank"});
            newSelected.forEach(s => {
                if (JSON.stringify(s) !== JSON.stringify({x: row, y: col})) {
                    emptySelected.push(s);
                }
            });

            this.setState({selectedSquares: emptySelected});
        } else {
            this.setState({imageTrack: this.state.imageTrack.fill('empty', num-1, num)});
        }

        setTimeout(() => {
            this.checkSolve();
        }, 500);
    }

    // Code to change the state of mouse position
    mouseDown(e) {
        e.preventDefault();
        this.setState({mouseDown: true});
    }
    mouseUp(e) {
        e.preventDefault();
        this.setState({mouseDown: false, fillStyle: "blank"});
    }
    prevDef(e) {
        // Helper function specifically to prevent default right click action
        // We'll clean it up later
        e.preventDefault();
    }

    // Check after each cell fill/unfill to see if the squares the user has selected match
    // the cells in the filledSquares array in this.state
    checkSolve() {
        console.log("Checking the solve");
        var solved = true;

        console.log("Comparison");
        console.log(JSON.stringify(this.state.filledSquares));
        console.log(JSON.stringify(this.state.selectedSquares));

        this.state.selectedSquares.forEach(s => {

            var found = false;
            this.state.filledSquares.forEach(f => {
                if (JSON.stringify(f) === JSON.stringify(s)) {
                    found = true;
                }
            });

            if (!found) {
                solved = false;
            }
        });

        console.log(solved);
        if (solved && (this.state.selectedSquares.length === this.state.filledSquares.length)) {
            console.log("solved..... bitch");
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
            <div className="gameWrapper"  onMouseUp={(e) => this.mouseUp(e)}>
                <p>Grid Size: </p>
                <input size="10" placeholder="Row Amount" value={this.state.rows} onChange={(e) => this.rowsUpdate(e)}></input>
                 X 
                <input size="10" placeholder="Col Amount" value={this.state.cols} onChange={(e) => this.colsUpdate(e)}></input>

                <button onClick={() => this.createBoard(this.state.rows, this.state.cols)}> Create Board </button>
                <div className="gameField" id="gameField">
                    <div className="columnHint">
                        {
                            this.state.revGameBoard.map((column, key) => (
                                <div className="colHint" key={key}>{this.state.colHints[key]}</div>
                            ))
                        }
                    </div>
                    {
                        this.state.gameBoard.map((fubar, key) =>(
                            <div className="row" key={key}>
                                <div className="rowHint" >{this.state.rowHints[key]}</div>
                                {
                                    fubar.row.map((item, num) => (
                                        <Square key={num} image={this.state.imageTrack[item.num-1]} xpos={item.x} ypos={item.y} sqnum={item.num} onMouseDown={(e) => this.fillSelection(e)} onContextMenu={(e) => this.prevDef(e)} onMouseEnter={(e) => this.mouseEntry(e)}></Square>
                                    ))
                                }
                                
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Game;