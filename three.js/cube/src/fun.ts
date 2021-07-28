import * as THREE from 'three';
import { BOX } from './setup';

export const getFriends = (name:string) => {
    const friends:[string, THREE.Vector3][] = [];
    for(let i = 0; i < 3; i++){
        for(let j = -1; j < 2; j += 2){
            const arr = name.split('');
            const val = Number(arr[i]) + j;
            arr[i] = String(val);
            if(val >= 0 && val <= 2 && !arr.every(v => v === '1')){
                const name = arr.join('');
                friends.push([name, BOX.getObjectByName(name).getWorldPosition(new THREE.Vector3(0, 0, 0))]);
            }
        }
    }
    return friends;
};