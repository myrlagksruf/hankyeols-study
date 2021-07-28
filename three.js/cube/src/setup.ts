import * as THREE from 'three';

const canvas = document.querySelector('canvas');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(10, 10);
const rayarr:THREE.Mesh[] = [];
const rayarr2:THREE.Mesh[] = [];

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// CAMERA
const camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 15);
const max = 5;
camera.position.z = max;
camera.lookAt(0, 0, 0);

const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
const planeGeo = new THREE.PlaneGeometry(3, 3);
const boxEdge = new THREE.BoxGeometry(1, 1, 1);
const edge = new THREE.EdgesGeometry( boxEdge );

const colors = [
    0xff0000,
    0x00ff00,
    0x0000ff
];

const way:[[number, number, number], [number, number, number], string][] = [
    [[0, 0, 1], [0, 0, -1.5], '20'],
    [[1, 0, 0], [0, -1.5, 0], '10'],
    [[0, 1, 0], [-1.5, 0, 0], '00'],
    [[0, 1, 0], [1.5, 0, 0], '02'],
    [[1, 0, 0], [0, 1.5, 0], '12'],
    [[0, 0, 1], [0, 0, 1.5], '22']
];

const BOX = new THREE.Object3D();

for(let i of way){
    const plane = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ opacity:0, transparent: true, side: THREE.DoubleSide}));
    plane.rotateOnWorldAxis(new THREE.Vector3(...i[0]), Math.PI / 2);
    plane.name = i[2];
    plane.position.set(...i[1]);
    rayarr2.push(plane);
    BOX.add(plane);
}

for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
        for(let k = 0; k < 3; k++){
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
    canvas, renderer, raycaster, mouse, rayarr, BOX, camera, scene, rayarr2
};