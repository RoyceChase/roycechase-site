import {mount as mini} from './imini.js';
import {mount as power} from './ups.js';
import {mount as router} from './glinet.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const scene=$('#scene'), viewport=$('#viewport');
function box(w,h,d,x,y,z,color){
  const group=document.createElement('div');group.style.cssText=`position:absolute;transform-style:preserve-3d;transform:translate3d(${x}px,${y}px,${z}px)`;
  for(const[a,b,transform,shade]of[[w,d,`translateY(${-h/2}px) rotateX(90deg)`,color],[w,d,`translateY(${h/2}px) rotateX(-90deg)`,'#191a1c'],[w,h,`translateZ(${d/2}px)`,color],[w,h,`translateZ(${-d/2}px) rotateY(180deg)`,color],[d,h,`translateX(${w/2}px) rotateY(90deg)`,'#292b2e'],[d,h,`translateX(${-w/2}px) rotateY(-90deg)`,'#292b2e']]){
    const face=document.createElement('div');face.className='box-face';face.style.cssText=`width:${a}px;height:${b}px;left:${-a/2}px;top:${-b/2}px;transform:${transform};background:${shade}`;group.append(face);
  }$('#rack').append(group);
}
const cabinet='linear-gradient(115deg,#36383b,#242629 65%,#2f3134)';
// Four asymmetric open compartments, with recessed backing and plinth.
for(const y of[-180,30,240])box(530,16,300,0,y,0,cabinet);
for(const x of[-257,257])box(16,404,300,x,30,0,cabinet);
box(16,194,294,35,-75,0,cabinet);
box(16,194,294,135,135,0,cabinet);
box(498,404,6,0,30,-147,'#191b1d');
box(490,16,260,0,256,-8,'#141618');
for(const y of[-187,23,233])box(498,2,2,0,y,151,'#4c5055');
// Match router footprint area and UPS width, preserving X/Y/Z proportions.
const miniScale=.67,miniWidth=320*miniScale;
const routerScale=miniScale*Math.sqrt((320*300)/(3*320*260));
const placements=[['pc',mini,-110,22-40*miniScale,18,miniScale],['router',router,145,22-33*routerScale,25,routerScale],['ups',power,-65,232-131.25*(miniWidth*1.5/360)/2,16,miniWidth*1.5/360]];
for(const[id,mount,x,y,z,scale]of placements){
  const host=document.createElement('div');host.style.cssText=`position:absolute;transform-style:preserve-3d;transform:scale3d(${scale},${scale},${scale})`;
  const element=$('#'+id);element.style.transform=`translate3d(${x}px,${y}px,${z}px)${id==='router'?' rotateY(180deg)':''}`;element.prepend(host);mount(host.attachShadow({mode:'open'}));
  if(id==='router'){
    const theme=document.createElement('style');
    theme.textContent=`.top{background:linear-gradient(140deg,#484b50,#303338 55%,#25282d);border-color:#50545a;box-shadow:inset 0 0 12px #ffffff08}.bottom{background:linear-gradient(#25282c,#303338);border-color:#3c4045}.body-wall{background:linear-gradient(#3a3e43,#292d32 56%,#181b1f 57%,#303439 59%,#22262a)!important}.port-face{background:#2e3237;border-color:#50565e;box-shadow:inset 0 1px 1px #ffffff14}.antenna-face{background:linear-gradient(100deg,#3d4248,#292d32);border-color:#4a5058}.antenna-back{background:linear-gradient(100deg,#25292e,#363b41)}.antenna-rim{background:#30353b}.antenna-text,.top-brand{color:#9299a2}.hinge{border-color:#555c66;box-shadow:inset 0 1px 1px #ffffff15}.vent-row{background:repeating-linear-gradient(90deg,#101317 0 2px,#3a414a 2px 3px,transparent 3px 7px)}.side-switch{background:#30353b;border-color:#59616c}.side-switch:before{background:#14181d;box-shadow:0 7px #14181d}.side-switch:after{border-color:#707986}.port-label{color:#9ba3ad}.wan-label{background:#325b77;color:#d0e7f5}.ethernet{background:linear-gradient(#737b85,#30363d 40%,#12171c);border-color:#7c858f}.ethernet:after{background:#46505c}.power-c{border-color:#737d88}.bottom-grille{background:repeating-linear-gradient(90deg,#14171c 0 2px,#3b424b 2px 7px);border-color:#4b535e}.bottom-info{background:#373e47;color:#aab3be}.foot{background:#181d23;border-color:#3e4650}`;
    host.shadowRoot.append(theme);
  }
}
const viewAngles={initial:-13,min:-28,max:-2};
const clampPitch=value=>Math.max(viewAngles.min,Math.min(viewAngles.max,value));
let pitch=viewAngles.initial,yaw=-14,drag=null;
function draw(){const scale=Math.min(viewport.clientWidth/700,.74);scene.style.transform=`scale3d(${scale},${scale},${scale}) rotateX(${pitch}deg) rotateY(${yaw}deg) translateY(-35px)`;}
draw();window.addEventListener('resize',draw);
viewport.addEventListener('dragstart',e=>e.preventDefault());
viewport.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0)return;e.preventDefault();drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,device:e.composedPath().find(n=>n instanceof HTMLElement&&n.dataset.device)?.dataset.device,moved:false};viewport.setPointerCapture(e.pointerId);viewport.classList.add('dragging');viewport.focus({preventScroll:true});});
window.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;e.preventDefault();if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>4)drag.moved=true;if(drag.moved){yaw+=(e.clientX-drag.x)*.35;pitch=clampPitch(pitch-(e.clientY-drag.y)*.35);draw();}drag.x=e.clientX;drag.y=e.clientY;},{passive:false});
function finishDrag(e){if(!drag||e.pointerId!==drag.id)return;const previous=drag;drag=null;viewport.classList.remove('dragging');if(e.type==='pointerup'&&!previous.moved&&previous.device)pick(previous.device);if(viewport.hasPointerCapture(e.pointerId))viewport.releasePointerCapture(e.pointerId);}
for(const event of['pointerup','pointercancel'])window.addEventListener(event,finishDrag);
viewport.addEventListener('lostpointercapture',e=>{if(e.target===viewport)finishDrag(e);});
window.addEventListener('blur',()=>{drag=null;viewport.classList.remove('dragging');});
viewport.addEventListener('keydown',e=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();yaw+=e.key==='ArrowLeft'?-8:e.key==='ArrowRight'?8:0;pitch=clampPitch(pitch+(e.key==='ArrowUp'?-6:e.key==='ArrowDown'?6:0));draw();});
$('#reset').onclick=()=>{pitch=viewAngles.initial;yaw=-14;draw();};
const devices={compute:['COMPUTE / VIRTUALIZATION','机械革命 iMini','一台物理主机，承载服务、旁路由与隧道虚拟机。','查看系统架构'],network:['NETWORK / CONNECTIVITY','GL.iNet GL-MT3600BE','物理网络连接设备；与 PVE 内的虚拟旁路由分别展示。','查看网络链路'],power:['POWER / CONTINUITY','APC Back-UPS 650','宿主机 NUT 读取 UPS 状态；断电自动关机已完成实测。','查看停机保障']};
function pick(id){const[kicker,title,description,action]=devices[id];$('#device-kicker').textContent=kicker;$('#device-title').textContent=title;$('#device-description').textContent=description;$('#explore').innerHTML=action+' <span>↗</span>';$('#explore').href='#'+id;$$('[data-pick]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pick===id)));$$('.device').forEach(d=>d.classList.toggle('selected',d.dataset.device===id));}
$$('[data-pick]').forEach(b=>b.onclick=()=>pick(b.dataset.pick));pick('compute');

const details={
 main:['VM A / MAIN SERVER','主服务器','集中承载主要服务。图中的服务分组为占位，具体应用、容器和数据存储待补充。','将服务组织在一台虚拟机中便于统一维护；应用与数据的停止顺序仍需要在虚拟机内部安排。','该虚拟机停机会影响它承载的全部服务。'],
 proxy:['VM B / EGRESS','Clash 旁路由','承载主服务器所需的代理出站能力；实际采用网关转发还是应用代理，后续按配置核实。','把出站策略单独维护，减少网络配置与服务运行环境的耦合。','依赖这条链路的访问可能中断；不能据此推断所有服务都受影响。'],
 tunnel:['VM C / INGRESS','Cloudflare Tunnel','独立虚拟机承载隧道连接，将指定服务接入 Cloudflare 访问链路。','把对外入口的配置和服务宿主职责分别管理；身份验证与访问控制策略待补充。','隧道故障会影响经此入口访问的服务，不代表局域网服务本身停止。'],
 extra:['OTHER VMS / COLLAPSED','其他虚拟机','这里代表暂不展开的虚拟机。未提供清单，因此不虚构名称和部署成果。','概览只展示核心职责；详细资产清单可以后续补充。','具体依赖和故障范围待补充。'],
 visitor:['CLIENT / EXTERNAL','外部访问者','通过配置的公开入口访问指定服务，图示未描述完整鉴权策略。','分别阅读访问入口与服务部署，帮助明确网络边界。','入口访问失败需要逐段检查 DNS、Cloudflare、隧道和目标服务。'],
 cloud:['EDGE / CLOUDFLARE','Cloudflare','图中表示 Cloudflare 侧的访问入口，与虚拟机中的隧道连接器共同组成访问路径。','云侧入口与本地连接器分层展示。','可用性受云侧入口、网络及连接器状态共同影响。'],
 internet:['EXTERNAL / EGRESS','外部网络','此处为出站访问的概念终点；实际物理路由器、默认网关及转发规则尚待核实。','只画已知职责路径，避免把概念示意当作完整网络拓扑。','实际故障范围取决于服务是否依赖代理。'],
 ups:['PHYSICAL / POWER','APC UPS','为主机提供后备电源，同时通过 USB 将状态交给宿主机上的 NUT。','供电连接与 USB 状态通信是两种不同关系；关机控制放在宿主机。','已确认：正常读取 UPS 状态，以及断电自动关机实测。'],
 nut:['HOST / MONITOR','NUT · Debian','运行于 PVE 宿主机底层 Debian；监控 UPS 状态并在满足配置条件时触发关机。','核心停机控制不依赖某台业务虚拟机继续运行。最终阈值以当前有效配置为准。','电池时间必须覆盖完整停机过程；详细耗时记录待补充。'],
 pve:['HYPERVISOR / ORCHESTRATION','Proxmox VE','宿主机承载多个虚拟机，并在关机过程中管理虚拟机停止。','集中管理虚拟机生命周期；按依赖关系配置启动和关机顺序。','所有虚拟机共享物理主机，职责分离不等于物理高可用。'],
 guests:['GUESTS / SHUTDOWN','虚拟机与服务','PVE 进入关机流程后，虚拟机内部还需要正常停止服务与写入。','宿主机、虚拟机和应用各自承担一层停机责任。','用户已完成整体断电关机实测；逐机退出、数据完整性和耗时证据待补充。']
};
let current='compute',expanded=false;
const views={
 compute:{title:'从物理主机，深入系统内部。',label:'COMPUTE / DEPLOYMENT',note:'嵌套表示承载关系。服务分组为占位，尚未列出实际应用。'},
 inbound:{title:'从访问入口，追踪到本地服务。',label:'NETWORK / INBOUND',note:'箭头表示概念访问方向；隧道连接器实际由本地向 Cloudflare 发起连接。鉴权配置待补充。'},
 network:{title:'把服务运行与出站策略分开。',label:'NETWORK / EGRESS',note:'此图表示职责链路；代理方式、默认网关和物理路由器位置需按实际配置补充。'},
 power:{title:'从状态感知，到有序停机。',label:'POWER / SHUTDOWN',note:'实测结论由用户确认。图中为控制过程，非当前实时状态；阈值和耗时不作虚构。'}
};
function showDetail(id){const[kicker,title,role,reason,risk]=details[id];$('#detail').innerHTML=`<small>${kicker}</small><h3>${title}</h3><p>${role}</p><h4>设计考虑</h4><p>${reason}</p><h4>边界与故障影响</h4><p>${risk}</p>`;$$('[data-node]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.node===id)));}
const graphs={
 compute:{nodes:[['cloud',308,10,'Cloudflare','云侧入口'],['tunnel',308,120,'Tunnel VM','VM C · 入站连接器'],['main',90,235,'主服务器','VM A · 服务 / 数据'],['proxy',526,235,'Clash 旁路由','VM B · 出站策略'],['extra',308,292,'其他虚拟机 …','按需展开'],['internet',526,365,'外部网络','代理访问目标']],edges:[['M380 60V120',392,94,'入站访问'],['M308 145H162V235',204,178,'转发至服务'],['M234 260H526',380,248,'需要代理的出站访问'],['M598 285V365',610,327,'出站']],boundary:true},
 inbound:{nodes:[['visitor',52,175,'访问者','外部客户端'],['cloud',228,175,'Cloudflare','访问入口'],['tunnel',404,175,'Tunnel VM','本地连接器'],['main',580,175,'主服务器','指定服务']],edges:[['M196 200H228',212,185,''],['M372 200H404',388,185,''],['M548 200H580',564,185,'']]},
 network:{nodes:[['main',80,175,'主服务器','需要代理的访问'],['proxy',308,175,'Clash 旁路由','出站策略'],['internet',536,175,'外部网络','概念终点']],edges:[['M224 200H308',266,185,'代理访问'],['M452 200H536',494,185,'出站']]},
 power:{nodes:[['ups',90,85,'APC UPS','USB 状态通信'],['nut',526,85,'NUT · Debian','宿主机监控'],['pve',526,290,'Proxmox VE','宿主机关机'],['guests',90,290,'虚拟机与服务','按配置停止']],edges:[['M234 110H526',380,96,'UPS 状态'],['M598 135V290',610,218,'触发关机'],['M526 315H234',380,301,'管理停机']]}
};
function render(view){current=view;const data=views[view],graph=graphs[view];$('#architecture-title').textContent=data.title;$('#diagram-label').textContent=data.label;$('#diagram-note').textContent=(view==='compute'?'PVE 边框表示承载关系；流动线表示概念入站与代理出站路径，非实时流量。':data.note)+' 小屏可左右滑动图面。';$$('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
  const edges=graph.edges.map(([path,x,y,label],i)=>`<g class="edge"><path class="edge-base" d="${path}" marker-end="url(#arrow)"/><path class="edge-flow" d="${path}" style="animation-delay:${-i*.7}s"/><text class="edge-label" x="${x}" y="${y}" text-anchor="middle">${label}</text></g>`).join('');
  const boundary=graph.boundary?'<g class="host-boundary"><rect x="45" y="88" width="670" height="264" rx="12"/><text x="62" y="111">Proxmox VE</text><text class="host-caption" x="698" y="111" text-anchor="end">iMini / 虚拟化底座</text></g>':'';
  const nodes=graph.nodes.map(([id,x,y,title,sub])=>`<g class="flow-node" data-node="${id}" role="button" tabindex="0" aria-label="${title}，查看说明" aria-pressed="false" ${id==='extra'?`aria-expanded="${expanded}"`:''} transform="translate(${x} ${y})"><rect width="144" height="50" rx="7"/><circle cx="12" cy="15" r="2.5"/><text class="node-title" x="23" y="20">${id==='extra'&&expanded?'其他虚拟机 · 待补充':title}</text><text class="node-subtitle" x="12" y="38">${sub}</text></g>`).join('');
  $('#diagram').innerHTML=`<svg viewBox="0 0 760 430" role="group" aria-label="${data.label}，链路流动示意"><defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="7" refY="3" orient="auto"><path d="M0 0L7 3L0 6" fill="none" stroke="#698eab"/></marker></defs>${boundary}${edges}${nodes}</svg>`;
  $$('[data-node]').forEach(b=>{const activate=()=>{if(b.dataset.node==='extra'){expanded=!expanded;b.setAttribute('aria-expanded',String(expanded));b.querySelector('.node-title').textContent=expanded?'其他虚拟机 · 待补充':'其他虚拟机 …';}showDetail(b.dataset.node);};b.onclick=activate;b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}};});showDetail(view==='compute'?'main':graph.nodes[0][0]);
}
function route(scroll=true){const id=location.hash.slice(1);if(views[id]){render(id);pick(id==='inbound'?'compute':id);if(scroll)$('#workspace').scrollIntoView({behavior:'instant',block:'start'});}else if(id==='overview'&&scroll){$('#overview').scrollIntoView({behavior:'instant'});}}
$$('[data-view]').forEach(b=>b.onclick=()=>{if(location.hash==='#'+b.dataset.view)render(b.dataset.view);else location.hash=b.dataset.view;});
$('#explore').addEventListener('click',()=>{if(location.hash===$('#explore').getAttribute('href')){$('#workspace').scrollIntoView();$('#architecture-title').focus({preventScroll:true});}});
window.addEventListener('hashchange',()=>{route();if(views[location.hash.slice(1)])$('#architecture-title').focus({preventScroll:true});});
$('#back').addEventListener('click',()=>{requestAnimationFrame(()=>$$('[data-pick]').find(b=>b.getAttribute('aria-pressed')==='true')?.focus({preventScroll:true}));});
render('compute');route();
