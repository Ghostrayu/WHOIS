import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(50, 30, 50);

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Add orbit controls with constraints
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Distance constraints
controls.minDistance = 15;
controls.maxDistance = 100;

// Rotation constraints
controls.minPolarAngle = Math.PI * 0.1;
controls.maxPolarAngle = Math.PI * 0.9;

// Make movement smoother
controls.enableZoom = true;
controls.zoomSpeed = 0.7;
controls.rotateSpeed = 0.7;

// Prevent user from rolling the camera
controls.enableRotate = true;
controls.enablePan = false;

controls.update();

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

// Add point light at sun position
const sunLight = new THREE.PointLight(0xffffff, 3, 1000);
scene.add(sunLight);

// Add hemisphere light for better overall illumination
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(hemisphereLight);

// Create sun
const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffff00,
    transparent: true,
    opacity: 0.9
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet data
const planetData = [
    { size: 0.4, color: 0xdddddd, distance: 8 },   // Mercury
    { size: 0.6, color: 0xffcc88, distance: 12 },  // Venus
    { size: 0.7, color: 0x4444ff, distance: 16 },  // Earth
    { size: 0.5, color: 0xff4444, distance: 20 },  // Mars
    { size: 2.0, color: 0xffaa44, distance: 28 },  // Jupiter
    { size: 1.6, color: 0xffdd88, distance: 36 },  // Saturn
    { size: 1.2, color: 0x88ffff, distance: 44 },  // Uranus
    { size: 1.1, color: 0x4488ff, distance: 52 }   // Neptune
];

// Create planets
const planets = planetData.map(data => {
    const geometry = new THREE.SphereGeometry(data.size, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        color: data.color,
        metalness: 0.3,
        roughness: 0.7
    });
    const planet = new THREE.Mesh(geometry, material);
    
    // Position planet
    planet.position.x = data.distance;
    
    // Create orbit
    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 128);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    
    return planet;
});

planets.forEach(planet => scene.add(planet));

// Add stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1
});

const closestStarVertices = [];
for (let i = 0; i < 100; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    closestStarVertices.push(x, y, z);
}

starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(closestStarVertices, 3)
);

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Animation
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate planets
    planets.forEach((planet, index) => {
        const speed = 0.002 / (index + 1);
        const angle = Date.now() * speed;
        const distance = planetData[index].distance;
        
        planet.position.x = Math.cos(angle) * distance;
        planet.position.z = Math.sin(angle) * distance;
        planet.rotation.y += 0.01;
    });
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
