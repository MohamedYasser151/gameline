// ============================================================
// RemotePlayerManager.js
// Code Kids Island Multiplayer
// ============================================================

const remotePlayers =
  new Map();


// ============================================================
// GET SCENE
// ============================================================

function getScene() {

  return document.querySelector(
    "a-scene"
  );

}


// ============================================================
// GET LOCAL PLAYER
// ============================================================

function getLocalPlayer() {

  const scene =
    getScene();


  if (!scene) {
    return null;
  }


  return scene.querySelector(
    "#player"
  );

}


// ============================================================
// CREATE ELEMENT
// ============================================================

function createElement(
  tag,
  attributes = {}
) {

  const element =
    document.createElement(
      tag
    );


  Object.entries(
    attributes
  ).forEach(
    ([key, value]) => {

      element.setAttribute(
        key,
        value
      );

    }
  );


  return element;

}


// ============================================================
// CREATE NAME
// ============================================================

function createPlayerName(
  name
) {

  const text =
    createElement(
      "a-text",
      {

        value:
          name ||
          "Player",

        position:
          "0 3.35 0",

        align:
          "center",

        width:
          "4",

        color:
          "#FFFFFF",

        side:
          "double",

        "billboard-name":
          "",

      }
    );


  return text;

}


// ============================================================
// CREATE CHARACTER
// ============================================================

function createCharacter(
  player,
  name,
  gender
) {

  // ========================================================
  // CLEAR OLD CHARACTER
  // ========================================================

  while (
    player.firstChild
  ) {

    player.removeChild(
      player.firstChild
    );

  }


  const isGirl =
    gender === "girl";


  // ========================================================
  // NAME
  // ========================================================

  const nameText =
    createPlayerName(
      name
    );


  player.appendChild(
    nameText
  );


  // ========================================================
  // SHADOW
  // ========================================================

  const shadow =
    createElement(
      "a-cylinder",
      {

        position:
          "0 0.03 0",

        radius:
          "0.65",

        height:
          "0.03",

        color:
          "#000000",

        opacity:
          "0.25",

      }
    );


  player.appendChild(
    shadow
  );


  // ========================================================
  // BODY
  // ========================================================

  const body =
    createElement(
      "a-cylinder",
      {

        position:
          "0 1.2 0",

        radius:
          "0.48",

        height:
          "1.25",

        color:
          isGirl
            ? "#E91E63"
            : "#6C63FF",

      }
    );


  player.appendChild(
    body
  );


  // ========================================================
  // HEAD
  // ========================================================

  const head =
    createElement(
      "a-sphere",
      {

        position:
          "0 2.2 0",

        radius:
          "0.68",

        color:
          "#FFD1B3",

      }
    );


  player.appendChild(
    head
  );


  // ========================================================
  // HAIR
  // ========================================================

  if (isGirl) {

    // ================================================
    // GIRL HAIR
    // ================================================

    const hair =
      createElement(
        "a-sphere",
        {

          position:
            "0 2.55 0",

          radius:
            "0.72",

          scale:
            "1 0.72 1",

          color:
            "#3E2723",

        }
      );


    player.appendChild(
      hair
    );


    // ================================================
    // LEFT SIDE HAIR
    // ================================================

    const leftHair =
      createElement(
        "a-sphere",
        {

          position:
            "-0.58 2.2 0",

          radius:
            "0.35",

          scale:
            "0.8 1.3 0.8",

          color:
            "#3E2723",

        }
      );


    player.appendChild(
      leftHair
    );


    // ================================================
    // RIGHT SIDE HAIR
    // ================================================

    const rightHair =
      createElement(
        "a-sphere",
        {

          position:
            "0.58 2.2 0",

          radius:
            "0.35",

          scale:
            "0.8 1.3 0.8",

          color:
            "#3E2723",

        }
      );


    player.appendChild(
      rightHair
    );


    // ================================================
    // BOW LEFT
    // ================================================

    const bowLeft =
      createElement(
        "a-sphere",
        {

          position:
            "-0.45 2.85 0",

          radius:
            "0.22",

          color:
            "#FF4081",

        }
      );


    player.appendChild(
      bowLeft
    );


    // ================================================
    // BOW RIGHT
    // ================================================

    const bowRight =
      createElement(
        "a-sphere",
        {

          position:
            "0.45 2.85 0",

          radius:
            "0.22",

          color:
            "#FF4081",

        }
      );


    player.appendChild(
      bowRight
    );


    // ================================================
    // BOW CENTER
    // ================================================

    const bowCenter =
      createElement(
        "a-sphere",
        {

          position:
            "0 2.85 0",

          radius:
            "0.12",

          color:
            "#C2185B",

        }
      );


    player.appendChild(
      bowCenter
    );

  } else {

    // ================================================
    // BOY HAIR
    // ================================================

    const hair =
      createElement(
        "a-sphere",
        {

          position:
            "0 2.62 0",

          radius:
            "0.7",

          scale:
            "1 0.5 1",

          color:
            "#3E2723",

        }
      );


    player.appendChild(
      hair
    );

  }


  // ========================================================
  // EYES
  // ========================================================

  const leftEye =
    createElement(
      "a-sphere",
      {

        position:
          "-0.22 2.28 0.61",

        radius:
          "0.08",

        color:
          "#111111",

      }
    );


  const rightEye =
    createElement(
      "a-sphere",
      {

        position:
          "0.22 2.28 0.61",

        radius:
          "0.08",

        color:
          "#111111",

      }
    );


  player.appendChild(
    leftEye
  );

  player.appendChild(
    rightEye
  );


  // ========================================================
  // MOUTH
  // ========================================================

  const mouth =
    createElement(
      "a-torus",
      {

        position:
          "0 2.02 0.63",

        rotation:
          "90 0 0",

        radius:
          "0.16",

        "radius-tubular":
          "0.025",

        color:
          "#7B3F00",

        "theta-length":
          "180",

      }
    );


  player.appendChild(
    mouth
  );


  // ========================================================
  // LEFT ARM
  // ========================================================

  const leftArm =
    createElement(
      "a-cylinder",
      {

        position:
          "-0.65 1.3 0",

        rotation:
          "0 0 90",

        radius:
          "0.13",

        height:
          "0.8",

        color:
          "#FFD1B3",

      }
    );


  player.appendChild(
    leftArm
  );


  // ========================================================
  // RIGHT ARM
  // ========================================================

  const rightArm =
    createElement(
      "a-cylinder",
      {

        position:
          "0.65 1.3 0",

        rotation:
          "0 0 90",

        radius:
          "0.13",

        height:
          "0.8",

        color:
          "#FFD1B3",

      }
    );


  player.appendChild(
    rightArm
  );


  // ========================================================
  // LEFT LEG
  // ========================================================

  const leftLeg =
    createElement(
      "a-box",
      {

        position:
          "-0.22 0.35 0",

        width:
          "0.28",

        height:
          "0.8",

        depth:
          "0.3",

        color:
          "#263238",

      }
    );


  player.appendChild(
    leftLeg
  );


  // ========================================================
  // RIGHT LEG
  // ========================================================

  const rightLeg =
    createElement(
      "a-box",
      {

        position:
          "0.22 0.35 0",

        width:
          "0.28",

        height:
          "0.8",

        depth:
          "0.3",

        color:
          "#263238",

      }
    );


  player.appendChild(
    rightLeg
  );

}


