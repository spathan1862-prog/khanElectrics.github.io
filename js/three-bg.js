/**
 * three-bg.js  -  Khan Electrical Services
 *
 * SELF-CONTAINED background animation.
 * Drop <script src="js/three-bg.js"> anywhere and it:
 *   1. Injects a fixed full-page canvas BEHIND all content
 *   2. Renders 80 floating electric particles with gold connections
 *   3. Reacts to mouse movement
 *   4. Never blocks clicks (pointer-events: none)
 *   5. Works on EVERY page regardless of existing CSS
 *
 * z-index strategy:
 *   canvas  -> z-index: -1  (behind body background)
 *   EXCEPT the body background is set to transparent here so canvas shows
 *   All real page content keeps its natural stacking (above z-index: -1)
 */

(function () {
  'use strict';

  /* ---------- wait for THREE CDN to be available ---------- */
  function ready(fn) {
    if (typeof THREE !== 'undefined') { fn(); }
    else { setTimeout(function () { ready(fn); }, 60); }
  }

  /* ---------- inject canvas + body style once DOM exists ---------- */
  function inject() {
    /* avoid double-init */
    if (document.getElementById('khan-three-bg')) return;

    var canvas = document.createElement('canvas');
    canvas.id = 'khan-three-bg';
    canvas.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'width:100%',
      'height:100%',
      'pointer-events:none',
      'display:block',
      'z-index:0'
    ].join(';');

    /* Insert as FIRST child of body so everything else stacks above */
    document.body.insertBefore(canvas, document.body.firstChild);

    /* Make sure all direct body children (except canvas) stack above it */
    var style = document.createElement('style');
    style.textContent = [
      'body > *:not(#khan-three-bg){position:relative;z-index:1}',
      /* For pages that use <div class="page-wrapper"> or similar */
      '#khan-three-bg{z-index:0}'
    ].join('');
    document.head.appendChild(style);

    ready(function () { startScene(canvas); });
  }

  /* ---------- Three.js scene ---------- */
  function startScene(canvas) {
    var W = window.innerWidth;
    var H = window.innerHeight;

    /* palette */
    var GOLD  = { r: 0.96, g: 0.62, b: 0.04 };  /* #f59e0b */
    var AMBER = { r: 0.98, g: 0.75, b: 0.14 };  /* #fbbf24 */
    var BLUE  = { r: 0.38, g: 0.65, b: 0.98 };  /* #60a5fa */
    var WHITE = { r: 0.88, g: 0.91, b: 0.96 };  /* #e2e8f0 */
    var PAL   = [GOLD, AMBER, GOLD, AMBER, BLUE, WHITE, GOLD];

    /* renderer */
    var isMobile = /Mobi|Android/i.test(navigator.userAgent);
    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(W, H);

    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(55, W / H, 1, 3000);
    camera.position.z = 420;

    /* particle count - fewer on mobile for performance */
    var N = isMobile ? 55 : 90;
    var MAX_D = isMobile ? 110 : 140;
    var DEPTH  = 200;

    /* node data */
    var nodes = [];

    /* geometry holders */
    var ptsMesh = null;
    var lineMesh = null;

    function build() {
      if (ptsMesh)  { scene.remove(ptsMesh);  ptsMesh.geometry.dispose();  }
      if (lineMesh) { scene.remove(lineMesh); lineMesh.geometry.dispose(); }
      nodes = [];

      /* --- points --- */
      var pPos   = new Float32Array(N * 3);
      var pColor = new Float32Array(N * 3);

      for (var i = 0; i < N; i++) {
        var p = {
          x:  rnd(-W/2, W/2),
          y:  rnd(-H/2, H/2),
          z:  rnd(-DEPTH/2, DEPTH/2),
          vx: rnd(-0.22, 0.22),
          vy: rnd(-0.22, 0.22),
          vz: rnd(-0.09, 0.09)
        };
        nodes.push(p);
        pPos[i*3] = p.x; pPos[i*3+1] = p.y; pPos[i*3+2] = p.z;
        var c = PAL[Math.floor(Math.random() * PAL.length)];
        pColor[i*3] = c.r; pColor[i*3+1] = c.g; pColor[i*3+2] = c.b;
      }

      var pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos,   3));
      pGeo.setAttribute('color',    new THREE.BufferAttribute(pColor, 3));

      ptsMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({
        size: 3.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      }));
      scene.add(ptsMesh);

      /* --- lines (pre-alloc) --- */
      var maxL = N * (N - 1) / 2;
      var lPos  = new Float32Array(maxL * 6);
      var lCol  = new Float32Array(maxL * 6);
      var lGeo  = new THREE.BufferGeometry();
      lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
      lGeo.setAttribute('color',    new THREE.BufferAttribute(lCol, 3));
      lGeo.setDrawRange(0, 0);

      lineMesh = new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.30,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }));
      scene.add(lineMesh);
    }

    build();

    /* mouse */
    var mx = 0, my = 0;
    document.addEventListener('mousemove', function (e) {
      mx =  (e.clientX / W - 0.5) * W;
      my = -(e.clientY / H - 0.5) * H;
    }, { passive: true });

    /* touch */
    document.addEventListener('touchmove', function (e) {
      if (!e.touches[0]) return;
      mx =  (e.touches[0].clientX / W - 0.5) * W;
      my = -(e.touches[0].clientY / H - 0.5) * H;
    }, { passive: true });

    /* resize */
    window.addEventListener('resize', function () {
      W = window.innerWidth; H = window.innerHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      build();
    }, { passive: true });

    /* animate */
    var t = 0;
    function loop() {
      requestAnimationFrame(loop);
      t += 0.006;

      var halfW = W / 2, halfH = H / 2;
      var pArr  = ptsMesh.geometry.attributes.position.array;

      for (var i = 0; i < N; i++) {
        var p  = nodes[i];
        var i3 = i * 3;

        /* drift */
        p.x += p.vx + Math.sin(t + i * 0.47) * 0.06;
        p.y += p.vy + Math.cos(t + i * 0.63) * 0.06;
        p.z += p.vz;

        /* mouse repulsion */
        var dx = p.x - mx, dy = p.y - my;
        var d2 = dx*dx + dy*dy;
        if (d2 < 7000) {
          var d = Math.sqrt(d2) || 1;
          var f = (84 - d) / 84 * 0.65;
          p.x += dx / d * f;
          p.y += dy / d * f;
        }

        /* bounce */
        if (p.x >  halfW+30){ p.x  =  halfW+30; p.vx = -Math.abs(p.vx); }
        if (p.x < -halfW-30){ p.x  = -halfW-30; p.vx =  Math.abs(p.vx); }
        if (p.y >  halfH+30){ p.y  =  halfH+30; p.vy = -Math.abs(p.vy); }
        if (p.y < -halfH-30){ p.y  = -halfH-30; p.vy =  Math.abs(p.vy); }
        if (Math.abs(p.z) > DEPTH/2) p.vz *= -1;

        pArr[i3] = p.x; pArr[i3+1] = p.y; pArr[i3+2] = p.z;
      }
      ptsMesh.geometry.attributes.position.needsUpdate = true;

      /* lines */
      var lArr = lineMesh.geometry.attributes.position.array;
      var cArr = lineMesh.geometry.attributes.color.array;
      var li   = 0;

      for (var a = 0; a < N; a++) {
        for (var b = a+1; b < N; b++) {
          var ax = nodes[a].x, ay = nodes[a].y, az = nodes[a].z;
          var bx = nodes[b].x, by = nodes[b].y, bz = nodes[b].z;
          var ddx = ax-bx, ddy = ay-by, ddz = az-bz;
          var dist = Math.sqrt(ddx*ddx + ddy*ddy + ddz*ddz);
          if (dist < MAX_D) {
            var ratio = 1 - dist/MAX_D;
            lArr[li]=ax; lArr[li+1]=ay; lArr[li+2]=az;
            lArr[li+3]=bx;lArr[li+4]=by;lArr[li+5]=bz;
            var r = lerp(0.12, 0.96, ratio);
            var g = lerp(0.08, 0.62, ratio);
            var bv= lerp(0.03, 0.04, ratio);
            cArr[li]=r;cArr[li+1]=g;cArr[li+2]=bv;
            cArr[li+3]=r;cArr[li+4]=g;cArr[li+5]=bv;
            li += 6;
          }
        }
      }
      lineMesh.geometry.attributes.position.needsUpdate = true;
      lineMesh.geometry.attributes.color.needsUpdate    = true;
      lineMesh.geometry.setDrawRange(0, li/3);

      /* camera parallax */
      camera.position.x += (mx * 0.03 - camera.position.x) * 0.04;
      camera.position.y += (my * 0.03 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    loop();
  }

  /* helpers */
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* kick off */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
