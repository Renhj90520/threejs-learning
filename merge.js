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

  camera.position.set(0, 40, 50);

  addCubes(scene);
  var controls = new THREE.OrbitControls(camera);

  update(scene, camera, renderer, controls);
}

function addCubes(scene) {
  var merger = new THREE.Geometry();
  var cubeMaterial = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0.5
  });
  for (let i = 0; i < 500; i++) {
    var cube = createCube(cubeMaterial);
    cube.updateMatrix();
    merger.merge(cube.geometry, cube.matrix);
  }

  var mergeMesh = new THREE.Mesh(merger, cubeMaterial);
  scene.add(mergeMesh);
}
function createCube(cubeMaterial) {
  var cubeGeo = new THREE.BoxGeometry(1, 1, 1);

  var cube = new THREE.Mesh(cubeGeo, cubeMaterial);
  cube.castShadow = true;
  cube.position.x = -60 + Math.round(Math.random() * 100);
  cube.position.y = Math.round(Math.random() * 10);
  cube.position.z = -150 + Math.round(Math.random() * 175);

  return cube;
}
function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}

init();
