import { canvas } from './docu.js';
import { Ball } from './ball.js';
export class Canon{
    #balls = new Set<Ball>();
    #theta = 0;
    #me = true;
    static wall:1|-1 = -1;
    static preCanon = 50 as const;
    static nexCanon = 150 as const;
    #map = new Map([
        [true, {cir:'red', squ:'cyan', x:0, st:0, ed:-Math.PI / 2}],
        [false, {cir:'blue', squ:'yellow', x:canvas.width, st:-Math.PI / 2, ed:-Math.PI}]
    ])
    constructor(isMe:boolean = true){
        this.#theta = 45;
        this.#me = isMe;
    }
    get theta(){
        return this.#theta;
    }
    set theta(v){
        if(v < 0 || v > 90 || typeof v !== 'number'){
            return;
        } else {
            this.#theta = v;
            return;
        }
    }
    getLine(r:number):[number, number]{
        const obj = this.#map.get(this.#me);
        return [obj.x + r * Math.cos(this.theta * Math.PI / 180), canvas.height - r * Math.sin(this.theta * Math.PI / 180)];
    }
    fire(v:number, time:number){
        this.#balls.add(new Ball({
            x: Canon.nexCanon * Math.cos(this.theta * Math.PI / 180),
            y: canvas.height - Canon.nexCanon * Math.sin(this.theta * Math.PI / 180),
            v, theta: this.#theta, time
        }));
    }
    draw(ctx:CanvasRenderingContext2D, time:number){
        const obj = this.#map.get(this.#me);
        ctx.strokeStyle = obj.squ;
        ctx.lineWidth = 20;
        ctx.lineCap = 'butt';
        ctx.fillStyle = obj.cir;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.arc(obj.x, canvas.height, 100, obj.st, obj.ed, true);
        ctx.closePath();
        ctx.fill();

        const deleteList:Ball[] = [];

        for(let i of this.#balls){
            i.next(time, Canon.wall);
            if(i.x + Ball.size < 0 ||
            i.x - Ball.size > canvas.width ||
            i.y + Ball.size < 0 ||
            i.y - Ball.size > canvas.height){
                deleteList.push(i);
            }
            i.draw(ctx);
        }

        for(let i of deleteList) this.#balls.delete(i);

        ctx.beginPath();
        ctx.moveTo(...this.getLine(Canon.preCanon));
        ctx.lineTo(...this.getLine(Canon.nexCanon));
        ctx.stroke();
    }
}