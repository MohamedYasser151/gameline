import React from "react";

import "./Game.css";


// =====================================================
// GAMES
// =====================================================

const GAMES = [

  {
    id: "xo",
    name: "XO",
    icon: "❌⭕",
    description:
      "العب XO مع صديقك",
  },

  {
    id: "memory",
    name: "Memory",
    icon: "🧠",
    description:
      "اختبر ذاكرتك",
  },

  {
    id: "puzzle",
    name: "Puzzle",
    icon: "🧩",
    description:
      "حل الألغاز",
  },

  {
    id: "reaction",
    name: "Reaction",
    icon: "⚡",
    description:
      "من الأسرع؟",
  },

  {
    id: "four",
    name: "4 in Row",
    icon: "🔴🟡",
    description:
      "وصل أربعة",
  },

  {
    id: "quiz",
    name: "Quiz",
    icon: "❓",
    description:
      "أسئلة وتحديات",
  },

];


// =====================================================
// COMPONENT
// =====================================================

const GameMenu = ({
  players = [],
  currentPlayer,
  channel,
  onGameSelect,
}) => {

  const friend =
    players.find(
      (p) =>
        p.id !==
        currentPlayer?.id
    );


  return (

    <div className="game-menu">

      <div className="game-menu-header">

        <div>

          <h2>
            🎮 ألعاب الغرفة
          </h2>

          <p>
            اختر لعبة والعب مع صديقك
          </p>

        </div>

      </div>


      <div className="games-grid">

        {GAMES.map(
          (game) => (

            <button
              key={game.id}
              className="game-card"

              onClick={() => {

                if (!friend) {

                  alert(
                    "يجب أن يكون هناك لاعب آخر في الغرفة 🎮"
                  );

                  return;

                }


                onGameSelect(
                  game,
                  friend
                );

              }}
            >

              <div className="game-icon">

                {game.icon}

              </div>


              <div className="game-name">

                {game.name}

              </div>


              <div className="game-description">

                {game.description}

              </div>


              <div className="game-send">

                🎮 إرسال للصديق

              </div>

            </button>

          )
        )}

      </div>

    </div>

  );

};


export default GameMenu;