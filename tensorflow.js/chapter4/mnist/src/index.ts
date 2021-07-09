import Mnist from './data';
import cv from "@techstark/opencv-js";
const acc = document.querySelector<HTMLDivElement>('#acc');
const epo = document.querySelector<HTMLDivElement>('#epo');
const butCon = document.querySelector<HTMLDivElement>('#but-con');
const save = document.querySelector<HTMLButtonElement>('#save');
const train = document.querySelector<HTMLButtonElement>('#train');
const reset = document.querySelector<HTMLButtonElement>('#reset');
const predict = document.querySelector<HTMLButtonElement>('#predict');
const canvas = document.querySelector('canvas');
const resultDiv = document.querySelector<HTMLDivElement>('#result-div');
const ctx = canvas.getContext('2d');

type imgsize = [number, number, number, number];

(async()=>{
    await Mnist.ready();
    await Mnist.load('../sample/mnist.json');
    butCon.classList.add('load');
    const style = getComputedStyle(canvas);
    const wid = parseFloat(style.width);
    const hei = parseFloat(style.height);
    document.addEventListener('mousedown', e => {
        ctx.beginPath();
        const x = e.offsetX * canvas.width / wid;
        const y = e.offsetY * canvas.height / hei;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.moveTo(x, y);
    });
    document.addEventListener('mouseup', e => ctx.closePath());
    document.addEventListener('mousemove', e => {
        const isMouseDown = e.buttons % 2;
        if(isMouseDown === 1 && e.target === canvas){
            const x = e.offsetX * canvas.width / wid;
            const y = e.offsetY * canvas.height / hei;
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    });
})();


butCon.addEventListener('click', e => {
    const tar = e.target as HTMLButtonElement|HTMLDivElement;
    if(tar === butCon || !butCon.classList.contains('load') || tar.classList.contains('loading')){
        e.stopPropagation();
    } else {
        tar.classList.add('loading');
    }
}, {capture:true});

train.addEventListener('click', async e => {
    await Mnist.train(acc, epo);
    train.classList.remove('loading');
}, {capture:true});

save.addEventListener('click', async e => {
    await Mnist.model.save('downloads://mnist');
    save.classList.remove('loading');
}, {capture:true});

predict.addEventListener('click', async e => {
    resultDiv.innerHTML = '';
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const arr:number[][] = [];
    const findPixel = (y:number, x:number):imgsize => {
        let minx = canvas.width;
        let maxx = 0;
        let miny = canvas.height;
        let maxy = 0;
        const way = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        const find = (ys:number, xs:number) => {
            for(let i of way) {
                const Y = ys + i[0];
                const X = xs + i[1];
                if(arr?.[Y]?.[X] === 1){
                    arr[Y][X] = 2;
                    if(Y > maxy) maxy = Y;
                    if(Y < miny) miny = Y;
                    if(X > maxx) maxx = X;
                    if(X < minx) minx = X;
                    find(Y, X);
                }
            }
        }
        find(y, x);
        return [minx, miny, maxx, maxy];
    };

    const makeCanvas = (arr:imgsize, i = 0) => {
        let w = arr[2] - arr[0];
        let h = arr[3] - arr[1];
        const data = ctx.getImageData(arr[0], arr[1], w, h);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 560;
        tempCanvas.height = 560;
        const tempCtx = tempCanvas.getContext('2d');
        let X = (tempCanvas.width - w) / 2;
        let Y = (tempCanvas.height - h) / 2;
        tempCtx.putImageData(data, X, Y);
        if(h > w){
            X -= (h - w) / 2;
            w += (h - w);
        } else {
            Y -= (w - h) / 2;
            h += (w - h);
        }
        const d = Math.floor(w / 10);
        const resultData = tempCtx.getImageData(X - d, Y - d, w + 2 * d, h + 2 * d);
        const src = cv.matFromImageData(resultData);
        const size = new cv.Size(28, 28);
        const dist = new cv.Mat();
        cv.resize(src, dist, size, 0, 0, cv.INTER_AREA);
        // cv.threshold(dist, dist, 1, 255, cv.THRESH_BINARY);
        const div = document.createElement('div');
        const resultCanvas = document.createElement('canvas');
        resultCanvas.width = 28;
        resultCanvas.height = 28;
        cv.imshow(resultCanvas, dist);
        const resultCtx = resultCanvas.getContext('2d');
        const rawData = resultCtx.getImageData(0, 0, resultCanvas.width, resultCanvas.height);
        for(let j = 0; j < rawData.data.length / 4; j++){
            floatArr[i * 28 * 28 + j] = rawData.data[j * 4 + 3] / 255;
        }
        div.appendChild(resultCanvas);
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('span'));
        resultDiv.appendChild(div);
    };

    for(let y = 0; y < canvas.height; y++){
        arr[y] = [];
        for(let x = 0; x < canvas.width; x++){
            if(imgData.data[(y * canvas.width + x) * 4 + 3]){
                arr[y][x] = 1;
            } else {
                arr[y][x] = 0;
            }
        }
    }
    const obj:imgsize[] = [];
    for(let y = 0; y < canvas.height; y++){
        for(let x = 0; x < canvas.width; x++){
            if(arr[y][x] === 1) {
                obj.push(findPixel(y, x));
            }
        }
    }
    const SIZE = obj.length * 28 * 28;
    const floatArr = new Float32Array(SIZE);
    for(let i = 0; i < obj.length; i++){
        makeCanvas(obj[i], i);
    }
    const resultArr = await Mnist.predict(floatArr);
    for(let i = 0; i < resultArr.length; i++){
        const innerArr = resultArr[i];
        let max= [0, 0];
        for(let j = 0; j < innerArr.length; j++){
            if(innerArr[j] > max[0]){
                max[0] = innerArr[j];
                max[1] = j;
            }
        }
        document.querySelector(`#result-div > div:nth-child(${i + 1}) > span`).innerHTML = String(max[1]);
    }
    predict.classList.remove('loading');
}, {capture:true});

reset.addEventListener('click', e => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    reset.classList.remove('loading');
}, {capture:true});