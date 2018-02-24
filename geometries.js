var GEO_TYPES = [
  "box",
  "cone",
  "cylinder",
  "octahedron",
  "sphere",
  "tetrahedron",
  "torus",
  "torusKnot"
];
function init() {
  var scene = new THREE.Scene();
  var clock = new THREE.Clock();
  var stats = new Stats();

  //   var objMaterial = getMaterial("standard", "rgb(255,255,255)");
  var objMaterial = getMaterial("basic", "rgb(255,255,255)");

  var geoTypes = GEO_TYPES;
  geoTypes.forEach(function(type) {
    var geo = getGeometry(type, 5, objMaterial);

    scene.add(geo);
  });

  var lightLeft = getSpotLight(1, "rgb(225,220,180)");
  var lightRight = getSpotLight(1, "rgb(225,220,180)");
  var lightBottom = getPointLight(0.33, "rgb(225,220,180)");

  lightLeft.position.x = -5;
  lightLeft.position.y = 2;
  lightLeft.position.z = -4;

  lightRight.position.x = 5;
  lightRight.position.y = 2;
  lightRight.position.z = -4;

  lightBottom.position.x = 0;
  lightBottom.position.y = 10;
  lightBottom.position.z = 0;

  var path = "cubemap";
  var format = ".jpg";
  var fileNames = ["px", "nx", "py", "ny", "pz", "nz"];

  var reflectionCube = new THREE.CubeTextureLoader().load(
    fileNames.map(function(name) {
      return path + "/" + name + format;
    })
  );
  scene.background = reflectionCube;

  //   var loader = new THREE.TextureLoader();
  //   objMaterial.roughnessMap = loader.load("/textures/scratch.jpg");
  //   objMaterial.bumpMap = loader.load("/textures/scratch.jpg");
  //   objMaterial.bumpScale = 0.01;
  objMaterial.envMap = reflectionCube;

  //   objMaterial.roughness = 0.5;
  objMaterial.metalness = 0.7;

  //   var maps = ["bumpMap", "roughnessMap"];
  //   maps.forEach(function(map) {
  //     var texture = objMaterial[map];
  //     texture.wrapS = THREE.RepeatWrapping;
  //     texture.wrapT = THREE.RepeatWrapping;
  //     texture.repeat.set(1, 1);
  //   });

  var particleGeo = new THREE.Geometry();
  var particleMat = new THREE.PointsMaterial({
    color: "#ffffff",
    size: 2,
    map: new THREE.TextureLoader().load("/textures/particle.jpg"),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  var particleCount = 2000;
  var particleDistance = 100;
  for (var i = 0; i < particleCount; i++) {
    var posX = (Math.random() - 0.5) * particleDistance;
    var posY = (Math.random() - 0.5) * particleDistance;
    var posZ = (Math.random() - 0.5) * particleDistance;
    var particle = new THREE.Vector3(posX, posY, posZ);

    particleGeo.vertices.push(particle);
  }

  var particleSystem = new THREE.Points(particleGeo, particleMat);
  particleSystem.name = "particleSystem";
  scene.add(particleSystem);
  scene.add(lightLeft);
  scene.add(lightRight);
  scene.add(lightBottom);

  var cameraGroup = new THREE.Group();
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 20;
  camera.position.x = 0;
  camera.position.y = 5;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  cameraGroup.add(camera);
  cameraGroup.name = "sceneCameraGroup";
  scene.add(cameraGroup);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(stats.dom);
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  update(renderer, scene, camera, clock, controls, stats);

  return scene;
}

function getGeometry(type, size, material) {
  var geometry;
  var segmentMultiplier = 1;
  switch (type) {
    case "box":
      geometry = new THREE.BoxGeometry(size, size, size);
      break;

    case "cone":
      geometry = new THREE.ConeGeometry(size, size, 256 * segmentMultiplier);
      break;

    case "cylinder":
      geometry = new THREE.CylinderGeometry(
        size,
        size,
        size,
        32 * segmentMultiplier
      );
      break;

    case "octahedron":
      geometry = new THREE.OctahedronGeometry(size);
      break;

    case "sphere":
      geometry = new THREE.SphereGeometry(
        size,
        32 * segmentMultiplier,
        32 * segmentMultiplier
      );
      break;

    case "tetrahedron":
      geometry = new THREE.TetrahedronGeometry(size);
      break;

    case "torus":
      geometry = new THREE.TorusGeometry(
        size / 2,
        size / 4,
        16 * segmentMultiplier,
        100 * segmentMultiplier
      );
      break;

    case "torusKnot":
      geometry = new THREE.TorusKnotGeometry(
        size / 2,
        size / 6,
        256 * segmentMultiplier,
        100 * segmentMultiplier
      );
      break;

    default:
      break;
  }

  var obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  obj.name = type;
  return obj;
}

function getMaterial(type, color) {
  var materialOptions = {
    color: color === undefined ? "rgb(255,255,255)" : color
    // wireframe: true
  };

  switch (type) {
    case "basic":
      return new THREE.MeshBasicMaterial(materialOptions);

    case "lambert":
      return new THREE.MeshLambertMaterial(materialOptions);

    case "phong":
      return new THREE.MeshPhongMaterial(materialOptions);

    case "standard":
      return new THREE.MeshStandardMaterial(materialOptions);

    default:
      return new THREE.MeshBaiscMaterial(materialOptions);
  }
}

function getPointLight(intensity, color) {
  var light = new THREE.PointLight(color, intensity);
  light.castShadow = true;
  return light;
}
function getSpotLight(intensity, color) {
  color = color === undefined ? "rgb(255,255,255)" : color;
  var light = new THREE.SpotLight(color, intensity);
  light.castShadow = true;
  light.penumbra = 0.5;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 500;
  light.shadow.camera.fov = 30;
  light.shadow.bias = 0.001;

  return light;
}

function update(renderer, scene, camera, clock, controls, stats) {
  controls.update();
  stats.update();
  var sceneCameraGroup = scene.getObjectByName("sceneCameraGroup");
  if (sceneCameraGroup) {
    sceneCameraGroup.rotation.y += 0.005;
  }

  var geoTypes = GEO_TYPES;
  var currentIndex = Math.floor((clock.getElapsedTime() / 4) % geoTypes.length);

  geoTypes.forEach(function(geo, index) {
    var currentObj = scene.getObjectByName(geo);
    if (index === currentIndex) {
      currentObj.visible = true;
    } else {
      currentObj.visible = false;
    }
  });

  renderer.render(scene, camera);

  var particleSystem = scene.getObjectByName("particleSystem");
  particleSystem.geometry.vertices.forEach(function(particle) {
    particle.x += (Math.random() - 1) * 0.1;
    particle.y += (Math.random() - 0.75) * 0.1;
    particle.z += Math.random() * 0.1;

    if (particle.x < -50) {
      particle.x = 50;
    }
    if (particle.y < -50) {
      particle.y = 50;
    }
    if (particle.z < -50) {
      particle.z = 50;
    }
    if (particle.z > 50) {
      particle.z = 50;
    }
  });
  particleSystem.geometry.verticesNeedUpdate = true;
  requestAnimationFrame(function() {
    update(renderer, scene, camera, clock, controls, stats);
  });
}
var scene = init();
