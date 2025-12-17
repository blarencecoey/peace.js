import * as THREE from 'three';
import { COLORS } from '../utils/constants';

export type StoneType = 'large-angular' | 'medium-rounded' | 'small-flat';

export class Stone {
    public mesh: THREE.Mesh;
    public id: string;
    public type: StoneType;
    private isPlaced: boolean = false;

    constructor(type: StoneType, id?: string) {
        this.type = type;
        this.id = id || Math.random().toString(36).substring(7);

        const { geometry, scale } = this.createGeometry(type);
        const material = this.createMaterial(type);

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.scale.setScalar(scale);

        // Store reference to this instance
        this.mesh.userData.stoneInstance = this;
    }

    private createGeometry(type: StoneType): { geometry: THREE.BufferGeometry; scale: number } {
        let geometry: THREE.BufferGeometry;
        let scale: number;

        switch (type) {
            case 'large-angular':
                // Create irregular angular stone
                geometry = this.createAngularStone();
                scale = 1.2;
                break;

            case 'medium-rounded':
                // Create rounded stone
                geometry = new THREE.SphereGeometry(0.5, 16, 16);
                this.deformGeometry(geometry, 0.3);
                scale = 0.8;
                break;

            case 'small-flat':
                // Create flat stone
                geometry = new THREE.CylinderGeometry(0.4, 0.5, 0.3, 12);
                this.deformGeometry(geometry, 0.2);
                scale = 0.6;
                break;

            default:
                geometry = new THREE.SphereGeometry(0.5, 16, 16);
                scale = 1.0;
        }

        return { geometry, scale };
    }

    private createAngularStone(): THREE.BufferGeometry {
        // Create a dodecahedron for angular look
        const geometry = new THREE.DodecahedronGeometry(0.5, 0);
        this.deformGeometry(geometry, 0.4);
        return geometry;
    }

    private deformGeometry(geometry: THREE.BufferGeometry, amount: number) {
        const positionAttribute = geometry.getAttribute('position');
        const vertex = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);

            // Add random deformation for organic look
            const noise = (Math.random() - 0.5) * amount;
            vertex.multiplyScalar(1 + noise);

            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }

        geometry.computeVertexNormals();
    }

    private createMaterial(type: StoneType): THREE.MeshStandardMaterial {
        let color: THREE.Color;
        let roughness: number;

        switch (type) {
            case 'large-angular':
                color = COLORS.STONE_DARK;
                roughness = 0.8;
                break;

            case 'medium-rounded':
                color = COLORS.STONE_MID;
                roughness = 0.7;
                break;

            case 'small-flat':
                color = COLORS.STONE_LIGHT;
                roughness = 0.9;
                break;

            default:
                color = COLORS.STONE_MID;
                roughness = 0.75;
        }

        return new THREE.MeshStandardMaterial({
            color: color,
            roughness: roughness,
            metalness: 0.1,
            flatShading: false
        });
    }

    public place(position: THREE.Vector3) {
        this.mesh.position.copy(position);
        this.isPlaced = true;

        // Settle animation (slight sink into sand)
        const targetY = position.y - 0.1;

        // Simple settle animation
        const startY = position.y + 0.5;
        this.mesh.position.y = startY;

        const animate = () => {
            if (this.mesh.position.y > targetY) {
                this.mesh.position.y -= 0.05;
                requestAnimationFrame(animate);
            } else {
                this.mesh.position.y = targetY;
            }
        };

        animate();
    }

    public remove() {
        this.isPlaced = false;
    }

    public getIsPlaced(): boolean {
        return this.isPlaced;
    }
}

export class StoneManager {
    private stones: Stone[] = [];
    private scene: THREE.Scene;
    private maxStones = 9;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    public addStone(type: StoneType, position: THREE.Vector3): Stone | null {
        if (this.stones.length >= this.maxStones) {
            console.warn('Maximum number of stones reached');
            return null;
        }

        const stone = new Stone(type);
        stone.place(position);

        this.stones.push(stone);
        this.scene.add(stone.mesh);

        return stone;
    }

    public removeStone(stone: Stone) {
        const index = this.stones.indexOf(stone);
        if (index > -1) {
            this.stones.splice(index, 1);
            this.scene.remove(stone.mesh);
            stone.remove();
        }
    }

    public getStones(): Stone[] {
        return this.stones;
    }

    public clearAll() {
        this.stones.forEach(stone => {
            this.scene.remove(stone.mesh);
        });
        this.stones = [];
    }
}
