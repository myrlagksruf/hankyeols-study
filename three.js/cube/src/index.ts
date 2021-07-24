import * as THREE from 'three';

const canvas = document.querySelector('canvas');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(10, 10);
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

const colors = [
    0xff0000,
    0x00ff00,
    0x0000ff
];

const way:[[number, number, number], [number, number, number]][] = [
    [[0, 0, 1], [0, 0, -1.5]],
    [[1, 0, 0], [0, -1.5, 0]],
    [[0, 1, 0], [-1.5, 0, 0]],
    [[0, 1, 0], [1.5, 0, 0]],
    [[1, 0, 0], [0, 1.5, 0]],
    [[0, 0, 1], [0, 0, 1.5]]
];

const BOX = new THREE.Object3D();

for(let i of way){
    const plane = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({color:0xff0000, opacity:0, transparent: true, side: THREE.DoubleSide}));
    plane.rotateOnWorldAxis(new THREE.Vector3(...i[0]), Math.PI / 2);
    plane.position.set(...i[1]);
    BOX.add(plane);
}


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

const sel:{
    BoxGeometry:THREE.Mesh;
    PlaneGeometry:THREE.Mesh
    mouse:THREE.Mesh;
    start:number;
    color:{
        BoxGeometry:number;
        PlaneGeometry:number;
    };
} = {
    BoxGeometry:null,
    PlaneGeometry:null,
    mouse:null,
    start:0,
    color:{
        BoxGeometry:0,
        PlaneGeometry:0
    }
};

// start = 0 : 평소
// start = 1 : 어느 방향인지 확인 부탁
// start = 2 : 움직이는데 마우스 는 안땜
// start = 3 : 움직이는데 마우스 는 땜

canvas.addEventListener('mousedown', e => {
    if(sel.BoxGeometry) {
        sel.mouse = sel.BoxGeometry;
        sel.start = 1;
    }
});

canvas.addEventListener('mouseup', e => {
    if(sel.start === 2){
        sel.start = 3;
    }
});

canvas.addEventListener('mousemove', e => {
    if(sel.start === 1){
        move[0] = 0;
        move[1] = 0;
        if(Math.abs(e.movementX) > Math.abs(e.movementY)){
            console.log(sel.mouse.getWorldPosition(new THREE.Vector3(0, 0, 0)));
            
        } else {

        }
        sel.start = 2;
    } else if(sel.start === 2){
        
    } else {
        mouse.x = (e.clientX / innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / innerHeight) * 2 + 1;
        if(e.buttons % 2 === 1){
            move[0] = e.movementX;
            move[1] = e.movementY;
        }
    }
});


const loop = (time:number) => {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects( BOX.children );
    
    if(sel.BoxGeometry) {
        (sel.BoxGeometry.material as THREE.MeshBasicMaterial).color.set(sel.color.BoxGeometry);
        sel.BoxGeometry = null;
        sel.color.BoxGeometry = 0;
    }

    BOX.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), move[0] / 1000);
    BOX.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), move[1] / 1000);
    move[0] *= 0.99;
    move[1] *= 0.99;
    const max = {
        BoxGeometry : -100,
        PlaneGeometry: -100
    };
    for(let i of intersects){
        const cur = i.object as THREE.Mesh;
        const vec = cur.getWorldPosition(new THREE.Vector3(0, 0, 0));
        const type = cur.geometry.type as keyof typeof max;
        if(max[type] < vec.z){
            max[type] = vec.z;
            sel[type] = cur;
            sel.color[type] = (cur.material as THREE.MeshBasicMaterial).color.getHex();
        }
    }
    if(sel.BoxGeometry)(sel.BoxGeometry.material as THREE.MeshBasicMaterial).color.set(0xffff00);
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

loop(0);