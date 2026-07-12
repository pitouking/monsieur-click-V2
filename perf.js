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
    setTimeout(run,8000);
  }

  onLoad(function(){
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init','852496749984370');
    fbq('track','PageView');
  },3500);

  onceInteraction(function(){
    idle(function(){
      loadScript('https://www.cookie-banner.ca/api/v1/banner.js?id=d052afb4-30be-458a-8384-c95202aaee34',{async:true});
    },2000);
  });

  idle(function(){
    loadScript('https://link.monsieurclick.com/js/external-tracking.js',{defer:true,trackingId:'tk_a30e543c7c964e4f9c2e3f8981a6ddd1'});
  },4500);

  idle(function(){
    loadScript('https://plugin.nytsys.com/api/site/07425859-5919-4fb7-bfb1-dadeb407fd93/nytsys.min.js',{defer:true});
  },6500);

  idle(function(){
    loadScript('https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret=feeac00c-7f80-49e8-a6c6-e2055444c955',{defer:true});
  },9000);

  idle(function(){
    loadScript('https://rest.happierleads.com/v3/script?clientId=aSuWe5DNqU8U6HqUMeVxGC&version=4.0.0',{async:true});
  },7500);

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

  var parlons=document.getElementById('parlons');
  if(parlons){
    function bootForm(){
      if(document.querySelector('script[src*="form_embed.js"]'))return;
      loadScript('https://link.monsieurclick.com/js/form_embed.js',{defer:true});
    }
    if('IntersectionObserver' in window){
      var fio=new IntersectionObserver(function(entries,o){
        entries.forEach(function(e){
          if(!e.isIntersecting)return;
          o.disconnect();
          bootForm();
        });
      },{rootMargin:'420px'});
      fio.observe(parlons);
    }else onLoad(bootForm,1500);
  }

  var contactIframe=document.querySelector('iframe[src*="widget/form/"]');
  if(contactIframe&&!parlons){
    idle(function(){
      if(!document.querySelector('script[src*="form_embed.js"]'))
        loadScript('https://link.monsieurclick.com/js/form_embed.js',{defer:true});
    },1200);
  }

})();
