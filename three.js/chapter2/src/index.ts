import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);

const axes = new THREE.AxesHelper(20);
scene.add(axes);

const planeGeometry = new THREE.PlaneGeometry(60, 20);
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xAAAAAA
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(15, 0, 0);
scene.add(plane);

// create a cube
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xFF0000,
    wireframe: true
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-4, 3, 0);
scene.add(cube);

// create a sphere
const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x7777FF,
    wireframe: true
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(20, 4, 2);
scene.add(sphere);

// position and point the camera to the center of the scene
camera.position.set(-30, 40, 30);
camera.lookAt(scene.position);

// add the output of the renderer to the html element
document.querySelector("#webgl-output").appendChild(renderer.domElement);

// render the scene
renderer.render(scene, camera);

const main = (time:number) => {
    sphere.position.set(10 * Math.cos(time / 1000), 5, 10 * Math.sin(time / 1000));
    renderer.render(scene, camera);
    requestAnimationFrame(main);
}

main(0);