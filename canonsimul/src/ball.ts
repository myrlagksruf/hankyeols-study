import { canvas } from './docu.js';

export class Ball{
    x = 0;
    y = 0;
    vx = 0;
    vy = 0;
    time = 0;
    total = 0;
    color = '';
    static g = 0.005;
    static size = 20;
    static tan = 1;
    constructor(obj:{x:number, y:number, v:number, theta:number, time:number}){
        const { x, y, v, theta, time } = obj;
        this.x = x;
        this.y = y; 
        this.vx = v * Math.cos(theta * Math.PI / 180);
        this.vy = v * Math.sin(theta * Math.PI / 180);
        this.total = (canvas.height - y) * Ball.g + this.vy * this.vy * 0.5;
        this.time = time;
        this.color = `#${(Math.floor(Math.random() * 256 ** 3).toString(16).padStart(6, '0'))}`;
    }
    next(time:number, wall:-1|1){
        const dt = time - this.time;
        this.time = time;
        this.vy -= Ball.g * dt;
        this.x += this.vx * dt;
        this.y -= this.vy * dt;
        if(wall === 1){
            if(this.x - Ball.size < 0){
                this.x = 2 * Ball.size - this.x;
                this.vx *= -Ball.tan;
            } else if(this.x + Ball.size > canvas.width){
                this.x = 2 * canvas.width - 2 * Ball.size - this.x;
                this.vx *= -Ball.tan;
            }
    
            if(this.y - Ball.size < 0){
                // this.y = 2 * Ball.size - this.y;
                this.y = Ball.size;
                this.vy = -Math.sqrt(2 * (this.total - (canvas.height - Ball.size) * Ball.g));
            } else if(this.y + Ball.size > canvas.height){
                // this.y = 2 * canvas.height - 2 * Ball.size - this.y;
                this.y = canvas.height - Ball.size;
                this.vy = Math.sqrt(2 * (this.total - Ball.size * Ball.g));
            }
        }
    }
    draw(ctx:CanvasRenderingContext2D){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, Ball.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}