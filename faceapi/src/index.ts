import * as faceapi from 'face-api.js';
import './index.css';
const $:typeof document.querySelector = document.querySelector.bind(document);
const $$:typeof document.querySelectorAll = document.querySelectorAll.bind(document);
const res = $('#res');
const video = $('video');
const canvas = $<HTMLCanvasElement>('#canvas-video');
const faceCanvas = $<HTMLCanvasElement>('#canvas-box');
const button = $('button');
const ctx = canvas.getContext('2d');
const faceCtx = faceCanvas.getContext('2d');

const event = async () => {
    try{
        const result = await faceapi.detectAllFaces(canvas);
        res.innerHTML = String(result);
    } catch(err){
        res.innerHTML = err;
    }
    
};

const ani = async () => {
    if(canvas.width !== video.videoWidth || canvas.height !== video.videoHeight){
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        faceCanvas.width = video.videoWidth;
        faceCanvas.height = video.videoHeight;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    if(canvas.width > 0 || canvas.height > 0){
        const dec = await faceapi.detectAllFaces(canvas).withFaceLandmarks();
        if(dec.length) {
            faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
            const re = faceapi.resizeResults(dec, {
                width:canvas.width,
                height:canvas.height
            });
            re.forEach(v => {
                const box = v.detection.box;
                faceCtx.beginPath();
                faceCtx.strokeStyle = 'blue';
                faceCtx.lineWidth = 5;
                faceCtx.rect(box.x, box.y, box.width, box.height);
                faceCtx.stroke();
            });
        } else {
            faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
        }
    }
    requestAnimationFrame(ani);
    
};

(async()=>{
    try{
        await Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('../models'),
        ])
    } catch(err){
        console.error(err);
    }
    
    // const a = tf.tensor([[1,2],[3,4]]);
    // const b = await tf.matMul(a, tf.transpose(a)).array();
    // res.innerHTML = String(b);
    try{
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false, video: true
        });
        video.srcObject = stream;
        ani();
    } catch(err){
        res.innerHTML = err.message;
    }
})();

button.addEventListener('click', event);