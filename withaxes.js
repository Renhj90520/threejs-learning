var options = {
  rotationSpeed: 0.02,
  bounceSpeed: 0.03
};
function init() {
  var scene = new THREE.Scene();
  // scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
  scene.for = new THREE.FogExp2(0xffffff, 0.01);

  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xeeeeee);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  var gui = new dat.GUI();
  gui.add(options, "rotationSpeed", 0, 1);
  gui.add(options, "bounceSpeed", 0, 1);

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 30;
  camera.lookAt(scene.position);
  var controls = new THREE.OrbitControls(camera);

  addAxes(scene);
  addPlane(scene);
  addSphere(scene, 4, 0x7777ff);
  addCube(scene, 4, 0xff0000);
  addSpotLight(scene, 0xffffff, 1);

  update(scene, renderer, camera, controls);

  return scene;
}

var step = 0;
function update(scene, renderer, camera, controls) {
  renderer.render(scene, camera);
  controls.update();
  var cube = scene.getObjectByName("cube");
  cube.rotation.y += options.rotationSpeed;

  step += options.bounceSpeed;
  var sphere = scene.getObjectByName("sphere");
  sphere.position.x = 20 + 10 * Math.cos(step);
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

  requestAnimationFrame(function() {
    update(scene, renderer, camera, controls);
  });
}

function addAxes(scene) {
  var axes = new THREE.AxesHelper(20);
  scene.add(axes);
}

function addPlane(scene) {
  var planeGeo = new THREE.PlaneGeometry(60, 20, 1, 1);
  // var planeMat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
  var planeMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
  var plane = new THREE.Mesh(planeGeo, planeMat);

  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;
  plane.receiveShadow = true;
  scene.add(plane);
}

function addSphere(scene, size, color) {
  var sphereGeo = new THREE.SphereGeometry(size, 20, 20);
  // var sphereMat = new THREE.MeshBasicMaterial({
  //   color: color,
  //   wireframe: true
  // });
  var sphereMat = new THREE.MeshLambertMaterial({
    color: color
  });
  var sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.position.x = 20;
  sphere.position.y = 4;
  sphere.position.z = 2;
  sphere.castShadow = true;
  sphere.name = "sphere";
  scene.add(sphere);
}

function addCube(scene, size, color) {
  var cubeGeo = new THREE.BoxGeometry(size, size, size);
  // var cubeMat = new THREE.MeshBasicMaterial({ color: color, wireframe: true });
  var cubeMat = new THREE.MeshLambertMaterial({
    color: color
  });
  var cube = new THREE.Mesh(cubeGeo, cubeMat);
  cube.position.x = -4;
  cube.position.y = 3;
  cube.position.z = 0;
  cube.castShadow = true;
  cube.name = "cube";
  scene.add(cube);
}

function addSpotLight(scene, color, intensity) {
  var sphereGeo = new THREE.SphereGeometry(1);
  var sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  var sphere = new THREE.Mesh(sphereGeo, sphereMat);
  var light = new THREE.SpotLight(color, intensity);
  light.position.set(-10, 20, -10);
  light.add(sphere);
  light.castShadow = true;
  light.name = "spotlight";
  scene.add(light);
}

var scene = init();
