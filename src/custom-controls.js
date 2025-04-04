import './style.css'
import * as THREE from 'three'
// import { ArcBallControls } from 'three/examples/jsm/controls/ArcBallControls'
// import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { MapControls } from 'three/examples/jsm/controls/MapControls'
// import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
    
  const scene = new THREE.Scene();
  const sizes = { width: innerWidth, height: innerHeight, }
  const fov = 60
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
  
  const renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio < 2,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Mouse 

  const mouse = new THREE.Vector2(0, 0)
const prevMouse = new THREE.Vector2(0, 0)
let drag = false


  let zoomFactor = 0;
  let zoomSpeed = 0.25;

  // Satellite
  const moon = mesh.clone()
  moon.scale.multiplyScalar(0.25)

  scene.add(moon)

  camera.position.set(0, 0, 8)
  // camera.lookAt(0, 0, 0)


// OROLOGIO
const clock = new THREE.Clock()  

// let R = 4

// ANIMAZIONE PRINCIPALE  - FRAME LOOP
function animate() {  
    
//   Tempo in secondi, non in millisecondi
    const deltaTime = clock.getDelta()


// Satellite rotazione

  // mesh.rotation.y = -mouse.x * Math.PI * 0.25
  // mesh.rotation.x = (mouse.y * Math.PI) / 6
  // const  angle = -mouse.y * Math.PI / 2

  // camera.position.x = Math.sin(angle) * R
  // camera.position.z = Math.cos(angle) * R

  let R = 4 // + zoomFactor * 2


  const angleA = -mouse.x * Math.PI
  const angleB = (mouse.y * 0.5 + 0.5) * Math.PI

  const pos = new THREE.Vector3().setFromSphericalCoords(R, angleB, angleA)
  camera.position.copy(pos)

  camera.lookAt(0, 0, 0)  

  camera.fov = fov + zoomFactor * 15
  camera.updateProjectionMatrix()

  camera.zoom = 1 + zoomFactor * 0.5
  camera.updateProjectionMatrix()

renderer.render(scene, camera);
requestAnimationFrame(animate);
    
  
}

requestAnimationFrame(animate);



// Window Resize 
  window.addEventListener('resize', onResize )
  
  function onResize() {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
  
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
      renderer.setSize(sizes.width, sizes.height)

      const pixelRatio = Math.min(window.devicePixelRatio, 2)

      renderer.setPixelRatio(pixelRatio)

  }
  
  window.addEventListener('mousemove', onMouseMove) 
    function onMouseMove(event) {

      // mouse.x = (event.clientX * 2) / sizes.width - 1
      // mouse.y = (event.clientY * -2) / sizes.height + 1

      if(drag){
        console.log("drag and drop")

        const currentMouse = new THREE.Vector2(
          (2 * event.clientX) / sizes.width - 1,
          -(2 * event.clientY) / sizes.height + 1
        );

        const diff = currentMouse.clone().sub(prevMouse);

        mouse.add(diff);
        mouse.y = THREE.MathUtils.clamp(mouse.y, -1, 1);
        prevMouse.copy(currentMouse);
      }

      window.addEventListener('mousedown', function(event) {
      prevMouse.x = (2 * event.clientX) / sizes.width - 1
      prevMouse.y = (2 * event.clientY) / sizes.height - 1
      
      drag = true
    
      })

      window.addEventListener('mouseup', function(event) {
        drag = false
      })
    }

  window.addEventListener('wheel', function(event) {
    zoomFactor += (zoomSpeed * event.deltaY) / 1000;

    zoomFactor = THREE.MathUtils.clamp(zoomFactor, -1, 1);
    console.log(event.deltaY);
  });

  animate();
// pop();


