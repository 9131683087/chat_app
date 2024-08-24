import express from 'express';
import { Server } from 'socket.io';  // Correct import for socket.io
import http from 'http';
import router from './router.js';
const PORT = process.env.PORT || 5000;



const app = express();
const server = http.createServer(app);
const io = new Server(server);  // Use new Server syntax for socket.io v4+

app.use(router)

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));  // Use backticks for template literal
