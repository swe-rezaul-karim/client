import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { FaVideo, FaSync, FaTimes, FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import SocketContext from "../../SocketContext";
import Peer from "simple-peer";
import { server_url } from "../../utils/connection.js";
import CallTimes from "./CallTimes.jsx";
const initialCallData = {
  from: "",
  to: "",
  name: "",
  picture: "",
  signal: "",
  receivingCall: false
}
const Messenger = ({ socket }) => {
  const [userData, setUserData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [senders, setSenders] = useState([]);
  const [callingInfo, setCallingInfo] = useState(null);
  const [selectedSender, setSelectedSender] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [usingFrontCamera, setUsingFrontCamera] = useState(true);
  const [incomingCall, setIncomingCall] = useState(initialCallData);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callReceived, setCallReceived] = useState(false);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const connectionRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const location = useLocation();
  const { providerName, providerPhoto, providerEmail } = location.state || {};

  useEffect(() => {
    if (user && user.email) {
      const cachedSenders = localStorage.getItem("senders");
      if (cachedSenders) {
        setSenders(JSON.parse(cachedSenders)); // Load senders from local storage
      } else {
        fetchSenders(user.email); // Fetch senders from the server
      }

      if (providerEmail) {
        fetchMessages(user.email, providerEmail);
      } else if (selectedSender) {
        fetchMessages(user.email, selectedSender.email);
      }

      socket.on("get-online-users", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [user, selectedSender]); // Again, peerConnection removed from dependencies

  useEffect(() => {
    if (user && user?.email) {
      fetch(`${server_url}/users`)
        .then((res) => res.json())
        .then((data) => {
          const matchedUser = data.find((uData) => uData.email === user.email);
          if (matchedUser) {
            setUserData(matchedUser);
            socket.emit("join", {
              name: matchedUser.name,
              email: matchedUser.email,
              picture: matchedUser.photo,
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    } else {
      setUserData([]);
    }
  }, [user]);

  const fetchSenders = (receiver) => {
    fetch(`${server_url}/messages/senders/${receiver}`)
      .then((res) => res.json())
      .then((data) => {
        setSenders((prevSenders) => {
          const mergedSenders = [...prevSenders];
          data.forEach((newSender) => {
            if (
              !mergedSenders.some((sender) => sender.email === newSender.email)
            ) {
              mergedSenders.push(newSender);
            }
          });
          return mergedSenders;
        });
      })
      .catch((error) => console.error("Error fetching senders:", error));
  };

  const fetchMessages = (sender, receiver) => {
    fetch(`${server_url}/messages/${sender}/${receiver}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error fetching messages:", error));
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      const recipientEmail = selectedSender?.email || providerEmail;
      const recipientName = selectedSender?.name || providerName;
      const recipientPhoto = selectedSender?.photo || providerPhoto;

      const newMessage = {
        sender: user.email,
        receiver: recipientEmail,
        message,
        createdAt: new Date(),
      };

      // Ensure the recipient is in the senders list
      if (!senders.some((sender) => sender.email === recipientEmail)) {
        const newSender = {
          email: recipientEmail,
          name: recipientName,
          photo: recipientPhoto,
        };
        const updatedSenders = [...senders, newSender];
        setSenders(updatedSenders);
        setSelectedSender(newSender); // Select the sender

        // Save to local storage
        localStorage.setItem("senders", JSON.stringify(updatedSenders));
      }

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      fetch(`${server_url}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      })
        .then((res) => res.json())
        .then(() => setMessage(""))
        .catch((error) => {
          console.error("Error sending message:", error);
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg !== newMessage)
          );
        });
    }
  };

  useEffect(() => {
    socket.on("callUser", async (data) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setLocalStream(stream);

      setIncomingCall({
        from: data.from,
        name: data.name,
        picture: data.picture,
        signal: data.signal,
        receivingCall: true
      });
    });
  }, [userData]);

  useEffect(() => {
    if (callingInfo) {
      socket.on("callDeclined", () => {
        setVideoCallActive(false);
        setCallingInfo(null);

        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop());
        }
        if (peerConnection) {
          peerConnection.close();
        }
        setLocalStream(null);
        setPeerConnection(null);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
        Swal.fire("Call Ended");
      });

      socket.on("callEnded", () => {
        setVideoCallActive(false);
        setCallReceived(false);
        setCallingInfo(null);

        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop());
        }

        setLocalStream(null);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
        if (connectionRef.current) {
          connectionRef.current.destroy();
        }
      });
    }
  }, [callingInfo]);

  useEffect(() => {
    if (incomingCall.receivingCall) {
      socket.on("callDeclined", () => {
        setIncomingCall(initialCallData);
        setCallingInfo(null);
      });
      socket.on("callEnded", () => {
        setCallAccepted(false); // Reset callAccepted state

        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop());
        }

        setLocalStream(null);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
        setIncomingCall(initialCallData);
        if (connectionRef.current) {
          connectionRef.current.destroy();
        }
      });
    }
  }, [incomingCall.receivingCall]);

  const startVideoCall = async () => {
    try {
      if (selectedSender) {
        setVideoCallActive(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        });

        let currentUser = onlineUsers.find(
          (u) =>
            u.name === selectedSender.name && u.email === selectedSender.email
        );
        peer.on("signal", (data) => {
          let info = {
            userToCall: currentUser.socketId,
            signal: data,
            name: userData.name,
            picture: userData.photo,
          };
          setCallingInfo(info);
          socket.emit("callUser", info);
        });
        peer.on("stream", (stream) => {
          remoteVideoRef.current.srcObject = stream;
        });

        socket.on("callAccepted", (signal) => {
          setCallReceived(true);
          peer.signal(signal);
        });
        connectionRef.current = peer;
      } else {
        alert("Please select a user");
      }
      // initiatePeerConnection(stream);
    } catch (error) {
      console.error(error);
    }
  };

  const acceptCall = async () => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: localStream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: incomingCall.from });
    });

    peer.on("stream", (stream) => {
      remoteVideoRef.current.srcObject = stream;
    });
    // remoteVideoRef.current.srcObject = testVide;
    peer.signal(incomingCall.signal);
    connectionRef.current = peer;
    // setIncomingCall(null);
  };

  const declineCall = () => {
    socket.emit("callDeclined", incomingCall.from);
    setIncomingCall(initialCallData);
  };

  const switchCamera = async () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    const newCameraMode = usingFrontCamera ? "environment" : "user";
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: newCameraMode },
      audio: true,
    });
    setLocalStream(stream);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    if (peerConnection) {
      const videoTrack = stream.getVideoTracks()[0];
      const sender = peerConnection
        .getSenders()
        .find((s) => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }
    setUsingFrontCamera(!usingFrontCamera);
  };

  const endCall = () => {
    if (!callReceived && callingInfo) {
      setVideoCallActive(false);
      setCallAccepted(false); // Reset callAccepted state

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection) {
        peerConnection.close();
      }
      setLocalStream(null);
      setPeerConnection(null);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      socket.emit("callDeclined", callingInfo.userToCall);
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    } else if (callReceived && callingInfo) {
      setVideoCallActive(false);
      setCallReceived(false);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }

      setLocalStream(null);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      socket.emit("callEnded", callingInfo.userToCall);
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    } else if (callAccepted && incomingCall) {
      setCallAccepted(false);
      setIncomingCall(initialCallData)
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }

      setLocalStream(null);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      socket.emit("callEnded", incomingCall.from);
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      <div className="md:w-1/4 p-4 border-r border-gray-200 dark:border-gray-700">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          Conversations
        </h2>
        <ul className="list-none p-0 overflow-y-auto max-h-[50vh] md:max-h-full">
          {senders.length > 0 ? (
            senders.map((sender, index) => (
              <li
                key={index}
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  selectedSender?.email === sender.email
                    ? "bg-primary text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                onClick={() => setSelectedSender(sender)}
              >
                <img
                  className="w-12 h-12 rounded-full"
                  src={sender.photo}
                  alt={sender.name}
                />
                <span className="ml-4 hidden md:block">{sender.name}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-center mt-8">
              No conversations yet
            </li>
          )}
        </ul>
      </div>
      <div className="md:w-3/4 flex flex-col bg-base-200 rounded-md">
        <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-t-md">
          {selectedSender ? (
            <>
              <div className="flex items-center">
                <img
                  className="w-12 md:w-14 h-12 md:h-14 rounded-full"
                  src={selectedSender.photo}
                  alt={selectedSender.name}
                />
                <span className="ml-4">{selectedSender.name}</span>
              </div>
              {onlineUsers.filter(
                (u) =>
                  u.name === selectedSender.name &&
                  u.email === selectedSender.email
              ).length !== 0
                ? "Online"
                : "Offline"}
              <div className="flex">
                <button
                  onClick={() => {
                    if (
                      onlineUsers.filter(
                        (u) =>
                          u.name === selectedSender.name &&
                          u.email === selectedSender.email
                      ).length === 0
                    ) {
                      alert("User is not online");
                    } else {
                      startVideoCall();
                    }
                  }}
                  className="btn btn-sm btn-circle mx-1"
                >
                  <FaVideo className="h-5 w-5 text-primary" />
                </button>
                {videoCallActive && (
                  <button
                    onClick={switchCamera}
                    className="btn btn-sm btn-circle mx-1"
                  >
                    <FaSync className="h-5 w-5 text-primary" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center">
                <img
                  className="w-12 md:w-14 h-12 md:h-14 rounded-full"
                  src={providerPhoto}
                  alt={providerName}
                />
                <span className="ml-4">{providerName}</span>
              </div>
              <div className="flex">
                <button
                  onClick={startVideoCall}
                  className="btn btn-sm btn-circle mx-1"
                >
                  <FaVideo className="h-5 w-5 text-primary" />
                </button>
                {videoCallActive && (
                  <button
                    onClick={switchCamera}
                    className="btn btn-sm btn-circle mx-1"
                  >
                    <FaSync className="h-5 w-5 text-primary" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        <div className="p-4 h-[60vh] md:h-[72vh] overflow-y-scroll bg-gray-50 dark:bg-gray-800">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat ${
                msg.sender === user.email ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={
                      msg.sender === user.email
                        ? userData.photo
                        : selectedSender?.photo
                    }
                    alt="Sender"
                  />
                </div>
              </div>
              <div className="chat-bubble">{msg.message}</div>
              <span className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 flex items-center border-t bg-gray-100 dark:bg-gray-800">
          <textarea
            className="textarea textarea-bordered flex-1"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && !e.shiftKey && sendMessage()
            }
            rows={1}
            style={{ resize: "none" }}
          />
          <button
            className="btn btn-primary ml-2"
            onClick={sendMessage}
            disabled={!message.trim()}
          >
            Send
          </button>
        </div>
      </div>

      {/* Video Call Screen */}
      {videoCallActive && (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 w-full max-w-3xl h-3/4 flex flex-col items-center justify-between">
            {/* Caller Information */}
            <div className="flex flex-col items-center mb-4">
              <img
                className="w-16 h-16 rounded-full mb-2"
                src={selectedSender?.photo || "default-caller.png"}
                alt={selectedSender?.name || "Caller"}
              />
              <h2 className="text-xl font-semibold text-white">
                {selectedSender?.name || "Caller Name"}
              </h2>
              {!callReceived ? (
                <p className="text-gray-400">Ringing...</p>
              ) : (
                <CallTimes />
              )}
            </div>

            {/* Remote Video */}
            <div className="flex-1 flex items-center justify-center relative w-full h-full rounded-md overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Local Video */}
              <div className="absolute bottom-1/4 flex justify-center items-center">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  className="w-40 h-30 rounded-md border-2 border-white object-cover"
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={endCall}
                className="w-12 h-12 bg-red-600 text-white rounded-full flex justify-center items-center"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incoming Call Screen */}
      {incomingCall.receivingCall ? (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 w-full max-w-3xl h-3/4 flex flex-col items-center justify-between">
            {/* Caller Information */}
            <div className="flex flex-col items-center mb-4">
              <img
                className="w-16 h-16 rounded-full mb-2"
                src={incomingCall.picture}
                alt={incomingCall.name}
              />
              <h2 className="text-xl font-semibold text-white">
                {incomingCall.name}
              </h2>
              {!callAccepted ? (
                <p className="text-gray-400">Incoming Call...</p>
              ) : (
                <CallTimes />
              )}
            </div>

            {/* Placeholder for Video or Animation */}
            <div className="flex-1 flex items-center justify-center relative w-full h-full rounded-md overflow-hidden">
              {callAccepted ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : null}

              {/* Local Video */}
              <div className="absolute bottom-1/4 flex justify-center items-center">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  className="w-40 h-30 rounded-md border-2 border-white object-cover"
                />
              </div>
            </div>

            {/* Control Buttons */}
            {!callAccepted ? (
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => {
                    acceptCall();
                    setCallAccepted(true);
                  }}
                  className="w-16 h-16 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition"
                >
                  <FaCheck className="h-6 w-6 mx-auto" />
                </button>
                <button
                  onClick={declineCall}
                  className="w-16 h-16 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition"
                >
                  <FaTimes className="h-6 w-6 mx-auto" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={endCall}
                  className="w-12 h-12 bg-red-600 text-white rounded-full flex justify-center items-center"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const MessengerWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Messenger {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default MessengerWithContext;
