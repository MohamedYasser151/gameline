// =====================================================
// GameInvite.js
// =====================================================

import { supabase } from "../lib/supabase";


// =====================================================
// SEND GAME INVITE
// =====================================================

export async function sendGameInvite(
  channel,
  fromPlayer,
  toPlayer,
  game
) {

  if (!channel) {
    return;
  }

  if (!fromPlayer) {
    return;
  }

  if (!toPlayer) {
    return;
  }


  const payload = {

    inviteId:
      crypto.randomUUID(),

    gameId:
      game.id,

    gameName:
      game.name,

    fromPlayerId:
      fromPlayer.id,

    fromPlayerName:
      fromPlayer.name ||
      "Player",

    toPlayerId:
      toPlayer.id,

    timestamp:
      Date.now(),

  };


  try {

    await channel.send({

      type:
        "broadcast",

      event:
        "game-invite",

      payload,

    });


    console.log(
      "🎮 GAME INVITE SENT:",
      payload
    );


  } catch (error) {

    console.error(
      "❌ GAME INVITE ERROR:",
      error
    );

  }

}


// =====================================================
// SEND INVITE RESPONSE
// =====================================================

export async function sendGameInviteResponse(
  channel,
  invite,
  player,
  accepted
) {

  if (!channel) {
    return;
  }

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

        inviteId:
          invite.inviteId,

        gameId:
          invite.gameId,

        fromPlayerId:
          player.id,

        toPlayerId:
          invite.fromPlayerId,

        accepted,

        timestamp:
          Date.now(),

      },

    });


    console.log(
      "🎮 GAME INVITE RESPONSE:",
      accepted
    );


  } catch (error) {

    console.error(
      "❌ GAME RESPONSE ERROR:",
      error
    );

  }

}