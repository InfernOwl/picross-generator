import React, { useContext } from "react";
import { Button, InputNumber } from "antd";
import { GameContext } from "./GameContext";

const GameOptions = () => {
  const { rows, cols, setCols, setRows, createBoard } = useContext(GameContext);

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
        defaultValue={cols}
        onChange={setCols}
      />
      <Button onClick={() => createBoard()}> Create Board </Button>
    </div>
  );
};

export default GameOptions;
