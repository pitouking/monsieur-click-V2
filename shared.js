document.documentElement.classList.add('js');
// Monsieur Click — script partagé des pages intérieures
(function(){
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
    toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
  }
  if(toggle&&links){
    toggle.addEventListener('click',()=>setMenu(!links.classList.contains('show')));
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  }

  const revealEls=[...document.querySelectorAll('.reveal')];
  revealEls.forEach((el,i)=>el.style.setProperty('--reveal-delay',`${Math.min(i%3,2)*70}ms`));
  if(reduce||!('IntersectionObserver' in window)){
    revealEls.forEach(el=>el.classList.add('in'));
  }else{
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    revealEls.forEach(el=>io.observe(el));
  }

  document.querySelectorAll('.faq-q').forEach(q=>q.addEventListener('click',()=>{
    const item=q.parentElement,a=item.querySelector('.faq-a'),open=item.classList.contains('open');
    if(!a)return;
    document.querySelectorAll('.faq-item').forEach(i=>{const pane=i.querySelector('.faq-a');i.classList.remove('open');if(pane)pane.style.maxHeight=null});
    if(!open){item.classList.add('open');a.style.maxHeight=a.scrollHeight+'px';}
  }));

  const form=document.getElementById('auditForm'),msg=document.getElementById('cformMsg');
  if(form){form.addEventListener('submit',async e=>{
    e.preventDefault();const key=form.querySelector('[name=access_key]').value;if(msg)msg.style.display='block';
    if(key==='VOTRE_CLE_WEB3FORMS'){if(msg)msg.textContent='Formulaire à connecter (clé Web3Forms ou GoHighLevel) avant mise en ligne.';return;}
    if(msg)msg.textContent='Envoi en cours...';
    try{const r=await fetch(form.action,{method:'POST',body:new FormData(form)});
      if(msg)msg.textContent=r.ok?'Merci ! Votre demande est envoyée. Réponse sous 24 h ouvrées.':'Une erreur est survenue, réessayez ou écrivez à contact@monsieurclick.com.';
      if(r.ok)form.reset();}
    catch{if(msg)msg.textContent='Une erreur est survenue, réessayez ou écrivez à contact@monsieurclick.com.';}
  });}
})();
