const { useState, useEffect, useRef } = React;

const POSITIONS = ['ARQUERO', 'DEFENSOR', 'MEDIO', 'DELANTERO'];
const UNAVAILABLE_REASONS = ['TRABAJO', 'VIAJE', 'LESIÓN', 'SUSPENDIDO', 'OTRO'];
const TIME_OPTIONS = [0, 25, 50, 75, 100];

const initialPlayers = [
  {id:1,name:'CUTER ALEJANDRO',position:'ARQUERO'},
  {id:2,name:'ALLENDES MAURO',position:'DEFENSOR'},
  {id:3,name:'CABRERA CRISTIAN',position:'DEFENSOR'},
  {id:4,name:'PELLIN PABLO',position:'DEFENSOR'},
  {id:5,name:'SALVI TOMAS',position:'DEFENSOR'},
  {id:6,name:'TARDINO SEBASTIAN',position:'DEFENSOR'},
  {id:7,name:'FERNANDEZ PABLO',position:'MEDIO'},
  {id:8,name:'GIAROLA MARCOS',position:'MEDIO'},
  {id:9,name:'GIMENEZ FERNANDO',position:'MEDIO'},
  {id:10,name:'LEDEZMA EMILIANO',position:'MEDIO'},
  {id:11,name:'MENGO LUCAS',position:'MEDIO'},
  {id:12,name:'PICCALUGA MAYCO',position:'MEDIO'},
  {id:13,name:'TANTUCCI RONALD',position:'MEDIO'},
  {id:14,name:'VELAZQUEZ DAVID',position:'MEDIO'},
  {id:15,name:'CARRANZA NICOLAS',position:'DELANTERO'},
  {id:16,name:'FERREYRA MARTIN',position:'DELANTERO'},
  {id:17,name:'MONTORO CLAUDIO',position:'DELANTERO'},
  {id:18,name:'SPECIA IGNACIO',position:'DELANTERO'},
  {id:19,name:'MARTINEZ VICTOR',position:'MEDIO'},
  {id:20,name:'MONZON FERNANDO',position:'MEDIO'},
  {id:21,name:'AMAYA JESUS',position:'MEDIO'},
  {id:22,name:'AIMARETTI ALEJANDRO',position:'DEFENSOR'},
  {id:23,name:'ALVAREZ DANIEL',position:'MEDIO'},
  {id:24,name:'BRITEZ MATIAS',position:'ARQUERO'},
  {id:25,name:'MOLINA MAURICIO',position:'DEFENSOR'}
];

const storage = {
  get(key) { try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : null; } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
};

const drawLogo = (ctx, x, y, size) => {
  const s = size / 200;
  ctx.save();
  ctx.translate(x - size/2, y - size/2);
  ctx.scale(s, s);
  
  ctx.fillStyle = '#2d5a27';
  [[30,100,8,20,-0.3],[38,70,7,18,-0.5],[50,45,6,15,-0.7],[25,130,8,18,-0.2],[30,155,7,15,0],
   [170,100,8,20,0.3],[162,70,7,18,0.5],[150,45,6,15,0.7],[175,130,8,18,0.2],[170,155,7,15,0]].forEach(([cx,cy,rx,ry,r]) => {
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, r, 0, Math.PI * 2); ctx.fill();
  });
  
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath(); ctx.moveTo(100, 15); ctx.lineTo(160, 40); ctx.lineTo(160, 120);
  ctx.quadraticCurveTo(160, 170, 100, 190); ctx.quadraticCurveTo(40, 170, 40, 120);
  ctx.lineTo(40, 40); ctx.closePath(); ctx.fill();
  
  const grd = ctx.createLinearGradient(50, 30, 150, 180);
  grd.addColorStop(0, '#ffd700'); grd.addColorStop(0.5, '#f7ca18'); grd.addColorStop(1, '#e0a500');
  ctx.fillStyle = grd;
  ctx.beginPath(); ctx.moveTo(100, 25); ctx.lineTo(150, 47); ctx.lineTo(150, 115);
  ctx.quadraticCurveTo(150, 158, 100, 175); ctx.quadraticCurveTo(50, 158, 50, 115);
  ctx.lineTo(50, 47); ctx.closePath(); ctx.fill();
  
  ctx.fillStyle = '#ffd700';
  ctx.beginPath(); ctx.moveTo(70, 28); ctx.lineTo(75, 10); ctx.lineTo(85, 22); ctx.lineTo(100, 5);
  ctx.lineTo(115, 22); ctx.lineTo(125, 10); ctx.lineTo(130, 28); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1a1a2e';
  [[80,18,3],[100,12,3],[120,18,3]].forEach(([cx,cy,r]) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); });
  
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(100, 90, 35, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a1a2e';
  [[100,55,110,70,105,85,95,85,90,70],[65,85,80,80,85,95,75,105,65,98],[135,85,120,80,115,95,125,105,135,98],
   [75,115,90,105,100,115,95,125,80,125],[125,115,110,105,100,115,105,125,120,125]].forEach(pts => {
    ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
    for(let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i+1]);
    ctx.closePath(); ctx.fill();
  });
  
  [[60,85,6],[140,85,6]].forEach(([cx,cy,r]) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) { const a = (i * 4 * Math.PI) / 5 - Math.PI / 2; i === 0 ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a)) : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); }
    ctx.closePath(); ctx.fill();
  });
  
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath(); ctx.moveTo(35, 138); ctx.quadraticCurveTo(100, 125, 165, 138);
  ctx.lineTo(165, 155); ctx.quadraticCurveTo(100, 142, 35, 155); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffd700'; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center'; ctx.fillText('RESPETEN RANGOS', 100, 150);
  ctx.fillStyle = '#1a1a2e'; ctx.font = 'bold 16px Arial'; ctx.fillText('FC', 100, 172);
  ctx.restore();
};

