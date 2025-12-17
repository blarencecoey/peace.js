import * as THREE from 'three';
import { COLORS, CONFIG } from '../utils/constants';

export class Environment {
    public group: THREE.Group;
    private groundPlane!: THREE.Mesh;
    private boundary: THREE.Group;
    private mossPatches: THREE.Group;

    constructor() {
        this.group = new THREE.Group();
        this.boundary = new THREE.Group();
        this.mossPatches = new THREE.Group();

        this.createGroundPlane();
        this.createBoundary();
        this.createMossPatches();

        this.group.add(this.groundPlane);
        this.group.add(this.boundary);
        this.group.add(this.mossPatches);
    }

    private createGroundPlane() {
        // Ground beneath the sand
        const geometry = new THREE.PlaneGeometry(
            CONFIG.GARDEN_SIZE * 1.5,
            CONFIG.GARDEN_SIZE * 1.5
        );
        geometry.rotateX(-Math.PI / 2);

        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#D0C8B8'),
            roughness: 1.0,
            metalness: 0
        });

        this.groundPlane = new THREE.Mesh(geometry, material);
        this.groundPlane.position.y = -0.02;
        this.groundPlane.receiveShadow = true;
    }

    private createBoundary() {
        const size = CONFIG.GARDEN_SIZE;
        const height = 0.2;
        const thickness = 0.3;

        // Create wooden frame around sand
        const woodMaterial = new THREE.MeshStandardMaterial({
            color: COLORS.WOOD,
            roughness: 0.8,
            metalness: 0
        });

        // Four sides of the boundary
        const sides = [
            { pos: [0, height / 2, size / 2], rot: [0, 0, 0], scale: [size, height, thickness] },
            { pos: [0, height / 2, -size / 2], rot: [0, 0, 0], scale: [size, height, thickness] },
            { pos: [size / 2, height / 2, 0], rot: [0, Math.PI / 2, 0], scale: [size, height, thickness] },
            { pos: [-size / 2, height / 2, 0], rot: [0, Math.PI / 2, 0], scale: [size, height, thickness] }
        ];

        sides.forEach(side => {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const mesh = new THREE.Mesh(geometry, woodMaterial);
            mesh.position.set(side.pos[0], side.pos[1], side.pos[2]);
            mesh.rotation.set(side.rot[0], side.rot[1], side.rot[2]);
            mesh.scale.set(side.scale[0], side.scale[1], side.scale[2]);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.boundary.add(mesh);
        });
    }

    private createMossPatches() {
        // Create organic moss patches near edges and corners
        const mossPositions = [
            { x: -9, z: 9 },
            { x: 9, z: -9 },
            { x: -9, z: -5 },
            { x: 7, z: 8 },
            { x: -6, z: -9 }
        ];

        mossPositions.forEach(pos => {
            const mossPatch = this.createMossPatch();
            mossPatch.position.set(pos.x, 0.05, pos.z);
            mossPatch.rotation.y = Math.random() * Math.PI * 2;
            this.mossPatches.add(mossPatch);
        });
    }

    private createMossPatch(): THREE.Mesh {
        // Create organic moss shape using distorted sphere
        const geometry = new THREE.SphereGeometry(0.8, 12, 8);

        // Flatten and deform
        const positionAttribute = geometry.getAttribute('position');
        const vertex = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);

            // Flatten vertically
            vertex.y *= 0.2;

            // Add organic deformation
            const noise = (Math.random() - 0.5) * 0.4;
            vertex.multiplyScalar(1 + noise);

            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }

        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            color: COLORS.MOSS,
            roughness: 0.95,
            metalness: 0
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    public getMossPatches(): THREE.Group {
        return this.mossPatches;
    }

    public getBoundary(): THREE.Group {
        return this.boundary;
    }
}
