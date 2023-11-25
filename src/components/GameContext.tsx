import React, { useState } from "react";
interface GameContextProps {
  rows: number;
  cols: number;
  setRows: (val: number) => void;
  setCols: (val: number) => void;
}

export const GameContext = React.createContext<GameContextProps>(
  {} as GameContextProps
);

export const GameContextProvider = (props: any) => {
  const [rows, setRows] = useState<number>(0);
  const [cols, setCols] = useState<number>(0);

  return (
    <GameContext.Provider value={{ rows, setRows, cols, setCols }}>
      {props.children}
    </GameContext.Provider>
  );
};
