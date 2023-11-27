import React, { Dispatch, SetStateAction, useState } from "react";
import { Cell, Grid } from "./shared/interfaces";
interface GameContextProps {
  createBoard: (rows: number, columns: number) => void;
  rows: number;
  cols: number;
  setRows: (val: number) => void;
  setCols: (val: number) => void;
}

export const GameContext = React.createContext<GameContextProps>(
  {} as GameContextProps
);

// export const GameContextProvider = (props: any) => {

//   return (
//     // <GameContext.Provider
//     //   // value={{
//     //   //   createBoard,
//     //   //   rows,
//     //   //   setRows,
//     //   //   cols,
//     //   //   setCols,
//     //   // }}
//     //   >
//     //   {props.children}
//     // </GameContext.Provider>
//   );
// };
