import http from 'http';
import RequestController from './controllers/requestController.js';
import { Server as IOServer } from 'socket.io';
import IOController from './controllers/ioController.js';

const server = http.createServer(
    (request, response) => new RequestController(request, response).handleRequest()
);

const io = new IOServer(server);

const ioController = new IOController(io);
io.on('connection', ioController.registerSocket.bind(ioController) );


server.listen(8080);

