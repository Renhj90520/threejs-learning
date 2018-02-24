function init() {
  var scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 33);
  camera.lookAt(scene.position);

  var env = addCubeEnv(scene);
  addSphere(scene, env);
  var controls = new THREE.OrbitControls(camera);

  update(scene, camera, renderer, controls);
}

function addSphere(scene, env) {
  var sphereGeo = new THREE.SphereGeometry(4, 15, 15);
  sphereGeo.computeVertexNormals();
  var material = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  material.envMap = env;
  var sphere = new THREE.Mesh(sphereGeo, material);
  sphere.position.y = 5;
  scene.add(sphere);
}

function addCubeEnv(scene) {
  var path = "textures/";
  var format = ".jpg";
  var urls = [
    path + "posx" + format,
    path + "negx" + format,
    path + "posy" + format,
    path + "negy" + format,
    path + "posz" + format,
    path + "negz" + format
  ];

  var reflectionCube = new THREE.CubeTextureLoader().load(urls);
  reflectionCube.format = THREE.RGBFormat;

  scene.background = reflectionCube;
  return reflectionCube;
}

function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}

init();
