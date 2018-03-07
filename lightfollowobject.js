function init() {
  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(25, 26, 25);
  camera.lookAt(scene.position);

  addSpotLight(scene);
  addPlane(scene);
  addSphere(scene);

  var controls = new THREE.OrbitControls(camera);
  update(scene, camera, renderer, controls);
}

function addPlane(scene) {
  var planeGeo = new THREE.PlaneGeometry(100, 100, 20, 20);
  var planeMat = new THREE.MeshPhongMaterial();
  planeMat.map = new THREE.TextureLoader().load(
    "textures/floor_2-1024x1024.png"
  );

  planeMat.map.wrapS = planeMat.map.wrapT = THREE.RepeatWrapping;
  planeMat.map.repeat.set(8, 8);

  var plane = new THREE.Mesh(planeGeo, planeMat);
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;
  scene.add(plane);
}

function addSpotLight(scene) {
  var light = new THREE.SpotLight(0xffffff);
  light.position.set(20, 80, 30);
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  light.distance = 200;
  light.angle = 0.15;
  light.name = "light";
  var cameraHelper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(cameraHelper);
  scene.add(light);
}
function addSphere(scene) {
  var sphereGeo = new THREE.SphereGeometry(1.5, 20, 20);
  var sphereMat = new THREE.MeshPhongMaterial({
    color: 0x00abb1,
    shiness: 10,
    specular: 0xa9fcff,
    emissive: 0x006063
  });

  var sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.castShadow = true;
  sphere.position.y = 0.75 * Math.PI / 2;
  sphere.name = "sphere";
  scene.add(sphere);
}
var step = 0;
function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);
  var sphere = scene.getObjectByName("sphere");
  step += 0.02;
  sphere.position.y = 0.75 * Math.PI / 2 + 6 * Math.abs(Math.sin(step));
  sphere.position.x = 10 * Math.cos(step);

  var light = scene.getObjectByName("light");
  light.target = sphere;
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}

init();
