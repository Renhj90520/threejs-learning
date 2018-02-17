function init() {
  var scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0xeeeeee));
  renderer.shadowMap.enabled = true;

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 50;
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  var convexpoints = convexPoints(scene);
  addConvexGeoMesh(scene, convexpoints);

  var lathepoints = lathePoints(scene);
  addLatheGeoMesh(scene, lathepoints);


  var axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);
  var controls = new THREE.OrbitControls(camera);

  update(scene, camera, renderer, controls);
}

function convexPoints(scene) {
  var points = [];

  for (var i = 0; i < 20; i++) {
    var randomX = -15 + Math.round(Math.random() * 30);
    var randomY = -15 + Math.round(Math.random() * 30);
    var randomZ = -15 + Math.round(Math.random() * 30);
    points.push(new THREE.Vector3(randomX, randomY, randomZ));
  }

  var sphereGroup = new THREE.Object3D();
  var material = new THREE.MeshBasicMaterial({
    color: 0xff0000
  });
  points.forEach(function (point) {
    var sphereGeo = new THREE.SphereGeometry(0.2);
    var sphere = new THREE.Mesh(sphereGeo, material);
    sphere.position.copy(point);

    sphereGroup.add(sphere);
  });
  sphereGroup.name = "convexpoints";
  scene.add(sphereGroup);

  return points;
}

function addConvexGeoMesh(scene, points) {
  var hullGeometry = new THREE.ConvexGeometry(points);
  var meshMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.2
  });
  meshMaterial.side = THREE.DoubleSide;
  var wireFrameMat = new THREE.MeshBasicMaterial();
  wireFrameMat.wireframe = true;
  var mesh = THREE.SceneUtils.createMultiMaterialObject(hullGeometry, [
    meshMaterial,
    wireFrameMat
  ]);

  mesh.name = "convexhull";

  scene.add(mesh);
}


function lathePoints(scene) {
  var points = [];
  var height = 5;
  var count = 30;
  var sphereGroup = new THREE.Object3D();
  for (var i = 0; i < count; i++) {
    points.push(new THREE.Vector2(
      (Math.sin(i * 0.2) + Math.cos(i * 0.3)) * height + 12,
      (i - count) + count / 2
    ));
  }
  var sphereMat = new THREE.MeshBasicMaterial({
    color: 0xff0000
  });

  points.forEach(function (point) {
    var sphereGeo = new THREE.SphereGeometry(0.2);
    var sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.position.copy(point);

    sphereGroup.add(sphereMesh);
  });
  sphereGroup.name = 'lathepoints';
  scene.add(sphereGroup);
  return points;
}

function addLatheGeoMesh(scene, points) {
  var latheGeo = new THREE.LatheGeometry(points);
  var meshMaterial = new THREE.MeshNormalMaterial();
  meshMaterial.side = THREE.DoubleSide;
  var wireFrameMat = new THREE.MeshBasicMaterial();
  wireFrameMat.wireframe = true;

  var mesh = THREE.SceneUtils.createMultiMaterialObject(latheGeo, [meshMaterial, wireFrameMat]);
  mesh.name = 'lathemesh';
  scene.add(mesh);
}

function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);
  var convexhull = scene.getObjectByName("convexhull");
  var pointsGroup = scene.getObjectByName("convexpoints");
  convexhull.rotation.y += 0.01;
  pointsGroup.rotation.y += 0.01;

  var lathePoints = scene.getObjectByName('lathepoints');
  var latheMesh = scene.getObjectByName('lathemesh');
  lathePoints.rotation.x += 0.01;
  latheMesh.rotation.x += 0.01;
  requestAnimationFrame(function () {
    update(scene, camera, renderer, controls);
  });
}
init();