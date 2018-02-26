"use strict";

Physijs.scripts.worker = "libs/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";
var scale = chroma.scale(["blue", "white"]);
function init() {
  var scene = new Physijs.Scene({ reportSize: 10, fixedTimeStep: 1 / 60 });
  scene.setGravity(new THREE.Vector3(0, -20, 0));

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(105, 85, 85);
  camera.lookAt(scene.position);
  scene.add(camera);

  addSpotLight(scene);
  var loader = new THREE.TextureLoader();
  addGround(scene, loader);

  addShapes(scene);
  var controls = new THREE.OrbitControls(camera);
  update(scene, camera, renderer, controls);
}

function addSpotLight(scene) {
  var light = new THREE.SpotLight(0xffffff);
  light.position.set(40, 50, 100);
  light.intensity = 1.5;
  scene.add(light);
}
function addGround(scene, loader) {
  var material = new Physijs.createMaterial(
    new THREE.MeshLambertMaterial({
      map: loader.load("textures/grasslight-big.jpg")
    }),
    0.3, //high friction
    0.8 //low restitution
  );

  var geo = new THREE.PlaneGeometry(120, 100, 100, 100);
  for (let i = 0; i < geo.vertices.length; i++) {
    var vertex = geo.vertices[i];
    var value = noise.simplex3(vertex.x / 10, vertex.y / 10, 0);
    vertex.z = value * 3;
  }
  geo.computeFaceNormals();
  geo.computeVertexNormals();
  var ground = new Physijs.HeightfieldMesh(geo, material, 0, 100, 100);
  ground.rotation.x = -Math.PI / 2;
  ground.rotation.y = 0.4;

  scene.add(ground);
}
function addShapes(scene) {
  var material = new Physijs.createMaterial(
    new THREE.MeshLambertMaterial({ color: scale(Math.random()).hex() }),
    0.5,
    0.7
  );

  var controls = new function() {
    this.addSphereMesh = function() {
      var sphere = new Physijs.SphereMesh(
        new THREE.SphereGeometry(3, 20),
        material
      );
      setPosition(sphere);
      scene.add(sphere);
    };
    this.addBoxMesh = function() {
      var cube = new Physijs.BoxMesh(new THREE.BoxGeometry(4, 2, 6), material);
      setPosition(cube);
      scene.add(cube);
    };
    this.addCylinderMesh = function() {
      var cylinder = new Physijs.CylinderMesh(
        new THREE.CylinderGeometry(2, 2, 6),
        material
      );
      setPosition(cylinder);
      scene.add(cylinder);
    };
    this.addConeMesh = function() {
      var cone = new Physijs.ConeMesh(
        new THREE.CylinderGeometry(0, 3, 7, 20, 10),
        material
      );
      setPosition(cone);
      scene.add(cone);
    };
    this.addPlaneMesh = function() {
      var plane = new Physijs.PlaneMesh(
        new THREE.PlaneGeometry(5, 5, 10, 10),
        material
      );
      setPosition(plane);
      scene.add(plane);
    };
    this.addConvexMesh = function() {
      var convex = new Physijs.ConvexMesh(
        new THREE.TorusKnotGeometry(0.5, 0.3, 64, 8, 2, 3, 10),
        material
      );
      setPosition(convex);
      scene.add(convex);
    };
    this.addCapsuleMesh = function() {
      var merged = new THREE.Geometry();
      var cylinder = new THREE.CylinderGeometry(2, 2, 6);
      var top = new THREE.SphereGeometry(2);
      var bottom = new THREE.SphereGeometry(2);

      var matrix = new THREE.Matrix4();
      matrix.makeTranslation(0, 3, 0);
      top.applyMatrix(matrix);

      var matrix = new THREE.Matrix4();
      matrix.makeTranslation(0, -3, 0);
      bottom.applyMatrix(matrix);

      merged.merge(top);
      merged.merge(cylinder);
      merged.merge(bottom);

      var capsule = new Physijs.CapsuleMesh(merged, material);
      setPosition(capsule);

      scene.add(capsule);
    };
  }();

  var gui = new dat.GUI();
  gui.add(controls, "addSphereMesh");
  gui.add(controls, "addBoxMesh");
  gui.add(controls, "addCylinderMesh");
  gui.add(controls, "addConeMesh");
  gui.add(controls, "addPlaneMesh");
  gui.add(controls, "addConvexMesh");
  gui.add(controls, "addCapsuleMesh");
}
function setPosition(mesh) {
  mesh.position.set(Math.random() * 20 - 45, 40, Math.random() * 20 - 5);
  mesh.rotation.set(
    Math.random() * 2 * Math.PI,
    Math.random() * 2 * Math.PI,
    Math.random() * 2 * Math.PI
  );
}
function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
  scene.simulate(undefined, 1);
}
init();
