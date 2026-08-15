import React, {
  useState,
  useCallback,
} from "react";

import Lobby from "./Game/Multiplayer/Lobby";
import Game from "./Game/Game";
import MultiplayerController from "./Game/Multiplayer/MultiplayerController";


function App() {

  const [gameData, setGameData] =
    useState(null);


  const handleGameStart =
    useCallback((data) => {

      console.log(
        "🎮 GAME START:",
        data
      );


      setGameData(
        (oldData) => {

          // Prevent duplicate start

          if (oldData) {
            return oldData;
          }

          return data;
        }
      );

    }, []);


  if (!gameData) {

    return (
      <Lobby
        onGameStart={
          handleGameStart
        }
      />
    );
  }


  return (
    <>
    <Game
  player={
    gameData.player
  }
/>

      <MultiplayerController
        channel={
          gameData.channel
        }
        player={
          gameData.player
        }
      />
    </>
  );
}


export default App;