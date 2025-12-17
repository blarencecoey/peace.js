import * as THREE from 'three';
import { Sand } from './Sand';

export class InputManager {
    private canvas: HTMLCanvasElement;
    private camera: THREE.Camera;
    private sand: Sand;
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private isDrawing: boolean = false;
    private currentStroke: Array<{ x: number; y: number }> = [];

    constructor(canvas: HTMLCanvasElement, camera: THREE.Camera, sand: Sand) {
        this.canvas = canvas;
        this.camera = camera;
        this.sand = sand;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.setupEventListeners();
    }

    private setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));

        // Touch events
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
        this.canvas.addEventListener('touchcancel', this.onTouchEnd.bind(this));
    }

    private updateMousePosition(clientX: number, clientY: number) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    }

    private raycastToSand(): { x: number; y: number } | null {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObject(this.sand.mesh);

        if (intersects.length > 0 && intersects[0].uv) {
            return {
                x: intersects[0].uv.x,
                y: intersects[0].uv.y
            };
        }

        return null;
    }

    private onMouseDown(event: MouseEvent) {
        this.updateMousePosition(event.clientX, event.clientY);
        this.startDrawing();
    }

    private onMouseMove(event: MouseEvent) {
        this.updateMousePosition(event.clientX, event.clientY);

        if (this.isDrawing) {
            this.continueDrawing();
        }
    }

    private onMouseUp(_event: MouseEvent) {
        this.stopDrawing();
    }

    private onTouchStart(event: TouchEvent) {
        event.preventDefault();
        if (event.touches.length > 0) {
            const touch = event.touches[0];
            this.updateMousePosition(touch.clientX, touch.clientY);
            this.startDrawing();
        }
    }

    private onTouchMove(event: TouchEvent) {
        event.preventDefault();
        if (event.touches.length > 0 && this.isDrawing) {
            const touch = event.touches[0];
            this.updateMousePosition(touch.clientX, touch.clientY);
            this.continueDrawing();
        }
    }

    private onTouchEnd(_event: TouchEvent) {
        this.stopDrawing();
    }

    private startDrawing() {
        this.isDrawing = true;
        this.currentStroke = [];

        const uv = this.raycastToSand();
        if (uv) {
            this.currentStroke.push(uv);
        }
    }

    private continueDrawing() {
        const uv = this.raycastToSand();
        if (uv) {
            this.currentStroke.push(uv);

            // Update sand in real-time (only send last few points for performance)
            if (this.currentStroke.length >= 2) {
                const recentPoints = this.currentStroke.slice(-2);
                this.sand.addStroke(recentPoints);
            }
        }
    }

    private stopDrawing() {
        if (this.isDrawing && this.currentStroke.length >= 2) {
            // Final update with all points for smoothness
            this.sand.addStroke(this.currentStroke);
        }

        this.isDrawing = false;
        this.currentStroke = [];
    }

    public dispose() {
        this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.removeEventListener('mouseleave', this.onMouseUp.bind(this));
        this.canvas.removeEventListener('touchstart', this.onTouchStart.bind(this));
        this.canvas.removeEventListener('touchmove', this.onTouchMove.bind(this));
        this.canvas.removeEventListener('touchend', this.onTouchEnd.bind(this));
        this.canvas.removeEventListener('touchcancel', this.onTouchEnd.bind(this));
    }
}
