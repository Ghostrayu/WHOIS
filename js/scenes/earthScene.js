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
        this.leaves = [];
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
        // Ground with animated grass
        const groundGeometry = new THREE.PlaneGeometry(200, 200, 1, 1);
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

        // Add rowboat
        this.addRowboat();

        // Add houses
        this.addHouses();

        // Add rocks along the river
        for (let i = 0; i < 20; i++) {
            const rockGeometry = new THREE.DodecahedronGeometry(Math.random() * 1 + 0.5);
            const rockMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x808080,
                shininess: 0
            });
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            
            // Keep rocks away from lake
            let x, z;
            do {
                x = Math.random() * 180 - 90;
                z = Math.random() * 180 - 90;
            } while (Math.sqrt(x * x + z * z) < 15); // Keep away from lake

            rock.position.set(x, Math.random() * 0.5, z);
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            this.scene.add(rock);
        }

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
            
            this.grassPatches.push(grass);
            this.scene.add(grass);
        }

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
                
                // Randomize tree scale slightly
                const scale = 0.8 + Math.random() * 0.4;  // Scale between 0.8 and 1.2
                tree.scale.set(scale, scale, scale);
                
                this.trees.push(tree);
                this.scene.add(tree);
            }
        }

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

        // Add floating leaves
        this.leaves = [];
        for (let i = 0; i < 50; i++) {
            const leaf = this.createLeaf();
            const radius = Math.random() * 40 + 5;
            const angle = Math.random() * Math.PI * 2;
            const height = Math.random() * 15 + 2;
            
            leaf.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            
            leaf.radius = radius;
            leaf.angle = angle;
            leaf.height = height;
            leaf.originalHeight = height;
            leaf.rotationSpeed = Math.random() * 0.02 - 0.01;
            leaf.fallSpeed = Math.random() * 0.2 + 0.1;
            leaf.horizontalSpeed = Math.random() * 0.5 + 0.5;
            
            this.leaves.push(leaf);
            this.scene.add(leaf);
        }

        // Dynamic lighting
        this.ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        this.scene.add(this.ambientLight);

        this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
        this.sunLight.position.set(1, 1, 1);
        this.scene.add(this.sunLight);
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

    createLeaf() {
        const leafGeometry = new THREE.BufferGeometry();
        const leafShape = new THREE.Shape();
        
        leafShape.moveTo(0, 0);
        leafShape.quadraticCurveTo(0.5, 0.5, 1, 0);
        leafShape.quadraticCurveTo(0.5, -0.2, 0, 0);
        
        const points = leafShape.getPoints(20);
        const vertices = new Float32Array(points.length * 3);
        
        points.forEach((point, i) => {
            vertices[i * 3] = point.x;
            vertices[i * 3 + 1] = point.y;
            vertices[i * 3 + 2] = 0;
        });
        
        leafGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        
        const leafMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0x228B22).offsetHSL(0, 0, (Math.random() - 0.5) * 0.2),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });
        
        return new THREE.Mesh(leafGeometry, leafMaterial);
    }

    animate(time) {
        time *= 0.001; // Convert to seconds
        
        // Update tree sway
        this.trees.forEach(tree => {
            if (!tree || !tree.rotation) return;
            const sway = Math.sin(time * 0.5) * 0.05;
            tree.rotation.z = sway;
            
            // Also sway leaves
            if (tree.children) {
                tree.children.forEach((child, index) => {
                    if (index > 0 && child && child.rotation) { // Skip trunk
                        child.rotation.z = sway * (index * 0.5);
                    }
                });
            }
        });
        
        // Update grass sway
        this.grassPatches.forEach(grass => {
            if (!grass || !grass.rotation) return;
            const sway = Math.sin(time * grass.swaySpeed + grass.swayOffset) * 0.2;
            grass.rotation.y = grass.initialRotation + sway;
        });
        
        // Update butterfly movement
        this.butterflies.forEach(butterfly => {
            if (!butterfly || !butterfly.position || !butterfly.rotation) return;
            butterfly.angle += butterfly.speed * 0.02;
            const verticalMovement = Math.sin(time * butterfly.verticalSpeed + butterfly.verticalOffset) * 0.5;
            
            butterfly.position.x = Math.cos(butterfly.angle) * butterfly.radius;
            butterfly.position.y = butterfly.height + verticalMovement;
            butterfly.position.z = Math.sin(butterfly.angle) * butterfly.radius;
            
            // Rotate wings
            if (butterfly.children && butterfly.children.length >= 2) {
                if (butterfly.children[0] && butterfly.children[0].rotation) {
                    butterfly.children[0].rotation.y = Math.sin(time * 15) * 0.5;
                }
                if (butterfly.children[1] && butterfly.children[1].rotation) {
                    butterfly.children[1].rotation.y = -Math.sin(time * 15) * 0.5;
                }
            }
            
            // Orient butterfly in direction of movement
            butterfly.rotation.y = -butterfly.angle + Math.PI / 2;
        });
        
        // Update floating leaves
        this.leaves.forEach(leaf => {
            if (!leaf || !leaf.position || !leaf.rotation) return;
            leaf.angle += leaf.horizontalSpeed * 0.02;
            leaf.height -= leaf.fallSpeed;
            
            // Reset leaf when it falls too low
            if (leaf.height < 0) {
                leaf.height = leaf.originalHeight;
                leaf.angle = Math.random() * Math.PI * 2;
            }
            
            leaf.position.x = Math.cos(leaf.angle) * leaf.radius;
            leaf.position.y = leaf.height;
            leaf.position.z = Math.sin(leaf.angle) * leaf.radius;
            
            // Rotate leaf while falling
            leaf.rotation.x += leaf.rotationSpeed;
            leaf.rotation.y += leaf.rotationSpeed * 0.7;
        });
    }

    activate() {
        // Any activation logic
    }

    deactivate() {
        // Any cleanup logic
    }

    update() {
        const time = this.clock.getElapsedTime();
        
        // Update tree sway
        this.trees.forEach(tree => {
            if (!tree || !tree.rotation) return;
            const sway = Math.sin(time * 0.5) * 0.05;
            tree.rotation.z = sway;
            
            // Also sway leaves
            if (tree.children) {
                tree.children.forEach((child, index) => {
                    if (index > 0 && child && child.rotation) { // Skip trunk
                        child.rotation.z = sway * (index * 0.5);
                    }
                });
            }
        });
        
        // Update grass sway
        this.grassPatches.forEach(grass => {
            if (!grass || !grass.rotation) return;
            const sway = Math.sin(time * 0.5 + grass.position.x * 0.1) * 0.2;
            grass.rotation.y = sway;
        });
        
        // Update butterfly movement
        this.butterflies.forEach(butterfly => {
            if (!butterfly || !butterfly.position || !butterfly.rotation) return;
            butterfly.angle += 0.02;
            const verticalMovement = Math.sin(time * 2) * 0.5;
            
            butterfly.position.x = Math.cos(butterfly.angle) * butterfly.radius;
            butterfly.position.y = butterfly.height + verticalMovement;
            butterfly.position.z = Math.sin(butterfly.angle) * butterfly.radius;
            
            // Wing flapping
            if (butterfly.children && butterfly.children.length >= 2) {
                if (butterfly.children[0] && butterfly.children[0].rotation) {
                    butterfly.children[0].rotation.z = Math.sin(time * 15) * 0.5;
                }
                if (butterfly.children[1] && butterfly.children[1].rotation) {
                    butterfly.children[1].rotation.z = -Math.sin(time * 15) * 0.5;
                }
            }
            
            // Rotate to face movement direction
            butterfly.rotation.y = butterfly.angle + Math.PI / 2;
        });
        
        // Update floating leaves
        this.leaves.forEach(leaf => {
            if (!leaf || !leaf.position || !leaf.rotation) return;
            leaf.angle += 0.02;
            leaf.height -= 0.1;
            
            // Reset leaf when it falls too low
            if (leaf.height < 0) {
                leaf.height = leaf.originalHeight;
                leaf.angle = Math.random() * Math.PI * 2;
            }
            
            leaf.position.x = Math.cos(leaf.angle) * leaf.radius;
            leaf.position.y = leaf.height;
            leaf.position.z = Math.sin(leaf.angle) * leaf.radius;
            
            // Rotate leaf while falling
            leaf.rotation.x += 0.01;
            leaf.rotation.y += 0.01 * 0.7;
        });
        
        // Update lighting for day/night cycle
        const dayLength = 60; // 60 seconds per day
        const dayTime = (time % dayLength) / dayLength;
        const sunAngle = dayTime * Math.PI * 2;
        
        this.sunLight.position.x = Math.cos(sunAngle) * 50;
        this.sunLight.position.y = Math.sin(sunAngle) * 50;
        
        // Adjust light intensity based on time of day
        const intensity = Math.max(0.2, Math.sin(sunAngle));
        this.sunLight.intensity = intensity * 2;
        this.ambientLight.intensity = 0.5 + intensity;
        
        // Adjust scene colors for dawn/dusk
        if (sunAngle < Math.PI) {
            this.scene.background.setHSL(0.2, 0.5, 0.4 + intensity * 0.2);
            this.scene.fog.color.copy(this.scene.background);
        }
    }
}
