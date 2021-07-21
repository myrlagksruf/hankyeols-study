import * as THREE from 'three';
import { MeshBasicMaterial } from 'three';

(async()=>{
    const canvas = document.querySelector('canvas');
    const render = new THREE.WebGLRenderer({canvas});

    const camera = new THREE.PerspectiveCamera(90, 1920 / 1080, 0.1, 20);
    camera.position.z = 40;

    const scene = new THREE.Scene();

    const loader = new THREE.TextureLoader();

    // const boxgeo = new THREE.BoxGeometry(1, 1, 1);
    // const maters:THREE.Material[] = [];
    // const arr = [[0, 0], [2 / 3, 0.5], [2 / 3, 0], [0, 0.5], [1 / 3, 0.5], [1 / 3, 0]];
    // for(let i of arr){
    //     const img = loader.load('../Dice.png');
    //     img.offset = new THREE.Vector2(i[0], i[1]);
    //     img.repeat.x = 1 / 3;
    //     img.repeat.y = 0.5;
    //     maters.push(new MeshBasicMaterial({
    //         map:img
    //     }));
    // }

    // const cube = new THREE.Mesh(boxgeo, maters);

    // scene.add(cube);

    const spgeo = new THREE.SphereBufferGeometry(30, 32, 16);
    const map = loader.load('../eye.jfif');
    map.needsUpdate = true;

    // modify UVs to accommodate MatCap texture
    const uvs = spgeo.getAttribute('uv') as THREE.Float32BufferAttribute;
	// for (let i = 0; i < faceVertexUvs.length; i ++ ) {
	// 	let uvs = faceVertexUvs[ i ];
	// 	let face = spgeo.faces[ i ];
        
	// 	for (let j = 0; j < 3; j ++ ) {

	// 		uvs[ j ].x = face.vertexNormals[ j ].x * 0.5 + 0.5;
	// 		uvs[ j ].y = face.vertexNormals[ j ].y * 0.5 + 0.5;

	// 	}

	// }

    const mater = new THREE.MeshBasicMaterial({ map });

    const sp = new THREE.Mesh(spgeo, mater);

    scene.add(sp);

    const loop = (time:number) => {
        // sp.rotation.x = (time / 1000);
        sp.rotation.y = (time / 1000);
        render.render(scene, camera);
        requestAnimationFrame(loop);
    };
    loop(0);
})();