import React from "react";
import Container from "react-bootstrap/Container";
import GameOptions from "./GameOptions";
import GameBoard from "./GameBoard";
import { GameContextProvider } from "./GameContext";

const Game = () => {
  return (
    <GameContextProvider>
      <Container className="gameWrapper">
        <GameOptions />
        <GameBoard />
      </Container>
    </GameContextProvider>
  );
};

export default Game;
