import React, {
  useEffect,
  useState,
} from "react";

import "./css/TicTacToe.css";


const EMPTY_BOARD =
  Array(9).fill(null);


const TicTacToe = ({
  channel,
  player,
  onClose,
}) => {

  const [board, setBoard] =
    useState(EMPTY_BOARD);

  const [mySymbol, setMySymbol] =
    useState(null);

  const [gameStarted, setGameStarted] =
    useState(false);

  const [turn, setTurn] =
    useState("X");

  const [winner, setWinner] =
    useState(null);

  const [playersReady, setPlayersReady] =
    useState(false);


  // =====================================================
  // LISTEN XO EVENTS
  // =====================================================

  useEffect(() => {

    if (!channel) {
      return;
    }


    // ===================================================
    // GAME START
    // ===================================================

    const startHandler =
      ({ payload }) => {

        if (!payload) {
          return;
        }


        console.log(
          "🎮 XO START:",
          payload
        );


        if (
          payload.playerX ===
          player.id
        ) {

          setMySymbol("X");

        } else if (
          payload.playerO ===
          player.id
        ) {

          setMySymbol("O");

        }


        setBoard(
          Array(9).fill(null)
        );

        setTurn("X");

        setWinner(null);

        setGameStarted(true);

        setPlayersReady(true);

      };


    // ===================================================
    // MOVE
    // ===================================================

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
          payload.board
        );

        setTurn(
          payload.turn
        );

        setWinner(
          payload.winner ||
          null
        );

      };


    // ===================================================
    // RESTART
    // ===================================================

    const restartHandler =
      ({ payload }) => {

        if (!payload) {
          return;
        }


        setBoard(
          Array(9).fill(null)
        );

        setTurn("X");

        setWinner(null);

      };


    channel.on(
      "broadcast",
      {
        event:
          "xo-start",
      },
      startHandler
    );


    channel.on(
      "broadcast",
      {
        event:
          "xo-move",
      },
      moveHandler
    );


    channel.on(
      "broadcast",
      {
        event:
          "xo-restart",
      },
      restartHandler
    );


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
          c
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
  // CLICK
  // =====================================================

  const handleClick =
    async (index) => {

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


      const newBoard =
        [...board];


      newBoard[index] =
        mySymbol;


      const newWinner =
        calculateWinner(
          newBoard
        );


      const nextTurn =
        mySymbol === "X"
          ? "O"
          : "X";


      setBoard(
        newBoard
      );

      setTurn(
        nextTurn
      );

      setWinner(
        newWinner
      );


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

            playerId:
              player.id,

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
        return;
      }


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
                player.id
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
          "لا يوجد لاعب آخر"
        );

        return;

      }


      try {

        await channel.send({

          type:
            "broadcast",

          event:
            "xo-start",

          payload: {

            playerX:
              player.id,

            playerO:
              friendId,

            timestamp:
              Date.now(),

          },

        });


        setMySymbol(
          "X"
        );

        setBoard(
          Array(9).fill(null)
        );

        setTurn(
          "X"
        );

        setWinner(
          null
        );

        setGameStarted(
          true
        );

        setPlayersReady(
          true
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

      try {

        await channel.send({

          type:
            "broadcast",

          event:
            "xo-restart",

          payload: {

            playerId:
              player.id,

            timestamp:
              Date.now(),

          },

        });


        setBoard(
          Array(9).fill(null)
        );

        setTurn("X");

        setWinner(null);

      } catch (error) {

        console.error(
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
  // GAME
  // =====================================================

  return (

    <div className="xo-overlay">

      <div className="xo-game">

        <button
          className="xo-exit"
          onClick={
            onClose
          }
        >
          ✕
        </button>


        <div className="xo-header">

          <div>
            ❌⭕
          </div>

          <h2>
            XO
          </h2>

        </div>


        <div className="xo-status">

          {winner === "DRAW" && (
            "🤝 تعادل!"
          )}

          {winner &&
            winner !== "DRAW" && (
              <>
                🎉 الفائز: {winner}
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


        <div className="xo-player">

          أنت:

          {" "}

          <strong>
            {mySymbol}
          </strong>

        </div>


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