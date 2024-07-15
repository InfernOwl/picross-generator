import React from "react";
import { Button, InputNumber } from "antd";

interface GameOptionsProps {
  rows: number;
  cols: number;
  setRows: (val: number) => void;
  setCols: (val: number) => void;
  createBoard: (rows: number, cols: number) => void;
}
const GameOptions = (props: GameOptionsProps) => {
  const { rows, cols, setRows, setCols, createBoard } = props;
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
      <Button onClick={() => createBoard(rows, cols)}> Create Board </Button>
    </div>
  );
};

export default GameOptions;
