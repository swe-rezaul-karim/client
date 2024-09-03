
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/routes.jsx'
import AuthProvider from './providers/AuthProvider.jsx'
import SocketContext from './SocketContext.js'
import { io } from "socket.io-client";
const socket = io('http://localhost:5000',
  {
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <SocketContext.Provider value={socket}>
   <AuthProvider>
    <RouterProvider router={router}/>
    </AuthProvider>
   </SocketContext.Provider>
  </React.StrictMode>,
)
