import * as THREE from 'three';
import { COLORS, CONFIG } from '../utils/constants';
import { Sand } from './Sand';
import { InputManager } from './InputManager';
import { CameraController } from './CameraController';
import { StoneManager } from './Stone';
import { Environment } from './Environment';
import { UI, type TimeOfDay } from './UI';

export class GardenScene {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private sand: Sand;
    private cameraController: CameraController;
    private stoneManager: StoneManager;
    private environment: Environment;
    private ui: UI;
    private sunLight!: THREE.DirectionalLight;

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

        // 5. Add Environment (ground, boundary, moss)
        this.environment = new Environment();
        this.scene.add(this.environment.group);

        // 6. Add Sand
        this.sand = new Sand();
        this.scene.add(this.sand.mesh);

        // 7. Stone Manager
        this.stoneManager = new StoneManager(this.scene);

        // 8. Input Manager for interaction
        new InputManager(canvas, this.camera, this.sand);

        // 9. Camera Controller
        this.cameraController = new CameraController(this.camera, canvas);

        // 10. UI Setup
        this.ui = new UI();
        this.ui.setResetCallback(() => this.resetGarden());
        this.ui.setTimeChangeCallback((time) => this.setTimeOfDay(time));

        // 11. Handle Resize
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
        this.sunLight = new THREE.DirectionalLight(
            0xffffff,
            CONFIG.LIGHTING.SUN_INTENSITY
        );
        this.sunLight.position.set(5, 15, 5);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 50;
        this.sunLight.shadow.bias = -0.0001;

        // Shadow camera bounds
        const sSize = 15;
        this.sunLight.shadow.camera.left = -sSize;
        this.sunLight.shadow.camera.right = sSize;
        this.sunLight.shadow.camera.top = sSize;
        this.sunLight.shadow.camera.bottom = -sSize;

        this.scene.add(this.sunLight);
    }

    private resetGarden() {
        this.sand.reset();
        this.stoneManager.clearAll();
    }

    private setTimeOfDay(time: TimeOfDay) {
        let bgColor: THREE.Color;
        let sunColor: THREE.Color;
        let intensity: number;

        switch (time) {
            case 'dawn':
                bgColor = new THREE.Color('#FFE6E6');
                sunColor = new THREE.Color('#FFB6C1');
                intensity = 1.0;
                break;
            case 'dusk':
                bgColor = new THREE.Color('#FFE4C4');
                sunColor = new THREE.Color('#FFA500');
                intensity = 1.2;
                break;
            case 'night':
                bgColor = new THREE.Color('#1A1A2E');
                sunColor = new THREE.Color('#87CEEB');
                intensity = 0.3;
                break;
            case 'day':
            default:
                bgColor = COLORS.BACKGROUND;
                sunColor = new THREE.Color(0xffffff);
                intensity = CONFIG.LIGHTING.SUN_INTENSITY;
                break;
        }

        this.scene.background = bgColor;
        this.scene.fog = new THREE.Fog(bgColor.getHex(), 20, 50);
        this.sunLight.color = sunColor;
        this.sunLight.intensity = intensity;
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
        this.cameraController.update();

        this.renderer.render(this.scene, this.camera);
    }
}
