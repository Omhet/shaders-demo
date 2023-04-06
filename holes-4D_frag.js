export const fragmentShader = `
    uniform float time;

    // Simplex noise function by Patricio Gonzalez Vivo and Jen Lowe
    // https://thebookofshaders.com/11/
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec4 fade(vec4 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

    float noise(vec4 P) {
        vec4 Pi0 = floor(P); // Integer part for indexing
        vec4 Pi1 = Pi0 + vec4(1.0); // Integer part + 1
        Pi0 = mod(Pi0, 289.0);
        Pi1 = mod(Pi1, 289.0);
        vec4 Pf0 = fract(P); // Fractional part for interpolation
        vec4 Pf1 = Pf0 - vec4(1.0); // Fractional part - 1.0
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;
        vec4 iw0 = Pi0.wwww;
        vec4 iw1 = Pi1.wwww;
    
        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);
        vec4 ixy00 = permute(ixy0 + iw0);
        vec4 ixy01 = permute(ixy0 + iw1);
        vec4 ixy10 = permute(ixy1 + iw0);
        vec4 ixy11 = permute(ixy1 + iw1);
    
        vec4 gx00 = ixy00 * (1.0 / 7.0);
        vec4 gy00 = fract(floor(gx00) * (1.0 / 7.0)) - 0.5;
        gx00 = fract(gx00);
        vec4 gz00 = vec4(0.5) - abs(gx00) - abs(gy00);
        vec4 sz00 = step(gz00, vec4(0.0));
        gx00 -= sz00 * (step(0.0, gx00) - 0.5);
        gy00 -= sz00 * (step(0.0, gy00) - 0.5);
    
        vec4 gx01 = ixy01 * (1.0 / 7.0);
        vec4 gy01 = fract(floor(gx01) * (1.0 / 7.0)) - 0.5;
        gx01 = fract(gx01);
        vec4 gz01 = vec4(0.5) - abs(gx01) - abs(gy01);
        vec4 sz01 = step(gz01, vec4(0.0));
        gx01 -= sz01 * (step(0.0, gx01) - 0.5);
        gy01 -= sz01 * (step(0.0, gy01) - 0.5);
    
        vec4 gx10 = ixy10 * (1.0 / 7.0);
        vec4 gy10 = fract(floor(gx10) * (1.0 / 7.0)) - 0.5;
        gx10 = fract(gx10);
        vec4 gz10 = vec4(0.5) - abs(gx10) - abs(gy10);
        vec4 sz10 = step(gz10, vec4(0.0));
        gx10 -= sz10 * (step(0.0, gx10) - 0.5);
        gy10 -= sz10 * (step(0.0, gy10) - 0.5);

        vec4 gx11 = ixy11 * (1.0 / 7.0);
        vec4 gy11 = fract(floor(gx11) * (1.0 / 7.0)) - 0.5;
        gx11 = fract(gx11);
        vec4 gz11 = vec4(0.5) - abs(gx11) - abs(gy11);
        vec4 sz11 = step(gz11, vec4(0.0));
        gx11 -= sz11 * (step(0.0, gx11) - 0.5);
        gy11 -= sz11 * (step(0.0, gy11) - 0.5);
    
        vec4 g0000 = vec4(gx00.x, gy00.x, gz00.x, sz00.x);
        vec4 g1000 = vec4(gx00.y, gy00.y, gz00.y, sz00.y);
        vec4 g0100 = vec4(gx00.z, gy00.z, gz00.z, sz00.z);
        vec4 g1100 = vec4(gx00.w, gy00.w, gz00.w, sz00.w);
        vec4 g0010 = vec4(gx10.x, gy10.x, gz10.x, sz10.x);
        vec4 g1010 = vec4(gx10.y, gy10.y, gz10.y, sz10.y);
        vec4 g0110 = vec4(gx10.z, gy10.z, gz10.z, sz10.z);
        vec4 g1110 = vec4(gx10.w, gy10.w, gz10.w, sz10.w);
        vec4 g0001 = vec4(gx01.x, gy01.x, gz01.x, sz01.x);
        vec4 g1001 = vec4(gx01.y, gy01.y, gz01.y, sz01.y);
        vec4 g0101 = vec4(gx01.z, gy01.z, gz01.z, sz01.z);
        vec4 g1101 = vec4(gx01.w, gy01.w, gz01.w, sz01.w);
        vec4 g0011 = vec4(gx11.x, gy11.x, gz11.x, sz11.x);
        vec4 g1011 = vec4(gx11.y, gy11.y, gz11.y, sz11.y);
        vec4 g0111 = vec4(gx11.z, gy11.z, gz11.z, sz11.z);
        vec4 g1111 = vec4(gx11.w, gy11.w, gz11.w, sz11.w);
    
        vec4 norm0 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
        g0000 *= norm0.x;
        g0100 *= norm0.y;
        g1000 *= norm0.z;
        g1100 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
        g0010 *= norm1.x;
        g0110 *= norm1.y;
        g1010 *= norm1.z;
        g1110 *= norm1.w;
        vec4 norm2 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
        g0001 *= norm2.x;
        g0101 *= norm2.y;
        g1001 *= norm2.z;
        g1101 *= norm2.w;
        vec4 norm3 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
        g0011 *= norm3.x;
        g0111 *= norm3.y;
        g1011 *= norm3.z;
        g1111 *= norm3.w;
    
        float n0000 = dot(g0000, Pf0);
        float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
        float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
        float n1100 = dot(g1100, vec4(Pf1.x, Pf1.y, Pf0.zw));
        float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
        float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
        float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
        float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
        float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
        float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
        float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
        float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
        float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
        float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
        float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
        float n1111 = dot(g1111, Pf1);
    
        vec4 fade_xyzw = fade(Pf0);
        vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
        vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
        vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
        vec2 n_yw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
        float n_xyzw = mix(n_yw.x, n_yw.y, fade_xyzw.x);
        return 2.2 * n_xyzw;
    }
    

    varying vec2 vUv;

    void main() {
        float seamBlend = 0.01; // Adjust this value to control the blending width around the seam
        float seamPosition = 1.0 - seamBlend;
    
        vec4 P = vec4(vUv * 50.0, 0.0, time * 0.5);
    
        float noiseValue = noise(P);
    
        if (vUv.x > seamPosition) {
            float t = (vUv.x - seamPosition) / seamBlend;
            vec4 P2 = vec4(vec2(vUv.x - 1.0) * 50.0, 0.0, time * 0.5);
            float noiseValue2 = noise(P2);
            noiseValue = mix(noiseValue, noiseValue2, t);
        }
    
        float holeSize = 0.005;
        float holeMask = step(holeSize, noiseValue);
    
        gl_FragColor = vec4(vec3(1.0), holeMask);
    }
`
