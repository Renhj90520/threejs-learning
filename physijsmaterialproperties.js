"use strict";
Physijs.scripts.worker = "libs/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";
var scale = chroma.scale(["white", "blue", "red", "yellow"]);
function init() {
  var scene = new Physijs.Scene();
  scene.setGravity(new THREE.Vector3(0, -90, 0));

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(80, 60, 80);
  camera.lookAt(scene.position);
  scene.add(camera);

  addSpotLight(scene);
  var loader = new THREE.TextureLoader();
  addGround(scene, loader);
  var axesHelper = new THREE.AxesHelper(80);
  scene.add(axesHelper);
  var controls = new THREE.OrbitControls(camera);

  update(scene, camera, renderer, controls);
}
function addSpotLight(scene) {
  var light = new THREE.SpotLight(0xffffff);
  light.position.set(20, 100, 50);
  scene.add(light);
}

function addGround(scene, loader) {
  var woodTexture = loader.load("textures/wood-2.jpg");
  var material = new Physijs.createMaterial(
    new THREE.MeshPhongMaterial(
      {
        map: woodTexture
      },
      0.9,
      0.6
    )
  );
  material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
  material.map.repeat.set(4, 8);

  var ground = new Physijs.BoxMesh(
    new THREE.BoxGeometry(60, 1, 130),
    material,
    0
  );
  var borderLeft = new Physijs.BoxMesh(
    new THREE.BoxGeometry(2, 6, 130),
    material,
    0
  );
  borderLeft.position.set(-31, 2, 0);
  ground.add(borderLeft);

  var borderRight = new Physijs.BoxMesh(
    new THREE.BoxGeometry(2, 6, 130),
    material,
    0
  );
  borderRight.position.set(31, 2, 0);
  ground.add(borderRight);

  var borderBottom = new Physijs.BoxMesh(
    new THREE.BoxGeometry(64, 6, 2),
    material,
    0
  );
  borderBottom.position.set(0, 2, 65);
  ground.add(borderBottom);

  var borderTop = new Physijs.BoxMesh(
    new THREE.BoxGeometry(64, 6, 2),
    material,
    0
  );
  borderTop.position.set(0, 2, -65);
  ground.add(borderTop);
  ground.name = "ground";
  scene.add(ground);
}
var direction = 1;
var step = 0;
function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);

  var ground = scene.getObjectByName("ground");
  if (ground) {
    step += 0.002 * direction;
    ground.rotation.x = step;
    if (step < -0.4) direction = 1;
    if (step > 0.4) direction = -1;
    ground.__dirtyRotation = true;
    scene.simulate(undefined, 1);
  }
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}

init();
