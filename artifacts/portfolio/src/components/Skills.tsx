import {
  useState, useRef, useEffect, useCallback, type RefObject,
} from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  SiHtml5, SiJavascript, SiNodedotjs,
  SiExpress, SiMongodb, SiGit, SiOpenai, SiCss,
} from "react-icons/si";
import { FileCode2 } from "lucide-react";

/* ─── VS Code icon ───────────────────────────────────────────── */
function VSCodeIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#007ACC"
      style={{ filter: active ? "drop-shadow(0 0 6px #007ACCcc)" : "none", transition: "filter .35s" }}>
      <path d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.9 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
    </svg>
  );
}

/* ─── easing ─────────────────────────────────────────────────── */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const easeInQuad   = (t: number) => Math.min(1, Math.max(0, t)) ** 2;
const easeOutQuart = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 4);

/* ─── animation timing ───────────────────────────────────────── */
const INCOMING_DUR   = 460;  // ms — incoming lines travel toward hovered node
const BURST_DELAY    = 110;  // ms — pause after incoming before outgoing fires
const OUTGOING_DUR   = 520;  // ms — outgoing lines travel away from hovered node
const FADE_DUR       = 260;  // ms — fade out on leave
const IN_PULSE_PERIOD  = 620; // ms — incoming pulse loop period
const OUT_PULSE_PERIOD = 700; // ms — outgoing pulse loop period
const ICON_R           = 16; // px — icon radius (line trim)

/* ─── hover animation state (drives rAF loop) ───────────────── */
interface HoverAnim {
  id: string;
  startedAt: number;
  outgoingStartAt: number;   // startedAt + INCOMING_DUR + BURST_DELAY
  fadingAt: number | null;
  burstFired: boolean;
}

/* ─── node definitions ───────────────────────────────────────── */
interface NodeDef {
  id: string; name: string; color: string;
  x: number; y: number;
  entryX: number; entryY: number;
  stagger: number;
  floatY: [number, number]; dur: number;
  weight: number;
  renderIcon: (active: boolean) => React.ReactNode;
}

const S = 26;

const nodes: NodeDef[] = [
  { id:"html",    name:"HTML",        color:"#E34F26",
    x:6,  y:49, entryX:-170, entryY:20,  stagger:0,    floatY:[-4,3], dur:5.8, weight:1.0,
    renderIcon:(a)=><SiHtml5    size={S} style={{color:"#E34F26",filter:a?"drop-shadow(0 0 6px #E34F26cc)":"none",transition:"filter .35s"}} /> },
  { id:"css",     name:"CSS3",        color:"#264DE4",
    x:22, y:10, entryX:-85,  entryY:-115,stagger:130,  floatY:[-3,5], dur:6.3, weight:0.95,
    renderIcon:(a)=><SiCss      size={S} style={{color:"#264DE4",filter:a?"drop-shadow(0 0 6px #264DE4cc)":"none",transition:"filter .35s"}} /> },
  { id:"ejs",     name:"EJS",         color:"#B9473A",
    x:26, y:78, entryX:-75,  entryY:120, stagger:220,  floatY:[-5,3], dur:5.5, weight:0.85,
    renderIcon:(a)=><FileCode2  size={S} style={{color:"#B9473A",filter:a?"drop-shadow(0 0 6px #B9473Acc)":"none",transition:"filter .35s"}} /> },
  { id:"js",      name:"JavaScript",  color:"#F0DB4F",
    x:43, y:51, entryX:0,    entryY:85,  stagger:380,  floatY:[-4,4], dur:5.0, weight:0.50,
    renderIcon:(a)=><SiJavascript size={S} style={{color:"#F0DB4F",filter:a?"drop-shadow(0 0 6px #F0DB4Fcc)":"none",transition:"filter .35s"}} /> },
  { id:"nodejs",  name:"Node.js",     color:"#3C873A",
    x:65, y:8,  entryX:25,   entryY:-135,stagger:490,  floatY:[-5,3], dur:6.1, weight:0.62,
    renderIcon:(a)=><SiNodedotjs size={S} style={{color:"#3C873A",filter:a?"drop-shadow(0 0 6px #3C873Acc)":"none",transition:"filter .35s"}} /> },
  { id:"git",     name:"Git",         color:"#F05032",
    x:56, y:83, entryX:-15,  entryY:145, stagger:580,  floatY:[-3,6], dur:6.5, weight:0.80,
    renderIcon:(a)=><SiGit     size={S} style={{color:"#F05032",filter:a?"drop-shadow(0 0 6px #F05032cc)":"none",transition:"filter .35s"}} /> },
  { id:"express", name:"Express.js",  color:"#d8d8d8",
    x:72, y:43, entryX:145,  entryY:0,   stagger:730,  floatY:[-4,4], dur:5.3, weight:0.50,
    renderIcon:(a)=><SiExpress size={S} style={{color:"#d8d8d8",filter:a?"drop-shadow(0 0 6px #d8d8d8cc)":"none",transition:"filter .35s"}} /> },
  { id:"mongodb", name:"MongoDB",     color:"#47A248",
    x:88, y:13, entryX:115,  entryY:-105,stagger:840,  floatY:[-5,4], dur:5.7, weight:0.75,
    renderIcon:(a)=><SiMongodb size={S} style={{color:"#47A248",filter:a?"drop-shadow(0 0 6px #47A248cc)":"none",transition:"filter .35s"}} /> },
  { id:"vscode",  name:"VS Code",     color:"#007ACC",
    x:93, y:54, entryX:158,  entryY:0,   stagger:950,  floatY:[-3,5], dur:6.2, weight:0.82,
    renderIcon:(a)=><VSCodeIcon size={S} active={a} /> },
  { id:"ai",      name:"AI Dev",      color:"#10a37f",
    x:81, y:84, entryX:110,  entryY:115, stagger:1060, floatY:[-5,3], dur:5.9, weight:0.90,
    renderIcon:(a)=><SiOpenai  size={S} style={{color:"#10a37f",filter:a?"drop-shadow(0 0 6px #10a37fcc)":"none",transition:"filter .35s"}} /> },
];

