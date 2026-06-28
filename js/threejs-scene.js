/**
 * threejs-scene.js  -  Khan Electrical Services
 *
 * Creates ONE WebGL canvas inside the hero section:
 *   - Animated 3D particle network (nodes + electric connection lines)
 *   - Gold / amber / blue colour palette matching the site
 *   - Mouse-reactive parallax and repulsion
 *   - alpha:true so the dark site background shows through
 *
 * Public API:  window.initThreeScene()
 * Canvas id :  #hero-canvas
 */

(function () {
  'use strict';

  /* helpers */
  var rand  = function(a, b){ return a + Math.random() * (b - a); };
  var lerp  = function(a, b, t){ return a + (b - a) * t; };

  /* scene objects */
  var renderer, scene, camera;
  var particles, lineSegs;
  var mouseX = 0, mouseY = 0;
  var W = 0, H = 0;
  var running = false;
  var N = 110;
  var MAX_DIST = 130;
  var DEPTH = 180;
  var pos = [];   /* array of {x,y,z,vx,vy,vz} */

  /* ==========================================================
     PUBLIC: initThreeScene()
     ========================================================== */
  function initThreeScene() {
    /* guard: THREE must exist, canvas must exist */
    if (typeof THREE === 'undefined') {
      console.warn('[Khan3D] THREE not loaded yet, retrying…');
      setTimeout(initThreeScene, 100);
      return;
    }

    var canvas = document.getElementById('hero-canvas');
    if (!canvas) { console.warn('[Khan3D] #hero-canvas not found'); return; }
    if (running)  return;
    running = true;

    W = canvas.offsetWidth  || window.innerWidth;
    H = canvas.offsetHeight || window.innerHeight;

    /* --- renderer --- */
    var isMobile = /Mobi|Android/i.test(navigator.userAgent);
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);   /* transparent */
    renderer.setSize(W, H);

    /* --- scene & camera --- */
    scene  = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, W / H, 1, 3000);
    camera.position.z = 400;

    buildParticles();

    /* events */
    document.addEventListener('mousemove', onMouse,  { passive: true });
    window.addEventListener('resize',      onResize, { passive: true });

    animate();
  }

  /* ==========================================================
     BUILD GEOMETRY
     ========================================================== */
  function buildParticles() {
    /* palette – created INSIDE the function so THREE is ready */
    var GOLD  = new THREE.Color('#f59e0b');
    var AMBER = new THREE.Color('#fbbf24');
    var BLUE  = new THREE.Color('#60a5fa');
    var WHITE = new THREE.Color('#e2e8f0');
    var PALETTE = [GOLD, AMBER, BLUE, WHITE, GOLD, AMBER]; /* weight gold */

    if (particles) { scene.remove(particles); particles.geometry.dispose(); }
    if (lineSegs)  { scene.remove(lineSegs);  lineSegs.geometry.dispose(); }
    pos = [];

    /* --- nodes --- */
    var nPos   = new Float32Array(N * 3);
    var nColor = new Float32Array(N * 3);

    for (var i = 0; i < N; i++) {
      var p = {
        x:  rand(-W/2, W/2),
        y:  rand(-H/2, H/2),
        z:  rand(-DEPTH/2, DEPTH/2),
        vx: rand(-0.20, 0.20),
        vy: rand(-0.20, 0.20),
        vz: rand(-0.10, 0.10)
      };
      pos.push(p);
      nPos[i*3]   = p.x;
      nPos[i*3+1] = p.y;
      nPos[i*3+2] = p.z;

      var c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      nColor[i*3]   = c.r;
      nColor[i*3+1] = c.g;
      nColor[i*3+2] = c.b;
    }

    var nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nPos,   3));
    nodeGeo.setAttribute('color',    new THREE.BufferAttribute(nColor, 3));

    var nodeMat = new THREE.PointsMaterial({
      size: 3.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    particles = new THREE.Points(nodeGeo, nodeMat);
    scene.add(particles);

    /* --- lines (pre-allocate max possible) --- */
    var maxLines = N * (N - 1) / 2;
    var lPos  = new Float32Array(maxLines * 2 * 3);
    var lCol  = new Float32Array(maxLines * 2 * 3);
    var lGeo  = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
    lGeo.setAttribute('color',    new THREE.BufferAttribute(lCol, 3));
    lGeo.setDrawRange(0, 0);

    var lMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.40,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    lineSegs = new THREE.LineSegments(lGeo, lMat);
    scene.add(lineSegs);
  }

  /* ==========================================================
     ANIMATION LOOP
     ========================================================== */
  var time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.007;

    var halfW = W / 2;
    var halfH = H / 2;

    /* --- update node positions --- */
    var nArr = particles.geometry.attributes.position.array;
    for (var i = 0; i < N; i++) {
      var p  = pos[i];
      var i3 = i * 3;

      /* drift + sine wave */
      p.x += p.vx + Math.sin(time + i * 0.53) * 0.05;
      p.y += p.vy + Math.cos(time + i * 0.71) * 0.05;
      p.z += p.vz;

      /* mouse repulsion */
      var dx = p.x - mouseX;
      var dy = p.y - mouseY;
      var dist2 = dx*dx + dy*dy;
      if (dist2 < 8000) {
        var d = Math.sqrt(dist2);
        var f = (90 - d) / 90 * 0.7;
        if (d > 0) { p.x += dx / d * f; p.y += dy / d * f; }
      }

      /* wall bounce */
      if (p.x >  halfW + 30) { p.x =  halfW + 30; p.vx = -Math.abs(p.vx); }
      if (p.x < -halfW - 30) { p.x = -halfW - 30; p.vx =  Math.abs(p.vx); }
      if (p.y >  halfH + 30) { p.y =  halfH + 30; p.vy = -Math.abs(p.vy); }
      if (p.y < -halfH - 30) { p.y = -halfH - 30; p.vy =  Math.abs(p.vy); }
      if (Math.abs(p.z) > DEPTH/2) p.vz *= -1;

      nArr[i3]   = p.x;
      nArr[i3+1] = p.y;
      nArr[i3+2] = p.z;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    /* --- update connection lines --- */
    var lArr = lineSegs.geometry.attributes.position.array;
    var cArr = lineSegs.geometry.attributes.color.array;
    var lIdx = 0;

    for (var a = 0; a < N; a++) {
      for (var b = a + 1; b < N; b++) {
        var ax = pos[a].x, ay = pos[a].y, az = pos[a].z;
        var bx = pos[b].x, by = pos[b].y, bz = pos[b].z;
        var ddx = ax - bx, ddy = ay - by, ddz = az - bz;
        var d = Math.sqrt(ddx*ddx + ddy*ddy + ddz*ddz);

        if (d < MAX_DIST) {
          var t = 1 - d / MAX_DIST;  /* 0..1 closer = brighter */

          lArr[lIdx]   = ax; lArr[lIdx+1] = ay; lArr[lIdx+2] = az;
          lArr[lIdx+3] = bx; lArr[lIdx+4] = by; lArr[lIdx+5] = bz;

          /* gold → dim gold colour based on proximity */
          var r = lerp(0.15, 0.96, t);
          var g = lerp(0.10, 0.62, t);
          var bv= lerp(0.05, 0.07, t);
          cArr[lIdx]   = r; cArr[lIdx+1] = g; cArr[lIdx+2] = bv;
          cArr[lIdx+3] = r; cArr[lIdx+4] = g; cArr[lIdx+5] = bv;

          lIdx += 6;
        }
      }
    }
    lineSegs.geometry.attributes.position.needsUpdate = true;
    lineSegs.geometry.attributes.color.needsUpdate    = true;
    lineSegs.geometry.setDrawRange(0, lIdx / 3);

    /* camera parallax */
    camera.position.x = lerp(camera.position.x, mouseX * 0.035, 0.05);
    camera.position.y = lerp(camera.position.y, mouseY * 0.035, 0.05);
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  /* ==========================================================
     EVENTS
     ========================================================== */
  function onMouse(e) {
    mouseX =  (e.clientX / window.innerWidth  - 0.5) * W;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * H;
  }

  function onResize() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas || !renderer) return;
    W = canvas.offsetWidth  || window.innerWidth;
    H = canvas.offsetHeight || window.innerHeight;
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    buildParticles();
  }

  /* expose */
  window.initThreeScene = initThreeScene;

})();
