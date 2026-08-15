import React, { useEffect } from "react";

import "aframe";

import "./gameComponents";
import "./Game.css";

import MobileJoystick from "./MobileJoystick";


// =====================================================
// TREE
// =====================================================

const Tree = ({
  position,
  scale = "1 1 1",
}) => {
  return (
    <a-entity
      position={position}
      scale={scale}
    >

      <a-cylinder
        position="0 1 0"
        radius="0.22"
        height="2"
        color="#795548"
      />

      <a-sphere
        position="0 2.3 0"
        radius="1"
        color="#2E7D32"
      />

      <a-sphere
        position="-0.6 2.1 0"
        radius="0.7"
        color="#388E3C"
      />

      <a-sphere
        position="0.6 2.1 0.1"
        radius="0.7"
        color="#43A047"
      />

    </a-entity>
  );
};


// =====================================================
// PALM
// =====================================================

const PalmTree = ({
  position,
  scale = "1 1 1",
}) => {
  return (
    <a-entity
      position={position}
      scale={scale}
    >

      <a-cylinder
        position="0 1.5 0"
        radius="0.18"
        height="3"
        color="#8D6E63"
      />

      <a-sphere
        position="0 3.15 0"
        radius="0.45"
        color="#5D4037"
      />

      <a-box
        position="0 3.35 0"
        width="2.2"
        height="0.15"
        depth="0.15"
        rotation="0 0 20"
        color="#43A047"
      />

      <a-box
        position="0 3.35 0"
        width="2.2"
        height="0.15"
        depth="0.15"
        rotation="0 0 -20"
        color="#4CAF50"
      />

      <a-box
        position="0 3.35 0"
        width="0.15"
        height="0.15"
        depth="2.2"
        rotation="20 0 0"
        color="#388E3C"
      />

      <a-box
        position="0 3.35 0"
        width="0.15"
        height="0.15"
        depth="2.2"
        rotation="-20 0 0"
        color="#66BB6A"
      />

    </a-entity>
  );
};


// =====================================================
// ROCK
// =====================================================

const Rock = ({
  position,
  scale = "1 1 1",
}) => {
  return (
    <a-sphere
      position={position}
      scale={scale}
      color="#78909C"
    />
  );
};


// =====================================================
// CLOUD
// =====================================================

const Cloud = ({
  position,
  scale = "1 1 1",
}) => {
  return (
    <a-entity
      position={position}
      scale={scale}
      cloud-movement="speed: 0.15; distance: 4"
    >

      <a-sphere
        position="0 0 0"
        radius="1"
        color="white"
      />

      <a-sphere
        position="1 0.2 0"
        radius="0.8"
        color="white"
      />

      <a-sphere
        position="-1 0.1 0"
        radius="0.7"
        color="white"
      />

      <a-sphere
        position="0.5 0.5 0"
        radius="0.75"
        color="white"
      />

    </a-entity>
  );
};


// =====================================================
// HOUSE
// =====================================================

const House = () => {
  return (
    <a-entity
      position="6 0 -2"
    >

      <a-box
        position="0 1.4 0"
        width="3"
        height="2.8"
        depth="3"
        color="#FFE0B2"
      />

      <a-cone
        position="0 3.2 0"
        radius-bottom="2.3"
        radius-top="0"
        height="1.8"
        segments="4"
        color="#E65100"
      />

      <a-box
        position="0 0.9 1.53"
        width="0.75"
        height="1.8"
        depth="0.1"
        color="#5D4037"
      />

      <a-box
        position="-0.85 1.8 1.53"
        width="0.65"
        height="0.65"
        depth="0.1"
        color="#29B6F6"
      />

      <a-box
        position="0.85 1.8 1.53"
        width="0.65"
        height="0.65"
        depth="0.1"
        color="#29B6F6"
      />

    </a-entity>
  );
};


// =====================================================
// PLAYER
// =====================================================

