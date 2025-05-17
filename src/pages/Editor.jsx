import React, { useState, useEffect, useRef } from "react";
import Client from "../components/Client";
// import Chat from "../components/Chat";
import { Users, MessageCircle, LogOut, Clipboard } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import EditorPage from "../components/EditorPage";
import { useLogout } from "../components/Logout";
import toast from "react-hot-toast";
import { initSocket } from "../socket";
import { ACTIONS } from "../../action.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function Editor() {
  const logOut = useLogout();
  const [copyID, setCopyID] = useState("");
  const [clients, setClients] = useState([]);
  const [openUsers, setOpenUsers] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  const param = useParams();
  const roomID = param.roomid;
  const reactNavigator = useNavigate();
  const location = useLocation();
  const socketRef = useRef(null);
  const currentUser = location.state?.user; // Default user

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", handleError);
      socketRef.current.on("connect_failed", handleError);
  
      function handleError(e) {
        console.error("Socket connection error:", e);
        toast.error("Socket connection error");
        reactNavigator("/");
      }
  
      // Emit JOIN event with correct username
      socketRef.current.emit(ACTIONS.JOIN, { roomID, username: currentUser });
  
      // ✅ Ensure username is passed correctly in JOINED event
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketID }) => {
        console.log(`User ${username} joined room ${roomID}`);
        toast.success(`${username} joined the room`);
      
        setClients((prevClients) => {
          const uniqueClients = new Map(prevClients.map(c => [c.socketID, c]));
          clients.forEach(client => uniqueClients.set(client.socketID, client));
      
          return Array.from(uniqueClients.values());
        });
      });
      
   
  
      // ✅ Fix DISCONNECTED event to show correct username
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        console.log("Disconnected Event Received: ", { username, socketId }); // Debugging log
  
        if (username) {
          toast.success(`${username} left the room`);
        }
  
        setClients((prevClients) =>
          prevClients.filter((user) => user.socketID !== socketId)
        );
      });
  
      return () => {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOIN);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      };
    };
  
    init();
  }, [roomID, currentUser]);
  

  return (
    <div className="h-screen w-full bg-gray-900 text-white">
      {/* Sidebar (Users List) */}
      <div
        className={`bg-gray-800 w-30 p-4 shadow-lg transition-transform ${
          openUsers ? "translate-x-0" : "translate-x-full"
        } fixed top-10 right-0 h-auto z-20`}
      >
        <h3 className="text-lg font-semibold mb-4 text-center">
          Connected Clients
        </h3>
        <div className="pl-4">
          {clients.map((user) => (
            <Client key={user.socketID} username={user.username} />
          ))}
        </div>
      </div>

      {/* Main Content (Editor) */}
      <div className="flex-1 flex items-center justify-center">
        <EditorPage socketRef ={socketRef} roomID />
      </div>

      {/* Floating Controls */}
      <div className="fixed top-4 right-4 flex flex-col gap-3">
        <div className="flex">
          <button
            onClick={logOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <LogOut className="w-4 h-4" />
            Leave Room
          </button>
          <CopyToClipboard text={copyID}>
            <button
              onClick={() => toast.success("ID copied successfully")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Clipboard className="w-4 h-4" />
              Copy Room ID
            </button>
          </CopyToClipboard>
        </div>
        <div>
          <button
            onClick={() => setOpenUsers(!openUsers)}
            className="bg-gray-800 rounded-full shadow-md hover:bg-gray-700 transition"
          >
            <Users className="w-6 h-6 text-white button" />
          </button>
          <button
            onClick={() => setOpenChat(!openChat)}
            className="bg-gray-800 p-3 rounded-full shadow-md hover:bg-gray-700 transition"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      
    </div>
  );
}
