'use client';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 700 / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('bg') as HTMLCanvasElement,
    });

    renderer.setSize(700, window.innerHeight);
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

  const sendRequest = async (route: string) => {
    console.log(process.env)
    let response;
    try{
       response = await fetch('http://localhost:5000' + route);
    }catch(err){
      console.log(err);
    }
    const text = await response?.text();
    alert(text);
  };
  return (
    <div>
      <main className='grid grid-cols-5'>
        <canvas id="bg" className='col-span-4' style={{position: 'static'}}></canvas>
        <div className=' aspect-square w-full h-full flex flex-col gap-6'>
          <p>Hai</p>
          <button className=' px-4 py-2 bg-blue-500 opacity-80 rounded-full hover:opacity-100 hover:underline w-full' onClick={()=>sendRequest('/')}>Hit the root URL</button>
          <button className=' px-4 py-2 bg-blue-500 opacity-80 rounded-full hover:opacity-100 hover:underline w-full' onClick={()=>sendRequest('/api/hill-climbing')}>Hit the Hill-climbing API</button>
          <button className=' px-4 py-2 bg-blue-500 opacity-80 rounded-full hover:opacity-100 hover:underline w-full' onClick={()=>sendRequest('/api/simulated-annealing')}>Hit the Simulated Annealing API</button>
          <button className=' px-4 py-2 bg-blue-500 opacity-80 rounded-full hover:opacity-100 hover:underline w-full' onClick={()=>sendRequest('/api/genetic-algorithm')}>Hit the Genetic Algorithm API</button>
          
        </div>
      </main>
      
    </div>
  );
}
