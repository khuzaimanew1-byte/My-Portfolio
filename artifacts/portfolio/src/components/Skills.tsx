import {
  useState, useRef, useEffect, useCallback, type RefObject,
} from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  SiHtml5, SiJavascript, SiNodedotjs,
  SiExpress, SiMongodb, SiGit, SiOpenai, SiCss,
} from "react-icons/si";
import { FileCode2 } from "lucide-react";

/* ─── VS Code official icon ──────────────────────────────────── */
function VSCodeIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#007ACC"
      style={{ filter: active ? "drop-shadow(0 0 5px #007ACCcc)" : "none", transition: "filter .3s" }}>
      <path d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.9 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
    </svg>
  );
}

/* ─── easing helpers ─────────────────────────────────────────── */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - Math.min(1, t), 3);
const easeInQuad   = (t: number) => Math.min(1, t * t);

/* ─── node definitions ───────────────────────────────────────── */
interface NodeDef {
  id: string; name: string; color: string;
  x: number; y: number;           // % of container
  entryX: number; entryY: number; // px intro offset
  stagger: number;                // ms from inView
  floatY: [number, number]; dur: number;
  renderIcon: (active: boolean) => React.ReactNode;
}

const S = 26;

const nodes: NodeDef[] = [
  /* left zone */
  { id:"html",    name:"HTML",        color:"#E34F26",
    x:6,  y:49, entryX:-170, entryY:20,  stagger:0,    floatY:[-4,3],   dur:5.8,
    renderIcon:(a)=><SiHtml5    size={S} style={{color:"#E34F26",filter:a?"drop-shadow(0 0 6px #E34F26cc)":"none",transition:"filter .3s"}} /> },
  { id:"css",     name:"CSS3",        color:"#264DE4",
    x:22, y:10, entryX:-85,  entryY:-115,stagger:130,  floatY:[-3,5],   dur:6.3,
    renderIcon:(a)=><SiCss      size={S} style={{color:"#264DE4",filter:a?"drop-shadow(0 0 6px #264DE4cc)":"none",transition:"filter .3s"}} /> },
  { id:"ejs",     name:"EJS",         color:"#B9473A",
    x:26, y:78, entryX:-75,  entryY:120, stagger:220,  floatY:[-5,3],   dur:5.5,
    renderIcon:(a)=><FileCode2  size={S} style={{color:"#B9473A",filter:a?"drop-shadow(0 0 6px #B9473Acc)":"none",transition:"filter .3s"}} /> },
  /* central hub */
  { id:"js",      name:"JavaScript",  color:"#F0DB4F",
    x:43, y:51, entryX:0,    entryY:85,  stagger:380,  floatY:[-4,4],   dur:5.0,
    renderIcon:(a)=><SiJavascript size={S} style={{color:"#F0DB4F",filter:a?"drop-shadow(0 0 6px #F0DB4Fcc)":"none",transition:"filter .3s"}} /> },
  /* upper-right cluster */
  { id:"nodejs",  name:"Node.js",     color:"#3C873A",
    x:65, y:8,  entryX:25,   entryY:-135,stagger:490,  floatY:[-5,3],   dur:6.1,
    renderIcon:(a)=><SiNodedotjs size={S} style={{color:"#3C873A",filter:a?"drop-shadow(0 0 6px #3C873Acc)":"none",transition:"filter .3s"}} /> },
  /* lower-center */
  { id:"git",     name:"Git",         color:"#F05032",
    x:56, y:83, entryX:-15,  entryY:145, stagger:580,  floatY:[-3,6],   dur:6.5,
    renderIcon:(a)=><SiGit     size={S} style={{color:"#F05032",filter:a?"drop-shadow(0 0 6px #F05032cc)":"none",transition:"filter .3s"}} /> },
  /* right hub — pulled left to avoid crowding edge */
  { id:"express", name:"Express.js",  color:"#d8d8d8",
    x:72, y:43, entryX:145,  entryY:0,   stagger:730,  floatY:[-4,4],   dur:5.3,
    renderIcon:(a)=><SiExpress size={S} style={{color:"#d8d8d8",filter:a?"drop-shadow(0 0 6px #d8d8d8cc)":"none",transition:"filter .3s"}} /> },
  /* right endpoint spread */
  { id:"mongodb", name:"MongoDB",     color:"#47A248",
    x:88, y:13, entryX:115,  entryY:-105,stagger:840,  floatY:[-5,4],   dur:5.7,
    renderIcon:(a)=><SiMongodb size={S} style={{color:"#47A248",filter:a?"drop-shadow(0 0 6px #47A248cc)":"none",transition:"filter .3s"}} /> },
  { id:"vscode",  name:"VS Code",     color:"#007ACC",
    x:93, y:54, entryX:158,  entryY:0,   stagger:950,  floatY:[-3,5],   dur:6.2,
    renderIcon:(a)=><VSCodeIcon size={S} active={a} /> },
  { id:"ai",      name:"AI Dev",      color:"#10a37f",
    x:81, y:84, entryX:110,  entryY:115, stagger:1060, floatY:[-5,3],   dur:5.9,
    renderIcon:(a)=><SiOpenai  size={S} style={{color:"#10a37f",filter:a?"drop-shadow(0 0 6px #10a37fcc)":"none",transition:"filter .3s"}} /> },
];

