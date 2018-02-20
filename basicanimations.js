var camera, scene;
var cube, sphere, cylinder;
function init() {
  scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xeeeeee));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(-30, 40, 40);

  var controls = new THREE.OrbitControls(camera);
  addPlane(scene);
  addSpotLight(scene);
  addCube(scene);
  addSphere(scene);
  addCylinder(scene);

  document.addEventListener("mousedown", onDocumentOnMouseDown, false);
  document.addEventListener("mousemove", onDocumentOnMouseMove, false);

  var axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);

  update(scene, camera, renderer, controls);
}

function addAmbientLight(scene) {
  var light = new THREE.AmbientLight(0x0c0c0c);
  scene.add();
}

function addPlane(scene) {
  var planeGeo = new THREE.PlaneGeometry(60, 20);
  var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  var plane = new THREE.Mesh(planeGeo, planeMaterial);

  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;
  plane.side = THREE.DoubleSide;

  scene.add(plane);
}

function addSpotLight(scene) {
  var light = new THREE.SpotLight(0xffffff);
  light.position.set(-40, 60, -10);
  light.castShadow = true;

  scene.add(light);
  var cameraHelper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(cameraHelper);
}
var scaleStep = 0;
var moveStep = 0;
function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);
  var cube = scene.getObjectByName("cube");
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;

  var cylinder = scene.getObjectByName("cylinder");
  scaleStep += 0.03;
  var scaleX = Math.abs(Math.sin(scaleStep / 4));
  var scaleY = Math.abs(Math.cos(scaleStep / 5));
  var scaleZ = Math.abs(Math.sin(scaleStep / 7));
  cylinder.scale.set(scaleX, scaleY, scaleZ);

  var sphere = scene.getObjectByName("sphere");
  moveStep += 0.03;
  sphere.position.x = 20 + 10 * Math.cos(moveStep);
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(moveStep));
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}

function addCube(scene) {
  var cubeGeo = new THREE.BoxGeometry(4, 4, 4);
  var cubeMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  cube = new THREE.Mesh(cubeGeo, cubeMat);
  cube.position.set(-9, 5, 0);
  cube.castShadow = true;
  cube.name = "cube";

  scene.add(cube);
}

function addSphere(scene) {
  var sphereGeo = new THREE.SphereGeometry(4, 20, 20);
  var sphereMat = new THREE.MeshLambertMaterial({ color: 0x7777ff });
  sphere = new THREE.Mesh(sphereGeo, sphereMat);

  sphere.position.set(20, 0, 2);
  sphere.castShadow = true;
  sphere.name = "sphere";
  scene.add(sphere);
}

function addCylinder(scene) {
  var cylinderGeo = new THREE.CylinderGeometry(2, 2, 20);
  var cylinderMat = new THREE.MeshLambertMaterial({ color: 0x77ff77 });
  cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);

  cylinder.position.set(0, 0, 1);
  cylinder.castShadow = true;
  cylinder.name = "cylinder";

  scene.add(cylinder);
}
function onDocumentOnMouseDown(event) {
  var vector = new THREE.Vector3(
    event.clientX / window.innerWidth * 2 - 1,
    -event.clientY / window.innerHeight * 2 + 1,
    0.5
  );

  vector = vector.unproject(camera);
  var raycaster = new THREE.Raycaster(
    camera.position,
    vector.sub(camera.position).normalize()
  );

  var intersects = raycaster.intersectObjects([cube, sphere, cylinder]);
  if (intersects.length > 0) {
    intersects[0].object.material.transparent = true;
    intersects[0].object.material.opacity = 0.1;
  }
}

var tube;
function onDocumentOnMouseMove(event) {
  var vector = new THREE.Vector3(
    event.clientX / window.innerWidth * 2 - 1,
    -event.clientY / window.innerHeight * 2 + 1,
    0.5
  );

  vector = vector.unproject(camera);
  var raycaster = new THREE.Raycaster(
    camera.position,
    vector.sub(camera.position).normalize()
  );

  var intersects = raycaster.intersectObjects([sphere, cube, cylinder]);
  if (intersects.length > 0) {
    var points = [];
    points.push(new THREE.Vector3(-30, 39.8, 40));
    points.push(intersects[0].point);
    var rayMat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.6
    });
    var tubeGeo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      60,
      0.001
    );
    if (tube) scene.remove(tube);

    tube = new THREE.Mesh(tubeGeo, rayMat);
    scene.add(tube);
  }
}
init();
