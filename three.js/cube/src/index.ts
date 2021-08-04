import * as THREE from 'three';
import { renderer, raycaster, mouse, rayarr, BOX, canvas, camera, scene, rayarr2 } from './setup';
import { getPlaneFriends, rotateAnimationStart } from './fun';

const move = [0, 0];
const moving = [0, 0];

const sel:{
    BoxGeometry:THREE.Mesh;
    PlaneGeometry?:THREE.Mesh;
    mouse:{
        Box:THREE.Object3D;
        Plane?:THREE.Mesh;
    };
    start:number;
    color:{
        BoxGeometry:number[];
        PlaneGeometry?:number
    },
    fun:(() => boolean)[]
} = {
    BoxGeometry:null,
    mouse:{
        Box:null
    },
    start:0,
    color:{
        BoxGeometry:[]
    },
    fun:[]
};


// start = 0 : 평소
// start = 1 : 어느 방향인지 확인 부탁
// start = 2 : 움직이는데 마우스 는 안땜
// start = 3 : 움직이는데 마우스 는 땜

canvas.addEventListener('mousedown', e => {
    if(sel.BoxGeometry && sel.PlaneGeometry && sel.start === 0) {
        sel.mouse.Box = sel.BoxGeometry.parent;
        sel.mouse.Plane = sel.PlaneGeometry;
        moving[0] = 0;
        moving[1] = 0;
        sel.start = 1;
    } else {
        canvas.requestPointerLock();
    }
});

canvas.addEventListener('mouseup', e => {
    if(sel.start === 2){
        sel.start = 3;
    } else {
        sel.start = 0;
    }
    document.exitPointerLock();
});

canvas.addEventListener('mousemove', e => {
    if(sel.start === 1){
        move[0] = 0;
        move[1] = 0;
        moving[0] += e.movementX;
        moving[1] += e.movementY;
        console.log(moving);
        if(moving[0] ** 2 + moving[1] ** 2 > 400){
            const name = sel.mouse.Box.name;
            const pname = sel.mouse.Plane.name;
            const vecs = getPlaneFriends(pname);

            let max = -100;
            let choose:string = null;
            for(let i of vecs){
                const num = i[1].x * moving[1] + i[1].y * moving[0];
                if(num > max) {
                    max = num;
                    choose = i[0];
                }
            }

            sel.fun.push(rotateAnimationStart(name, choose, 30))
            sel.start = 2;
        }
    } else if(sel.start !== 2) {
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

    const intersectsPlane = raycaster.intersectObjects(rayarr2);
    if(sel.BoxGeometry) {
        (sel.BoxGeometry.material as THREE.MeshBasicMaterial[]).forEach((v, i) => v.color.set(sel.color.BoxGeometry[i]));
        sel.BoxGeometry = null;
        sel.color.BoxGeometry = [];
    }

    BOX.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), move[0] / 1000);
    BOX.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), move[1] / 1000);
    move[0] *= 0.9;
    move[1] *= 0.9;

    let max = -100;

    for(let i of intersects){
        const cur = i.object as THREE.Mesh;
        const vec = cur.getWorldPosition(new THREE.Vector3(0, 0, 0)).z;
        if(max < vec){
            max = vec;
            sel.BoxGeometry = cur;
            sel.color.BoxGeometry = (cur.material as THREE.MeshBasicMaterial[]).map(v => v.color.getHex());
        }
    }

    sel.PlaneGeometry = (intersectsPlane[0]?.object as THREE.Mesh);

    if(sel.BoxGeometry)(sel.BoxGeometry.material as THREE.MeshBasicMaterial[]).forEach(v => v.color.set(0xffff00));

    if(sel.fun.length){
        if(sel.fun[0]()){
            sel.fun.shift();
            sel.start = 0;
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

loop(0);