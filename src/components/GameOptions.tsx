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
        onChange={(e) => setRows(e || 0)}
      />
      <InputNumber
        addonBefore="Column(s)"
        size="small"
        value={cols}
        defaultValue={cols}
        onChange={(e) => setCols(e || 0)}
      />
      <Button onClick={() => createBoard()}> Create Board </Button>
    </div>
  );
};

export default GameOptions;
