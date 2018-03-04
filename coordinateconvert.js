var renderer;
var camera;
function init() {
  var scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xeeeeee);

  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(-30, 40, 30);
  camera.lookAt(scene.position);
  addSpotLight(scene);
  addPlane(scene);
  addCube(scene);
  addCylinder(scene);
  update(scene, camera, renderer);
}
function addSpotLight(scene) {
  var light = new THREE.SpotLight(0xffffff);
  light.position.set(-40, 60, -10);

  scene.add(light);
}
function addPlane(scene) {
  var planeGeo = new THREE.PlaneGeometry(200, 200, 40, 40);
  var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  planeMaterial.map = new THREE.TextureLoader().load(
    "textures/camo_cloth_multicam_2048.jpg"
  );
  var plane = new THREE.Mesh(planeGeo, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.x = 15;
  scene.add(plane);
}
function addCube(scene) {
  var cubeGeo = new THREE.BoxGeometry(4, 4, 4);
  var cubeMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  var cube = new THREE.Mesh(cubeGeo, cubeMat);

  cube.position.set(-10, 2, 0);
  cube.name = "cube";
  scene.add(cube);
}
function addCylinder(scene) {
  var cylinderGeo = new THREE.CylinderGeometry(2, 2, 20);
  var cylinderMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  cylinderMat.map = new THREE.TextureLoader().load("textures/marble.jpg");
  var cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);

  scene.add(cylinder);
}

function addSphere(scene) {
  var sphereGeo = new THREE.SphereGeometry(4, 20);
  var sphereMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  sphereMat.map = new THREE.TextureLoader().load(
    "textures/wood_1-1024x1024.png"
  );
  var sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.position.x = 10;
  sphere.name = "sphere";
  scene.add(sphere);
}

function update(scene, camera, renderer) {
  renderer.render(scene, camera);

  requestAnimationFrame(function() {
    update(scene, camera, renderer);
  });
}
window.addEventListener("resize", onResize, false);
function onResize() {
  renderer.setSize(window.innerWidth, window.innerhwi);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
init();
