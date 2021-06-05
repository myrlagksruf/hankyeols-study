export default class Char{
    static speed = 0.2;
    keyMap = new Map([
        ['ArrowLeft', 0],
        ['ArrowRight', 0],
        ['ArrowUp', 0],
        ['ArrowDown', 0]
    ]);
    pos = {
        x:0,
        y:0
    };
    color = '#ffffff';
    date = Date.now();
    constructor(pos:{x:number, y:number, color:string}){
        this.pos.x = pos.x;
        this.pos.y = pos.y;
        this.color = pos.color;
    }
    changeKey(keys:[string, number][]){
        for(let [i, j] of keys){
            if(this.keyMap.has(i)){
                this.keyMap.set(i, j);
            }
        }
    }
    changePos(){
        const date = Date.now();
        const d = date - this.date;
        this.date = date;
        this.pos.x += (this.keyMap.get('ArrowRight') - this.keyMap.get('ArrowLeft')) * d * Char.speed;
        this.pos.y += (this.keyMap.get('ArrowDown') - this.keyMap.get('ArrowUp')) * d * Char.speed;
    }
}