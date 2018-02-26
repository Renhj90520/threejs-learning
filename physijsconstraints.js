"use strict";
Physijs.scripts.worker = "libs/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";
var scale = chroma.scale(["white", "blue", "red", "yellow"]);
function init() {
  var scene = new Physijs.Scene();
  scene.setGravity(new THREE.Vector3(0, -10, 0));

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(85, 65, 65);
  camera.lookAt(scene.position);
  scene.add(camera);

  addSpotLight(scene);
  var loader = new THREE.TextureLoader();
  addGround(scene, loader);
  var controls = new THREE.OrbitControls(camera);

  var axesHelper = new THREE.AxesHelper(60);
  scene.add(axesHelper);
  update(scene, camera, renderer, controls);
}

function addSpotLight(scene) {
  var light = new THREE.SpotLight(0xffffff);
  light.position.set(20, 50, 50);
  light.castShadow = true;
  light.shadowMapDebug = true;
  light.shadowMapNear = 10;
  light.shadowMapFar = 100;
  scene.add(light);

  var cameraHelper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(cameraHelper);
}

function addGround(scene, loader) {
  var material = new Physijs.createMaterial(
    new THREE.MeshPhongMaterial({
      map: loader.load("textures/floor-wood.jpg")
    }),
    0.9,
    0.7
  );

  var ground = new Physijs.BoxMesh(
    new THREE.BoxGeometry(60, 1, 65),
    material,
    0
  );
  ground.receiveShaodw = true;

  scene.add(ground);
}

function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}

init();