/* ─── edges with asymmetric bezier bends ────────────────────── */
interface EdgeDef { a:string; b:string; b1:number; b2:number; }
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

const edgeRevealAt: Record<string,number> = {
  "html::css":210, "html::ejs":310, "css::js":470, "ejs::js":480,
  "js::nodejs":570, "js::git":670, "nodejs::express":820,
  "express::mongodb":930, "express::vscode":1040, "express::ai":1150,
};
const ek = (e:EdgeDef) => `${e.a}::${e.b}`;

const ICON_R    = 16;
const DRAW_IN   = 580; // ms — line draws in
const DRAW_OUT  = 220; // ms — line fades out
const PULSE_DUR = 880; // ms — pulse travel time

/* ─── bezier with asymmetric control points ──────────────────── */
function buildPath(
  ax:number, ay:number, bx:number, by:number,
  b1:number, b2:number
): string {
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

interface HoverState { id:string|null; phase:0|1|2|3|4 }

/* ══════════════════════════════════════════════════════════════ */
export function Skills() {
  const sectionRef    = useRef<HTMLElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, { once:true, amount:0.2 });

  /* stable refs */
  const nodeIconRefs = useRef<Record<string,{current:HTMLDivElement|null}>>(
    Object.fromEntries(nodes.map(n=>[n.id,{current:null}]))
  );
  const mainPathRefs = useRef<Record<string,SVGPathElement|null>>({});
  const glowPathRefs = useRef<Record<string,SVGPathElement|null>>({});
  const pulseRefs    = useRef<Record<string,HTMLDivElement|null>>({});
  const revealedRef  = useRef<Set<string>>(new Set());
  const ambientRef   = useRef<HTMLDivElement|null>(null);

  /* draw-timing refs (no React re-render needed) */
  const activatedAt   = useRef<Record<string,number|null>>({});
  const deactivatedAt = useRef<Record<string,number|null>>({});

  /* state */
  const [nodesVisible, setNodesVisible] = useState<boolean[]>(()=>nodes.map(()=>false));
  const [hover, setHover]               = useState<HoverState>({id:null,phase:0});
  const hoverRef      = useRef<HoverState>(hover);
  hoverRef.current    = hover;
  const hoverTimers   = useRef<ReturnType<typeof setTimeout>[]>([]);

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

  /* ── hover handlers ─── */
  const handleEnter = useCallback((id:string)=>{
    hoverTimers.current.forEach(clearTimeout);
    hoverTimers.current=[];
    setHover({id,phase:1});
    hoverTimers.current.push(setTimeout(()=>setHover({id,phase:2}),70));
    hoverTimers.current.push(setTimeout(()=>setHover({id,phase:3}),165));
    hoverTimers.current.push(setTimeout(()=>setHover({id,phase:4}),265));
  },[]);

  const handleLeave = useCallback(()=>{
    hoverTimers.current.forEach(clearTimeout);
    hoverTimers.current=[];
    setHover({id:null,phase:0});
  },[]);

  /* ── rAF: coords → imperative SVG + pulse updates ─── */
  useEffect(()=>{
    let raf:number;
    const loop=()=>{
      const container=containerRef.current;
      if (!container){raf=requestAnimationFrame(loop);return;}
      const cr=container.getBoundingClientRect();
      const now=performance.now();

      /* node pixel centers */
      const coords:Record<string,{x:number;y:number}> = {};
      for (const n of nodes){
        const el=nodeIconRefs.current[n.id]?.current;
        if (!el) continue;
        const r=el.getBoundingClientRect();
        coords[n.id]={x:r.left-cr.left+r.width/2, y:r.top-cr.top+r.height/2};
      }

      const {id:hovId,phase}=hoverRef.current;
      const activeNode=hovId?getNode(hovId):null;
      const lineColor=activeNode?.color??"#2dd4bf";

      /* ambient glow overlay */
      if (ambientRef.current){
        if (hovId && activeNode){
          const nc=coords[hovId];
          if (nc){
            const pct=(x:number,dim:number)=>`${((x/dim)*100).toFixed(1)}%`;
            const w=cr.width, h=cr.height;
            ambientRef.current.style.background=
              `radial-gradient(380px at ${pct(nc.x,w)} ${pct(nc.y,h)}, ${activeNode.color}0D, transparent 70%)`;
          }
        } else {
          ambientRef.current.style.background="transparent";
        }
      }

      for (const edge of edges){
        const key=ek(edge);
        const ca=coords[edge.a], cb=coords[edge.b];
        if (!ca||!cb) continue;
        const d=buildPath(ca.x,ca.y,cb.x,cb.y,edge.b1,edge.b2);

        const isIncoming=edge.b===hovId;
        const isOutgoing=edge.a===hovId;
        const edgeActive=hovId!==null&&(
          (isIncoming&&phase>=1)||(isOutgoing&&phase>=3)
        );
        const wasRevealed=revealedRef.current.has(key);

        /* track activation timing */
        if (edgeActive && activatedAt.current[key]==null){
          activatedAt.current[key]=now;
          deactivatedAt.current[key]=null;
        }
        if (!edgeActive && activatedAt.current[key]!=null && deactivatedAt.current[key]==null){
          deactivatedAt.current[key]=now;
          activatedAt.current[key]=null;
        }

        /* compute draw progress */
        let drawProg=0, fadeProg=1;
        if (edgeActive && activatedAt.current[key]!=null){
          drawProg=easeOutCubic((now-activatedAt.current[key]!)/DRAW_IN);
        }
        if (!edgeActive && deactivatedAt.current[key]!=null){
          fadeProg=1-easeInQuad((now-deactivatedAt.current[key]!)/DRAW_OUT);
          if (fadeProg<0){fadeProg=0;deactivatedAt.current[key]=null;}
        }

        /* main path */
        const main=mainPathRefs.current[key];
        if (main && d){
          main.setAttribute("d",d);
          main.setAttribute("pathLength","1");
          if (edgeActive){
            main.style.stroke=lineColor;
            main.style.strokeOpacity="1";
            main.style.strokeDasharray="1";
            main.style.strokeDashoffset=(1-drawProg).toFixed(4);
            main.style.strokeWidth="0.85";
          } else if (deactivatedAt.current[key]!=null || fadeProg<1){
            main.style.stroke=lineColor;
            main.style.strokeOpacity=fadeProg.toFixed(3);
            main.style.strokeDasharray="1";
            main.style.strokeDashoffset="0";
          } else if (wasRevealed){
            /* idle — nearly invisible ghost */
            main.style.stroke="rgba(255,255,255,0.032)";
            main.style.strokeOpacity="1";
            main.style.strokeDasharray="";
            main.style.strokeDashoffset="";
            main.style.strokeWidth="0.38";
          } else {
            main.style.stroke="transparent";
          }
        }

        /* glow path */
        const glow=glowPathRefs.current[key];
        if (glow && d){
          glow.setAttribute("d",d);
          glow.setAttribute("pathLength","1");
          if (edgeActive){
            glow.style.stroke=lineColor;
            glow.style.strokeOpacity="0.10";
            glow.style.strokeDasharray="1";
            glow.style.strokeDashoffset=(1-drawProg).toFixed(4);
            glow.style.strokeWidth="3.5";
          } else {
            glow.style.stroke="transparent";
          }
        }

        /* pulse */
        const pulse=pulseRefs.current[key];
        if (pulse && d){
          pulse.style.offsetPath=`path("${d}")`;
          if (edgeActive){
            pulse.style.opacity="1";
            pulse.style.background=lineColor;
            pulse.style.boxShadow=`0 0 5px 2px ${lineColor}60`;
            if (!pulse.style.animation||pulse.style.animation==="none"){
              pulse.style.animation=`pulse-travel ${PULSE_DUR}ms linear infinite`;
            }
          } else {
            pulse.style.opacity="0";
            pulse.style.animation="none";
          }
        }
      }

      raf=requestAnimationFrame(loop);
    };
    raf=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(raf);
  },[]);

  /* ── render ─── */
  return (
    <section ref={sectionRef} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background:"radial-gradient(ellipse 80% 60% at 50% 50%, transparent 34%, rgba(4,8,14,0.7) 100%)"
      }}/>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}}
          viewport={{once:true}} className="text-center max-w-2xl mx-auto mb-20"
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
          onMouseLeave={handleLeave}
        >
          {/* ambient glow — color shifts on hover */}
          <div ref={ambientRef}
            className="absolute inset-0 pointer-events-none"
            style={{transition:"background 0.7s ease", zIndex:0}}
          />

          {/* Layer 1 — SVG lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{overflow:"visible",zIndex:1}}>
            {edges.map(edge=>{
              const key=ek(edge);
              return(
                <g key={key}>
                  <path ref={el=>{glowPathRefs.current[key]=el;}}
                    fill="none" stroke="transparent" strokeWidth={0} strokeLinecap="round"/>
                  <path ref={el=>{mainPathRefs.current[key]=el;}}
                    fill="none" stroke="transparent" strokeWidth={0.38} strokeLinecap="round"/>
                </g>
              );
            })}
          </svg>

          {/* Layer 2 — CSS motion-path pulses */}
          <div className="absolute inset-0 pointer-events-none" style={{overflow:"hidden",zIndex:2}}>
            {edges.map(edge=>{
              const key=ek(edge);
              return(
                <div key={key} ref={el=>{pulseRefs.current[key]=el;}}
                  style={{
                    position:"absolute",top:0,left:0,
                    width:5,height:5,borderRadius:"50%",
                    background:"#2dd4bf",opacity:0,
                    offsetDistance:"0%",
                  }}
                />
              );
            })}
          </div>

          {/* Layer 3 — nodes */}
          {nodes.map((node,i)=>{
            const {id:hovId,phase}=hover;
            const isSelf      = hovId===node.id && phase>=2;
            const isConnected = (
              edges.some(e=>e.b===node.id&&e.a===hovId)||
              edges.some(e=>e.a===node.id&&e.b===hovId)
            ) && phase>=4;
            const isDimmed    = hovId!==null && !isSelf && !isConnected;
            const showTip     = hovId===node.id && phase>=4;

            return(
              <NodeCard
                key={node.id}
                node={node} index={i}
                visible={nodesVisible[i]}
                isSelf={isSelf} isConnected={isConnected}
                isDimmed={isDimmed} showTip={showTip}
                iconRef={nodeIconRefs.current[node.id] as RefObject<HTMLDivElement>}
                onEnter={()=>handleEnter(node.id)}
                onLeave={handleLeave}
              />
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse-travel{from{offset-distance:0%}to{offset-distance:100%}}
      `}</style>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   NODE CARD
══════════════════════════════════════════════════════════════════ */
function NodeCard({
  node,index,visible,isSelf,isConnected,isDimmed,showTip,iconRef,onEnter,onLeave,
}:{
  node:NodeDef;index:number;visible:boolean;
  isSelf:boolean;isConnected:boolean;isDimmed:boolean;showTip:boolean;
  iconRef:RefObject<HTMLDivElement>;onEnter:()=>void;onLeave:()=>void;
}){
  return(
    <div style={{
      position:"absolute",left:`${node.x}%`,top:`${node.y}%`,
      transform:"translate(-50%,-50%)",
      zIndex:isSelf?20:isConnected?15:10,
    }}>
      {/* entry spring + opacity dimming */}
      <motion.div
        initial={{opacity:0,scale:0.12,x:node.entryX,y:node.entryY}}
        animate={visible
          ?{opacity:isDimmed?0.1:1,scale:1,x:0,y:0}
          :{opacity:0,scale:0.12,x:node.entryX,y:node.entryY}}
        transition={{type:"spring",stiffness:120,damping:20,mass:1.4,
          opacity:{duration:0.3}}}
      >
        {/* continuous float — nodeIconRef lives here */}
        <motion.div
          ref={iconRef}
          animate={{y:node.floatY}}
          transition={{duration:node.dur,repeat:Infinity,repeatType:"mirror",
            ease:"easeInOut",delay:index*0.38}}
          className="flex flex-col items-center cursor-default"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {/* hover scale */}
          <motion.div
            animate={{scale:isSelf?1.3:isConnected?1.12:1}}
            transition={{type:"spring",stiffness:320,damping:22}}
          >
            {node.renderIcon(isSelf||isConnected)}
          </motion.div>

          {/* tooltip — NO labels, only name in tooltip */}
          <AnimatePresence>
            {showTip&&(
              <motion.div key="tip"
                initial={{opacity:0,y:-10,scale:0.84}}
                animate={{opacity:1,y:0,scale:1}}
                exit={{opacity:0,y:-6,scale:0.9}}
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
                  padding:"6px 14px",
                  backdropFilter:"blur(20px)",
                  boxShadow:`0 8px 32px rgba(0,0,0,0.7),0 0 0 1px ${node.color}15`,
                }}>
                  <p style={{
                    margin:0,fontSize:11,fontWeight:700,
                    color:node.color,fontFamily:"Inter,sans-serif",
                    letterSpacing:"0.04em",whiteSpace:"nowrap",
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
