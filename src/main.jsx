
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/routes.jsx'
import AuthProvider from './providers/AuthProvider.jsx'
import SocketContext from './SocketContext.js'
import { io } from "socket.io-client";
import {server_url} from "./utils/connection.js";
const socket = io(server_url,
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
