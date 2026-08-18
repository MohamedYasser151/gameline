import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./css/RoomChat.css";


// =====================================================
// ROOM CHAT
// =====================================================

const RoomChat = ({
  channel,
  player,
  messages,
  setMessages,
  onClose,
}) => {

  const [text, setText] =
    useState("");

  const messagesEndRef =
    useRef(null);


  // =====================================================
  // SCROLL
  // =====================================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);


  // =====================================================
  // LISTEN CHAT
  // =====================================================

  useEffect(() => {

    if (!channel) {

      console.warn(
        "⚠️ ROOM CHAT: CHANNEL NOT FOUND"
      );

      return;

    }


    console.log(
      "💬 ROOM CHAT CONNECTED"
    );


    const chatHandler =
      ({ payload }) => {

        if (!payload) {
          return;
        }


        const message = {

          id:
            payload.id ||
            `${Date.now()}-${Math.random()}`,

          playerId:
            String(
              payload.playerId ||
              ""
            ),

          name:
            payload.name ||
            "Player",

          gender:
            payload.gender === "girl"
              ? "girl"
              : "boy",

          text:
            payload.text ||
            "",

          timestamp:
            payload.timestamp ||
            Date.now(),

        };


        setMessages(
          (oldMessages) => {

            // منع التكرار

            if (
              oldMessages.some(
                (item) =>
                  item.id ===
                  message.id
              )
            ) {

              return oldMessages;

            }


            return [
              ...oldMessages,
              message,
            ];

          }
        );

      };


    channel.on(
      "broadcast",
      {
        event:
          "room-chat",
      },
      chatHandler
    );


    return () => {

      // لا نعمل unsubscribe
      // لأن channel تابع للـ Room

    };

  }, [
    channel,
    setMessages,
  ]);


  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage =
    async () => {

      const messageText =
        text.trim();


      if (!messageText) {
        return;
      }


      if (!channel) {

        console.error(
          "❌ CHAT: CHANNEL NOT FOUND"
        );

        return;

      }


      if (!player?.id) {

        console.error(
          "❌ CHAT: PLAYER NOT FOUND"
        );

        return;

      }


      const message = {

        id:
          `${player.id}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 7)}`,

        playerId:
          String(
            player.id
          ),

        name:
          player.name ||
          "Player",

        gender:
          player.gender === "girl"
            ? "girl"
            : "boy",

        text:
          messageText,

        timestamp:
          Date.now(),

      };


      // ===================================================
      // LOCAL MESSAGE
      // ===================================================

      setMessages(
        (oldMessages) => [

          ...oldMessages,

          message,

        ]
      );


      setText("");


      // ===================================================
      // SEND
      // ===================================================

      try {

        await channel.send({

          type:
            "broadcast",

          event:
            "room-chat",

          payload:
            message,

        });


        console.log(
          "📤 CHAT SENT:",
          message
        );

      } catch (error) {

        console.error(
          "❌ CHAT SEND ERROR:",
          error
        );

      }

    };


  // =====================================================
  // KEYBOARD
  // =====================================================

  const handleKeyDown =
    (event) => {

      // ================================================
      // منع Space من الوصول للعبة
      // ================================================

      if (
        event.code === "Space"
      ) {

        event.stopPropagation();

        // لا نمنع الكتابة داخل input
        // ولكن نمنع A-Frame من استقبال الحدث

        return;

      }


      // ================================================
      // ENTER
      // ================================================

      if (
        event.key === "Enter"
      ) {

        event.preventDefault();

        event.stopPropagation();

        sendMessage();

        return;

      }


      // ================================================
      // باقي أزرار الكيبورد
      // ================================================

      event.stopPropagation();

    };


  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime =
    (timestamp) => {

      try {

        return new Date(
          timestamp
        ).toLocaleTimeString(
          "ar-EG",
          {
            hour:
              "2-digit",

            minute:
              "2-digit",
          }
        );

      } catch {

        return "";

      }

    };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      className="room-chat"

      onPointerDown={(event) =>
        event.stopPropagation()
      }

      onTouchStart={(event) =>
        event.stopPropagation()
      }

      onMouseDown={(event) =>
        event.stopPropagation()
      }
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="room-chat-header">

        <div className="room-chat-title">

          <span className="room-chat-icon">
            💬
          </span>

          <div>

            <strong>
              شات الغرفة
            </strong>

            <small>
              Code Kids Island
            </small>

          </div>

        </div>


        <button
          type="button"

          className="room-chat-close"

          onClick={(event) => {

            event.stopPropagation();

            onClose();

          }}
        >
          ✕
        </button>

      </div>


      {/* ================================================= */}
      {/* MESSAGES */}
      {/* ================================================= */}

      <div className="room-chat-messages">

        {messages.length === 0 && (

          <div className="room-chat-empty">

            <div>
              💬
            </div>

            <strong>
              ابدأ الكلام مع صديقك!
            </strong>

            <small>
              الرسائل تظهر لكما مباشرة
            </small>

          </div>

        )}


        {messages.map(
          (message) => {

            const isMe =
              String(
                message.playerId
              ) ===
              String(
                player?.id
              );


            return (

              <div
                key={
                  message.id
                }

                className={
                  `room-chat-message ${
                    isMe
                      ? "me"
                      : "friend"
                  }`
                }
              >

                <div className="chat-avatar">

                  {message.gender ===
                  "girl"
                    ? "👧"
                    : "👦"}

                </div>


                <div className="chat-message-content">

                  {!isMe && (

                    <div className="chat-message-name">

                      {message.name}

                    </div>

                  )}


                  <div className="chat-bubble">

                    {message.text}

                  </div>


                  <div className="chat-message-time">

                    {formatTime(
                      message.timestamp
                    )}

                  </div>

                </div>

              </div>

            );

          }
        )}


        <div
          ref={
            messagesEndRef
          }
        />

      </div>


      {/* ================================================= */}
      {/* INPUT */}
      {/* ================================================= */}

      <div className="room-chat-input">

        <input

          type="text"

          placeholder="اكتب رسالة..."

          value={
            text
          }

          onChange={(event) =>
            setText(
              event.target.value
            )
          }

          onKeyDown={
            handleKeyDown
          }

          onKeyUp={(event) =>
            event.stopPropagation()
          }

          onKeyPress={(event) =>
            event.stopPropagation()
          }

          onFocus={(event) =>
            event.stopPropagation()
          }

          maxLength={200}
        />


        <button
          type="button"

          onClick={(event) => {

            event.stopPropagation();

            sendMessage();

          }}

          disabled={
            !text.trim()
          }
        >
          ➤
        </button>

      </div>

    </div>

  );

};


export default RoomChat;