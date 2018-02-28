"use strict";
Physijs.scripts.worker = "libs/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";
var scale = chroma.scale(["white", "blue", "red", "yellow"]);
var loader = new THREE.TextureLoader();

function init() {
  var scene = new Physijs.Scene();
  scene.setGravity(new THREE.Vector3(0, -10, 0));

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(85, 65, 65);
  camera.lookAt(scene.position);
  scene.add(camera);

  addSpotLight(scene);
  addGround(scene);

  addLeftFlipper(scene);
  addRightFlipper(scene);
  addSlideBottom(scene);
  addSlideTop(scene);
  addConeTwist(scene);
  addPointToPoint(scene);

  addCar(scene);
  var controls = new THREE.OrbitControls(camera);

  var axesHelper = new THREE.AxesHelper(60);
  scene.add(axesHelper);
  update(scene, camera, renderer, controls);
}

function addSpotLight(scene) {
  var light = new THREE.SpotLight(0xffffff);
  light.position.set(20, 50, 50);
  light.castShadow = true;
  light.shadowMapDebug = true;
  light.shadowMapNear = 10;
  light.shadowMapFar = 100;
  scene.add(light);

  var cameraHelper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(cameraHelper);
}

var groundMaterial = Physijs.createMaterial(
  new THREE.MeshPhongMaterial({
    map: loader.load("textures/floor-wood.jpg")
  }),
  0.9,
  0.7
);

function addGround(scene) {
  var ground = new Physijs.BoxMesh(
    new THREE.BoxGeometry(60, 1, 65),
    groundMaterial,
    0
  );
  ground.receiveShaodw = true;

  var borderLeft = new Physijs.BoxMesh(
    new THREE.BoxGeometry(2, 6, 65),
    groundMaterial,
    0
  );
  borderLeft.castShadow = true;
  borderLeft.position.set(-30, 2, 0);
  ground.add(borderLeft);

  var borderRight = new Physijs.BoxMesh(
    new THREE.BoxGeometry(2, 6, 65),
    groundMaterial,
    0
  );
  borderRight.castShadow = true;
  borderRight.position.set(30, 2, 0)
  ground.add(borderRight);

  var borderTop = new Physijs.BoxMesh(
    new THREE.BoxGeometry(62, 6, 2),
    groundMaterial,
    0
  );
  borderTop.castShadow = true;
  borderTop.position.set(0, 2, 32);
  ground.add(borderTop);

  var borderBottom = new Physijs.BoxMesh(
    new THREE.BoxGeometry(62, 6, 2),
    groundMaterial,
    0
  );
  borderBottom.castShadow = true;
  borderBottom.receiveShaodw = true;
  borderBottom.position.set(0, 2, -33);
  ground.add(borderBottom);

  scene.add(ground);
}

function addLeftFlipper(scene) {
  var flipperLeft = new Physijs.BoxMesh(
    new THREE.BoxGeometry(12, 2, 2),
    Physijs.createMaterial(
      new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: 0.6
      })
    ),
    0.3
  );
  flipperLeft.position.set(-8, 2, 0);
  flipperLeft.castShadow = true;
  scene.add(flipperLeft);

  var flipperLeftPivot = new Physijs.SphereMesh(
    new THREE.BoxGeometry(1, 1, 1), groundMaterial, 0);
  flipperLeftPivot.position.set(-15, 1, 0);
  flipperLeftPivot.rotation.y = 1.4;
  flipperLeftPivot.castShadow = true;
  scene.add(flipperLeftPivot);

  //rotation and axis are relative to the second object
  var constraint = new Physijs.HingeConstraint(flipperLeft, flipperLeftPivot, flipperLeftPivot.position, new THREE.Vector3(0, 1, 0));
  scene.addConstraint(constraint, true);
  constraint.setLimits(-2.2, -0.6, 0.1, 0);

  constraint.enableAngularMotor(-10, 2); // velocity  acceleration
  // constraint.disableMotor();
}

