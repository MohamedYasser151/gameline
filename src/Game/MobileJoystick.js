import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./MobileJoystick.css";


// =====================================================
// MOBILE JOYSTICK
// =====================================================

const MobileJoystick = () => {

  const joystickRef = useRef(null);

  const [active, setActive] = useState(false);


  // =====================================================
  // ORIENTATION
  // =====================================================

  useEffect(() => {

    const handleResize = () => {

      window.dispatchEvent(
        new Event("resize")
      );

    };

    window.addEventListener(
      "resize",
      handleResize
    );

    window.addEventListener(
      "orientationchange",
      handleResize
    );

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

      window.removeEventListener(
        "orientationchange",
        handleResize
      );

    };

  }, []);


  // =====================================================
  // FULLSCREEN
  // =====================================================

  const enterFullscreen = async () => {

    try {

      const element =
        document.documentElement;


      // ================================================
      // FULLSCREEN
      // ================================================

      if (
        !document.fullscreenElement
      ) {

        if (
          element.requestFullscreen
        ) {

          await element.requestFullscreen();

        }

      }


      // ================================================
      // LANDSCAPE
      // ================================================

      if (
        window.screen &&
        window.screen.orientation &&
        window.screen.orientation.lock
      ) {

        try {

          await window.screen.orientation.lock(
            "landscape"
          );

          console.log(
            "📱 Landscape locked"
          );

        } catch (error) {

          console.log(
            "⚠️ Landscape lock unavailable:",
            error
          );

        }

      }

    } catch (error) {

      console.error(
        "❌ Fullscreen error:",
        error
      );

    }

  };


  // =====================================================
  // EXIT FULLSCREEN
  // =====================================================

  const exitFullscreen = async () => {

    try {

      if (
        document.fullscreenElement
      ) {

        await document.exitFullscreen();

      }

    } catch (error) {

      console.error(
        "❌ Exit fullscreen error:",
        error
      );

    }

  };


  // =====================================================
  // JOYSTICK UPDATE
  // =====================================================

  const updateJoystick = (
    clientX,
    clientY
  ) => {

    const joystick =
      joystickRef.current;


    if (!joystick) {
      return;
    }


    const rect =
      joystick.getBoundingClientRect();


    const centerX =
      rect.left +
      rect.width / 2;


    const centerY =
      rect.top +
      rect.height / 2;


    let x =
      clientX -
      centerX;


    let y =
      clientY -
      centerY;


    const maxDistance =
      rect.width / 2 - 30;


    const distance =
      Math.sqrt(
        x * x +
        y * y
      );


    if (
      distance > maxDistance &&
      distance !== 0
    ) {

      x =
        (x / distance) *
        maxDistance;


      y =
        (y / distance) *
        maxDistance;

    }


    const normalizedX =
      x / maxDistance;


    const normalizedY =
      y / maxDistance;


    // ===================================================
    // KNOB
    // ===================================================

    const knob =
      joystick.querySelector(
        ".joystick-knob"
      );


    if (knob) {

      knob.style.transform =
        `translate(${x}px, ${y}px)`;

    }


    // ===================================================
    // SEND JOYSTICK EVENT
    // ===================================================

    window.dispatchEvent(
      new CustomEvent(
        "joystickmove",
        {
          detail: {
            x: normalizedX,
            y: normalizedY,
          },
        }
      )
    );

  };


  // =====================================================
  // START
  // =====================================================

  const handleStart = (
    event
  ) => {

    event.preventDefault();

    setActive(true);


    const point =
      event.touches
        ? event.touches[0]
        : event;


    updateJoystick(
      point.clientX,
      point.clientY
    );

  };


  // =====================================================
  // MOVE
  // =====================================================

  const handleMove = (
    event
  ) => {

    if (!active) {
      return;
    }


    event.preventDefault();


    const point =
      event.touches
        ? event.touches[0]
        : event;


    updateJoystick(
      point.clientX,
      point.clientY
    );

  };


  // =====================================================
  // END
  // =====================================================

  const handleEnd = (
    event
  ) => {

    if (event) {
      event.preventDefault();
    }


    setActive(false);


    const knob =
      joystickRef.current?.querySelector(
        ".joystick-knob"
      );


    if (knob) {

      knob.style.transform =
        "translate(0px, 0px)";

    }


    window.dispatchEvent(
      new CustomEvent(
        "joystickmove",
        {
          detail: {
            x: 0,
            y: 0,
          },
        }
      )
    );

  };


  // =====================================================
  // JUMP
  // =====================================================

  const jump = (
    event
  ) => {

    if (event) {

      event.preventDefault();

      event.stopPropagation();

    }


    window.dispatchEvent(
      new CustomEvent(
        "player-jump"
      )
    );

  };


  // =====================================================
  // FULLSCREEN BUTTON
  // =====================================================

  const handleFullscreen = async (
    event
  ) => {

    event.preventDefault();

    event.stopPropagation();


    if (
      document.fullscreenElement
    ) {

      await exitFullscreen();

    } else {

      await enterFullscreen();

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      className="mobile-controls"
    >

      {/* ============================================= */}
      {/* FULLSCREEN */}
      {/* ============================================= */}

      <button
        type="button"
        className="fullscreen-button"
        onClick={
          handleFullscreen
        }
        aria-label="Fullscreen"
      >

        {document.fullscreenElement
          ? "⛶"
          : "⛶"}

      </button>


      {/* ============================================= */}
      {/* JOYSTICK */}
      {/* ============================================= */}

      <div
        ref={joystickRef}
        className="joystick"

        onTouchStart={
          handleStart
        }

        onTouchMove={
          handleMove
        }

        onTouchEnd={
          handleEnd
        }

        onTouchCancel={
          handleEnd
        }

        onMouseDown={
          handleStart
        }

        onMouseMove={
          handleMove
        }

        onMouseUp={
          handleEnd
        }

        onMouseLeave={
          handleEnd
        }
      >

        <div
          className="joystick-knob"
        >
          ✦
        </div>

      </div>


      {/* ============================================= */}
      {/* JUMP */}
      {/* ============================================= */}

      <button
        type="button"
        className="jump-button"

        onTouchStart={
          jump
        }

        onClick={
          jump
        }
      >
        ↑
      </button>

    </div>

  );

};


export default MobileJoystick;