const Player = ({
  name = "Player",
  gender = "boy",
}) => {

  const isGirl =
    gender === "girl";

  return (
    <a-entity
      id="player"

      data-player-id=""

      data-player-name={name}

      data-player-gender={gender}

      position="0 0 3"

      rotation="0 0 0"

      player-movement="
        speed: 4.5;
        islandRadius: 12;
        jumpForce: 7;
        gravity: 18;
      "

      player-animation
    >

        <a-entity
        id="camera"
        camera="active: true"
        position="0 3.2 5.5"
        // rotation="-12 180 0"
        look-controls="enabled: false"
      >
      </a-entity>

      {/* ================================================= */}
      {/* NAME */}
      {/* ================================================= */}

      <a-text
        value={name}
        position="0 3.35 0"
        align="center"
        width="4"
        color="#FFFFFF"
        side="double"
        look-at-camera
      />

      {/* ================================================= */}
      {/* SHADOW */}
      {/* ================================================= */}

      <a-cylinder
        position="0 0.03 0"
        radius="0.65"
        height="0.03"
        color="#000000"
        opacity="0.25"
      />

      {/* ================================================= */}
      {/* BODY */}
      {/* ================================================= */}

      <a-cylinder
        position="0 1.2 0"
        radius="0.48"
        height="1.25"
        color={
          isGirl
            ? "#E91E63"
            : "#6C63FF"
        }
      />

      {/* ================================================= */}
      {/* HEAD */}
      {/* ================================================= */}

      <a-sphere
        position="0 2.2 0"
        radius="0.68"
        color="#FFD1B3"
      />

      {/* ================================================= */}
      {/* HAIR */}
      {/* ================================================= */}

      {isGirl ? (

        <>
          {/* شعر البنت */}

          <a-sphere
            position="0 2.55 0"
            radius="0.72"
            scale="1 0.72 1"
            color="#3E2723"
          />

          {/* شعر جانبي */}

          <a-sphere
            position="-0.58 2.2 0"
            radius="0.35"
            scale="0.8 1.3 0.8"
            color="#3E2723"
          />

          <a-sphere
            position="0.58 2.2 0"
            radius="0.35"
            scale="0.8 1.3 0.8"
            color="#3E2723"
          />

          {/* فيونكة */}

          <a-sphere
            position="-0.45 2.85 0"
            radius="0.22"
            color="#FF4081"
          />
          

          <a-sphere
            position="0.45 2.85 0"
            radius="0.22"
            color="#FF4081"
          />

          <a-sphere
            position="0 2.85 0"
            radius="0.12"
            color="#C2185B"
          />
        </>
        
        

      ) : (

        /* ================================================= */
        /* شعر الولد */
        /* ================================================= */

        <a-sphere
          position="0 2.62 0"
          radius="0.7"
          scale="1 0.5 1"
          color="#3E2723"
        />

      )}

      {/* ================================================= */}
      {/* EYES */}
      {/* ================================================= */}

      <a-sphere
        position="-0.22 2.28 0.61"
        radius="0.08"
        color="#111111"
      />

      <a-sphere
        position="0.22 2.28 0.61"
        radius="0.08"
        color="#111111"
      />

      {/* ================================================= */}
      {/* MOUTH */}
      {/* ================================================= */}

      <a-torus
        position="0 2.02 0.63"
        rotation="90 0 0"
        radius="0.16"
        radius-tubular="0.025"
        color="#7B3F00"
        theta-length="180"
      />

      {/* ================================================= */}
      {/* LEFT ARM */}
      {/* ================================================= */}

      <a-cylinder
        position="-0.65 1.3 0"
        rotation="0 0 90"
        radius="0.13"
        height="0.8"
        color="#FFD1B3"
      />

      {/* ================================================= */}
      {/* RIGHT ARM */}
      {/* ================================================= */}

      <a-cylinder
        position="0.65 1.3 0"
        rotation="0 0 90"
        radius="0.13"
        height="0.8"
        color="#FFD1B3"
      />

      {/* ================================================= */}
      {/* LEFT LEG */}
      {/* ================================================= */}

      <a-box
        position="-0.22 0.35 0"
        width="0.28"
        height="0.8"
        depth="0.3"
        color="#263238"
      />

      {/* ================================================= */}
      {/* RIGHT LEG */}
      {/* ================================================= */}

      <a-box
        position="0.22 0.35 0"
        width="0.28"
        height="0.8"
        depth="0.3"
        color="#263238"
      />

    </a-entity>
  );
};

// =====================================================
// GAME
// =====================================================

