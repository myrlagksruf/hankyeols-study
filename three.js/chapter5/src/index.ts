import * as THREE from 'three';

const canvas = document.querySelector('canvas');

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// CAMERA
const camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 1000);
camera.position.y = 2;
console.log(camera.worldToLocal(new THREE.Vector3(1, 1, 1)));

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

// TEXTURE
const textureLoader = new THREE.TextureLoader();

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const grassGeo = new THREE.PlaneGeometry(5, 5, 1);
const grassNormalMap = textureLoader.load("../img/grass_normal_map.png");
const grass = new THREE.MeshPhongMaterial({ color: 0x0a7d15, normalMap: grassNormalMap })
for (let i = -50; i <= 50; i += 5) {
    for (let j = -50; j <= 50; j += 5) {
        const plane = new THREE.Mesh(grassGeo, grass);
        plane.position.x = i;
        plane.position.z = j;
        plane.rotation.x = - Math.PI / 2
        scene.add(plane);
    }
}

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.x += 20
directionalLight.position.y += 20
directionalLight.position.z += 20
scene.add(directionalLight);

document.addEventListener('click', e => {
    document.body.requestPointerLock();
});

document.addEventListener('mousemove', e => {
    camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), e.movementX / 1000);
    console.log(camera.rotation);
    camera.rotateX(e.movementY / 1000);
    
})

const loop = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

loop();