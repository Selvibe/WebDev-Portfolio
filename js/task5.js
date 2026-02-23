
document.addEventListener('DOMContentLoaded', () => {


  const playground = document.getElementById('playground');


  const pieces = [...document.querySelectorAll('.piece')];


  const targets = [...document.querySelectorAll('.target')];

  console.log(targets);

  const SNAP_DIST = 25;


  const SNAP_ROT = 10;

  let active = null;

  function applyTransform(el) {
    el.style.transform = `rotate(${el.dataset.rot}deg)`;
  }

  function center(el) {
    const r = el.getBoundingClientRect();
    return {
      x: r.left + r.width / 2,
      y: r.top + r.height / 2
    };
  }

  // Центр нужного целевого места
  function targetCenter(id) {
    const t = targets.find(x => x.dataset.id === id);
    const r = t.getBoundingClientRect();
    return {
      x: r.left + r.width / 2,
      y: r.top + r.height / 2
    };
  }

  function degDiff(a, b) {
    const d = Math.abs((a - b) % 360);
    return Math.min(d, 360 - d);
  }


    
pieces.forEach(p => {

  p.dataset.rot = String([0,90,180,270][Math.floor(Math.random()*4)]);
  p.dataset.locked = '0';
  applyTransform(p);


  p.style.left = `${370 + Math.random()*130}px`;
  p.style.top  = `${Math.random()*250}px`;


    p.addEventListener('pointerdown', e => {
      if (p.dataset.locked === '1') return;

      p.setPointerCapture(e.pointerId);
      p.classList.add('is-dragging');

      const r = p.getBoundingClientRect();


      active = {
        el: p,
        ox: e.clientX - r.left,
        oy: e.clientY - r.top
      };


      targets
        .find(t => t.dataset.id === p.dataset.id)
        .classList.add('active');
    });


    p.addEventListener('pointermove', e => {
      if (!active || active.el !== p) return;

      const pr = playground.getBoundingClientRect();

      p.style.left = `${e.clientX - pr.left - active.ox}px`;
      p.style.top  = `${e.clientY - pr.top  - active.oy}px`;
    });


    p.addEventListener('pointerup', () => {
      if (!active) return;

      p.classList.remove('is-dragging');

      const tc = targetCenter(p.dataset.id);
      const pc = center(p);

      const dist = Math.hypot(tc.x - pc.x, tc.y - pc.y);
      const rotOk = degDiff(+p.dataset.rot, 0) <= SNAP_ROT;

      if (dist < SNAP_DIST && rotOk) {
        const pr = playground.getBoundingClientRect();


        p.style.left = `${tc.x - pr.left - 60}px`;
        p.style.top  = `${tc.y - pr.top  - 60}px`;

        p.dataset.rot = '0';
        p.dataset.locked = '1';
        applyTransform(p);

        p.classList.add('is-locked');
      }


      targets.forEach(t => t.classList.remove('active'));

      active = null;


      if (pieces.every(x => x.dataset.locked === '1')) {
        playground.classList.add('complete');
      }
    });
  });


  playground.addEventListener('wheel', e => {
    if (!active) return;

    e.preventDefault();

    active.el.dataset.rot =
      +active.el.dataset.rot + (e.deltaY > 0 ? 15 : -15);

    applyTransform(active.el);
  }, { passive: false });
});
