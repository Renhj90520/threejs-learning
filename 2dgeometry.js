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
    redraw: function () {
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

  var shapeGeo = new THREE.ShapeGeometry(drawShape());
  addShape(scene, shapeGeo)

  var gui = new dat.GUI();
  var circleGUI = gui.addFolder('circle');
  circleGUI.add(circleOptions, "radius", 0, 40).onChange(function () {
    circleOptions.redraw();
  });
  circleGUI.add(circleOptions, "segments", 0, 40).onChange(function () {
    circleOptions.redraw();
  });
  circleGUI.add(circleOptions, "thetastart", 0, 2 * Math.PI)
    .onChange(function () {
      circleOptions.redraw();
    });
  circleGUI.add(circleOptions, "thetalength", 0, 2 * Math.PI)
    .onChange(function () {
      circleOptions.redraw();
    });


  ringOptions = {
    innerRadius: 3,
    outerRadius: 20,
    thetaSegments: 8,
    phiSegments: 8,
    thetaStart: 0,
    thetaLength: Math.PI * 2,
    redraw: function () {
      var ring = scene.getObjectByName('ring');
      scene.remove(ring);
      addRing(scene, new THREE.RingGeometry(
        this.innerRadius,
        this.outerRadius,
        this.thetaSegments,
        this.phiSegments,
        this.thetaStart,
        this.thetaLength
      ));
    }
  };
  var ringGUI = gui.addFolder('ring');
  ringGUI.add(ringOptions, 'innerRadius', 0, 18).onChange(function () {
    ringOptions.redraw();
  });
  ringGUI.add(ringOptions, 'outerRadius', 20, 30).onChange(function () {
    ringOptions.redraw();
  });
  ringGUI.add(ringOptions, 'thetaSegments', 1, 40).step(1).onChange(function () {
    ringOptions.redraw();
  });
  ringGUI.add(ringOptions, 'phiSegments', 1, 40).step(1).onChange(function () {
    ringOptions.redraw();
  });
  ringGUI.add(ringOptions, 'thetaStart', 0, Math.PI * 2).onChange(function () {
    ringOptions.redraw();
  });
  ringGUI.add(ringOptions, 'thetaLength', 0, Math.PI * 2).onChange(function () {
    ringOptions.redraw();
  });

  var ringGeo = new THREE.RingGeometry(ringOptions.innerRadius, ringOptions.outerRadius, ringOptions.thetaSegments, ringOptions.phiSegments, ringOptions.thetaStart, ringOptions.thetaLength);
  addRing(scene, ringGeo);

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

function drawShape() {
  var shape = new THREE.Shape();
  shape.moveTo(10, 10);
  shape.lineTo(10, 40);
  shape.bezierCurveTo(15, 25, 25, 25, 30, 40);
  shape.splineThru([
    new THREE.Vector2(32, 30),
    new THREE.Vector2(28, 20),
    new THREE.Vector2(30, 10)
  ]);

  shape.quadraticCurveTo(20, 15, 10, 10);
  var hole1 = new THREE.Path();
  hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
  shape.holes.push(hole1);

  var hole2 = new THREE.Path();
  hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
  shape.holes.push(hole2);

  var hole3 = new THREE.Path();
  hole3.absarc(20, 16, 2, 0, Math.PI, true);
  shape.holes.push(hole3);
  return shape;
}

function addShape(scene, shapeGeo) {
  var shapeMaterial = new THREE.MeshNormalMaterial();
  shapeMaterial.side = THREE.DoubleSide;
  var wireframeMat = new THREE.MeshBasicMaterial();
  wireframeMat.wireframe = true;

  var shape = THREE.SceneUtils.createMultiMaterialObject(shapeGeo, [shapeMaterial, wireframeMat]);
  scene.add(shape);
  return shape;
}

function addRing(scene, ringGeo) {

  var ringMaterial = new THREE.MeshNormalMaterial();
  ringMaterial.side = THREE.DoubleSide;
  var wireframeMat = new THREE.MeshBasicMaterial();
  wireframeMat.wireframe = true;

  var ring = THREE.SceneUtils.createMultiMaterialObject(ringGeo, [ringMaterial, wireframeMat]);
  ring.name = 'ring';

  ring.position.x = -40;
  scene.add(ring);
}

function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(function () {
    update(scene, camera, renderer, controls);
  });
}

init();