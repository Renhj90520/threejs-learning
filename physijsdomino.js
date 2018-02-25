"use strict";
var scale = chroma.scale(["green", "white"]);
Physijs.scripts.worker = "libs/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

function init() {
  var scene = new Physijs.Scene();
  scene.setGravity(new THREE.Vector3(0, -50, 0));
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.set(50, 30, 50);
  camera.lookAt(new THREE.Vector3(10, 0, 10));
  scene.add(camera);

  //   var cameraHelper = new THREE.CameraHelper(camera);
  //   scene.add(cameraHelper);

  addSpotLight(scene);
  var loader = new THREE.TextureLoader();
  addGround(scene, loader);
  var points = getPoints();
  var stones = [];
  points.forEach(function(point) {
    var stoneGeo = new THREE.BoxGeometry(0.6, 6, 2);
    var stone = new Physijs.BoxMesh(
      stoneGeo,
      Physijs.createMaterial(
        new THREE.MeshPhongMaterial({
          color: scale(Math.random()).hex(),
          transparent: true,
          opacity: 0.8
        })
      )
    );
    stone.position.copy(point);
    stone.lookAt(scene.position);
    stone.__dirtyRotation = true;
    stone.position.y = 3.5;

    scene.add(stone);
    stones.push(stone);
  });

  stones[0].rotation.x = 0.2;
  stones[0].__dirtyRotation = true;
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
  var material = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({ map: woodTexture }),
    0.9,
    0.3
  );
  var ground = new Physijs.BoxMesh(
    new THREE.BoxGeometry(60, 1, 60),
    material,
    0
  );

  var borderLeft = new Physijs.BoxMesh(
    new THREE.BoxGeometry(2, 3, 60),
    material,
    0
  );
  borderLeft.position.set(-31, 2, 0);
  ground.add(borderLeft);

  var borderRight = new Physijs.BoxMesh(
    new THREE.BoxGeometry(2, 3, 60),
    material,
    0
  );
  borderRight.position.set(31, 2, 0);
  ground.add(borderRight);
  var borderBottom = new Physijs.BoxMesh(
    new THREE.BoxGeometry(64, 3, 2),
    material,
    0
  );
  borderBottom.position.set(0, 2, 30);
  ground.add(borderBottom);

  var borderTop = new Physijs.BoxMesh(
    new THREE.BoxGeometry(64, 3, 2),
    material,
    0
  );
  borderTop.position.set(0, 2, -30);
  ground.add(borderTop);
  scene.add(ground);
}
function getPoints() {
  var points = [];
  var r = 27;
  var cX = 0,
    cY = 0;

  var circleOffset = 0;
  for (let i = 0; i < 1000; i += 6 + circleOffset) {
    circleOffset = 4.5 * (i / 360);

    var x = r / 1440 * (1440 - i) * Math.cos(i * (Math.PI / 180)) + cX;
    var z = r / 1440 * (1440 - i) * Math.sin(i * (Math.PI / 180)) + cY;
    var y = 0;

    points.push(new THREE.Vector3(x, y, z));
  }

  return points;
}
function update(scene, camera, renderer, controls) {
  renderer.render(scene, camera);
  controls.update();

  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });

  scene.simulate(undefined, 1);
}
init();