/* ─── edges ──────────────────────────────────────────────────── */
interface EdgeDef { a: string; b: string; b1: number; b2: number; }
const edges: EdgeDef[] = [
  { a:"html",    b:"css",     b1: 0.20, b2: 0.09 },
  { a:"html",    b:"ejs",     b1:-0.10, b2:-0.20 },
  { a:"css",     b:"js",      b1: 0.07, b2: 0.18 },
  { a:"ejs",     b:"js",      b1:-0.18, b2:-0.07 },
  { a:"js",      b:"nodejs",  b1: 0.16, b2: 0.07 },
  { a:"js",      b:"git",     b1:-0.07, b2:-0.16 },
  { a:"nodejs",  b:"express", b1: 0.13, b2: 0.05 },
  { a:"express", b:"mongodb", b1: 0.08, b2: 0.18 },
  { a:"express", b:"vscode",  b1:-0.05, b2:-0.12 },
  { a:"express", b:"ai",      b1:-0.18, b2:-0.08 },
];

const edgeRevealAt: Record<string, number> = {
  "html::css":210, "html::ejs":310, "css::js":470, "ejs::js":480,
  "js::nodejs":570, "js::git":670, "nodejs::express":820,
  "express::mongodb":930, "express::vscode":1040, "express::ai":1150,
};
const ek = (e: EdgeDef) => `${e.a}::${e.b}`;

/* ─── build bezier path ──────────────────────────────────────── */
function buildPath(ax:number,ay:number,bx:number,by:number,b1:number,b2:number):string {
  const dx=bx-ax, dy=by-ay;
  const len=Math.sqrt(dx*dx+dy*dy)||1;
  if (len < ICON_R*2+4) return "";
  const nx=dx/len, ny=dy/len, px=-ny, py=nx;
  const sx=ax+nx*ICON_R, sy=ay+ny*ICON_R;
  const ex=bx-nx*ICON_R, ey=by-ny*ICON_R;
  const edL=len-ICON_R*2;
  const cp1x=sx+(ex-sx)*0.3+px*edL*b1, cp1y=sy+(ey-sy)*0.3+py*edL*b1;
  const cp2x=sx+(ex-sx)*0.7+px*edL*b2, cp2y=sy+(ey-sy)*0.7+py*edL*b2;
  const f=(n:number)=>n.toFixed(1);
  return `M${f(sx)},${f(sy)} C${f(cp1x)},${f(cp1y)} ${f(cp2x)},${f(cp2y)} ${f(ex)},${f(ey)}`;
}

