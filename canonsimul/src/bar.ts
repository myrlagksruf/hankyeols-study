import { canvas, ctx } from './docu.js';
export class Bar{
    x = 0;
    on = false;
    constructor(){}
    draw(){
        if(canvas.width < this.x){
            this.x = canvas.width;
        }
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, this.x, 20);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(1, 1, canvas.width - 2, 18);
    }
    inc(){
        this.on = true;
        this.x += 4;
    }
    clear(){
        this.on = false;
        const x = this.x;
        this.x = 0;
        return x;
    }
}