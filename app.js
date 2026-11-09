(function(){
  var ROOT=document.body.getAttribute("data-root")||"";
  var MES=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  var A=window.PA_INDEX||[];function needA(cb){if(window.PA_INDEX){A=window.PA_INDEX;return cb()}var s=document.createElement("script");s.src=ROOT+"data/indice.js";s.onload=function(){A=window.PA_INDEX;cb()};document.head.appendChild(s)}
  function $(s,r){return (r||document).querySelector(s)}
  function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
  function fmt(d){var p=d.split("-");return +p[2]+" "+MES[+p[1]-1]+" "+p[0]}
  function norm(s){return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")}
  function row(a){
    var li=document.createElement("li"),l=document.createElement("a");
    l.className="row";l.href=ROOT+a.u;
    var w=document.createElement("time");w.className="when";w.dateTime=a.d;w.textContent=fmt(a.d);
    var c=document.createElement("span");c.className="cat";c.textContent=a.c;
    var wh=document.createElement("span");wh.className="what";
    var t=document.createElement("span");t.className="t";t.textContent=a.t;
    var e=document.createElement("span");e.className="d";e.textContent=a.e;
    wh.appendChild(t);wh.appendChild(e);
    var g=document.createElement("span");g.className="go";g.textContent="Ler";
    l.appendChild(w);l.appendChild(c);l.appendChild(wh);l.appendChild(g);li.appendChild(l);return li;
  }
  try{
    var hoje=new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
    $("#hoje").textContent=hoje.charAt(0).toUpperCase()+hoje.slice(1);
  }catch(e){}

  var menu=$("#menu"),mbtn=$("#abrir-menu"),lastFocus=null;
  function openMenu(){lastFocus=document.activeElement;menu.hidden=false;mbtn.setAttribute("aria-expanded","true");document.body.style.overflow="hidden";$("#fechar-menu").focus()}
  function closeMenu(){if(menu.hidden)return;menu.hidden=true;mbtn.setAttribute("aria-expanded","false");document.body.style.overflow="";if(lastFocus&&lastFocus.focus)lastFocus.focus()}
  mbtn.addEventListener("click",openMenu);
  $("#fechar-menu").addEventListener("click",closeMenu);

  var busca=$("#busca"),q=$("#q"),bl=$("#busca-lista"),bs=$("#busca-status"),bLast=null;
  var shown=30,cur=[];
  function draw(){
    bl.innerHTML="";cur.slice(0,shown).forEach(function(a){bl.appendChild(row(a))});
    var m=document.getElementById("busca-mais");
    if(!m){m=document.createElement("button");m.id="busca-mais";m.type="button";m.className="btn";m.textContent="Mostrar mais resultados";
      m.addEventListener("click",function(){shown+=30;draw()});bl.parentNode.appendChild(m)}
    m.hidden=cur.length<=shown;
    bs.textContent=cur.length+(cur.length===1?" matéria encontrada":" matérias encontradas")+(cur.length>shown?" (mostrando "+shown+")":"");
  }
  function renderBusca(){
    var v=norm(q.value.trim());shown=30;
    if(!v){cur=A.slice(0,6);draw();bs.textContent="Últimas matérias";return}
    var ws=v.split(/\s+/);
    cur=A.filter(function(a){var t=norm(a.t+" "+a.e+" "+a.c+" "+(a.g||""));return ws.every(function(w){return t.indexOf(w)>-1})});
    cur.sort(function(x,y){var tx=norm(x.t).indexOf(v)>-1?0:1,ty=norm(y.t).indexOf(v)>-1?0:1;return tx-ty});
    if(cur.length)draw();
    else{bl.innerHTML="";var m=document.getElementById("busca-mais");if(m)m.hidden=true;bs.textContent="Nenhuma matéria encontrada para “"+q.value.trim()+"”. Tente o nome da banda, do artista ou da cidade."}
  }
  function openBusca(){bLast=document.activeElement;busca.hidden=false;document.body.style.overflow="hidden";q.focus();bs.textContent="Carregando…";needA(renderBusca)}
  function closeBusca(){if(busca.hidden)return;busca.hidden=true;document.body.style.overflow="";if(bLast&&bLast.focus)bLast.focus()}
  $("#abrir-busca").addEventListener("click",openBusca);
  $("#fechar-busca").addEventListener("click",closeBusca);
  q.addEventListener("input",renderBusca);
  document.addEventListener("keydown",function(ev){
    if(ev.key==="Escape"){closeBusca();closeMenu()}
    if(ev.key==="Tab"){
      var box=!busca.hidden?busca:(!menu.hidden?menu:null);if(!box)return;
      var f=$$("a[href],button,input",box).filter(function(n){return n.offsetParent!==null});
      if(!f.length)return;
      var first=f[0],last=f[f.length-1];
      if(ev.shiftKey&&document.activeElement===first){ev.preventDefault();last.focus()}
      else if(!ev.shiftKey&&document.activeElement===last){ev.preventDefault();first.focus()}
    }
  });
  window.addEventListener("resize",function(){if(innerWidth>1080)closeMenu()});
})();
(function(){
  var p=location.pathname,onHome=/\/(index\.html)?$/.test(p);
  if(!onHome)return;
  Array.prototype.forEach.call(document.querySelectorAll('a[aria-label*="início"],a[aria-label*="inicial"]'),function(a){
    a.addEventListener("click",function(e){e.preventDefault();window.scrollTo({top:0,behavior:"smooth"})});
  });
})();

/* título de editoria: encaixa na área clara, ao lado da divisão */
(function(){
  var t=document.querySelector('.cat-head.has-mascot .t-cat');if(!t)return;
  function fit(){
    t.style.fontSize='';
    if(innerWidth<900)return;
    var max=Math.min(Math.max(84,innerWidth*.085),132),s=max;
    t.style.fontSize=s+'px';
    var avail=innerWidth*.44-t.getBoundingClientRect().left-48;
    var w=t.scrollWidth;
    if(w>avail){s=Math.floor(s*avail/w);t.style.fontSize=s+'px'}
  }
  fit();addEventListener('resize',fit);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
})();

/* ao abrir uma página (editoria/matéria), começa sempre no topo, sem restaurar rolagem antiga */
(function(){
  try{if('scrollRestoration' in history)history.scrollRestoration='manual'}catch(e){}
  if(!location.hash){scrollTo(0,0);addEventListener('pageshow',function(){scrollTo(0,0)})}
})();


/* matérias servidas por dados: miniaturas, "carregar mais" e leitor (ler.html) */
window.PA_RUN=function(){
  var ROOT=document.body.getAttribute("data-root")||"";
  var A=window.PA_INDEX||[],BY={},S={b:{},i:{}},P={};
  A.forEach(function(a){BY[a.id]=a});
  var MES=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  var MESL=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  function fmt(d){var p=d.split("-");return +p[2]+" "+MES[+p[1]-1]+" "+p[0]}
  function fmtl(d){var p=d.split("-");return +p[2]+" de "+MESL[+p[1]-1]+" de "+p[0]}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  window.PA_B=function(k,o){S.b[k]=o};
  window.PA_I=function(k,o){S.i[k]=o};
  function load(kind,k){
    if(k<0)return Promise.resolve({});
    if(S[kind][k])return Promise.resolve(S[kind][k]);
    var key=kind+k;if(P[key])return P[key];
    P[key]=new Promise(function(res){
      var sc=document.createElement("script");sc.src=ROOT+"data/"+kind+k+".js";
      sc.onload=function(){res(S[kind][k]||{})};sc.onerror=function(){res({})};document.head.appendChild(sc);
    });return P[key];
  }
  function setImg(im){
    var a=BY[im.getAttribute("data-pid")];if(!a)return;
    load("i",a.k).then(function(o){var b=o[a.id];if(b)im.src="data:image/webp;base64,"+b});
  }
  var io=("IntersectionObserver" in window)?new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);setImg(e.target)}});
  },{rootMargin:"400px"}):null;
  function hydrate(root){
    Array.prototype.forEach.call((root||document).querySelectorAll("img[data-pid]:not([data-h])"),function(im){im.setAttribute("data-h","1");io?io.observe(im):setImg(im)});
  }
  function cardHtml(a){
    var h=ROOT+a.u,im;
    if(a.k<0)im='<a class="pcard-img" href="'+h+'" tabindex="-1" aria-hidden="true"><img src="'+ROOT+'img/'+a.id+'.webp" width="640" height="427" alt="" loading="lazy"></a>';
    else if(a.m)im='<a class="pcard-img" href="'+h+'" tabindex="-1" aria-hidden="true"><img data-pid="'+a.id+'" width="640" height="427" alt=""></a>';
    else im='<a class="pcard-img noimg" href="'+h+'" tabindex="-1" aria-hidden="true"><span>'+esc(a.c)+'</span></a>';
    return '<article class="pcard">'+im+'<p class="meta"><span class="cat">'+esc(a.c)+'</span><time datetime="'+a.d+'">'+fmt(a.d)+'</time></p><h3 class="t-h3"><a href="'+h+'">'+esc(a.t)+'</a></h3><p class="dek">'+esc(a.e)+'</p></article>';
  }
  hydrate();

  var more=document.querySelector("[data-more]");
  if(more){
    var slug=more.getAttribute("data-more"),list=A.filter(function(a){return a.cs.indexOf(slug)>-1}),st=document.getElementById("mais-st");
    var box=document.querySelector(".cat-list .cards");
    more.addEventListener("click",function(){
      var n=+more.getAttribute("data-shown"),nx=list.slice(n,n+24);
      var tmp=document.createElement("div");tmp.innerHTML=nx.map(cardHtml).join("");
      while(tmp.firstChild)box.appendChild(tmp.firstChild);
      n+=nx.length;more.setAttribute("data-shown",n);
      st.textContent="Mostrando "+n+" de "+list.length;
      if(n>=list.length){more.parentNode.hidden=true}
      hydrate(box);
    });
  }

  var lb=document.getElementById("ler-box");
  if(lb){
    var id=new URLSearchParams(location.search).get("id"),a=BY[id],main=document.getElementById("conteudo");
    if(!a){lb.innerHTML='<p class="vazio">Matéria não encontrada. <a href="index.html">Voltar ao início</a></p>';return}
    document.title=a.t+" | Papo Alternativo";
    var cs=ROOT+({"musica":"musica","video":"video","entrevista":"entrevistas","eventos":"eventos","cultura":"cultura","literatura":"literatura","cinema":"cinema","fotografia":"fotografia","seriados-e-tv":"seriados-e-tv","hq":"hq"}[a.s]||"index")+".html";
    var rel=A.filter(function(x){return x.id!==a.id&&x.s===a.s}).slice(0,3);
    var cur=document.querySelector('.bar a[href="'+cs+'"]');if(cur)cur.setAttribute("aria-current","page");
    main.innerHTML='<article class="art"><header class="art-head wrap"><p class="crumb"><a href="index.html">Início</a> <span aria-hidden="true">/</span> <a href="'+cs+'">'+esc(a.c)+'</a></p><p class="meta"><span class="cat">'+esc(a.c)+'</span><time datetime="'+a.d+'">'+fmtl(a.d)+'</time><span id="ler-by"></span></p><h1 class="t-art">'+esc(a.t)+'</h1></header>'+
      (a.m?'<figure class="art-fig wrap"><img id="ler-img" width="640" height="427" alt="Foto de divulgação: '+esc(a.t)+'"></figure>':'')+
      '<div class="wrap"><div class="prose"><div id="ler-body"><p>Carregando…</p></div><p class="vid" id="ler-vid" hidden></p><ul class="tags" id="ler-tags" aria-label="Assuntos" hidden></ul></div></div></article>'+
      '<section class="rel" aria-labelledby="rel-t"><div class="wrap"><div class="group-title"><h2 id="rel-t" class="t-h2s">Continue lendo</h2><a class="link" href="'+cs+'">Mais em '+esc(a.c)+'</a></div><div class="cards cards--3">'+rel.map(cardHtml).join("")+'</div></div></section>';
    hydrate(main);
    load("b",a.k).then(function(o){
      var d=o[a.id];if(!d){document.getElementById("ler-body").innerHTML="<p>Não foi possível carregar o texto.</p>";return}
      document.getElementById("ler-body").innerHTML=d.b;
      Array.prototype.forEach.call(document.querySelectorAll("#ler-body a[data-pa]"),function(l){var t=BY[l.getAttribute("data-pa")];if(t)l.href=ROOT+t.u});
      if(d.by)document.getElementById("ler-by").innerHTML="Por <b>"+esc(d.by)+"</b>";
      if(d.v){var v=document.getElementById("ler-vid");v.hidden=false;
        var lab=/spotify/.test(d.v)?"Ouvir no Spotify":(/youtu/.test(d.v)?"Assistir ao vídeo":"Abrir link");
        v.innerHTML='<a class="btn" target="_blank" rel="noopener">'+lab+'</a>';v.firstChild.href=d.v}
      if(d.tg&&d.tg.length){var t=document.getElementById("ler-tags");t.hidden=false;t.innerHTML=d.tg.map(function(x){return "<li>"+esc(x)+"</li>"}).join("")}
    });
    if(a.m)load("i",a.k).then(function(o){var b=o[a.id],im=document.getElementById("ler-img");if(b&&im)im.src="data:image/webp;base64,"+b});
    scrollTo(0,0);
  }
};
;(function(){var l=document.querySelector('.hero-logo'),h=document.querySelector('.hero');if(!l||!h)return;function f(){if(innerWidth<1024){h.style.removeProperty('--ht-w');return}h.style.setProperty('--ht-w',Math.max(60,Math.round(l.getBoundingClientRect().left-h.getBoundingClientRect().left))+'px')}f();addEventListener('resize',f);addEventListener('load',f)})();

;(function(){var need=document.querySelector("[data-pid],[data-more],#ler-box");if(!need)return;var ROOT=document.body.getAttribute("data-root")||"";var sc=document.createElement("script");sc.src=ROOT+"data/indice.js";sc.fetchPriority="low";sc.onload=function(){window.PA_RUN()};document.head.appendChild(sc)})();