function addRightFlipper(scene) {
  var flipperRight = new Physijs.BoxMesh(
    new THREE.BoxGeometry(12, 2, 2),
    Physijs.createMaterial(
      new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: 0.6
      })
    ), 0.3
  );
  flipperRight.castShadow = true;
  flipperRight.position.set(8, 2, 0);
  scene.add(flipperRight);

  var flipperRightPivot = new Physijs.SphereMesh(
    new THREE.BoxGeometry(1, 1, 1),
    groundMaterial, 0
  );
  flipperRightPivot.position.set(15, 2, 0);
  flipperRightPivot.rotation.y = 1.4;
  flipperRightPivot.castShadow = true;
  scene.add(flipperRightPivot);

  var constraint = new Physijs.HingeConstraint(flipperRight, flipperRightPivot, flipperRightPivot.position, new THREE.Vector3(0, 1, 0));
  scene.addConstraint(constraint, true);
  constraint.setLimits(-2.2, -0.6, 0.1, 0);

  constraint.enableAngularMotor(10, 2);
}

function addSlideBottom(scene) {
  var slideMesh = new Physijs.BoxMesh(
    new THREE.BoxGeometry(12, 2, 2),
    Physijs.createMaterial(new THREE.MeshPhongMaterial({
      color: 0x44ff44,
      transparent: true,
      opacity: 0.6
    }))
  );

  slideMesh.position.set(6, 1.5, 20);
  slideMesh.castShadow = true;
  scene.add(slideMesh);

  var constraint = new Physijs.SliderConstraint(
    slideMesh,
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 1, 0));
  scene.addConstraint(constraint);
  constraint.setLimits(-10, 10, 0, 0);
  constraint.setRestitution(0.1, 0.1);

  constraint.enableLinearMotor(10, 2);
}

function addSlideTop(scene) {
  var slideMesh = new Physijs.BoxMesh(
    new THREE.BoxGeometry(12, 2, 12),
    Physijs.createMaterial(
      new THREE.MeshPhongMaterial({
        color: 0x44ff44,
        transparent: true,
        opacity: 0.6
      })
    )
  );

  slideMesh.castShadow = true;
  slideMesh.position.set(-20, 1.5, -15);
  scene.add(slideMesh);

  var constraint = new Physijs.SliderConstraint(slideMesh, new THREE.Vector3(-10, 0, 20), new THREE.Vector3(Math.PI / 2, 0, 0));
  scene.addConstraint(constraint);
  constraint.setLimits(-20, 10, 0.5, -0, 5);
  constraint.setRestitution(0.2, 0.1);

  constraint.enableLinearMotor(-10, 2);
}

function addConeTwist(scene) {
  var baseGeo = new THREE.SphereGeometry(1);
  var armGeo = new THREE.BoxGeometry(2, 12, 3);

  var baseMesh = new Physijs.SphereMesh(baseGeo, Physijs.createMaterial(new THREE.MeshPhongMaterial({
    color: 0x4444ff,
    transparent: true,
    opacity: 0.7
  }), 0, 0), 0);

  baseMesh.position.set(20, 15.5, 0);
  baseMesh.castShadow = true;
  scene.add(baseMesh);

  var armMesh = new Physijs.BoxMesh(armGeo, Physijs.createMaterial(
    new THREE.MeshPhongMaterial({
      color: 0x4444ff,
      transparent: true,
      opacity: 0.6
    }), 0, 0
  ), 10);
  armMesh.position.set(20, 7.5, 0);
  armMesh.castShadow = true;
  scene.add(armMesh);

  var constraint = new Physijs.ConeTwistConstraint(baseMesh, armMesh, baseMesh.position);
  scene.addConstraint(constraint);
  // constraint.setLimits(Math.PI / 2, Math.PI / 2, Math.PI / 2);
  constraint.setMaxMotorImpulse(1);
  constraint.setMotorTarget(new THREE.Vector3(0, 0, 0));

  constraint.enableMotor();
  constraint.setMotorTarget(new THREE.Vector3(10, 0, 0));
  // constraint.disableMotor();
}

