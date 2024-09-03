import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { io } from "socket.io-client";
import {
  FaPhone,
  FaVideo,
  FaSync,
  FaTimes,
  FaCheck,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import SocketContext from "../../SocketContext";


const Messenger = ({socket}) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [senders, setSenders] = useState([]);
  const [selectedSender, setSelectedSender] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [usingFrontCamera, setUsingFrontCamera] = useState(true);
  const [incomingCall, setIncomingCall] = useState(null);
  const [muted, setMuted] = useState(false);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const location = useLocation();
  const { providerName, providerPhoto, providerEmail } = location.state || {};

  useEffect(() => {
    if (user && user.email) {
      socket.emit("Connecting with user", user.email);
      fetchSenders(user.email);


      if (providerEmail) {
        fetchMessages(user.email, providerEmail);
      } else if (selectedSender) {
        fetchMessages(user.email, selectedSender.email);
      }


      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
      socket.on("offer", async (data) => {
        await handleIncomingCall(data);
      });


      socket.on("answer", async (data) => {
        await handleAnswer(data);
      });


      socket.on("ice-candidate", (data) => {
        handleIceCandidate(data);
      });
      socket.on("connect_error", (err) => {
        console.error("Connection error:", err.message);
      });


      return () => {
        socket.disconnect();
        if (peerConnection) {
          peerConnection.close();
        }
      };
    }
  }, [user, peerConnection, selectedSender]);

  const fetchSenders = (receiver) => {
    fetch(
      `http://localhost:5000/messages/senders/${receiver}`
    )
      .then((res) => res.json())
      .then((data) => setSenders(data))
      .catch((error) => console.error("Error fetching senders:", error));
  };

  const fetchMessages = (sender, receiver) => {
    fetch(
      `http://localhost:5000/messages/${sender}/${receiver}`
    )
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error fetching messages:", error));
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = {
        sender: user.email,
        // receiver: providerEmail,
        receiver: selectedSender?.email || providerEmail,
        message,
        createdAt: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      // Save message to the database
      fetch(
        "http://localhost:5000/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        }
      )
        .then((res) => res.json())
        .then((savedMessage) => {
          // Update messages state
          // setMessages((prevMessages) => [...prevMessages, savedMessage]);
          setMessage("");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
          // Optionally, remove the message from the UI if the request fails
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg !== newMessage)
          );
        });
    }
  };

  const startAudioCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      const pc = createPeerConnection();
      setPeerConnection(pc);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", {
        offer,
        receiver: selectedSender.email,
        sender: user.email,
      });
      Swal.fire("Audio call started");
    } catch (error) {
      console.error("Error starting audio call:", error);
    }
  };
  // const startAudioCall = async () => {
  //   try {
  //       if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  //         console.log('navigator.mediaDevices:', navigator.mediaDevices);
  //         throw new Error('getUserMedia is not supported in this browser');
  //       }

  //     Swal.fire('Audio call started');
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     setLocalStream(stream);

  //     const pc = createPeerConnection();
  //     setPeerConnection(pc);

  //     // pc.addStream(stream);
  //      // Add the local stream to the peer connection
  //   stream.getTracks().forEach(track => {
  //     pc.addTrack(track, stream);
  //   });

  //     const offer = await pc.createOffer();
  //     await pc.setLocalDescription(offer);

  //     socket.emit('offer', {
  //       offer,
  //       receiver: selectedSender.email,
  //       sender: user.email,
  //     });
  //   } catch (error) {
  //     console.error('Error starting audio call:', error);
  //   }
  // };
  const startVideoCall = async () => {
    try {
      setVideoCallActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: usingFrontCamera ? "user" : "environment" },
        audio: true,
      });
      setLocalStream(stream);

      //Set the local video stream to the local video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      initiatePeerConnection(stream);
    } catch (error) {
      console.error("Error starting video call:", error);
    }

    //   if (localVideoRef.current) {
    //     localVideoRef.current.srcObject = stream;
    //   }
    //   const pc = createPeerConnection();
    //   setPeerConnection(pc);
    //   stream.getTracks().forEach(track => pc.addTrack(track, stream));
    //   const offer = await pc.createOffer();
    //   await pc.setLocalDescription(offer);
    //   socket.emit('offer', { offer, receiver: selectedSender.email, sender: user.email });
    // } catch (error) {
    //   console.error('Error starting video call:', error);
    // }
  };
  const initiatePeerConnection = async (stream) => {
    const pc = createPeerConnection();
    setPeerConnection(pc);

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("offer", {
      offer,
      receiver: selectedSender.email,
      sender: user.email,
    });
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          receiver: selectedSender.email,
          sender: user.email,
        });
      }
    };

      // Handle the incoming remote stream
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    return pc;
  };
  const handleIncomingCall = async (data) => {
    setIncomingCall(data);
    Swal.fire({
      title: "Incoming Video Call",
      text: `Call from ${data.sender}`,
      showCancelButton: true,
      confirmButtonText: "Accept",
      cancelButtonText: "Decline",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        acceptCall();
      } else {
        declineCall();
      }
    });
  };

  const acceptCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: usingFrontCamera ? "user" : "environment" },
      audio: true,
    });
    setLocalStream(stream);
    setVideoCallActive(true);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const pc = createPeerConnection();
    setPeerConnection(pc);

    // Add the local stream tracks to the peer connection
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    // Set the remote description using the incoming offer
    await pc.setRemoteDescription(
      new RTCSessionDescription(incomingCall.offer)
    );

    // Create and send an answer
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("answer", {
      answer,
      receiver: incomingCall.sender,
      sender: user.email,
    });

    setIncomingCall(null);
  };

  const declineCall = () => {
    setIncomingCall(null);
    Swal.fire("Call Declined");
  };
  const handleAnswer = async (data) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    }
  };
  const handleIceCandidate = (data) => {
    if (peerConnection) {
      peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  // const handleOffer = async (data) => {
  //   const pc = createPeerConnection();
  //   setPeerConnection(pc);

  //   await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

  //   const answer = await pc.createAnswer();
  //   await pc.setLocalDescription(answer);

  //   socket.emit('answer', {
  //     answer,
  //     receiver: data.sender,
  //     sender: user.email,
  //   });
  // };

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
  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setMuted(!audioTrack.enabled);
    }
  };

  const endCall = () => {
    setVideoCallActive(false);
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection) {
      peerConnection.close();
    }
    setLocalStream(null);
    setPeerConnection(null);

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null; // Clear the remote video element
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null; // Clear the local video element
    }
    Swal.fire("Call Ended");
  };

  useEffect(() => {
    // Scroll to the latest message whenever messages are updated
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      <div className="md:w-1/4 p-4 border-r border-gray-200 dark:border-gray-700">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Conversations</h2>
        <ul className="list-none p-0 overflow-y-auto max-h-[50vh] md:max-h-full">
          {senders.length > 0 ? (
            senders.map((sender, index) => (
              <li
                key={index}
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  selectedSender?.email === sender.email
                    ? "bg-primary text-white"
                    : "hover:bg-gray-200"
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
            <li className="text-gray-500 text-center mt-8">No conversations yet</li>
          )}
        </ul>
      </div>
      <div className="md:w-3/4 bg-base-200 rounded-md bg-fixed">
        <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-md">
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
              <div className="flex">
                <button
                  onClick={startAudioCall}
                  className="btn btn-sm btn-circle mx-1"
                >
                  <FaPhone className="h-5 w-5 text-primary" />
                </button>
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
                onClick={startAudioCall}
                className="btn btn-sm btn-circle mx-1"
              >
                <FaPhone className="h-5 w-5 text-primary" />
              </button>
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
        <div className="bg-fixed bottom-0 card-body h-[72vh] overflow-y-scroll bg-base-100">
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
                        ? user.photoURL
                        : selectedSender?.photo
                    }
                    alt="Sender"
                  />
                </div>
              </div>
              <div className="chat-bubble">{msg.message}</div>
              <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="card-footer p-4 flex items-center border-t bg-gray-50">
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

      {videoCallActive && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
          <div className="relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="rounded-md w-[80vw] md:w-[60vw]"
            />
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              className="absolute bottom-1 md:left-8 w-[80vw] md:w-[50vw] rounded-md border-2 border-white"
            />
            <div className="absolute bottom-4 left-32 md:left-96 flex space-x-2">
              <button
                onClick={toggleMute}
                className="btn btn-sm btn-circle bg-red-600"
              >
                {muted ? (
                  <FaMicrophoneSlash className="h-5 w-5 text-white" />
                ) : (
                  <FaMicrophone className="h-5 w-5 text-white" />
                )}
              </button>
              <button
                onClick={switchCamera}
                className="btn btn-sm btn-circle bg-blue-600"
              >
                <FaSync className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={endCall}
                className="btn btn-sm btn-circle bg-red-600"
              >
                <FaTimes className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {incomingCall && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <img
              className="w-24 h-24 rounded-full mx-auto"
              src={incomingCall.senderPhoto}
              alt={incomingCall.sender}
            />
            <h3 className="text-xl font-semibold mt-4">
              Incoming Call from {incomingCall.senderName}
            </h3>
            <div className="flex justify-center space-x-4 mt-4">
              <button onClick={acceptCall} className="btn btn-lg btn-success">
                <FaCheck className="h-5 w-5 mr-2" /> Accept
              </button>
              <button onClick={declineCall} className="btn btn-lg btn-error">
                <FaTimes className="h-5 w-5 mr-2" /> Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MessageWithContext = (props) => (
  <SocketContext.Consumer>
    {() => <Messenger {...props}/>}
  </SocketContext.Consumer>
)
export default MessageWithContext;
