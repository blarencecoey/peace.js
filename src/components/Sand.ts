import * as THREE from 'three';
import { COLORS, CONFIG } from '../utils/constants';

export class Sand {
    public mesh: THREE.Mesh;
    private geometry: THREE.PlaneGeometry;
    private material: THREE.MeshStandardMaterial; // Placeholder for ShaderMaterial

    constructor() {
        this.geometry = new THREE.PlaneGeometry(
            CONFIG.GARDEN_SIZE,
            CONFIG.GARDEN_SIZE,
            128,
            128
        );

        // Rotate to lie flat
        this.geometry.rotateX(-Math.PI / 2);

        this.material = new THREE.MeshStandardMaterial({
            color: COLORS.SAND_BASE,
            roughness: 0.9,
            // simple normal map or noise could go here later
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true; // Maybe self-shadowing for displacement
    }

    update(_delta: number) {
        // Will handle animations here
    }
}
