'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // ── Scene / Camera ────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = 4;

    // ── Mouse tracking ────────────────────────────────────────
    const mouse = new THREE.Vector2(0, 0);
    const smoothMouse = new THREE.Vector2(0, 0);

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Geometry: a subdivided plane we deform ────────────────
    const SEG = 120;
    const geo = new THREE.PlaneGeometry(10, 10, SEG, SEG);
    // Store original positions
    const origPos = Float32Array.from(geo.attributes.position.array);

    // ── Custom ShaderMaterial ─────────────────────────────────
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform vec2  uMouse;
        varying vec2  vUv;
        varying float vDistort;

        // Smooth noise helpers
        vec3 mod289(vec3 x){return x - floor(x*(1./289.))*289.;}
        vec4 mod289(vec4 x){return x - floor(x*(1./289.))*289.;}
        vec4 permute(vec4 x){return mod289((x*34.+1.)*x);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - .85373472095314*r;}

        float snoise(vec3 v){
          const vec2 C = vec2(1./6., 1./3.);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g  = step(x0.yzx, x0.xyz);
          vec3 l  = 1. - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.x;
          vec3 x2 = x0 - i2 + C.y;
          vec3 x3 = x0 - .5;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z+vec4(0.,i1.z,i2.z,1.))
           +i.y+vec4(0.,i1.y,i2.y,1.))
           +i.x+vec4(0.,i1.x,i2.x,1.));
          vec3 ns = .142857142857 * taylorInvSqrt(vec4(0.)).xyz - .142857142857;
          // simplified — just use the permuted values for gradient
          vec4 j = p - 49.*floor(p*(1./49.));
          vec4 x_ = floor(j*(1./7.));
          vec4 y_ = floor(j - 7.*x_);
          vec4 xx = (x_*2.+.5)/7.-1.;
          vec4 yy = (y_*2.+.5)/7.-1.;
          vec4 h = 1.-abs(xx)-abs(yy);
          vec4 b0 = vec4(xx.xy,yy.xy);
          vec4 b1 = vec4(xx.zw,yy.zw);
          vec4 s0 = floor(b0)*2.+1.;
          vec4 s1 = floor(b1)*2.+1.;
          vec4 sh = -step(h, vec4(0.));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
          p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
          vec4 m = max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
          m=m*m; return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
        }

        void main(){
          vUv = uv;
          vec3 pos = position;

          // Distance from cursor in world-ish space
          float mx = uMouse.x * 5.0;
          float my = uMouse.y * 5.0;
          float d  = distance(pos.xy, vec2(mx, my));

          // Ripple from cursor
          float ripple = sin(d * 3.0 - uTime * 2.5) * exp(-d * 0.7) * 0.55;

          // Ambient noise flow
          float n = snoise(vec3(pos.xy * 0.5, uTime * 0.18)) * 0.28;

          pos.z = ripple + n;
          vDistort = pos.z;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        varying vec2  vUv;
        varying float vDistort;

        void main(){
          // Base grid lines
          vec2 grid = abs(fract(vUv * 28.0 - 0.5) - 0.5) / fwidth(vUv * 28.0);
          float line = min(grid.x, grid.y);
          float gridVal = 1.0 - min(line, 1.0);

          // Color based on distortion
          float d = vDistort * 1.4 + 0.5;
          vec3 col1 = vec3(0.486, 0.435, 1.0);  // purple
          vec3 col2 = vec3(0.302, 1.0,   0.847); // teal
          vec3 col3 = vec3(1.0,   0.302, 1.0);   // pink
          vec3 color = mix(col1, col2, clamp(d, 0.0, 1.0));
          color = mix(color, col3, clamp(d - 0.5, 0.0, 1.0) * 0.4);

          float alpha = gridVal * (0.12 + abs(vDistort) * 0.6);
          // Faded at edges
          float edgeFade = smoothstep(0.0, 0.18, vUv.x)
                         * smoothstep(1.0, 0.82, vUv.x)
                         * smoothstep(0.0, 0.18, vUv.y)
                         * smoothstep(1.0, 0.82, vUv.y);
          alpha *= edgeFade;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -0.38;
    scene.add(mesh);

    // ── Floating particles (teal dots) ────────────────────────
    const PARTICLE_COUNT = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    const pPhase = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      pPhase[i] = Math.random() * Math.PI * 2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('phase', new THREE.BufferAttribute(pPhase, 1));

    const pMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: /* glsl */ `
        attribute float phase;
        uniform float uTime;
        uniform vec2  uMouse;
        varying float vAlpha;

        void main(){
          vec3 pos = position;
          pos.y += sin(uTime * 0.6 + phase) * 0.12;
          pos.x += cos(uTime * 0.4 + phase * 1.3) * 0.08;

          // Subtle mouse repel
          float mx = uMouse.x * 5.0;
          float my = uMouse.y * 3.5;
          float d  = distance(pos.xy, vec2(mx, my));
          float repel = smoothstep(1.8, 0.0, d) * 0.5;
          vec2 dir = normalize(pos.xy - vec2(mx, my) + 0.001);
          pos.xy += dir * repel;

          vAlpha = 0.25 + 0.35 * sin(phase + uTime * 0.5);
          gl_PointSize  = 2.5;
          gl_Position   = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vAlpha;
        void main(){
          float d = length(gl_PointCoord - vec2(0.5));
          if(d > 0.5) discard;
          gl_FragColor = vec4(0.302, 1.0, 0.847, vAlpha * (1.0 - d * 1.8));
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Resize handler ────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      mat.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ────────────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();

    const tick = () => {
      const t = clock.getElapsedTime();

      // Smooth mouse
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.07;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.07;

      mat.uniforms.uTime.value = t;
      mat.uniforms.uMouse.value.copy(smoothMouse);
      pMat.uniforms.uTime.value = t;
      pMat.uniforms.uMouse.value.copy(smoothMouse);

      // Subtle camera drift following mouse
      camera.position.x += (smoothMouse.x * 0.18 - camera.position.x) * 0.04;
      camera.position.y += (smoothMouse.y * 0.08 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      pGeo.dispose();
      pMat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
