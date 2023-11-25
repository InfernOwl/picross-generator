import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import GameOptions from "./GameOptions";
import GameBoard from "./GameBoard";
import { GameContextProvider } from "./GameContext";

const Game = () => {
  return (
    <GameContextProvider>
      <Container className="gameWrapper">
        <GameOptions createBoard={createBoard} />
        <GameBoard />
      </Container>
    </GameContextProvider>
  );
};

export default Game;
