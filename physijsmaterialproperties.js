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
  addGUIControl(scene);

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
    new THREE.MeshPhongMaterial({
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

function addGUIControl(scene) {
  var controls = new function () {
    this.cubeRestitution = 0.4;
    this.cubeFriction = 0.4;
    this.sphereRestitution = 0.9;
    this.sphereFriction = 0.1;
    this.addSpheres = function () {
      var colorSphere = scale(Math.random()).hex();
      var sphereMaterial = Physijs.createMaterial(
        new THREE.MeshPhongMaterial({
          color: colorSphere,
          transparent: true,
          opacity: 0.8
        })
      )
      for (let i = 0; i < 5; i++) {
        var sphere = new Physijs.SphereMesh(
          new THREE.SphereGeometry(2, 20),
          sphereMaterial,
          controls.sphereFriction,
          controls.sphereRestitution
        );
        sphere.position.set(Math.random() * 50 - 25, 20 + Math.random() * 5, Math.random() * 50 - 25);
        scene.add(sphere);
      }
    };
    this.addCubes = function () {
      var cubeColor = scale(Math.random()).hex();
      var cubeMaterial = new Physijs.createMaterial(
        new THREE.MeshPhongMaterial({
          color: cubeColor,
          transparent: true,
          opacity: 0.8
        })
      );
      for (let j = 0; j < 5; j++) {
        var cube = new Physijs.BoxMesh(
          new THREE.BoxGeometry(4, 4, 4),
          cubeMaterial,
          controls.cubeFriction,
          controls.cubeRestitution
        )
        cube.position.set(Math.random() * 50 - 25, 20 + Math.random() * 5, Math.random() * 50 - 25);
        cube.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
        scene.add(cube);
      }
    };
  }();

  var gui = new dat.GUI();
  gui.add(controls, 'cubeRestitution', 0, 1);
  gui.add(controls, 'cubeFriction', 0, 1);
  gui.add(controls, 'sphereRestitution', 0, 1);
  gui.add(controls, 'sphereFriction', 0, 1);
  gui.add(controls, 'addSpheres');
  gui.add(controls, 'addCubes');
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
  requestAnimationFrame(function () {
    update(scene, camera, renderer, controls);
  });
}

init();