var clock = new THREE.Clock();
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
  camera.position.set(250, 250, 300);
  camera.lookAt(new THREE.Vector3(100, 50, 0));
  addDirectionalLight(scene);
  var jsonLoader = new THREE.JSONLoader();
  jsonLoader.load("models/horse.js", function(geo, mat) {
    addStaticHorse(scene, geo);
    addMorphHorse(scene, geo);
  });

  var framechange = { keyframe: 0 };
  var gui = new dat.GUI();
  gui
    .add(framechange, "keyframe", 0, 15)
    .step(1)
    .onChange(function(e) {
      showFrame(scene, e);
    });
  update(scene, camera, renderer);
}
function addDirectionalLight(scene) {
  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(300, 200, 300);
  light.intensity = 1;

  var cameraHelper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(light);
  scene.add(cameraHelper);
}

var frames = [];
var currentFrame;
function addStaticHorse(scene, geometry) {
  var material = new THREE.MeshLambertMaterial({
    morphTargets: true,
    vertexColors: THREE.FaceColors
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = -100;
  frames.push(mesh);
  currentFrame = mesh;
  morphColorsToFaceColors(geometry);

  var frameMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    vertexColors: THREE.FaceColors
  });
  mesh.geometry.morphTargets.forEach(frame => {
    var geo = new THREE.Geometry();
    geo.vertices = frame.vertices;
    geo.faces = geometry.faces;

    var frameMesh = new THREE.Mesh(geo, frameMaterial);
    frameMesh.position.x = -100;
    frames.push(frameMesh);
  });
  geometry.computeVertexNormals();
  geometry.computeFaceNormals();
  geometry.computeMorphNormals();

  showFrame(scene, 0);
}

function addMorphHorse(scene, geometry) {
  var material = new THREE.MeshLambertMaterial({
    morphTargets: true,
    morphNormals: true,
    vertexColors: THREE.FaceColors
  });

  var morphAnimMesh = new THREE.MorphAnimMesh(geometry, material);
  morphAnimMesh.duration = 1000;
  morphAnimMesh.position.x = 200;
  morphAnimMesh.position.z = 0;
  morphAnimMesh.name = "morphAnimMesh";
  scene.add(morphAnimMesh);
}

function morphColorsToFaceColors(geometry) {
  if (geometry.morphColors && geometry.morphColors.length) {
    var colorMap = geometry.morphColors[0];
    for (let i = 0; i < colorMap.colors.length; i++) {
      geometry.faces[i].color = colorMap.colors[i];
      geometry.faces[i].color.offsetHSL(0, 0.3, 0);
    }
  }
}
function showFrame(scene, index) {
  scene.remove(currentFrame);
  scene.add(frames[index]);
  currentFrame = frames[index];
}
function update(scene, camera, renderer) {
  var morphAnimMesh = scene.getObjectByName("morphAnimMesh");
  var delta = clock.getDelta();
  if (morphAnimMesh) {
    morphAnimMesh.updateAnimation(delta * 1000);
    morphAnimMesh.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(function() {
    update(scene, camera, renderer);
  });
}

init();
