export type Tool = 'rake' | 'stone' | 'hand';
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

export class UI {
    private container: HTMLElement;
    private currentTool: Tool = 'rake';
    private onToolChange?: (tool: Tool) => void;
    private onReset?: () => void;
    private onTimeChange?: (time: TimeOfDay) => void;

    constructor(containerId: string = 'ui-overlay') {
        const element = document.getElementById(containerId);
        if (!element) {
            throw new Error(`Container element #${containerId} not found`);
        }
        this.container = element;
        this.init();
    }

    private init() {
        this.container.innerHTML = `
            <div class="ui-wrapper">
                <!-- Settings Menu (Top Left) -->
                <div class="settings-menu">
                    <button class="menu-toggle" aria-label="Settings">☰</button>
                    <div class="settings-flyout">
                        <button class="setting-btn" data-action="reset">Reset Garden</button>
                        <div class="time-selector">
                            <label>Time of Day:</label>
                            <select data-action="time">
                                <option value="dawn">Dawn</option>
                                <option value="day" selected>Day</option>
                                <option value="dusk">Dusk</option>
                                <option value="night">Night</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Tool Selection (Right Edge) -->
                <div class="tool-selector">
                    <button class="tool-btn active" data-tool="rake" title="Rake">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="12" y1="4" x2="12" y2="20" stroke-width="2"/>
                            <line x1="8" y1="20" x2="16" y2="20" stroke-width="2"/>
                            <line x1="9" y1="17" x2="9" y2="20" stroke-width="1.5"/>
                            <line x1="12" y1="17" x2="12" y2="20" stroke-width="1.5"/>
                            <line x1="15" y1="17" x2="15" y2="20" stroke-width="1.5"/>
                        </svg>
                    </button>
                    <button class="tool-btn" data-tool="stone" title="Stone">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4 L18 8 L18 14 L12 20 L6 14 L6 8 Z"/>
                        </svg>
                    </button>
                    <button class="tool-btn" data-tool="hand" title="Hand">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 17v-6M12 17V10M15 17v-4M9 5v4h10v2l-2 8H7l-2-8V9h4V5" stroke-width="2"/>
                        </svg>
                    </button>
                </div>

                <!-- Info Text (Bottom Center, Fade Out) -->
                <div class="info-text">
                    Click and drag to rake the sand
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.fadeOutInfo();
    }

    private setupEventListeners() {
        // Tool selection
        const toolButtons = this.container.querySelectorAll('.tool-btn');
        toolButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const tool = target.dataset.tool as Tool;
                this.selectTool(tool);
            });
        });

        // Settings menu toggle
        const menuToggle = this.container.querySelector('.menu-toggle');
        const flyout = this.container.querySelector('.settings-flyout');

        menuToggle?.addEventListener('click', () => {
            flyout?.classList.toggle('visible');
        });

        // Close flyout when clicking outside
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.settings-menu')) {
                flyout?.classList.remove('visible');
            }
        });

        // Reset button
        const resetBtn = this.container.querySelector('[data-action="reset"]');
        resetBtn?.addEventListener('click', () => {
            this.onReset?.();
            flyout?.classList.remove('visible');
        });

        // Time selector
        const timeSelect = this.container.querySelector('[data-action="time"]') as HTMLSelectElement;
        timeSelect?.addEventListener('change', (e) => {
            const time = (e.target as HTMLSelectElement).value as TimeOfDay;
            this.onTimeChange?.(time);
        });
    }

    private selectTool(tool: Tool) {
        this.currentTool = tool;

        // Update button states
        const toolButtons = this.container.querySelectorAll('.tool-btn');
        toolButtons.forEach(btn => {
            btn.classList.remove('active');
            if ((btn as HTMLElement).dataset.tool === tool) {
                btn.classList.add('active');
            }
        });

        this.onToolChange?.(tool);
    }

    private fadeOutInfo() {
        const infoText = this.container.querySelector('.info-text');
        setTimeout(() => {
            infoText?.classList.add('fade-out');
        }, 5000);
    }

    public setToolChangeCallback(callback: (tool: Tool) => void) {
        this.onToolChange = callback;
    }

    public setResetCallback(callback: () => void) {
        this.onReset = callback;
    }

    public setTimeChangeCallback(callback: (time: TimeOfDay) => void) {
        this.onTimeChange = callback;
    }

    public getCurrentTool(): Tool {
        return this.currentTool;
    }
}
