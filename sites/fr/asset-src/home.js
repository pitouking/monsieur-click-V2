(function(){
  'use strict';
  document.documentElement.classList.add('js');
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  let ticking=false;

  const nav=document.getElementById('nav');
  if(nav)addEventListener('scroll',()=>{
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(()=>{nav.classList.toggle('scrolled',scrollY>40);ticking=false;});
  },{passive:true});
  const toggle=document.getElementById('menuToggle'),links=document.getElementById('navLinks');
  function setMenu(open){
    if(!links||!toggle)return;
    links.classList.toggle('show',open);
    links.setAttribute('aria-hidden',String(!open));
    document.body.classList.toggle('menu-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.textContent=open?'✕':'☰';
    toggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
  }
  if(toggle&&links){
    toggle.addEventListener('click',()=>setMenu(!links.classList.contains('show')));
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  }

  const revealEls=document.querySelectorAll('.reveal');
  if(reduce||!('IntersectionObserver' in window)){
    revealEls.forEach(el=>el.classList.add('in'));
  }else{
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    revealEls.forEach(el=>io.observe(el));
  }

  document.querySelectorAll('.faq-q').forEach(q=>q.addEventListener('click',()=>{
    const item=q.parentElement,a=item.querySelector('.faq-a'),open=item.classList.contains('open');
    if(!a)return;
    document.querySelectorAll('.faq-item').forEach(i=>{
      const pane=i.querySelector('.faq-a');
      const btn=i.querySelector('.faq-q');
      i.classList.remove('open');
      if(pane)pane.style.maxHeight=null;
      if(btn)btn.setAttribute('aria-expanded','false');
    });
    if(!open){
      item.classList.add('open');
      a.style.maxHeight=a.scrollHeight+'px';
      q.setAttribute('aria-expanded','true');
    }
  }));

  function whenNear(el,fn,rootMargin){
    if(!el)return;
    if(!('IntersectionObserver' in window)){
      if('requestIdleCallback' in window)requestIdleCallback(fn,{timeout:4000});
      else setTimeout(fn,2000);
      return;
    }
    const io=new IntersectionObserver((es,o)=>{
      if(es.some(e=>e.isIntersecting)){o.disconnect();fn();}
    },{rootMargin:rootMargin||'240px 0px',threshold:0});
    io.observe(el);
  }

  function bootChecklist(){
    const cl=document.getElementById('checklist');
    if(!cl)return;
    const kids=[...cl.children];
    kids.forEach((c,i)=>setTimeout(()=>c.classList.add('in'),i*80));
  }

  function bootJourney(){
    const steps=[
      {e:'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',t:'La recherche',d:'Mardi, 9 h. Un client tape son besoin sur Google, suivi du nom de sa ville. La décision commence ici.'},
      {e:'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',t:'Le pack local',d:'Trois fiches Google Business Profile s\'affichent sur Google Maps. La vôtre en fait-elle partie ?'},
      {e:'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l2.6 5.28 5.83.85-4.22 4.11 1 5.8L12 16.9l-5.21 2.74 1-5.8-4.22-4.11 5.83-.85L12 3.5Z"/></svg>',t:'Les avis',d:'Il lit vos avis Google. Cinq étoiles, des réponses soignées : le doute s\'efface.'},
      {e:'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.7 4.5L18 9l-4.3 1.5L12 15l-1.7-4.5L6 9l4.3-1.5L12 3Z"/><path d="M18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z"/></svg>',t:'Les IA (GEO)',d:'Il demande aussi à ChatGPT, Gemini ou Perplexity. Votre entreprise est citée… ou absente. C\'est le GEO : être la source que les IA recommandent.'},
      {e:'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 4.5h3.6l1.8 4.5-2.3 1.6a12.5 12.5 0 0 0 5.5 5.5l1.6-2.3 4.5 1.8v3.6a1.8 1.8 0 0 1-1.9 1.8A16 16 0 0 1 2.7 6.4 1.8 1.8 0 0 1 4.5 4.5Z"/></svg>',t:'L\'appel',d:'Le téléphone sonne. Il sait déjà pourquoi il vous appelle. Le parcours aboutit chez vous.'}
    ];
    const jbig=document.getElementById('jbig'),jtitle=document.getElementById('jtitle'),jdesc=document.getElementById('jdesc'),jstepk=document.getElementById('jstepk'),jrail=document.getElementById('jrail'),jrailScroll=document.getElementById('jrailScroll'),jprog=document.getElementById('jprog'),jtrack=document.getElementById('jtrack');
    if(!(jbig&&jrail&&jtrack&&jprog))return;
    const jMobile=matchMedia('(max-width:920px)');
    let jcur=-1,jt,booted=false;
    function isJMobile(){return jMobile.matches;}
    function setProg(p){
      jprog.style.transform='scaleX('+Math.max(0,Math.min(1,p))+')';
    }
    function scrollDotIntoView(i){
      const dot=jrail.children[i];
      if(!dot)return;
      /* scrollIntoView évite le couple offsetLeft/clientWidth (forced layout PSI) */
      if(typeof dot.scrollIntoView==='function'){
        try{dot.scrollIntoView({inline:'center',block:'nearest',behavior:reduce?'auto':'smooth'});}
        catch(_){dot.scrollIntoView(false);}
      }
    }
    const frag=document.createDocumentFragment();
    steps.forEach((s,i)=>{
      const d=document.createElement('div');
      d.className='jdot'+(i===0?' active':'');
      d.setAttribute('role','button');
      d.setAttribute('tabindex','0');
      d.setAttribute('aria-label','Étape '+(i+1)+': '+s.t);
      d.innerHTML='<span>'+s.e+'</span> '+s.t;
      d.addEventListener('click',()=>{
        if(isJMobile()||jMetrics.range<=0){setStep(i);return;}
        measureJ();scrollTo({top:jMetrics.top+(i+0.5)/steps.length*jMetrics.range,behavior:'smooth'});
      });
      d.addEventListener('keydown',e=>{
        if(e.key==='Enter'||e.key===' '){e.preventDefault();d.click();}
      });
      frag.appendChild(d);
    });
    jrail.appendChild(frag);
    function setStep(i,opts){
      opts=opts||{};
      if(i===jcur)return;
      jcur=i;
      const s=steps[i];
      const grp=[jbig,jtitle,jdesc,jstepk];
      grp.forEach(el=>el.classList.add('jswap'));
      clearTimeout(jt);
      jt=setTimeout(()=>{
        if(i!==jcur)return;
        jbig.innerHTML=s.e;jtitle.textContent=s.t;jdesc.textContent=s.d;
        jstepk.textContent='Étape '+(i+1)+' / '+steps.length;
        grp.forEach(el=>el.classList.remove('jswap'));
      },opts.instant?0:180);
      [...jrail.children].forEach((c,k)=>c.classList.toggle('active',k===i));
      if(isJMobile()){
        setProg((i+1)/steps.length);
        if(!opts.skipScroll)scrollDotIntoView(i);
      }
    }
    const jMetrics={top:0,range:0};
    function measureJ(){
      if(isJMobile()){jMetrics.top=0;jMetrics.range=0;return;}
      const rect=jtrack.getBoundingClientRect();
      jMetrics.top=scrollY+rect.top;
      jMetrics.range=rect.height-innerHeight;
    }
    let jScrollTick=false;
    function onScrollJ(){
      if(isJMobile()){jScrollTick=false;return;}
      if(jScrollTick)return;
      jScrollTick=true;
      requestAnimationFrame(()=>{
        if(jMetrics.range<=0){jScrollTick=false;return;}
        const top=jtrack.getBoundingClientRect().top;
        let p=(-top)/jMetrics.range;
        p=Math.max(0,Math.min(1,p));
        setProg(p);
        setStep(Math.min(steps.length-1,Math.floor(p*steps.length)),{skipScroll:true});
        jScrollTick=false;
      });
    }
    measureJ();
    setStep(0,{instant:true,skipScroll:true});
    booted=true;
    addEventListener('scroll',onScrollJ,{passive:true});
    addEventListener('resize',()=>{measureJ();if(isJMobile())setStep(jcur<0?0:jcur,{skipScroll:true});},{passive:true});
    jMobile.addEventListener('change',()=>{measureJ();const i=Math.max(0,jcur);jcur=-1;setStep(i,{skipScroll:true});});
    if(!isJMobile())onScrollJ();
  }

  function bootParticles(){
    const cv=document.getElementById('particles');
    if(!cv||reduce)return;
    const ctx=cv.getContext('2d',{alpha:true});
    let W,H,pts=[],raf=null,running=false;
    function size(w,h){
      const dpr=Math.min(window.devicePixelRatio||1,1.5);
      W=Math.max(1,Math.floor(w));H=Math.max(1,Math.floor(h));
      cv.width=Math.floor(W*dpr);cv.height=Math.floor(H*dpr);
      cv.style.width=W+'px';cv.style.height=H+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const n=Math.min(48,Math.floor(W*H/18000));
      pts=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}));
    }
    function draw(){
      if(!running)return;
      ctx.clearRect(0,0,W,H);
      for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;}
      for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<110){ctx.strokeStyle='rgba(53,167,230,'+(0.2*(1-d/110))+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}
      for(const p of pts){ctx.fillStyle='rgba(140,200,245,.8)';ctx.beginPath();ctx.arc(p.x,p.y,1.5,0,7);ctx.fill();}
      raf=requestAnimationFrame(draw);
    }
    function startP(){if(!running){running=true;draw();}}
    function stopP(){running=false;if(raf)cancelAnimationFrame(raf);}
    if('ResizeObserver' in window){
      new ResizeObserver(es=>{const box=es[0].contentRect;if(box.width>0)size(box.width,box.height);}).observe(cv);
    }else{
      size(cv.clientWidth,cv.clientHeight);
      addEventListener('resize',()=>size(cv.clientWidth,cv.clientHeight),{passive:true});
    }
    const pio=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?startP():stopP()),{threshold:.02});
    pio.observe(cv);
  }

  function bootReviewsFallback(){
    const widgetWrap=document.getElementById('widgetWrap'),revFallback=document.getElementById('revFallback');
    if(!(widgetWrap&&revFallback))return;
    function checkReviews(){
      const el=widgetWrap.querySelector('emr-simple-carousel');
      if(!el||el.clientHeight<40){
        revFallback.style.display='flex';
        const row=document.getElementById('revRow');
        if(row&&!row.dataset.duped){row.innerHTML+=row.innerHTML;row.dataset.duped='1';}
      }
    }
    setTimeout(checkReviews,3200);
  }

  function bootConstellation(){
    const nodes=['Site internet','SEO','Google Business Profile','Avis Google','Schema.org','Contenus StoryBrand','Pages Services','Pages Locales','Knowledge Graph','AI Overviews','ChatGPT','Gemini','Claude','Perplexity','Veille permanente'];
    const cont=document.getElementById('constellation'),svg=document.getElementById('ecoLinks'),center=document.getElementById('ecoCenter');
    if(!(cont&&svg))return;
    const N=nodes.length,els=[],lines=[],base=[];let offset=0,paused=false,ecoRun=false;
    nodes.forEach((label,i)=>{
      const el=document.createElement('div');el.className='enode';el.textContent=label;cont.appendChild(el);
      const ln=document.createElementNS('http://www.w3.org/2000/svg','line');ln.setAttribute('x1','50');ln.setAttribute('y1','50');svg.appendChild(ln);
      els.push(el);lines.push(ln);base.push((i/N)*Math.PI*2 - Math.PI/2);
      el.addEventListener('mouseenter',()=>{paused=true;els.forEach((p,k)=>p.classList.toggle('dim',k!==i));lines.forEach((l,k)=>l.classList.toggle('hot',k===i));el.classList.remove('dim');el.classList.add('hot');});
      el.addEventListener('mouseleave',()=>{paused=false;reset();});
    });
    if(center){
      center.addEventListener('mouseenter',()=>{paused=true;els.forEach(p=>{p.classList.remove('dim');p.classList.add('hot');});lines.forEach(l=>l.classList.add('hot'));});
      center.addEventListener('mouseleave',()=>{paused=false;reset();});
    }
    function reset(){els.forEach(p=>p.classList.remove('dim','hot'));lines.forEach(l=>l.classList.remove('hot'));}
    let cw=0,ch=0;
    function place(){
      if(cw<1||ch<1)return;
      const r=Math.min(cw,ch)*0.36,cx=cw/2,cy=ch/2;
      els.forEach((el,i)=>{const a=base[i]+offset;const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;
        el.style.transform='translate(-50%,-50%)';el.style.left=(x/cw*100)+'%';el.style.top=(y/ch*100)+'%';
        lines[i].setAttribute('x2',(x/cw*100).toFixed(2));lines[i].setAttribute('y2',(y/ch*100).toFixed(2));});
    }
    function tick(){if(ecoRun){if(!paused&&!reduce)offset+=0.0018;place();}requestAnimationFrame(tick);}
    if('ResizeObserver' in window){
      new ResizeObserver(es=>{const box=es[0].contentRect;cw=box.width;ch=box.height;place();}).observe(cont);
    }else{
      function measureEco(){cw=cont.clientWidth;ch=cont.clientHeight;}
      measureEco();addEventListener('resize',()=>{measureEco();place();},{passive:true});
    }
    requestAnimationFrame(tick);
    if('IntersectionObserver' in window){new IntersectionObserver(es=>{ecoRun=es.some(e=>e.isIntersecting);},{threshold:.05}).observe(cont);}
    else ecoRun=true;
  }

  whenNear(document.getElementById('checklist'),bootChecklist,'120px 0px');
  whenNear(document.getElementById('parcours')||document.getElementById('jtrack'),bootJourney,'320px 0px');
  whenNear(document.getElementById('clickfirst')||document.getElementById('constellation'),bootConstellation,'280px 0px');
  whenNear(document.getElementById('approche')||document.getElementById('particles'),bootParticles,'280px 0px');
  whenNear(document.getElementById('widgetWrap'),bootReviewsFallback,'200px 0px');
})();
