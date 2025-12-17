import * as THREE from 'three';
import gsap from 'gsap';

export class CameraController {
    private camera: THREE.PerspectiveCamera;
    private canvas: HTMLCanvasElement;
    private targetRotation = { x: 0, y: 0 };
    private currentRotation = { x: 0, y: 0 };
    private basePosition: THREE.Vector3;
    private baseLookAt: THREE.Vector3;
    private zoomLevel = 1.0;
    private targetZoom = 1.0;
    private minZoom = 0.7;
    private maxZoom = 1.5;
    private maxParallaxAngle = 0.05; // ~2.8 degrees in radians

    constructor(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
        this.camera = camera;
        this.canvas = canvas;
        this.basePosition = camera.position.clone();
        this.baseLookAt = new THREE.Vector3(0, 0, 2);

        this.setupEventListeners();
    }

    private setupEventListeners() {
        // Mouse move for parallax
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Scroll for zoom
        this.canvas.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

        // Touch gestures for mobile
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
    }

    private onMouseMove(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        // Normalize to -1 to 1 range
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Map to target rotation angles
        this.targetRotation.x = y * this.maxParallaxAngle;
        this.targetRotation.y = -x * this.maxParallaxAngle;
    }

    private onTouchMove(event: TouchEvent) {
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

            this.targetRotation.x = y * this.maxParallaxAngle;
            this.targetRotation.y = x * this.maxParallaxAngle;
        }
    }

    private onWheel(event: WheelEvent) {
        event.preventDefault();

        // Adjust zoom level
        const delta = event.deltaY * -0.001;
        this.targetZoom = THREE.MathUtils.clamp(
            this.targetZoom + delta,
            this.minZoom,
            this.maxZoom
        );
    }

    public update() {
        // Smooth camera rotation (parallax effect)
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.1;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.1;

        // Smooth zoom
        this.zoomLevel += (this.targetZoom - this.zoomLevel) * 0.1;

        // Apply transformations
        const zoomedPosition = this.basePosition.clone().multiplyScalar(1 / this.zoomLevel);

        // Create rotation offset
        const rotationOffset = new THREE.Vector3(
            Math.sin(this.currentRotation.y) * 2,
            0,
            Math.sin(this.currentRotation.x) * 2
        );

        this.camera.position.copy(zoomedPosition.add(rotationOffset));

        // Look at target with slight offset based on rotation
        const lookAtOffset = new THREE.Vector3(
            -this.currentRotation.y * 5,
            0,
            -this.currentRotation.x * 5
        );
        const lookAtTarget = this.baseLookAt.clone().add(lookAtOffset);

        this.camera.lookAt(lookAtTarget);
    }

    // Preset viewpoints
    public setViewpoint(preset: 'default' | 'topdown' | 'corner' | 'closeup') {
        let newPosition: THREE.Vector3;
        let newLookAt: THREE.Vector3;

        switch (preset) {
            case 'topdown':
                newPosition = new THREE.Vector3(0, 20, 0);
                newLookAt = new THREE.Vector3(0, 0, 0);
                break;
            case 'corner':
                newPosition = new THREE.Vector3(15, 10, 15);
                newLookAt = new THREE.Vector3(0, 0, 0);
                break;
            case 'closeup':
                newPosition = new THREE.Vector3(0, 8, 8);
                newLookAt = new THREE.Vector3(0, 0, 2);
                break;
            case 'default':
            default:
                newPosition = new THREE.Vector3(0, 12, 12);
                newLookAt = new THREE.Vector3(0, 0, 2);
                break;
        }

        // Animate to new viewpoint
        gsap.to(this.basePosition, {
            duration: 1.2,
            x: newPosition.x,
            y: newPosition.y,
            z: newPosition.z,
            ease: 'power2.out',
            onUpdate: () => {
                this.camera.position.copy(this.basePosition);
            }
        });

        gsap.to(this.baseLookAt, {
            duration: 1.2,
            x: newLookAt.x,
            y: newLookAt.y,
            z: newLookAt.z,
            ease: 'power2.out'
        });

        // Reset zoom and rotation
        this.targetZoom = 1.0;
        this.targetRotation = { x: 0, y: 0 };
    }

    public dispose() {
        this.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.removeEventListener('wheel', this.onWheel.bind(this));
        this.canvas.removeEventListener('touchmove', this.onTouchMove.bind(this));
    }
}
