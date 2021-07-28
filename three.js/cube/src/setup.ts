import * as THREE from 'three';

const canvas = document.querySelector('canvas');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(10, 10);
const rayarr:THREE.Mesh[] = [];

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// CAMERA
const camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 15);
const max = 5;
camera.position.z = max;
camera.lookAt(0, 0, 0);

const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
const boxEdge = new THREE.BoxGeometry(1, 1, 1);
const edge = new THREE.EdgesGeometry( boxEdge );

const colors = [
    0xff0000,
    0x00ff00,
    0x0000ff
];

const BOX = new THREE.Object3D();

for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
        for(let k = 0; k < 3; k++){
            if(i === 1 && j === 1 && k === 1) continue;
            const cube = new THREE.Object3D();
            const cubeColor = new THREE.Mesh(cubeGeo, new THREE.MeshBasicMaterial({color:colors[(i + j + k) % 3]}));

            const edgeLine = new THREE.LineSegments( edge, new THREE.LineBasicMaterial( { color: 0x000000 }));

            cube.add(cubeColor);
            cube.add(edgeLine);
            cube.name = `${i}${j}${k}`;
            cube.position.set(i - 1, j - 1, k - 1);
            rayarr.push(cubeColor);
            BOX.add(cube);
        }
    }
}


scene.add(BOX);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

export {
    canvas, renderer, raycaster, mouse, rayarr, BOX, camera, scene
};