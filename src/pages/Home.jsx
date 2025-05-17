import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { v4 as uuidV4 } from "uuid";

export default function Home() {
  const [genID, setgenID] = useState('');
  const [user, setuser] = useState('');
  // const page = useNavigate();

  const navigate = useNavigate();
  const joinRoom = () => {
    if (!user || !genID) {
        toast.error("Username and RoomID are required!");
        return;
    }

    navigate(`/editor/${genID}`, { state: { user, genID } }); // 
};

  const createRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setgenID(id);
    toast.success("New room is created");
  };

  return (
    <div className="homePageWrapper flex justify-center items-center w-screen h-screen">
      <div className="formWrapper bg-stone-700 p-6 rounded-lg shadow-md sm:max-w-sm md:max-w-xl">
        <img src="collaboration.png" alt="logo" className="mx-auto w-25 h-25 mb-4" />
        <h4 className="mainLabel text-white text-2xl sm:text-3xl md:text-4xl text-center font-semibold mb-6">
          Invitation Room ID
        </h4>
        
        <div className="groupInput flex flex-col gap-4">
          <input
            type="text"
            placeholder="USERNAME"
            onChange={(e) => setuser(e.target.value)}
            value={user}
            className="inputField p-3 rounded-md border-2 border-gray-300 focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="ROOM ID"
            
            onChange={(e) => setgenID(e.target.value)}
            value={genID}
            className="inputField p-3 rounded-md border-2 border-gray-300 focus:border-blue-500 outline-none"
          />
        </div>

        <button onClick={joinRoom} className="join mt-6 w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
          Join
        </button>
        <p className="text-center mt-4 text-white text-sm sm:text-base">
          Create a New room <button onClick={createRoom} className="underline">ROOM ID</button>
        </p>
      </div>
    </div>
  );
}
