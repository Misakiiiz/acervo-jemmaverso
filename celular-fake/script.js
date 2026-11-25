const $=s=>document.querySelector(s),uid=()=>Math.random().toString(36).slice(2,9);
const defP=()=>({id:uid(),owner:"usuario",photo:"",time:"22:07",battery:75,carrier:"Vivo",net:"5G",dark:false,wallColor:"",wall:"",out:"",inn:"",font:15,chats:[],cur:null,app:null,tab:0,tweets:[],tw:{name:"usuario",user:"usuario",bio:"",loc:"",joined:"",following:0,followers:0,verified:false,photo:"",banner:"",trends:""}});
let S;try{S=JSON.parse(localStorage.getItem("fz3"))}catch(e){}
if(!S||!S.phones||!S.phones.length){S={phones:[defP()],pi:0,sel:null,mode:"pc"}}
S.sel=null;if(!S.mode)S.mode="pc";
function fixP(p){p.tab=p.tab|0;if(p.app===undefined)p.app=null;if(!p.tweets)p.tweets=[];p.tweets.forEach(t=>{if(!t.id)t.id=uid()});
if(!p.chats)p.chats=[];
if(!p.tw)p.tw={name:"usuario",user:"usuario",bio:"",loc:"",joined:"",following:0,followers:0,verified:false,photo:"",banner:"",trends:""}}
S.phones.forEach(fixP);S.tsel=null;
const P=()=>S.phones[S.pi],C=()=>P().chats.find(c=>c.id===P().cur);
const save=()=>{try{localStorage.setItem("fz3",JSON.stringify(S))}catch(e){toast("Armazenamento cheio: use Exportar para guardar")}};
const toast=m=>{const t=$("#toast");t.textContent=m;t.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.opacity=0,2600)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const col=n=>{let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))%360;return`hsl(${h},60%,42%)`};
const av=(ph,n)=>ph?`<div class="av" style="background-image:url('${ph}')"></div>`:`<div class="av" style="background:${col(n||"?")}">${esc((n||"?")[0].toUpperCase())}</div>`;
const tick=m=>m.f==="me"&&m.s?TK(m.s):"";
const TK=n=>`<svg class="tk" width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="${n==3?"#53bdeb":"#8696a0"}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6l3 3 6-7"/>${n>1?'<path d="M6 9l6-7"/>':""}</svg>`;
const I=(d,w=22)=>`<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const IC={back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',vid:'<rect x="2" y="6" width="13" height="12" rx="2.5"/><path d="M15 10.5l6-3.5v10l-6-3.5"/>',ph:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',dots:'<circle cx="12" cy="5" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="19" r="1.4" fill="currentColor"/>',srch:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/>',cam:'<path d="M3 8h4l1.5-2.5h7L17 8h4v11H3z"/><circle cx="12" cy="13.5" r="3.5"/>',mic:'<rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21"/>',smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14a4.5 4.5 0 008 0M9 9.5h.01M15 9.5h.01"/>',clip:'<path d="M20 11l-8 8a5 5 0 01-7-7l9-9a3.3 3.3 0 014.7 4.7L9.5 16.5a1.7 1.7 0 01-2.4-2.4L14 7"/>',chat:'<path d="M4 5h16v11H9l-5 4z"/>',nchat:'<path d="M4 5h16v11H9l-5 4z"/><path d="M12 8v5M9.5 10.5h5"/>'};
const SIG='<svg width="14" height="11" viewBox="0 0 14 11" fill="currentColor"><rect y="7" width="2.5" height="4" rx=".6"/><rect x="3.8" y="5" width="2.5" height="6" rx=".6"/><rect x="7.6" y="2.5" width="2.5" height="8.5" rx=".6"/><rect x="11.4" width="2.5" height="11" rx=".6"/></svg>';
const rd=(f,cb,mx=700,fail)=>{if(!f)return;const bad=()=>{toast("Não foi possível carregar a imagem");if(fail)fail()};const r=new FileReader;r.onerror=bad;r.onload=()=>{const i=new Image;i.onerror=bad;i.onload=()=>{const k=Math.min(1,mx/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=i.width*k;c.height=i.height*k;const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(i,0,0,c.width,c.height);cb(c.toDataURL("image/jpeg",.85))};i.src=r.result};r.readAsDataURL(f)};
const SYS={blk:"Você bloqueou este contato. Toque para desbloquear.",unb:"Você desbloqueou este contato.",enc:"As mensagens e as chamadas são protegidas com a criptografia de ponta a ponta. Somente as pessoas nesta conversa podem ler, ouvir ou compartilhá-las."};
const CK={in:["Chamada recebida","📞","in"],missed:["Chamada perdida","↙","in"],refused:["Chamada recusada","↙","in"],out:["Chamada realizada","↗","out"],noans:["Sem resposta","↗","out"]};
function msg(m,i,g){const s=i===S.sel?" sel":"";
if(m.t==="date")return`<div class="sy dt${s}" data-i="${i}">${esc(m.x)}</div>`;
if(m.t==="sys")return`<div class="sy${s}" data-i="${i}">${esc(m.x)}</div>`;
const sd=x=>x.t==="call"?CK[x.k][2]:(x.f==="me"?"out":"in"),side=sd(m),pv=C().msgs[i-1],ok=pv&&!["date","sys"].includes(pv.t),first=!ok||sd(pv)!==side||(g&&pv.f!==m.f);
const who=g&&side==="in"&&m.f!=="them"?`<span class="who">${esc(m.f)}</span>`:"";
const ov=(m.t==="gif"||m.t==="stk"||(m.t==="img"&&!m.x))?" ov":"";
const meta=`<span class="mt${ov}"${P().tc&&!ov?` style="color:${P().tc}"`:""}>${m.h||""}${tick(m)}</span>`;let body,cl="";
if(m.t==="call"){const c=CK[m.k],bad=m.k==="missed"||m.k==="refused";body=`<div class="call"><div class="ci" style="color:${bad?"#d93025":"#00a884"}">${I(m.v?IC.vid:IC.ph,20)}</div><div>${c[0]}${m.v?" de vídeo":" de voz"}<small>${c[1]} ${esc(m.d||"")}</small></div></div>`}
else if(m.t==="stk"){cl=" stk";body=m.e?`<div class="se">${esc(m.e)}</div>`:`<img src="${m.src}">`}
else if(m.t==="gif"){cl=" md";body=`<img src="${m.src}"><span class="gt">GIF</span>`}
else if(m.t==="img"){cl=" md";body=`<img src="${m.src}">${m.x?`<div class="cap">${esc(m.x)}</div>`:""}`}
else if(m.t==="aud")body=`<div class="aud">▶ <i class="wv"></i> ${esc(m.d)}</div>`;else body=m.t==="del"?`<i style="color:var(--sub);display:inline-flex;gap:5px;align-items:center">${I(IC.ban,14)} Esta mensagem foi apagada</i>`:esc(m.x).replace(/\n/g,"<br>");
return`<div class="b ${side}${first?" tl":""}${cl}${s}" data-i="${i}">${who}${body}${meta}${m.re?`<span class="re">${esc(m.re)}</span>`:""}</div>`}
function draw(){const p=P(),c=C(),ph=$("#ph"),sc=$("#sc");ph.className="phone a-"+(p.app||"home")+(p.dark?" dk":"");
ph.style.cssText=(p.out?`--out:${p.out};`:"")+(p.inn?`--inn:${p.inn};`:"")+`--fs:${p.font}px;`+(p.wallColor?`--wl:${p.wallColor};`:"");
const sb=`<div class="sb" data-act="sbedit"><b>${p.time}</b><span class="si">${p.net} ${SIG}<span class="bt"><i style="width:${p.battery}%"></i></span><em>${p.battery}%</em></span></div>`;
if(!p.app){sc.innerHTML=home(sb)}else if(p.app==="tw"&&!c){sc.innerHTML=twView(sb)}else if(p.app==="ms"&&!c){sc.innerHTML=msView(sb)}else if(!c){sc.innerHTML=`<div class="scr">${sb}<div class="hd">${p.sq?'<input id="sq" class="sqi" placeholder="Pesquisar…">':'<b class="ttl">WhatsApp</b>'}<span class="ic"><i class="ib" data-act="lcam">${I(IC.cam)}</i><i class="ib" data-act="lsrch">${I(IC.srch)}</i><i class="ib" data-act="ldots">${I(IC.dots)}</i></span></div><div class="chips">${[["all","Tudo"],["unr","Não lidas"],["fav","Favoritas"],["grp","Grupos"]].map(([k,n])=>`<span data-act="chip" data-k="${k}" class="${(p.chip||"all")===k?"on":""}">${n}</span>`).join("")}</div><div class="list">${p.tab?tabs(p):lsf().length?lsf().map(k=>{const l=k.msgs[k.msgs.length-1],pv=l?(l.t==="call"?CK[l.k][0]:l.t==="img"?"Foto":l.t==="stk"?"Figurinha":l.t==="gif"?"GIF":l.t==="del"?"Mensagem apagada":l.x||""):"";return`<div class="it" data-c="${k.id}">${av(k.photo,k.name)}<div class="m"><b>${esc(k.name)}</b><div class="p">${l&&l.f==="me"&&l.s?TK(l.s):""}<span style="overflow:hidden;text-overflow:ellipsis">${esc(pv)}</span>${k.muted?I(IC.mute,14):""}${k.fav?I(IC.star,14):""}</div></div><div class="r${k.unread?" u":""}">${l?l.h||"":""}${k.unread?`<br><span class="un">${k.unread}</span>`:""}</div></div>`}).join(""):`<div class="empty">Nenhuma conversa.<br>Adicione um contato no painel.</div>`}</div><div class="fab" data-act="newc">${I(IC.nchat,24)}</div><div class="nav">${["Conversas","Atualizações","Comunidades","Ligações"].map((n,i)=>`<span data-tab="${i}" class="${i==(p.tab|0)?"on":""}"><u>${I(i?'<circle cx="12" cy="12" r="8"/>':IC.chat,22)}</u>${n}</span>`).join("")}</div></div>`}
else{const g=c.t==="g";sc.innerHTML=chatView(sb,c,g);
const m=$("#ms2");if(p.wall)m.style.background=`url('${p.wall}') center/cover`;m.scrollTop=m.scrollHeight}
if(p.app&&sc.firstElementChild)sc.firstElementChild.insertAdjacentHTML("beforeend",ovl(p,c));
if(S.fq){S.fq=0;const q=$("#sq");if(q)q.focus()}
panel()}
function panel(){const p=P(),c=C();panelX(p,c);
$("#psel").innerHTML=S.phones.map((x,i)=>`<option value="${i}"${i===S.pi?" selected":""}>${esc(x.owner)} (${i+1})</option>`).join("");
document.querySelectorAll("[data-p]").forEach(e=>{if(document.activeElement===e)return;const v=p[e.dataset.p];if(e.type==="checkbox")e.checked=!!v;else e.value=v||(e.type==="color"?(e.dataset.p==="out"?"#d9fdd3":e.dataset.p==="inn"?"#ffffff":"#efe7dd"):"")});
$("#csel").innerHTML=`<option value="">— Lista de conversas —</option>`+ls().map(k=>`<option value="${k.id}"${k.id===p.cur?" selected":""}>${k.t==="g"?"Grupo · ":""}${esc(k.name)}</option>`).join("");
$("#cedit").style.display=c?"":"none";
$("#gm").innerHTML=ls().filter(k=>k.t==="c").map(k=>`<label><input type="checkbox" value="${esc(k.name)}"> ${esc(k.name)}</label>`).join("")||"<small>Adicione contatos primeiro</small>";
if(c){if(document.activeElement.id!=="ce_n")$("#ce_n").value=c.name;if(document.activeElement.id!=="ce_s")$("#ce_s").value=c.status||"";$("#ce_u").value=c.unread||0;
$("#mf").innerHTML=`<option value="me">Eu (${esc(p.owner)})</option>`+(c.t==="g"?c.members.map(n=>`<option>${esc(n)}</option>`).join(""):`<option value="them">${esc(c.name)}</option>`)}
else $("#mf").innerHTML=""}
document.querySelectorAll("[data-p]").forEach(e=>e.oninput=()=>{const k=e.dataset.p;P()[k]=e.type==="checkbox"?e.checked:(e.type==="number"||e.type==="range")?+e.value:e.value;save();draw()});
$("#psel").onchange=e=>{S.pi=+e.target.value;S.sel=null;save();draw()};
$("#pnew").onclick=()=>{S.phones.push(defP());S.phones.forEach(fixP);S.pi=S.phones.length-1;S.phones[S.pi].owner="Celular "+S.phones.length;save();draw()};
$("#pdel").onclick=()=>{if(S.phones.length<2)return toast("Mantenha ao menos um celular");S.phones.splice(S.pi,1);S.pi=0;save();draw()};
$("#pph").onchange=e=>rd(e.target.files[0],d=>{P().photo=d;save();draw()},200);
$("#wall").onchange=e=>rd(e.target.files[0],d=>{P().wall=d;save();draw()},900);
$("#wreset").onclick=()=>{Object.assign(P(),{wall:"",wallColor:"",out:"",inn:"",font:15});save();draw()};
let cph="",gph="";$("#cph").onchange=e=>rd(e.target.files[0],d=>cph=d,300);$("#gph").onchange=e=>rd(e.target.files[0],d=>gph=d,300);
$("#cadd").onclick=()=>{const n=$("#cn").value.trim();if(!P().app)return toast("Abra um app no celular primeiro");if(!n)return toast("Informe o nome");const c={id:uid(),app:P().app||"wa",t:"c",name:n,number:$("#cnum").value,photo:cph,status:"",unread:0,msgs:[]};P().chats.push(c);P().cur=c.id;cph="";$("#cn").value=$("#cnum").value=$("#cph").value="";save();draw();toast("Contato adicionado")};
$("#gadd").onclick=()=>{const n=$("#gn").value.trim();if(!P().app)return toast("Abra um app no celular primeiro");if(!n)return toast("Informe o nome do grupo");const m=[...document.querySelectorAll("#gm input:checked")].map(e=>e.value).concat($("#gx").value.split(",").map(s=>s.trim()).filter(Boolean));const c={id:uid(),app:P().app||"wa",t:"g",name:n,photo:gph,members:m,status:"",unread:0,msgs:[]};P().chats.push(c);P().cur=c.id;gph="";$("#gn").value=$("#gx").value=$("#gph").value="";save();draw();toast("Grupo criado")};
$("#csel").onchange=e=>{P().cur=e.target.value||null;{const k=C();if(k){P().app=k.app||"wa";P().tab=P().app==="tw"?3:0}}S.sel=null;save();draw()};
$("#ce_n").oninput=e=>{C().name=e.target.value;save();draw()};$("#ce_s").oninput=e=>{C().status=e.target.value;save();draw()};$("#ce_u").oninput=e=>{C().unread=+e.target.value;save();draw()};
$("#ce_p").onchange=e=>rd(e.target.files[0],d=>{C().photo=d;save();draw()},300);
$("#cclr").onclick=()=>{C().msgs=[];S.sel=null;save();draw()};
$("#cdel").onclick=()=>{const p=P();p.chats=p.chats.filter(k=>k.id!==p.cur);p.cur=null;save();draw()};
function add(m){const c=C();if(!c)return toast("Abra uma conversa primeiro");c.msgs.push(m);S.sel=null;save();draw()}
const hh=()=>$("#mt").value||P().time,from=()=>$("#mf").value||"me";
const mk=t=>{const f=from();return{t,f,h:hh(),s:f==="me"?+$("#ms").value:0}};
$("#mt").value=P().time;
$("#msend").onclick=()=>{const x=$("#mx").value;if(!x.trim())return;add({...mk("txt"),x});$("#mx").value=""};
$("#mx").onkeydown=e=>{if(e.key==="Enter")$("#msend").click()};
$("#mimg").onclick=()=>$("#mimgf").click();
$("#mimgf").onchange=e=>rd(e.target.files[0],d=>{add({...mk("img"),src:d,x:$("#mx").value});$("#mx").value="";e.target.value=""},800);
$("#cadd2").onclick=()=>{const k=$("#ck").value;add({t:"call",f:CK[k][2]==="out"?"me":"them",k,v:+$("#cv").value,d:$("#cd").value,h:hh()})};
$("#sadd").onclick=()=>{const k=$("#sk").value,v=$("#sx").value.trim(),c=C();if(!c)return toast("Abra uma conversa primeiro");
if(k==="del")return add({...mk("del")});if(k==="left"&&c.members)c.members=c.members.filter(n=>n!==v);
add({t:"sys",x:k==="custom"?(v||"…"):k==="join"?(v||"Alguém")+" entrou no grupo":k==="left"?(v||"Alguém")+" saiu do grupo":k==="rem"?"Você removeu "+(v||"alguém"):k==="add"?"Você adicionou "+(v||"alguém"):(SYS[k]||"")})};
$("#dadd").onclick=()=>add({t:"date",x:$("#dx").value||"HOJE"});
$("#ph").onclick=e=>{const b=e.target.closest("[data-i]"),it=e.target.closest("[data-c]");
if(it){P().cur=it.dataset.c;S.sel=null;save();draw()}else if(e.target.id==="bk"){P().cur=null;S.sel=null;save();draw()}
else if(b){const i=+b.dataset.i;S.sel=S.sel===i?null:i;draw();const m=C().msgs[S.sel];if(m){$("#mre").value=m.re||"";if(m.x!==undefined)$("#mx").value=m.x}}else if(S.sel!==null){S.sel=null;draw()}};
$("#medit").onclick=()=>{const c=C();if(!c||S.sel===null)return toast("Selecione uma mensagem");const m=c.msgs[S.sel];m.x=$("#mx").value;m.re=$("#mre").value;m.h=hh();if(m.f==="me")m.s=+$("#ms").value;S.sel=null;save();draw()};
$("#mdel").onclick=()=>{const c=C();if(!c||S.sel===null)return toast("Selecione uma mensagem");c.msgs.splice(S.sel,1);S.sel=null;save();draw()};
const raw=(f,cb)=>{if(!f)return;const r=new FileReader;r.onload=()=>cb(r.result);r.readAsDataURL(f)};
$("#mstk").onclick=()=>$("#mstkf").click();$("#mgif").onclick=()=>$("#mgiff").click();
$("#mgiff").onchange=e=>{const f=e.target.files[0];e.target.value="";raw(f,d=>add({...mk("gif"),src:d}))};
$("#mstkf").onchange=e=>{const f=e.target.files[0];e.target.value="";if(!f)return;if(/gif|webp/.test(f.type))return raw(f,d=>add({...mk("stk"),src:d}));
raw(f,u=>{const i=new Image;i.onload=()=>{const k=Math.min(1,512/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=i.width*k;c.height=i.height*k;c.getContext("2d").drawImage(i,0,0,c.width,c.height);add({...mk("stk"),src:c.toDataURL("image/png")})};i.src=u})};
$("#memo").onclick=()=>{const x=$("#mx").value.trim();if(!x)return toast("Digite um emoji no campo de texto");add({...mk("stk"),e:x});$("#mx").value=""};
function quant(c){const w=c.width,h=c.height,d=c.getContext("2d").getImageData(0,0,w,h).data,n=w*h,k=new Uint16Array(n),H=new Uint32Array(32768);
for(let i=0;i<n;i++){const j=i*4,q=(d[j]>>3<<10)|(d[j+1]>>3<<5)|(d[j+2]>>3);k[i]=q;H[q]++}
const used=[...H.keys()].filter(i=>H[i]),top=used.slice().sort((a,b)=>H[b]-H[a]).slice(0,255),pal=top.map(q=>[(q>>10<<3)|4,((q>>5&31)<<3)|4,((q&31)<<3)|4]);while(pal.length<256)pal.push([0,0,0]);
const map=new Uint8Array(32768);for(const q of used){const r=(q>>10)<<3,g=(q>>5&31)<<3,b=(q&31)<<3;let bi=0,bd=1e9;for(let p=0;p<top.length;p++){const e=pal[p],t=(e[0]-r)**2+(e[1]-g)**2+(e[2]-b)**2;if(t<bd){bd=t;bi=p}}map[q]=bi}
const px=new Uint8Array(n);for(let i=0;i<n;i++)px[i]=map[k[i]];return{px,pal:pal.map(e=>e[0]<<16|e[1]<<8|e[2])}}
function gif(cs,delay){const w=cs[0].width,h=cs[0].height,buf=new Uint8Array(Math.ceil(w*h*cs.length*1.3)+8192),gw=new exports.GifWriter(buf,w,h,{loop:0});
for(const c of cs){const q=quant(c);gw.addFrame(0,0,w,h,q.px,{palette:q.pal,delay:delay})}return new Blob([buf.subarray(0,gw.end())],{type:"image/gif"})}
const flat=cv=>{const o=document.createElement("canvas");o.width=cv.width;o.height=cv.height;const x=o.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,o.width,o.height);x.drawImage(cv,0,0);return o};
async function frames(src){const m=src.match(/^data:([^;]+);base64,(.*)$/),bin=atob(m[2]),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
const fr=[],cum=[];let tot=0;const push=(c,d)=>{fr.push(c);tot+=Math.max(20,d);cum.push(tot)};
if(m[1]==="image/gif"){const r=new exports.GifReader(u),w=r.width,h=r.height,px=new Uint8ClampedArray(w*h*4);let prev=null;
for(let i=0;i<r.numFrames();i++){const fi=r.frameInfo(i);if(prev&&prev.disposal===2)for(let y=prev.y;y<prev.y+prev.height;y++)px.fill(0,(y*w+prev.x)*4,(y*w+prev.x+prev.width)*4);
r.decodeAndBlitFrameRGBA(i,px);const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").putImageData(new ImageData(px.slice(),w,h),0,0);push(c,fi.delay*10);prev=fi}}
else if(window.ImageDecoder){const d=new ImageDecoder({data:u,type:m[1]});await d.tracks.ready;const n=d.tracks.selectedTrack.frameCount;for(let i=0;i<n;i++){const{image}=await d.decode({frameIndex:i}),c=document.createElement("canvas");c.width=image.displayWidth;c.height=image.displayHeight;c.getContext("2d").drawImage(image,0,0);push(c,(image.duration||100000)/1000);image.close()}}
return{fr,cum,dur:tot}}
async function anim(){const ph=$("#sc"),items=[];
for(const im of ph.querySelectorAll("img")){if(!/^data:image\/(gif|webp)/.test(im.src))continue;try{const f=await frames(im.src);if(f.fr.length>1)items.push({im,f,o:im.src})}catch(e){}}
if(!items.length)return null;
const dur=Math.max(...items.map(x=>x.f.dur)),step=Math.max(80,Math.ceil(dur/400)*10),n=Math.min(40,Math.ceil(dur/step)),out=[];
try{for(let k=0;k<n;k++){for(const it of items){const tt=(k*step)%it.f.dur;let i=it.f.cum.findIndex(c=>c>tt);if(i<0)i=0;it.im.src=it.f.fr[i].toDataURL("image/png");await it.im.decode()}
out.push(flat(await html2canvas(ph,{backgroundColor:null,scale:1.5,useCORS:true,ignoreElements:e=>e.classList&&e.classList.contains("eui")})))}}finally{items.forEach(it=>it.im.src=it.o)}
return gif(out,Math.round(step/10))}
async function grab(f){S.sel=null;draw();if(f==="gif"&&!(CROP&&P().app==="tw"&&!C())){const a=await anim();if(a)return a}
const tgt=cropTarget(),cv=await html2canvas(tgt,{backgroundColor:null,scale:2,useCORS:true,ignoreElements:e=>e.classList&&e.classList.contains("eui")});if(tgt.id==="cropbox")tgt.remove();applyCs();if(!f||f==="png")return new Promise(r=>cv.toBlob(r,"image/png"));
const o=flat(cv);return f==="gif"?gif([o],0):new Promise(r=>o.toBlob(r,"image/jpeg",.95))}
function dl(b,n="print-chat.png"){const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=n;a.click()}
$("#shot").onclick=async()=>{try{const b=await grab("png");try{await navigator.clipboard.write([new ClipboardItem({"image/png":b})]);toast("Print copiado para a área de transferência!")}catch(e){dl(b);toast("Navegador bloqueou a área de transferência: baixei o PNG")}}catch(e){toast(e.message==="Selecione um post do X para recortar"?e.message:"Não foi possível gerar o print")}};
$("#dl").onclick=async()=>{const f=$("#fmt").value;if(f==="gif")toast("Gerando GIF… pode levar alguns segundos");try{dl(await grab(f),"print-chat."+f)}catch(e){toast(e.message==="Selecione um post do X para recortar"?e.message:"Erro ao gerar imagem")}};
$("#exp").onclick=()=>dl(new Blob([JSON.stringify(S)],{type:"application/json"}),"chat-fake.json");
$("#imp").onclick=()=>$("#impf").click();
$("#impf").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader;r.onload=()=>{try{const d=JSON.parse(r.result);if(!d.phones)throw 0;S=d;S.sel=null;save();draw();toast("Importado!")}catch(x){toast("Arquivo inválido")}};r.readAsText(f)};
const ls=()=>P().chats.filter(k=>(k.app||"wa")===P().app);
const unread=k=>P().chats.filter(c=>(c.app||"wa")===k).reduce((a,c)=>a+(c.unread||0),0);
const APPS=[["wa","WhatsApp","#25d366",'<path d="M12 3a9 9 0 00-7.7 13.6L3 21l4.5-1.2A9 9 0 1012 3z" fill="none" stroke="#fff" stroke-width="2"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z" fill="#fff"/>'],["tw","X","#000",'<path d="M5 4l14 16M19 4L5 20" stroke="#fff" stroke-width="2.6" fill="none"/>'],["ms","Messenger","linear-gradient(135deg,#00b2ff,#a033ff 60%,#ff5280)",'<path d="M12 3C7 3 3.5 6.6 3.5 11.2c0 2.5 1.2 4.6 3 6V21l3.2-1.8c.7.2 1.5.3 2.3.3 5 0 8.5-3.6 8.5-8.3S17 3 12 3z" fill="#fff"/><path d="M6.8 14l3.4-3.6 2.4 2 3.2-2.4-3.5 3.7-2.3-2z" fill="#a033ff"/>']];
const TW=["Início","Busca","Notificações","Mensagens"];
function home(sb){const p=P(),ic=([k,n,bg,s])=>`<div class="ap" data-app="${k}"><div class="ai" style="background:${bg}"><svg viewBox="0 0 24 24" width="34" height="34">${s}</svg>${unread(k)?`<i class="bd">${unread(k)}</i>`:""}</div><span>${n}</span></div>`,
fk=(n,i)=>`<div class="ap" data-app="x"><div class="ai" style="background:hsl(${i*47+200},45%,40%)">${I('<circle cx="12" cy="12" r="6"/>',26)}</div><span>${n}</span></div>`;
return`<div class="scr home">${sb}<div class="clk"><b>${p.time}</b><small>${new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</small></div><div class="grid">${APPS.map(ic).join("")}${["Câmera","Galeria","Mapas","Música","Loja"].map(fk).join("")}</div><div class="dock">${["Telefone","Mensagens","Chrome","Câmera"].map((n,i)=>fk(n,i+3)).join("")}</div></div>`}
function tabs(p){const t=p.tab,L=ls(),row=(n,ph,s,r,att)=>`<div class="it" ${att||""}>${av(ph,n)}<div class="m"><b>${esc(n)}</b><div class="p">${esc(s)}</div></div><div class="r">${esc(r||"")}</div></div>`;let h=[];
if(t==1){h.push(`<div class="it" data-act="myst"><div class="av plus2">+</div><div class="m"><b>Meu status</b><div class="p">${(p.sts||[]).length?"Toque para ver · "+p.sts.length:"Toque para adicionar"}</div></div></div>`);L.filter(k=>k.t==="c"&&!k.blocked&&(k.sts||[]).length).forEach(k=>h.push(row(k.name,k.photo,k.sts[k.sts.length-1].h||"Hoje","",`data-act="cst" data-id="${k.id}"`)))}
else if(t==2)h=L.filter(k=>k.t==="g").map(k=>row(k.name,k.photo,(k.members||[]).length+" membros","",`data-c="${k.id}"`));
else L.forEach(k=>k.msgs.filter(m=>m.t==="call").forEach(m=>h.push(row(k.name,k.photo,CK[m.k][1]+" "+CK[m.k][0],m.h,`data-act="callb" data-id="${k.id}" data-v="${m.v||0}"`))));
return h.join("")||'<div class="empty">Nada por aqui ainda.</div>'}
function msView(sb){const p=P(),t=p.tab|0,L=ls().filter(k=>!t||k.t==="c"),row=k=>{const l=k.msgs[k.msgs.length-1],u=k.unread;return`<div class="it" data-c="${k.id}">${av(k.photo,k.name)}<div class="m"><b style="font-weight:${u?700:500}">${esc(k.name)}</b><div class="p">${esc(l?(l.f==="me"?"Você: ":"")+(l.x||(l.t==="img"?"Foto":"…"))+" · "+(l.h||""):"Sem mensagens")}</div></div>${u?'<i class="dot"></i>':""}</div>`};
return`<div class="scr">${sb}<div class="hd"><b class="ttl">${t?"Pessoas":"Chats"}</b><span class="ic">${I(IC.cam)}<i class="ib" data-act="newc">${I(IC.nchat)}</i></span></div><div class="srch">${I(IC.srch,18)} Pesquisar</div>${t?"":`<div class="stor"><div><div class="av plus">+</div>Seu story</div>${L.slice(0,6).map(k=>`<div>${av(k.photo,k.name)}${esc(k.name.split(" ")[0])}</div>`).join("")}</div>`}<div class="list">${L.length?L.map(row).join(""):'<div class="empty">Sem conversas no Messenger.</div>'}</div><div class="nav">${["Chats","Pessoas"].map((n,i)=>`<span data-tab="${i}" class="${i==t?"on":""}">${I(i?'<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6"/>':IC.chat,24)}${n}</span>`).join("")}</div></div>`}
const VER='<svg class="vf" viewBox="0 0 24 24" width="15" height="15"><circle cx="12" cy="12" r="10" fill="#1d9bf0"/><path d="M7 12.5l3.2 3L17 9" stroke="#fff" stroke-width="2" fill="none"/></svg>';
const nf=n=>n>=1e6?(n/1e6).toFixed(1).replace(".",",")+" mi":n>=1e4?Math.round(n/1e3)+" mil":n>=1e3?(n/1e3).toFixed(1).replace(".",",")+" mil":n;
const TT=()=>P().tweets;
const who=t=>{const w=P().tw;return t.me?{n:w.name,u:w.user,ph:w.photo,v:w.verified}:{n:t.n||"?",u:t.u||"?",ph:t.photo,v:t.vf}};
function tcard(t){const a=who(t),par=t.rp&&TT().find(x=>x.id===t.rp);
return`<div class="tw${S.tsel===t.id?" sel":""}" data-tw="${t.id}">${t.rt?`<div class="rtl">🔁 ${esc(t.rt)} repostou</div>`:""}<div class="twr">${av(a.ph,a.n)}<div class="tb"><div><b>${esc(a.n)}</b>${a.v?VER:""} <small>@${esc(a.u)} · ${esc(t.h||"")}</small></div>${par?`<small>Respondendo a @${esc(who(par).u)}</small>`:""}<p>${esc(t.x||"").replace(/\n/g,"<br>")}</p>${t.img?`<img src="${t.img}">`:""}<div class="ta"><span data-ta="reply">💬 ${nf(t.c||0)}</span><span data-ta="rt" class="${t.rd?"rt":""}">🔁 ${nf(t.r||0)}</span><span data-ta="like" class="${t.lk?"on":""}">${t.lk?"♥":"♡"} ${nf(t.l||0)}</span><span>📊 ${nf(t.v||0)}</span></div></div></div></div>`}
function twView(sb){const p=P(),t=p.tab|0,w=p.tw,tw=TT(),em='<div class="empty">Nada por aqui. Publique pelo painel.</div>';let top,body,fab="";
const bar=(ttl,back)=>`<div class="hd">${back?`<span data-tv="" style="cursor:pointer;display:flex">${I(IC.back)}</span>`:`<span data-tv="prof" style="cursor:pointer;display:flex">${av(w.photo,w.name)}</span>`}<b class="ttl" style="text-align:${back?"left":"center"};font-size:18px">${ttl}</b>${!back&&t===3?`<span class="ib" data-act="twnewdm" title="Nova mensagem">${I(IC.pen,22)}</span>`:'<span style="width:30px"></span>'}</div>`;
if(p.tv==="prof"){top=bar(esc(w.name),1);body=`<div class="bn" style="${w.banner?`background-image:url('${w.banner}')`:"background:linear-gradient(120deg,#1d9bf0,#7856ff)"}"></div><div class="pr"><span class="eb" data-ta="edit">Editar perfil</span>${av(w.photo,w.name)}<div><b>${esc(w.name)}</b>${w.verified?VER:""}</div><small>@${esc(w.user)}</small><p>${esc(w.bio).replace(/\n/g,"<br>")}</p><small class="meta">${I(IC.pin,15)} ${esc(w.loc)} &nbsp; ${I(IC.cal,15)} ${esc(w.joined)}</small><p><b>${nf(w.following)}</b> <small>Seguindo</small> &nbsp; <b>${nf(w.followers)}</b> <small>Seguidores</small></p></div><div class="pt"><span class="on">Posts</span><span>Respostas</span><span>Mídia</span></div>${tw.filter(x=>x.me).map(tcard).join("")}`}
else if(p.tv==="th"){const m=tw.find(x=>x.id===p.to);top=bar("Post",1);body=m?tcard(m)+'<div class="tr"><small>Respostas</small></div>'+tw.filter(x=>x.rp===m.id).map(tcard).join("")+'<div class="tr" data-ta="reply" style="color:var(--sub);cursor:pointer">Postar sua resposta</div>':'<div class="empty">Post removido.</div>'}
else{top=bar(TW[t]);
if(t==0){body=tw.filter(x=>!x.rp).map(tcard).join("")||em;fab='<div class="tfab" data-ta="new">+</div>'}
else if(t==1){const trends=(w.trends||"").split("\n").filter(Boolean).map((n,i)=>`<div class="tr"><small>${i+1} · Assunto do momento</small><b>#${esc(n)}</b><small>${nf((i+3)*12400)} posts</small></div>`).join("");body=`<div class="srch">${I(IC.srch,18)} Buscar</div>${trends||'<div class="empty">Nenhum assunto por aqui.</div>'}`}
else if(t==2)body=tw.filter(x=>x.me&&x.l).map(x=>`<div class="tw"><div class="twr"><span style="color:#f91880;font-size:20px">♥</span><div class="tb"><b>${nf(x.l)} pessoas</b> curtiram seu post<p style="color:var(--sub)">${esc(x.x||"")}</p></div></div></div>`).join("")||'<div class="empty">Sem notificações.</div>';
else body=ls().map(k=>{const l=k.msgs[k.msgs.length-1];return`<div class="it" data-c="${k.id}">${av(k.photo,k.name)}<div class="m"><b>${esc(k.name)}</b><div class="p">${esc(l?l.x||"…":"")}</div></div><div class="r">${l?l.h||"":""}</div></div>`}).join("")||'<div class="empty">Sem mensagens. Adicione um contato no painel.</div>'}
const nv=["<path d='M4 11l8-7 8 7v9H4z'/>",IC.srch,"<path d='M6 17V11a6 6 0 0112 0v6l2 2H4z'/>","<rect x='3' y='5' width='18' height='14' rx='2'/><path d='M3 7l9 6 9-6'/>"];
return`<div class="scr">${sb}${top}<div class="list">${body}</div>${fab}<div class="nav">${nv.map((d,i)=>`<span data-tab="${i}" class="${i==t&&!p.tv?"on":""}">${I(d,24)}</span>`).join("")}</div></div>`}
function twAct(a,k){const p=P(),el=a.closest("[data-tw]"),t=TT().find(x=>x.id===(el?el.dataset.tw:p.to));
if(k==="edit")return toast("Edite o perfil no painel à esquerda");
if(k==="new"){askText({title:"Novo post",sub:"O que está acontecendo?",placeholder:"Escreva o post…",ok:"Postar",max:280,image:true}).then(v=>{if(v===null)return;if(v.text||v.image)TT().unshift({id:uid(),me:1,x:v.text,h:"agora",c:0,r:0,l:0,v:0,img:v.image});save();draw()});return}
else if(!t)return;
else if(k==="like"){t.lk=!t.lk;t.l=Math.max(0,(t.l||0)+(t.lk?1:-1))}
else if(k==="rt"){sheet("",[[I(IC.rt,18)+" "+(t.rd?"Desfazer repost":"Repostar"),()=>{t.rd=!t.rd;t.r=Math.max(0,(t.r||0)+(t.rd?1:-1));save();draw()}],[I(IC.pen,18)+" Citar",()=>quoteOf(t)]]);return}
else if(k==="reply"){if(p.tv==="th"&&p.to===t.id){askText({title:"Responder",sub:"Respondendo a @"+who(t).u,placeholder:"Poste sua resposta",ok:"Responder",max:280}).then(x=>{if(x){TT().unshift({id:uid(),me:1,rp:t.id,x,h:"agora",c:0,r:0,l:0,v:0});t.c=(t.c||0)+1;save();draw()}});return}else{p.tv="th";p.to=t.id}}
save();draw()}
$("#ph").addEventListener("click",e=>{const a=e.target.closest("[data-act],[data-app],[data-tab],[data-nav],[data-send],[data-ta],[data-tw],[data-tv]"),p=P();if(!a){if(p.menu||p.emo){p.menu=null;p.emo=0;draw()}return}const d=a.dataset;if(d.act===undefined)p.menu=p.emo=null;
if(d.act!==undefined)return act(d.act,d);
if(d.app){if(d.app==="x")return toast("Este ícone é só decorativo");p.app=d.app;p.tab=0;p.cur=null;p.tv=null}
else if(d.send!==undefined){const v=$("#pin").value.trim(),c=C();if(!c)return;if(c.left)return toast("Você saiu deste grupo");if(!v){c.msgs.push({t:"aud",f:"me",d:"0:"+String(3+Math.floor(Math.random()*40)).padStart(2,"0"),h:p.time,s:1});S.sel=null;save();return draw()}c.msgs.push({t:"txt",f:"me",x:v,h:p.time,s:1});S.sel=null;save();return draw()}
else if(d.ta!==undefined)return twAct(a,d.ta);
else if(d.tw!==undefined){S.tsel=S.tsel===d.tw?null:d.tw;draw();return loadT()}
else if(d.tv!==undefined){p.tv=d.tv||null;if(d.tv==="th")p.to=d.id}
else if(d.tab!==undefined){p.tab=+d.tab;p.cur=null;p.tv=null}
else if(d.nav==="home"){p.app=null;p.cur=null;p.tv=null}
else if(d.nav==="back"){if(p.sv||p.info||p.menu||p.emo){p.sv=null;p.info=0;p.menu=null;p.emo=0}else if(p.cur)p.cur=null;else if(p.tv)p.tv=null;else if(p.tab)p.tab=0;else p.app=null}
else{const k=["wa","tw","ms"];p.app=k[(k.indexOf(p.app)+1)%3];p.tab=0;p.cur=null;p.tv=null}
S.sel=null;save();draw()});
$("#ph").addEventListener("keydown",e=>{if(e.target.id==="pin"&&e.key==="Enter")$(".mic").click()});
function panelX(p,c){stRefresh();if(c&&document.activeElement.id!=="ce_sc")$("#ce_sc").value=c.sc||"#ffffff";$("#tcol").value=p.tc||"#667781";const ap=p.app||"home";document.querySelectorAll("[data-for]").forEach(e=>e.hidden=!e.dataset.for.split(",").includes(ap)||(e.dataset.need==="chat"&&!c));
if(!p.tw)return;document.querySelectorAll("[data-t]").forEach(e=>{if(document.activeElement===e)return;const v=p.tw[e.dataset.t];if(e.type==="checkbox")e.checked=!!v;else e.value=v==null?"":v});
const sp=$("#tp");if(document.activeElement!==sp){const cur=sp.value;sp.innerHTML='<option value="">Post normal</option>'+p.tweets.map(t=>`<option value="${t.id}">Resposta a @${esc(who(t).u)}: ${esc((t.x||"").slice(0,25))}</option>`).join("");sp.value=cur}
$("#thint").textContent=S.tsel?"Editando o post selecionado (toque nele de novo para desmarcar).":"Toque num post no celular para editá-lo."}
document.querySelectorAll("[data-t]").forEach(e=>e.oninput=()=>{const k=e.dataset.t;P().tw[k]=e.type==="checkbox"?e.checked:e.type==="number"?+e.value:e.value;save();draw()});
let tpend="",tapend="",tqphend="",tqimgend="";
function kindSync(){const k=$("#tkind").value;$("#tkrt").hidden=k!=="rt";$("#tkq").hidden=k!=="quote"}
$("#tkind").onchange=kindSync;$("#tqph").onchange=e=>rd(e.target.files[0],d=>tqphend=d,200);$("#tqimg").onchange=e=>rd(e.target.files[0],d=>tqimgend=d,700);
$("#tph").onchange=e=>rd(e.target.files[0],d=>{P().tw.photo=d;save();draw()},200);
$("#tbn").onchange=e=>rd(e.target.files[0],d=>{P().tw.banner=d;save();draw()},900);
$("#timgf").onchange=e=>{tpend="";if(e.target.files[0])rd(e.target.files[0],d=>tpend=d,700)};
$("#tap").onchange=e=>rd(e.target.files[0],d=>tapend=d,200);
const readTweetImage=()=>{const f=$("#timgf").files[0];if(!f||tpend)return Promise.resolve(tpend);return new Promise(resolve=>rd(f,resolve,700,()=>resolve("")))};
function tobj(){const n=$("#tn").value.trim(),u=$("#tu").value.trim().replace(/^@/,""),rp=$("#tp").value,o={x:$("#tt").value,h:$("#th").value||"agora",l:+$("#tl").value||0,r:+$("#tr").value||0,c:+$("#tc").value||0,v:+$("#tv2").value||0,rp:rp||undefined,rt:$("#tkind").value==="rt"?($("#trt").value.trim()||undefined):undefined,q:undefined};
if($("#tkind").value==="quote"){const old=(arguments[0]&&TT().find(x=>x.id===S.tsel)||{}).q||{};o.q={n:$("#tqn").value.trim()||"Usuário",u:($("#tqu").value.trim().replace(/^@/,"")||"usuario"),v:$("#tqv").checked,x:$("#tqt").value,h:$("#tqh").value.trim(),ph:tqphend||old.ph,img:tqimgend||old.img}}
if(n||u){o.me=0;o.n=n||u;o.u=u||n.toLowerCase().replace(/\s+/g,"");o.vf=$("#tvf").checked;if(tapend)o.photo=tapend}else{o.me=1;o.n=o.u=undefined}return o}
function loadT(){const t=TT().find(x=>x.id===S.tsel);if(!t)return;tpend=tapend="";$("#tn").value=t.me?"":t.n||"";$("#tu").value=t.me?"":t.u||"";$("#tvf").checked=!!t.vf;$("#tt").value=t.x||"";$("#th").value=t.h||"";$("#tl").value=t.l||0;$("#tr").value=t.r||0;$("#tc").value=t.c||0;$("#tv2").value=t.v||0;$("#tp").value=t.rp||"";$("#trt").value=t.rt||"";$("#tkind").value=t.q?"quote":t.rt?"rt":"";tqphend=tqimgend="";const q=t.q||{};$("#tqn").value=q.n||"";$("#tqu").value=q.u||"";$("#tqv").checked=!!q.v;$("#tqt").value=q.x||"";$("#tqh").value=q.h||"";kindSync()}
$("#tadd").onclick=async()=>{const img=await readTweetImage(),o=tobj();if(!o.x.trim()&&!img)return toast("Escreva o texto ou selecione uma imagem");TT().unshift({id:uid(),...o,img});if(o.rp){const q=TT().find(x=>x.id===o.rp);if(q)q.c=(q.c||0)+1}tpend=tapend=tqphend=tqimgend="";$("#tt").value=$("#timgf").value=$("#tap").value=$("#tqph").value=$("#tqimg").value="";S.tsel=null;save();draw();toast("Post publicado")};
$("#tsave").onclick=async()=>{const t=TT().find(x=>x.id===S.tsel);if(!t)return toast("Toque num post no celular");const img=await readTweetImage();Object.assign(t,tobj(1));if(img)t.img=img;tpend=tapend="";$("#timgf").value="";save();draw();toast("Post atualizado")};
$("#tdel").onclick=()=>{const p=P();if(!S.tsel)return toast("Toque num post no celular");p.tweets=p.tweets.filter(x=>x.id!==S.tsel&&x.rp!==S.tsel);S.tsel=null;save();draw()};
$("#homeb").onclick=()=>{P().app=null;P().cur=null;save();draw()};

const lsf=()=>{const p=P();return ls().filter(k=>p.chip==="unr"?k.unread:p.chip==="fav"?k.fav:p.chip==="grp"?k.t==="g":1)};
const fmt=s=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
const csec=c=>Math.floor((Date.now()-c.t0)/1000);
setInterval(()=>{const p=P();if(!p||!p.call)return;const e=$("#ctm"),s=csec(p.call);if(e)e.textContent=s<3?"Chamando…":fmt(s-3)},500);
function endCall(){const p=P(),cl=p.call,k=p.chats.find(x=>x.id===cl.id),s=csec(cl);p.call=null;if(k)k.msgs.push({t:"call",f:"me",k:s<3?"noans":"out",v:cl.v,d:s<3?"":fmt(s-3),h:hh()});save();draw()}
function addSt(){askText({title:"Novo status",sub:"Escreva um texto ou escolha uma foto",placeholder:"Digite o status…",ok:"Publicar",max:200,allowEmpty:true,alt:"Escolher foto"}).then(x=>{if(x===null)return;if(x){(P().sts=P().sts||[]).push({x});save();draw()}else $("#stf").click()})}
function ovl(p,c){let h="";const g=c&&c.t==="g",mn=a=>`<div class="mn">${a.map(([k,n])=>`<div data-act="${k}">${n}</div>`).join("")}</div>`;
if(p.menu==="chat"&&c)h+=mn([["m_info",g?"Dados do grupo":"Dados do contato"],["m_mute",c.muted?"Reativar som":"Silenciar"],["m_fav",c.fav?"Remover dos favoritos":"Favoritar"],...(g?[]:[["m_block",c.blocked?"Desbloquear":"Bloquear"]]),["m_clear","Limpar conversa"],["m_del","Apagar conversa"],...(g&&!c.left?[["m_leave","Sair do grupo"]]:[])]);
if(p.menu==="list")h+=mn([["lnew","Novo grupo"],["lread","Marcar todas como lidas"],["ldark",p.dark?"Modo claro":"Modo escuro"]]);
if(p.emo&&c)h+=`<div class="emt">${["😀","😂","😍","🥰","😎","😢","😡","👍","🙏","🔥","❤️","🎉","😮","🤔","👏","💯"].map(e=>`<span data-act="emj" data-e="${e}">${e}</span>`).join("")}</div>`;
if(p.info&&c)h+=`<div class="ovl info"><div class="hd"><span data-act="close" class="ib">${I(IC.back)}</span><b class="ttl" style="font-size:18px">${g?"Dados do grupo":"Dados do contato"}</b></div><div class="ib2">${av(c.photo,c.name)}<h3>${esc(c.name)}</h3><small>${esc(g?"Grupo · "+((c.members||[]).length+1)+" participantes":c.status||"")}</small></div><div class="ia"><span data-act="vid">${I(IC.vid,22)}<br>Vídeo</span><span data-act="call">${I(IC.ph,20)}<br>Áudio</span><span data-act="m_mute">${I(c.muted?IC.bell:IC.mute,22)}<br>${c.muted?"Som":"Mudo"}</span></div><div class="list">${g?["Você",...(c.members||[])].map(n=>`<div class="it">${av("",n)}<div class="m"><b>${esc(n)}</b></div></div>`).join(""):""}</div>${g?(c.left?"":'<div class="it dg" data-act="m_leave"><b>Sair do grupo</b></div>'):`<div class="it dg" data-act="m_block"><b>${c.blocked?"Desbloquear":"Bloquear"} ${esc(c.name)}</b></div>`}</div>`;
if(p.sv){const s=p.sv,items=getSts(s.who),k=s.who!=="me"&&p.chats.find(x=>x.id===s.who),it=items[s.i];
h+=`<div class="ovl sv" data-act="svn"><div class="pg">${items.map((_,j)=>`<i class="${j<=s.i?"f":""}"></i>`).join("")}</div><div class="svh"><span>${s.who==="me"?"Meu status":esc(k?k.name:"")}<small style="display:block;font-weight:400;opacity:.8">${esc(it&&it.h||"Hoje")}</small></span><span data-act="close">✕</span></div>${it&&it.src?`<img src="${it.src}">`:`<div class="svt" style="${it&&it.c?`background:${it.c}`:""}">${esc(it?it.x:"")}</div>`}${s.who==="me"?'<div class="svp" data-act="myadd">＋ Adicionar status</div>':""}</div>`}
if(p.call){const k=p.chats.find(x=>x.id===p.call.id);if(k)h+=`<div class="ovl cl"><small>${p.call.v?"Chamada de vídeo":"Chamada de voz"}</small><b class="cn">${esc(k.name)}</b><div id="ctm" class="ct">Chamando…</div><div class="cav">${av(k.photo,k.name)}</div><div class="cb"><span data-act="cmute" class="${p.cm?"on":""}">${I(p.cm?IC.mute:IC.mic,22)}</span><span>${I(IC.spk,22)}</span>${p.call.v?`<span>${I(IC.cam,22)}</span>`:""}<span class="end" data-act="end">${I(IC.ph,22)}</span></div></div>`}
return h}
function act(k,d){const p=P(),c=C(),was=p.menu;if(k==="emj"){const i=$("#pin");if(i)i.value+=d.e;return}
if(k!=="dots"&&k!=="ldots")p.menu=null;const pv=$("#pin")?$("#pin").value:null;
switch(k){
case"back":p.cur=null;p.info=0;p.emo=0;break;
case"close":p.info=0;p.sv=null;break;
case"dots":p.menu=was?null:"chat";break;
case"ldots":p.menu=was?null:"list";break;
case"vid":case"call":if(!c)return;if(c.blocked)return toast("Desbloqueie o contato para ligar");p.call={id:c.id,v:k==="vid"?1:0,t0:Date.now()};break;
case"callb":p.call={id:d.id,v:+d.v,t0:Date.now()};break;
case"end":return endCall();
case"cmute":p.cm=!p.cm;break;
case"emo":p.emo=p.emo?0:1;break;
case"attach":$("#af").click();return;
case"m_info":p.info=1;break;
case"m_mute":c.muted=!c.muted;toast(c.muted?"Conversa silenciada":"Som reativado");break;
case"m_fav":c.fav=!c.fav;break;
case"m_block":c.blocked=!c.blocked;c.msgs.push({t:"sys",x:c.blocked?SYS.blk:SYS.unb});break;
case"m_clear":c.msgs=[];break;
case"m_del":p.chats=p.chats.filter(x=>x.id!==c.id);p.cur=null;p.info=0;break;
case"m_leave":c.left=1;p.info=0;c.msgs.push({t:"sys",x:"Você saiu do grupo"});break;
case"lcam":case"myadd":p.sv=null;addSt();return;
case"lsrch":p.sq=!p.sq;S.fq=p.sq;break;
case"chip":p.chip=d.k;break;
case"lnew":askText({title:"Novo grupo",sub:"Dê um nome ao grupo",placeholder:"Nome do grupo",ok:"Criar",max:40,rows:1}).then(n=>{if(n){p.chats.push({id:uid(),app:"wa",t:"g",name:n,photo:"",status:"",unread:0,members:ls().filter(x=>x.t==="c").slice(0,3).map(x=>x.name),msgs:[]});save();draw()}});return
case"lread":ls().forEach(x=>x.unread=0);toast("Tudo marcado como lido");break;
case"ldark":p.dark=!p.dark;break;
case"newc":askText({title:"Novo contato",sub:"Como ele(a) se chama?",placeholder:"Nome do contato",ok:"Adicionar",max:40,rows:1}).then(n=>{if(n){p.chats.push({id:uid(),app:p.app,t:"c",name:n,photo:"",status:"",unread:0,msgs:[]});save();draw()}});return
case"twnewdm":askText({title:"Nova mensagem no X",sub:"Nome do contato",placeholder:"Nome do contato",ok:"Abrir conversa",max:40,rows:1}).then(n=>{if(n){const dm={id:uid(),app:"tw",t:"c",name:n,photo:"",status:"",unread:0,msgs:[]};p.chats.push(dm);p.cur=dm.id;save();draw()}});return
case"myst":if(getSts("me").length)p.sv={who:"me",i:0};else{addSt();return}break;
case"cst":p.sv={who:d.id,i:0};break;
case"svn":if(p.sv){p.sv.i++;if(p.sv.i>=getSts(p.sv.who).length)p.sv=null}break}
save();draw();if(pv!=null&&$("#pin"))$("#pin").value=pv}
$("#af").onchange=e=>rd(e.target.files[0],d=>{const c=C();if(!c)return;c.msgs.push({t:"img",f:"me",src:d,x:"",h:P().time,s:1});e.target.value="";save();draw()},800);
$("#stf").onchange=e=>rd(e.target.files[0],d=>{(P().sts=P().sts||[]).push({src:d});e.target.value="";save();draw()},800);
$("#ph").addEventListener("input",e=>{if(e.target.id!=="sq")return;const q=e.target.value.toLowerCase();$("#ph").querySelectorAll(".list .it").forEach(r=>r.style.display=r.textContent.toLowerCase().includes(q)?"":"none")});

function sbEl(){return $("#sc .ovl.info")||$("#sc .ms")||$("#sc .list")}
function sbSync(){const e=sbEl(),xs=$("#xs"),xt=$("#xt");if(!e||e.scrollHeight<=e.clientHeight+1){xs.style.visibility="hidden";return}xs.style.visibility="visible";const th=xs.clientHeight,h=Math.max(36,th*e.clientHeight/e.scrollHeight);xt.style.height=h+"px";xt.style.top=(e.scrollTop/(e.scrollHeight-e.clientHeight))*(th-h)+"px"}
let CROP=false,CS=[],lk="",lastN=0;
{const _d=draw;draw=function(){const p=P(),c=C(),k=[S.pi,p.app,p.tab,p.cur,p.tv,p.to,p.info].join("|"),e=sbEl(),st=e?e.scrollTop:0,same=k===lk,n=c?c.msgs.length:0;
_d.apply(this,arguments);const e2=sbEl();if(same&&e2){if(c&&n>lastN)e2.scrollTop=e2.scrollHeight;else e2.scrollTop=st}
if(!same)CS=[];lk=k;lastN=n;applyCs();cropLabel();sbSync();setTimeout(sbSync,120)}}
function applyCs(){document.querySelectorAll("#sc [data-i]").forEach(e=>e.classList.toggle("cs",CROP&&CS.includes(+e.dataset.i)))}
function cropLabel(){const b=$("#cropb"),x=P().app==="tw"&&!C();b.textContent=CROP?(x?(S.tsel?"✂ Recorte (post) ON":"✂ Selecione post"):`✂ Recorte (${CS.length}) ON`):"✂ Recorte";b.classList.toggle("on",CROP)}
function cropTarget(){document.querySelectorAll("#sc .cs").forEach(e=>e.classList.remove("cs"));
if(CROP&&P().app==="tw"&&!C()){const post=[...document.querySelectorAll("#sc .tw[data-tw]")].find(e=>e.dataset.tw===S.tsel);if(!post)throw new Error("Selecione um post do X para recortar");const box=document.createElement("div");box.id="cropbox";box.style.cssText=`position:fixed;left:-9999px;top:0;width:${Math.ceil(post.getBoundingClientRect().width)}px;height:auto;overflow:visible;background:var(--bg);color:var(--tx)`;const clone=post.cloneNode(true);clone.classList.remove("sel");box.appendChild(clone);$("#ph").appendChild(box);return box}
const ms=$("#ms2");if(!(CROP&&CS.length&&ms))return $("#sc");
const box=document.createElement("div");box.id="cropbox";box.className="ms";box.style.cssText=`position:fixed;left:-9999px;top:0;width:${ms.clientWidth}px;height:auto;flex:none;overflow:visible;background:${ms.style.background||""}`;
[...ms.children].filter(e=>CS.includes(+e.dataset.i)).forEach(e=>box.appendChild(e.cloneNode(true)));$("#ph").appendChild(box);return box}
$("#ph").addEventListener("click",e=>{if(!CROP)return;if(P().app==="tw"&&!C()){const post=e.target.closest("#sc .tw[data-tw]");if(!post)return;e.stopImmediatePropagation();e.preventDefault();S.tsel=post.dataset.tw;S.sel=null;draw();return}const el=e.target.closest("[data-i]"),ms=$("#ms2");if(!el||!ms||!ms.contains(el))return;e.stopImmediatePropagation();e.preventDefault();const i=+el.dataset.i;CS=CS.includes(i)?CS.filter(x=>x!==i):[...CS,i].sort((a,b)=>a-b);applyCs();cropLabel()},true);
$("#cropb").onclick=()=>{CROP=!CROP;CS=[];S.sel=null;draw();const x=P().app==="tw"&&!C();toast(CROP?(x?"Recorte ativo: selecione um post do X":"Recorte ativo: toque nas mensagens que quer no print"):"Recorte desativado")};
$("#ce_sc").oninput=()=>{const c=C();if(c){c.sc=$("#ce_sc").value;save();draw()}};
$("#tcol").oninput=()=>{P().tc=$("#tcol").value;save();draw()};$("#tcauto").onclick=()=>{P().tc="";save();draw()};
const getSts=w=>{const p=P();if(w==="me")return p.sts||(p.sts=[]);const k=p.chats.find(x=>x.id===w);return k?(k.sts||(k.sts=[])):[]};
let stpend="";
function stRefresh(f){const w=$("#stw"),s=$("#stsel"),p=P();if(!w||!p)return;if(!f&&(document.activeElement===w||document.activeElement===s))return;const cw=w.value||"me",cs=s.value;
w.innerHTML='<option value="me">Meu status</option>'+p.chats.filter(k=>k.t==="c"&&(k.app||"wa")==="wa").map(k=>`<option value="${k.id}">${esc(k.name)}</option>`).join("");w.value=[...w.options].some(o=>o.value===cw)?cw:"me";
s.innerHTML='<option value="">Novo status</option>'+getSts(w.value).map((x,i)=>`<option value="${i}">${i+1}. ${esc((x.x||"Foto").slice(0,24))}</option>`).join("");s.value=[...s.options].some(o=>o.value===cs)?cs:""}
$("#stw").onchange=()=>{$("#stsel").value="";stRefresh(1)};
$("#stsel").onchange=()=>{const v=$("#stsel").value,x=v===""?null:getSts($("#stw").value)[+v];$("#stx").value=x?x.x||"":"";$("#sth").value=x?x.h||"":"";$("#stc").value=x&&x.c?x.c:"#128c7e";stpend=""};
$("#stimgf").onchange=e=>rd(e.target.files[0],d=>stpend=d,800);
const sobj=()=>({x:$("#stx").value,h:$("#sth").value||"Hoje, "+P().time,c:$("#stc").value});
$("#stadd").onclick=()=>{const o=sobj();if(!o.x.trim()&&!stpend)return toast("Escreva um texto ou escolha uma foto");getSts($("#stw").value).push({...o,src:stpend});stpend="";$("#stx").value=$("#stimgf").value="";save();draw();stRefresh(1);toast("Status adicionado")};
$("#stsave").onclick=()=>{const v=$("#stsel").value;if(v==="")return toast("Escolha um status existente");const it=getSts($("#stw").value)[+v];Object.assign(it,sobj());if(stpend)it.src=stpend;stpend="";save();draw();stRefresh(1);toast("Status atualizado")};
$("#stdel").onclick=()=>{const v=$("#stsel").value;if(v==="")return toast("Escolha um status existente");getSts($("#stw").value).splice(+v,1);$("#stsel").value="";save();draw();stRefresh(1)};
$("#sc").addEventListener("scroll",sbSync,true);addEventListener("resize",sbSync);
let sdr=null;
$("#xt").addEventListener("pointerdown",ev=>{const e=sbEl();if(!e)return;sdr={y:ev.clientY,s:e.scrollTop};$("#xt").setPointerCapture(ev.pointerId);ev.preventDefault();ev.stopPropagation()});
$("#xt").addEventListener("pointermove",ev=>{if(!sdr)return;const e=sbEl(),th=$("#xs").clientHeight,h=$("#xt").offsetHeight;e.scrollTop=sdr.s+(ev.clientY-sdr.y)*(e.scrollHeight-e.clientHeight)/Math.max(1,th-h)});
$("#xt").addEventListener("pointerup",()=>sdr=null);
$("#xs").addEventListener("pointerdown",ev=>{if(ev.target.id==="xt")return;const e=sbEl(),r=$("#xs").getBoundingClientRect();if(e)e.scrollTop=(ev.clientY-r.top)/r.height*(e.scrollHeight-e.clientHeight)});

/* ===== v2: modo celular/PC, Messenger e X realistas ===== */
Object.assign(IC,{ban:'<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',mute:'<path d="M4 9v6h4l5 4V5L8 9zM17 9l4 6M21 9l-4 6"/>',star:'<path d="M12 3l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.8z"/>',bell:'<path d="M6 17V11a6 6 0 0112 0v6l2 2H4zM10 21h4"/>',spk:'<path d="M4 9v6h4l5 4V5L8 9zM17 8a5 5 0 010 8M19.5 5.5a9 9 0 010 13"/>',pin:'<path d="M12 21s-6-6-6-11a6 6 0 0112 0c0 5-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>',cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',plus:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',img:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/>',like:'<path d="M7 11v9H4v-9zM7 11l4-8c1.6 0 2.6 1.1 2.1 3.1L12.4 9H19a2 2 0 011.9 2.6l-1.8 6A2 2 0 0117.2 19H7" fill="currentColor"/>',send:'<path d="M3 11l18-8-8 18-2-8z" fill="currentColor"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',pen:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',rep:'<path d="M4 5h16v11H10l-4 4v-4H4z"/>',rt:'<path d="M4 11V9a3 3 0 013-3h11l-3-3M20 13v2a3 3 0 01-3 3H6l3 3"/>',heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/>',views:'<path d="M5 20V10M10 20V4M15 20v-8M20 20V8"/>',shr:'<path d="M12 15V3M7 8l5-5 5 5M5 13v6h14v-6"/>',moon:'<path d="M20.9 13A9 9 0 0111 3.1 9 9 0 1020.9 13z"/>'});
const XL='<svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 4l14 16M19 4L5 20" stroke="currentColor" stroke-width="2.4" fill="none"/></svg>';
const isAct=k=>/ativo|online/i.test(k.status||"");
/* ligação: recebida/recusada ficam do lado de quem recebeu (dono do celular) */
CK.in[2]="out";CK.refused[2]="out";
Object.assign(CK,{in:["Chamada recebida","↙","out"],refused:["Chamada recusada","↗","out"]});
/* ---------- Messenger (lista) ---------- */
msView=function(sb){const p=P(),t=p.tab|0,L=ls().filter(k=>!t||k.t==="c"),
row=k=>{const l=k.msgs[k.msgs.length-1],u=k.unread,pv=l?(l.f==="me"?"Você: ":"")+(l.x||(l.t==="img"?"Enviou uma foto":l.t==="stk"?"Enviou uma figurinha":l.t==="aud"?"Mensagem de voz":"…"))+" · "+(l.h||""):"Sem mensagens";
return`<div class="it" data-c="${k.id}"><div class="avw">${av(k.photo,k.name)}${isAct(k)?'<i class="on"></i>':""}</div><div class="m"><b style="font-weight:${u?700:400}">${esc(k.name)}</b><div class="p" style="${u?"color:var(--tx);font-weight:600":""}">${esc(pv)}</div></div>${u?'<i class="dot"></i>':""}</div>`};
return`<div class="scr">${sb}<div class="hd"><span class="avw" data-act="sbedit">${av(p.photo,p.owner)}</span><b class="ttl">${t?"Pessoas":"Conversas"}</b><span class="ic"><i class="ib" data-act="ldark" title="${p.dark?"Usar tema claro":"Usar tema escuro"}">${I(IC.moon,22)}</i><i class="ib">${I(IC.cam,22)}</i><i class="ib" data-act="newc">${I(IC.pen,22)}</i></span></div><div class="srch">${I(IC.srch,18)} Pesquisar</div>${t?"":`<div class="stor"><div><div class="av plus">+</div>Criar história</div>${L.slice(0,6).map(k=>`<div><div class="avw">${av(k.photo,k.name)}${isAct(k)?'<i class="on"></i>':""}</div>${esc(k.name.split(" ")[0])}</div>`).join("")}</div>`}<div class="list">${L.length?L.map(row).join(""):'<div class="empty">Sem conversas no Messenger.</div>'}</div><div class="nav">${["Conversas","Pessoas"].map((n,i)=>`<span data-tab="${i}" class="${i==t?"on":""}">${I(i?'<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6"/>':IC.chat,26)}${n}${!i&&unread("ms")?`<i class="bd">${unread("ms")}</i>`:""}</span>`).join("")}</div></div>`};
/* ---------- X ---------- */
tcard=function(t){const a=who(t),par=t.rp&&TT().find(x=>x.id===t.rp);
return`<div class="tw${S.tsel===t.id?" sel":""}" data-tw="${t.id}">${t.rt?`<div class="rtl">${I(IC.rt,13)} ${esc(t.rt)} repostou</div>`:""}<div class="twr">${av(a.ph,a.n)}<div class="tb"><div class="th"><b>${esc(a.n)}</b>${a.v?VER:""}<small>@${esc(a.u)} · ${esc(t.h||"")}</small><i class="mo">${I(IC.dots,16)}</i></div>${par?`<small class="rto">Respondendo a <span>@${esc(who(par).u)}</span></small>`:""}<p>${esc(t.x||"").replace(/\n/g,"<br>")}</p>${t.img?`<img src="${t.img}">`:""}${t.q?qcard(t.q):""}<div class="ta"><span data-ta="reply">${I(IC.rep,17)}${nf(t.c||0)}</span><span data-ta="rt" class="${t.rd?"rt":""}">${I(IC.rt,17)}${nf(t.r||0)}</span><span data-ta="like" class="${t.lk?"on":""}">${I(IC.heart,17)}${nf(t.l||0)}</span><span>${I(IC.views,17)}${nf(t.v||0)}</span><span>${I(IC.shr,17)}</span></div></div></div></div>`};
{const _tv=twView;twView=function(sb){let h=_tv(sb);const p=P();if(!p.tv&&!(p.tab|0))h=h.replace(/<b class="ttl"[^>]*>Início<\/b>/,`<b class="ttl xl">${XL}</b>`).replace('</div><div class="list">','</div><div class="xtabs"><span class="on">Para você</span><span>Seguindo</span></div><div class="list">');return h}}
/* ---------- tela de conversa por app ---------- */
const asWho=c=>{const a=S.as;return a&&a!=="me"&&(a==="them"?c.t!=="g":(c.members||[]).includes(a))?a:"me"};
function eb(c,g){if(S.mode!=="phone")return"";const w=asWho(c),tk=S.tk==null?3:S.tk;return`<div class="eui eb"><span data-act="eas">Enviar como: <b>${esc(w==="me"?"Eu":w==="them"?c.name:w)}</b> ⇄</span><span data-act="etk">${["Sem ticks","✓ Enviada","✓✓ Entregue","✓✓ Lida"][tk]}</span><span data-act="eins">＋ Inserir</span></div>`}
function chatView(sb,c,g){const p=P(),a=p.app,sub=g?["Você",...c.members].join(", "):c.status,ico=(k,d,w)=>`<i class="ib" data-act="${k}">${I(d,w)}</i>`,
nm=`<div class="nm" data-act="hedit"><b>${esc(c.name)}</b><small style="color:${c.sc||(a==="wa"?"#fff":"var(--sub)")};opacity:1">${esc(sub||(a==="tw"?"@"+c.name.toLowerCase().replace(/\s+/g,""):""))}</small></div>`,
bk=`<span id="bk" data-act="back" class="ib">${I(IC.back)}</span>`,avt=`<span class="avw" data-act="hpic">${av(c.photo,c.name)}${a==="ms"&&isAct(c)?'<i class="on"></i>':""}</span>`;let hd,ft;
if(a==="wa")hd=`${bk}${avt}${nm}<span class="ic">${ico("vid",IC.vid)}${ico("call",IC.ph,20)}${ico("dots",IC.dots)}</span>`;
else if(a==="ms")hd=`${bk}${avt}${nm}<span class="ic">${ico("call",IC.ph,22)}${ico("vid",IC.vid,24)}${ico("dots",IC.info,22)}</span>`;
else hd=`${bk}${avt}${nm}<span class="ic">${ico("dots",IC.info,22)}</span>`;
const snd=`<div class="mic" data-send="1"><span class="i-mic">${I(IC.mic)}</span><span class="i-snd">${I(IC.send,22)}</span><span class="i-like">${I(IC.like,26)}</span></div>`;
if(a==="wa")ft=`<div class="in"><i class="ib" data-act="emo">${I(IC.smile)}</i><input id="pin" placeholder="Mensagem" autocomplete="off"><i class="ib" data-act="attach">${I(IC.clip,20)}</i><i class="ib" data-act="attach">${I(IC.cam,20)}</i></div>${snd}`;
else if(a==="ms")ft=`<i class="ib mp" data-act="eins">${I(IC.plus,26)}</i><i class="ib mp" data-act="attach">${I(IC.cam,24)}</i><i class="ib mp" data-act="attach">${I(IC.img,24)}</i><div class="in"><input id="pin" placeholder="Aa" autocomplete="off"><i class="ib mp" data-act="emo">${I(IC.smile,22)}</i></div>${snd}`;
else ft=`<div class="in"><i class="ib" data-act="attach">${I(IC.img,20)}</i><input id="pin" placeholder="Iniciar uma mensagem" autocomplete="off">${snd}</div>`;
return`<div class="scr">${sb}<div class="hd">${hd}</div><div class="ms" id="ms2">${c.msgs.map((m,i)=>msg(m,i,g)).join("")}</div>${eb(c,g)}<div class="ft">${ft}</div></div>`}
/* ---------- pós-processamento (agrupamento, avatar, visto, hora no X) ---------- */
function post(){const p=P(),ph=$("#ph");document.body.classList.toggle("m-phone",S.mode==="phone");document.querySelectorAll("#seg button").forEach(b=>b.classList.toggle("on",b.dataset.m===S.mode));
const pin=$("#pin");if(pin&&pin.value)pin.closest(".ft").classList.add("has");
const ms=$("#ms2"),c=C();if(!ms||!c)return;const sd=e=>e.classList.contains("out")?1:0;let lastMe=-1;
c.msgs.forEach((m,i)=>{if(m.f==="me"&&m.s&&!["sys","date","call"].includes(m.t))lastMe=i});
[...ms.querySelectorAll(".b")].forEach(b=>{const n=b.nextElementSibling,last=!n||!n.classList.contains("b")||sd(n)!==sd(b)||n.classList.contains("tl");b.classList.toggle("lastg",last);if(!last)return;const i=+b.dataset.i,m=c.msgs[i];
if(p.app==="ms"){if(!sd(b)&&c.t!=="g")b.insertAdjacentHTML("beforeend",`<span class="mav">${av(c.photo,c.name)}</span>`);if(i===lastMe)b.insertAdjacentHTML("afterend",`<div class="seen">${m.s===3?`<span class="mav s">${av(c.photo,c.name)}</span>`:m.s===2?"Entregue":"Enviada"}</div>`)}
else if(p.app==="tw"){b.insertAdjacentHTML("afterend",`<div class="xtm ${sd(b)?"out":"in"}">${esc(m.h||"")}${sd(b)&&i===lastMe&&m.s===3?" · Visto":""}</div>`)}})}
{const _d2=draw;draw=function(){_d2.apply(this,arguments);post()}}
/* ---------- janelas dentro do celular ---------- */
function closeDlg(){const l=$("#dlgL");if(l)l.remove()}
function layer(h){closeDlg();const l=document.createElement("div");l.id="dlgL";l.innerHTML=h;$("#ph").appendChild(l);return l}
function dlg(title,fs,ok,del){const l=layer(`<div class="dlgb"><h3>${title}</h3>${fs.map(f=>`<label>${f.l}</label>${f.o?`<select data-k="${f.k}">${f.o.map(([v,n])=>`<option value="${esc(v)}"${String(v)===String(f.v)?" selected":""}>${esc(n)}</option>`).join("")}</select>`:`<input data-k="${f.k}" type="${f.t||"text"}"${f.t==="file"?' accept="image/*"':` value="${esc(f.v==null?"":f.v)}"`}>`}`).join("")}<div class="dbt">${del?'<button class="r" data-d="del">Excluir</button>':""}<button class="g" data-d="x">Cancelar</button><button data-d="ok">Salvar</button></div></div>`);
l.onclick=e=>{e.stopPropagation();const b=e.target.closest("[data-d]");if(!b){if(e.target===l)closeDlg();return}const d=b.dataset.d;if(d==="ok"){const v={};l.querySelectorAll("[data-k]").forEach(i=>v[i.dataset.k]=i.type==="file"?(i.dataset.v||""):i.value);closeDlg();ok(v)}else if(d==="del"){closeDlg();del()}else closeDlg()};l.querySelectorAll('input[type=file]').forEach(i=>i.onchange=e=>rd(e.target.files[0],d=>i.dataset.v=d,i.dataset.k==='banner'?900:300));const i=l.querySelector('input');if(i&&i.type==='text')i.focus()}
let rxCb=null;
function sheet(h,items,rx){rxCb=rx;const l=layer(`<div class="shb">${h}${items.map(([n,f,c],i)=>`<div class="shi ${c||""}" data-s="${i}">${n}</div>`).join("")}</div>`);l.onclick=e=>{e.stopPropagation();const b=e.target.closest("[data-s],[data-e]");if(!b){if(e.target===l)closeDlg();return}closeDlg();if(b.dataset.e!==undefined)return rxCb(b.dataset.e);items[+b.dataset.s][1]()}}
const done=()=>{S.sel=null;save();draw()};
function msgSheet(i){const c=C(),m=c.msgs[i],g=c.t==="g",sys=["sys","date"].includes(m.t);
const rx=sys?"":`<div class="rxr">${["👍","❤️","😂","😮","😢","🙏"].map(e=>`<span data-e="${e}">${e}</span>`).join("")}</div>`;
sheet(rx,[["Editar mensagem",()=>editMsg(i)],...(sys||m.t==="call"?[]:[["Trocar de lado (eu ⇄ "+(g?"membro":esc(c.name))+")",()=>{m.f=m.f==="me"?(g?c.members[0]:"them"):"me";m.s=m.f==="me"?3:0;done()}]]),["Excluir",()=>{c.msgs.splice(i,1);done()},"dg"]],e=>{m.re=m.re===e?"":e;done()})}
function editMsg(i){const c=C(),m=c.msgs[i],g=c.t==="g",fs=[];
if(m.t==="date"||m.t==="sys")fs.push({k:"x",l:"Texto",v:m.x});
else{if(m.t==="call")fs.push({k:"k",l:"Tipo",v:m.k,o:Object.keys(CK).map(k=>[k,CK[k][0]])},{k:"v",l:"Formato",v:m.v||0,o:[[0,"Voz"],[1,"Vídeo"]]},{k:"d",l:"Duração da ligação (ex: 4 min)",v:m.d||""});
else if(m.t==="txt"||m.t==="img")fs.push({k:"x",l:"Texto",v:m.x||""});
if(m.t==="aud")fs.push({k:"d",l:"Duração do áudio (ex: 0:34)",v:m.d||""});fs.push({k:"h",l:"Hora",v:m.h||"",t:"text"});
if(m.t!=="call")fs.push({k:"f",l:"Quem enviou",v:m.f,o:[["me","Eu"],...(g?c.members:["them"]).map(n=>[n,n==="them"?c.name:n])]},{k:"s",l:"Ticks",v:m.s||0,o:[[0,"Nenhum"],[1,"✓ Enviada"],[2,"✓✓ Entregue"],[3,"✓✓ Lida"]]})}
dlg("Editar mensagem",fs,v=>{Object.keys(v).forEach(k=>m[k]=["s","v"].includes(k)?+v[k]:v[k]);if(m.t==="call")m.f=CK[m.k][2]==="out"?"me":"them";if(m.f!=="me")m.s=0;done()})}
function syncMf(){const c=C(),mf=$("#mf");if(mf&&[...mf.options].some(o=>o.value===asWho(c)))mf.value=asWho(c);$("#mt").value=P().time;$("#ms").value=S.tk==null?3:S.tk}
function insMenu(){const c=C(),p=P(),push=m=>{c.msgs.push(m);done()};
sheet("<h3>Inserir na conversa</h3>",[["Divisor de data",()=>dlg("Divisor de data",[{k:"x",l:"Texto",v:"HOJE"}],v=>push({t:"date",x:v.x||"HOJE"}))],
...(p.app==="wa"?[["Ligação",()=>dlg("Ligação",[{k:"k",l:"Tipo",v:"in",o:Object.keys(CK).map(k=>[k,CK[k][0]])},{k:"v",l:"Formato",v:0,o:[[0,"Voz"],[1,"Vídeo"]]},{k:"d",l:"Duração",v:""},{k:"h",l:"Hora",v:p.time}],v=>push({t:"call",f:CK[v.k][2]==="out"?"me":"them",k:v.k,v:+v.v,d:v.d,h:v.h}))],
["Aviso do sistema",()=>dlg("Aviso do sistema",[{k:"k",l:"Tipo",v:"blk",o:[["blk","Você bloqueou este contato"],["unb","Você desbloqueou"],["enc","Aviso de criptografia"],["custom","Texto personalizado"]]},{k:"x",l:"Texto (se personalizado)",v:""}],v=>push({t:"sys",x:v.k==="custom"?(v.x||"…"):SYS[v.k]}))]]:[]),
["Mensagem de áudio",()=>dlg("Áudio",[{k:"d",l:"Duração (ex: 0:34)",v:"0:34"}],v=>push({t:"aud",f:asWho(c),h:p.time,s:asWho(c)==="me"?(S.tk==null?3:S.tk):0,d:v.d}))],["Mensagem apagada",()=>push({t:"del",f:asWho(c),h:p.time,s:0})],
["Emoji grande",()=>dlg("Emoji grande",[{k:"x",l:"Emoji",v:"❤️"}],v=>push({t:"stk",f:asWho(c),h:p.time,s:asWho(c)==="me"?3:0,e:v.x})) ],
["Figurinha (imagem)",()=>{syncMf();$("#mstkf").click()}],["GIF",()=>{syncMf();$("#mgiff").click()}]])}
function profDlg(){const w=P().tw;dlg("Editar perfil",[{k:"photo",l:"Foto de perfil",t:"file"},{k:"banner",l:"Banner",t:"file"},{k:"name",l:"Nome",v:w.name},{k:"user",l:"@usuário",v:w.user},{k:"bio",l:"Bio",v:w.bio},{k:"loc",l:"Local",v:w.loc},{k:"joined",l:"Entrada",v:w.joined},{k:"following",l:"Seguindo",v:w.following,t:"number"},{k:"followers",l:"Seguidores",v:w.followers,t:"number"},{k:"verified",l:"Verificada",v:w.verified?1:0,o:[[1,"Sim"],[0,"Não"]]}],v=>{["photo","banner"].forEach(k=>{if(!v[k])delete v[k]});Object.assign(w,v,{following:+v.following,followers:+v.followers,verified:v.verified==="1"});save();draw()})}
function tweetDlg(id){const t=TT().find(x=>x.id===id);if(!t)return;const fs=[];if(!t.me)fs.push({k:"photo",l:"Foto do autor",t:"file"},{k:"n",l:"Nome do autor",v:t.n||""},{k:"u",l:"@usuário",v:t.u||""});
fs.push({k:"x",l:"Texto",v:t.x||""},{k:"h",l:"Tempo",v:t.h||""},{k:"c",l:"Respostas",v:t.c||0,t:"number"},{k:"r",l:"Reposts",v:t.r||0,t:"number"},{k:"l",l:"Curtidas",v:t.l||0,t:"number"},{k:"v",l:"Views",v:t.v||0,t:"number"});
dlg("Editar post",fs,v=>{if(!v.photo)delete v.photo;["c","r","l","v"].forEach(k=>v[k]=+v[k]||0);Object.assign(t,v);save();draw()},()=>{P().tweets=P().tweets.filter(x=>x.id!==id&&x.rp!==id);save();draw()})}
/* ---------- ações do modo celular ---------- */
{const _a=act;act=function(k,d){const p=P(),c=C();
if(S.mode!=="phone"&&(k==="hedit"||k==="hpic"))k="m_info";
if(S.mode==="phone"&&k==="hedit"&&c)return dlg("Editar contato",[{k:"name",l:"Nome",v:c.name},{k:"status",l:"Status (online, digitando…)",v:c.status||""},{k:"unread",l:"Não lidas",v:c.unread||0,t:"number"}],v=>{c.name=v.name;c.status=v.status;c.unread=+v.unread;save();draw()});
if(k==="hpic"){$("#ce_p").click();return}
if(k==="sbedit"){if(S.mode!=="phone")return;return dlg("Barra de status",[{k:"time",l:"Horário",v:p.time},{k:"battery",l:"Bateria %",v:p.battery,t:"number"},{k:"carrier",l:"Operadora",v:p.carrier},{k:"net",l:"Rede",v:p.net,o:["5G","4G","3G","Wi-Fi"].map(x=>[x,x])}],v=>{Object.assign(p,v,{battery:Math.min(100,Math.max(1,+v.battery||1))});save();draw()})}
if(k==="eas"&&c){const l=["me",...(c.t==="g"?c.members:["them"])],i=l.indexOf(asWho(c));S.as=l[(i+1)%l.length];save();draw();return}
if(k==="etk"){S.tk=((S.tk==null?3:S.tk)+3)%4;save();draw();return}
if(k==="eins"){if(c)insMenu();return}
if(k==="attach"&&S.mode==="phone"&&p.app!=="wa"&&c){syncMf()}
return _a(k,d)}}
{const _ta=twAct;twAct=function(a,k){if(k==="edit"&&S.mode==="phone")return profDlg();return _ta(a,k)}}
{const oc=$("#ph").onclick;$("#ph").onclick=function(e){const b=e.target.closest("[data-i]"),m=$("#ms2");if(S.mode==="phone"&&!CROP&&b&&m&&m.contains(b))return msgSheet(+b.dataset.i);return oc.call(this,e)}}
$("#ph").addEventListener("click",e=>{if(S.mode!=="phone"||CROP)return;const t=e.target.closest("[data-tw]");if(!t||e.target.closest("[data-ta]"))return;e.stopImmediatePropagation();tweetDlg(t.dataset.tw)},true);
$("#ph").addEventListener("click",e=>{const a=e.target.closest("[data-send]");if(!a||CROP)return;const c=C(),v=$("#pin").value.trim(),p=P();if(!c)return;e.stopImmediatePropagation();if(c.left)return toast("Você saiu deste grupo");
const w=S.mode==="phone"?asWho(c):"me",m={f:w,h:p.time,s:w==="me"?(S.mode==="phone"&&S.tk!=null?S.tk:1):0};
if(v)Object.assign(m,{t:"txt",x:v});else if(p.app==="ms")Object.assign(m,{t:"stk",e:"👍"});else if(p.app==="wa")Object.assign(m,{t:"aud",d:"0:"+String(3+Math.floor(Math.random()*40)).padStart(2,"0")});else return;
c.msgs.push(m);S.sel=null;save();draw()},true);
$("#ph").addEventListener("input",e=>{if(e.target.id==="pin")e.target.closest(".ft").classList.toggle("has",!!e.target.value)});
document.querySelectorAll("#seg button").forEach(b=>b.onclick=()=>{S.mode=b.dataset.m;closeDlg();save();draw();toast(S.mode==="phone"?"Modo celular: toque nas coisas direto no aparelho":"Modo PC: use os painéis laterais")});

function contactDlg(){const c=C(),g=c.t==="g",col=c.sc||"#ffffff";dlg(g?"Editar grupo":"Editar contato",[{k:"photo",l:"Foto de perfil",t:"file"},{k:"rm",l:"Foto atual",v:0,o:[[0,"Manter"],[1,"Remover"]]},{k:"name",l:"Nome",v:c.name},{k:"status",l:"Status (online, digitando…)",v:c.status||""},...(g?[]:[{k:"number",l:"Número",v:c.number||""}]),{k:"sc",l:"Cor do subtítulo",v:col,t:"color"},{k:"unread",l:"Não lidas",v:c.unread||0,t:"number"}],v=>{if(v.photo)c.photo=v.photo;else if(v.rm==="1")c.photo="";c.name=v.name||c.name;c.status=v.status;if(!g)c.number=v.number;if(v.sc!==col)c.sc=v.sc;c.unread=+v.unread||0;save();draw()})}
function ownerDlg(){const p=P();dlg("Meu celular",[{k:"photo",l:"Minha foto",t:"file"},{k:"owner",l:"Meu nome",v:p.owner},{k:"time",l:"Horário",v:p.time},{k:"battery",l:"Bateria %",v:p.battery,t:"number"},{k:"carrier",l:"Operadora",v:p.carrier},{k:"net",l:"Rede",v:p.net,o:["5G","4G","3G","Wi-Fi"].map(x=>[x,x])}],v=>{if(v.photo)p.photo=v.photo;p.owner=v.owner||p.owner;p.time=v.time||p.time;p.battery=Math.min(100,Math.max(1,+v.battery||1));p.carrier=v.carrier;p.net=v.net;save();draw()})}
{const _a2=act;act=function(k,d){if(S.mode==="phone"){if((k==="hedit"||k==="hpic")&&C())return contactDlg();if(k==="sbedit")return ownerDlg()}return _a2(k,d)}}
$("#medit").addEventListener("click",()=>{const c=C(),m=c&&S.sel!==null&&c.msgs[S.sel];if(m&&["call","aud"].includes(m.t))m.d=$("#md").value},true);
$("#maud").onclick=()=>add({...mk("aud"),d:$("#md").value||"0:12"});
{const oc2=$("#ph").onclick;$("#ph").onclick=function(e){oc2.call(this,e);const c=C(),m=c&&S.sel!==null&&c.msgs[S.sel];if(m)$("#md").value=m.d||""}}

/* ajuste ao celular de verdade: escala proporcional, sem mudar o tamanho do aparelho simulado */
const pwEl=$("#pw");
function fit(){if(isMob()){pwEl.style.zoom="";$("#stage").style.position="";return}const vw=document.documentElement.clientWidth,k=Math.min(1,(vw-16)/396);pwEl.style.zoom=k<1?k:"";const st=$("#stage");st.style.position=(innerWidth>1180&&st.offsetHeight*(k<1?k:1)>innerHeight-24)?"static":""}
const isMob=()=>!!window.matchMedia&&matchMedia("(max-width:640px)").matches;
function syncMob(){if(isMob()){if(S.mode!=="phone"){S.prevMode=S.mode;S.mode="phone"}}else if(S.prevMode){S.mode=S.prevMode;delete S.prevMode}}
const menu=o=>document.body.classList.toggle("menu-open",!!o);
$("#hmb").onclick=e=>{e.stopPropagation();menu(!document.body.classList.contains("menu-open"))};
$("#mback").onclick=()=>menu(0);
$(".bar").addEventListener("click",e=>{if(e.target.closest("button"))setTimeout(()=>menu(0),60)});
addEventListener("resize",()=>{const w=S.mode;syncMob();fit();if(S.mode!==w)draw()});
syncMob();fit();
{const _g=grab;grab=async function(f){const z=pwEl.style.zoom;pwEl.style.zoom="";try{return await _g(f)}finally{pwEl.style.zoom=z}}}

draw();


/* ================= v4: bloco de notas (pop-up central), citação (quote) ================= */
function qcard(q){return`<div class="qt"><div class="qh">${av(q.ph,q.n)}<b>${esc(q.n)}</b>${q.v?VER:""}<small>@${esc(q.u)}${q.h?" · "+esc(q.h):""}</small></div>${q.x?`<p>${esc(q.x).replace(/\n/g,"<br>")}</p>`:""}${q.img?`<img src="${q.img}" alt="">`:""}</div>`}
function quoteOf(t){const a=who(t);askText({title:"Citar post",sub:"Citando @"+a.u,placeholder:"Adicione um comentário",ok:"Postar",max:280,allowEmpty:true,quote:(t.x||"").slice(0,140)}).then(x=>{if(x===null)return;TT().unshift({id:uid(),me:1,x:x||"",h:"agora",c:0,r:0,l:0,v:0,q:{n:a.n,u:a.u,ph:a.ph,v:a.v,x:t.x,img:t.img,h:t.h}});t.r=(t.r||0)+1;save();draw()})}
/* askText: abre um bloco de notas editável no centro da tela. Resolve com o texto, "" (só se allowEmpty/alt) ou null (cancelou). */
function askText(o){o=o||{};return new Promise(res=>{
  const prev=document.activeElement,old=document.getElementById("npw");if(old)old.remove();
  const w=document.createElement("div");w.id="npw";w.setAttribute("role","dialog");w.setAttribute("aria-modal","true");
  const max=o.max||500,rows=o.rows||5;
  w.innerHTML=`<div class="np"><div class="np-sp" aria-hidden="true"></div><div class="np-h"><h3></h3><small></small></div>${o.quote?'<div class="np-q"></div>':""}<div class="np-paper"><textarea rows="${rows}" maxlength="${max}" spellcheck="true"></textarea></div>${o.image?'<label class="np-img">Imagem do post<input type="file" accept="image/*"><small class="np-img-state"></small></label><img class="np-preview" alt="Prévia da imagem" hidden>':""}<div class="np-f"><span class="np-c">0/${max}</span><div class="np-b">${o.alt?'<button type="button" class="g" data-a="alt"></button>':""}<button type="button" class="g" data-a="x">Cancelar</button><button type="button" data-a="ok"></button></div></div></div>`;
  w.style.setProperty("--r",rows);const q=s=>w.querySelector(s),ta=q("textarea"),cnt=q(".np-c"),okb=q('[data-a="ok"]'),imageInput=q(".np-img input"),preview=q(".np-preview");let image="",imageLoading=false,closed=false;
  q("h3").textContent=o.title||"Bloco de notas";q(".np-h small").textContent=o.sub||"";okb.textContent=o.ok||"Salvar";if(o.alt)q('[data-a="alt"]').textContent=o.alt;
  if(o.quote)q(".np-q").textContent=o.quote;ta.placeholder=o.placeholder||"Escreva aqui…";ta.value=o.value||"";
  const upd=()=>{cnt.textContent=ta.value.length+"/"+max;okb.disabled=imageLoading||(!o.allowEmpty&&!ta.value.trim()&&!(o.image&&image))};upd();ta.addEventListener("input",upd);
  if(imageInput)imageInput.onchange=e=>{const f=e.target.files[0];image="";imageLoading=!!f;preview.hidden=true;preview.removeAttribute("src");q(".np-img-state").textContent=f?"Preparando imagem…":"";upd();if(f)rd(f,d=>{if(closed)return;image=d;imageLoading=false;preview.src=d;preview.hidden=false;q(".np-img-state").textContent=f.name;upd()},700,()=>{if(closed)return;imageLoading=false;q(".np-img-state").textContent="";upd()})};
  const end=v=>{closed=true;document.removeEventListener("keydown",key,true);w.classList.remove("in");setTimeout(()=>w.remove(),160);if(prev&&prev.focus)try{prev.focus({preventScroll:true})}catch(e){}res(v)};
  const submit=()=>{if(okb.disabled)return;end(o.image?{text:ta.value.trim(),image}:ta.value.trim())};
  const key=e=>{if(e.key==="Escape"){e.preventDefault();e.stopPropagation();end(null)}else if(e.key==="Enter"&&(e.ctrlKey||e.metaKey||rows===1)&&!e.shiftKey){e.preventDefault();submit()}else if(e.key==="Tab"){const f=[...w.querySelectorAll("textarea,input[type=file],button:not(:disabled)")];if(!f.length)return;const i=f.indexOf(document.activeElement);e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus()}};
  document.addEventListener("keydown",key,true);
  w.addEventListener("mousedown",e=>{if(e.target===w)end(null)});
  w.addEventListener("click",e=>{e.stopPropagation();const b=e.target.closest("[data-a]");if(!b)return;const a=b.dataset.a;if(a==="ok")submit();else if(a==="alt")end("");else end(null)});
  document.body.appendChild(w);requestAnimationFrame(()=>{w.classList.add("in");ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length)});
})}
