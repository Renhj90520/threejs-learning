function init() {
  var scene = new THREE.Scene();
  var gui = new dat.GUI();

  //   var sphereMaterial = getMaterial("basic", "rgb(255,0,0)");
  //   var sphereMaterial = getMaterial("lambert", "rgb(255,255,255)");
  //   var sphereMaterial = getMaterial("phong", "rgb(255,255,255)");
  var sphereMaterial = getMaterial("standard", "rgb(255,255,255)");
  var sphere = getSphere(sphereMaterial, 1, 24);

  //   var planeMaterial = getMaterial("basic", "rgb(0,0,255)");
  //   var planeMaterial = getMaterial("lambert", "rgb(255,255,255)");
  //   var planeMaterial = getMaterial("phong", "rgb(255,255,255)");
  var planeMaterial = getMaterial("standard", "rgb(255,255,255)");
  var plane = getPlane(planeMaterial, 300);

  var lightLeft = getSpotLight(1, "rgb(255,220,180)");
  var lightRight = getSpotLight(1, "rgb(225,220,180)");

  sphere.position.y = sphere.geometry.parameters.radius;
  plane.rotation.x = Math.PI / 2;

  lightLeft.position.x = -5;
  lightLeft.position.y = 2;
  lightLeft.position.z = -4;

  lightRight.position.x = 5;
  lightRight.position.y = 2;
  lightRight.position.z = -4;

  var path = "/cubemap/";
  var format = ".jpg";
  var urls = [
    path + "px" + format,
    path + "nx" + format,
    path + "py" + format,
    path + "ny" + format,
    path + "pz" + format,
    path + "nz" + format
  ];

  var reflectionCube = new THREE.CubeTextureLoader().load(urls);
  reflectionCube.format = THREE.RGBFormat;

  scene.background = reflectionCube;

  var loader = new THREE.TextureLoader();
  planeMaterial.map = loader.load("/textures/concrete.JPG"); //concrete  checkerboard
  planeMaterial.bumpMap = loader.load("/textures/concrete.JPG");
  planeMaterial.roughnessMap = loader.load("/textures/concrete.JPG");
  planeMaterial.bumpScale = 0.01;
  planeMaterial.metalness = 0.1;
  planeMaterial.roughness = 0.7;
  planeMaterial.envMap = reflectionCube;

  sphereMaterial.roughnessMap = loader.load("/textures/fingerprints.jpg");
  var maps = ["map", "bumpMap", "roughnessMap"];
  maps.forEach(function(mapName) {
    var texture = planeMaterial[mapName];
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(15, 15);
  });
  sphereMaterial.envMap = reflectionCube;

  var folder1 = gui.addFolder("light_1");
  folder1.add(lightLeft, "intensity", 0, 10);
  folder1.add(lightLeft.position, "x", -5, 15);
  folder1.add(lightLeft.position, "y", -5, 15);
  folder1.add(lightLeft.position, "z", -5, 15);

  var folder2 = gui.addFolder("light_2");
  folder2.add(lightRight, "intensity", 0, 10);
  folder2.add(lightRight.position, "x", -5, 15);
  folder2.add(lightRight.position, "y", -5, 15);
  folder2.add(lightRight.position, "z", -5, 15);

  var folder3 = gui.addFolder("materials");
  //   folder3.add(sphereMaterial, "shininess", 0, 1000);
  //   folder3.add(planeMaterial, "shininess", 0, 1000);
  folder3.add(sphereMaterial, "roughness", 0, 1);
  folder3.add(planeMaterial, "roughness", 0, 1);
  folder3.add(sphereMaterial, "metalness", 0, 1);
  folder3.add(planeMaterial, "metalness", 0, 1);
  folder3.open();

  scene.add(sphere);
  scene.add(plane);
  scene.add(lightLeft);
  scene.add(lightRight);

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.z = 7;
  camera.position.x = -2;
  camera.position.y = 7;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera, renderer.domElelment);
  update(renderer, scene, camera, controls);
  return scene;
}

function getSphere(material, size, segments) {
  var geometry = new THREE.SphereGeometry(size, segments, segments);
  var obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  return obj;
}

function getPlane(material, size) {
  var plane = new THREE.PlaneGeometry(size, size);
  material.side = THREE.DoubleSide;

  var mesh = new THREE.Mesh(plane, material);
  mesh.receiveShadow = true;
  return mesh;
}

function getSpotLight(intensity, color) {
  color = color === undefined ? "rgb(255,255,255)" : color;
  var light = new THREE.SpotLight(color, intensity);
  light.castShadow = true;
  light.penumbra = 0.5;

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.bias = 0.001;

  return light;
}

function getMaterial(type, color) {
  var selectedMaterial;
  var materialOptions = {
    color: color === undefined ? "rgb(255,255,255)" : color
  };

  switch (type) {
    case "basic":
      selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
      break;

    case "lambert":
      selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
      break;

    case "phong":
      selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
      break;

    case "standard":
      selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
      break;

    default:
      selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
      break;
  }

  return selectedMaterial;
}

function update(renderer, scene, camera, controls) {
  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(function() {
    update(renderer, scene, camera, controls);
  });
}
var scene = init();
