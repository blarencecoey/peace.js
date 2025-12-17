import './styles/index.css';
import { GardenScene } from './components/GardenScene';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="canvas"></canvas>
  <div id="ui-overlay">
    <!-- UI will be injected here -->
  </div>
`;

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement;
  if (canvas) {
    new GardenScene(canvas);
  }
});
