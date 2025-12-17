export const sandVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D displacementMap;
uniform float displacementScale;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    // Sample displacement texture
    float displacement = texture2D(displacementMap, uv).r;

    // Apply displacement along normal
    vec3 displacedPosition = position + normal * displacement * displacementScale;

    vPosition = (modelMatrix * vec4(displacedPosition, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
`;
