import { FB_PIXEL_ID } from 'helpers/facebookPixel'
import Script from 'next/script'
import { useState } from 'react'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'

export const ThirdScript = () => {
  const [execute, setExecute] = useState(false)

  useAfterInteractive(() => {
    setExecute(true)
  }, [])

  if (!execute) return <></>

  return (
    <>
      <Script id="defer">{`/*!@shinsenter/defer.js@3.6.0*/
    !(function(o,u,s){function f(t,n,e){k?S(t,n):((e=e===s?f.lazy:e)?N:C).push(t,Math.max(e?350:0,n))}function i(t){j.head.appendChild(t)}function a(t,n){t.forEach(function(t){n(t)})}function r(n,t,e,c){a(t.split(" "),function(t){(c||o)[n+"EventListener"](t,e||p)})}function l(t,n,e,c){return(c=n?j.getElementById(n):s)||(c=j.createElement(t),n&&(c.id=n)),e&&r(g,b,e,c),c}function d(t,n){a(q.call(t.attributes),function(t){n(t.name,t.value)})}function h(t,n){return q.call((n||j).querySelectorAll(t))}function m(c,t){a(h("source,img",c),m),d(c,function(t,n,e){(e=/^data-(.+)/.exec(t))&&c[x](e[1],n)}),t&&(c.className+=" "+t),c[b]&&c[b]()}function t(t,n,e){f(function(n){a(n=h(t||"script[type=deferjs]"),function(t,e){t.src&&(e=l(v),d(t,function(t,n){t!=A&&e[x]("src"==t?"href":t,n)}),e.rel="preload",e.as=y,i(e))}),(function c(t,e){(t=n[E]())&&(e=l(y),d(t,function(t,n){t!=A&&e[x](t,n)}),e.text=t.text,t.parentNode.replaceChild(e,t),e.src&&!e.getAttribute("async")?r(g,b+" error",c,e):c())})()},n,e)}function p(t,n){for(n=k?(r(e,c),N):(r(e,w),k=f,N[0]&&r(g,c),C);n[0];)S(n[E](),n[E]())}var v="link",y="script",b="load",n="pageshow",g="add",e="remove",c="touchstart mousemove mousedown keydown wheel",w="on"+n in o?n:b,x="setAttribute",E="shift",A="type",I=o.IntersectionObserver,j=o.document||o,k=/p/.test(j.readyState),C=[],N=[],S=o.setTimeout,q=C.slice;f.all=t,f.dom=function(t,n,o,i,r){f(function(e){function c(t){i&&!1===i(t)||m(t,o)}e=I?new I(function(t){a(t,function(t,n){t.isIntersecting&&(e.unobserve(n=t.target),c(n))})},r):s,a(h(t||"[data-src]"),function(t){t[u]||(t[u]=f,e?e.observe(t):c(t))})},n,!1)},f.css=function(n,e,t,c,o){f(function(t){(t=l(v,e,c)).rel="stylesheet",t.href=n,i(t)},t,o)},f.js=function(n,e,t,c,o){f(function(t){(t=l(y,e,c)).src=n,i(t)},t,o)},f.reveal=m,o[u]=f,k||r(g,w),t()})(this,"Defer");`}</Script>
      <Script id="moengage">{`
          function moemoe(e,n,i,t,a,r,o,d){var s=e[a]=e[a]||[];if(s.invoked=0,s.initialised>0||s.invoked>0)return console.error("MoEngage Web SDK initialised multiple times. Please integrate the Web SDK only once!"),!1;e.moengage_object=a;var l={},g=function n(i){return function(){for(var n=arguments.length,t=Array(n),a=0;a<n;a++)t[a]=arguments[a];(e.moengage_q=e.moengage_q||[]).push({f:i,a:t})}},u=["track_event","add_user_attribute","add_first_name","add_last_name","add_email","add_mobile","add_user_name","add_gender","add_birthday","destroy_session","add_unique_user_id","moe_events","call_web_push","track","location_type_attribute"],m={onsite:["getData","registerCallback"]};for(var c in u)l[u[c]]=g(u[c]);for(var v in m)for(var f in m[v])null==l[v]&&(l[v]={}),l[v][m[v][f]]=g(v+"."+m[v][f]);r=n.createElement(i),o=n.getElementsByTagName("head")[0],r.async=1,r.src=t,o.appendChild(r),e.moe=e.moe||function(){return(s.invoked=s.invoked+1,s.invoked>1)?(console.error("MoEngage Web SDK initialised multiple times. Please integrate the Web SDK only once!"),!1):(d=arguments.length<=0?void 0:arguments[0],l)},r.addEventListener("load",function(){if(d)return e[a]=e.moe(d),e[a].initialised=e[a].initialised+1||1,!0}),r.addEventListener("error",function(){return console.error("Moengage Web SDK loading failed."),!1})};
          
          function moeevent(){
            moemoe(window,document,"script","https://cdn.moengage.com/webpush/moe_webSdk.min.latest.js","Moengage");
            Moengage = moe({
              app_id:"KW8JVVD7VJKF2EQHOHX2YYOA",
              debug_logs: 0
              });
          };
    
          Defer(moeevent, 0, true)
          `}</Script>
      <Script id="fbevent">{`
          function fbfb(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)};
    
          function fbevent() {
            fbfb(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('set', 'debug', false, ${FB_PIXEL_ID});
            fbq('set', 'autoConfig', true, ${FB_PIXEL_ID});
            fbq('init', ${FB_PIXEL_ID});
          };
    
          Defer(fbevent, 0, true);
        `}</Script>
      <Script id="countly">{`
          //some default pre init
          var Countly = Countly || {};
          Countly.q = Countly.q || [];
    
          //provide countly initialization parameters
          Countly.app_key = ${
            process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
              ? '"b3339752ab6da081b5fabf5e46be80ef26b666ca"'
              : '"7069fa6ddc5cfc1b456a4eff70bb1314839f8484"'
          };
          Countly.url = 'https://push.meshtics.com';
    
          Countly.q.push(['track_sessions']);
          Countly.q.push(['track_pageview']);
          Countly.q.push(['track_clicks']);
          Countly.q.push(['track_links']);
    
          //load countly script asynchronously
          function countly() {
            var cly = document.createElement('script'); cly.type = 'text/javascript';
            cly.async = true;
            //enter url of script here
            cly.src = 'https://cdnjs.cloudflare.com/ajax/libs/countly-sdk-web/20.4.0/countly.min.js';
            cly.onload = function(){Countly.init()};
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(cly, s);
          };
          Defer(countly, 0, true);
          `}</Script>
    </>
  )
}
