import * as THREE from 'three';
import { COLORS, CONFIG } from '../utils/constants';
import { sandVertexShader } from '../shaders/sand.vert';
import { sandFragmentShader } from '../shaders/sand.frag';

export class Sand {
    public mesh: THREE.Mesh;
    private geometry: THREE.PlaneGeometry;
    private material: THREE.ShaderMaterial;
    private displacementTexture: THREE.DataTexture;
    private displacementData: Uint8Array;
    private textureSize = 2048;

    constructor() {
        // Create high-resolution geometry for smooth displacement
        this.geometry = new THREE.PlaneGeometry(
            CONFIG.GARDEN_SIZE,
            CONFIG.GARDEN_SIZE,
            256,
            256
        );

        // Rotate to lie flat
        this.geometry.rotateX(-Math.PI / 2);

        // Initialize displacement texture
        this.displacementData = new Uint8Array(this.textureSize * this.textureSize);
        // Initialize with base level (middle gray = 0.5)
        this.displacementData.fill(128);

        this.displacementTexture = new THREE.DataTexture(
            this.displacementData,
            this.textureSize,
            this.textureSize,
            THREE.RedFormat,
            THREE.UnsignedByteType
        );
        this.displacementTexture.needsUpdate = true;
        this.displacementTexture.magFilter = THREE.LinearFilter;
        this.displacementTexture.minFilter = THREE.LinearFilter;

        // Create custom shader material
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                displacementMap: { value: this.displacementTexture },
                displacementScale: { value: CONFIG.SAND.DISPLACEMENT_SCALE },
                sandColor: { value: COLORS.SAND_BASE },
                grooveColor: { value: COLORS.SAND_SHADOWS },
                highlightColor: { value: COLORS.SAND_HIGHLIGHTS },
                lightDirection: { value: new THREE.Vector3(5, 15, 5).normalize() },
                lightColor: { value: new THREE.Color(0xffffff) },
                ambientIntensity: { value: 0.5 }
            },
            vertexShader: sandVertexShader,
            fragmentShader: sandFragmentShader,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
    }

    // Update displacement texture with new stroke data
    public addStroke(uvPoints: Array<{ x: number; y: number }>, width: number = 0.01) {
        if (uvPoints.length < 2) return;

        for (let i = 0; i < uvPoints.length - 1; i++) {
            const p1 = uvPoints[i];
            const p2 = uvPoints[i + 1];

            // Convert UV (0-1) to texture coordinates
            const x1 = Math.floor(p1.x * this.textureSize);
            const y1 = Math.floor(p1.y * this.textureSize);
            const x2 = Math.floor(p2.x * this.textureSize);
            const y2 = Math.floor(p2.y * this.textureSize);

            // Draw line between points
            this.drawLine(x1, y1, x2, y2, width);
        }

        this.displacementTexture.needsUpdate = true;
    }

    private drawLine(x0: number, y0: number, x1: number, y1: number, width: number) {
        // Bresenham's line algorithm with thickness
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        const radius = Math.max(1, Math.floor(width * this.textureSize / 2));

        while (true) {
            // Draw circle at current point
            this.drawCircle(x0, y0, radius);

            if (x0 === x1 && y0 === y1) break;

            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    }

    private drawCircle(cx: number, cy: number, radius: number) {
        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                const dist = Math.sqrt(x * x + y * y);
                if (dist <= radius) {
                    const px = cx + x;
                    const py = cy + y;

                    if (px >= 0 && px < this.textureSize && py >= 0 && py < this.textureSize) {
                        const index = py * this.textureSize + px;

                        // Create groove effect: darker value = deeper
                        // Use smooth falloff from center
                        const falloff = 1.0 - (dist / radius);
                        const depth = falloff * 0.7; // Max 70% depth
                        const currentValue = this.displacementData[index] / 255;
                        const newValue = Math.min(currentValue, 1.0 - depth);

                        this.displacementData[index] = Math.floor(newValue * 255);
                    }
                }
            }
        }
    }

    // Reset sand to flat state
    public reset() {
        this.displacementData.fill(128);
        this.displacementTexture.needsUpdate = true;
    }

    update(_delta: number) {
        // Can add subtle wind ripples or other animations here
    }
}