const Game = ({
  player,
}) => {

  // ===================================================
  // PREVENT MOBILE ZOOM
  // ===================================================

  useEffect(() => {

    const preventZoom = (event) => {

      if (
        event.touches &&
        event.touches.length > 1
      ) {
        event.preventDefault();
      }

    };


    document.addEventListener(
      "touchmove",
      preventZoom,
      {
        passive: false,
      }
    );


    return () => {

      document.removeEventListener(
        "touchmove",
        preventZoom
      );

    };

  }, []);


  // ===================================================
  // SET PLAYER ID
  // ===================================================

  useEffect(() => {

    const setPlayerId = () => {

      const player =
        document.querySelector(
          "#player"
        );

      if (!player) {
        return;
      }


      const id =
        sessionStorage.getItem(
          "codekids_player_id"
        );


      if (id) {

        player.setAttribute(
          "data-player-id",
          id
        );

        console.log(
          "🆔 LOCAL PLAYER ID:",
          id
        );

      }

    };


    const timer =
      setTimeout(
        setPlayerId,
        1000
      );


    return () => {
      clearTimeout(timer);
    };

  }, []);


  return (

    <div className="game-container">


      {/* ================================================= */}
      {/* A-FRAME */}
      {/* ================================================= */}

      <a-scene

        embedded

        vr-mode-ui="enabled: false"

        device-orientation-permission-ui="
          enabled: false
        "

        renderer="
          antialias: true;
          colorManagement: true;
        "
      >


        {/* ================================================= */}
        {/* SKY */}
        {/* ================================================= */}

        <a-sky
          color="#7DD3FC"
        />


        {/* ================================================= */}
        {/* LIGHT */}
        {/* ================================================= */}

        <a-light
          type="ambient"
          intensity="1.5"
        />

        <a-light
          type="directional"
          intensity="1.7"
          position="-5 10 5"
        />


        {/* ================================================= */}
        {/* WATER */}
        {/* ================================================= */}

        <a-cylinder
          position="0 -1.15 0"
          radius="18"
          height="0.4"
          color="#29B6F6"
        />


        {/* ================================================= */}
        {/* ISLAND */}
        {/* ================================================= */}

        <a-cylinder
          position="0 -0.65 0"
          radius="15"
          height="1.3"
          color="#795548"
        />

        <a-cylinder
          position="0 0 0"
          radius="14.6"
          height="0.35"
          color="#F4D35E"
        />

        <a-cylinder
          position="0 0.18 0"
          radius="13.5"
          height="0.3"
          color="#4CAF50"
        />


        {/* ================================================= */}
        {/* TREES */}
        {/* ================================================= */}

        <Tree
          position="-8 0 -6"
        />

        <Tree
          position="-6 0 -9"
          scale="0.8 0.8 0.8"
        />

        <Tree
          position="9 0 -6"
        />

        <Tree
          position="10 0 5"
          scale="0.8 0.8 0.8"
        />

        <Tree
          position="-9 0 5"
          scale="1.1 1.1 1.1"
        />


        {/* ================================================= */}
        {/* PALMS */}
        {/* ================================================= */}

        <PalmTree
          position="-11 0 -1"
          scale="1.1 1.1 1.1"
        />

        <PalmTree
          position="11 0 1"
          scale="0.9 0.9 0.9"
        />

        <PalmTree
          position="2 0 -10"
          scale="0.8 0.8 0.8"
        />


        {/* ================================================= */}
        {/* ROCKS */}
        {/* ================================================= */}

        <Rock
          position="-6 0 -2"
          scale="1.2 0.7 0.9"
        />

        <Rock
          position="4 0 -6"
          scale="0.8 0.6 0.8"
        />

        <Rock
          position="10 0 -1"
          scale="1.2 0.8 0.7"
        />

        <Rock
          position="-8 0 2"
          scale="0.7 0.5 0.7"
        />


        {/* ================================================= */}
        {/* HOUSE */}
        {/* ================================================= */}

        <House />


        {/* ================================================= */}
        {/* CLOUDS */}
        {/* ================================================= */}

        <Cloud
          position="-8 8 -10"
          scale="1.3 1.3 1.3"
        />

        <Cloud
          position="5 10 -8"
          scale="1.8 1.8 1.8"
        />

        <Cloud
          position="12 7 0"
          scale="1.2 1.2 1.2"
        />


        {/* ================================================= */}
        {/* STARS */}
        {/* ================================================= */}

        <a-torus
          position="-3 1.2 -4"
          rotation="90 0 0"
          radius="0.45"
          radius-tubular="0.12"
          color="#FFD700"
          collectible
        />

        <a-torus
          position="3 1.2 -6"
          rotation="90 0 0"
          radius="0.45"
          radius-tubular="0.12"
          color="#FFD700"
          collectible
        />

        <a-torus
          position="-7 1.2 5"
          rotation="90 0 0"
          radius="0.45"
          radius-tubular="0.12"
          color="#FFD700"
          collectible
        />


        {/* ================================================= */}
        {/* LOCAL PLAYER */}
        {/* ================================================= */}

<Player
  name={
    player?.name ||
    "Player"
  }
  gender={
    player?.gender ||
    "boy"
  }
/>

        {/* ================================================= */}
        {/* CAMERA */}
        {/* ================================================= */}

        <a-entity
          id="camera"

          camera="
            active: true;
            fov: 65;
          "

          position="0 3 9"

          look-controls="enabled: false"

          wasd-controls="enabled: false"

          third-person-camera="
            target: #player;
          "
        />

      </a-scene>


      {/* ================================================= */}
      {/* HUD */}
      {/* ================================================= */}

      <div className="game-ui">

        <div className="game-title">
          🏝️ Code Kids Island
        </div>

        <div className="game-info">
          استكشف الجزيرة واجمع النجوم ⭐
        </div>

      </div>


      {/* ================================================= */}
      {/* MOBILE JOYSTICK */}
      {/* ================================================= */}

      <MobileJoystick />

    </div>
  );
};


export default Game;