import 'bootstrap/dist/css/bootstrap.min.css';
import { io } from 'socket.io-client';

const button = document.querySelector('button');
console.log(io);
const socket = io('http://172.23.45.184:4000');


socket.on('message', e => {
    console.log(e);
});

button.addEventListener('click', e => {
    socket.emit('message', {message:'hi', success:true});
});