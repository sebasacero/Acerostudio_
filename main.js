
  document.addEventListener("DOMContentLoaded", () => {
    // ⚠️ REEMPLAZA ESTA CADENA CON TU TOKEN REAL DE INSTAGRAM DE LARGA DURACIÓN:
    const INSTAGRAM_ACCESS_TOKEN = 'TOKEN_ELIMINADO'; 
    const MEDIA_LIMIT = 26;
    
    const feedContainer = document.getElementById('instafeed-container');
    const statusDot = document.getElementById('ig-status-dot');
    const statusTexts = document.querySelectorAll('#ig-status-text');
    const btnSync = document.getElementById('btn-sync');
    
    // Obtenemos la referencia correcta al contenedor de texto de estado
    const statusText = statusTexts[0]; 

    async function fetchInstagramPosts() {
      if (INSTAGRAM_ACCESS_TOKEN === 'COLOCA_TU_ACCESS_TOKEN_AQUI' || INSTAGRAM_ACCESS_TOKEN === '') {
        statusText.textContent = "Token no configurado";
        return;
      }

      try {
        statusText.textContent = "Conectando...";
        
        // Llamada a la Instagram Basic Display API
        const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=${MEDIA_LIMIT}&access_token=${INSTAGRAM_ACCESS_TOKEN}`);
        
        if (!response.ok) throw new Error("Error en la respuesta de la API");
        
        const data = await response.json();
        
        if(data && data.data) {
          renderInstagramFeed(data.data);
          statusDot.classList.add('connected');
          statusText.textContent = "Sincronizado";
          statusText.style.color = "#6f9d6a"; 
        } else {
          throw new Error("Estructura de datos inválida");
        }
        
      } catch (error) {
        console.error("Error al obtener el feed de Instagram:", error);
        statusText.textContent = "Error de conexión";
        statusText.style.color = "var(--magenta)";
        statusDot.classList.remove('connected');
      }
    }

    function renderInstagramFeed(posts) {
      feedContainer.innerHTML = ''; 
      
      posts.forEach(post => {
        const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
        const caption = post.caption ? post.caption.substring(0, 40) + '...' : 'Acero.press #50k';

        const postHTML = `
          <a href="${post.permalink}" target="_blank" rel="noopener noreferrer" class="img-wrap" style="text-decoration:none; display:block;">
            <img class="img-slot" src="${imageUrl}" alt="${caption}" style="border:1.5px solid var(--ink); border-radius:4px; padding:2px; background:var(--cream);">
            <span class="img-tag" style="opacity:0; transition:opacity 0.2s;"><b>Ver en IG ↗</b></span>
          </a>
        `;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = postHTML;
        const newEl = tempDiv.firstElementChild;
        
        // Manejo de eventos hover nativos para el tag flotante
        newEl.addEventListener('mouseenter', () => {
          const tag = newEl.querySelector('.img-tag');
          if(tag) tag.style.opacity = '1';
        });
        newEl.addEventListener('mouseleave', () => {
          const tag = newEl.querySelector('.img-tag');
          if(tag) tag.style.opacity = '0';
        });

        feedContainer.appendChild(newEl);
      });
    }

    btnSync.addEventListener('click', () => {
      statusDot.classList.remove('connected');
      fetchInstagramPosts();
    });

    // Carga inicial automática
    fetchInstagramPosts();
  });

var cups=parseInt(localStorage.getItem('aw-cups')||'1247');
var kg=parseInt(localStorage.getItem('aw-kg')||'87');
var farms=parseInt(localStorage.getItem('aw-farms')||'12');
var lc=0,lt;

function animC(el,t){var s=t/72,c=0,i=setInterval(function(){c+=s;if(c>=t){c=t;clearInterval(i);}el.textContent=Math.floor(c).toLocaleString('es-CO');},16);}

window.addEventListener('load',function(){
  setTimeout(function(){
    animC(document.getElementById('cnt-cups'),cups);
    animC(document.getElementById('cnt-kg'),kg);
    animC(document.getElementById('cnt-farms'),farms);
  },400);
  var temps=['14.2°C','13.8°C','14.5°C','14.1°C','13.9°C','14.3°C'];
  var extractions=['92.5°C','93.1°C','92.8°C','94.0°C','92.3°C'];
  var ti=0,ei=0;
  setInterval(function(){ti=(ti+1)%temps.length;var e=document.getElementById('live-temp');if(e)e.textContent=temps[ti];},3200);
  setInterval(function(){ei=(ei+1)%extractions.length;var e=document.getElementById('hero-temp');if(e)e.textContent=extractions[ei];},4100);

  initLiquidChrome();
});

/* ============ LIQUID CHROME ANIMATION ============ */
function initLiquidChrome(){
  var canvas=document.getElementById('liq-canvas');
  if(!canvas)return;
  var ctx=canvas.getContext('2d');
  var W,H;
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  resize();
  window.addEventListener('resize',resize);

  /* Metaball / blob system for liquid chrome effect */
  var blobs=[
    {x:0.15,y:0.2, vx:0.0006,vy:0.0004, r:0.28, hue:210},
    {x:0.7, y:0.1, vx:-0.0005,vy:0.0007, r:0.22, hue:200},
    {x:0.5, y:0.6, vx:0.0004,vy:-0.0005, r:0.32, hue:215},
    {x:0.85,y:0.7, vx:-0.0007,vy:-0.0003, r:0.2,  hue:205},
    {x:0.3, y:0.85,vx:0.0005,vy:-0.0004, r:0.24, hue:210},
    /* warm blobs — represent heat */
    {x:0.9,y:0.15, vx:-0.0004,vy:0.0006, r:0.18, hue:25},
    {x:0.6,y:0.4,  vx:0.0003,vy:0.0005,  r:0.14, hue:18},
  ];

  var t=0;
  function draw(){
    ctx.clearRect(0,0,W,H);
    t+=0.004;

    blobs.forEach(function(b){
      b.x+=b.vx;b.y+=b.vy;
      if(b.x<-0.1)b.vx=Math.abs(b.vx);
      if(b.x>1.1) b.vx=-Math.abs(b.vx);
      if(b.y<-0.1)b.vy=Math.abs(b.vy);
      if(b.y>1.1) b.vy=-Math.abs(b.vy);

      var bx=b.x*W, by=b.y*H, br=b.r*Math.min(W,H);
      var wave=Math.sin(t*0.7+b.x*3)*0.12;
      var rx=br*(1+wave), ry=br*(1-wave*0.5);

      /* Chrome blobs */
      if(b.hue>100){
        var grd=ctx.createRadialGradient(bx-rx*0.3,by-ry*0.3,rx*0.05,bx,by,rx);
        grd.addColorStop(0,'rgba(250,253,255,0.55)');
        grd.addColorStop(0.25,'rgba(220,235,250,0.35)');
        grd.addColorStop(0.55,'rgba(170,200,225,0.2)');
        grd.addColorStop(0.8,'rgba(130,170,210,0.1)');
        grd.addColorStop(1,'rgba(100,145,190,0)');
        ctx.beginPath();
        ctx.ellipse(bx,by,rx,ry,t*0.1,0,Math.PI*2);
        ctx.fillStyle=grd;
        ctx.fill();

        /* Specular highlight */
        var sg=ctx.createRadialGradient(bx-rx*0.4,by-ry*0.45,0,bx-rx*0.2,by-ry*0.2,rx*0.5);
        sg.addColorStop(0,'rgba(255,255,255,0.4)');
        sg.addColorStop(0.5,'rgba(240,248,255,0.1)');
        sg.addColorStop(1,'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.ellipse(bx-rx*0.2,by-ry*0.25,rx*0.45,ry*0.3,t*0.1,0,Math.PI*2);
        ctx.fillStyle=sg;
        ctx.fill();
      } else {
        /* Warm thermal blobs */
        var tgrd=ctx.createRadialGradient(bx,by,0,bx,by,br*(1.1+wave));
        if(b.hue>20){
          tgrd.addColorStop(0,'rgba(255,180,80,0.12)');
          tgrd.addColorStop(0.4,'rgba(255,120,40,0.07)');
          tgrd.addColorStop(1,'rgba(220,60,20,0)');
        } else {
          tgrd.addColorStop(0,'rgba(255,100,30,0.14)');
          tgrd.addColorStop(0.4,'rgba(220,50,10,0.07)');
          tgrd.addColorStop(1,'rgba(180,30,0,0)');
        }
        ctx.beginPath();
        ctx.ellipse(bx,by,br*(1+wave),br*(1-wave*0.4),t*0.08,0,Math.PI*2);
        ctx.fillStyle=tgrd;
        ctx.fill();
      }
    });

    /* Flowing chrome streaks */
    for(var i=0;i<4;i++){
      var sx=((t*0.08+i*0.27)%1.4-0.2)*W;
      var sy=((t*0.04+i*0.35)%1.2-0.1)*H;
      var sw=W*0.6, sa=0.07+Math.sin(t+i)*0.03;
      var lg=ctx.createLinearGradient(sx,sy,sx+sw,sy+60);
      lg.addColorStop(0,'rgba(220,235,250,0)');
      lg.addColorStop(0.3,'rgba(240,248,255,'+sa+')');
      lg.addColorStop(0.5,'rgba(255,255,255,'+(sa*1.4)+')');
      lg.addColorStop(0.7,'rgba(220,235,250,'+sa+')');
      lg.addColorStop(1,'rgba(220,235,250,0)');
      ctx.beginPath();
      ctx.ellipse(sx+sw*0.5,sy,sw*0.5,18,Math.sin(t*0.3+i)*0.3,0,Math.PI*2);
      ctx.fillStyle=lg;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();
}

function show(n){
  document.querySelectorAll('section').forEach(function(s){s.classList.remove('active');});
  var el=document.getElementById('s-'+n);
  if(el){el.classList.add('active');document.getElementById('aw').scrollIntoView({behavior:'smooth'});}
}

document.getElementById('logo-click').addEventListener('click',function(){
  lc++;clearTimeout(lt);lt=setTimeout(function(){lc=0;},2000);
  if(lc>=5){lc=0;openAdmin();}else{show('home');}
});

function openAdmin(){document.getElementById('adm-cups').value=cups;document.getElementById('adm-kg').value=kg;document.getElementById('adm-farms').value=farms;document.getElementById('adm-wrap').classList.add('open');}
function closeAdmin(){document.getElementById('adm-wrap').classList.remove('open');}
function addN(id,n){var e=document.getElementById(id);e.value=parseInt(e.value)+n;}
function saveCounters(){
  cups=parseInt(document.getElementById('adm-cups').value)||cups;
  kg=parseInt(document.getElementById('adm-kg').value)||kg;
  farms=parseInt(document.getElementById('adm-farms').value)||farms;
  localStorage.setItem('aw-cups',cups);localStorage.setItem('aw-kg',kg);localStorage.setItem('aw-farms',farms);
  document.getElementById('cnt-cups').textContent=cups.toLocaleString('es-CO');
  document.getElementById('cnt-kg').textContent=kg.toLocaleString('es-CO');
  document.getElementById('cnt-farms').textContent=farms.toLocaleString('es-CO');
  closeAdmin();
}
function subscribeEmail(){var e=document.getElementById('email-in');if(e&&e.value&&e.value.includes('@')){e.value='';e.placeholder='¡Listo! Te avisamos pronto';}}

