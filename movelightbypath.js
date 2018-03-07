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

  camera.position.set(100, 100, 100);
  camera.lookAt(scene.position);

  addPlane(scene);
  addPointLight(scene);
  addDirectionalLight(scene);
  path = createPath(scene);
  update(scene, camera, renderer);
}
var path;
function addPlane(scene) {
  var planeGeo = new THREE.PlaneGeometry(2000, 2000, 20, 20);
  var planeMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
  var loader = new THREE.TextureLoader();
  planeMat.map = loader.load("textures/Brick-2399.jpg");
  planeMat.bumpMap = loader.load("textures/Brick-2399-bump-map.jpg");

  planeMat.map.wrapS = planeMat.map.wrapT = THREE.RepeatWrapping;
  planeMat.map.repeat.set(28, 29);

  planeMat.bumpMap.wrapS = planeMat.bumpMap.wrapT = THREE.RepeatWrapping;
  planeMat.bumpMap.repeat.set(28, 28);

  var plane = new THREE.Mesh(planeGeo, planeMat);
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
}

function addPointLight(scene) {
  var light = new THREE.PointLight(0xff0000);
  light.position.set(-100, 20, 100);
  light.name = "pointlight";
  light.intensity = 2;
  light.distance = 60;

  var sphereGeo = new THREE.SphereGeometry(0.2);
  var sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  var sphere = new THREE.Mesh(sphereGeo, sphereMat);

  light.add(sphere);
  scene.add(light);
}
function createPath(scene) {
  var curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-100, 20, 100),
    new THREE.Vector3(-40, 20, 20),
    new THREE.Vector3(0, 20, -100),
    new THREE.Vector3(20, 20, -100),
    new THREE.Vector3(40, 20, 100),
    new THREE.Vector3(70, 20, 10),
    new THREE.Vector3(100, 20, 30),
    new THREE.Vector3(-100, 20, 100)
  ]);
  var curvePoints = curve.getPoints(50);
  var geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
  var material = new THREE.LineBasicMaterial({ color: 0xff00f0 });
  geometry.vertices = curvePoints;
  var line = new THREE.Line(geometry, material);
  scene.add(line);
  return curve;
}

function addDirectionalLight(scene) {
  var light = new THREE.DirectionalLight();
  light.position.set(70, 40, -50);

  scene.add(light);
}

var pos = 0;
function update(scene, camera, renderer) {
  renderer.render(scene, camera);
  var pointlight = scene.getObjectByName("pointlight");
  if (pointlight && path) {
    if (pos <= 1) {
      pointlight.position.copy(path.getPointAt(pos));
      pos += 0.001;
    } else {
      pos = 0;
    }
  }
  requestAnimationFrame(function() {
    update(scene, camera, renderer);
  });
}

init();
