import express from 'express';
import { Server, Socket } from 'socket.io';
import path from 'path';

const app = express();

app.use('/dist', express.static(path.resolve(__dirname, '..', '..', 'front', 'dist')));

app.get('/', (req, res) => {
    res.redirect('/dist/index.html');
});

const server = app.listen(4000);

const io = new Server(server);

let one:Socket = null;

let other:Socket = null;


io.of('/api').on('connection', socket => {
    console.log('연결');

    const fun = (str:string) => (e:any) => {
        console.log(e);
        if(one === socket){
            other.emit(str, e);
        } else if(other === socket){
            one.emit(str, e);
        }
    };

    if(!one){
        one = socket;
    } else if(!other){
        other = socket;
        one.emit('start');
    }

    socket.on('cand', fun('cand'));

    socket.on('desc', fun('desc'));

    socket.on('disconnect', e => {
        if(one === socket || other === socket){
            one?.emit?.('dis');
            other?.emit?.('dis');
            one = null;
            other = null;
        }
    });
});