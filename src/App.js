import React, {
  useState,
  useCallback,
  useEffect,
} from "react";

import Lobby from "./Game/Multiplayer/Lobby";
import Game from "./Game/Game";
import MultiplayerController from "./Game/Multiplayer/MultiplayerController";

import "./App.css";


function App() {

  // =====================================================
  // GAME DATA
  // =====================================================

  const [gameData, setGameData] =
    useState(null);


  // =====================================================
  // SPLASH SCREEN
  // =====================================================

  const [showSplash, setShowSplash] =
    useState(true);


  // =====================================================
  // STARTUP ANIMATION
  // =====================================================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setShowSplash(false);

      }, 2600);


    return () => {
      clearTimeout(timer);
    };

  }, []);


  // =====================================================
  // GAME START
  // =====================================================

  const handleGameStart =
    useCallback((data) => {

      console.log(
        "🎮 GAME START:",
        data
      );


      setGameData(
        oldData => {

          if (oldData) {
            return oldData;
          }

          return data;

        }
      );

    }, []);


  // =====================================================
  // SPLASH
  // =====================================================

  if (showSplash) {

    return (

      <div className="app-splash">

        {/* BACKGROUND DECORATION */}

        <div className="splash-cloud cloud-1">
          ☁️
        </div>

        <div className="splash-cloud cloud-2">
          ☁️
        </div>

        <div className="splash-star star-1">
          ✦
        </div>

        <div className="splash-star star-2">
          ✦
        </div>

        <div className="splash-star star-3">
          ✨
        </div>


        {/* MAIN */}

        <div className="splash-content">

          <div className="splash-island">

            <div className="splash-water">
              🌊
            </div>

            <div className="splash-character">
              🧑‍💻
            </div>

            <div className="splash-palm">
              🌴
            </div>

          </div>


          <div className="splash-logo">

            <span>
              Code
            </span>

            <strong>
              Kids
            </strong>

          </div>


          <div className="splash-title">

            🏝️

            {" "}

            Code Kids Island

          </div>


          <p className="splash-subtitle">

            العب • تعلم • برمج • استمتع

          </p>


          {/* LOADING */}

          <div className="splash-loading">

            <div className="splash-loading-bar">

              <div className="splash-loading-progress" />

            </div>

            <span>
              جاري تجهيز الجزيرة...
            </span>

          </div>

        </div>


        <div className="splash-bottom">

          ✨ استعد للمغامرة ✨

        </div>

      </div>

    );

  }


  // =====================================================
  // LOBBY
  // =====================================================

  if (!gameData) {

    return (

      <Lobby
        onGameStart={
          handleGameStart
        }
      />

    );

  }


  // =====================================================
  // GAME
  // =====================================================

  return (

    <>

      <Game
        player={
          gameData.player
        }

        channel={
          gameData.channel
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