function getNode(id:string){ return nodes.find(n=>n.id===id)!; }

const isEdgeConnected = (nodeId:string, otherId:string|null) => {
  if (!otherId) return false;
  return edges.some(e=>(e.a===nodeId&&e.b===otherId)||(e.b===nodeId&&e.a===otherId));
};

/* ─── physics ─────────────────────────────────────────────────── */
interface NodePhysics { sx:number; sy:number; vx:number; vy:number; }
const REPULSION_RADIUS = 140;
const SPRING_STIFFNESS = 145;
const SPRING_DAMPING   = 17;
const HOVER_STIFFNESS  = 260;
const HOVER_DAMPING    = 30;
const CONNECTED_RESIST = 0.55;
const HOVER_STABILITY  = 0.12;
const DT               = 1/60;

/* ─── node visual state (for React / Framer Motion) ─────────── */
interface NodeVisual {
  hovId: string | null;
  incomingSet: Set<string>;  // node IDs that send signal INTO hovered node
  outgoingSet: Set<string>;  // node IDs that receive signal FROM hovered node
  burst: boolean;
  settled: boolean;          // outgoing phase has started
}
const NV_IDLE: NodeVisual = {
  hovId: null, incomingSet: new Set(), outgoingSet: new Set(),
  burst: false, settled: false,
};

