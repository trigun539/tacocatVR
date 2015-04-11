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

  //mesh = new THREE.Mesh()
  scene.add(nyanCat.container);
  scene.add(flameFull);

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
  //mesh.rotation.y += 0.01;
  var randX = (Math.random() - Math.random()) * .2;
  if (nyanCat.container.position.x > -3 && nyanCat.container.position.x < 3){
    nyanCat.container.position.x += randX;
  }

  // controls vertical movement
  // var randY = (Math.random() - Math.random()) * .05;

  // if (nyanCat.container.position.y > -5 && nyanCat.container.position.y < 5 ){
  //   nyanCat.container.position.y += randY;
  // }

  var randZ = (Math.random() - Math.random()) * .05;

  if (nyanCat.container.position.z > -5 && nyanCat.container.position.z < 5 ){
    nyanCat.container.position.z += randZ;
  }

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