import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import Char from './char';
const app = express();
const PORT = 4000;
const server = app.listen(PORT);

const io = new Server(server);

app.use('/dist', express.static(path.resolve(__dirname, '..', '..', 'front', 'dist')));

app.get('/', (req, res) => {
    res.redirect('/dist/index.html');
});

const render = () => {
    arr = [];
    for(let [_, j] of allUser){
        j.changePos();
        arr.push([j.pos, j.color]);
    }
};

let arr:[{x:number, y:number}, string][] = [];

const allUser = new Map<string, Char>();

setInterval(render);

io.of('/api').on('connection', socket => {
    console.log('연결');
    socket.on('start', (e:{x:number, y:number, color: string}) => {
        const cha = new Char(e);
        allUser.set(socket.id, cha);
    });
    socket.on('render', () => {
        socket.emit('render', arr);
    });
    socket.on('changekey', (e:[string, number][]) => {
        if(allUser.has(socket.id)){
            const cha = allUser.get(socket.id);
            cha.changeKey(e);
        } else {
            allUser.delete(socket.id);
        }
    });
    socket.on('disconnect', () => {
        allUser.delete(socket.id);
    });
});
