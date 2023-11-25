import React, { useContext } from "react";
import { Button, InputNumber } from "antd";
import { GameContext } from "./GameContext";

export interface GameOptionsProps {
  createBoard: () => void;
}

const GameOptions = (props: GameOptionsProps) => {
  const { rows, cols, setCols, setRows } = useContext(GameContext);
  const { createBoard } = props;

  return (
    <div>
      <p>Grid Size: </p>
      <InputNumber
        addonBefore="Row(s)"
        size="small"
        value={rows}
        defaultValue={rows}
        onChange={setRows}
      />
      <InputNumber
        addonBefore="Column(s)"
        size="small"
        value={cols}
        onChange={setCols}
      />
      <Button onClick={() => createBoard()}> Create Board </Button>
    </div>
  );
};

export default GameOptions;
