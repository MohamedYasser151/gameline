import "aframe";
import * as THREE from "three";

// =====================================================
// AFRAME
// =====================================================

const AFRAME_INSTANCE =
  typeof window !== "undefined"
    ? window.AFRAME
    : null;


// =====================================================
// PLAYER MOVEMENT
// =====================================================

if (
  AFRAME_INSTANCE &&
  !AFRAME_INSTANCE.components["player-movement"]
) {

  AFRAME_INSTANCE.registerComponent(
    "player-movement",
    {

      schema: {

        speed: {
          type: "number",
          default: 4.5,
        },

        islandRadius: {
          type: "number",
          default: 12,
        },

        jumpForce: {
          type: "number",
          default: 7,
        },

        gravity: {
          type: "number",
          default: 18,
        },

      },


      init() {

        console.log(
          "🎮 PLAYER MOVEMENT INITIALIZED"
        );

        this.velocityY = 0;

        this.grounded = true;

        this.keys = {};

        this.joystickX = 0;

        this.joystickY = 0;

        this.lastSent = 0;


        // ==========================================
        // KEY DOWN
        // ==========================================

        this.onKeyDown = (event) => {

          this.keys[event.code] = true;

          if (
            event.code === "Space"
          ) {

            event.preventDefault();

            this.jump();

          }

        };


        // ==========================================
        // KEY UP
        // ==========================================

        this.onKeyUp = (event) => {

          this.keys[event.code] = false;

        };


        window.addEventListener(
          "keydown",
          this.onKeyDown
        );

        window.addEventListener(
          "keyup",
          this.onKeyUp
        );


        // ==========================================
        // JOYSTICK
        // ==========================================

        this.onJoystickMove = (
          event
        ) => {

          const data =
            event.detail;

          if (!data) {
            return;
          }

          this.joystickX =
            Number(data.x) || 0;

          this.joystickY =
            Number(data.y) || 0;

        };


        window.addEventListener(
          "joystickmove",
          this.onJoystickMove
        );

        window.addEventListener(
          "mobilejoystick",
          this.onJoystickMove
        );


        // ==========================================
        // JUMP
        // ==========================================

        this.onJump = () => {

          this.jump();

        };


        window.addEventListener(
          "player-jump",
          this.onJump
        );

      },


      // =================================================
      // JUMP
      // =================================================

      jump() {

        if (!this.grounded) {
          return;
        }

        this.velocityY =
          this.data.jumpForce;

        this.grounded = false;

      },


      // =================================================
      // TICK
      // =================================================

      tick(
        time,
        deltaTime
      ) {

        const dt =
          Math.min(
            deltaTime / 1000,
            0.05
          );


        const position =
          this.el.object3D.position;


        // ==========================================
        // KEYBOARD
        // ==========================================

        let forward = 0;

        let strafe = 0;


        if (
          this.keys["KeyW"] ||
          this.keys["ArrowUp"]
        ) {

          forward += 1;

        }


        if (
          this.keys["KeyS"] ||
          this.keys["ArrowDown"]
        ) {

          forward -= 1;

        }


        if (
          this.keys["KeyD"] ||
          this.keys["ArrowRight"]
        ) {

          strafe += 1;

        }


        if (
          this.keys["KeyA"] ||
          this.keys["ArrowLeft"]
        ) {

          strafe -= 1;

        }


        // ==========================================
        // JOYSTICK
        // ==========================================

        forward += this.joystickY;

        strafe += this.joystickX;


        // ==========================================
        // NORMALIZE
        // ==========================================

        const length =
          Math.sqrt(
            forward * forward +
            strafe * strafe
          );


        if (length > 1) {

          forward /= length;

          strafe /= length;

        }


        // ==========================================
        // CAMERA YAW
        // ==========================================

        const camera =
          document.querySelector(
            "#camera"
          );


        let yaw = 0;


        if (
          camera &&
          camera.components &&
          camera.components["codekids-camera"]
        ) {

          yaw =
            camera.components[
              "codekids-camera"
            ].yaw || 0;

        }


        // ==========================================
        // DIRECTION
        // ==========================================

        const sin =
          Math.sin(yaw);

        const cos =
          Math.cos(yaw);


        const directionX =
          strafe * cos -
          forward * sin;


        const directionZ =
          strafe * sin +
          forward * cos;


        // ==========================================
        // MOVEMENT
        // ==========================================

        const moving =
          Math.abs(directionX) > 0.01 ||
          Math.abs(directionZ) > 0.01;


        if (moving) {

          position.x +=
            directionX *
            this.data.speed *
            dt;


          position.z +=
            directionZ *
            this.data.speed *
            dt;


          // ========================================
          // ROTATION
          // ========================================

          const targetRotation =
            Math.atan2(
              directionX,
              directionZ
            );


          const currentRotation =
            this.el.object3D.rotation.y;


          let difference =
            targetRotation -
            currentRotation;


          while (
            difference > Math.PI
          ) {

            difference -=
              Math.PI * 2;

          }


          while (
            difference < -Math.PI
          ) {

            difference +=
              Math.PI * 2;

          }


          this.el.object3D.rotation.y =
            currentRotation +
            difference * 0.2;

        }


        // ==========================================
        // GRAVITY
        // ==========================================

        this.velocityY -=
          this.data.gravity * dt;


        position.y +=
          this.velocityY * dt;


        if (position.y <= 0) {

          position.y = 0;

          this.velocityY = 0;

          this.grounded = true;

        }


        // ==========================================
        // ISLAND LIMIT
        // ==========================================

        const radius =
          Math.sqrt(
            position.x * position.x +
            position.z * position.z
          );


        if (
          radius >
          this.data.islandRadius
        ) {

          const angle =
            Math.atan2(
              position.z,
              position.x
            );


          position.x =
            Math.cos(angle) *
            this.data.islandRadius;


          position.z =
            Math.sin(angle) *
            this.data.islandRadius;

        }


        // ==========================================
        // MULTIPLAYER SEND
        // ==========================================

        if (
          time -
          this.lastSent >
          60
        ) {

          this.lastSent = time;


          window.dispatchEvent(
            new CustomEvent(
              "localplayerupdate",
              {
                detail: {

                  x:
                    position.x,

                  y:
                    position.y,

                  z:
                    position.z,

                  rotation:
                    this.el.object3D
                      .rotation.y,

                },
              }
            )
          );

        }

      },


      // =================================================
      // REMOVE
      // =================================================

      remove() {

        window.removeEventListener(
          "keydown",
          this.onKeyDown
        );

        window.removeEventListener(
          "keyup",
          this.onKeyUp
        );

        window.removeEventListener(
          "joystickmove",
          this.onJoystickMove
        );

        window.removeEventListener(
          "mobilejoystick",
          this.onJoystickMove
        );

        window.removeEventListener(
          "player-jump",
          this.onJump
        );

      },

    }
  );

}


