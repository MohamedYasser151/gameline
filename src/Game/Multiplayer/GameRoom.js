import { supabase } from "../../lib/supabase";


// =====================================================
// ROOM CODE
// =====================================================

export function generateRoomCode() {

  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


  let code = "";


  for (
    let i = 0;
    i < 5;
    i++
  ) {

    code +=
      characters[
        Math.floor(
          Math.random() *
          characters.length
        )
      ];

  }


  return code;

}


// =====================================================
// PLAYER ID
// =====================================================

export function getPlayerId() {

  let id =
    sessionStorage.getItem(
      "codekids_player_id"
    );


  if (!id) {

    id =
      crypto.randomUUID();


    sessionStorage.setItem(
      "codekids_player_id",
      id
    );

  }


  return id;

}


// =====================================================
// GET LOCAL PLAYER POSITION
// =====================================================

function getLocalPlayerPosition() {

  const scene =
    document.querySelector(
      "a-scene"
    );


  if (!scene) {

    return {
      x: 0,
      y: 0,
      z: 0,
      rotation: 0,
    };

  }


  const player =
    scene.querySelector(
      "#player"
    );


  if (!player) {

    return {
      x: 0,
      y: 0,
      z: 0,
      rotation: 0,
    };

  }


  const position =
    player.object3D.position;


  return {

    x:
      Number(position.x) || 0,

    y:
      Number(position.y) || 0,

    z:
      Number(position.z) || 0,

    rotation:
      Number(
        player.object3D.rotation.y
      ) || 0,

  };

}


// =====================================================
// CONNECT
// =====================================================

