import * as THREE from 'three';

export class SpaceScene {
    constructor(camera, controls) {
        this.scene = new THREE.Scene();
        this.camera = camera;
        this.controls = controls;
        this.clock = new THREE.Clock();
        this.planets = [];
        this.stars = [];
        
        this.setupScene();
    }

    getConfig() {
        return {
            camera: {
                position: { x: 0, y: 30, z: 80 },
                lookAt: { x: 0, y: 0, z: 0 }
            },
            controls: {
                minDistance: 30,
                maxDistance: 150,
                maxPolarAngle: Math.PI
            }
        };
    }

    setupScene() {
        // Set black background
        this.scene.background = new THREE.Color(0x000000);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        // Add directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(0, 0, 0);
        this.scene.add(sunLight);

        // Add point light at sun's position
        const pointLight = new THREE.PointLight(0xffffff, 2);
        pointLight.position.set(0, 0, 0);
        this.scene.add(pointLight);

        // Create stars with varying sizes and colors
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true
        });

        const starVertices = [];
        const starColors = [];
        const radius = 1000;

        for (let i = 0; i < 20000; i++) {
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            const distance = Math.random() * radius;

            const x = distance * Math.sin(phi) * Math.cos(theta);
            const y = distance * Math.sin(phi) * Math.sin(theta);
            const z = distance * Math.cos(phi);

            starVertices.push(x, y, z);

            // Random star color (white to blue-ish)
            const r = Math.random() * 0.3 + 0.7;
            const g = Math.random() * 0.3 + 0.7;
            const b = Math.random() * 0.2 + 0.8;
            starColors.push(r, g, b);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
        this.stars = stars;

        // Create sun
        const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
        const sunMaterial = new THREE.MeshPhongMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 1,
            shininess: 0
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(sun);

        // Create sun glow
        const sunGlowGeometry = new THREE.SphereGeometry(6, 32, 32);
        const sunGlowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(1.0, 0.8, 0.0, intensity * (0.8 + 0.2 * sin(time * 2.0)));
                }
            `,
            transparent: true,
            side: THREE.BackSide
        });
        const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
        this.sunGlow = sunGlow;
        this.scene.add(sunGlow);

        // Create planets
        this.createPlanets();
    }

    createPlanets() {
        const planetConfigs = [
            {
                name: 'Mercury',
                color: 0x8c8c8c,  // Grey-brown cratered surface
                size: 1.5,  // Scaled up for visibility
                distance: 20,
                speed: 0.48,  // Fastest orbit
                hasRings: false,
                tilt: 0.034,
                texture: {
                    roughness: 0.9,  // Very rough, cratered surface
                    metalness: 0.2
                },
                orbitColor: 0x666666
            },
            {
                name: 'Venus',
                color: 0xffd700,  // Yellow-white thick atmosphere
                size: 2,
                distance: 30,
                speed: 0.35,
                hasRings: false,
                tilt: 177.4,
                texture: {
                    roughness: 0.3,  // Smooth due to thick atmosphere
                    metalness: 0.1
                },
                orbitColor: 0x888888
            },
            {
                name: 'Earth',
                color: 0x4169e1,  // Blue oceans with green/brown landmasses
                size: 2,
                distance: 40,
                speed: 0.3,
                hasRings: false,
                tilt: 23.5,
                texture: {
                    roughness: 0.5,
                    metalness: 0.1
                },
                orbitColor: 0x4169e1
            },
            {
                name: 'Mars',
                color: 0xff4500,  // Red-orange with darker features
                size: 1.8,
                distance: 50,
                speed: 0.24,
                hasRings: false,
                tilt: 25.2,
                texture: {
                    roughness: 0.8,  // Very rough, dusty surface
                    metalness: 0.1
                },
                orbitColor: 0xff4500
            },
            {
                name: 'Jupiter',
                color: 0xffa500,  // Orange with distinct bands
                size: 5,  // Much larger than terrestrial planets
                distance: 70,
                speed: 0.13,
                hasRings: true,
                tilt: 3.1,
                texture: {
                    roughness: 0.4,
                    metalness: 0.2
                },
                bands: true,  // Jupiter's distinctive bands
                orbitColor: 0xffa500
            },
            {
                name: 'Saturn',
                color: 0xffd700,  // Golden-yellow with prominent rings
                size: 4.5,
                distance: 90,
                speed: 0.097,
                hasRings: true,
                ringSize: 2.5,  // Very prominent rings
                ringColor: 0xc8a780,
                tilt: 26.7,
                texture: {
                    roughness: 0.4,
                    metalness: 0.3
                },
                orbitColor: 0xffd700
            },
            {
                name: 'Uranus',
                color: 0x40e0d0,  // Cyan-blue
                size: 3,
                distance: 110,
                speed: 0.068,
                hasRings: true,
                ringSize: 1.8,
                tilt: 97.8,  // Almost perpendicular
                texture: {
                    roughness: 0.5,
                    metalness: 0.2
                },
                orbitColor: 0x40e0d0
            },
            {
                name: 'Neptune',
                color: 0x4169e1,  // Deep blue with visible storms
                size: 3,
                distance: 130,
                speed: 0.054,
                hasRings: true,
                ringSize: 1.5,
                tilt: 28.3,
                texture: {
                    roughness: 0.5,
                    metalness: 0.2
                },
                orbitColor: 0x4169e1
            }
        ];

        planetConfigs.forEach(config => {
            // Create planet
            const planetGeometry = new THREE.SphereGeometry(config.size, 64, 64);  // Higher resolution
            const planetMaterial = new THREE.MeshStandardMaterial({
                color: config.color,
                roughness: config.texture.roughness,
                metalness: config.texture.metalness
            });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            
            // Add bands for gas giants
            if (config.bands) {
                const bandGeometry = new THREE.RingGeometry(config.size * 0.8, config.size, 64);
                const bandMaterial = new THREE.MeshPhongMaterial({
                    color: new THREE.Color(config.color).multiplyScalar(0.8),
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.3
                });
                for (let i = 0; i < 5; i++) {
                    const band = new THREE.Mesh(bandGeometry, bandMaterial);
                    band.rotation.x = Math.PI / 2;
                    band.position.y = (i - 2) * config.size * 0.2;
                    planet.add(band);
                }
            }

            // Add rings if specified
            if (config.hasRings) {
                const ringSize = config.ringSize || 1.8;
                // Create multiple ring layers for more detail
                for (let i = 0; i < 3; i++) {
                    const innerRadius = config.size * (ringSize + i * 0.1);
                    const outerRadius = config.size * (ringSize + 0.2 + i * 0.1);
                    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
                    const ringMaterial = new THREE.MeshPhongMaterial({
                        color: config.ringColor || config.color,
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.3 - i * 0.1,
                        emissive: new THREE.Color(config.ringColor || config.color).multiplyScalar(0.1)
                    });
                    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                    rings.rotation.x = Math.PI / 2;
                    planet.add(rings);
                }
            }

            // Apply planet tilt
            planet.rotation.z = THREE.MathUtils.degToRad(config.tilt);

            // Set initial position and store orbit data
            planet.position.x = config.distance;
            planet.userData = {
                name: config.name,
                orbitRadius: config.distance,
                orbitSpeed: config.speed,
                rotationSpeed: 0.02 / (config.distance / 20)
            };

            this.planets.push(planet);
            this.scene.add(planet);

            // Add orbit line
            const orbitGeometry = new THREE.BufferGeometry();
            const orbitPoints = [];
            const segments = 128;
            
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                orbitPoints.push(
                    Math.cos(theta) * config.distance,
                    0,
                    Math.sin(theta) * config.distance
                );
            }
            
            orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
            
            const orbitMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.15,
                linewidth: 1
            });
            
            const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            this.scene.add(orbit);
        });
    }

    update() {
        const time = this.clock.getElapsedTime();

        // Update sun glow
        if (this.sunGlow) {
            this.sunGlow.material.uniforms.time.value = time;
        }

        // Rotate stars slowly
        if (this.stars) {
            this.stars.rotation.y = time * 0.02;
        }

        // Update planet rotations
        this.planets.forEach((planet) => {
            const { orbitRadius, orbitSpeed, rotationSpeed } = planet.userData;
            
            planet.position.x = Math.cos(time * orbitSpeed) * orbitRadius;
            planet.position.z = Math.sin(time * orbitSpeed) * orbitRadius;
            planet.rotation.y += rotationSpeed;

            if (planet.ring) {
                planet.ring.position.copy(planet.position);
                planet.ring.rotation.z = Math.PI / 3;
            }
        });
    }

    activate() {
        // Any activation logic
    }

    deactivate() {
        // Any cleanup logic
    }
}
