const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const arr = [[4, 1], [4, 2], [4, 3], [3, 1], [3, 2], [3, 3], [2, 1], [2, 2]];
ctx.beginPath();
ctx.lineWidth = 2;
ctx.strokeStyle = 'black';
const x = 50;
const y = 30;
const w = 100;
for(let i = 0; i < 6; i++){
    for(let j = 0; j < 5; j++){
        if(!arr.some(v => v[0] === i && v[1] === j))
            ctx.strokeRect(i * w + x, j * w + y, w, w);
    }
}
ctx.fillStyle = 'black';
ctx.font = '60px consolas';
ctx.textBaseline = "middle";
ctx.textAlign = 'right';
ctx.fillText('A', x - 10, y + w * 5);

ctx.textAlign = 'left';
ctx.fillText('B', w * 6 + x + 10, y);