export async function connectToRoom(
  roomCode,
  player,
  onPlayersChange
) {

  const code =
    roomCode
      .trim()
      .toUpperCase();


  const channelName =
    `code-kids-room-${code}`;


  console.log(
    "================================="
  );

  console.log(
    "🌐 CONNECTING TO ROOM"
  );

  console.log(
    "ROOM:",
    code
  );

  console.log(
    "CHANNEL:",
    channelName
  );

  console.log(
    "PLAYER:",
    player
  );

  console.log(
    "================================="
  );


  // ===================================================
  // CHANNEL
  // ===================================================

  const channel =
    supabase.channel(
      channelName,
      {

        config: {

          presence: {

            key:
              player.id,

          },

          broadcast: {

            self:
              false,

          },

        },

      }
    );

// =====================================================
// GAME INVITES
// =====================================================

channel.on(
  "broadcast",
  {
    event:
      "game-invite",
  },
  ({
    payload,
  }) => {

    console.log(
      "🎮 GAME INVITE RECEIVED:",
      payload
    );


    if (!payload) {
      return;
    }


    if (
      payload.toPlayerId !==
      player.id
    ) {

      return;

    }


    window.dispatchEvent(
      new CustomEvent(
        "game-invite-received",
        {

          detail:
            payload,

        }
      )
    );

  }
);


// =====================================================
// GAME INVITE RESPONSE
// =====================================================

channel.on(
  "broadcast",
  {
    event:
      "game-invite-response",
  },
  ({
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


    window.dispatchEvent(
      new CustomEvent(
        "game-invite-response",
        {

          detail:
            payload,

        }
      )
    );

  }
);
  // ===================================================
  // PLAYERS
  // ===================================================

  const players =
    new Map();


  players.set(
    player.id,
    {

      id:
        player.id,

      name:
        player.name,

      gender:
        player.gender ||
        "boy",

    }
  );


  // ===================================================
  // NOTIFY
  // ===================================================

  const notifyPlayers =
    () => {

      const list =
        Array.from(
          players.values()
        );


      console.log(
        "👥 PLAYERS:",
        list
      );


      if (
        typeof onPlayersChange ===
        "function"
      ) {

        onPlayersChange(
          list
        );

      }

    };


  // ===================================================
  // PRESENCE SYNC
  // ===================================================

  channel.on(
    "presence",
    {
      event:
        "sync",
    },
    () => {

      console.log(
        "🔄 PRESENCE SYNC"
      );


      const state =
        channel.presenceState();


      Object.keys(
        state
      ).forEach(
        (key) => {

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
            (entry) => {

              if (!entry) {

                return;

              }


              const id =
                entry.playerId ||
                key;


              if (
                id ===
                player.id
              ) {

                return;

              }


              players.set(
                id,
                {

                  id,

                  name:
                    entry.name ||
                    "Player",

                  gender:
                    entry.gender ||
                    "boy",

                }
              );

            }
          );

        }
      );


      notifyPlayers();

    }
  );


  // ===================================================
  // JOIN
  // ===================================================

  channel.on(
    "presence",
    {
      event:
        "join",
    },
    ({
      key,
      newPresences,
    }) => {

      console.log(
        "🟢 PLAYER JOINED:",
        key,
        newPresences
      );


      if (
        Array.isArray(
          newPresences
        )
      ) {

        newPresences.forEach(
          (entry) => {

            if (!entry) {

              return;

            }


            const id =
              entry.playerId ||
              key;


            if (
              id ===
              player.id
            ) {

              return;

            }


            players.set(
              id,
              {

                id,

                name:
                  entry.name ||
                  "Player",

                gender:
                  entry.gender ||
                  "boy",

              }
            );

          }
        );

      }


      notifyPlayers();


      // ===============================================
      // SEND OUR INFORMATION
      // ===============================================

      setTimeout(
        () => {

          announcePlayer(
            channel,
            player
          );

        },
        300
      );

    }
  );


  // ===================================================
  // LEAVE PRESENCE
  // ===================================================

  channel.on(
    "presence",
    {
      event:
        "leave",
    },
    ({
      key,
      leftPresences,
    }) => {

      console.log(
        "🔴 PLAYER LEFT:",
        key,
        leftPresences
      );


      let playerId =
        key;


      if (
        Array.isArray(
          leftPresences
        ) &&
        leftPresences.length
      ) {

        playerId =
          leftPresences[0]
            ?.playerId ||
          key;

      }


      players.delete(
        playerId
      );


      notifyPlayers();


      window.dispatchEvent(
        new CustomEvent(
          "player-left",
          {

            detail: {

              playerId,

            },

          }
        )
      );

    }
  );


  // ===================================================
  // HELLO
  // ===================================================

  channel.on(
    "broadcast",
    {
      event:
        "player-hello",
    },
    async ({
      payload,
    }) => {

      console.log(
        "👋 HELLO RECEIVED:",
        payload
      );


      if (
        !payload?.playerId
      ) {

        return;

      }


      if (
        payload.playerId ===
        player.id
      ) {

        return;

      }


      // ===============================================
      // ADD PLAYER
      // ===============================================

      players.set(
        payload.playerId,
        {

          id:
            payload.playerId,

          name:
            payload.name ||
            "Player",

          gender:
            payload.gender ||
            "boy",

        }
      );


      notifyPlayers();


      // ===============================================
      // SEND OUR CURRENT POSITION
      // ===============================================

      const position =
        getLocalPlayerPosition();


      try {

        await channel.send(
          {

            type:
              "broadcast",

            event:
              "player-state",

            payload: {

              playerId:
                player.id,

              name:
                player.name,

              gender:
                player.gender ||
                "boy",

              x:
                position.x,

              y:
                position.y,

              z:
                position.z,

              rotation:
                position.rotation,

              timestamp:
                Date.now(),

            },

          }
        );


        console.log(
          "📤 STATE RESPONSE:",
          position
        );

      } catch (error) {

        console.error(
          "❌ STATE RESPONSE ERROR:",
          error
        );

      }

    }
  );


  // ===================================================
  // PLAYER STATE
  // ===================================================

  channel.on(
    "broadcast",
    {
      event:
        "player-state",
    },
    ({
      payload,
    }) => {

      // console.log(
      //   "📥 PLAYER STATE:",
      //   payload
      // );


      if (
        !payload?.playerId
      ) {

        return;

      }


      if (
        payload.playerId ===
        player.id
      ) {

        return;

      }


      window.dispatchEvent(
        new CustomEvent(
          "remote-player-state",
          {

            detail: {

              playerId:
                payload.playerId,

              name:
                payload.name ||
                "Player",

              gender:
                payload.gender ||
                "boy",

              x:
                Number(payload.x) ||
                0,

              y:
                Number(payload.y) ||
                0,

              z:
                Number(payload.z) ||
                0,

              rotation:
                Number(
                  payload.rotation
                ) || 0,

              timestamp:
                payload.timestamp ||
                Date.now(),

            },

          }
        )
      );

    }
  );


  // ===================================================
  // PLAYER MOVE
  // ===================================================

  channel.on(
    "broadcast",
    {
      event:
        "player-move",
    },
    ({
      payload,
    }) => {

      if (
        !payload?.playerId
      ) {

        return;

      }


      if (
        payload.playerId ===
        player.id
      ) {

        return;

      }


      console.log(
        "📥 PLAYER MOVE:",
        payload
      );


      window.dispatchEvent(
        new CustomEvent(
          "remote-player-move",
          {

            detail: {

              playerId:
                payload.playerId,

              name:
                payload.name ||
                "Player",

              gender:
                payload.gender ||
                "boy",

              x:
                Number(payload.x) ||
                0,

              y:
                Number(payload.y) ||
                0,

              z:
                Number(payload.z) ||
                0,

              rotation:
                Number(
                  payload.rotation
                ) || 0,

              timestamp:
                payload.timestamp ||
                Date.now(),

            },

          }
        )
      );

    }
  );


  // ===================================================
  // SUBSCRIBE
  // ===================================================

  await new Promise(
    (
      resolve,
      reject
    ) => {

      let finished =
        false;


      channel.subscribe(
        async (
          status,
          error
        ) => {

          console.log(
            "📡 CHANNEL STATUS:",
            status
          );


          // =========================================
          // CONNECTED
          // =========================================

          if (
            status ===
            "SUBSCRIBED"
          ) {

            console.log(
              "✅ CHANNEL CONNECTED"
            );


            try {

              await channel.track(
                {

                  playerId:
                    player.id,

                  name:
                    player.name,

                  gender:
                    player.gender ||
                    "boy",

                  joinedAt:
                    Date.now(),

                }
              );


              console.log(
                "📍 PLAYER TRACKED"
              );


              notifyPlayers();


              setTimeout(
                () => {

                  announcePlayer(
                    channel,
                    player
                  );

                },
                300
              );


              if (!finished) {

                finished = true;

                resolve();

              }

            } catch (err) {

              console.error(
                "❌ TRACK ERROR:",
                err
              );


              if (!finished) {

                finished = true;

                reject(err);

              }

            }


            return;

          }


          // =========================================
          // ERROR
          // =========================================

          if (
            status ===
            "CHANNEL_ERROR"
          ) {

            console.error(
              "❌ CHANNEL ERROR:",
              error
            );


            if (!finished) {

              finished = true;

              reject(
                error ||
                new Error(
                  "Channel error"
                )
              );

            }

          }


          // =========================================
          // TIMEOUT
          // =========================================

          if (
            status ===
            "TIMED_OUT"
          ) {

            console.error(
              "❌ CHANNEL TIMEOUT"
            );


            if (!finished) {

              finished = true;

              reject(
                new Error(
                  "Connection timed out"
                )
              );

            }

          }

        }
      );

    }
  );


  return channel;

}


