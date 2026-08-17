import React, {
  useEffect,
  useState,
} from "react";

import "./css/GameMenu.css";

import TicTacToe from "./TicTacToe";


const GameMenu = ({
  channel,
  player,
}) => {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [game, setGame] =
    useState(null);

  const [invite, setInvite] =
    useState(null);


  // =====================================================
  // LISTEN
  // =====================================================

  useEffect(() => {

    if (!channel) {
      return;
    }


    // ===================================================
    // GAME INVITE
    // ===================================================

    const inviteHandler =
      ({ payload }) => {

        console.log(
          "🎮 INVITE RECEIVED:",
          payload
        );


        if (!payload) {
          return;
        }


        if (
          payload.playerId ===
          player?.id
        ) {

          return;

        }


        setInvite(
          payload
        );

      };


    // ===================================================
    // INVITE RESPONSE
    // ===================================================

    const responseHandler =
      ({ payload }) => {

        console.log(
          "🎮 INVITE RESPONSE:",
          payload
        );


        if (!payload) {
          return;
        }


        // الرد موجه لنا
        if (
          payload.toPlayerId !==
          player?.id
        ) {

          return;

        }


        if (
          payload.accepted
        ) {

          // فتح اللعبة عند صاحب الدعوة
          setGame(
            payload.game
          );

          setMenuOpen(
            false
          );

        }

      };


    channel.on(
      "broadcast",
      {
        event:
          "game-invite",
      },
      inviteHandler
    );


    channel.on(
      "broadcast",
      {
        event:
          "game-invite-response",
      },
      responseHandler
    );


  }, [
    channel,
    player?.id,
  ]);


  // =====================================================
  // SEND INVITE
  // =====================================================

  const sendInvite =
    async (gameName) => {

      if (!channel) {

        return;

      }


      // نبحث عن لاعب آخر
      // من Presence

      const state =
        channel.presenceState();


      let friendId =
        null;


      Object.keys(
        state
      ).forEach(
        key => {

          const entries =
            state[key];


          if (
            !Array.isArray(
              entries
            )
          ) {

            return;

          }


          entries.forEach(
            entry => {

              const id =
                entry?.playerId ||
                key;


              if (
                id &&
                id !==
                player?.id
              ) {

                friendId =
                  id;

              }

            }
          );

        }
      );


      if (!friendId) {

        alert(
          "⚠️ لا يوجد لاعب آخر داخل الغرفة"
        );

        return;

      }


      try {

        await channel.send({

          type:
            "broadcast",

          event:
            "game-invite",

          payload: {

            playerId:
              player.id,

            playerName:
              player.name,

            game:
              gameName,

            timestamp:
              Date.now(),

          },

        });


        alert(
          "🎮 تم إرسال الدعوة لصديقك"
        );


      } catch (error) {

        console.error(
          "❌ SEND INVITE ERROR:",
          error
        );

      }

    };


  // =====================================================
  // ACCEPT
  // =====================================================

  const acceptInvite =
    async () => {

      if (!invite) {
        return;
      }


      try {

        await channel.send({

          type:
            "broadcast",

          event:
            "game-invite-response",

          payload: {

            playerId:
              player.id,

            playerName:
              player.name,

            toPlayerId:
              invite.playerId,

            game:
              invite.game,

            accepted:
              true,

            timestamp:
              Date.now(),

          },

        });


        // فتح اللعبة عند الطرف الذي قبل
        setGame(
          invite.game
        );

        setInvite(
          null
        );


      } catch (error) {

        console.error(
          "❌ ACCEPT ERROR:",
          error
        );

      }

    };


  // =====================================================
  // REJECT
  // =====================================================

  const rejectInvite =
    async () => {

      if (!invite) {
        return;
      }


      try {

        await channel.send({

          type:
            "broadcast",

          event:
            "game-invite-response",

          payload: {

            playerId:
              player.id,

            playerName:
              player.name,

            toPlayerId:
              invite.playerId,

            game:
              invite.game,

            accepted:
              false,

          },

        });

      } catch (error) {

        console.error(
          "❌ REJECT ERROR:",
          error
        );

      }


      setInvite(
        null
      );

    };


  // =====================================================
  // GAME
  // =====================================================

  if (game === "xo") {

    return (

      <TicTacToe
        channel={
          channel
        }

        player={
          player
        }

        onClose={() =>
          setGame(
            null
          )
        }
      />

    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (
    <>

      {/* ================================================= */}
      {/* GAME BUTTON */}
      {/* ================================================= */}

      <button
        className="games-floating-button"
        onClick={() =>
          setMenuOpen(
            !menuOpen
          )
        }
      >
        🎮
      </button>


      {/* ================================================= */}
      {/* MENU */}
      {/* ================================================= */}

      {menuOpen && (

        <div className="games-popup">

          <div className="games-popup-title">
            🎮 الألعاب
          </div>


          {/* XO */}

          <button
            className="game-item"
            onClick={() =>
              sendInvite("xo")
            }
          >

            <span className="game-item-icon">
              ❌⭕
            </span>

            <span className="game-item-info">

              <strong>
                XO
              </strong>

              <small>
                العب مع صديقك
              </small>

            </span>

            <span className="game-send">
              إرسال
            </span>

          </button>


          {/* المستقبل */}

          <div className="game-item disabled">

            <span className="game-item-icon">
              🧩
            </span>

            <span className="game-item-info">

              <strong>
                Puzzle
              </strong>

              <small>
                قريباً
              </small>

            </span>

          </div>


          <div className="game-item disabled">

            <span className="game-item-icon">
              🏎️
            </span>

            <span className="game-item-info">

              <strong>
                Racing
              </strong>

              <small>
                قريباً
              </small>

            </span>

          </div>

        </div>

      )}


      {/* ================================================= */}
      {/* INVITE */}
      {/* ================================================= */}

      {invite && (

        <div className="invite-overlay">

          <div className="invite-box">

            <div className="invite-icon">
              🎮
            </div>


            <h2>
              دعوة للعب
            </h2>


            <p>

              <strong>
                {invite.playerName}
              </strong>

              {" "}
              يريد اللعب معك

            </p>


            <div className="invite-game">
              ❌⭕ XO
            </div>


            <div className="invite-buttons">

              <button
                className="accept-button"
                onClick={
                  acceptInvite
                }
              >
                ✅ قبول
              </button>


              <button
                className="reject-button"
                onClick={
                  rejectInvite
                }
              >
                ❌ رفض
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );

};


export default GameMenu;