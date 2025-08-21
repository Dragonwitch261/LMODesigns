(function(){
  const track = document.getElementById('reviewsTrack');
  if (!track) return;

  const prevBtn = document.getElementById('reviewsPrev');
  const nextBtn = document.getElementById('reviewsNext');
  const viewport = track.parentElement;

  const defaultPhotos = [
    'img/customers/default_1.jpg',
    'img/customers/default_2.jpg',
    'img/customers/default_3.jpg',
    'img/customers/default_4.jpg',
    'img/customers/default_5.jpg',
    'img/customers/default_6.jpg',
    'img/customers/default_7.jpg',
  ];

  const names = [
    'Alex Carter','Jamie Nguyen','Priya Shah','Leo Martinez','Nina Brooks',
    'Samir Patel','Mia Johnson','Hiro Tanaka','Ella Fischer','Omar Hassan',
    'Lara Campos','Noah Williams','Aisha Khan','Felix Romero','Zoe Chen'
  ];

  const roles = [
    'Small Business Owner','Freelancer','Cafe Manager','E-commerce Founder',
    'Marketing Lead','Local Artist','Consultant','Nonprofit Director',
    'Boutique Owner','Photographer'
  ];

  const samples = [
    'Super easy to work with and the site looks amazing.',
    'Clean design, quick turnaround, and stellar communication.',
    'Our bookings doubled after launch. Couldn\'t be happier.',
    'Fast, modern, and exactly what we needed.',
    'Thoughtful UX and great mobile performance!',
    'They handled everything from copy to deployment—stress free.',
    'Support has been fantastic even after delivery.',
    'We saw faster load times and better SEO rankings.',
    'Beautiful work—clients keep complimenting our website.',
    'A reliable partner for our growing brand.'
  ];

  function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

  const baseCount = 10;
  const reviews = Array.from({length: baseCount}, (_,i)=>({
    name: rand(names),
    role: rand(roles),
    photo: defaultPhotos[i % defaultPhotos.length],
    text: rand(samples),
    stars: randInt(4,5)
  }));

  function starString(n){ return '★★★★★'.slice(0,n) + '☆☆☆☆☆'.slice(0,5-n); }
  const reviewToHTML = (r)=>{
    return (
      '<article class="review-item" role="group" aria-roledescription="slide">' +
        '<div class="review-content">“'+ r.text +'”</div>' +
        '<div class="review-meta">' +
          '<img src="'+ r.photo +'" alt="Profile picture of '+ r.name +'" class="review-img" />' +
          '<div class="review-author">' +
            '<h3 class="review-name">'+ r.name +'</h3>' +
            '<p class="review-role">'+ r.role +'</p>' +
          '</div>' +
          '<div class="review-stars" aria-label="'+ r.stars +' out of 5 stars">'+ starString(r.stars) +'</div>' +
        '</div>' +
      '</article>'
    );
  };

  // Build triple set for seamless loop
  const slides = [...reviews, ...reviews, ...reviews];
  track.innerHTML = slides.map(reviewToHTML).join('');

  let index = reviews.length; // start centered on middle copy
  let slideSize = 0; // layout width + gap
  const dwellMs = 3200;
  const animMs = 600;
  let timerId = null;

  function getGapPx(){
    const cs = getComputedStyle(track);
    const gap = cs.gap || cs.columnGap || '0px';
    return parseFloat(gap) || 0;
  }

  function measure(){
    const first = track.children[0];
    if (!first) return;
    const w = first.offsetWidth; // layout width, unaffected by scale
    slideSize = w + getGapPx();
  }

  function setActive(){
    const items = track.children;
    for (let i=0;i<items.length;i++) items[i].classList.remove('is-active');
    const activeEl = items[index];
    if (activeEl) activeEl.classList.add('is-active');
  }

  function setTransform(noAnim){
    if (noAnim) track.classList.add('no-animate'); else track.classList.remove('no-animate');
    const items = track.children;
    const activeEl = items[index];
    const activeW = activeEl ? activeEl.offsetWidth : (items[0] ? items[0].offsetWidth : 0);
    const centerOffset = (viewport.clientWidth - activeW) / 2;
    const x = -(index * slideSize) + centerOffset;
    track.style.transform = 'translateX(' + x + 'px)';
  }

  function normalizeIfNeeded(){
    const n = reviews.length;
    if (index >= 2*n){
      index -= n;
      setTransform(true);
    } else if (index < n){
      index += n;
      setTransform(true);
    }
  }

  function next(){
    index += 1;
    setActive();
    setTransform(false);
  }

  function prev(){
    index -= 1;
    setActive();
    setTransform(false);
  }

  function schedule(){
    clearTimeout(timerId);
    timerId = setTimeout(function(){ next(); schedule(); }, dwellMs + animMs);
  }

  // Pause/resume
  function pause(){ clearTimeout(timerId); }
  function resume(){ schedule(); }

  track.addEventListener('transitionend', normalizeIfNeeded);
  viewport.addEventListener('mouseenter', pause);
  viewport.addEventListener('mouseleave', resume);
  viewport.addEventListener('focusin', pause);
  viewport.addEventListener('focusout', resume);
  window.addEventListener('resize', function(){ measure(); setTransform(true); });

  if (prevBtn) prevBtn.addEventListener('click', function(){ pause(); prev(); resume(); });
  if (nextBtn) nextBtn.addEventListener('click', function(){ pause(); next(); resume(); });

  // Keyboard arrows on viewport
  if (viewport) {
    viewport.addEventListener('keydown', function(e){
      if (e.key === 'ArrowLeft'){ pause(); prev(); resume(); }
      else if (e.key === 'ArrowRight'){ pause(); next(); resume(); }
    });
  }

  // Init
  measure();
  setActive();
  setTransform(true);
  setTimeout(resume, 300);
})();