function addPointToPoint(scene) {
  var pointGeo1 = new THREE.SphereGeometry(2);
  var pointGeo2 = new THREE.SphereGeometry(2);

  var point1 = new Physijs.SphereMesh(pointGeo1, Physijs.createMaterial(
    new THREE.MeshPhongMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 0.7
    })
  ));
  point1.position.set(-10, 2, -18);
  point1.castShadow = true;
  scene.add(point1);

  var point2 = new Physijs.SphereMesh(pointGeo2,
    Physijs.createMaterial(
      new THREE.MeshPhongMaterial({
        color: 0xff4444,
        transparent: true,
        opacity: 0.7
      })
    ));
  point2.position.set(-20, 2, -5);
  point2.castShadow = true;
  scene.add(point2);

  var constraint = new Physijs.PointConstraint(point1, point2, point2.position);
  // scene.addConstraint(constraint);
}

function addCar(scene) {
  var car = {};
  var carMaterial = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 0.9
    }),
    0.5, 0.5
  );

  var body = new Physijs.BoxMesh(
    new THREE.BoxGeometry(15, 4, 4),
    carMaterial,
    500
  );
  body.position.set(5, 5, 5);
  scene.add(body);

  var fr = createWheel(new THREE.Vector3(0, 4, 10));
  var fl = createWheel(new THREE.Vector3(0, 4, 0));
  var rr = createWheel(new THREE.Vector3(10, 4, 10));
  var rl = createWheel(new THREE.Vector3(10, 4, 0));

  scene.add(fr);
  scene.add(fl);
  scene.add(rr);
  scene.add(rl);

  var frConstraint = createWheelConstraint(fr, body, new THREE.Vector3(0, 4, 8));
  var flConstraint = createWheelConstraint(fl, body, new THREE.Vector3(0, 4, 2));
  var rrConstraint = createWheelConstraint(rr, body, new THREE.Vector3(10, 4, 8));
  var rlConstraint = createWheelConstraint(rl, body, new THREE.Vector3(10, 4, 2));

  scene.addConstraint(frConstraint);
  scene.addConstraint(flConstraint);
  scene.addConstraint(rrConstraint);
  scene.addConstraint(rlConstraint);

  rrConstraint.setAngularLowerLimit({
    x: 0,
    y: 0.5,
    z: 0.1
  });
  rrConstraint.setAngularUpperLimit({
    x: 0,
    y: 0.5,
    z: 0
  });

  rlConstraint.setAngularLowerLimit({
    x: 0,
    y: 0.5,
    z: 0.1
  });
  rlConstraint.setAngularUpperLimit({
    x: 0,
    y: 0.5,
    z: 0
  });

  frConstraint.setAngularLowerLimit({
    x: 0,
    y: 0,
    z: 0
  });

  frConstraint.setAngularUpperLimit({
    x: 0,
    y: 0,
    z: 0
  });

  flConstraint.setAngularLowerLimit({
    x: 0,
    y: 0,
    z: 0
  });

  flConstraint.setAngularUpperLimit({
    x: 0,
    y: 0,
    z: 0
  });
  frConstraint.configureAngularMotor(2, 0.1, 0, -2, 1500);
  flConstraint.configureAngularMotor(2, 0.1, 0, -2, 1500);

  flConstraint.enableAngularMotor(2);
  frConstraint.enableAngularMotor(2);
}

function createWheelConstraint(wheel, body, position) {
  return new Physijs.DOFConstraint(wheel, body, position);
}

function createWheel(position) {
  var wheelMaterial = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.9
    }),
    0, 0.5
  );

  var wheelGeo = new THREE.CylinderGeometry(4, 4, 2, 10);
  var wheel = new Physijs.CylinderMesh(wheelGeo, wheelMaterial, 100);

  wheel.rotation.x = Math.PI / 2;
  wheel.castShadow = true;
  wheel.position.copy(position);
  return wheel;
}

function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(function () {
    update(scene, camera, renderer, controls);
  });
  scene.simulate();
}

init();