import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  connectToRoom,
  generateRoomCode,
  getPlayerId,
} from "./GameRoom";

import "./Lobby.css";

const Lobby = ({
  onGameStart,
}) => {

  // =====================================================
  // STATE
  // =====================================================

  const [name, setName] =
    useState("");

  const [gender, setGender] =
    useState("boy");

  const [roomCode, setRoomCode] =
    useState("");

  const [mode, setMode] =
    useState(null);

  const [channel, setChannel] =
    useState(null);

  const [player, setPlayer] =
    useState(null);

  const [players, setPlayers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [createdRoom, setCreatedRoom] =
    useState(false);

  const [gameStarted, setGameStarted] =
    useState(false);

  // =====================================================
  // REFS
  // =====================================================

  const gameStartedRef =
    useRef(false);

  const channelRef =
    useRef(null);

  const playerRef =
    useRef(null);

  // =====================================================
  // PLAYERS UPDATE
  // =====================================================

  const handlePlayersUpdate =
    (currentPlayers) => {

      console.log(
        "👥 PRESENCE UPDATE:",
        currentPlayers
      );

      setPlayers(
        currentPlayers
      );
    };

  // =====================================================
  // CREATE ROOM
  // =====================================================

  const createRoom =
    async () => {

      if (
        !name.trim()
      ) {

        setError(
          "اكتب اسمك أولاً"
        );

        return;
      }

      setLoading(
        true
      );

      setError("");

      const code =
        generateRoomCode();

const newPlayer = {

  id:
    getPlayerId(),

  name:
    name.trim(),

  gender:
    gender,

};

      console.log(
        "🟢 CREATING ROOM:",
        code
      );

      console.log(
        "🧑 CREATOR:",
        newPlayer
      );

      try {

        const newChannel =
          await connectToRoom(
            code,
            newPlayer,
            handlePlayersUpdate
          );

        channelRef.current =
          newChannel;

        playerRef.current =
          newPlayer;

        setPlayer(
          newPlayer
        );

        setChannel(
          newChannel
        );

        window.__CODEKIDS_PLAYER_NUMBER =
          1;

        setRoomCode(
          code
        );

        setCreatedRoom(
          true
        );

      } catch (
        err
      ) {

        console.error(
          "❌ CREATE ROOM ERROR:",
          err
        );

        setError(
          "حدث خطأ أثناء إنشاء الغرفة"
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  // =====================================================
  // JOIN ROOM
  // =====================================================

  const joinRoom =
    async () => {

      if (
        !name.trim()
      ) {

        setError(
          "اكتب اسمك أولاً"
        );

        return;
      }

      const code =
        roomCode
          .trim()
          .toUpperCase();

      if (
        code.length !== 5
      ) {

        setError(
          "كود الغرفة يجب أن يكون 5 حروف"
        );

        return;
      }

      setLoading(
        true
      );

      setError("");

const newPlayer = {

  id:
    getPlayerId(),

  name:
    name.trim(),

  gender:
    gender,

};

      console.log(
        "🔵 JOINING ROOM:",
        code
      );

      console.log(
        "🧑 JOIN PLAYER:",
        newPlayer
      );

      try {

        const newChannel =
          await connectToRoom(
            code,
            newPlayer,
            handlePlayersUpdate
          );

        channelRef.current =
          newChannel;

        playerRef.current =
          newPlayer;

        setPlayer(
          newPlayer
        );

        setChannel(
          newChannel
        );

        window.__CODEKIDS_PLAYER_NUMBER =
          2;

        setRoomCode(
          code
        );

      } catch (
        err
      ) {

        console.error(
          "❌ JOIN ROOM ERROR:",
          err
        );

        setError(
          "لم نستطع الدخول إلى الغرفة"
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  // =====================================================
  // WAIT FOR TWO PLAYERS
  // =====================================================

  useEffect(
    () => {

      if (!channel) {
        return;
      }

      if (!player) {
        return;
      }

      if (gameStarted) {
        return;
      }

      if (
        players.length >= 2
      ) {

        console.log(
          "🎮 TWO PLAYERS FOUND"
        );

        if (
          !gameStartedRef.current
        ) {

          gameStartedRef.current =
            true;

          setGameStarted(
            true
          );
        }
      }

    },
    [
      players,
      channel,
      player,
      gameStarted,
    ]
  );

  // =====================================================
  // START GAME
  // =====================================================

  useEffect(
    () => {

      if (!gameStarted) {
        return;
      }

      if (!channel) {
        return;
      }

      if (!player) {
        return;
      }

      console.log(
        "🚀 STARTING GAME"
      );

      onGameStart({
        channel,
        roomCode,
        player,
      });

    },
    [
      gameStarted,
      channel,
      player,
      roomCode,
      onGameStart,
    ]
  );

  // =====================================================
  // COPY CODE
  // =====================================================

  const copyRoomCode =
    async () => {

      try {

        await navigator
          .clipboard
          .writeText(
            roomCode
          );

        alert(
          "تم نسخ الكود ✅"
        );

      } catch (
        error
      ) {

        console.error(
          "COPY ERROR:",
          error
        );
      }
    };

  // =====================================================
  // WAITING ROOM
  // =====================================================

  if (createdRoom) {

    return (
      <div className="lobby">

        <div className="lobby-card">

          <div className="lobby-logo">
            🏝️
          </div>

          <h1>
            الغرفة جاهزة!
          </h1>

          <p className="lobby-subtitle">
            أرسل الكود لصديقك
          </p>

          {/* ROOM CODE */}

          <div className="room-code">

            <span>
              كود الغرفة
            </span>

            <strong>
              {roomCode}
            </strong>

            <button
              className="copy-button"
              onClick={
                copyRoomCode
              }
            >
              📋 نسخ الكود
            </button>

          </div>

          {/* WAITING */}

          <div className="waiting-box">

            {players.length <
            2 ? (

              <>
                <div className="waiting-icon">
                  ⏳
                </div>

                <div>
                  في انتظار صديقك...
                </div>

                <small>
                  أرسل له كود الغرفة
                </small>
              </>

            ) : (

              <>
                <div className="waiting-icon">
                  🎮
                </div>

                <div>
                  صديقك دخل!
                </div>

                <small>
                  جاري الدخول إلى اللعبة...
                </small>
              </>
            )}

          </div>

          {/* PLAYERS */}

          <div className="players-status">

            <span>
              👥 اللاعبين
            </span>

            <strong>
              {players.length}/2
            </strong>

          </div>

          {/* PLAYER LIST */}

          <div
            style={{
              marginTop:
                "12px",

              padding:
                "10px",

              borderRadius:
                "12px",

              background:
                "rgba(255,255,255,0.45)",

              fontSize:
                "13px",
            }}
          >

            {players.length ===
              0 && (
              <div>
                لا يوجد لاعبين مكتشفين
              </div>
            )}

            {players.map(
              (
                p,
                index
              ) => (

                <div
                  key={
                    p.id
                  }
                  style={{
                    margin:
                      "4px 0",

                    fontWeight:
                      "bold",
                  }}
                >

                  {index + 1}.
                  {" "}

                  {p.gender ===
                  "girl"
                    ? "👧"
                    : "👦"}

                  {" "}

                  {p.name}

                  {p.id ===
                    player?.id &&
                    " ⭐"}

                </div>
              )
            )}

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN LOBBY
  // =====================================================

  return (
    <div className="lobby">

      <div className="lobby-card">

        <div className="lobby-logo">
          🏝️
        </div>

        <h1>
          Code Kids Island
        </h1>

        <p className="lobby-subtitle">
          العب مع صديقك
        </p>

        {/* NAME */}

        <input
          type="text"
          placeholder="اكتب اسمك"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          maxLength={15}
        />

        {/* GENDER */}

<div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    justifyContent: "center",
  }}
>

  <button
    type="button"
    onClick={() =>
      setGender("boy")
    }
    style={{
      padding: "10px 20px",
      borderRadius: "12px",
      border:
        gender === "boy"
          ? "3px solid #2979ff"
          : "1px solid #ccc",
      background:
        gender === "boy"
          ? "#e3f2fd"
          : "#fff",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    👦 ولد
  </button>

  <button
    type="button"
    onClick={() =>
      setGender("girl")
    }
    style={{
      padding: "10px 20px",
      borderRadius: "12px",
      border:
        gender === "girl"
          ? "3px solid #e91e63"
          : "1px solid #ccc",
      background:
        gender === "girl"
          ? "#fce4ec"
          : "#fff",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    👧 بنت
  </button>

</div>

        {/* MODE */}

        {!mode && (

          <div className="lobby-buttons">

            <button
              className="create-button"
              onClick={() =>
                setMode(
                  "create"
                )
              }
            >
              🎮 إنشاء غرفة
            </button>

            <button
              className="join-button"
              onClick={() =>
                setMode(
                  "join"
                )
              }
            >
              👥 دخول غرفة
            </button>

          </div>
        )}

        {/* CREATE */}

        {mode ===
          "create" && (

          <div className="room-section">

            <button
              className="main-button"
              onClick={
                createRoom
              }
              disabled={
                loading
              }
            >

              {loading
                ? "جاري إنشاء الغرفة..."
                : "🚀 إنشاء الغرفة"}

            </button>

            <button
              className="back-button"
              onClick={() =>
                setMode(
                  null
                )
              }
              disabled={
                loading
              }
            >
              رجوع
            </button>

          </div>
        )}

        {/* JOIN */}

        {mode ===
          "join" && (

          <div className="room-section">

            <input
              type="text"
              placeholder="مثال: LNG8T"
              value={
                roomCode
              }
              onChange={(e) =>
                setRoomCode(
                  e.target.value
                    .toUpperCase()
                )
              }
              maxLength={5}
            />

            <button
              className="main-button"
              onClick={
                joinRoom
              }
              disabled={
                loading
              }
            >

              {loading
                ? "جاري الدخول..."
                : "🎮 دخول الغرفة"}

            </button>

            <button
              className="back-button"
              onClick={() =>
                setMode(
                  null
                )
              }
              disabled={
                loading
              }
            >
              رجوع
            </button>

          </div>
        )}

        {/* ERROR */}

        {error && (

          <div className="error-message">
            {error}
          </div>

        )}

      </div>

    </div>
  );
};

export default Lobby;