// ============================================================
// CREATE REMOTE PLAYER
// ============================================================

function createRemotePlayer(
  data
) {

  if (!data?.playerId) {
    return null;
  }


  const scene =
    getScene();


  if (!scene) {

    console.warn(
      "⚠️ A-Frame scene not ready"
    );

    return null;

  }


  // ========================================================
  // CHECK LOCAL PLAYER
  // ========================================================

  const localPlayer =
    getLocalPlayer();


  if (
    localPlayer &&
    data.playerId ===
      localPlayer.getAttribute(
        "data-player-id"
      )
  ) {

    return null;

  }


  // ========================================================
  // ALREADY EXISTS
  // ========================================================

  const existing =
    remotePlayers.get(
      data.playerId
    );


  if (existing) {

    return existing.element;

  }


  // ========================================================
  // ROOT
  // ========================================================

  const remotePlayer =
    document.createElement(
      "a-entity"
    );


  remotePlayer.id =
    `remote-player-${data.playerId}`;


  remotePlayer.setAttribute(
    "data-remote-player",
    "true"
  );


  remotePlayer.setAttribute(
    "data-player-id",
    data.playerId
  );


  remotePlayer.setAttribute(
    "position",
    `${
      Number(data.x) || 0
    } ${
      Number(data.y) || 0
    } ${
      Number(data.z) || 0
    }`
  );


  remotePlayer.setAttribute(
    "rotation",
    `0 ${
      (
        Number(data.rotation) ||
        0
      ) *
      180 /
      Math.PI
    } 0`
  );


  // ========================================================
  // DATA
  // ========================================================

  const playerName =
    data.name ||
    "Player";


  const playerGender =
    data.gender === "girl"
      ? "girl"
      : "boy";


  // ========================================================
  // CREATE CHARACTER
  // ========================================================

  createCharacter(
    remotePlayer,
    playerName,
    playerGender
  );


  // ========================================================
  // ADD TO SCENE
  // ========================================================

  scene.appendChild(
    remotePlayer
  );


  // ========================================================
  // STORE
  // ========================================================

  const startX =
    Number(data.x) || 0;

  const startY =
    Number(data.y) || 0;

  const startZ =
    Number(data.z) || 0;

  const startRotation =
    Number(data.rotation) || 0;


  remotePlayers.set(
    data.playerId,
    {

      element:
        remotePlayer,

      target: {

        x:
          startX,

        y:
          startY,

        z:
          startZ,

        rotation:
          startRotation,

      },

      current: {

        x:
          startX,

        y:
          startY,

        z:
          startZ,

        rotation:
          startRotation,

      },

      name:
        playerName,

      gender:
        playerGender,

    }
  );


  console.log(
    "🧍 REMOTE PLAYER CREATED:",
    playerName,
    playerGender
  );


  return remotePlayer;

}


