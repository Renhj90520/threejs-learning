var clock = new THREE.Clock();
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

  camera.position.set(100, 100, 300);
  addAmbientLight(scene);
  addSpotLight(scene);
  addCity(scene);
  //   TrackballControls
  //   var controls = new THREE.TrackballControls(camera);
  //   controls.rotateSpeed = 1.0;
  //   controls.zoomSpeed = 1.0;
  //   controls.panSpeed = 1.0;
  //   controls.staticMoving = true;

  // FlyControls
  //   var controls = new THREE.FlyControls(camera);
  //   controls.movementSpeed = 25;
  //   controls.domElement = document.body;
  //   controls.rollSpeed = Math.PI / 24;
  //   controls.autoForward = true;
  //   controls.dragToLook = false;

  var controls = new THREE.FirstPersonControls(camera);
  controls.lookSpeed = 0.4;
  controls.movementSpeed = 10;
  controls.noFly = true;
  controls.lookVertial = true;
  controls.constrainVertical = true;
  controls.verticalMin = 1.0;
  controls.verticalMax = 2.0;
  controls.lon = -150;
  controls.lat = 120;
  update(scene, camera, renderer, controls);
}

function addSpotLight(scene) {
  var light = new THREE.SpotLight(0xffffff);
  light.castShadow = true;
  light.position.set(300, 300, 300);
  scene.add(light);
}
function addAmbientLight(scene) {
  var light = new THREE.AmbientLight(0x383838);
  scene.add(light);
}

function addCity(scene) {
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath("models/");
  mtlLoader.load("city.mtl", function(material) {
    material.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(material);
    objLoader.setPath("models/");
    objLoader.load("city.obj", function(object) {
      var scale = chroma.scale(["red", "green", "blue"]);
      setRandomColor(object, scale);
      scene.add(object);
    });
  });
}
function setRandomColor(object, scale) {
  var children = object.children;
  if (children && children.length > 0) {
    children.forEach(obj => {
      setRandomColor(obj, scale);
    });
  } else {
    if (object instanceof THREE.Mesh) {
      var materials = object.material;
      if (materials.length > 0) {
        materials.forEach(m => {
          handleMaterial(m, scale);
        });
      } else {
        handleMaterial(materials, scale);
      }
    }
  }
}

function handleMaterial(material, scale) {
  material.color = new THREE.Color(scale(Math.random()).hex());
  if (material.name.indexOf("building") == 0) {
    material.emissive = new THREE.Color(0x444444);
    material.transparent = true;
    material.opacity = 0.8;
  }
}
function update(scene, camera, renderer, controls) {
  //   controls.update();
  var delta = clock.getDelta();
  controls.update(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}
init();
