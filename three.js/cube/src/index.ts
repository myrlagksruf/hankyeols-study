import * as THREE from 'three';
import { renderer, raycaster, mouse, rayarr, BOX, canvas, camera, scene } from './setup';
import { getFriends } from './fun';

const move = [0, 0];

const sel:{
    BoxGeometry:THREE.Mesh;
    mouse:{
        Box:THREE.Object3D;
    };
    start:number;
    color:{
        BoxGeometry:number;
    };
} = {
    BoxGeometry:null,
    mouse:{
        Box:null
    },
    start:0,
    color:{
        BoxGeometry:0
    }
};


// start = 0 : 평소
// start = 1 : 어느 방향인지 확인 부탁
// start = 2 : 움직이는데 마우스 는 안땜
// start = 3 : 움직이는데 마우스 는 땜

canvas.addEventListener('mousedown', e => {
    if(sel.BoxGeometry) {
        sel.mouse.Box = sel.BoxGeometry.parent;
        const name = sel.mouse.Box.name;
        console.log(BOX.getObjectByName(name).getWorldPosition(new THREE.Vector3(0, 0, 0)));
        sel.start = 1;
    }
});

canvas.addEventListener('mouseup', e => {
    if(sel.start === 2){
        sel.start = 3;
    } else {
        sel.start = 0;
    }
});

canvas.addEventListener('mousemove', e => {
    if(sel.start === 1){
        move[0] = 0;
        move[1] = 0;
        // findWhat(sel.msouse.Box.name, new THREE.Vector3(e.movementY, e.movementX, 0).normalize())
        sel.start = 2;
    } else if(sel.start === 2){
        
    } else {
        mouse.x = (e.clientX / innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / innerHeight) * 2 + 1;
        if(e.buttons % 2 === 1){
            move[0] += e.movementX;
            move[1] += e.movementY;
        }
    }
});


const loop = (time:number) => {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects( rayarr );
    if(sel.BoxGeometry) {
        (sel.BoxGeometry.material as THREE.MeshBasicMaterial).color.set(sel.color.BoxGeometry);
        sel.BoxGeometry = null;
        sel.color.BoxGeometry = 0;
    }

    BOX.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), move[0] / 1000);
    BOX.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), move[1] / 1000);
    move[0] *= 0.8;
    move[1] *= 0.8;

    let max = -100;

    for(let i of intersects){
        const cur = i.object as THREE.Mesh;
        const vec = cur.getWorldPosition(new THREE.Vector3(0, 0, 0)).z;
        if(max < vec){
            max = vec;
            sel.BoxGeometry = cur;
            sel.color.BoxGeometry = (cur.material as THREE.MeshBasicMaterial).color.getHex();
        }
    }
    if(sel.BoxGeometry)(sel.BoxGeometry.material as THREE.MeshBasicMaterial).color.set(0xffff00);
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

loop(0);