// ============================================================
// UPDATE REMOTE PLAYER
// ============================================================

export function updateRemotePlayer(
  data
) {

  if (!data?.playerId) {
    return;
  }


  // ========================================================
  // LOCAL ID
  // ========================================================

  const localPlayer =
    getLocalPlayer();


  const localId =
    localPlayer?.getAttribute(
      "data-player-id"
    );


  if (
    localId &&
    data.playerId === localId
  ) {

    return;

  }


  // ========================================================
  // GET EXISTING
  // ========================================================

  let remote =
    remotePlayers.get(
      data.playerId
    );


  // ========================================================
  // CREATE
  // ========================================================

  if (!remote) {

    createRemotePlayer(
      data
    );


    remote =
      remotePlayers.get(
        data.playerId
      );


    if (!remote) {
      return;
    }

  }


  // ========================================================
  // POSITION
  // ========================================================

  remote.target.x =
    Number(data.x) || 0;

  remote.target.y =
    Number(data.y) || 0;

  remote.target.z =
    Number(data.z) || 0;

  remote.target.rotation =
    Number(data.rotation) || 0;


  // ========================================================
  // NAME / GENDER
  // ========================================================

  const newName =
    data.name ||
    remote.name ||
    "Player";


  const newGender =
    data.gender === "girl"
      ? "girl"
      : "boy";


  const changed =
    newName !== remote.name ||
    newGender !== remote.gender;


  if (changed) {

    remote.name =
      newName;

    remote.gender =
      newGender;


    createCharacter(
      remote.element,
      remote.name,
      remote.gender
    );

  }

}


// ============================================================
// UPDATE ALL REMOTE PLAYERS
// ============================================================

export function updateRemotePlayers() {

  remotePlayers.forEach(
    (remote) => {

      if (
        !remote ||
        !remote.element
      ) {

        return;

      }


      const object =
        remote.element.object3D;


      if (!object) {
        return;
      }


      // ====================================================
      // SMOOTH POSITION
      // ====================================================

      const speed =
        0.22;


      object.position.x +=
        (
          remote.target.x -
          object.position.x
        ) *
        speed;


      object.position.y +=
        (
          remote.target.y -
          object.position.y
        ) *
        speed;


      object.position.z +=
        (
          remote.target.z -
          object.position.z
        ) *
        speed;


      // ====================================================
      // SMOOTH ROTATION
      // ====================================================

      const currentRotation =
        object.rotation.y;


      const targetRotation =
        remote.target.rotation;


      const difference =
        Math.atan2(
          Math.sin(
            targetRotation -
            currentRotation
          ),
          Math.cos(
            targetRotation -
            currentRotation
          )
        );


      object.rotation.y +=
        difference *
        speed;

    }
  );

}


// ============================================================
// REMOVE REMOTE PLAYER
// ============================================================

export function removeRemotePlayer(
  playerId
) {

  if (!playerId) {
    return;
  }


  const remote =
    remotePlayers.get(
      playerId
    );


  if (!remote) {
    return;
  }


  if (
    remote.element &&
    remote.element.parentNode
  ) {

    remote.element.parentNode.removeChild(
      remote.element
    );

  }


  remotePlayers.delete(
    playerId
  );


  console.log(
    "🔴 REMOTE PLAYER REMOVED:",
    playerId
  );

}


// ============================================================
// REMOVE ALL
// ============================================================

export function removeAllRemotePlayers() {

  remotePlayers.forEach(
    (remote) => {

      if (
        remote.element &&
        remote.element.parentNode
      ) {

        remote.element.parentNode.removeChild(
          remote.element
        );

      }

    }
  );


  remotePlayers.clear();

}


// ============================================================
// DEBUG
// ============================================================

export function getRemotePlayers() {

  return remotePlayers;

}