import { Manager } from 'socket.io-client';
import './index.css';
const $:typeof document.querySelector = document.querySelector.bind(document);

const path = location.pathname.match(/\/proxy\/\d+/)?.[0] ?? '';

const origin = `${location.origin}${path}`;

console.log(path);


const manager = new Manager(origin, {
    path: `${path}/socket.io`
});

const socket = manager.socket(`/api`);

console.log(socket);

const canvas = $<HTMLCanvasElement>('#can');
const ctx = canvas.getContext('2d');
const keyMap = new Map([
    ['ArrowLeft', 0],
    ['ArrowRight', 0],
    ['ArrowUp', 0],
    ['ArrowDown', 0]
]);

const keyFun = (num:number) => (e:KeyboardEvent) => {
    if(keyMap.has(e.key)){
        keyMap.set(e.key, num);
    }
};

document.addEventListener('keyup', keyFun(0));
document.addEventListener('keydown', keyFun(1));
document.addEventListener('mousemove', e => {
    
});

const size = 20;
socket.emit('start', {
    x: Math.floor(Math.random() * (canvas.width - size * 2)) + size,
    y: Math.floor(Math.random() * (canvas.height - size * 2)) + size,
    color: `#${Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0')}`
});

let render:[{x:number, y:number}, string][] = null;

setInterval(() => {
    socket.emit('changekey', [...keyMap]);
});

socket.emit('render');

socket.on('render', (e:[{x:number, y:number}, string][]) => {
    render = e;
    socket.emit('render');
});

const main = () => {
    if(render){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let [pos, color] of render){
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
        render = null;
    }
    requestAnimationFrame(main);
};

main();

