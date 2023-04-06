export const vertexShader = `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
        vUv = uv;

        float squashFactor = 0.1 * sin(time * 1.5) + 1.0;
        vec3 squashedPosition = vec3(position.x, position.y * squashFactor, position.z);
        vPosition = squashedPosition;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(squashedPosition, 1.0);
    }
`
