"use client";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import Results from "./components/results";

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect, useState, useMemo } from "react";
import MagicCube from "./models/3cube";
import Image from "next/image";

export default function Home() {
  const [load, setLoad] = useState(true);
  const cube = useMemo(() => new MagicCube(), []);
  const scene = useMemo(() => new THREE.Scene(), []);

  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("bg") as HTMLCanvasElement,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(32, 24, 32);

    const loadManager = new THREE.LoadingManager();

    loadManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = itemsLoaded / itemsTotal;
      console.log(`Loading file: ${url} ${progress * 100}%`);
    };

    loadManager.onStart = () => {
      setLoad(true);
    };

    loadManager.onLoad = () => {
      setLoad(false);
    };

    const loaderBG = new THREE.TextureLoader(loadManager);
    loaderBG.load("/images/bg.jpeg", function (texture) {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(renderer, texture);
      scene.background = rt.texture;
    });

    const gltfLoader = new GLTFLoader(loadManager);

    let obj: THREE.Object3D;

    gltfLoader.load(
      "/3dmodel/crater.glb",
      function (gltf) {
        obj = gltf.scene;
        scene.add(obj);

        obj.scale.set(40, 40, 40);
        obj.position.set(0, -30, 70);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.log("An error happened " + error);
      }
    );

    gltfLoader.load(
      "/3dmodel/podium.glb",
      function (gltf) {
        obj = gltf.scene;
        scene.add(obj);

        obj.scale.set(40, 40, 40);
        obj.position.set(0, -15, 42);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.log("An error happened " + error);
      }
    );

    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(400, 500, 300);
    scene.add(light1);

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    cube.generateCube();

    scene.add(cube.WholeCube);

    // const gridHelper = new THREE.GridHelper(200, 50);
    // scene.add(gridHelper);

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    controls.enablePan = false;

    controls.minDistance = 30;
    controls.maxDistance = 60;

    controls.maxPolarAngle = Math.PI / 2.5;

    const animate = () => {
      requestAnimationFrame(animate);

      controls.update();

      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize);

    animate();

    return () => {
      renderer.dispose();
    };
  }, [cube, scene]);

  const [menu, setMenu] = useState(true);
  const [scramLoaded, setScramLoaded] = useState(false);
  const levels = [1, 2, 3, 4, 5];
  const [selectedLevel, setSelectedLevel] = useState(0);

  const [activeAlgo, setActiveAlgo] = useState("");
  const [HC, setHC] = useState("");

  const hcOptions = (option: string) => {
    console.log(option);
    if (HC === option) {
      setHC("");
    } else {
      setHC(option);
    }
  };

  const algoOptions = (algo: string) => {
    
    console.log(algo);

    setResults({});

    if (activeAlgo === algo) {
      setActiveAlgo("");
    } else {
      setActiveAlgo(algo);
      if (algo !== "HC") {
        setHC("");
      }
    }
  };

  const closeMenu = () => {
    setMenu(!menu);
  };

  const scramble = () => {
    setScramLoaded(true);
    setTimeout(() => {
      cube.reshuffleCube();
      scene.add(cube.WholeCube);
      setScramLoaded(false);
    }, 200);
  };

  const selectLevel = (level: number) => {
    if (selectedLevel === level) {
      setSelectedLevel(0);
      cube.allVisible();
    } else {
      setSelectedLevel(level);
      cube.visibleOnlyOneLevel(level);
    }
    console.log(level);
  };

  const selectAll = () => {
    setSelectedLevel(0);
    cube.allVisible();
    cube.showXYZ();
  };

  const [GA, setGA] = useState({ pop: -1, iter: -1 });
  const [maxSide, setMaxSide] = useState(-1);
  const [restarts, setRestarts] = useState(-1);

  const inputNumber = (target: HTMLInputElement, what: string) => {
    target.value = target.value.replace(/[^0-9]/g, "");
    console.log(target.value, what);

    if (isNaN(parseInt(target.value))) {
      return;
    }

    if (what === "popGA") {
      setGA({ ...GA, pop: parseInt(target.value) });

      console.log("GA: ", GA);
    } else if (what === "iterGA") {
      setGA({ ...GA, iter: parseInt(target.value) });

      console.log("GA: ", GA);
    } else if (what === "maxSide") {
      setMaxSide(parseInt(target.value));
      console.log("maxSide: ", maxSide);
    } else if (what === "restarts") {
      setRestarts(parseInt(target.value));
      console.log("restarts: ", restarts);
    } else {
      console.log("error");
    }
  };

  const [resultsObj, setResults] = useState({});

  const onSubmit = () => {
    console.log("Algorithm: ", activeAlgo);

    if (activeAlgo === "") {
      toast.error("Please select an algorithm", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    if (activeAlgo === "HC") {
      if (HC === "") {
        toast.error("Please select an option for Hill-climbing", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        return;
      } else if (HC === "steep") {
        console.log("Hill-climbing Steepest ascent");
        // sendRequest('/HC/steep');
      } else if (HC === "side") {
        console.log("Hill-climbing Sideways move");
        if (maxSide === -1) {
          toast.error("Please enter max iterations", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
          return;
          // sendRequest('/HC/side');
        }
      } else if (HC === "stoc") {
        console.log("Hill-climbing Stochastic");
        // sendRequest('/HC/stoc');
      } else if (HC === "rando") {
        console.log("Hill-climbing Random restart");
        // sendRequest('/HC/rando');
        if (restarts === -1) {
          toast.error("Please enter max restarts", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
          return;
        }
      } else {
        console.log("Hill-climbing");
        // sendRequest('/HC');
      }
    } else if (activeAlgo === "SA") {
      console.log("Simulated Annealing");
      // sendRequest('/SA');
    } else if (activeAlgo === "GA") {
      console.log("Genetic Algorithm");
      console.log("GA inputs: ", GA);
      if (GA.pop === -1 || GA.iter === -1) {
        toast.error("Please enter population and iterations", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        return;
      }
      // sendRequest('/GA');
    } else {
      console.log("error");
    }

    setResults({ objective: 123123123, duration: 123123123 });

    console.log("Results: ", resultsObj);
  };

  // const sendRequest = async (route: string) => {
  //   console.log(process.env)
  //   let response;
  //   try{
  //      response = await fetch('http://localhost:5000' + route);
  //   }catch(err){
  //     console.log(err);
  //   }
  //   const text = await response?.text();
  //   alert(text);
  // };
  return (
    <div>
      <canvas id="bg"></canvas>
      {load ? (
        <section id="loading">
          <Image
            src="/gif/loadTexture.gif"
            alt="loading"
            width={400}
            height={400}
          />
          <label htmlFor="loadbar">Loading...</label>
        </section>
      ) : null}

      {scramLoaded ? (
        <section id="scram">
          <Image
            src="/gif/loadscram.gif"
            alt="loading"
            width={200}
            height={200}
          />
          <label htmlFor="loadbar">Scrambling...</label>
        </section>
      ) : null}

      <main>
        <ToastContainer />
        {menu ? (
          <section id="welcome">
            <h1>Magic Cube Solver</h1>
            <div>
              <button onClick={closeMenu}>Start Solving</button>
              <button>Tutorial</button>
            </div>
          </section>
        ) : (
          <div>
            <div id="level">
              <h1>level</h1>
              {levels.map((level) => (
                <button
                  key={level}
                  className={`levels ${
                    selectedLevel === level ? "active" : ""
                  }`}
                  onClick={() => selectLevel(level)}
                >
                  {level}
                </button>
              ))}
              <button
                className={`levels ${selectedLevel === 0 ? "active" : ""}`}
                onClick={selectAll}
              >
                All
              </button>
            </div>

            {Object.keys(resultsObj).length > 0 ? <Results /> : null}

            <aside>
              <section id="menu">
                <div className="w-full flex justify-start gap-3 items-center">
                  <Image
                    src="/images/logo.png"
                    alt="logo"
                    width={70}
                    height={70}
                  />
                  <h1 className="text-2xl text-yellow-50">DMCube Solver</h1>
                </div>
                <button className="button" onClick={closeMenu}>
                  Close
                </button>
                <button
                  className={`button algo ${
                    activeAlgo === "HC" ? "active" : ""
                  }`}
                  onClick={() => algoOptions("HC")}
                >
                  Hill-climbing
                </button>
                {activeAlgo === "HC" ? (
                  <section id="HCSection">
                    <button
                      className={`hcBut ${HC === "steep" ? "active" : ""}`}
                      onClick={() => hcOptions("steep")}
                    >
                      Steepest ascent
                    </button>
                    <button
                      className={`hcBut ${HC === "side" ? "active" : ""}`}
                      onClick={() => hcOptions("side")}
                    >
                      Sideways move
                    </button>
                    {HC === "side" ? (
                      <section className="inputs" id="">
                        <div>
                          <label htmlFor="maxSide">Max move</label>
                          <input
                            type="text"
                            id="maxSide"
                            placeholder="Enter number of max iterations"
                            onChange={(e) => inputNumber(e.target, "maxSide")}
                          />
                        </div>
                      </section>
                    ) : null}
                    <button
                      className={`hcBut ${HC === "stoc" ? "active" : ""}`}
                      onClick={() => hcOptions("stoc")}
                    >
                      Stochastic
                    </button>
                    <button
                      className={`hcBut ${HC === "rando" ? "active" : ""}`}
                      onClick={() => hcOptions("rando")}
                    >
                      Random restart
                    </button>
                    {HC === "rando" ? (
                      <section className="inputs" id="RRInput">
                        <div>
                          <label htmlFor="n">Max restarts</label>
                          <input
                            type="text"
                            id="n"
                            placeholder="Enter number of max restarts"
                            onChange={(e) => inputNumber(e.target, "restarts")}
                          />
                        </div>
                      </section>
                    ) : null}
                  </section>
                ) : null}
                <button
                  className={`button algo ${
                    activeAlgo === "SA" ? "active" : ""
                  }`}
                  onClick={() => algoOptions("SA")}
                >
                  Simulated Annealing
                </button>
                <button
                  className={`button algo ${
                    activeAlgo === "GA" ? "active" : ""
                  }`}
                  onClick={() => algoOptions("GA")}
                >
                  Genetic Algorithm
                </button>
                {activeAlgo === "GA" ? (
                  <section className="inputs" id="GAInput">
                    <div>
                      <label htmlFor="pop">Population</label>
                      <input
                        type="text"
                        id="pop"
                        placeholder="Enter population"
                        onChange={(e) => inputNumber(e.target, "popGA")}
                      />
                    </div>
                    <div>
                      <label htmlFor="iter">Iterations</label>
                      <input
                        type="text"
                        id="iter"
                        placeholder="Enter iterations"
                        onChange={(e) => inputNumber(e.target, "iterGA")}
                      />
                    </div>
                  </section>
                ) : null}
                <section>
                  <div>
                    <label htmlFor="n"></label>
                  </div>
                </section>
                <button className="button" onClick={scramble}>
                  Scramble
                </button>
                <button onClick={onSubmit} className="button">
                  Solve
                </button>
              </section>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
