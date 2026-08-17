import React, {
  useEffect,
  useState,
} from "react";

import {
  sendGameInvite,
  sendGameInviteResponse,
} from "./GameRoom";


// =====================================================
// GAME INVITE
// =====================================================

const GameInvite = ({
  channel,
  player,
  players,
  onOpenGame,
}) => {

  const [invite, setInvite] =
    useState(null);


  // ===================================================
  // LISTEN
  // ===================================================

  useEffect(() => {

    if (!channel || !player?.id) {
      return;
    }


    // ================================================
    // NEW INVITE
    // ================================================

    const handleInvite = ({
      payload,
    }) => {

      if (!payload) {
        return;
      }


      if (
        payload.toPlayerId !==
        player.id
      ) {
        return;
      }


      console.log(
        "🎮 GAME INVITE RECEIVED:",
        payload
      );


      setInvite(
        payload
      );

    };


    // ================================================
    // RESPONSE
    // ================================================

    const handleResponse = ({
      payload,
    }) => {

      if (!payload) {
        return;
      }


      if (
        payload.toPlayerId !==
        player.id
      ) {
        return;
      }


      console.log(
        "🎮 GAME INVITE RESPONSE:",
        payload
      );


      if (
        payload.accepted
      ) {

        onOpenGame({

          game:
            payload.game,

          gameId:
            payload.gameId,

          opponentId:
            payload.fromPlayerId,

          opponentName:
            payload.fromPlayerName,

        });

      }

    };


    channel.on(
      "broadcast",
      {
        event: "game-invite",
      },
      handleInvite
    );


    channel.on(
      "broadcast",
      {
        event: "game-invite-response",
      },
      handleResponse
    );


    return () => {

      // Supabase channel is already
      // managed by GameRoom.

    };

  }, [
    channel,
    player?.id,
    onOpenGame,
  ]);


  // ===================================================
  // SEND INVITE
  // ===================================================

  const invitePlayer = async (
    targetPlayer
  ) => {

    await sendGameInvite(
      channel,
      player,
      targetPlayer.id,
      "xo"
    );

    alert(
      `🎮 تم إرسال دعوة XO إلى ${targetPlayer.name}`
    );

  };


  // ===================================================
  // ACCEPT
  // ===================================================

  const acceptInvite = async () => {

    if (!invite) {
      return;
    }


    await sendGameInviteResponse(
      channel,
      player,
      invite,
      true
    );


    onOpenGame({

      game:
        invite.game,

      gameId:
        invite.gameId,

      opponentId:
        invite.fromPlayerId,

      opponentName:
        invite.fromPlayerName,

    });


    setInvite(null);

  };


  // ===================================================
  // REJECT
  // ===================================================

  const rejectInvite = async () => {

    if (!invite) {
      return;
    }


    await sendGameInviteResponse(
      channel,
      player,
      invite,
      false
    );


    setInvite(null);

  };


  return (

    <>

      {/* ================================================= */}
      {/* GAME LIST */}
      {/* ================================================= */}

      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 9999,
          background: "#ffffff",
          padding: "16px",
          borderRadius: "16px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,.25)",
          minWidth: "240px",
        }}
      >

        <h3>
          🎮 ألعاب الروم
        </h3>


        <div
          style={{
            padding: "12px",
            borderRadius: "12px",
            background: "#f5f5f5",
          }}
        >

          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            ❌ ⭕ XO
          </div>


          <div
            style={{
              fontSize: "13px",
              marginTop: "5px",
              marginBottom: "10px",
            }}
          >
            لعبة XO مع صديقك
          </div>


          {players
            ?.filter(
              (p) =>
                p.id !== player.id
            )
            .map(
              (targetPlayer) => (

                <button
                  key={
                    targetPlayer.id
                  }
                  onClick={() =>
                    invitePlayer(
                      targetPlayer
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "none",
                    borderRadius: "10px",
                    background:
                      "#6C63FF",
                    color: "white",
                    cursor: "pointer",
                    marginTop: "5px",
                  }}
                >

                  🎮 إرسال لـ{" "}
                  {targetPlayer.name}

                </button>

              )
            )}

        </div>

      </div>


      {/* ================================================= */}
      {/* INVITE POPUP */}
      {/* ================================================= */}

      {invite && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.55)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "20px",
              width: "320px",
              textAlign: "center",
            }}
          >

            <div
              style={{
                fontSize: "50px",
              }}
            >
              ❌⭕
            </div>


            <h2>
              دعوة للعب!
            </h2>


            <p>
              {invite.fromPlayerName}
              {" "}
              يدعوك للعب XO
            </p>


            <button
              onClick={
                acceptInvite
              }
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "8px",
                border: "none",
                borderRadius: "10px",
                background: "#4CAF50",
                color: "white",
                fontSize: "16px",
              }}
            >
              🎮 قبول واللعب
            </button>


            <button
              onClick={
                rejectInvite
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "10px",
                background: "#eee",
                color: "#333",
                fontSize: "16px",
              }}
            >
              رفض
            </button>

          </div>

        </div>

      )}

    </>

  );

};


export default GameInvite;