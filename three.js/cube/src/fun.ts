import * as THREE from 'three';
import { BOX } from './setup';

const all = ['000', '001', '002', '010', '011', '012', '020', '021', '022',
'100', '101', '102', '110', '111', '112', '120', '121', '122',
'200', '201', '202', '210', '211', '212', '220', '221', '222']

export const getPlaneFriends = (name:string) => {
    const friends:[string, THREE.Vector3][] = [];
    const arr = ['00', '10', '20', '02', '12', '22'].filter(v => {
        if(v[0] !== name[0]) return true;
        else return false;
    });
    for(let i of arr){
        friends.push([i, BOX.getObjectByName(i).getWorldPosition(new THREE.Vector3(0, 0, 0)).normalize()]);
    }
    return friends;
};


export const rotateAnimationStart = (name:string, plane:string, frames:number = 90) => {
    let i = 0;

    const cubeNames = all.filter(v => v[Number(plane[0])] === name[Number(plane[0])]);
    const vec = BOX.getObjectByName(plane).position.normalize();
    const cubes:THREE.Object3D[] = []
    const to:THREE.Vector3[] = [];
    for(let i of cubeNames){
        const cube = BOX.getObjectByName(i);
        cubes.push(cube);
        const x = new THREE.Vector3(0, 0, 0).copy(cube.position);
        x.applyAxisAngle(vec, Math.PI / 2).round();
        to.push(x);
    }

    return () => {
        if(i === frames) {
            for(let j = 0; j < cubes.length; j++){
                // cubes[j].setRotationFromAxisAngle(new THREE.Vector3(0, 0, 0), 0);
                cubes[j].position.copy(to[j]);
                cubes[j].name = `${to[j].x + 1}${to[j].y + 1}${to[j].z + 1}`;
            }
            return true;
        }

        for(let j of cubes){
            j.position.applyAxisAngle(vec, Math.PI / (frames * 2));
            j.rotateOnWorldAxis(vec, Math.PI / (frames * 2));
        }
        i++;
        return false;
    }
}