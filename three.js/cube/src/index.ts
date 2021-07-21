import * as THREE from 'three';

const canvas = document.querySelector('canvas');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(10, 10);
// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// CAMERA
const camera = new THREE.PerspectiveCamera(90, canvas.width / canvas.height, 0.1, 15);
const max = 5;
camera.position.z = max;
camera.lookAt(0, 0, 0);

const cubeGeo = new THREE.BoxGeometry(1, 1, 1);

const colors = [
    0xff0000,
    0x00ff00,
    0x0000ff
];

const BOX = new THREE.Object3D();

for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
        for(let k = 0; k < 3; k++){
            const cube = new THREE.Mesh(cubeGeo, new THREE.MeshBasicMaterial({color:colors[(i + j + k) % 3]}));
            cube.position.x = i - 1;
            cube.position.y = j - 1;
            cube.position.z = k - 1;
            BOX.add(cube);
        }
    }
}

console.log(BOX);

scene.add(BOX);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

// TEXTURE

scene.add(new THREE.AmbientLight(0xffffff, 1));

const move = [0, 0];

canvas.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / innerHeight) * 2 + 1;
    if(e.buttons % 2 === 1){
        move[0] = e.movementX;
        move[1] = e.movementY;
    }
});

let set:[THREE.Mesh, number][] = [];

const loop = (time:number) => {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects( BOX.children );

    for(let i of set){
        (i[0].material as THREE.MeshBasicMaterial).color.set(i[1]);
    }

    set = [];
    BOX.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), move[0] / 1000);
    BOX.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), move[1] / 1000);
    move[0] *= 0.99;
    move[1] *= 0.99;
    for(let i of intersects){
        const cur = i.object as THREE.Mesh;
        const material = cur.material as THREE.MeshBasicMaterial;
        set.push([cur, material.color.getHex()]);
        material.color.set(0xffff00);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

loop(0);