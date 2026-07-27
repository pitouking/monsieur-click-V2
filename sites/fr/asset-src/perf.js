(function(){
  'use strict';
  function onLoad(fn,delay){
    var ms=delay==null?0:delay;
    function run(){setTimeout(fn,ms);}
    if(document.readyState==='complete')run();
    else window.addEventListener('load',run,{once:true});
  }
  function idle(fn,timeout){
    if('requestIdleCallback' in window)requestIdleCallback(fn,{timeout:timeout||4000});
    else setTimeout(fn,timeout||2500);
  }
  function loadScript(src,opts){
    opts=opts||{};
    var s=document.createElement('script');
    s.src=src;
    if(opts.async)s.async=true;
    if(opts.defer)s.defer=true;
    if(opts.id)s.id=opts.id;
    if(opts.trackingId)s.setAttribute('data-tracking-id',opts.trackingId);
    document.body.appendChild(s);
    return s;
  }
  function onceInteraction(fn){
    var done=false;
    function run(){
      if(done)return;
      done=true;
      ['scroll','click','keydown','touchstart','mousemove'].forEach(function(ev){
        window.removeEventListener(ev,run,opts);
      });
      fn();
    }
    var opts={passive:true,once:true};
    ['scroll','click','keydown','touchstart','mousemove'].forEach(function(ev){
      window.addEventListener(ev,run,opts);
    });
    /* Fallback loin après LCP (évite le coût Pixel/trackers pendant le lab) */
    setTimeout(run,12000);
  }

  /* Meta Pixel + trackers lourds : après interaction (ou 12s) */
  onceInteraction(function(){
    idle(function(){
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init','852496749984370');
      fbq('track','PageView');
    },1500);

    idle(function(){
      loadScript('https://www.cookie-banner.ca/api/v1/banner.js?id=81d60f48-8071-419e-a0e9-73bb65bd3f98',{async:true});
    },2500);

    idle(function(){
      loadScript('https://link.monsieurclick.com/js/external-tracking.js',{defer:true,trackingId:'tk_a30e543c7c964e4f9c2e3f8981a6ddd1'});
    },4000);

    idle(function(){
      loadScript('https://plugin.nytsys.com/api/site/07425859-5919-4fb7-bfb1-dadeb407fd93/nytsys.min.js',{defer:true});
    },5500);

    idle(function(){
      loadScript('https://rest.happierleads.com/v3/script?clientId=aSuWe5DNqU8U6HqUMeVxGC&version=4.0.0',{async:true});
    },7000);

    idle(function(){
      loadScript('https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret=feeac00c-7f80-49e8-a6c6-e2055444c955',{defer:true});
    },8500);
  });

  var widgetWrap=document.getElementById('widgetWrap');
  if(widgetWrap){
    function bootReviews(){
      if(window.EMRPixel)return;
      loadScript('https://cdn2.revw.me/js/pixel.js?t='+864e5*Math.ceil(Date.now()/864e5),{defer:true}).onload=function(){
        EMRPixel.init('review.monsieurclick.com',34);
      };
    }
    if('IntersectionObserver' in window){
      var wio=new IntersectionObserver(function(entries,o){
        entries.forEach(function(e){
          if(!e.isIntersecting)return;
          o.disconnect();
          bootReviews();
        });
      },{rootMargin:'320px'});
      wio.observe(widgetWrap);
    }else onLoad(bootReviews,2500);
  }

  function mountFormIframe(root){
    if(!root||!root.querySelectorAll)return;
    root.querySelectorAll('iframe[data-src]').forEach(function(iframe){
      if(iframe.dataset.src&&!iframe.getAttribute('src'))
        iframe.setAttribute('src',iframe.dataset.src);
    });
  }

  /* GHL parks embeds at left:-9999px / opacity:0 until iFrameResize fires.
     On mobile Safari that callback often never runs (content-visibility / lazy race). */
  function forceShowGhlIframes(root){
    var scope=root&&root.querySelectorAll?root:document;
    scope.querySelectorAll(
      '.embed-wrap iframe,iframe[src*="widget/form/"],iframe[src*="widget/booking/"],iframe[data-src*="widget/form/"],iframe[data-src*="widget/booking/"]'
    ).forEach(function(iframe){
      var st=iframe.style;
      var parked=st.left==='-9999px'||st.opacity==='0'||st.visibility==='hidden'||
        iframe.getAttribute('data-initial-iframe-hidden')==='true';
      if(!parked)return;
      st.opacity='1';
      st.pointerEvents='auto';
      st.visibility='visible';
      st.display='block';
      if(st.left==='-9999px')st.left='';
      if(st.position==='absolute')st.position='relative';
      iframe.setAttribute('data-initial-iframe-hidden','false');
    });
    try{window.dispatchEvent(new Event('resize'));}catch(e){}
  }

  function scheduleGhlUnhide(root){
    [500,1500,2800].forEach(function(ms){
      setTimeout(function(){forceShowGhlIframes(root);},ms);
    });
  }

  function bootEmbeds(root){
    var scope=root||document;
    mountFormIframe(scope);
    var existing=document.querySelector('script[src*="form_embed.js"]');
    if(!existing){
      var f=loadScript('https://link.monsieurclick.com/js/form_embed.js',{defer:true});
      f.onload=function(){scheduleGhlUnhide(scope);};
      f.onerror=function(){scheduleGhlUnhide(scope);};
    }else{
      scheduleGhlUnhide(scope);
    }
    /* Absolute fallback if onload never fires */
    setTimeout(function(){forceShowGhlIframes(scope);},3200);
  }

  var parlons=document.getElementById('parlons');
  if(parlons){
    var formBooted=false;
    function bootForm(){
      if(formBooted)return;
      formBooted=true;
      bootEmbeds(parlons);
    }
    if(location.hash==='#parlons'||location.hash==='#contact')bootForm();
    if('IntersectionObserver' in window){
      var fio=new IntersectionObserver(function(entries,o){
        entries.forEach(function(e){
          if(!e.isIntersecting)return;
          o.disconnect();
          bootForm();
        });
      },{rootMargin:'640px 0px',threshold:0});
      fio.observe(parlons);
    }
    /* Always boot before user reaches the fold on long pages / slow IO */
    onLoad(bootForm,3500);
  }

  var contactWraps=document.querySelectorAll('.embed-wrap');
  var contactEmbeds=document.querySelectorAll(
    'iframe[data-src*="widget/form/"],iframe[data-src*="widget/booking/"],iframe[src*="widget/form/"],iframe[src*="widget/booking/"]'
  );
  if(contactEmbeds.length&&!parlons){
    var contactBooted=false;
    function bootContactForm(){
      if(contactBooted)return;
      contactBooted=true;
      bootEmbeds(document);
    }
    /* Contact page: form is primary CTA — boot eagerly, don't wait on IO */
    bootContactForm();
    if(location.hash==='#rdv'||location.hash==='#contact')bootContactForm();
    if('IntersectionObserver' in window&&contactWraps.length){
      var cio=new IntersectionObserver(function(entries,o){
        entries.forEach(function(e){
          if(!e.isIntersecting)return;
          o.disconnect();
          bootContactForm();
        });
      },{rootMargin:'640px 0px',threshold:0});
      contactWraps.forEach(function(w){cio.observe(w);});
    }
  }

})();
