import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Square from './Square';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            levelBeaten: false,
            rows: 3,
            cols: 3,
            gameBoard: [],
            revGameBoard: [],
            imageTrack: [],
            colHints: [],
            rowHints: [],
            filledSquares: [],
            selectedSquares: [],
            chance: 50,
        };
    }

    createBoard (rows, cols) {

        // Hard reset of all parameters
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
        for (var y=1; y <= cols; y++) {

            var element = [];
            for (var x=1; x <= rows; x++) {
                    element.push({x: x, y: y, num: i});
                    imgHold.push( 'empty' );
                    i++;
            }

            eCol.push({row: element});
            
        }

        // Board is created now randomly choose which squares get filled
        this.setFilled(rows, cols);

        // Set hint values
        setTimeout(() => {
            this.setHints(this.state.gameBoard, this.state.filledSquares, rows, cols)
        }, 1000);


        // Instantiate, basically
        this.setState({gameBoard: eRow, revGameBoard: eCol, imageTrack: imgHold});
    }

    rowsUpdate(e) {
            this.setState({rows: e.target.value});
    }

    colsUpdate(e) {
            this.setState({cols: e.target.value});
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

    setHints(gameBoard, filledArr, rows, cols) {
        // Iterate through filledArr and create colHint array and rowHint array to pass to state
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

                for (var k=0; k < filledArr.length; k++) {
                    
                    if (i === filledArr[k].x && j === filledArr[k].y) {
                        console.log(i+", "+j+" && "+filledArr[k].x+", "+filledArr[k].y);
                        found = true;
                        count++;
                    }
                }
                
                console.log("J: " + j + ", Cols: " + cols + ", Count: " + count + ", Found: " + found);
                console.log(j == cols);
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

        console.log("Rows");
        console.log(hintArr);
        this.setState({rowHints: hintArr});

        // Set colHints second
        for (var j=1; j <= cols; j++) {
            count = 0;
            found = false;
            hint = "";
            hintArr = this.state.colHints;
            

            for (var i=1; i <= rows; i++) {
                found = false;

                for (var k=0; k < filledArr.length; k++) {
                    if (i === filledArr[k].x && j === filledArr[k].y) {
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

        console.log("Cols");
        console.log(hintArr);
        this.setState({colHints: hintArr});
    }

    setSelected(row, col, num) {

        var newSelected = this.state.selectedSquares.sort();
        var emptySelected = [];

        // If square is not already selected, change image to show that it is and add it to the selected list.
        // If square is already selected, change image to show it isn't now, and remove it from the selected list.
        if (this.state.imageTrack[num-1] === 'empty') {
            this.setState({imageTrack: this.state.imageTrack.fill('filled', num-1, num)});
            newSelected.push({x:row, y:col});
            this.setState({selectedSquares: newSelected});
        } else {
            this.setState({imageTrack: this.state.imageTrack.fill('empty', num-1, num)});
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

    checkSolve() {
        var solved = true;

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

        if (solved && (this.state.selectedSquares.length === this.state.filledSquares.length)) {
            alert("YOU DID IT");
        }
    }

    getAnswer() {
        console.log(this.state.gameBoard);
        console.log(this.state.revGameBoard);
    }

    getClicked() {
        console.log(this.state.filledSquares);
    }

    render() {
        return (
            <div className="gameWrapper">
                <p>Grid Size: </p>
                Rows <select value={this.state.rows} onChange={(e) => this.rowsUpdate(e)} placeholder={this.state.rows}>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                </select>
                 X 
                Cols<select value={this.state.cols} onChange={(e) => this.colsUpdate(e)} placeholder={this.state.cols}>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                </select>

                <button  onClick={() => this.createBoard(this.state.rows, this.state.cols)}> Create Board </button>
                <div className="gameField" id="gameField">
                    <div className="columnHint">
                        {
                            this.state.revGameBoard.map((column, key) => (
                                <div className="colHint" >{this.state.colHints[key]}</div>
                            ))
                        }
                    </div>
                    {
                        this.state.gameBoard.map((fubar, key) =>(
                            <div className="row">
                                {
                                    fubar.row.map((item, num) => (
                                        <Square image={this.state.imageTrack[item.num-1]} onClick={() => this.setSelected(item.x, item.y, item.num)}></Square>
                                    ))
                                }
                                <div className="rowHint" >{this.state.rowHints[key]}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Game;