import { Canon } from './canon.js';
import { Bar } from './bar.js';
import { canvas, ctx, div } from './docu.js';

const me = new Canon(true);

const bar = new Bar()

const keyMap = new Map([
    ['ArrowLeft', 0],
    ['ArrowRight', 0],
    ['ArrowUp', 0],
    ['ArrowDown', 0],
    [' ', 0],
    ['Enter', 0]
]);

const keyFun = (val:number) => (e:KeyboardEvent) => {
    if(keyMap.has(e.key)){
        keyMap.set(e.key, val);
    }
}

document.addEventListener('keydown', keyFun(1));
document.addEventListener('keyup', keyFun(0));

const main = (time:number) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    me.theta += keyMap.get('ArrowUp') - keyMap.get('ArrowDown');
    if(keyMap.get(' ')){
        bar.inc();
    } else if(bar.on) {
        me.fire(bar.clear() / 100, time);
    }
    if(keyMap.get('Enter')){
        keyMap.set('Enter', 0);
        Canon.wall *= -1;
    }
    bar.draw();
    me.draw(ctx, time);
    requestAnimationFrame(main);
};

main(0);