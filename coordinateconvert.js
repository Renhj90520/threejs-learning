var scene;
var renderer;
var camera;
var cube;
var sphere;
var cylinder;
function init() {
  scene = new THREE.Scene();

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
  addSphere(scene);
  update(scene, camera, renderer);
}

function addSpotLight(scene) {
  var light = new THREE.SpotLight(0xffffff);
  light.position.set(-40, 60, -10);

  scene.add(light);
}

function addPlane(scene) {
  var planeGeo = new THREE.PlaneGeometry(200, 200, 40, 40);
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff
  });
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
  var cubeMat = new THREE.MeshLambertMaterial({
    color: 0xff0000
  });
  cube = new THREE.Mesh(cubeGeo, cubeMat);

  cube.position.set(-10, 2, 0);
  cube.name = "cube";
  scene.add(cube);
}

function addCylinder(scene) {
  var cylinderGeo = new THREE.CylinderGeometry(2, 2, 20);
  var cylinderMat = new THREE.MeshLambertMaterial({
    color: 0xffffff
  });
  cylinderMat.map = new THREE.TextureLoader().load("textures/marble.jpg");
  cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);
  cylinder.name = "cylinder";
  scene.add(cylinder);
}

function addSphere(scene) {
  var sphereGeo = new THREE.SphereGeometry(4, 20);
  var sphereMat = new THREE.MeshLambertMaterial({
    color: 0xffffff
  });
  sphereMat.map = new THREE.TextureLoader().load(
    "textures/wood_1-1024x1024.png"
  );
  sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.position.x = 10;
  sphere.position.y = 2;
  sphere.name = "sphere";
  scene.add(sphere);
}
// var projector = new THREE.Projector();
function onDocumentMouseDown(event) {
  var vector = new THREE.Vector3(
    event.clientX / window.innerWidth * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5
  );

  vector.unproject(camera);

  var rayCaster = new THREE.Raycaster(
    camera.position,
    vector.sub(camera.position).normalize()
  );

  var intersects = rayCaster.intersectObjects([sphere, cylinder, cube]);

  if (intersects.length > 0) {
    var material = intersects[0].object.material;
    material.transparent = true;
    if (material.opacity === 0.5) {
      material.opacity = 1;
    } else {
      material.opacity = 0.5;
    }
  }
}
function onDocumentMouseMove(event) {
  var vector = new THREE.Vector3(
    event.clientX / window.innerWidth * 2 - 1,
    -event.clientY / window.innerHeight * 2 + 1,
    0.5
  );
  vector.unproject(camera);
  var dir = vector.sub(camera.position).normalize();
  var distance = -camera.position.z / dir.z;
  var pos = camera.position.clone().add(dir.multiplyScalar(distance));
  var points = [];
  points.push(
    new THREE.Vector3(
      camera.position.x,
      camera.position.y - 0.2,
      camera.position.z
    )
  );
  points.push(pos);

  var mat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.6
  });

  var tubeGeometry = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points),
    60,
    0.001
  );

  if (ray) {
    scene.remove(ray);
  }
  ray = new THREE.Mesh(tubeGeometry, mat);
  scene.add(ray);
}
var ray;
document.addEventListener("mousedown", onDocumentMouseDown, false);
document.addEventListener("mousemove", onDocumentMouseMove, false);
var step = 0;

function update(scene, camera, renderer) {
  renderer.render(scene, camera);

  if (cube) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
  }
  step += 0.05;
  if (sphere) {
    sphere.position.x = 20 + 10 * Math.cos(step);
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));
  }
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
