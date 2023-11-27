import React, { useContext } from "react";
import Square from "./Square";
import { GameContext } from "./GameContext";

export interface GameBoardProps {}

const GameBoard = (props: GameBoardProps) => {
  const {
    gameBoard,
    revGameBoard,
    imageTrack,
    fillSelection,
    mouseEntry,
    colHints,
    rowHints,
  } = useContext(GameContext);

  const prevDef = (e: any) => {
    e.preventDefault();
  };

  return (
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
          {board.grid.map((item, num) => {
            console.log(item);
            console.log(imageTrack);
            return (
              <Square
                key={num}
                image={imageTrack[item.num]}
                xpos={item.x}
                ypos={item.y}
                sqnum={item.num}
                onMouseDown={fillSelection}
                onContextMenu={prevDef}
                onMouseEnter={mouseEntry}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
