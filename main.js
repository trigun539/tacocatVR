window.addEventListener("load", function() {
  if (navigator.getVRDevices) {
    navigator.getVRDevices().then(vrDeviceCallback);
  } else if (navigator.mozGetVRDevices) {
    navigator.mozGetVRDevices(vrDeviceCallback);
  }
}, false);

function vrDeviceCallback(vrdevs) {
  for (var i = 0; i < vrdevs.length; ++i) {
    if (vrdevs[i] instanceof HMDVRDevice) {
      vrHMD = vrdevs[i];
      break;
    }
  }

  for (var i = 0; i < vrdevs.length; ++i) {
    if (vrdevs[i] instanceof PositionSensorVRDevice &&
      vrdevs[i].hardwareUnitId == vrHMD.hardwareUnitId) {
      vrHMDSensor = vrdevs[i];
      break;
    }
  }
  initScene();
  initRenderer();
  render();
}

function initScene() {
  camera = new THREE.PerspectiveCamera(60, 1280 / 800, 0.001, 10);
  camera.position.z = 2;
  scene = new THREE.Scene();

  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 1, 1, 1 ).normalize();
  scene.add( light );

  nyanCat = new THREEx.NyanCat();
  nyanCat.container.scale.multiplyScalar(1/30);
  scene.add(nyanCat.container);

  var building = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshNormalMaterial();
  mesh = new THREE.Mesh( building, material );
  mesh.position.x = 1;
  mesh.position.y = 1;
  mesh.position.z = 1;
  scene.add( mesh );

}

function initRenderer() {
  renderCanvas = document.getElementById("render-canvas");
  renderer = new THREE.WebGLRenderer({
      canvas: renderCanvas,
  });
  renderer.setClearColor(0x555555);
  renderer.setSize(1280, 800, false);
  vrrenderer = new THREE.VRRenderer(renderer, vrHMD);
}

function render() {
  requestAnimationFrame(render);

  var state = vrHMDSensor.getState();
  camera.quaternion.set(state.orientation.x,
                        state.orientation.y,
                        state.orientation.z,
                        state.orientation.w);
  vrrenderer.render(scene, camera);
}

window.addEventListener("keypress", function(e) {
  if (e.charCode == 'f'.charCodeAt(0)) {
    if (renderCanvas.mozRequestFullScreen) {
      renderCanvas.mozRequestFullScreen({
        vrDisplay: vrHMD
      });
    } else if (renderCanvas.webkitRequestFullscreen) {
      renderCanvas.webkitRequestFullscreen({
        vrDisplay: vrHMD,
      });
    }
  }

  // Direction controls
  if(e.charCode == 'w'.charCodeAt(0)){
    camera.position.z -= .1;
  }

  if (e.charCode == 's'.charCodeAt(0)){
    camera.position.z += .1;
  }

  if (e.charCode == 'a'.charCodeAt(0)){
    camera.position.x -= .1;
  }

  if (e.charCode == 'd'.charCodeAt(0)){
    camera.position.x += .1;
  }

  if (e.charCode == 'e'.charCodeAt(0)){
    flameFull.start();
  }
}, false);