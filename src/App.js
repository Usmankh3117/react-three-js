import { useEffect } from "react";
import * as THREE from "./threejs/build/three.module.js";
import { GLTFLoader } from "./threejs/jsm/loaders/GLTFLoader.js";
import Stats from "stats.js";
import "./App.css";

function App() {
  useEffect(() => {
    loadModel();
  }, []);
  const loadGLTFModel = async (path, fileName) => {
    return new Promise((res, rej) => {
      let fileName = "O anim.glb";
      // let fileName = "circle glb cmprsd.glb";
      var loader = new GLTFLoader().setPath("/models/");
      loader.load(
        fileName,
        function (gltf) {
          res(gltf);
        },
        undefined,
        function (e) {
          console.error(e);
        }
      );
    });
  };
  const loadModel = async (obj) => {
    var renderer, scene, camera;
    var model;
    let height = window.innerHeight;
    let width = window.innerWidth;
    var container = document.getElementById("model");
    var clock = new THREE.Clock();
    var stats = new Stats();
    stats.showPanel(1);
    document.body.appendChild(stats.dom);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setClearColor(0xffffff, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    camera.position.set(0, 1, 5);
    // camera.fov = 2 * Math.atan((camera.getFilmHeight() / 2) / camera.getFocalLength()) * 180 / Math.PI;
    camera.fov = 1;
    const light = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(light);

    let gltf = await loadGLTFModel();
    model = gltf.scene;
    model.position.set(0.5, 0.5, 0.5);
    model.scale.set(40, 40, 40);
    let mesh;
    let isChange = false;
    let ringPos = {}
    model.traverse(function (object) {
      if (object.isMesh) {
        object.castShadow = true;
        mesh = object;
        // if (object.name === "O_ring18") {
        //   debugger
        //   ringPos = object.position
        // } else if (object.name === "O_ring37") {
        //   debugger
        //   object.position.x = ringPos.x;
        //   object.position.y = ringPos.y;
        //   object.position.z = ringPos.z;
        // }
        // if (!isChange) {
        //   object.position.x -= 0.1
        //   isChange = true;
        // }
      }
    });
    const mixer = new THREE.AnimationMixer(model);
    var idleClip = mixer.clipAction(gltf.animations[0]);
    idleClip.timeScale = 1;
    idleClip.play();
    scene.add(model);
    animate();

    function animate() {
      stats.begin();
      stats.end();
      // setTimeout(function () {
      //   requestAnimationFrame(animate);
      // }, 1000 / 30);
      // let isChange = false;
      // model.traverse(function (object) {
      //   if (object.isMesh) {
      //     object.castShadow = true;
      //     mesh = object;
      //     if (!isChange) {
      //       object.position.x -= 0.1
      //       isChange = true;
      //     }
      //   }
      // });

      requestAnimationFrame(animate);
      var delta = clock.getDelta();
      mixer.update(delta);
      renderer.render(scene, camera);
    }
  };
  return <div id="model" />;
}

export default App;
