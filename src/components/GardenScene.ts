import * as THREE from 'three';
import { COLORS, CONFIG } from '../utils/constants';
import { Sand } from './Sand';

export class GardenScene {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private sand: Sand;

    constructor(canvas: HTMLCanvasElement) {
        // 1. Scene Setup
        this.scene = new THREE.Scene();
        this.scene.background = COLORS.BACKGROUND;
        this.scene.fog = new THREE.Fog(COLORS.BACKGROUND.getHex(), 20, 50);

        // 2. Camera Setup
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.CAMERA.FOV,
            aspect,
            CONFIG.CAMERA.NEAR,
            CONFIG.CAMERA.FAR
        );
        this.camera.position.set(
            CONFIG.CAMERA.INITIAL_POSITION.x,
            CONFIG.CAMERA.INITIAL_POSITION.y,
            CONFIG.CAMERA.INITIAL_POSITION.z
        );
        this.camera.lookAt(
            CONFIG.CAMERA.LOOK_AT.x,
            CONFIG.CAMERA.LOOK_AT.y,
            CONFIG.CAMERA.LOOK_AT.z
        );

        // 3. Renderer Setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // 4. Lighting
        this.setupLighting();

        // 5. Add Objects
        this.sand = new Sand();
        this.scene.add(this.sand.mesh);

        // 6. Handle Resize
        window.addEventListener('resize', this.onResize.bind(this));

        // Start loop
        this.animate();
    }

    private setupLighting() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight(
            COLORS.BACKGROUND,
            CONFIG.LIGHTING.AMBIENT_INTENSITY
        );
        this.scene.add(ambientLight);

        // Hemisphere Light (Sky/Ground)
        const hemiLight = new THREE.HemisphereLight(
            COLORS.BACKGROUND,
            COLORS.SAND_BASE,
            CONFIG.LIGHTING.HEMISPHERE_INTENSITY
        );
        this.scene.add(hemiLight);

        // Directional (Sun)
        const sunLight = new THREE.DirectionalLight(
            0xffffff,
            CONFIG.LIGHTING.SUN_INTENSITY
        );
        sunLight.position.set(5, 15, 5);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.bias = -0.0001;

        // Shadow camera bounds
        const sSize = 15;
        sunLight.shadow.camera.left = -sSize;
        sunLight.shadow.camera.right = sSize;
        sunLight.shadow.camera.top = sSize;
        sunLight.shadow.camera.bottom = -sSize;

        this.scene.add(sunLight);
    }

    private onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Update logic
        const time = Date.now() * 0.001;
        this.sand.update(time);

        this.renderer.render(this.scene, this.camera);
    }
}