/* ══════════════════════════════════════════════════════════════ */
export function Skills() {
  const sectionRef    = useRef<HTMLElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, { once:true, amount:0.2 });

  /* node DOM refs */
  const nodeIconRefs  = useRef<Record<string,{current:HTMLDivElement|null}>>(
    Object.fromEntries(nodes.map(n=>[n.id,{current:null}]))
  );
  const nodeOuterRefs = useRef<Record<string,HTMLDivElement|null>>({});
  const burstRefs     = useRef<Record<string,HTMLDivElement|null>>({});

  /* SVG / pulse refs */
  const mainPathRefs = useRef<Record<string,SVGPathElement|null>>({});
  const glowPathRefs = useRef<Record<string,SVGPathElement|null>>({});
  const inPulseRefs  = useRef<Record<string,HTMLDivElement|null>>({});
  const outPulseRefs = useRef<Record<string,HTMLDivElement|null>>({});

  const revealedRef  = useRef<Set<string>>(new Set());
  const ambientRef   = useRef<HTMLDivElement|null>(null);

  /* animation state machine */
  const hoverAnimRef = useRef<HoverAnim|null>(null);

  /* mouse physics */
  const mouseRef   = useRef<{x:number;y:number}|null>(null);
  const physicsRef = useRef<Record<string,NodePhysics>>(
    Object.fromEntries(nodes.map(n=>[n.id,{sx:0,sy:0,vx:0,vy:0}]))
  );

  /* React state */
  const [nodesVisible, setNodesVisible] = useState<boolean[]>(()=>nodes.map(()=>false));
  const [nv, setNv] = useState<NodeVisual>(NV_IDLE);
  const nvRef = useRef<NodeVisual>(NV_IDLE);
  nvRef.current = nv;

  const hoverTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* ── section inView: stagger reveals ─── */
  useEffect(()=>{
    if (!sectionInView) return;
    const ts: ReturnType<typeof setTimeout>[] = [];
    nodes.forEach((n,i)=>ts.push(setTimeout(()=>{
      setNodesVisible(prev=>{const nx=[...prev];nx[i]=true;return nx;});
    },n.stagger)));
    edges.forEach(e=>ts.push(setTimeout(()=>{
      revealedRef.current.add(ek(e));
    },edgeRevealAt[ek(e)]??1200)));
    return ()=>ts.forEach(clearTimeout);
  },[sectionInView]);

  /* ── enter: begin sequential chain-reaction ─── */
  const handleEnter = useCallback((id:string)=>{
    hoverTimers.current.forEach(clearTimeout);
    hoverTimers.current=[];

    const nowMs = performance.now();
    const incomingNodes = new Set(edges.filter(e=>e.b===id).map(e=>e.a));
    const outgoingNodes = new Set(edges.filter(e=>e.a===id).map(e=>e.b));

    /* set rAF animation anchor */
    hoverAnimRef.current = {
      id,
      startedAt: nowMs,
      outgoingStartAt: nowMs + INCOMING_DUR + BURST_DELAY,
      fadingAt: null,
      burstFired: false,
    };

    /* phase 1 — immediately: hovered + incoming neighbors lit */
    setNv({ hovId:id, incomingSet:incomingNodes, outgoingSet:new Set(), burst:false, settled:false });

    /* phase 2 — burst moment */
    hoverTimers.current.push(setTimeout(()=>{
      if (hoverAnimRef.current?.id!==id) return;
      setNv(prev=>prev.hovId===id?{...prev,burst:true}:prev);
    }, INCOMING_DUR));

    /* phase 3 — outgoing propagation + tooltip */
    hoverTimers.current.push(setTimeout(()=>{
      if (hoverAnimRef.current?.id!==id) return;
      setNv(prev=>prev.hovId===id
        ?{...prev,burst:false,outgoingSet:outgoingNodes,settled:true}
        :prev);
    }, INCOMING_DUR + BURST_DELAY + 80));

  },[]);

  /* ── leave: fade everything out ─── */
  const handleLeave = useCallback(()=>{
    hoverTimers.current.forEach(clearTimeout);
    hoverTimers.current=[];

    if (hoverAnimRef.current) {
      hoverAnimRef.current.fadingAt = performance.now();
    }

    hoverTimers.current.push(setTimeout(()=>{
      hoverAnimRef.current=null;
      setNv(NV_IDLE);
    }, FADE_DUR+60));
  },[]);

  /* ── mouse tracking ─── */
  const handleMouseMove = useCallback((e:React.MouseEvent<HTMLDivElement>)=>{
    const cr=containerRef.current?.getBoundingClientRect();
    if (cr) mouseRef.current={x:e.clientX-cr.left, y:e.clientY-cr.top};
  },[]);

  const handleContainerLeave = useCallback(()=>{
    mouseRef.current=null;
    handleLeave();
  },[handleLeave]);

  /* ── main rAF loop ─── */
  useEffect(()=>{
    let raf:number;

    const loop=()=>{
      const container=containerRef.current;
      if (!container){raf=requestAnimationFrame(loop);return;}
      const cr=container.getBoundingClientRect();
      const now=performance.now();
      const anim=hoverAnimRef.current;

      /* ── physics ─── */
      const hovId=anim?.id??null;
      for (const n of nodes){
        const p=physicsRef.current[n.id];
        const outerEl=nodeOuterRefs.current[n.id];
        const naturalX=n.x/100*cr.width;
        const naturalY=n.y/100*cr.height;
        const cx=naturalX+p.sx, cy=naturalY+p.sy;
        let tx=0, ty=0;

        if (mouseRef.current){
          const {x:mx,y:my}=mouseRef.current;
          const ddx=cx-mx, ddy=cy-my;
          const dist=Math.sqrt(ddx*ddx+ddy*ddy);
          if (dist<REPULSION_RADIUS&&dist>1){
            const maxDisp=4+n.weight*10;
            const tf=1-dist/REPULSION_RADIUS;
            const force=tf*tf*maxDisp;
            const isHov=hovId===n.id;
            const hovF=isHov?HOVER_STABILITY:1.0;
            const connF=isEdgeConnected(n.id,hovId)?CONNECTED_RESIST:1.0;
            tx=(ddx/dist)*force*hovF*connF;
            ty=(ddy/dist)*force*hovF*connF;
          }
        }

        const isHov=hovId===n.id;
        const stiff=isHov?HOVER_STIFFNESS:SPRING_STIFFNESS;
        const damp=isHov?HOVER_DAMPING:SPRING_DAMPING;
        const ax=(tx-p.sx)*stiff*DT-p.vx*damp*DT;
        const ay=(ty-p.sy)*stiff*DT-p.vy*damp*DT;
        p.vx+=ax; p.vy+=ay; p.sx+=p.vx*DT; p.sy+=p.vy*DT;
        const maxAbs=16;
        p.sx=Math.max(-maxAbs,Math.min(maxAbs,p.sx));
        p.sy=Math.max(-maxAbs,Math.min(maxAbs,p.sy));
        if (outerEl){
          outerEl.style.transform=
            `translate(calc(-50% + ${p.sx.toFixed(2)}px), calc(-50% + ${p.sy.toFixed(2)}px))`;
        }
      }

      /* ── read displaced coords ─── */
      const coords:Record<string,{x:number;y:number}>={};
      for (const n of nodes){
        const el=nodeIconRefs.current[n.id]?.current;
        if (!el) continue;
        const r=el.getBoundingClientRect();
        coords[n.id]={x:r.left-cr.left+r.width/2, y:r.top-cr.top+r.height/2};
      }

      /* ── ambient glow ─── */
      if (ambientRef.current){
        if (anim&&!anim.fadingAt){
          const nc=coords[anim.id];
          if (nc){
            const activeNode=getNode(anim.id);
            const pct=(x:number,d:number)=>`${((x/d)*100).toFixed(1)}%`;
            ambientRef.current.style.background=
              `radial-gradient(360px at ${pct(nc.x,cr.width)} ${pct(nc.y,cr.height)}, ${activeNode.color}11, transparent 70%)`;
          }
        } else {
          ambientRef.current.style.background="transparent";
        }
      }

      /* ── energy burst at hovered node ─── */
      if (anim&&!anim.burstFired&&now>=anim.startedAt+INCOMING_DUR){
        anim.burstFired=true;
        const burstEl=burstRefs.current[anim.id];
        if (burstEl){
          burstEl.style.animation="none";
          void burstEl.offsetWidth; // force reflow
          burstEl.style.animation="node-burst 420ms cubic-bezier(0.22,1,0.36,1) forwards";
        }
      }

      /* ── per-edge: lines + pulses ─── */
      for (const edge of edges){
        const key=ek(edge);
        const ca=coords[edge.a], cb=coords[edge.b];
        if (!ca||!cb) continue;
        const d=buildPath(ca.x,ca.y,cb.x,cb.y,edge.b1,edge.b2);
        if (!d) continue;

        const wasRevealed=revealedRef.current.has(key);
        const main=mainPathRefs.current[key];
        const glow=glowPathRefs.current[key];
        const inPulse=inPulseRefs.current[key];
        const outPulse=outPulseRefs.current[key];

        /* update path geometry */
        if (main){ main.setAttribute("d",d); main.setAttribute("pathLength","1"); }
        if (glow){ glow.setAttribute("d",d); glow.setAttribute("pathLength","1"); }
        if (inPulse)  inPulse.style.offsetPath=`path("${d}")`;
        if (outPulse) outPulse.style.offsetPath=`path("${d}")`;

        /* no active hover → ghost or invisible */
        if (!anim){
          if (main){
            if (wasRevealed){
              main.style.stroke="rgba(255,255,255,0.032)";
              main.style.strokeOpacity="1";
              main.style.strokeDasharray="";
              main.style.strokeDashoffset="";
              main.style.strokeWidth="0.38";
            } else { main.style.stroke="transparent"; }
          }
          if (glow) glow.style.stroke="transparent";
          if (inPulse)  { inPulse.style.opacity="0";  inPulse.style.animation="none"; }
          if (outPulse) { outPulse.style.opacity="0"; outPulse.style.animation="none"; }
          continue;
        }

        const isIncoming = edge.b===anim.id;
        const isOutgoing = edge.a===anim.id;
        const lineColor  = getNode(anim.id).color;

        /* fading out */
        if (anim.fadingAt!==null){
          const fadeT=(now-anim.fadingAt)/FADE_DUR;
          const alpha=Math.max(0,1-easeInQuad(fadeT));
          if (main&&(isIncoming||isOutgoing)){
            main.style.stroke=lineColor;
            main.style.strokeOpacity=(alpha*0.92).toFixed(3);
            main.style.strokeDasharray="";
            main.style.strokeDashoffset="";
            main.style.strokeWidth="0.85";
          } else if (main&&wasRevealed){
            main.style.stroke=`rgba(255,255,255,${(0.032*alpha).toFixed(4)})`;
            main.style.strokeOpacity="1";
            main.style.strokeDasharray="";
            main.style.strokeDashoffset="";
            main.style.strokeWidth="0.38";
          } else if (main){ main.style.stroke="transparent"; }
          if (glow) glow.style.stroke="transparent";
          if (inPulse)  { inPulse.style.opacity="0";  inPulse.style.animation="none"; }
          if (outPulse) { outPulse.style.opacity="0"; outPulse.style.animation="none"; }
          continue;
        }

        /* ── INCOMING edge: draws from source → hovered node ─── */
        if (isIncoming){
          const t=(now-anim.startedAt)/INCOMING_DUR;
          const drawProg=easeOutQuart(t);

          if (main){
            main.style.stroke=lineColor;
            main.style.strokeOpacity="0.92";
            main.style.strokeDasharray="1";
            main.style.strokeDashoffset=(Math.max(0,1-drawProg)).toFixed(4);
            main.style.strokeWidth="0.9";
          }
          if (glow){
            glow.style.stroke=lineColor;
            glow.style.strokeOpacity="0.12";
            glow.style.strokeDasharray="1";
            glow.style.strokeDashoffset=(Math.max(0,1-drawProg)).toFixed(4);
            glow.style.strokeWidth="4";
          }

          /* incoming pulse: travels A→B (toward hovered node) */
          if (inPulse){
            inPulse.style.opacity=Math.min(1,t*3).toFixed(3);
            inPulse.style.background=lineColor;
            inPulse.style.boxShadow=`0 0 6px 3px ${lineColor}55`;
            if (!inPulse.dataset.running){
              inPulse.dataset.running="1";
              inPulse.style.animation=`none`;
              void inPulse.offsetWidth;
              inPulse.style.animation=`pulse-travel ${IN_PULSE_PERIOD}ms linear infinite`;
            }
          }
          if (outPulse){ outPulse.style.opacity="0"; outPulse.style.animation="none"; delete outPulse.dataset.running; }
          continue;
        }

        /* ── OUTGOING edge: draws from hovered node → destination ─── */
        if (isOutgoing){
          const outStarted = now>=anim.outgoingStartAt;
          const t = outStarted ? (now-anim.outgoingStartAt)/OUTGOING_DUR : 0;
          const drawProg = outStarted ? easeOutCubic(t) : 0;

          if (main){
            if (outStarted){
              main.style.stroke=lineColor;
              main.style.strokeOpacity="0.88";
              main.style.strokeDasharray="1";
              main.style.strokeDashoffset=(Math.max(0,1-drawProg)).toFixed(4);
              main.style.strokeWidth="0.85";
            } else {
              /* hold ghost while waiting */
              if (wasRevealed){
                main.style.stroke="rgba(255,255,255,0.032)";
                main.style.strokeOpacity="1";
                main.style.strokeDasharray="";
                main.style.strokeDashoffset="";
                main.style.strokeWidth="0.38";
              } else { main.style.stroke="transparent"; }
            }
          }
          if (glow){
            if (outStarted){
              glow.style.stroke=lineColor;
              glow.style.strokeOpacity="0.10";
              glow.style.strokeDasharray="1";
              glow.style.strokeDashoffset=(Math.max(0,1-drawProg)).toFixed(4);
              glow.style.strokeWidth="3.5";
            } else { glow.style.stroke="transparent"; }
          }

          /* outgoing pulse: travels hovered→B, only after outgoing starts */
          if (outPulse){
            if (outStarted){
              outPulse.style.opacity=Math.min(1,(t)*4).toFixed(3);
              outPulse.style.background=lineColor;
              outPulse.style.boxShadow=`0 0 6px 3px ${lineColor}55`;
              if (!outPulse.dataset.running){
                outPulse.dataset.running="1";
                outPulse.style.animation="none";
                void outPulse.offsetWidth;
                outPulse.style.animation=`pulse-travel ${OUT_PULSE_PERIOD}ms linear infinite`;
              }
            } else {
              outPulse.style.opacity="0";
              outPulse.style.animation="none";
              delete outPulse.dataset.running;
            }
          }
          if (inPulse){ inPulse.style.opacity="0"; inPulse.style.animation="none"; delete inPulse.dataset.running; }
          continue;
        }

        /* ── unrelated edge — ghost ─── */
        if (main){
          if (wasRevealed){
            main.style.stroke="rgba(255,255,255,0.018)";
            main.style.strokeOpacity="1";
            main.style.strokeDasharray="";
            main.style.strokeDashoffset="";
            main.style.strokeWidth="0.38";
          } else { main.style.stroke="transparent"; }
        }
        if (glow) glow.style.stroke="transparent";
        if (inPulse)  { inPulse.style.opacity="0";  inPulse.style.animation="none"; delete inPulse.dataset.running; }
        if (outPulse) { outPulse.style.opacity="0"; outPulse.style.animation="none"; delete outPulse.dataset.running; }
      }

      raf=requestAnimationFrame(loop);
    };

    raf=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(raf);
  },[]);

  /* ── render ─── */
  return (
    <section ref={sectionRef} className="py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background:"radial-gradient(ellipse 80% 60% at 50% 50%, transparent 34%, rgba(4,8,14,0.7) 100%)"
      }}/>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}}
          viewport={{once:true}} className="text-center max-w-2xl mx-auto mb-10 lg:mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Technical Arsenal
          </h2>
          <p className="text-muted-foreground text-lg">
            The tools and technologies powering every system I build.
          </p>
        </motion.div>

        {/* network stage */}
        <div ref={containerRef}
          className="relative max-w-5xl mx-auto select-none"
          style={{paddingBottom:"52%"}}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleContainerLeave}
        >
          {/* ambient glow */}
          <div ref={ambientRef}
            className="absolute inset-0 pointer-events-none"
            style={{transition:"background 0.6s ease", zIndex:0}}
          />

          {/* Layer 1 — SVG lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none"
            style={{overflow:"visible",zIndex:1}}>
            {edges.map(edge=>{
              const key=ek(edge);
              return(
                <g key={key}>
                  <path ref={el=>{glowPathRefs.current[key]=el;}}
                    fill="none" stroke="transparent" strokeLinecap="round"/>
                  <path ref={el=>{mainPathRefs.current[key]=el;}}
                    fill="none" stroke="transparent" strokeWidth={0.38} strokeLinecap="round"/>
                </g>
              );
            })}
          </svg>

          {/* Layer 2 — directional pulses (two per edge: in + out) */}
          <div className="absolute inset-0 pointer-events-none" style={{overflow:"visible",zIndex:2}}>
            {edges.map(edge=>{
              const key=ek(edge);
              return(
                <div key={key}>
                  {/* incoming pulse: travels A → hovered */}
                  <div ref={el=>{inPulseRefs.current[key]=el;}}
                    style={{
                      position:"absolute",top:0,left:0,
                      width:5,height:5,borderRadius:"50%",
                      opacity:0, offsetDistance:"0%",
                    }}
                  />
                  {/* outgoing pulse: travels hovered → B */}
                  <div ref={el=>{outPulseRefs.current[key]=el;}}
                    style={{
                      position:"absolute",top:0,left:0,
                      width:5,height:5,borderRadius:"50%",
                      opacity:0, offsetDistance:"0%",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Layer 3 — nodes */}
          {nodes.map((node,i)=>{
            const isSelf        = nv.hovId===node.id;
            const isIncomingConn= nv.incomingSet.has(node.id);
            const isOutgoingConn= nv.outgoingSet.has(node.id);
            const isConnected   = isIncomingConn||isOutgoingConn;
            const isDimmed      = nv.hovId!==null&&!isSelf&&!isConnected;
            const showTip       = isSelf&&nv.settled;
            const inBurst       = isSelf&&nv.burst;

            return(
              <NodeCard
                key={node.id}
                node={node} index={i}
                visible={nodesVisible[i]}
                isSelf={isSelf} isConnected={isConnected}
                inBurst={inBurst}
                isDimmed={isDimmed} showTip={showTip}
                iconRef={nodeIconRefs.current[node.id] as RefObject<HTMLDivElement>}
                outerRef={(el)=>{ nodeOuterRefs.current[node.id]=el; }}
                burstRef={(el)=>{ burstRefs.current[node.id]=el; }}
                onEnter={()=>handleEnter(node.id)}
                onLeave={handleLeave}
              />
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse-travel { from { offset-distance:0% } to { offset-distance:100% } }
        @keyframes node-burst {
          0%   { transform:scale(0.7);  opacity:0.85; }
          60%  { transform:scale(2.2);  opacity:0.45; }
          100% { transform:scale(3.0);  opacity:0; }
        }
        @keyframes burst-ring {
          0%   { transform:scale(1);   opacity:0.8; }
          100% { transform:scale(2.6); opacity:0; }
        }
      `}</style>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   NODE CARD
══════════════════════════════════════════════════════════════════ */
function NodeCard({
  node,index,visible,isSelf,isConnected,inBurst,isDimmed,showTip,
  iconRef,outerRef,burstRef,onEnter,onLeave,
}:{
  node:NodeDef; index:number; visible:boolean;
  isSelf:boolean; isConnected:boolean; inBurst:boolean;
  isDimmed:boolean; showTip:boolean;
  iconRef:RefObject<HTMLDivElement>;
  outerRef:(el:HTMLDivElement|null)=>void;
  burstRef:(el:HTMLDivElement|null)=>void;
  onEnter:()=>void; onLeave:()=>void;
}){
  return(
    <div
      ref={outerRef}
      style={{
        position:"absolute",left:`${node.x}%`,top:`${node.y}%`,
        transform:"translate(-50%,-50%)",
        zIndex:isSelf?20:isConnected?15:10,
        willChange:"transform",
      }}
    >
      <motion.div
        initial={{opacity:0,scale:0.12,x:node.entryX,y:node.entryY}}
        animate={visible
          ?{opacity:isDimmed?0.18:1,scale:1,x:0,y:0}
          :{opacity:0,scale:0.12,x:node.entryX,y:node.entryY}}
        transition={{type:"spring",stiffness:120,damping:20,mass:1.4,
          opacity:{duration:0.3}}}
      >
        {/* float animation */}
        <motion.div
          ref={iconRef}
          animate={{y:node.floatY}}
          transition={{duration:node.dur,repeat:Infinity,repeatType:"mirror",
            ease:"easeInOut",delay:index*0.38}}
          className="flex flex-col items-center cursor-default relative"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {/* energy burst ring — fires imperatively via burstRef */}
          <div
            ref={burstRef}
            style={{
              position:"absolute",
              inset:"-10px",
              borderRadius:"50%",
              border:`1.5px solid ${node.color}`,
              opacity:0,
              pointerEvents:"none",
              zIndex:30,
            }}
          />

          {/* icon scale */}
          <motion.div
            animate={{
              scale: inBurst ? 1.45 : isSelf ? 1.28 : isConnected ? 1.12 : 1,
              filter: inBurst
                ? `drop-shadow(0 0 12px ${node.color}dd) drop-shadow(0 0 24px ${node.color}66)`
                : "none",
            }}
            transition={{
              type:"spring",
              stiffness: inBurst ? 500 : 320,
              damping:   inBurst ? 14  : 22,
            }}
          >
            {node.renderIcon(isSelf||isConnected||inBurst)}
          </motion.div>

          {/* tooltip — appears after outgoing propagation starts */}
          <AnimatePresence>
            {showTip&&(
              <motion.div key="tip"
                initial={{opacity:0,y:-8,scale:0.88}}
                animate={{opacity:1,y:0,scale:1}}
                exit={{opacity:0,y:-6,scale:0.92}}
                transition={{type:"spring",stiffness:480,damping:34}}
                style={{
                  position:"absolute",
                  bottom:"calc(100% + 12px)",
                  left:"50%",x:"-50%",
                  pointerEvents:"none",zIndex:50,
                  whiteSpace:"nowrap",
                }}
              >
                <div style={{
                  background:"rgba(5,8,13,0.97)",
                  border:`1px solid ${node.color}45`,
                  borderRadius:8,
                  padding:"5px 12px",
                  backdropFilter:"blur(20px)",
                  boxShadow:`0 8px 32px rgba(0,0,0,0.7),0 0 0 1px ${node.color}15`,
                }}>
                  <p style={{
                    margin:0,fontSize:11,fontWeight:700,
                    color:node.color,fontFamily:"Inter,sans-serif",
                    letterSpacing:"0.04em",
                  }}>
                    {node.name}
                  </p>
                </div>
                <div style={{
                  position:"absolute",top:"100%",left:"50%",
                  transform:"translateX(-50%)",width:0,height:0,
                  borderLeft:"4px solid transparent",
                  borderRight:"4px solid transparent",
                  borderTop:`4px solid ${node.color}45`,
                }}/>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
