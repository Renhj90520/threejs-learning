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

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 150;

  // addSprites(scene);
  // addBasicPointCloud(scene);
  addRainParticle(scene);

  var controls = new THREE.OrbitControls(camera);
  update(scene, camera, renderer, controls);
}

function addSprites(scene) {
  var spriteMaterial = new THREE.SpriteMaterial();
  for (let x = -5; x < 5; x++) {
    for (let y = -5; y < 5; y++) {
      var sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(x * 10, y * 10, 0);
      scene.add(sprite);
    }
  }
}
function addBasicPointCloud(scene) {
  var options = {
    size: 4,
    transparent: true,
    opacity: 0.6,
    vertexColors: true,
    color: 0xffffff,
    sizeAttenuation: true
  };

  var geometry = new THREE.Geometry();
  var pointCloudMaterial = new THREE.PointCloudMaterial(options);

  var range = 500;
  for (let i = 0; i < 1500; i++) {
    var particle = new THREE.Vector3(
      Math.random() * range - range / 2,
      Math.random() * range - range / 2,
      Math.random() * range - range / 2
    );
    geometry.vertices.push(particle);
    var color = new THREE.Color(0x00ff00);
    color.setHSL(
      color.getHSL().h,
      color.getHSL().s,
      color.getHSL().l * Math.random()
    );
    geometry.colors.push(color);
  }

  var pointCloud = new THREE.PointCloud(geometry, pointCloudMaterial);
  pointCloud.name = "particles";
  scene.add(pointCloud);
}

function addRainParticle(scene) {
  var loader = new THREE.TextureLoader();
  var raindrop = loader.load("textures/raindrop-3.png");
  var geometry = new THREE.Geometry();
  var particleMaterial = new THREE.PointsMaterial({
    size: 3,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    map: raindrop,
    sizeAttenuation: true,
    color: 0xffffff
  });

  var range = 40;
  for (let i = 0; i < 1500; i++) {
    var particle = new THREE.Vector3(
      Math.random() * range - range / 2,
      Math.random() * range * 1.5,
      Math.random() * range - range / 2
    );

    particle.velocityY = 0.1 + Math.random() / 5;
    particle.velocityX = (Math.random() - 0.5) / 3;
    geometry.vertices.push(particle);
  }
  geometry.verticesNeedUpdate = true;

  var cloud = new THREE.Points(geometry, particleMaterial);
  cloud.sortParticles = true;
  cloud.name = "particlecloud";
  scene.add(cloud);
}

function update(scene, camera, renderer, controls) {
  // var pointCloud = scene.getObjectByName("particles");
  // pointCloud.rotation.x += 0.01;
  // pointCloud.rotation.z += 0.01;

  var particleCloud = scene.getObjectByName("particlecloud");
  var vertices = particleCloud.geometry.vertices;
  vertices.forEach(function(particle) {
    particle.y = particle.y - particle.velocityY;
    particle.x = particle.x - particle.velocityX;

    if (particle.y < 0) {
      particle.y = 60;
    }

    if (particle.x <= -20 || particle.x >= 20) {
      particle.velocityX = -1 * particle.velocityX;
    }
  });
  particleCloud.geometry.verticesNeedUpdate = true;
  controls.update();
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
  renderer.render(scene, camera);
}

init();