// =====================================================
// CAMERA FOLLOW PLAYER
// =====================================================

if (
  AFRAME_INSTANCE &&
  !AFRAME_INSTANCE.components["camera-follow-player"]
) {

  AFRAME_INSTANCE.registerComponent(
    "camera-follow-player",
    {

      schema: {

        height: {
          type: "number",
          default: 2.2,
        },

        smooth: {
          type: "number",
          default: 8,
        },

      },


      init() {

        this.player = null;

      },


      tick(time, deltaTime) {

        if (!this.player) {

          this.player =
            document.querySelector(
              "#player"
            );

          if (!this.player) {
            return;
          }

        }


        const playerPosition =
          this.player.object3D.position;


        const cameraPosition =
          this.el.object3D.position;


        const dt =
          Math.min(
            deltaTime / 1000,
            0.05
          );


        const smooth =
          Math.min(
            1,
            this.data.smooth * dt
          );


        cameraPosition.x +=
          (
            playerPosition.x -
            cameraPosition.x
          ) * smooth;


        cameraPosition.z +=
          (
            playerPosition.z -
            cameraPosition.z
          ) * smooth;


        const targetY =
          playerPosition.y +
          this.data.height;


        cameraPosition.y +=
          (
            targetY -
            cameraPosition.y
          ) * smooth;

      },

    }
  );

}


// =====================================================
// CLOUD MOVEMENT
// =====================================================

if (
  AFRAME_INSTANCE &&
  !AFRAME_INSTANCE.components["cloud-movement"]
) {

  AFRAME_INSTANCE.registerComponent(
    "cloud-movement",
    {

      schema: {

        speed: {
          type: "number",
          default: 0.15,
        },

        distance: {
          type: "number",
          default: 4,
        },

      },


      init() {

        this.startX =
          this.el.object3D.position.x;

      },


      tick(time) {

        this.el.object3D.position.x =
          this.startX +
          Math.sin(
            time *
            0.0001 *
            this.data.speed
          ) *
          this.data.distance;

      },

    }
  );

}


// =====================================================
// BILLBOARD NAME
// يجعل اسم اللاعب مواجهًا للكاميرا
// =====================================================

if (
  AFRAME_INSTANCE &&
  !AFRAME_INSTANCE.components["billboard-name"]
) {

  AFRAME_INSTANCE.registerComponent(
    "billboard-name",
    {

      tick() {

        const camera =
          document.querySelector(
            "#camera"
          );


        if (!camera) {
          return;
        }


        const cameraObject =
          camera.object3D;


        const nameObject =
          this.el.object3D;


        if (
          !cameraObject ||
          !nameObject
        ) {

          return;

        }


        // نجعل الاسم أفقيًا
        // ومواجهًا للكاميرا

        const cameraPosition =
          cameraObject.getWorldPosition(
            new THREE.Vector3()
          );


        const namePosition =
          nameObject.getWorldPosition(
            new THREE.Vector3()
          );


        const dx =
          cameraPosition.x -
          namePosition.x;


        const dz =
          cameraPosition.z -
          namePosition.z;


        nameObject.rotation.y =
          Math.atan2(
            dx,
            dz
          );

      },

    }
  );

}