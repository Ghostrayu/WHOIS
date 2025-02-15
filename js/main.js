import * as THREE from 'three';
import { SceneManager } from './sceneManager.js';
import { SpaceScene } from './scenes/spaceScene.js';
import { EarthScene } from './scenes/earthScene.js';

// Initialize renderer
const canvas = document.getElementById('bg');
if (!canvas) {
    console.error('Could not find canvas element with id "bg"');
    throw new Error('Canvas element not found');
}

const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    canvas: canvas
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Initialize scene manager
const sceneManager = new SceneManager(renderer);

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    renderer.setSize(width, height);
    sceneManager.camera.aspect = width / height;
    sceneManager.camera.updateProjectionMatrix();
}, false);

// Add scenes
sceneManager.addScene('earth', EarthScene);
sceneManager.addScene('space', SpaceScene);

// Set initial scene
sceneManager.setActiveScene('space');

// Create scene controls
const controls = document.createElement('div');
controls.style.position = 'fixed';
controls.style.top = '20px';
controls.style.right = '20px';
controls.style.zIndex = '1000';
controls.style.display = 'flex';
controls.style.gap = '10px';

const sceneButtons = new Map();
const scenes = ['earth', 'space'];

// Auto transition variables
let currentSceneIndex = 1; // Start with space (index 1)
const transitionInterval = 6000; // 6 seconds
let autoTransitionEnabled = true;

// Function to handle scene transitions
function transitionToNextScene() {
    if (!autoTransitionEnabled) return;
    
    currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
    const nextScene = scenes[currentSceneIndex];
    sceneManager.setActiveScene(nextScene);
    
    // Update button states
    sceneButtons.forEach((button, sceneId) => {
        button.style.backgroundColor = sceneId === nextScene ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)';
        button.style.color = sceneId === nextScene ? 'black' : 'white';
        button.style.border = sceneId === nextScene ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.3)';
    });
}

// Start auto transition
setInterval(transitionToNextScene, transitionInterval);

scenes.forEach(sceneId => {
    const button = document.createElement('button');
    button.textContent = sceneId.charAt(0).toUpperCase() + sceneId.slice(1);
    button.style.padding = '10px 20px';
    button.style.backgroundColor = sceneId === 'space' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.7)';
    button.style.color = 'white';
    button.style.border = '1px solid rgba(255, 255, 255, 0.3)';
    button.style.cursor = 'pointer';
    button.style.fontFamily = 'Arial, sans-serif';
    button.style.fontSize = '14px';
    button.style.transition = 'all 0.3s ease';
    
    button.addEventListener('mouseover', () => {
        if (sceneId !== sceneManager.activeSceneId) {
            button.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            button.style.border = '1px solid rgba(255, 255, 255, 0.6)';
        }
    });
    
    button.addEventListener('mouseout', () => {
        if (sceneId !== sceneManager.activeSceneId) {
            button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            button.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        }
    });
    
    button.addEventListener('click', () => {
        // Disable auto transition when user manually switches scenes
        autoTransitionEnabled = false;
        
        sceneManager.setActiveScene(sceneId);
        currentSceneIndex = scenes.indexOf(sceneId);
        
        sceneButtons.forEach((btn, id) => {
            btn.style.backgroundColor = id === sceneId ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)';
            btn.style.color = id === sceneId ? 'black' : 'white';
            btn.style.border = id === sceneId ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.3)';
        });
    });

    sceneButtons.set(sceneId, button);
    controls.appendChild(button);
});

document.body.appendChild(controls);

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Create mobile menu button
        const menuButton = document.createElement('button');
        menuButton.id = 'menuButton';
        menuButton.className = 'menu-button';
        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            menuButton.appendChild(span);
        }
        document.body.appendChild(menuButton);

        const autobiography = document.getElementById('autobiography');

        // Add event listeners
        menuButton.addEventListener('click', () => {
            menuButton.classList.toggle('active');
            autobiography.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!autobiography.contains(e.target) && 
                !menuButton.contains(e.target) && 
                autobiography.classList.contains('active')) {
                menuButton.classList.remove('active');
                autobiography.classList.remove('active');
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            sceneManager.handleResize();
            
            // Show autobiography if window is resized to desktop size
            if (window.innerWidth > 768) {
                autobiography.classList.remove('active');
                menuButton.classList.remove('active');
            }
        });
    } catch (error) {
        console.error('Error initializing mobile menu:', error);
    }
});

// Make scene manager globally accessible
window.sceneManager = sceneManager;
