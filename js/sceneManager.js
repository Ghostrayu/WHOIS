import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class SceneManager {
    constructor(renderer) {
        this.scenes = new Map();
        this.activeScene = null;
        this.activeSceneName = null;
        this.clock = new THREE.Clock();

        // Setup renderer
        this.renderer = renderer;
        if (!this.renderer) {
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);
        }

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 30, 80);
        this.camera.lookAt(0, 0, 0);

        // Setup controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 30;
        this.controls.maxDistance = 150;

        // Bind methods
        this.animate = this.animate.bind(this);

        // Start animation loop
        this.animate();
    }

    addScene(name, SceneClass) {
        try {
            const scene = new SceneClass(this.camera, this.controls);
            this.scenes.set(name, scene);
        } catch (error) {
            console.error(`Failed to add scene ${name}:`, error);
            throw error;
        }
    }

    setActiveScene(name) {
        try {
            const scene = this.scenes.get(name);
            if (!scene) {
                throw new Error(`Scene '${name}' not found`);
            }

            // Deactivate current scene if exists
            if (this.activeScene && this.activeScene.deactivate) {
                this.activeScene.deactivate();
            }

            // Update camera and controls based on new scene's config
            if (scene.getConfig) {
                const config = scene.getConfig();
                if (config.camera) {
                    this.camera.position.copy(config.camera.position);
                    if (config.camera.lookAt) {
                        this.camera.lookAt(new THREE.Vector3(
                            config.camera.lookAt.x,
                            config.camera.lookAt.y,
                            config.camera.lookAt.z
                        ));
                    }
                }
                if (config.controls) {
                    Object.assign(this.controls, config.controls);
                }
            }

            // Activate new scene
            this.activeScene = scene;
            this.activeSceneName = name;
            if (scene.activate) {
                scene.activate();
            }

            // Reset controls target
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        } catch (error) {
            console.error(`Failed to set active scene to ${name}:`, error);
            throw error;
        }
    }

    onWindowResize() {
        try {
            if (!this.camera || !this.renderer) return;

            const width = window.innerWidth;
            const height = window.innerHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        } catch (error) {
            console.error('Error handling window resize:', error);
        }
    }

    animate() {
        requestAnimationFrame(this.animate);

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Render active scene
        if (this.activeScene && this.renderer) {
            // Update scene if it has an update method
            if (this.activeScene.update) {
                this.activeScene.update(this.clock ? this.clock.getElapsedTime() : 0);
            }

            // Only render if we have a valid scene object
            if (this.activeScene.scene instanceof THREE.Scene) {
                this.renderer.render(this.activeScene.scene, this.camera);
            }
        }
    }

    dispose() {
        try {
            // Remove event listener
            window.removeEventListener('resize', this.onWindowResize);

            // Dispose active scene
            if (this.activeScene && typeof this.activeScene.deactivate === 'function') {
                this.activeScene.deactivate();
            }

            // Clear scenes
            this.scenes.clear();
            this.activeScene = null;
            this.activeSceneName = null;

            // Dispose controls
            if (this.controls) {
                this.controls.dispose();
            }

            // Dispose renderer
            if (this.renderer) {
                this.renderer.dispose();
            }
        } catch (error) {
            console.error('Error disposing SceneManager:', error);
        }
    }
}
