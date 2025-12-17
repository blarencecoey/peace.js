export const sandFragmentShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D displacementMap;
uniform vec3 sandColor;
uniform vec3 grooveColor;
uniform vec3 highlightColor;
uniform float displacementScale;

// Lighting uniforms
uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform float ambientIntensity;

void main() {
    // Sample displacement
    float displacement = texture2D(displacementMap, vUv).r;

    // Calculate approximate normal from displacement
    vec2 texelSize = vec2(1.0 / 2048.0);
    float displacementRight = texture2D(displacementMap, vUv + vec2(texelSize.x, 0.0)).r;
    float displacementUp = texture2D(displacementMap, vUv + vec2(0.0, texelSize.y)).r;

    vec3 tangent = normalize(vec3(1.0, (displacementRight - displacement) * displacementScale * 50.0, 0.0));
    vec3 bitangent = normalize(vec3(0.0, (displacementUp - displacement) * displacementScale * 50.0, 1.0));
    vec3 normal = normalize(cross(tangent, bitangent));

    // Lighting calculation
    float diffuse = max(dot(normal, normalize(lightDirection)), 0.0);

    // Mix colors based on displacement
    // Grooves (low displacement) are darker
    // Peaks (high displacement) are lighter
    float colorMix = smoothstep(0.3, 0.7, displacement);
    vec3 baseColor = mix(grooveColor, sandColor, colorMix);

    // Add highlights on peaks
    float highlightMix = smoothstep(0.8, 1.0, displacement);
    baseColor = mix(baseColor, highlightColor, highlightMix * 0.3);

    // Apply lighting
    vec3 finalColor = baseColor * (ambientIntensity + diffuse * 0.6);

    // Subtle ambient occlusion in grooves
    float ao = smoothstep(0.0, 0.5, displacement);
    finalColor *= (0.8 + ao * 0.2);

    gl_FragColor = vec4(finalColor, 1.0);
}
`;
