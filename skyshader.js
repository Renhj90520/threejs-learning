var clock;
function init() {
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0, 0, 0, 0);
  scene.fog = new THREE.Fog(scene.background, 1, 5000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );
  camera.position.z = 175;
  clock = new THREE.Clock();
  addHemisphereLight(scene);
  addGround(scene);
  addSky(scene);
  addSphere(scene);
  addDirectionalLight(scene);
  update(scene, camera, renderer);
}

function addHemisphereLight(scene) {
  var light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
  light.color.setHSL(0.6, 1, 0.6);
  light.groundColor.setHSL(0.095, 1, 0.75);
  light.name = "hemilight";
  light.position.set(0, 50, 0);

  scene.add(light);
}

function addGround(scene) {
  var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
  var groundMat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0x050505
  });

  groundMat.color.setHSL(0.095, 1, 0.75);
  var ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -60;
  ground.receiveShadow = true;
  scene.add(ground);
}
function addSky(scene) {
  var vertexShader = document.getElementById("vertexShader").textContent;
  var fragmentShader = document.getElementById("fragmentShader").textContent;

  var uniforms = {
    topColor: { value: new THREE.Color(0x0077ff) },
    bottomColor: {
      value: new THREE.Color(0xffffff)
    },
    offset: { value: 33 },
    exponent: { value: 0.6 }
  };

  var hemiLight = scene.getObjectByName("hemilight");
  uniforms.topColor.value.copy(hemiLight.color);
  scene.fog.color.copy(uniforms.bottomColor.value);
  var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
  var skyMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    side: THREE.BackSide
  });
  //   var skyMat = new THREE.MeshPhongMaterial({
  //     color: 0x0077ff,
  //     side: THREE.BackSide
  //   });
  var sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);
}

function addSphere(scene) {
  var sphereGeo = new THREE.SphereGeometry(50, 32, 32);
  var sphereMat = new THREE.MeshStandardMaterial({
    lights: true,
    roughness: 0.65
  });
  var sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.castShadow = true;
//   sphere.receiveShadow = true;
  sphere.name = "sphere";
  scene.add(sphere);
}
function addDirectionalLight(scene) {
  var light = new THREE.DirectionalLight(0xffffff, 0.25);
  light.position.set(-10, 250, 10);
  var sphere = scene.getObjectByName("sphere");
  light.target = sphere;
  light.name = "directionallight";

  light.castShadow = true;
  var d = 50;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;
  light.shadow.camera.far = 3500;
  light.shadow.camera.bias = 0.0001;
  var cameraHelper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(cameraHelper);
  var lightHelper = new THREE.DirectionalLightHelper(light, 10);
  scene.add(lightHelper);
  scene.add(light);
}
function update(scene, camera, renderer) {
  renderer.render(scene, camera);
  var directionallight = scene.getObjectByName("directionallight");
  var delta = clock.getDelta();
  var elapsed = clock.elapsedTime;
  directionallight.position.x = Math.cos(elapsed * 2) * 360;
  directionallight.position.z = Math.sin(elapsed * 2) * 360;
  requestAnimationFrame(function() {
    update(scene, camera, renderer);
  });
}

init();
