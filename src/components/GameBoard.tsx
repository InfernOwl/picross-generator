import React from "react";
import Square from "./Square";
import { Grid } from "./shared/interfaces";

export interface GameBoardProps {
  gameBoard: Grid[];
  revGameBoard: Grid[];
  colHints: any;
  rowHints: any;
  onMouseDown: any;
  onContextMenu: any;
  onMouseEnter: any;
  imageTrack: any;
}

const GameBoard = (props: GameBoardProps) => {
  const {
    gameBoard,
    revGameBoard,
    colHints,
    rowHints,
    onMouseDown,
    onContextMenu,
    onMouseEnter,
    imageTrack,
  } = props;

  return (
    <div className="gameField" id="gameField" onContextMenu={onContextMenu}>
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
          {board.grid.map((item, num) => {
            return (
              <Square
                key={num}
                fillstyle={imageTrack[item.num]}
                xpos={item.x}
                ypos={item.y}
                sqnum={item.num}
                onMouseDown={onMouseDown}
                onContextMenu={onContextMenu}
                onMouseEnter={onMouseEnter}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
