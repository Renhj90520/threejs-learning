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
  camera.position.set(10, 10, 10);

  addSpotLight(scene);
  var loader = new THREE.PLYLoader();
  loader.load("models/test.ply", function (geo) {
    var posSrc = {
      pos: 1
    };
    var tween = new TWEEN.Tween(posSrc).to({
      pos: 0
    }, 5000);
    tween.easing(TWEEN.Easing.Sinusoidal.InOut);

    var tweenback = new TWEEN.Tween(posSrc).to({
      pos: 1
    }, 5000);
    tweenback.easing(TWEEN.Easing.Sinusoidal.InOut);

    tween.chain(tweenback);
    tweenback.chain(tween);

    addPoints(scene, geo, posSrc, tween, tweenback);
  });
  var controls = new THREE.OrbitControls(camera);

  update(scene, camera, renderer, controls);
}

function addSpotLight(scene) {
  var light = new THREE.SpotLight(0xffffff);
  light.position.set(20, 20, 20);
  scene.add(light);
}

function addPoints(scene, geo, posSrc, tween, tweenback) {
  var pointsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.4,
    opacity: 0.6,
    transparent: true,
    blending: THREE.AdditiveBlending,
    map: generateSprite(),
    depthWrite: false
  });

  var points = new THREE.Points(geo, pointsMaterial);
  points.sortParticles = true;
  var originPos = points.position.y;
  var onUpdate = function () {
    points.position.y = (originPos + 3.22544) * posSrc.pos - 3.22544;
  };

  tween.onUpdate(onUpdate);
  tweenback.onUpdate(onUpdate);
  tween.start();

  scene.add(points);
}

function generateSprite() {
  var canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;

  var context = canvas.getContext("2d");
  var gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );

  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(0,255,255,1)");
  gradient.addColorStop(0.4, "rgba(0,0,64,1)");
  gradient.addColorStop(1, "rgba(0,0,0,1)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function update(scene, camera, renderer, controls) {
  controls.update();
  TWEEN.update();
  renderer.render(scene, camera);

  requestAnimationFrame(function () {
    update(scene, camera, renderer, controls);
  });
}

init();