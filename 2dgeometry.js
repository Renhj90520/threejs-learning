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

  camera.position.x = -20;
  camera.position.y = 30;
  camera.position.z = 40;
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  addPlane(scene);
  var circleOptions = {
    radius: 4,
    thetastart: 0.3 * Math.PI * 2,
    thetalength: 0.3 * Math.PI * 2,
    segments: 10,
    redraw: function() {
      console.log(this);
      var circle = scene.getObjectByName("circle");
      scene.remove(circle);
      addCircle(
        scene,
        new THREE.CircleGeometry(
          this.radius,
          this.segments,
          this.thetastart,
          this.thetalength
        )
      );
    }
  };
  var circleGeo = new THREE.CircleGeometry(
    circleOptions.radius,
    circleOptions.segments,
    circleOptions.thetastart,
    circleOptions.thetalength
  );
  var circle = addCircle(scene, circleGeo);

  var gui = new dat.GUI();
  gui.add(circleOptions, "radius", 0, 40).onChange(circleOptions.redraw);
  gui.add(circleOptions, "segments", 0, 40).onChange(circleOptions.redraw);
  gui
    .add(circleOptions, "thetastart", 0, 2 * Math.PI)
    .onChange(circleOptions.redraw);
  gui
    .add(circleOptions, "thetalength", 0, 2 * Math.PI)
    .onChange(circleOptions.redraw);
  var axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);
  var controls = new THREE.OrbitControls(camera);
  update(scene, camera, renderer, controls);
}

function addPlane(scene) {
  var planeGeo = new THREE.PlaneGeometry(10, 14, 4, 4);
  var planeMaterial = new THREE.MeshNormalMaterial();
  planeMaterial.side = THREE.DoubleSide;
  var wireframeMat = new THREE.MeshBasicMaterial();
  wireframeMat.wireframe = true;

  var plane = THREE.SceneUtils.createMultiMaterialObject(planeGeo, [
    planeMaterial,
    wireframeMat
  ]);

  scene.add(plane);
}

function addCircle(scene, geo) {
  var circleMaterial = new THREE.MeshNormalMaterial();
  circleMaterial.side = THREE.DoubleSide;
  var wireframeMat = new THREE.MeshBasicMaterial();
  wireframeMat.wireframe = true;

  var circle = THREE.SceneUtils.createMultiMaterialObject(geo, [
    circleMaterial,
    wireframeMat
  ]);
  circle.name = "circle";
  circle.position.x = -10;
  scene.add(circle);
  return circle;
}

function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}

init();
