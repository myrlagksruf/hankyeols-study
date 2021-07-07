import * as THREE from 'three';
const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
const render = new THREE.WebGLRenderer({ canvas });

const fov = 95;
const aspect = 1920 / 1080;
const near = 0.1;
const far = 15;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.z = 2;

const scene = new THREE.Scene();

const box = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const mesh = new THREE.Mesh(box, material);

// mesh.rotateX(1);

scene.add(mesh);

const color = 0xFFFFFF;
const intensity = 2;

const light = new THREE.DirectionalLight(color, intensity);
light.position.set(4, 4, 4);
scene.add(light);

render.render(scene, camera);

const loop = (time:number) => {
    const vec = new THREE.Vector3(1, 1, 1);
    mesh.rotateOnWorldAxis(vec, 0.01);
    render.render(scene, camera);
    requestAnimationFrame(loop);
};

loop(0);