const LogoCanvas = ({ size = 120 }) => {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) { const ctx = ref.current.getContext('2d'); ctx.clearRect(0, 0, size, size); drawLogo(ctx, size/2, size/2, size); } }, [size]);
  return React.createElement('canvas', { ref, width: size, height: size, className: 'drop-shadow-2xl' });
};

const TextInput = ({ label, defaultValue, onSave, placeholder, type = 'text' }) => {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.value = defaultValue || ''; }, [defaultValue]);
  return React.createElement('div', { className: 'space-y-2' },
    label && React.createElement('label', { className: 'block text-sm font-medium text-yellow-400/80' }, label),
    React.createElement('input', { ref, type, defaultValue, placeholder, onBlur: e => onSave?.(e.target.value),
      className: 'w-full bg-gray-800 border-2 border-gray-600 rounded-xl px-4 py-3 text-white text-base focus:border-yellow-500 focus:outline-none placeholder-gray-500' })
  );
};

const SelectInput = ({ label, value, onChange, options }) => React.createElement('div', { className: 'space-y-2' },
  label && React.createElement('label', { className: 'block text-sm font-medium text-yellow-400/80' }, label),
  React.createElement('select', { value, onChange: e => onChange(e.target.value), className: 'w-full bg-gray-800 border-2 border-gray-600 rounded-xl px-4 py-3 text-white text-base focus:border-yellow-500 focus:outline-none' },
    options.map(o => React.createElement('option', { key: o.value, value: o.value }, o.label))
  )
);

