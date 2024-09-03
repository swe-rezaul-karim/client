import  { useEffect, useRef } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";


const IncomingCallScreen = ({ incomingCall, acceptCall, declineCall }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (incomingCall) {
      audioRef.current.play(); // Play ringtone when the call screen appears
    }
    return () => {
      audioRef.current.pause(); // Stop ringtone when the component unmounts
    };
  }, [incomingCall]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50 backdrop-blur-sm">
      <CSSTransition in={!!incomingCall} timeout={300} classNames="modal">
        <div className="bg-white rounded-lg p-8 shadow-lg w-96 text-center relative">
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <img
                className="w-28 h-28 rounded-full border-4 border-primary-500 shadow-lg"
                src={incomingCall.senderPhoto || "default-profile-pic.jpg"}
                alt={incomingCall.senderName || "Caller"}
              />
              <div className="absolute inset-0 rounded-full border-4 border-primary-500 animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-semibold mt-4 text-gray-800">
              {incomingCall.senderName || "Unknown Caller"}
            </h3>
            <p className="text-sm text-gray-500 mt-2">Incoming Video Call...</p>
          </div>
          <div className="flex justify-around mt-6">
            <button
              onClick={acceptCall}
              className="relative bg-green-500 text-white rounded-full p-4 w-16 h-16 flex justify-center items-center shadow-lg transform hover:scale-105 transition duration-200 ease-in-out"
              title="Accept Call"
            >
              <FaCheck className="h-6 w-6" />
              <span className="absolute text-xs mt-12">Accept</span>
            </button>
            <button
              onClick={declineCall}
              className="relative bg-red-500 text-white rounded-full p-4 w-16 h-16 flex justify-center items-center shadow-lg transform hover:scale-105 transition duration-200 ease-in-out"
              title="Decline Call"
            >
              <FaTimes className="h-6 w-6" />
              <span className="absolute text-xs mt-12">Decline</span>
            </button>
          </div>
          <audio ref={audioRef} src="/ringtone.mp3" loop />
        </div>
      </CSSTransition>
    </div>
  );
};

export default IncomingCallScreen;
