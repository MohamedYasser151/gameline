import { useEffect } from "react";

import {
  sendPlayerPosition,
  announcePlayer,
  leaveRoom,
} from "./GameRoom";

import {
  updateRemotePlayer,
  updateRemotePlayers,
  removeRemotePlayer,
  removeAllRemotePlayers,
} from "./RemotePlayerManager";


const MultiplayerController = ({
  channel,
  player,
}) => {

  useEffect(() => {

    if (
      !channel ||
      !player?.id
    ) {

      console.log(
        "⚠️ MultiplayerController waiting..."
      );

      return;

    }


    console.log(
      "===================================="
    );

    console.log(
      "🎮 MULTIPLAYER STARTED"
    );

    console.log(
      "PLAYER ID:",
      player.id
    );

    console.log(
      "PLAYER NAME:",
      player.name
    );

    console.log(
      "PLAYER GENDER:",
      player.gender
    );

    console.log(
      "===================================="
    );


    // =====================================================
    // LOCAL PLAYER MOVE
    // =====================================================

    const handleLocalMove =
      async (event) => {

        const data =
          event.detail;


        if (!data) {
          return;
        }


        await sendPlayerPosition(
          channel,
          {

            id:
              player.id,

            name:
              player.name,

            gender:
              player.gender,

            x:
              Number(data.x) || 0,

            y:
              Number(data.y) || 0,

            z:
              Number(data.z) || 0,

            rotation:
              Number(data.rotation) || 0,

          }
        );

      };


    // =====================================================
    // REMOTE STATE
    // =====================================================

    const handleRemoteState =
      (event) => {

        const data =
          event.detail;


        if (!data?.playerId) {
          return;
        }


        if (
          data.playerId ===
          player.id
        ) {

          return;

        }


        updateRemotePlayer(
          data
        );

      };


    // =====================================================
    // REMOTE MOVE
    // =====================================================

    const handleRemoteMove =
      (event) => {

        const data =
          event.detail;


        if (!data?.playerId) {
          return;
        }


        if (
          data.playerId ===
          player.id
        ) {

          return;

        }


        updateRemotePlayer(
          data
        );

      };


    // =====================================================
    // PLAYER LEFT
    // =====================================================

    const handlePlayerLeft =
      (event) => {

        const data =
          event.detail;


        if (!data?.playerId) {
          return;
        }


        removeRemotePlayer(
          data.playerId
        );

      };


    // =====================================================
    // EVENTS
    // =====================================================

    window.addEventListener(
      "localplayerupdate",
      handleLocalMove
    );


    window.addEventListener(
      "remote-player-state",
      handleRemoteState
    );


    window.addEventListener(
      "remote-player-move",
      handleRemoteMove
    );


    window.addEventListener(
      "player-left",
      handlePlayerLeft
    );


    // =====================================================
    // START
    // =====================================================

    let cancelled = false;


    const startMultiplayer =
      async () => {

        try {

          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                1000
              )
          );


          if (cancelled) {
            return;
          }


          // ===============================================
          // ANNOUNCE PLAYER
          // ===============================================

          await announcePlayer(
            channel,
            {

              id:
                player.id,

              name:
                player.name,

              gender:
                player.gender,

            }
          );


          // ===============================================
          // GET LOCAL PLAYER
          // ===============================================

          const scene =
            document.querySelector(
              "a-scene"
            );


          const localPlayer =
            scene?.querySelector(
              "#player"
            );


          if (!localPlayer) {

            console.warn(
              "⚠️ LOCAL PLAYER NOT FOUND"
            );

            return;

          }


          // ===============================================
          // CURRENT POSITION
          // ===============================================

          const position =
            localPlayer.object3D.position;


          const rotation =
            localPlayer.object3D.rotation.y;


          // ===============================================
          // SEND INITIAL POSITION
          // ===============================================

          await sendPlayerPosition(
            channel,
            {

              id:
                player.id,

              name:
                player.name,

              gender:
                player.gender,

              x:
                position.x,

              y:
                position.y,

              z:
                position.z,

              rotation,

            }
          );

        } catch (error) {

          console.error(
            "❌ MULTIPLAYER START ERROR:",
            error
          );

        }

      };


    startMultiplayer();


    // =====================================================
    // REMOTE UPDATE LOOP
    // =====================================================

    let animationFrame;


    const animate =
      () => {

        updateRemotePlayers();


        animationFrame =
          requestAnimationFrame(
            animate
          );

      };


    animate();


    // =====================================================
    // CLEANUP
    // =====================================================

    return () => {

      cancelled = true;


      window.removeEventListener(
        "localplayerupdate",
        handleLocalMove
      );


      window.removeEventListener(
        "remote-player-state",
        handleRemoteState
      );


      window.removeEventListener(
        "remote-player-move",
        handleRemoteMove
      );


      window.removeEventListener(
        "player-left",
        handlePlayerLeft
      );


      cancelAnimationFrame(
        animationFrame
      );


      removeAllRemotePlayers();

    };

  }, [
    channel,
    player?.id,
    player?.name,
    player?.gender,
  ]);


  return null;

};


export default MultiplayerController;