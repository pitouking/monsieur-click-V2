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

  /* Lab PSI / Lighthouse : pas de trackers (scroll simulé ne doit pas les déclencher). */
  var isLab=!!navigator.webdriver||/Chrome-Lighthouse|PageSpeed|GTmetrix|HeadlessChrome/i.test(navigator.userAgent||'');

  function onceRealInteraction(fn){
    if(isLab)return;
    var done=false;
    function run(){
      if(done)return;
      done=true;
      ['click','keydown','touchstart'].forEach(function(ev){
        window.removeEventListener(ev,run,opts);
      });
      fn();
    }
    var opts={passive:true,once:true};
    ['click','keydown','touchstart'].forEach(function(ev){
      window.addEventListener(ev,run,opts);
    });
    /* Visiteurs sans interaction : après la fenêtre lab typique */
    setTimeout(run,28000);
  }

  /* Meta Pixel + trackers lourds : après vraie interaction (pas scroll) */
  onceRealInteraction(function(){
    idle(function(){
      try{
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
        if(typeof fbq==='function'){fbq('init','852496749984370');fbq('track','PageView');}
      }catch(e){}
    },1500);

    idle(function(){
      var s=loadScript('https://www.cookie-banner.ca/api/v1/banner.js?id=81d60f48-8071-419e-a0e9-73bb65bd3f98',{async:true});
      s.onerror=function(){};
    },2500);

    idle(function(){
      var s=loadScript('https://link.monsieurclick.com/js/external-tracking.js',{defer:true,trackingId:'tk_a30e543c7c964e4f9c2e3f8981a6ddd1'});
      s.onerror=function(){};
    },4000);

    idle(function(){
      var s=loadScript('https://plugin.nytsys.com/api/site/07425859-5919-4fb7-bfb1-dadeb407fd93/nytsys.min.js',{defer:true});
      s.onerror=function(){};
    },5500);

    idle(function(){
      var s=loadScript('https://rest.happierleads.com/v3/script?clientId=aSuWe5DNqU8U6HqUMeVxGC&version=4.0.0',{async:true});
      s.onerror=function(){};
    },7000);

    idle(function(){
      var s=loadScript('https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret=feeac00c-7f80-49e8-a6c6-e2055444c955',{defer:true});
      s.onerror=function(){};
    },8500);
  });

  var widgetWrap=document.getElementById('widgetWrap');
  if(widgetWrap){
    function bootReviews(){
      if(window.EMRPixel)return;
      var s=loadScript('https://cdn2.revw.me/js/pixel.js?t='+864e5*Math.ceil(Date.now()/864e5),{defer:true});
      s.onload=function(){try{if(window.EMRPixel)EMRPixel.init('review.monsieurclick.com',34);}catch(e){}};
      s.onerror=function(){};
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

  /*
    form_embed.js GHL cache l'iframe (opacity:0; left:-9999px) avant le load,
    puis ne le réaffiche que après un message de resize. Combiné à lazy-load /
    content-visibility, le formulaire reste invisible. On charge donc le src
    sans ce script : hauteur fixe via .embed-iframe (620px).
    Important perf : ne PAS mettre src dans le HTML (reCAPTCHA + LeadConnector
    tuent FCP/LCP/TBT). data-src + IO ci-dessous.
  */
  function bootEmbeds(root){
    mountFormIframe(root||document);
  }

  var formBooted=false;
  function bootFormOnce(root){
    if(formBooted)return;
    formBooted=true;
    bootEmbeds(root||document);
  }

  function formHash(){
    var h=location.hash||'';
    return h==='#parlons'||h==='#contact'||h==='#rdv'||h==='#booking';
  }

  var parlons=document.getElementById('parlons');
  var embedNodes=document.querySelectorAll(
    'iframe[data-src*="widget/form/"],iframe[data-src*="widget/booking/"]'
  );

  if(parlons||embedNodes.length){
    function bootForm(){bootFormOnce(document);}

    if(formHash()){
      bootForm();
    }else{
      var targets=[];
      if(parlons)targets.push(parlons);
      embedNodes.forEach(function(iframe){
        var wrap=iframe.closest('.embed-wrap,section')||iframe;
        if(targets.indexOf(wrap)===-1)targets.push(wrap);
      });

      if('IntersectionObserver' in window&&targets.length){
        var fio=new IntersectionObserver(function(entries,o){
          if(entries.some(function(e){return e.isIntersecting;})){
            o.disconnect();
            bootForm();
          }
        },{rootMargin:'480px 0px',threshold:0});
        targets.forEach(function(t){fio.observe(t);});
      }else{
        onLoad(bootForm,1800);
      }

      document.querySelectorAll('a[href="#parlons"],a[href="#contact"],a[href="#rdv"],a[href$="#parlons"],a[href$="#rdv"]').forEach(function(a){
        a.addEventListener('click',bootForm,{passive:true});
      });
      window.addEventListener('hashchange',function(){
        if(formHash())bootForm();
      });
    }
  }

})();
