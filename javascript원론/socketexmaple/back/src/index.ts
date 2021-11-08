import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const front = path.resolve(__dirname, '..', '..', 'front');
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use('/front', express.static(front));

app.get('/', (req, res) => {
    res.redirect('/front/dist/index.html');
});

io.on('connection', socket => {
    socket.on('message', e => {
        socket.emit('message', {message:'hi', success:true, server: true});
    });
});

server.listen(4000);