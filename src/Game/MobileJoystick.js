import React, {
  useRef,
  useState,
} from "react";

import "./MobileJoystick.css";


const MobileJoystick = () => {

  const joystickRef =
    useRef(null);

  const [active, setActive] =
    useState(false);


  // =====================================================
  // JOYSTICK
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
      rect.width / 2 -
      30;


    const distance =
      Math.sqrt(
        x * x +
        y * y
      );


    if (
      distance > maxDistance
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
    // MOVE KNOB
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
    // SEND EVENT
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

  const handleStart =
    (event) => {

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

  const handleMove =
    (event) => {

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

  const handleEnd =
    (event) => {

      event.preventDefault();

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

  const jump =
    (event) => {

      event.preventDefault();

      event.stopPropagation();


      window.dispatchEvent(
        new Event(
          "playerjump"
        )
      );
    };


  return (

    <div
      className="mobile-controls"
    >

      {/* ============================================= */}
      {/* JOYSTICK */}
      {/* ============================================= */}

      <div
        ref={joystickRef}
        className="joystick"
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
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
  className="jump-button"
  onTouchStart={(e) => {

    e.preventDefault();

    window.dispatchEvent(
      new CustomEvent(
        "player-jump"
      )
    );

  }}
  onClick={() => {

    window.dispatchEvent(
      new CustomEvent(
        "player-jump"
      )
    );

  }}
>
    ↑
</button>

    </div>
  );
};


export default MobileJoystick;