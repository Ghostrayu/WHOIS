import * as THREE from 'three';

export class EarthScene {
    constructor(camera, controls) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x88cc88);
        this.scene.fog = new THREE.Fog(0x88cc88, 20, 60);
        this.camera = camera;
        this.controls = controls;
        this.trees = [];
        this.grassPatches = [];
        this.butterflies = [];
        this.clock = new THREE.Clock();

        this.setupScene();
    }

    getConfig() {
        return {
            camera: {
                position: { x: 0, y: 20, z: 30 },  
                lookAt: { x: 0, y: 10, z: 0 }  
            },
            controls: {
                minDistance: 15,  
                maxDistance: 50,
                maxPolarAngle: Math.PI / 2.5,  
                minPolarAngle: 0,
                enableDamping: true,
                dampingFactor: 0.05,
                minAzimuthAngle: -Infinity,  
                maxAzimuthAngle: Infinity,
                target: new THREE.Vector3(0, 10, 0)  
            }
        };
    }

    setupScene() {
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Add directional light
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        this.scene.add(dirLight);

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x33aa33,
            shininess: 0
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);

        // Add lake
        const lakeGeometry = new THREE.CircleGeometry(12, 32);
        const lakeMaterial = new THREE.MeshPhongMaterial({
            color: 0x4444ff,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        const lake = new THREE.Mesh(lakeGeometry, lakeMaterial);
        lake.rotation.x = -Math.PI / 2;
        lake.position.set(0, 0.1, 0);
        this.scene.add(lake);

        // Add houses
        this.addHouses();

        // Add UFO
        this.ufo = this.createUFO();
        this.ufo.position.set(0, 8, -15); // Center between houses, slightly above them
        this.scene.add(this.ufo);

        // Add rowboat
        this.addRowboat();

        // Add trees
        this.addTrees();

        // Add grass patches
        this.addGrassPatches();

        // Add butterflies
        this.addButterflies();

        // Add click interaction for UFO
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObject(this.ufo, true);

            if (intersects.length > 0) {
                const ufoData = this.ufo.userData;
                ufoData.isBouncing = true;
                ufoData.bounceStartTime = this.clock.getElapsedTime();
                ufoData.bounceHeight = 5; // Height of bounce
            }
        });
    }

    addRowboat() {
        const boat = this.createRowboat();
        this.scene.add(boat);
    }

    createRowboat() {
        const boat = new THREE.Group();

        // Enhanced wood material with texture-like effect
        const woodMaterial = new THREE.MeshPhongMaterial({
            color: 0x4a3527,
            shininess: 30,
            flatShading: true
        });

        // Darker wood for details
        const darkWoodMaterial = new THREE.MeshPhongMaterial({
            color: 0x2a1f1a,
            shininess: 20,
            flatShading: true
        });

        // Metal material for fittings
        const metalMaterial = new THREE.MeshPhongMaterial({
            color: 0x7a7a7a,
            shininess: 80,
            flatShading: false
        });

        // Main hull - more detailed shape
        const hullShape = new THREE.Shape();
        hullShape.moveTo(-1, -2);
        hullShape.lineTo(1, -2);
        hullShape.lineTo(0.8, 2);
        hullShape.lineTo(-0.8, 2);
        hullShape.lineTo(-1, -2);

        const extrudeSettings = {
            steps: 1,
            depth: 0.6,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 3
        };

        const hullGeometry = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
        const hull = new THREE.Mesh(hullGeometry, woodMaterial);
        hull.rotation.x = Math.PI / 2;
        hull.position.y = 0.3;
        boat.add(hull);

        // Side panels with curved top
        const sideGeometry = new THREE.BoxGeometry(0.1, 0.8, 4);
        const leftSide = new THREE.Mesh(sideGeometry, woodMaterial);
        leftSide.position.set(-0.95, 0.3, 0);
        boat.add(leftSide);

        const rightSide = new THREE.Mesh(sideGeometry, woodMaterial);
        rightSide.position.set(0.95, 0.3, 0);
        boat.add(rightSide);

        // Decorative trim along the sides
        const trimGeometry = new THREE.BoxGeometry(0.05, 0.1, 4);
        const leftTrim = new THREE.Mesh(trimGeometry, darkWoodMaterial);
        leftTrim.position.set(-1, 0.6, 0);
        boat.add(leftTrim);

        const rightTrim = new THREE.Mesh(trimGeometry, darkWoodMaterial);
        rightTrim.position.set(1, 0.6, 0);
        boat.add(rightTrim);

        // Three bench seats with more detail
        const benchGeometry = new THREE.BoxGeometry(1.8, 0.1, 0.4);
        const benchLegGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
        
        // Front bench
        const frontBench = new THREE.Mesh(benchGeometry, darkWoodMaterial);
        frontBench.position.set(0, 0.4, -1.2);
        boat.add(frontBench);
        
        // Front bench legs
        const frontLegLeft = new THREE.Mesh(benchLegGeometry, darkWoodMaterial);
        frontLegLeft.position.set(-0.8, 0.25, -1.2);
        boat.add(frontLegLeft);
        
        const frontLegRight = new THREE.Mesh(benchLegGeometry, darkWoodMaterial);
        frontLegRight.position.set(0.8, 0.25, -1.2);
        boat.add(frontLegRight);

        // Middle bench
        const middleBench = new THREE.Mesh(benchGeometry, darkWoodMaterial);
        middleBench.position.set(0, 0.4, 0);
        boat.add(middleBench);
        
        // Middle bench legs
        const middleLegLeft = new THREE.Mesh(benchLegGeometry, darkWoodMaterial);
        middleLegLeft.position.set(-0.8, 0.25, 0);
        boat.add(middleLegLeft);
        
        const middleLegRight = new THREE.Mesh(benchLegGeometry, darkWoodMaterial);
        middleLegRight.position.set(0.8, 0.25, 0);
        boat.add(middleLegRight);

        // Back bench
        const backBench = new THREE.Mesh(benchGeometry, darkWoodMaterial);
        backBench.position.set(0, 0.4, 1.2);
        boat.add(backBench);
        
        // Back bench legs
        const backLegLeft = new THREE.Mesh(benchLegGeometry, darkWoodMaterial);
        backLegLeft.position.set(-0.8, 0.25, 1.2);
        boat.add(backLegLeft);
        
        const backLegRight = new THREE.Mesh(benchLegGeometry, darkWoodMaterial);
        backLegRight.position.set(0.8, 0.25, 1.2);
        boat.add(backLegRight);

        // Enhanced oars with more detail
        const createOar = (side) => {
            const oarGroup = new THREE.Group();

            // Handle
            const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
            const handle = new THREE.Mesh(handleGeometry, darkWoodMaterial);
            handle.rotation.z = Math.PI / 2;
            oarGroup.add(handle);

            // Shaft
            const shaftGeometry = new THREE.CylinderGeometry(0.03, 0.03, 2, 8);
            const shaft = new THREE.Mesh(shaftGeometry, woodMaterial);
            shaft.position.set(1, 0, 0);
            shaft.rotation.z = Math.PI / 2;
            oarGroup.add(shaft);

            // Blade
            const bladeGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.2);
            const blade = new THREE.Mesh(bladeGeometry, woodMaterial);
            blade.position.set(2, 0, 0);
            oarGroup.add(blade);

            // Oar lock (metal fitting)
            const lockGeometry = new THREE.TorusGeometry(0.1, 0.02, 8, 8);
            const lock = new THREE.Mesh(lockGeometry, metalMaterial);
            lock.position.set(side * 0.95, 0.7, 0);
            boat.add(lock);

            return oarGroup;
        };

        // Add oars
        const leftOar = createOar(-1);
        leftOar.position.set(-0.95, 0.7, 0);
        leftOar.rotation.y = Math.PI / 4;
        boat.add(leftOar);

        const rightOar = createOar(1);
        rightOar.position.set(0.95, 0.7, 0);
        rightOar.rotation.y = -Math.PI / 4;
        boat.add(rightOar);

        // Add bow and stern decorative pieces
        const bowGeometry = new THREE.ConeGeometry(0.2, 0.4, 4);
        const bow = new THREE.Mesh(bowGeometry, darkWoodMaterial);
        bow.rotation.x = -Math.PI / 2;
        bow.position.set(0, 0.3, -2);
        boat.add(bow);

        const stern = new THREE.Mesh(bowGeometry, darkWoodMaterial);
        stern.rotation.x = Math.PI / 2;
        stern.position.set(0, 0.3, 2);
        boat.add(stern);

        // Position the boat on the lake
        boat.position.set(5, 0, 0);
        boat.rotation.y = Math.PI / 4;

        return boat;
    }

    addHouses() {
        const addHouse = (position, rotation) => {
            const house = new THREE.Group();

            // House body
            const bodyGeometry = new THREE.BoxGeometry(6, 5, 4);
            const bodyMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xE8DCC4,
                shininess: 30 
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 2.5;
            house.add(body);

            // Roof
            const roofGeometry = new THREE.ConeGeometry(4.5, 3, 4);
            const roofMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x8B4513,
                shininess: 30 
            });
            const roof = new THREE.Mesh(roofGeometry, roofMaterial);
            roof.position.y = 6.5;
            roof.rotation.y = Math.PI / 4;
            house.add(roof);

            // Door
            const doorGeometry = new THREE.PlaneGeometry(1.2, 2);
            const doorMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x8B4513,
                side: THREE.DoubleSide 
            });
            const door = new THREE.Mesh(doorGeometry, doorMaterial);
            door.position.set(0, 1.5, 2.01);
            house.add(door);

            // Windows
            const windowGeometry = new THREE.PlaneGeometry(1, 1);
            const windowMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xADD8E6,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide 
            });

            // Front windows
            [-1.5, 1.5].forEach(x => {
                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                window.position.set(x, 3, 2.01);
                house.add(window);
            });

            // Side windows
            [-2.01, 2.01].forEach(x => {
                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                window.position.set(x, 3, 0);
                window.rotation.y = Math.PI / 2;
                house.add(window);
            });

            // Chimney
            const chimneyGeometry = new THREE.BoxGeometry(0.6, 2, 0.6);
            const chimney = new THREE.Mesh(chimneyGeometry, bodyMaterial);
            chimney.position.set(1.5, 7, 0);
            house.add(chimney);

            // Position and rotate the house
            house.position.set(...position);
            house.rotation.y = rotation;
            this.scene.add(house);
        };

        // Add two houses
        addHouse([-15, 0, -15], Math.PI / 6);
        addHouse([15, 0, -15], -Math.PI / 6);
    }

    createTree() {
        const tree = new THREE.Group();

        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 4);
        const trunkMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8B4513,
            shininess: 5
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;

        // Leaves (multiple layers for fuller look)
        const createLeafLayer = (y, scale) => {
            const leavesGeometry = new THREE.ConeGeometry(1.5 * scale, 3 * scale, 8);
            const leavesMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x228B22,
                shininess: 10
            });
            const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
            leaves.position.y = y;
            return leaves;
        };

        tree.add(trunk);
        tree.add(createLeafLayer(4.5, 1));
        tree.add(createLeafLayer(3.5, 0.8));
        tree.add(createLeafLayer(2.5, 0.6));

        return tree;
    }

    createGrassPatch() {
        const grassGeometry = new THREE.PlaneGeometry(0.4, 1.5);
        const grassMaterial = new THREE.MeshPhongMaterial({ 
            color: new THREE.Color(0x33aa33).offsetHSL(0, 0, (Math.random() - 0.5) * 0.2),
            side: THREE.DoubleSide,
            transparent: true
        });
        const grass = new THREE.Mesh(grassGeometry, grassMaterial);
        
        return grass;
    }

    createButterfly() {
        const butterfly = new THREE.Group();
        
        // Wings
        const wingGeometry = new THREE.CircleGeometry(0.5, 32, 0, Math.PI);
        const wingMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        
        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.x = -0.25;
        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.x = 0.25;
        rightWing.rotation.y = Math.PI;
        
        butterfly.add(leftWing);
        butterfly.add(rightWing);
        
        return butterfly;
    }

    createUFO() {
        const ufoGroup = new THREE.Group();

        // Create the main saucer body
        const bodyGeometry = new THREE.SphereGeometry(2, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.3);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x444444,
            shininess: 100,
            emissive: 0x222222
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.scale.y = 0.5;
        ufoGroup.add(body);

        // Add rim details
        const rimGeometry = new THREE.TorusGeometry(2, 0.2, 16, 32);
        const rimMaterial = new THREE.MeshPhongMaterial({
            color: 0x666666,
            shininess: 100
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.x = Math.PI / 2;
        ufoGroup.add(rim);

        // Add panel details around the rim
        const panelCount = 12;
        for (let i = 0; i < panelCount; i++) {
            const angle = (i / panelCount) * Math.PI * 2;
            const panelGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.2);
            const panelMaterial = new THREE.MeshPhongMaterial({
                color: 0x333333,
                shininess: 80
            });
            const panel = new THREE.Mesh(panelGeometry, panelMaterial);
            panel.position.set(
                Math.cos(angle) * 2,
                0,
                Math.sin(angle) * 2
            );
            panel.rotation.y = angle;
            ufoGroup.add(panel);
        }

        // Create the dome with internal details
        const domeGroup = new THREE.Group();
        
        // Outer dome
        const domeGeometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const domeMaterial = new THREE.MeshPhongMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.6,
            shininess: 100
        });
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        domeGroup.add(dome);

        // Inner dome structure
        const innerDomeGeometry = new THREE.SphereGeometry(0.8, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const innerDomeMaterial = new THREE.MeshPhongMaterial({
            color: 0x444444,
            shininess: 100,
            wireframe: true
        });
        const innerDome = new THREE.Mesh(innerDomeGeometry, innerDomeMaterial);
        domeGroup.add(innerDome);

        // Add mysterious floating core
        const coreGeometry = new THREE.OctahedronGeometry(0.3);
        const coreMaterial = new THREE.MeshPhongMaterial({
            color: 0xff8800,
            emissive: 0xff4400,
            emissiveIntensity: 0.5,
            shininess: 100
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.y = 0.3;
        domeGroup.add(core);

        domeGroup.position.y = 0.5;
        ufoGroup.add(domeGroup);

        // Add running lights
        const lightCount = 8;
        for (let i = 0; i < lightCount; i++) {
            const angle = (i / lightCount) * Math.PI * 2;
            const light = new THREE.PointLight(0x00ffff, 1, 5);
            light.position.set(
                Math.cos(angle) * 1.8,
                0,
                Math.sin(angle) * 1.8
            );
            ufoGroup.add(light);

            // Add visible light sphere with glow
            const lightSphereGeometry = new THREE.SphereGeometry(0.15, 8, 8);
            const lightSphereMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.8
            });
            const lightSphere = new THREE.Mesh(lightSphereGeometry, lightSphereMaterial);
            lightSphere.position.copy(light.position);
            ufoGroup.add(lightSphere);

            // Add glow ring around each light
            const glowGeometry = new THREE.RingGeometry(0.2, 0.3, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            });
            const glowRing = new THREE.Mesh(glowGeometry, glowMaterial);
            glowRing.position.copy(light.position);
            glowRing.lookAt(new THREE.Vector3(0, 0, 0));
            ufoGroup.add(glowRing);
        }

        // Add spotlight beneath
        const spotLight = new THREE.SpotLight(0x88ccff, 2, 50, Math.PI / 6, 0.5, 1);
        spotLight.position.set(0, -0.5, 0);
        spotLight.target.position.set(0, -10, 0);
        ufoGroup.add(spotLight);
        ufoGroup.add(spotLight.target);

        // Add movement and rotation properties
        ufoGroup.userData = {
            time: 0,
            baseHeight: 8,
            heightRange: 2,       // Increased bounce height
            rotationSpeedY: 0.03, // Single axis rotation
            bounceSpeed: 0.003,   // Speed of bouncing
            hoverRadius: 1,       // Reduced hover radius for more stable position
            hoverSpeed: 0.0005,
            isBouncing: false,
            bounceStartTime: 0,
            bounceDuration: 1.0
        };

        return ufoGroup;
    }

    addGrassPatches() {
        // Add grass patches avoiding lake
        this.grassPatches = [];
        for (let i = 0; i < 1000; i++) {
            let x, z;
            do {
                x = Math.random() * 180 - 90;
                z = Math.random() * 180 - 90;
            } while (Math.sqrt(x * x + z * z) < 15); // Keep away from lake

            const grassGeometry = new THREE.PlaneGeometry(0.4, 1.5);
            const grassMaterial = new THREE.MeshPhongMaterial({ 
                color: new THREE.Color(0x33aa33).offsetHSL(0, 0, (Math.random() - 0.5) * 0.2),
                side: THREE.DoubleSide,
                transparent: true
            });
            const grass = new THREE.Mesh(grassGeometry, grassMaterial);
            grass.position.set(x, 0.75, z);
            grass.initialRotation = Math.random() * Math.PI;
            grass.rotation.y = grass.initialRotation;
            grass.swaySpeed = Math.random() * 2 + 1;
            grass.swayOffset = Math.random() * Math.PI * 2;
            grass.swayAmount = Math.random() * 0.3 + 0.1; // Random sway amount
            
            this.grassPatches.push(grass);
            this.scene.add(grass);
        }
    }

    addTrees() {
        // Add trees avoiding lake, houses, and rocks
        this.trees = [];
        const treePositions = [];
        const housePositions = [
            { x: -15, z: -15, radius: 8 },  // Left house
            { x: 15, z: -15, radius: 8 }    // Right house
        ];
        
        // Helper function to check if position is valid
        const isValidPosition = (x, z, radius) => {
            // Check lake distance (15 units radius)
            if (Math.sqrt(x * x + z * z) < 15) return false;
            
            // Check house distances
            for (const house of housePositions) {
                const dx = x - house.x;
                const dz = z - house.z;
                if (Math.sqrt(dx * dx + dz * dz) < house.radius) return false;
            }
            
            // Check other trees
            for (const pos of treePositions) {
                const dx = x - pos.x;
                const dz = z - pos.z;
                if (Math.sqrt(dx * dx + dz * dz) < 4) return false;  // Minimum 4 units between trees
            }
            
            return true;
        };

        // Try to place 80 trees
        const maxAttempts = 1000;
        let attempts = 0;
        while (treePositions.length < 80 && attempts < maxAttempts) {
            attempts++;
            
            // Generate position in a larger area
            const x = Math.random() * 180 - 90;
            const z = Math.random() * 180 - 90;
            
            if (isValidPosition(x, z)) {
                treePositions.push({ x, z });
                const tree = this.createTree();
                tree.position.set(x, 0, z);
                tree.rotation.y = Math.random() * Math.PI * 2;
                tree.swaySpeed = Math.random() * 0.5 + 0.5; // Random sway speed
                tree.swayAmount = Math.random() * 0.05 + 0.02; // Random sway amount
                
                // Randomize tree scale slightly
                const scale = 0.8 + Math.random() * 0.4;  // Scale between 0.8 and 1.2
                tree.scale.set(scale, scale, scale);
                
                this.trees.push(tree);
                this.scene.add(tree);
            }
        }
    }

    addButterflies() {
        // Add butterflies
        this.butterflies = [];
        for (let i = 0; i < 30; i++) {
            const butterfly = this.createButterfly();
            const radius = Math.random() * 30 + 10;
            const angle = Math.random() * Math.PI * 2;
            const height = Math.random() * 10 + 5;
            
            butterfly.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            butterfly.speed = Math.random() * 0.5 + 0.5;
            butterfly.radius = radius;
            butterfly.angle = angle;
            butterfly.height = height;
            butterfly.verticalSpeed = Math.random() * 2 + 1;
            butterfly.verticalOffset = Math.random() * Math.PI * 2;
            
            this.butterflies.push(butterfly);
            this.scene.add(butterfly);
        }
    }

    update() {
        const time = this.clock.getElapsedTime();
        
        // Update UFO animation
        if (this.ufo) {
            const ufoData = this.ufo.userData;
            
            // Simple Y-axis rotation only
            this.ufo.rotation.y += ufoData.rotationSpeedY;

            // Handle special bounce animation when clicked
            if (ufoData.isBouncing) {
                const bounceTime = time - ufoData.bounceStartTime;
                if (bounceTime <= ufoData.bounceDuration) {
                    // Create a more dramatic bounce using sine
                    const bounceProgress = bounceTime / ufoData.bounceDuration;
                    const bounceHeight = ufoData.bounceHeight * Math.sin(bounceProgress * Math.PI);
                    this.ufo.position.y = ufoData.baseHeight + bounceHeight;
                } else {
                    // Reset bounce state
                    ufoData.isBouncing = false;
                }
            } else {
                // Regular hovering motion
                this.ufo.position.y = ufoData.baseHeight + 
                    Math.sin(time * ufoData.bounceSpeed) * ufoData.heightRange;
            }

            // Minimal horizontal movement
            const hoverAngle = time * ufoData.hoverSpeed;
            this.ufo.position.x = Math.cos(hoverAngle) * ufoData.hoverRadius;
            this.ufo.position.z = -15 + Math.sin(hoverAngle) * (ufoData.hoverRadius * 0.5);

            // Update light intensities during bounce
            this.ufo.children.forEach(child => {
                if (child.isPointLight) {
                    child.intensity = ufoData.isBouncing ? 2 : 1;
                } else if (child.material && child.material.transparent) {
                    child.material.opacity = ufoData.isBouncing ? 0.6 : 0.4;
                }
            });

            // Update spotlight
            const spotLight = this.ufo.children.find(child => child.isSpotLight);
            if (spotLight) {
                spotLight.target.position.y = this.ufo.position.y - 10;
                spotLight.intensity = ufoData.isBouncing ? 3 : 2;
            }
        }
        
        // Update grass sway with more natural movement
        this.grassPatches.forEach(grass => {
            const swayX = Math.sin(time * grass.swaySpeed + grass.swayOffset);
            const swayZ = Math.cos(time * grass.swaySpeed * 0.7 + grass.swayOffset);
            grass.rotation.x = swayX * 0.1; // Slight forward/backward sway
            grass.rotation.y = grass.initialRotation + swayZ * grass.swayAmount; // Side-to-side sway
            grass.rotation.z = swayX * 0.05; // Slight twist
        });
        
        // Update butterfly movement
        this.butterflies.forEach(butterfly => {
            butterfly.angle += 0.02;
            const verticalMovement = Math.sin(time * 2) * 0.5;
            
            butterfly.position.x = Math.cos(butterfly.angle) * butterfly.radius;
            butterfly.position.y = butterfly.height + verticalMovement;
            butterfly.position.z = Math.sin(butterfly.angle) * butterfly.radius;
            
            // Wing flapping
            if (butterfly.children && butterfly.children.length >= 2) {
                butterfly.children[0].rotation.z = Math.sin(time * 15) * 0.5;
                butterfly.children[1].rotation.z = -Math.sin(time * 15) * 0.5;
            }
            
            butterfly.rotation.y = butterfly.angle + Math.PI / 2;
        });

        // Update tree sway with more natural movement
        this.trees.forEach(tree => {
            if (tree && tree.rotation) {
                const swayX = Math.sin(time * tree.swaySpeed + tree.position.x * 0.1);
                const swayZ = Math.cos(time * tree.swaySpeed * 0.7 + tree.position.z * 0.1);
                tree.rotation.x = swayX * tree.swayAmount * 0.5; // Slight forward/backward sway
                tree.rotation.z = swayZ * tree.swayAmount; // Main side-to-side sway
                
                // Also sway branches if they exist
                if (tree.children) {
                    tree.children.forEach((branch, index) => {
                        if (index > 0 && branch.rotation) { // Skip trunk (index 0)
                            branch.rotation.x = swayX * tree.swayAmount * 0.7 * index;
                            branch.rotation.z = swayZ * tree.swayAmount * 1.2 * index;
                        }
                    });
                }
            }
        });
    }

    dispose() {
        // Remove event listeners
        window.removeEventListener('click', this.onUFOClick);
        
        // Dispose of geometries and materials
        this.scene.traverse(object => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });

        // Clear arrays
        this.trees = [];
        this.grassPatches = [];
        this.butterflies = [];
        
        // Clear scene
        while(this.scene.children.length > 0) { 
            this.scene.remove(this.scene.children[0]); 
        }
    }
}
