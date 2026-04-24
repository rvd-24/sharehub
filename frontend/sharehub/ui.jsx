// UI primitives for ShareHub
const { useState: uS, useEffect: uE, useRef: uR, useCallback: uC } = React;

// Lucide icon helper using UMD
function Icon({ name, size = 18, className = '', strokeWidth = 2, fill = 'none' }) {
  const ref = uR(null);
  uE(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '';
      const svg = window.lucide.createElement(window.lucide.icons[name] || window.lucide.icons.Circle);
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.setAttribute('stroke-width', strokeWidth);
      if (fill !== 'none') {
        svg.setAttribute('fill', fill);
        svg.querySelectorAll('path, circle, rect, polygon, ellipse, polyline, line').forEach(el => {
          el.setAttribute('fill', fill);
        });
      }
      ref.current.appendChild(svg);
    }
  }, [name, size, strokeWidth, fill]);
  return <span ref={ref} className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }} />;
}

function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-0.5 font-bold text-lg tracking-tight select-none">
      <span className={light ? 'text-white' : 'text-indigo-deep'}>share</span>
      <span className="text-coral">hub</span>
      <span className={light ? 'text-white/50 text-sm font-normal ml-0.5' : 'text-slate-soft text-sm font-normal ml-0.5'}>.in</span>
      <span className="pulse-dot" />
    </div>
  );
}

function AnimatedNumberSH({ value, prefix = '', suffix = '', decimal = false, duration = 600 }) {
  const [disp, setDisp] = uS(value);
  const prev = uR(value);
  uE(() => {
    const from = prev.current, to = value;
    if (from === to) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisp(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const shown = decimal ? disp.toFixed(1) : Math.round(disp).toLocaleString('en-IN');
  return <span>{prefix}{shown}{suffix}</span>;
}

function CountOnView({ target, prefix = '', suffix = '', decimal = false, className = '' }) {
  const [v, setV] = uS(0);
  const [seen, setSeen] = uS(false);
  const ref = uR(null);
  uE(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !seen) { setSeen(true); setV(target); }
    }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [seen, target]);
  return <span ref={ref} className={className}><AnimatedNumberSH value={v} prefix={prefix} suffix={suffix} decimal={decimal} duration={1400} /></span>;
}

function Btn({ children, variant = 'primary', onClick, className = '', size = 'md', type = 'button', disabled }) {
  const sizes = {
    sm: 'px-3.5 py-2 text-[13px]',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };
  const v = {
    primary: 'bg-coral text-white hover:bg-coral-dark shadow-lg shadow-coral/25',
    dark: 'bg-indigo-deep text-white hover:bg-indigo-ink',
    white: 'bg-white text-indigo-deep hover:bg-cream',
    outline: 'bg-transparent border border-indigo-deep/20 text-indigo-deep hover:border-indigo-deep',
    outlineLight: 'bg-transparent border border-white/30 text-white hover:border-white hover:bg-white/5',
    ghost: 'bg-transparent text-indigo-deep hover:bg-black/5',
  }[variant];
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all active:scale-[0.98] ${sizes[size]} ${v} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

function Chip({ children, tone = 'default', className = '' }) {
  const tones = {
    default: 'bg-slate-line/40 text-indigo-deep',
    coral: 'bg-coral text-white',
    coralSoft: 'bg-coral-light text-coral-dark',
    dark: 'bg-indigo-deep text-white',
    white: 'bg-white/10 text-white border border-white/20',
    sage: 'bg-emerald-50 text-emerald-700',
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${tones[tone]} ${className}`}>{children}</span>;
}

function ConfettiSH({ fire }) {
  if (!fire) return null;
  const colors = ['#FF5A5F', '#1B1F3B', '#FFD93D', '#6BCB77', '#4D96FF', '#FFB8B8'];
  const pieces = Array.from({ length: 80 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 500,
    dur: 1800 + Math.random() * 1600, color: colors[i % colors.length],
    rot: Math.random() * 360, w: 6 + Math.random() * 8, h: 10 + Math.random() * 8,
    shape: Math.random() > 0.5 ? '2px' : '999px',
    drift: (Math.random() - 0.5) * 200,
  }));
  return (
    <div className="confetti-root">
      {pieces.map(p => (
        <span key={p.id} className="confetti" style={{
          left: `${p.left}%`, width: p.w, height: p.h, background: p.color,
          borderRadius: p.shape, animationDelay: `${p.delay}ms`, animationDuration: `${p.dur}ms`,
          transform: `translateX(${p.drift}px) rotate(${p.rot}deg)`,
        }} />
      ))}
    </div>
  );
}

Object.assign(window, { Icon, Logo, AnimatedNumberSH, CountOnView, Btn, Chip, ConfettiSH });
