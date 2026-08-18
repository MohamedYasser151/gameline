import React, {
  useEffect,
  useState,
} from "react";

import "./css/TicTacToe.css";


// =====================================================
// EMPTY BOARD
// =====================================================

const EMPTY_BOARD =
  Array(9).fill(null);


// =====================================================
// TIC TAC TOE
// =====================================================

const TicTacToe = ({
  channel,
  player,
  onClose,
}) => {

  // ===================================================
  // BOARD
  // ===================================================

  const [board, setBoard] =
    useState(EMPTY_BOARD);


  // ===================================================
  // MY SYMBOL
  // ===================================================

  const [mySymbol, setMySymbol] =
    useState(null);


  // ===================================================
  // GAME STARTED
  // ===================================================

  const [gameStarted, setGameStarted] =
    useState(false);


  // ===================================================
  // TURN
  // ===================================================

  const [turn, setTurn] =
    useState("X");


  // ===================================================
  // WINNER
  // ===================================================

  const [winner, setWinner] =
    useState(null);


  // ===================================================
  // PLAYERS READY
  // ===================================================

  const [playersReady, setPlayersReady] =
    useState(false);


  // ===================================================
  // SCORE
  // ===================================================

  const [score, setScore] =
    useState({
      X: 0,
      O: 0,
    });


  // ===================================================
  // GAME NUMBER
  // ===================================================

  const [round, setRound] =
    useState(1);


  // ===================================================
  // LISTEN XO EVENTS
  // ===================================================

  useEffect(() => {

    if (!channel) {
      return;
    }

    if (!player?.id) {
      return;
    }


    // =================================================
    // GAME START
    // =================================================

    const startHandler =
      ({ payload }) => {

        if (!payload) {
          return;
        }


        console.log(
          "🎮 XO START:",
          payload
        );


        const myId =
          String(player.id);


        const playerX =
          String(
            payload.playerX || ""
          );


        const playerO =
          String(
            payload.playerO || ""
          );


        // =============================================
        // DETERMINE SYMBOL
        // =============================================

        if (
          playerX === myId
        ) {

          setMySymbol("X");

        } else if (
          playerO === myId
        ) {

          setMySymbol("O");

        } else {

          return;

        }


        // =============================================
        // RESET ROUND
        // =============================================

        setBoard(
          Array(9).fill(null)
        );

        setTurn("X");

        setWinner(null);

        setGameStarted(true);

        setPlayersReady(true);


        // =============================================
        // SCORE
        // =============================================

        setScore(
          payload.score || {
            X: 0,
            O: 0,
          }
        );


        // =============================================
        // ROUND
        // =============================================

        setRound(
          payload.round || 1
        );

      };


    // =================================================
    // MOVE
    // =================================================

    const moveHandler =
      ({ payload }) => {

        if (!payload) {
          return;
        }


        console.log(
          "⭕ XO MOVE:",
          payload
        );


        setBoard(
          payload.board || EMPTY_BOARD
        );


        setTurn(
          payload.turn || "X"
        );


        setWinner(
          payload.winner || null
        );


        // =============================================
        // UPDATE SCORE
        // =============================================

        if (payload.score) {

          setScore(
            payload.score
          );

        }


        // =============================================
        // ROUND
        // =============================================

        if (payload.round) {

          setRound(
            payload.round
          );

        }

      };


    // =================================================
    // RESTART
    // =================================================

    const restartHandler =
      ({ payload }) => {

        if (!payload) {
          return;
        }


        console.log(
          "🔄 XO RESTART:",
          payload
        );


        setBoard(
          Array(9).fill(null)
        );

        setTurn("X");

        setWinner(null);

        setGameStarted(true);


        // =============================================
        // KEEP SCORE
        // =============================================

        if (payload.score) {

          setScore(
            payload.score
          );

        }


        if (payload.round) {

          setRound(
            payload.round
          );

        }

      };


    // =================================================
    // REGISTER EVENTS
    // =================================================

    channel.on(
      "broadcast",
      {
        event: "xo-start",
      },
      startHandler
    );


    channel.on(
      "broadcast",
      {
        event: "xo-move",
      },
      moveHandler
    );


    channel.on(
      "broadcast",
      {
        event: "xo-restart",
      },
      restartHandler
    );


    // =================================================
    // CLEANUP
    // =================================================

    return () => {

      // لا نغلق channel هنا

    };

  }, [
    channel,
    player?.id,
  ]);


  // =====================================================
  // CHECK WINNER
  // =====================================================

  const calculateWinner =
    (squares) => {

      const lines = [

        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6],

      ];


      for (
        const [
          a,
          b,
          c,
        ]
        of lines
      ) {

        if (
          squares[a] &&
          squares[a] ===
          squares[b] &&
          squares[a] ===
          squares[c]
        ) {

          return squares[a];

        }

      }


      // =================================================
      // DRAW
      // =================================================

      if (
        squares.every(
          Boolean
        )
      ) {

        return "DRAW";

      }


      return null;

    };


  // =====================================================
  // CLICK CELL
  // =====================================================

  const handleClick =
    async (index) => {

      // ===============================================
      // VALIDATION
      // ===============================================

      if (!gameStarted) {
        return;
      }


      if (winner) {
        return;
      }


      if (board[index]) {
        return;
      }


      if (
        turn !==
        mySymbol
      ) {

        return;

      }


      if (!channel) {
        return;
      }


      // ===============================================
      // NEW BOARD
      // ===============================================

      const newBoard =
        [...board];


      newBoard[index] =
        mySymbol;


      // ===============================================
      // WINNER
      // ===============================================

      const newWinner =
        calculateWinner(
          newBoard
        );


      // ===============================================
      // NEXT TURN
      // ===============================================

      const nextTurn =
        mySymbol === "X"
          ? "O"
          : "X";


      // ===============================================
      // NEW SCORE
      // ===============================================

      let newScore = {
        ...score,
      };


      // ===============================================
      // ADD POINT
      // ===============================================

      if (
        newWinner === "X"
      ) {

        newScore = {
          ...newScore,
          X:
            newScore.X + 1,
        };

      }


      if (
        newWinner === "O"
      ) {

        newScore = {
          ...newScore,
          O:
            newScore.O + 1,
        };

      }


      // ===============================================
      // LOCAL UPDATE
      // ===============================================

      setBoard(
        newBoard
      );


      setTurn(
        newWinner
          ? mySymbol
          : nextTurn
      );


      setWinner(
        newWinner
      );


      setScore(
        newScore
      );


      // ===============================================
      // SEND TO OTHER PLAYER
      // ===============================================

      try {

        await channel.send({

          type:
            "broadcast",

          event:
            "xo-move",

          payload: {

            board:
              newBoard,

            turn:
              newWinner
                ? mySymbol
                : nextTurn,

            winner:
              newWinner,

            score:
              newScore,

            round:
              round,

            playerId:
              String(
                player.id
              ),

            timestamp:
              Date.now(),

          },

        });

      } catch (error) {

        console.error(
          "❌ XO MOVE ERROR:",
          error
        );

      }

    };


  // =====================================================
  // START GAME
  // =====================================================

  const startGame =
    async () => {

      if (!channel) {

        alert(
          "الغرفة غير متصلة"
        );

        return;

      }


      if (!player?.id) {

        alert(
          "بيانات اللاعب غير موجودة"
        );

        return;

      }


      // =================================================
      // GET PRESENCE
      // =================================================

      const state =
        channel.presenceState();


      let friendId =
        null;


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

              const id =
                String(
                  entry?.id ||
                  entry?.playerId ||
                  key ||
                  ""
                );


              if (
                id &&
                id !==
                String(
                  player.id
                )
              ) {

                friendId =
                  id;

              }

            }
          );

        }
      );


      // =================================================
      // CHECK FRIEND
      // =================================================

      if (!friendId) {

        alert(
          "لا يوجد لاعب آخر في الغرفة"
        );

        return;

      }


      // =================================================
      // INITIAL SCORE
      // =================================================

      const initialScore = {
        X: 0,
        O: 0,
      };


      // =================================================
      // PAYLOAD
      // =================================================

      const payload = {

        playerX:
          String(
            player.id
          ),

        playerO:
          String(
            friendId
          ),

        score:
          initialScore,

        round:
          1,

        timestamp:
          Date.now(),

      };


      // =================================================
      // SEND
      // =================================================

      try {

        await channel.send({

          type:
            "broadcast",

          event:
            "xo-start",

          payload,

        });


        // =================================================
        // LOCAL PLAYER
        // =================================================

        setMySymbol("X");


        setBoard(
          Array(9).fill(null)
        );


        setTurn("X");


        setWinner(null);


        setScore(
          initialScore
        );


        setRound(1);


        setGameStarted(true);


        setPlayersReady(true);


        console.log(
          "🚀 XO GAME STARTED:",
          payload
        );

      } catch (error) {

        console.error(
          "❌ XO START ERROR:",
          error
        );

      }

    };


  // =====================================================
  // RESTART
  // =====================================================

  const restart =
    async () => {

      if (!channel) {
        return;
      }


      // =================================================
      // NEXT ROUND
      // =================================================

      const nextRound =
        round + 1;


      // =================================================
      // KEEP CURRENT SCORE
      // =================================================

      const currentScore = {
        ...score,
      };


      // =================================================
      // RESET LOCAL
      // =================================================

      setBoard(
        Array(9).fill(null)
      );


      setTurn("X");


      setWinner(null);


      setRound(
        nextRound
      );


      // =================================================
      // SEND RESTART
      // =================================================

      try {

        await channel.send({

          type:
            "broadcast",

          event:
            "xo-restart",

          payload: {

            score:
              currentScore,

            round:
              nextRound,

            playerId:
              String(
                player.id
              ),

            timestamp:
              Date.now(),

          },

        });

        console.log(
          "🔄 XO ROUND RESTART:",
          {
            score:
              currentScore,

            round:
              nextRound,
          }
        );

      } catch (error) {

        console.error(
          "❌ XO RESTART ERROR:",
          error
        );

      }

    };


  // =====================================================
  // CLOSE
  // =====================================================

  if (!gameStarted) {

    return (

      <div className="xo-overlay">

        <div className="xo-start-box">

          <div className="xo-logo">
            ❌⭕
          </div>


          <h2>
            XO
          </h2>


          <p>
            جاهز تلعب مع صديقك؟
          </p>


          {/* ========================================= */}
          {/* SCORE */}
          {/* ========================================= */}

          <div className="xo-score">

            <div className="xo-score-player">

              <span>
                ❌
              </span>

              <strong>
                X
              </strong>

              <b>
                {score.X}
              </b>

            </div>


            <div className="xo-score-vs">
              VS
            </div>


            <div className="xo-score-player">

              <span>
                ⭕
              </span>

              <strong>
                O
              </strong>

              <b>
                {score.O}
              </b>

            </div>

          </div>


          <button
            onClick={
              startGame
            }
          >
            🚀 بدء اللعبة
          </button>


          <button
            className="xo-close"
            onClick={
              onClose
            }
          >
            العودة للجزيرة
          </button>

        </div>

      </div>

    );

  }


  // =====================================================
  // GAME UI
  // =====================================================

  return (

    <div className="xo-overlay">

      <div className="xo-game">


        {/* ============================================= */}
        {/* EXIT */}
        {/* ============================================= */}

        <button
          className="xo-exit"
          onClick={
            onClose
          }
        >
          ✕
        </button>


        {/* ============================================= */}
        {/* HEADER */}
        {/* ============================================= */}

        <div className="xo-header">

          <div>
            ❌⭕
          </div>


          <h2>
            XO
          </h2>

        </div>


        {/* ============================================= */}
        {/* SCORE */}
        {/* ============================================= */}

        <div className="xo-score">

          <div
            className={
              `xo-score-player ${
                mySymbol === "X"
                  ? "my-player"
                  : ""
              }`
            }
          >

            <span>
              ❌
            </span>

            <strong>
              X
            </strong>

            <b>
              {score.X}
            </b>

          </div>


          <div className="xo-score-vs">
            VS
          </div>


          <div
            className={
              `xo-score-player ${
                mySymbol === "O"
                  ? "my-player"
                  : ""
              }`
            }
          >

            <span>
              ⭕
            </span>

            <strong>
              O
            </strong>

            <b>
              {score.O}
            </b>

          </div>

        </div>


        {/* ============================================= */}
        {/* ROUND */}
        {/* ============================================= */}

        <div className="xo-round">

          الجولة{" "}
          <strong>
            {round}
          </strong>

        </div>


        {/* ============================================= */}
        {/* STATUS */}
        {/* ============================================= */}

        <div className="xo-status">

          {winner === "DRAW" && (

            "🤝 تعادل!"

          )}


          {winner &&
            winner !== "DRAW" && (

            <>
              🎉 الفائز:
              {" "}
              <strong>
                {winner}
              </strong>
            </>

          )}


          {!winner && (

            <>

              الدور:
              {" "}

              <strong>
                {turn}
              </strong>


              {turn === mySymbol
                ? " — دورك"
                : " — انتظر صديقك"}

            </>

          )}

        </div>


        {/* ============================================= */}
        {/* BOARD */}
        {/* ============================================= */}

        <div className="xo-board">

          {board.map(
            (
              value,
              index
            ) => (

              <button
                key={
                  index
                }
                className={
                  `xo-cell ${
                    value
                      ? "filled"
                      : ""
                  }`
                }
                onClick={() =>
                  handleClick(
                    index
                  )
                }
              >

                {value}

              </button>

            )
          )}

        </div>


        {/* ============================================= */}
        {/* MY PLAYER */}
        {/* ============================================= */}

        <div className="xo-player">

          أنت:

          {" "}

          <strong>
            {mySymbol}
          </strong>

          {" "}

          | النقاط:

          {" "}

          <strong>
            {mySymbol
              ? score[mySymbol]
              : 0}
          </strong>

        </div>


        {/* ============================================= */}
        {/* RESTART */}
        {/* ============================================= */}

        {winner && (

          <button
            className="xo-restart"
            onClick={
              restart
            }
          >

            🔄 لعب مرة أخرى

          </button>

        )}

      </div>

    </div>

  );

};


export default TicTacToe;