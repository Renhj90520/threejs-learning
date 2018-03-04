var camera;
var renderer;

function init() {
  var scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  var cameraMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.1),
    new THREE.MeshBasicMaterial()
  );
  camera.position.set(15, 15, 15);
  cameraMesh.position.copy(camera.position);
  camera.lookAt(scene.position);
  addDirectionalLight(scene);
  var cube = addCube(scene);
  var guiControls = {
    doScale: function() {
      cube.geometry.computeBoundingBox();
      var distance =
        camera.position.distanceTo(cube.position) -
        cube.geometry.boundingSphere.radius;
      var realHeight = Math.abs(
        cube.geometry.boundingBox.max.y - cube.geometry.boundingBox.min.y
      );
      var fov =
        2 * Math.atan(realHeight * 1.3 / (2 * distance)) * (180 / Math.PI);
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  };
  var gui = new dat.GUI();
  gui.add(guiControls, "doScale");
  var axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);

  update(scene, camera, renderer);
}

function addDirectionalLight(scene) {
  var light = new THREE.DirectionalLight();
  light.position.set(40, 40, 20);
  scene.add(light);

  //   var cameraHelper = new THREE.CameraHelper(light.shadow.camera);
  //   scene.add(cameraHelper);
}

function addCube(scene) {
  var cubeGeo = new THREE.BoxGeometry(2, 2, 2);
  var loader = new THREE.TextureLoader();
  var map = loader.load("textures/floor_2-1024x1024.png");
  var cubeMaterial = new THREE.MeshLambertMaterial({
    map: map
  });
  var cube = new THREE.Mesh(cubeGeo, cubeMaterial);
  cube.position.set(0, 0, 0);
  cube.name = "cube";
  scene.add(cube);
  return cube;
}

function update(scene, camera, renderer) {
  renderer.render(scene, camera);

  requestAnimationFrame(function() {
    update(scene, camera, renderer);
  });
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onResize, false);
init();