// =====================================================
// ANNOUNCE PLAYER
// =====================================================

export async function announcePlayer(
  channel,
  player
) {

  if (
    !channel ||
    !player
  ) {

    return;

  }


  const position =
    getLocalPlayerPosition();


  try {

    const result =
      await channel.send(
        {

          type:
            "broadcast",

          event:
            "player-hello",

          payload: {

            playerId:
              player.id,

            name:
              player.name,

            gender:
              player.gender ||
              "boy",

            x:
              position.x,

            y:
              position.y,

            z:
              position.z,

            rotation:
              position.rotation,

            timestamp:
              Date.now(),

          },

        }
      );


    console.log(
      "👋 PLAYER ANNOUNCED:",
      player.name
    );


    console.log(
      "📍 POSITION:",
      position
    );


    return result;

  } catch (error) {

    console.error(
      "❌ ANNOUNCE ERROR:",
      error
    );

  }

}


// =====================================================
// SEND POSITION
// =====================================================

export async function sendPlayerPosition(
  channel,
  player
) {

  if (
    !channel ||
    !player
  ) {

    return;

  }


  const payload = {

    playerId:
      player.id,

    name:
      player.name,

    gender:
      player.gender ||
      "boy",

    x:
      Number(player.x) ||
      0,

    y:
      Number(player.y) ||
      0,

    z:
      Number(player.z) ||
      0,

    rotation:
      Number(player.rotation) ||
      0,

    timestamp:
      Date.now(),

  };


  try {

    await channel.send(
      {

        type:
          "broadcast",

        event:
          "player-move",

        payload,

      }
    );


  } catch (error) {

    console.error(
      "❌ SEND POSITION ERROR:",
      error
    );

  }

}


