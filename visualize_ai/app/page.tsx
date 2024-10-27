'use client';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('bg') as HTMLCanvasElement,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const gridHelper = new THREE.GridHelper(200, 50);
    scene.add(gridHelper);

    const controls = new OrbitControls(camera, renderer.domElement);



    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <nav>
        <ul>
          <li>
            <a href="/page1">Page 1</a>
          </li>
          <li>
            <a href="/page2">Page 2</a>
          </li>
        </ul>
      </nav>
      <main>
        <canvas id="bg"></canvas>
      </main>
    </div>
  );
}
