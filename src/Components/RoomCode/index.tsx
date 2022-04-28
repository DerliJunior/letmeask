import React from "react";

import copy from "../../assets/images/copy.svg";

import '../../styles/roomCode.scss';
type RoomCodeProps = {
  id?: string;
};
const RoomCode = ({ id }: RoomCodeProps) => {

  const copyRoomCodeToClipboard = () => {
    navigator.clipboard.writeText(id ?? String(id))
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copy} alt="" />
      </div>
      <span>Sala # {id}</span>
    </button>
  );
};

export default RoomCode;
