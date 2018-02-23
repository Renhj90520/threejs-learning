function init() {
  var scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xeeeeee);

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 12, 28);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  addAmbientLight(scene);
  addDirectionalLight(scene);
  var loader = new THREE.DDSLoader();
  addCube(scene, loader, "textures/seafloor.dds", -12, 0);
  addSphere(scene, loader, "textures/seafloor.dds", 0, 0);
  addIcosahedron(scene, loader, "textures/seafloor.dds", 12, 0);

  var controls = new THREE.OrbitControls(camera);
  update(scene, camera, renderer, controls);
}

function addAmbientLight(scene) {
  var light = new THREE.AmbientLight(0x141414);
  scene.add(light);
}
function addDirectionalLight(scene) {
  var light = new THREE.DirectionalLight();
  light.position.set(0, 30, 20);
  scene.add(light);
}
function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}

function addCube(scene, loader, url, x, y) {
  var geo = new THREE.BoxGeometry(5, 5, 5);
  var cube = createMesh(geo, loader, url);
  cube.position.x = x;
  cube.position.y = y;
  scene.add(cube);
}
function addSphere(scene, loader, url, x, y) {
  var geo = new THREE.SphereGeometry(5, 20, 20);
  var sphere = createMesh(geo, loader, url);
  sphere.position.x = x;
  sphere.position.y = y;
  scene.add(sphere);
}
function addIcosahedron(scene, loader, url, x, y) {
  var geo = new THREE.IcosahedronGeometry(5, 0);
  var icosahedron = createMesh(geo, loader, url);
  icosahedron.position.x = x;
  icosahedron.position.y = y;
  scene.add(icosahedron);
}
function createMesh(geo, loader, url) {
  var texture = loader.load(url);
  var material = new THREE.MeshLambertMaterial();
  material.map = texture;

  var mesh = new THREE.Mesh(geo, material);
  return mesh;
}

init();
