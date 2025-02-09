import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Create renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Create sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create planets
const planets = [];
const planetColors = [0x888888, 0xff8800, 0x0000ff, 0xff0000];
const planetSizes = [1, 2, 2.5, 1.5];
const planetDistances = [10, 15, 20, 25];
const planetSpeeds = [0.02, 0.015, 0.01, 0.005];

for (let i = 0; i < 4; i++) {
    const geometry = new THREE.SphereGeometry(planetSizes[i], 32, 32);
    const material = new THREE.MeshStandardMaterial({ 
        color: planetColors[i],
        metalness: 0.7,
        roughness: 0.5
    });
    const planet = new THREE.Mesh(geometry, material);
    
    planet.position.x = planetDistances[i];
    planet.userData = { 
        angle: Math.random() * Math.PI * 2,
        speed: planetSpeeds[i],
        distance: planetDistances[i]
    };
    
    planets.push(planet);
    scene.add(planet);
}

// Add stars
function addStar() {
    const geometry = new THREE.SphereGeometry(0.1, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
}

Array(400).fill().forEach(addStar);

// Add lights
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Add controls
const controls = new OrbitControls(camera, renderer.domElement);

// Animation
function animate() {
    requestAnimationFrame(animate);

    // Rotate planets around the sun
    planets.forEach(planet => {
        planet.userData.angle += planet.userData.speed;
        planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
        planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
        planet.rotation.y += 0.01;
    });

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