// =====================================================
// LEAVE ROOM
// =====================================================

export async function leaveRoom(
  channel,
  player
) {

  if (!channel) {

    return;

  }


  try {

    if (player) {

      await channel.send(
        {

          type:
            "broadcast",

          event:
            "player-left",

          payload: {

            playerId:
              player.id,

          },

        }
      );


      try {

        await channel.untrack();

      } catch (error) {

        console.warn(
          "UNTRACK WARNING:",
          error
        );

      }

    }


    await supabase.removeChannel(
      channel
    );


    console.log(
      "🔴 ROOM LEFT"
    );

  } catch (error) {

    console.error(
      "❌ LEAVE ERROR:",
      error
    );

  }

}

// =====================================================
// SEND GAME INVITE
// =====================================================

export async function sendGameInvite(
  channel,
  player,
  targetPlayerId,
  game
) {

  if (!channel || !player || !targetPlayerId) {
    return;
  }

  try {

    await channel.send({

      type: "broadcast",

      event: "game-invite",

      payload: {

        fromPlayerId:
          player.id,

        fromPlayerName:
          player.name || "Player",

        toPlayerId:
          targetPlayerId,

        game,

        gameId:
          crypto.randomUUID(),

        timestamp:
          Date.now(),

      },

    });

    console.log(
      "🎮 GAME INVITE SENT:",
      game
    );

  } catch (error) {

    console.error(
      "❌ GAME INVITE ERROR:",
      error
    );

  }

}


// =====================================================
// GAME INVITE RESPONSE
// =====================================================

export async function sendGameInviteResponse(
  channel,
  player,
  invite,
  accepted
) {

  if (!channel || !player || !invite) {
    return;
  }

  try {

    await channel.send({

      type: "broadcast",

      event: "game-invite-response",

      payload: {

        fromPlayerId:
          player.id,

        fromPlayerName:
          player.name || "Player",

        toPlayerId:
          invite.fromPlayerId,

        game:
          invite.game,

        gameId:
          invite.gameId,

        accepted,

        timestamp:
          Date.now(),

      },

    });

  } catch (error) {

    console.error(
      "❌ GAME INVITE RESPONSE ERROR:",
      error
    );

  }

}


// =====================================================
// GAME MOVE
// =====================================================

export async function sendGameMove(
  channel,
  player,
  gameId,
  game,
  move
) {

  if (!channel || !player || !gameId) {
    return;
  }

  try {

    await channel.send({

      type: "broadcast",

      event: "game-move",

      payload: {

        playerId:
          player.id,

        gameId,

        game,

        move,

        timestamp:
          Date.now(),

      },

    });

  } catch (error) {

    console.error(
      "❌ GAME MOVE ERROR:",
      error
    );

  }

}