const Card = ({ children, onClick, className = '' }) => React.createElement('div', { onClick, className: `bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl ${onClick ? 'active:scale-[0.98] cursor-pointer' : ''} ${className}` }, children);

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '' }) => {
  const v = { primary: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold', secondary: 'bg-gray-700 text-white border border-gray-600', danger: 'bg-red-500/20 text-red-400 border border-red-500/40', success: 'bg-green-500/20 text-green-400 border border-green-500/40' };
  const s = { sm: 'px-3 py-2 text-sm', md: 'px-5 py-3', lg: 'px-6 py-4 text-lg' };
  return React.createElement('button', { onClick, className: `rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${v[variant]} ${s[size]} ${className}` }, children);
};

const Header = ({ title, onBack, action }) => React.createElement('div', { className: 'sticky top-0 z-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-yellow-500/30 px-4 py-3 flex items-center justify-between' },
  React.createElement('div', { className: 'flex items-center gap-3 min-w-0 flex-1' },
    onBack && React.createElement('button', { onClick: onBack, className: 'p-2 -ml-2 text-yellow-400' }, '←'),
    React.createElement('h1', { className: 'text-lg font-bold text-white truncate' }, title)
  ), action
);

function App() {
  const [players, setPlayers] = useState(() => storage.get('rrfc_players') || initialPlayers);
  const [championships, setChampionships] = useState(() => storage.get('rrfc_championships') || []);
  const [view, setView] = useState('home');
  const [selectedChamp, setSelectedChamp] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showForm, setShowForm] = useState(null);
  const formRef = useRef({});

  useEffect(() => { storage.set('rrfc_players', players); }, [players]);
  useEffect(() => { storage.set('rrfc_championships', championships); }, [championships]);
  useEffect(() => {
    if (selectedChamp) {
      const u = championships.find(c => c.id === selectedChamp.id);
      if (u) { setSelectedChamp(u); if (selectedMatch) { const um = u.matches.find(m => m.id === selectedMatch.id); if (um) setSelectedMatch(um); } }
    }
  }, [championships]);

  const addPlayer = () => { const n = formRef.current.playerName?.trim().toUpperCase(), p = formRef.current.playerPosition || 'MEDIO'; if (!n) return alert('Ingresá el nombre'); const pl = { id: Date.now(), name: n, position: p }; setPlayers(ps => [...ps, pl]); setChampionships(c => c.map(ch => ({ ...ch, matches: ch.matches.map(m => ({ ...m, players: [...m.players, { ...pl, available: true, unavailableReason: '', starter: false, timePlayed: 0, paid: false, paymentMethod: 'ETF' }] })) }))); formRef.current = {}; setShowForm(null); };
  const updatePlayer = () => { if (!editingPlayer) return; const n = formRef.current.editPlayerName?.trim().toUpperCase() || editingPlayer.name, p = formRef.current.editPlayerPosition || editingPlayer.position; setPlayers(ps => ps.map(pl => pl.id === editingPlayer.id ? { ...pl, name: n, position: p } : pl)); setChampionships(c => c.map(ch => ({ ...ch, matches: ch.matches.map(m => ({ ...m, players: m.players.map(mp => mp.id === editingPlayer.id ? { ...mp, name: n, position: p } : mp) })) }))); formRef.current = {}; setEditingPlayer(null); };
  const deletePlayer = id => { if (confirm('¿Eliminar jugador?')) { setPlayers(p => p.filter(pl => pl.id !== id)); setChampionships(c => c.map(ch => ({ ...ch, matches: ch.matches.map(m => ({ ...m, players: m.players.filter(p => p.id !== id) })) }))); } };
  const createChampionship = () => { const n = formRef.current.champName?.trim(); if (!n) return alert('Ingresá el nombre'); setChampionships(c => [...c, { id: Date.now(), name: n, matches: [] }]); formRef.current = {}; setShowForm(null); };
  const deleteChampionship = id => { if (confirm('¿Eliminar campeonato?')) { setChampionships(c => c.filter(ch => ch.id !== id)); if (selectedChamp?.id === id) setSelectedChamp(null); } };
  const createMatch = () => { const f = formRef.current; if (!f.matchRival?.trim()) return alert('Ingresá el rival'); const m = { id: Date.now(), rival: f.matchRival.trim().toUpperCase(), date: f.matchDate || '', time: f.matchTime || '15:30', matchday: parseInt(f.matchDay) || 1, field: f.matchField || '', cost: parseFloat(f.matchCost) || 130000, players: players.map(p => ({ ...p, available: true, unavailableReason: '', starter: false, timePlayed: 0, paid: false, paymentMethod: 'ETF' })) }; setChampionships(c => c.map(ch => ch.id === selectedChamp.id ? { ...ch, matches: [...ch.matches, m] } : ch)); formRef.current = {}; setShowForm(null); };
  const saveMatchEdit = () => { if (!editingMatch) return; const f = formRef.current; setChampionships(c => c.map(ch => ch.id === selectedChamp.id ? { ...ch, matches: ch.matches.map(m => m.id === editingMatch.id ? { ...m, rival: (f.editRival || editingMatch.rival).toUpperCase(), date: f.editDate ?? editingMatch.date, time: f.editTime ?? editingMatch.time, matchday: parseInt(f.editMatchday) || editingMatch.matchday, field: f.editField ?? editingMatch.field, cost: parseFloat(f.editCost) || editingMatch.cost } : m) } : ch)); formRef.current = {}; setEditingMatch(null); };
  const deleteMatch = id => { if (confirm('¿Eliminar partido?')) setChampionships(c => c.map(ch => ch.id === selectedChamp.id ? { ...ch, matches: ch.matches.filter(m => m.id !== id) } : ch)); };
  const updateMatchPlayer = (matchId, playerId, field, value) => { setChampionships(c => c.map(ch => { if (ch.id !== selectedChamp.id) return ch; return { ...ch, matches: ch.matches.map(m => { if (m.id !== matchId) return m; return { ...m, players: m.players.map(p => { if (p.id !== playerId) return p; let u = { [field]: value }; if (field === 'available' && !value) { u.starter = false; u.timePlayed = 0; } if (field === 'starter') u.timePlayed = value ? 100 : 0; return { ...p, ...u }; }) }; }) }; })); };
  const getStats = champId => { const ch = championships.find(c => c.id === champId); if (!ch || !ch.matches.length) return []; return players.map(player => { let t = ch.matches.length, a = 0, s = 0, sub = 0, time = 0; ch.matches.forEach(m => { const mp = m.players.find(p => p.id === player.id); if (mp?.available) { a++; if (mp.starter) s++; else if (mp.timePlayed > 0) sub++; time += mp.timePlayed; } }); return { ...player, attendance: t > 0 ? Math.round((a/t)*100) : 0, starterPct: a > 0 ? Math.round((s/a)*100) : 0, substitutePct: a > 0 ? Math.round((sub/a)*100) : 0, avgTime: a > 0 ? Math.round(time/a) : 0 }; }).sort((a, b) => b.avgTime - a.avgTime || b.attendance - a.attendance); };
  const getCash = match => { if (!match) return null; const av = match.players.filter(p => p.available), pp = av.length > 0 ? match.cost / av.length : 0, cash = av.filter(p => p.paid && p.paymentMethod === 'ETF').length * pp, trans = av.filter(p => p.paid && p.paymentMethod === 'TRNS').length * pp; return { available: av, perPlayer: pp, cashPaid: cash, transPaid: trans, pending: match.cost - cash - trans, total: match.cost }; };

  const generateWhatsAppImage = match => { const av = match.players.filter(p => p.available), byPos = POSITIONS.reduce((a, pos) => { a[pos] = av.filter(p => p.position === pos); return a; }, {}); const canvas = document.createElement('canvas'), w = 400; let h = 280; POSITIONS.forEach(pos => { if (byPos[pos].length) h += 36 + byPos[pos].length * 28 + 8; }); h += 50; canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d'), grad = ctx.createLinearGradient(0, 0, 0, h); grad.addColorStop(0, '#0a0a12'); grad.addColorStop(1, '#1a1a2e'); ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#f7ca18'; ctx.fillRect(0, 0, w, 4); drawLogo(ctx, w/2, 70, 100); ctx.fillStyle = 'rgba(247,202,24,0.1)'; ctx.beginPath(); ctx.roundRect(15, 135, w-30, 85, 10); ctx.fill(); ctx.strokeStyle = 'rgba(247,202,24,0.4)'; ctx.lineWidth = 1; ctx.stroke(); const dateF = match.date ? match.date.split('-').reverse().join('/') : '-'; [['RIVAL:', match.rival], ['FECHA:', dateF], ['HORARIO:', match.time || '-'], ['CANCHA:', match.field || '-']].forEach(([l, v], i) => { ctx.fillStyle = '#f7ca18'; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'left'; ctx.fillText(l, 25, 155 + i * 18); ctx.fillStyle = '#fff'; ctx.font = '12px Arial'; ctx.fillText(v, 100, 155 + i * 18); }); let y = 235; ctx.fillStyle = '#f7ca18'; ctx.beginPath(); ctx.roundRect(15, y, w-30, 30, 6); ctx.fill(); ctx.fillStyle = '#1a1a2e'; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'center'; ctx.fillText('JUGADORES DISPONIBLES', w/2, y + 20); y += 42; POSITIONS.forEach((pos, i) => { const pp = byPos[pos]; if (!pp.length) return; ctx.fillStyle = 'rgba(247,202,24,0.15)'; ctx.beginPath(); ctx.roundRect(15, y, w-30, 30, 6); ctx.fill(); ctx.fillStyle = '#f7ca18'; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'left'; ctx.fillText(`${i+1} - ${pos}`, 25, y + 20); ctx.textAlign = 'right'; ctx.fillText(pp.length.toString(), w-25, y + 20); y += 36; pp.forEach((p, j) => { ctx.fillStyle = j % 2 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)'; ctx.beginPath(); ctx.roundRect(20, y, w-40, 24, 4); ctx.fill(); ctx.fillStyle = '#e0e0e0'; ctx.font = '11px Arial'; ctx.textAlign = 'left'; ctx.fillText(p.name, 35, y + 16); y += 28; }); y += 8; }); ctx.fillStyle = '#f7ca18'; ctx.beginPath(); ctx.roundRect(15, y, w-30, 35, 6); ctx.fill(); ctx.fillStyle = '#1a1a2e'; ctx.font = 'bold 13px Arial'; ctx.textAlign = 'left'; ctx.fillText('Total general', 25, y + 23); ctx.textAlign = 'right'; ctx.fillText(av.length.toString(), w-25, y + 23); const link = document.createElement('a'); link.download = `partido_vs_${match.rival}.png`; link.href = canvas.toDataURL(); link.click(); };

  const generateStatsReport = () => { if (!selectedChamp) return alert('Seleccioná un campeonato'); const stats = getStats(selectedChamp.id); if (!stats.length) return alert('No hay datos'); const canvas = document.createElement('canvas'), w = 500, rowH = 28, headerH = 200, h = headerH + stats.length * rowH + 60; canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d'); ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#f7ca18'; ctx.fillRect(0, 0, w, 4); drawLogo(ctx, w/2, 70, 90); ctx.fillStyle = '#f7ca18'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'; ctx.fillText('REPORTE DE ESTADÍSTICAS', w/2, 135); ctx.fillStyle = '#fff'; ctx.font = '12px Arial'; ctx.fillText(selectedChamp.name, w/2, 155); let y = headerH; ctx.fillStyle = '#f7ca18'; ctx.fillRect(10, y, w-20, 30); ctx.fillStyle = '#1a1a2e'; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'left'; ctx.fillText('NOMBRE', 20, y + 20); ctx.textAlign = 'center'; ctx.fillText('ASISTENCIA', 280, y + 20); ctx.fillText('TITULAR', 350, y + 20); ctx.fillText('SUPLENTE', 410, y + 20); ctx.fillText('JUGADO', 470, y + 20); y += 30; stats.forEach((p, i) => { ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)'; ctx.fillRect(10, y, w-20, rowH); ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.textAlign = 'left'; ctx.fillText(p.name, 20, y + 18); ctx.textAlign = 'center'; ctx.fillStyle = p.attendance >= 80 ? '#4ade80' : p.attendance >= 50 ? '#fbbf24' : '#f87171'; ctx.fillText(`${p.attendance}%`, 280, y + 18); ctx.fillStyle = '#fff'; ctx.fillText(`${p.starterPct}%`, 350, y + 18); ctx.fillText(`${p.substitutePct}%`, 410, y + 18); ctx.fillStyle = p.avgTime >= 70 ? '#4ade80' : p.avgTime >= 40 ? '#fbbf24' : '#9ca3af'; ctx.fillText(`${p.avgTime}%`, 470, y + 18); y += rowH; }); const link = document.createElement('a'); link.download = `estadisticas_${selectedChamp.name}.png`; link.href = canvas.toDataURL(); link.click(); };

  const generateCashReport = match => { if (!match) return; const cash = getCash(match), canvas = document.createElement('canvas'), w = 450, rowH = 28, h = 280 + cash.available.length * rowH + 100; canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#f97316'; ctx.fillRect(0, 0, w, 25); ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'; ctx.fillText('REPORTE 3', w/2, 17); ctx.fillStyle = '#000'; ctx.fillRect(10, 35, w-20, 90); ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2; ctx.strokeRect(10, 35, w-20, 90); const dateF = match.date ? match.date.split('-').reverse().join('/') : '-'; [['RIVAL:', match.rival], ['FECHA:', dateF], ['HORARIO:', match.time], ['CANCHA:', match.field], ['DISPONIBLES', cash.available.length], ['VALOR TURNO', `$ ${match.cost.toLocaleString('es-AR')}`]].forEach(([l, v], i) => { ctx.fillStyle = '#f97316'; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'left'; ctx.fillText(l, 20, 55 + i * 14); ctx.fillStyle = '#fff'; ctx.font = '11px Arial'; ctx.fillText(String(v), 130, 55 + i * 14); }); let y = 140; ctx.fillStyle = '#000'; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center'; ctx.fillText('PAGO', w/2, y); y += 20; cash.available.forEach((p, i) => { ctx.fillStyle = i % 2 ? '#f3f4f6' : '#fff'; ctx.fillRect(10, y, w-20, rowH); ctx.strokeStyle = '#e5e7eb'; ctx.strokeRect(10, y, w-20, rowH); ctx.fillStyle = '#000'; ctx.font = '10px Arial'; ctx.textAlign = 'left'; ctx.fillText(p.name, 20, y + 18); ctx.fillText(p.paid ? 'SI' : 'NO', 200, y + 18); ctx.textAlign = 'right'; ctx.fillText(p.paid ? `$ ${Math.round(cash.perPlayer).toLocaleString('es-AR')}` : '-', 320, y + 18); ctx.fillText(p.paid ? p.paymentMethod : '-', w - 20, y + 18); y += rowH; }); y += 20; ctx.fillStyle = '#f97316'; ctx.fillRect(10, y, w-20, 80); [['EFECTIVO', cash.cashPaid], ['TRANS', cash.transPaid], ['RESTA', cash.pending], ['CAJA', cash.total]].forEach(([l, v], i) => { const xPos = 20 + i * 105; ctx.fillStyle = '#000'; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'left'; ctx.fillText(l, xPos, y + 20); ctx.fillStyle = l === 'RESTA' && v > 0 ? '#dc2626' : '#000'; ctx.fillText(`$ ${Math.round(v).toLocaleString('es-AR')}`, xPos, y + 45); }); const link = document.createElement('a'); link.download = `caja_vs_${match.rival}.png`; link.href = canvas.toDataURL(); link.click(); };

  // VIEWS
  if (view === 'home') return React.createElement('div', { className: 'min-h-screen bg-gray-900' },
    React.createElement('div', { className: 'bg-gradient-to-b from-yellow-500/20 to-transparent pt-6 pb-10 px-4 flex flex-col items-center' },
      React.createElement(LogoCanvas, { size: 130 }),
      React.createElement('h1', { className: 'text-2xl font-black text-yellow-400 mt-2' }, 'RESPETEN RANGOS'),
      React.createElement('p', { className: 'text-gray-400 text-sm' }, 'FÚTBOL CLUB')
    ),
    React.createElement('div', { className: 'px-4 -mt-4 space-y-4 pb-8' },
      [['championships', '🏆', 'Campeonatos', `${championships.length} campeonatos`],
       ['players', '👥', 'Plantel', `${players.length} jugadores`],
       ['reports', '📊', 'Reportes', 'Estadísticas y planillas']].map(([id, icon, title, sub]) =>
        React.createElement(Card, { key: id, onClick: () => setView(id), className: 'p-5' },
          React.createElement('div', { className: 'flex items-center gap-4' },
            React.createElement('div', { className: 'w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-2xl' }, icon),
            React.createElement('div', { className: 'flex-1' },
              React.createElement('h3', { className: 'font-bold text-white text-lg' }, title),
              React.createElement('p', { className: 'text-gray-400 text-sm' }, sub)
            ),
            React.createElement('span', { className: 'text-gray-500' }, '→')
          )
        )
      )
    )
  );

  if (view === 'players') return React.createElement('div', { className: 'min-h-screen bg-gray-900 pb-8' },
    React.createElement(Header, { title: 'Plantel', onBack: () => setView('home'), action: React.createElement(Button, { onClick: () => { formRef.current = { playerPosition: 'MEDIO' }; setShowForm('player'); }, size: 'sm' }, '+ Nuevo') }),
    showForm === 'player' && React.createElement('div', { className: 'p-4 bg-gray-800/80 border-b border-gray-700 space-y-4' },
      React.createElement('h3', { className: 'font-bold text-white' }, 'Nuevo Jugador'),
      React.createElement(TextInput, { label: 'Nombre completo', defaultValue: '', onSave: v => formRef.current.playerName = v, placeholder: 'MARTINEZ JUAN' }),
      React.createElement(SelectInput, { label: 'Posición', value: formRef.current.playerPosition || 'MEDIO', onChange: v => formRef.current.playerPosition = v, options: POSITIONS.map(p => ({ value: p, label: p })) }),
      React.createElement('div', { className: 'flex gap-3' },
        React.createElement(Button, { onClick: addPlayer, className: 'flex-1' }, '✓ Agregar'),
        React.createElement(Button, { onClick: () => { formRef.current = {}; setShowForm(null); }, variant: 'secondary' }, '✕')
      )
    ),
    React.createElement('div', { className: 'p-4 space-y-4' },
      POSITIONS.map(pos => {
        const pp = players.filter(p => p.position === pos);
        if (!pp.length) return null;
        return React.createElement('div', { key: pos },
          React.createElement('div', { className: 'flex items-center gap-2 mb-3' },
            React.createElement('span', { className: 'text-yellow-400 font-bold' }, pos),
            React.createElement('span', { className: 'bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full' }, pp.length)
          ),
          React.createElement('div', { className: 'space-y-2' },
            pp.map(player => React.createElement(Card, { key: player.id, className: 'p-4' },
              editingPlayer?.id === player.id ? React.createElement('div', { className: 'space-y-4' },
                React.createElement(TextInput, { label: 'Nombre', defaultValue: player.name, onSave: v => formRef.current.editPlayerName = v }),
                React.createElement(SelectInput, { label: 'Posición', value: formRef.current.editPlayerPosition || player.position, onChange: v => formRef.current.editPlayerPosition = v, options: POSITIONS.map(p => ({ value: p, label: p })) }),
                React.createElement('div', { className: 'flex gap-3' },
                  React.createElement(Button, { onClick: updatePlayer, size: 'sm', className: 'flex-1' }, '💾 Guardar'),
                  React.createElement(Button, { onClick: () => { formRef.current = {}; setEditingPlayer(null); }, variant: 'secondary', size: 'sm' }, '✕')
                )
              ) : React.createElement('div', { className: 'flex items-center justify-between' },
                React.createElement('span', { className: 'text-white font-medium' }, player.name),
                React.createElement('div', { className: 'flex gap-1' },
                  React.createElement('button', { onClick: () => { formRef.current = { editPlayerPosition: player.position }; setEditingPlayer(player); }, className: 'p-3 text-blue-400' }, '✏️'),
                  React.createElement('button', { onClick: () => deletePlayer(player.id), className: 'p-3 text-red-400' }, '🗑️')
                )
              )
            ))
          )
        );
      })
    )
  );

  if (view === 'championships') return React.createElement('div', { className: 'min-h-screen bg-gray-900 pb-8' },
    React.createElement(Header, { title: 'Campeonatos', onBack: () => setView('home'), action: React.createElement(Button, { onClick: () => { formRef.current = {}; setShowForm('champ'); }, size: 'sm' }, '+ Nuevo') }),
    showForm === 'champ' && React.createElement('div', { className: 'p-4 bg-gray-800/80 border-b border-gray-700 space-y-4' },
      React.createElement('h3', { className: 'font-bold text-white' }, 'Nuevo Campeonato'),
      React.createElement(TextInput, { label: 'Nombre', defaultValue: '', onSave: v => formRef.current.champName = v, placeholder: 'Torneo Apertura 2026' }),
      React.createElement('div', { className: 'flex gap-3' },
        React.createElement(Button, { onClick: createChampionship, className: 'flex-1' }, '✓ Crear'),
        React.createElement(Button, { onClick: () => { formRef.current = {}; setShowForm(null); }, variant: 'secondary' }, '✕')
      )
    ),
    React.createElement('div', { className: 'p-4 space-y-3' },
      !championships.length ? React.createElement('div', { className: 'text-center py-16 text-gray-500' }, React.createElement('p', { className: 'text-4xl mb-4' }, '🏆'), React.createElement('p', null, 'No hay campeonatos')) :
      championships.map(c => React.createElement(Card, { key: c.id, className: 'p-4' },
        React.createElement('div', { className: 'flex items-center justify-between' },
          React.createElement('div', { onClick: () => { setSelectedChamp(c); setView('matches'); }, className: 'flex-1 flex items-center gap-4' },
            React.createElement('div', { className: 'w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-xl' }, '🏆'),
            React.createElement('div', null,
              React.createElement('h3', { className: 'font-bold text-white' }, c.name),
              React.createElement('p', { className: 'text-gray-400 text-sm' }, `${c.matches.length} partidos`)
            )
          ),
          React.createElement('button', { onClick: () => deleteChampionship(c.id), className: 'p-3 text-red-400' }, '🗑️')
        )
      ))
    )
  );

  if (view === 'matches' && selectedChamp) return React.createElement('div', { className: 'min-h-screen bg-gray-900 pb-8' },
    React.createElement(Header, { title: selectedChamp.name, onBack: () => setView('championships'), action: React.createElement(Button, { onClick: () => { formRef.current = {}; setShowForm('match'); }, size: 'sm' }, '+ Partido') }),
    showForm === 'match' && React.createElement('div', { className: 'p-4 bg-gray-800/80 border-b border-gray-700 space-y-4' },
      React.createElement('h3', { className: 'font-bold text-white' }, 'Nuevo Partido'),
      React.createElement(TextInput, { label: '🆚 Rival', defaultValue: '', onSave: v => formRef.current.matchRival = v, placeholder: 'LA PUPONETA' }),
      React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
        React.createElement(TextInput, { label: '📅 Fecha', type: 'date', defaultValue: '', onSave: v => formRef.current.matchDate = v }),
        React.createElement(TextInput, { label: '🕐 Hora', type: 'time', defaultValue: '15:30', onSave: v => formRef.current.matchTime = v })
      ),
      React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
        React.createElement(TextInput, { label: '📍 Fecha N°', type: 'number', defaultValue: '1', onSave: v => formRef.current.matchDay = v }),
        React.createElement(TextInput, { label: '🏟️ Cancha', defaultValue: '', onSave: v => formRef.current.matchField = v, placeholder: '4' })
      ),
      React.createElement(TextInput, { label: '💰 Costo $', type: 'number', defaultValue: '130000', onSave: v => formRef.current.matchCost = v }),
      React.createElement('div', { className: 'flex gap-3' },
        React.createElement(Button, { onClick: createMatch, className: 'flex-1' }, '✓ Crear'),
        React.createElement(Button, { onClick: () => { formRef.current = {}; setShowForm(null); }, variant: 'secondary' }, '✕')
      )
    ),
    React.createElement('div', { className: 'p-4 space-y-4' },
      !selectedChamp.matches.length ? React.createElement('div', { className: 'text-center py-16 text-gray-500' }, 'No hay partidos') :
      selectedChamp.matches.map(match => React.createElement(Card, { key: match.id, className: 'p-4' },
        React.createElement('div', { className: 'flex items-start justify-between mb-2' },
          React.createElement('div', { onClick: () => { setSelectedMatch(match); setView('match-detail'); }, className: 'flex-1' },
            React.createElement('h3', { className: 'font-bold text-white text-lg' }, `vs ${match.rival}`),
            React.createElement('p', { className: 'text-gray-400 text-sm' }, `${match.date ? match.date.split('-').reverse().join('/') : '-'} • ${match.time}`),
            React.createElement('p', { className: 'text-gray-500 text-xs' }, `Fecha ${match.matchday} • Cancha ${match.field || '-'} • $${match.cost?.toLocaleString('es-AR')}`)
          ),
          React.createElement('div', { className: 'flex gap-1' },
            React.createElement('button', { onClick: () => { formRef.current = {}; setEditingMatch(match); }, className: 'p-2 text-blue-400' }, '✏️'),
            React.createElement('button', { onClick: () => deleteMatch(match.id), className: 'p-2 text-red-400' }, '🗑️')
          )
        ),
        editingMatch?.id === match.id && React.createElement('div', { className: 'space-y-3 pt-3 border-t border-gray-700' },
          React.createElement(TextInput, { label: 'Rival', defaultValue: match.rival, onSave: v => formRef.current.editRival = v }),
          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            React.createElement(TextInput, { label: 'Fecha', type: 'date', defaultValue: match.date, onSave: v => formRef.current.editDate = v }),
            React.createElement(TextInput, { label: 'Hora', type: 'time', defaultValue: match.time, onSave: v => formRef.current.editTime = v })
          ),
          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            React.createElement(TextInput, { label: 'Fecha N°', type: 'number', defaultValue: String(match.matchday), onSave: v => formRef.current.editMatchday = v }),
            React.createElement(TextInput, { label: 'Cancha', defaultValue: match.field, onSave: v => formRef.current.editField = v })
          ),
          React.createElement(TextInput, { label: 'Costo $', type: 'number', defaultValue: String(match.cost), onSave: v => formRef.current.editCost = v }),
          React.createElement('div', { className: 'flex gap-3' },
            React.createElement(Button, { onClick: saveMatchEdit, className: 'flex-1' }, '💾 Guardar'),
            React.createElement(Button, { onClick: () => { formRef.current = {}; setEditingMatch(null); }, variant: 'secondary' }, '✕')
          )
        ),
        editingMatch?.id !== match.id && React.createElement('div', { className: 'grid grid-cols-4 gap-2 mt-3' },
          React.createElement(Button, { onClick: () => { setSelectedMatch(match); setView('match-detail'); }, variant: 'secondary', size: 'sm' }, '👥'),
          React.createElement(Button, { onClick: () => { setSelectedMatch(match); setView('payments'); }, variant: 'secondary', size: 'sm' }, '💰'),
          React.createElement(Button, { onClick: () => generateWhatsAppImage(match), variant: 'success', size: 'sm' }, '📱'),
          React.createElement(Button, { onClick: () => generateCashReport(match), variant: 'secondary', size: 'sm' }, '📄')
        )
      ))
    )
  );

  if (view === 'match-detail' && selectedMatch) {
    const av = selectedMatch.players.filter(p => p.available).length;
    return React.createElement('div', { className: 'min-h-screen bg-gray-900 pb-24' },
      React.createElement(Header, { title: `vs ${selectedMatch.rival}`, onBack: () => setView('matches') }),
      React.createElement('div', { className: 'p-4' },
        React.createElement(Card, { className: 'p-4 mb-4' },
          React.createElement('div', { className: 'flex justify-between items-center' },
            React.createElement('span', { className: 'text-gray-400 text-sm' }, `${selectedMatch.date ? selectedMatch.date.split('-').reverse().join('/') : '-'} • ${selectedMatch.time}`),
            React.createElement('span', { className: 'bg-yellow-500/20 text-yellow-400 font-bold px-3 py-1 rounded-full text-sm' }, `${av} disponibles`)
          )
        ),
        POSITIONS.map(pos => {
          const pp = selectedMatch.players.filter(p => p.position === pos);
          if (!pp.length) return null;
          return React.createElement('div', { key: pos, className: 'mb-5' },
            React.createElement('div', { className: 'flex items-center gap-2 mb-3' },
              React.createElement('span', { className: 'text-yellow-400 font-bold' }, pos),
              React.createElement('span', { className: 'text-gray-500 text-xs' }, `(${pp.filter(p => p.available).length}/${pp.length})`)
            ),
            React.createElement('div', { className: 'space-y-2' },
              pp.map(player => React.createElement(Card, { key: player.id, className: `p-4 ${!player.available ? 'opacity-50' : ''}` },
                React.createElement('div', { className: 'space-y-3' },
                  React.createElement('div', { className: 'flex items-center justify-between' },
                    React.createElement('label', { className: 'flex items-center gap-3 flex-1' },
                      React.createElement('input', { type: 'checkbox', checked: player.available, onChange: e => updateMatchPlayer(selectedMatch.id, player.id, 'available', e.target.checked), className: 'w-6 h-6 accent-yellow-500' }),
                      React.createElement('span', { className: `font-medium ${player.available ? 'text-white' : 'text-gray-500 line-through'}` }, player.name)
                    ),
                    player.available && player.starter && React.createElement('span', { className: 'text-xs bg-yellow-500 text-gray-900 font-bold px-2 py-1 rounded' }, 'TITULAR')
                  ),
                  !player.available && React.createElement('select', { value: player.unavailableReason, onChange: e => updateMatchPlayer(selectedMatch.id, player.id, 'unavailableReason', e.target.value), className: 'w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white' },
                    React.createElement('option', { value: '' }, 'Motivo...'),
                    UNAVAILABLE_REASONS.map(r => React.createElement('option', { key: r, value: r }, r))
                  ),
                  player.available && React.createElement('div', { className: 'flex items-center gap-4' },
                    React.createElement('label', { className: 'flex items-center gap-2' },
                      React.createElement('input', { type: 'checkbox', checked: player.starter, onChange: e => updateMatchPlayer(selectedMatch.id, player.id, 'starter', e.target.checked), className: 'w-5 h-5 accent-yellow-500' }),
                      React.createElement('span', { className: 'text-sm text-gray-300' }, 'Titular')
                    ),
                    React.createElement('select', { value: player.timePlayed, onChange: e => updateMatchPlayer(selectedMatch.id, player.id, 'timePlayed', parseInt(e.target.value)), className: 'flex-1 bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm' },
                      TIME_OPTIONS.map(t => React.createElement('option', { key: t, value: t }, `${t}%`))
                    )
                  )
                )
              ))
            )
          );
        })
      ),
      React.createElement('div', { className: 'fixed bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-800' },
        React.createElement(Button, { onClick: () => generateWhatsAppImage(selectedMatch), className: 'w-full', size: 'lg' }, '📱 Generar Imagen WhatsApp')
      )
    );
  }

  if (view === 'payments' && selectedMatch) {
    const cash = getCash(selectedMatch);
    return React.createElement('div', { className: 'min-h-screen bg-gray-900 pb-8' },
      React.createElement(Header, { title: '💰 Caja', onBack: () => setView('matches'), action: React.createElement(Button, { onClick: () => generateCashReport(selectedMatch), size: 'sm' }, '📥') }),
      React.createElement('div', { className: 'p-4 space-y-4' },
        React.createElement(Card, { className: 'p-5' },
          React.createElement('div', { className: 'text-center mb-4' },
            React.createElement('p', { className: 'text-gray-400 text-sm' }, `vs ${selectedMatch.rival}`),
            React.createElement('p', { className: 'text-3xl font-black text-white' }, `$${cash.total.toLocaleString('es-AR')}`)
          ),
          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            React.createElement('div', { className: 'bg-gray-700/50 rounded-xl p-3 text-center' },
              React.createElement('p', { className: 'text-xs text-gray-400' }, 'Por jugador'),
              React.createElement('p', { className: 'text-lg font-bold text-white' }, `$${Math.round(cash.perPlayer).toLocaleString('es-AR')}`)
            ),
            React.createElement('div', { className: 'bg-yellow-500/10 rounded-xl p-3 text-center border border-yellow-500/30' },
              React.createElement('p', { className: 'text-xs text-gray-400' }, 'Disponibles'),
              React.createElement('p', { className: 'text-lg font-bold text-yellow-400' }, cash.available.length)
            )
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-3 gap-3' },
          React.createElement(Card, { className: 'p-3 text-center bg-green-500/10 border-green-500/30' },
            React.createElement('p', { className: 'text-xs text-gray-400' }, 'Efectivo'),
            React.createElement('p', { className: 'text-base font-bold text-green-400' }, `$${Math.round(cash.cashPaid).toLocaleString('es-AR')}`)
          ),
          React.createElement(Card, { className: 'p-3 text-center bg-blue-500/10 border-blue-500/30' },
            React.createElement('p', { className: 'text-xs text-gray-400' }, 'Transfer'),
            React.createElement('p', { className: 'text-base font-bold text-blue-400' }, `$${Math.round(cash.transPaid).toLocaleString('es-AR')}`)
          ),
          React.createElement(Card, { className: `p-3 text-center ${cash.pending > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}` },
            React.createElement('p', { className: 'text-xs text-gray-400' }, 'Resta'),
            React.createElement('p', { className: `text-base font-bold ${cash.pending > 0 ? 'text-red-400' : 'text-green-400'}` }, `$${Math.round(cash.pending).toLocaleString('es-AR')}`)
          )
        ),
        React.createElement('div', { className: 'space-y-2' },
          cash.available.map(player => React.createElement(Card, { key: player.id, className: 'p-4' },
            React.createElement('div', { className: 'flex items-center justify-between mb-3' },
              React.createElement('span', { className: 'text-white font-medium text-sm' }, player.name),
              React.createElement('span', { className: 'text-gray-400 text-sm' }, `$${Math.round(cash.perPlayer).toLocaleString('es-AR')}`)
            ),
            React.createElement('div', { className: 'flex items-center gap-3' },
              React.createElement('select', { value: player.paymentMethod, onChange: e => updateMatchPlayer(selectedMatch.id, player.id, 'paymentMethod', e.target.value), className: 'bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-white flex-1 text-sm' },
                React.createElement('option', { value: 'ETF' }, '💵 Efectivo'),
                React.createElement('option', { value: 'TRNS' }, '📲 Transfer')
              ),
              React.createElement('button', { onClick: () => updateMatchPlayer(selectedMatch.id, player.id, 'paid', !player.paid), className: `px-4 py-2 rounded-xl font-bold text-sm ${player.paid ? 'bg-green-500 text-white' : 'bg-gray-700 text-red-400 border border-red-500/50'}` }, player.paid ? '✓ PAGÓ' : 'DEBE')
            )
          ))
        )
      )
    );
  }

  if (view === 'reports') return React.createElement('div', { className: 'min-h-screen bg-gray-900 pb-8' },
    React.createElement(Header, { title: '📊 Reportes', onBack: () => setView('home') }),
    React.createElement('div', { className: 'p-4 space-y-4' },
      React.createElement(Card, { className: 'p-5' },
        React.createElement('h3', { className: 'font-bold text-white mb-3' }, 'Reporte de Estadísticas'),
        React.createElement('p', { className: 'text-gray-400 text-sm mb-4' }, 'Asistencia, titularidad y minutos jugados de todos los jugadores.'),
        React.createElement(SelectInput, { label: 'Campeonato', value: selectedChamp?.id || '', onChange: v => setSelectedChamp(championships.find(c => c.id === parseInt(v))), options: [{ value: '', label: 'Elegir...' }, ...championships.map(c => ({ value: c.id, label: c.name }))] }),
        React.createElement(Button, { onClick: generateStatsReport, className: 'w-full mt-4' }, '📥 Descargar Estadísticas')
      ),
      React.createElement(Card, { className: 'p-5' },
        React.createElement('h3', { className: 'font-bold text-white mb-3' }, 'Otros Reportes'),
        React.createElement('p', { className: 'text-gray-400 text-sm' }, 'La imagen para WhatsApp y la planilla de caja se generan desde cada partido.'),
        React.createElement('p', { className: 'text-gray-500 text-xs mt-2' }, 'Campeonatos → Elegí un campeonato → Elegí un partido → Usá los botones')
      )
    )
  );

  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
