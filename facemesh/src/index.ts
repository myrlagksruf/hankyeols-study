import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-cpu';
import * as facemesh from '@tensorflow-models/facemesh';
import { Coords3D } from '@tensorflow-models/facemesh/dist/util';
import './index.css';
const $:typeof document.querySelector = document.querySelector.bind(document);
const $$:typeof document.querySelectorAll = document.querySelectorAll.bind(document);
const video = $('video');
const fanvas = $<HTMLCanvasElement>('#canvas-box');

const ftx = fanvas.getContext('2d');
let model:facemesh.FaceMesh = null;
const size = 2;
const ani = async () => {
    if(fanvas.width !== video.videoWidth || fanvas.height !== video.videoHeight){
        fanvas.width = video.videoWidth;
        fanvas.height = video.videoHeight;
    }
    if(model){
        const predictions = await model.estimateFaces(video);
        ftx.clearRect(0, 0, fanvas.width, fanvas.height);
        if (predictions.length > 0) {
            for (let i = 0; i < predictions.length; i++) {
                const keypoints = predictions[i].scaledMesh as Coords3D;

                // Log facial keypoints.
                for (let i = 0; i < keypoints.length; i++) {
                    const [x, y, z] = keypoints[i];
                    ftx.fillStyle = 'blue';
                    ftx.fillRect(x - size, y - size, size * 2, size * 2);
                }
            }
        }
    }
    requestAnimationFrame(ani);
};

const main = async () => {
    // Load the MediaPipe facemesh model.
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false, video: true
    });
    video.srcObject = stream;
    ani();
    model = await facemesh.load();
    
    // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain an
    // array of detected faces from the MediaPipe graph.
}
  
main();