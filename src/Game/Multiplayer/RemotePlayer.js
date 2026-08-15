import React from "react";

const RemotePlayer = ({
  player,
}) => {

  return (
    <a-entity
      id={`remote-${player.id}`}
      position={`${player.x || 0} ${player.y || 0} ${player.z || 0}`}
      rotation={`0 ${player.rotation || 0} 0`}
    >

      {/* Shadow */}

      <a-cylinder
        position="0 0.03 0"
        radius="0.7"
        height="0.02"
        color="#000000"
        opacity="0.22"
      />


      {/* Body */}

      <a-cylinder
        position="0 1.2 0"
        radius="0.48"
        height="1.25"
        color="#FF7043"
      />


      {/* Head */}

      <a-sphere
        position="0 2.2 0"
        radius="0.68"
        color="#FFD1B3"
      />


      {/* Hair */}

      <a-sphere
        position="0 2.62 0"
        radius="0.7"
        scale="1 0.5 1"
        color="#263238"
      />


      {/* Eyes */}

      <a-sphere
        position="-0.22 2.28 0.61"
        radius="0.08"
        color="#111"
      />

      <a-sphere
        position="0.22 2.28 0.61"
        radius="0.08"
        color="#111"
      />


      {/* Name */}

      <a-text
        value={player.name || "Player"}
        position="0 3.25 0"
        align="center"
        color="#FFFFFF"
        width="4"
        side="double"
      />

    </a-entity>
  );
};

export default RemotePlayer;