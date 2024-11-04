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

    let objBot = new THREE.Object3D();
    let mixer: THREE.AnimationMixer;
    gltfLoader.load(
      "/3dmodel/robocute.glb",
      function (gltf) {
        objBot = gltf.scene;
        scene.add(objBot);

        mixer = new THREE.AnimationMixer(objBot);
        mixer.clipAction(gltf.animations[0]).play();

        objBot.scale.set(40, 40, 40);
        objBot.position.set(-85, 17, 22);
        objBot.rotation.y = -2.9;
        objBot.rotation.x = -0.1;
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.log("An error happened " + error);
      }
    );

    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(400, 500, 300).normalize();
    scene.add(light1);

    const light = new THREE.AmbientLight(0xffffff, 0.6);
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

    let hoverTime = 0;

    const maxOffsetX = 5;
    const maxOffsetY = 3;
    const maxOffsetZ = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      hoverTime += 0.01;
      // Set the base position and apply limits to the wandering effect
      const basePosition = { x: -85, y: 17, z: 22 };

      // Oscillate position with limits on each axis
      objBot.position.x =
        basePosition.x +
        Math.max(
          -maxOffsetX,
          Math.min(maxOffsetX, Math.sin(hoverTime) * maxOffsetX)
        );
      objBot.position.y =
        basePosition.y +
        Math.max(
          -maxOffsetY,
          Math.min(maxOffsetY, Math.sin(hoverTime * 0.5) * maxOffsetY)
        );
      objBot.position.z =
        basePosition.z +
        Math.max(
          -maxOffsetZ,
          Math.min(maxOffsetZ, Math.cos(hoverTime) * maxOffsetZ)
        );

      if (mixer) mixer.update(0.016);
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
    clearAllFields();

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

  const showerror = (what: string) => {
    toast.error(what, {
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
  };

  const clearAllFields = () => {
    setGA({ pop: -1, iter: -1 });
    setMaxSide(-1);
    setRestarts(-1);
    setTemp(-1);
    setCool(-1);
    setThres(-1);
  };

  const [GA, setGA] = useState({ pop: -1, iter: -1 });
  const [maxSide, setMaxSide] = useState(-1);
  const [restarts, setRestarts] = useState(-1);
  const [temp, setTemp] = useState(-1);
  const [cool, setCool] = useState(-1);
  const [thres, setThres] = useState(-1);

  const inputNumber = (target: HTMLInputElement, what: string) => {
    target.value = target.value.replace(/[^0-9.]/g, "");
    console.log(target.value, what);
    let err = false;

    if (target.value === "") {
      console.log("empty");
      if (what === "popGA") {
        setGA({ ...GA, pop: -1 });
      } else if (what === "iterGA") {
        setGA({ ...GA, iter: -1 });
      } else if (what === "maxSide") {
        setMaxSide(-1);
      } else if (what === "restarts") {
        setRestarts(-1);
      } else if (what === "temp") {
        setTemp(-1);
      } else if (what === "cool") {
        setCool(-1);
      } else if (what === "thres") {
        setThres(-1);
      } else {
        console.log("error");
      }
      return;
    }

    const val = parseInt(target.value);

    if (what === "popGA") {
      setGA({ ...GA, pop: val });
      console.log("GA: ", GA);
    } else if (what === "iterGA") {
      setGA({ ...GA, iter: val });
      console.log("GA: ", GA);
    } else if (what === "maxSide") {
      if (val < 1) {
        showerror("Max side must be greater than 1");
        err = true;
      } else {
        setMaxSide(val);
      }
      console.log("maxSide: ", maxSide);
    } else if (what === "restarts") {
      if (val < 1) {
        showerror("Restarts must be greater or equal to 1");
        err = true;
      } else {
        setRestarts(val);
      }
      console.log("restarts: ", restarts);
    } else if (what === "temp") {
      if (val < 1) {
        showerror("Temperature must be greater or equal to 1");
        err = true;
      } else {
        setTemp(val);
      }
      console.log("temp: ", temp);
    } else if (what === "cool") {
      if (val < 0 || val > 1) {
        showerror("Cooling rate must be between 0 and 1");
        err = true;
      } else {
        setCool(val);
      }
      console.log("cool: ", cool);
    } else if (what === "thres") {
      if (val < 0 || val > 1) {
        showerror("Threshold must be between 0 and 1");
        err = true;
      } else {
        setThres(val);
      }
      console.log("thres: ", thres);
    } else {
      console.log("error");
    }

    if (err) {
      target.value = "";
    }
  };

  const [resultsObj, setResults] = useState({});
  const [activeState, setActiveState] = useState("final");
  const [algoLoading, setAlgoLoading] = useState(false);

  const changeState = (state: string) => {
    setActiveState(state);
    if (state === "initial") {
      cube.createCubeWithMatric(cube.initial);
    } else {
      cube.createCubeWithMatric(cube.final);
    }
  };

  const sendData: { [key: string]: number | number[][][] } = {};

  const onSubmit = () => {
    console.log("Algorithm: ", activeAlgo);

    if (activeAlgo === "HC") {
      if (HC === "steep") {
        sendRequest("/api/hill-climbing/steep");
      } else if (HC === "side") {
        if (maxSide === -1) {
          showerror("Please enter max move");
          return;
        }
        sendData["maxSide"] = maxSide;
        sendRequest("/api/hill-climbing/side");
      } else if (HC === "stoc") {
        sendRequest("/api/hill-climbing/stoc");
      } else if (HC === "rando") {
        if (restarts === -1) {
          showerror("Please enter max restarts");
          return;
        }
        sendData["restarts"] = restarts;
        sendRequest("/api/hill-climbing/rando");
      } else {
        showerror("Please select a hill-climbing algorithm");
        return;
      }
    } else if (activeAlgo === "SA") {
      if (thres === -1 || temp === -1 || cool === -1) {
        showerror("Please enter threshold, temperature and cooling rate");
        return;
      }
      sendData["thres"] = thres;
      sendData["temp"] = temp;
      sendData["cool"] = cool;
      sendRequest("/api/simulated-annealing");
    } else if (activeAlgo === "GA") {
      if (GA.pop === -1 || GA.iter === -1) {
        showerror("Please enter population and iterations");
        return;
      }
      sendData["pop"] = GA.pop;
      sendData["iter"] = GA.iter;
      sendRequest("/api/genetic-algorithm");
    } else {
      showerror("Please select an algorithm");
      return;
    }
  };

  const sendRequest = async (route: string) => {
    setAlgoLoading(true);

    sendData["cube"] = cube.initial;

    console.log("Data: ", sendData);

    console.log(process.env);
    let response;
    try {
      response = await fetch("http://localhost:5000" + route, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
    } catch (err) {
      console.log(err);
    }
    const text = await response?.text();

    setAlgoLoading(false);

    alert(text);
  };
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
        <section className="loadOverlay">
          <Image
            src="/gif/loadscram.gif"
            alt="loading"
            width={200}
            height={200}
          />
          <label htmlFor="loadbar">Scrambling...</label>
        </section>
      ) : null}

      {algoLoading ? (
        <section className="loadOverlay">
          <Image
            src="/gif/loadAlgo.gif"
            alt="loading"
            width={300}
            height={300}
          />
          <label htmlFor="loadbar">Loading...</label>
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
                {activeAlgo === "SA" ? (
                  <section className="inputs" id="">
                    <div>
                      <label htmlFor="thres">Threshold</label>
                      <input
                        type="text"
                        id="thres"
                        placeholder="Enter number of threshold"
                        onChange={(e) => inputNumber(e.target, "thres")}
                      />
                    </div>
                    <div>
                      <label htmlFor="temp">Temperature</label>
                      <input
                        type="text"
                        id="temp"
                        placeholder="Enter number of temperature"
                        onChange={(e) => inputNumber(e.target, "temp")}
                      />
                    </div>
                    <div>
                      <label htmlFor="cool">Cooling rate</label>
                      <input
                        type="text"
                        id="cool"
                        placeholder="Enter number of cooling rate"
                        onChange={(e) => inputNumber(e.target, "cool")}
                      />
                    </div>
                  </section>
                ) : null}
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
                <section></section>
                <button className="button" onClick={scramble}>
                  Scramble
                </button>
                <button onClick={onSubmit} className="button">
                  Solve
                </button>
                {Object.keys(resultsObj).length > 0 ? (
                  <section className="states">
                    <label htmlFor="state">State</label>
                    <div>
                      <button
                        onClick={() => changeState("initial")}
                        className={`${
                          activeState === "initial" ? "active" : ""
                        }`}
                      >
                        Initial
                      </button>
                      <button
                        onClick={() => changeState("final")}
                        className={`${activeState === "final" ? "active" : ""}`}
                      >
                        Final
                      </button>
                    </div>
                  </section>
                ) : null}
              </section>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
