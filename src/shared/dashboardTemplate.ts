export const DASHBOARD_HTML = `
<!DOCTYPE html>
<html lang="zh-CN" data-theme="sanctuary">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>庇护所战报 - D2 Runner</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Roboto+Mono:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    
    <style>
        /* === D2Run Dashboard Design System === */
        :root {
            /* Typography */
            --font-main: 'Inter', sans-serif;
            --font-headings: 'Cinzel', serif;
            --font-mono: 'Roboto Mono', monospace;
            
            /* Theme: Sanctuary (Default - Gold) */
            --bg-page: #050505;
            --bg-page-image: radial-gradient(ellipse at 50% 0%, rgba(42, 32, 5, 0.8) 0%, #050505 70%);
            --c-primary: #d4af37;
            --c-primary-rgb: 212, 175, 55;
            --c-secondary: #a335ee;
            --c-bg-card: rgba(20, 20, 22, 0.7);
            --c-bg-elevated: rgba(30, 30, 33, 0.85);
            --c-border-card: rgba(212, 175, 55, 0.12);
            --c-border-highlight: rgba(212, 175, 55, 0.25);
            --c-text-main: #e5dcc5;
            --c-text-muted: rgba(229, 220, 197, 0.6);
            --blur-strength: 16px;
            --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.5);
            --glow-color: rgba(212, 175, 55, 0.25);
            --c-success: #22c55e;
            --c-danger: #dc2626;
            --c-warn: #f59e0b;
            --c-info: #3b82f6;
        }

        [data-theme="ethereal"] {
            --bg-page: #0a0f1a;
            --bg-page-image: linear-gradient(135deg, #0a0f1a 0%, #1a2538 50%, #2a3a55 100%);
            --c-primary: #38bdf8;
            --c-primary-rgb: 56, 189, 248;
            --c-secondary: #818cf8;
            --c-bg-card: rgba(255, 255, 255, 0.04);
            --c-bg-elevated: rgba(255, 255, 255, 0.08);
            --c-border-card: rgba(56, 189, 248, 0.1);
            --c-border-highlight: rgba(56, 189, 248, 0.2);
            --c-text-main: #f0f9ff;
            --c-text-muted: rgba(240, 249, 255, 0.6);
            --blur-strength: 20px;
            --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.3);
            --glow-color: rgba(56, 189, 248, 0.2);
        }

        [data-theme="neon"] {
            --bg-page: #020205;
            --bg-page-image: radial-gradient(circle at 80% 20%, rgba(32, 5, 46, 0.8) 0%, #020205 60%);
            --c-primary: #f0abfc;
            --c-primary-rgb: 240, 171, 252;
            --c-secondary: #06b6d4;
            --c-bg-card: rgba(10, 10, 15, 0.85);
            --c-bg-elevated: rgba(20, 20, 30, 0.9);
            --c-border-card: rgba(240, 171, 252, 0.15);
            --c-border-highlight: rgba(240, 171, 252, 0.3);
            --c-text-main: #fefefe;
            --c-text-muted: rgba(254, 254, 254, 0.6);
            --blur-strength: 12px;
            --shadow-card: 0 0 25px rgba(240, 171, 252, 0.1);
            --glow-color: rgba(240, 171, 252, 0.35);
        }

        /* === Base Styles === */
        * { box-sizing: border-box; }
        
        body { 
            background-color: var(--bg-page);
            background-image: var(--bg-page-image);
            background-attachment: fixed;
            color: var(--c-text-main);
            font-family: var(--font-main);
            min-height: 100vh;
            margin: 0;
            transition: background 0.5s ease, color 0.3s ease;
            line-height: 1.5;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
        ::-webkit-scrollbar-thumb { 
            background: rgba(var(--c-primary-rgb), 0.3); 
            border-radius: 4px;
            transition: background 0.2s;
        }
        ::-webkit-scrollbar-thumb:hover { background: rgba(var(--c-primary-rgb), 0.5); }

        /* === Glass Card Component === */
        .glass-card {
            background: var(--c-bg-card);
            backdrop-filter: blur(var(--blur-strength));
            -webkit-backdrop-filter: blur(var(--blur-strength));
            border: 1px solid var(--c-border-card);
            border-radius: 16px;
            box-shadow: var(--shadow-card);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .glass-card::before {
            content: ''; 
            position: absolute; 
            top: 0; 
            left: -100%; 
            width: 100%; 
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
            transition: left 0.6s ease;
            pointer-events: none;
        }
        
        .glass-card:hover::before { left: 100%; }
        
        .glass-card:hover {
            transform: translateY(-4px);
            border-color: var(--c-border-highlight);
            box-shadow: 0 16px 48px var(--glow-color);
        }

        /* === Theme Buttons === */
        .theme-btn {
            width: 24px; 
            height: 24px; 
            border-radius: 50%; 
            border: 2px solid transparent; 
            cursor: pointer; 
            transition: all 0.25s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        .theme-btn:hover { 
            transform: scale(1.15); 
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .theme-btn.active { 
            border-color: var(--c-text-main); 
            transform: scale(1.15);
            box-shadow: 0 0 15px var(--glow-color);
        }

        /* === Utility Classes === */
        .font-cinzel { font-family: var(--font-headings); }
        .font-mono { font-family: var(--font-mono); }
        .text-theme { color: var(--c-primary); }
        .text-muted { color: var(--c-text-muted); }
        .text-glow { text-shadow: 0 0 20px var(--glow-color); }
        
        /* === Animations === */
        .fade-in-up { 
            animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
            opacity: 0; 
            transform: translateY(20px); 
        }
        @keyframes fadeInUp { 
            to { opacity: 1; transform: translateY(0); } 
        }
        
        .item-enter { 
            animation: itemEnter 0.4s ease forwards; 
            opacity: 0; 
            transform: scale(0.95); 
        }
        @keyframes itemEnter { 
            to { opacity: 1; transform: scale(1); } 
        }

        @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 10px var(--glow-color); }
            50% { box-shadow: 0 0 25px var(--glow-color), 0 0 40px var(--glow-color); }
        }
        }
        .animate-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
        .shadow-text { text-shadow: 0 2px 4px rgba(0,0,0,0.8); }

        /* === Grail View Styles === */
        .grail-tabs {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 24px;
        }
        .grail-tab {
            background: transparent;
            border: none;
            color: var(--c-text-muted);
            font-family: var(--font-headings);
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            cursor: pointer;
            padding: 8px 16px;
            position: relative;
            transition: all 0.3s;
        }
        .grail-tab::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            background: var(--c-primary);
            transition: all 0.3s;
            transform: translateX(-50%);
        }
        .grail-tab:hover { color: var(--c-text-main); }
        .grail-tab.active { color: var(--c-primary); text-shadow: 0 0 10px var(--glow-color); }
        .grail-tab.active::after { width: 100%; }

        .grail-stash {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 4px;
            background: rgba(0,0,0,0.6);
            border: 2px solid #4a4a4a;
            padding: 10px;
            box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
            border-radius: 4px;
        }
        .grail-slot {
            aspect-ratio: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(20,20,20,0.8);
            border: 1px solid #333;
            transition: all 0.2s;
            cursor: default;
            position: relative;
        }
        .grail-slot:hover {
            border-color: var(--c-text-muted);
            background: rgba(40,40,40,0.9);
            z-index: 10;
        }
        .grail-slot.found {
            background: rgba(30,30,30,0.9);
            border-color: var(--slot-color);
            box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
        }
        .grail-slot.found span {
            color: var(--slot-color);
            text-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        .grail-slot:not(.found) span {
            color: rgba(255,255,255,0.1);
            filter: blur(0.5px);
        }
        .grail-slot-name {
            font-size: 9px; 
            text-align: center;
            line-height: 1.1;
            padding: 2px;
            word-break: break-word;
        }
        
        .tab-btn {
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            cursor: pointer;
            transition: all 0.3s;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: var(--c-text-muted);
        }
        .tab-btn.active {
            background: var(--c-primary);
            color: #000;
            border-color: var(--c-primary);
            box-shadow: 0 0 15px var(--glow-color);
        }

    </style>
</head>
<body class="p-4 md:p-8 antialiased">
    <div class="max-w-7xl mx-auto space-y-6">
        
        <!-- Header -->
        <header class="glass-card p-6 flex flex-col md:flex-row justify-between items-center fade-in-up" style="animation-delay: 0ms;">
            <div class="flex items-center gap-5">
                <div class="w-14 h-14 rounded-full bg-gradient-to-br from-black/50 to-transparent border border-white/5 flex items-center justify-center shadow-[0_0_20px_var(--glow-color)] group transition-all">
                    <i class="fa-solid fa-dragon text-2xl text-theme group-hover:rotate-12 transition-transform duration-300"></i>
                </div>
                <div>
                    <h1 class="text-3xl font-cinzel font-bold text-theme tracking-wider" id="dashTitle">庇护之地战报</h1>
                    <p class="text-xs text-muted font-mono tracking-[0.3em] uppercase mt-1" id="dashSubtitle">Sanctuary Analytics Dashboard</p>
                </div>
            </div>
            
            <div class="flex items-center gap-4 mt-4 md:mt-0">
                <div class="flex gap-2 p-1.5 rounded-full bg-black/20 border border-white/5 mx-4">
                    <button class="theme-btn bg-[#d4af37]" title="Sanctuary" onclick="setTheme('sanctuary')"></button>
                    <button class="theme-btn bg-[#38bdf8]" title="Ethereal" onclick="setTheme('ethereal')"></button>
                    <button class="theme-btn bg-[#f0abfc]" title="Neon" onclick="setTheme('neon')"></button>
                </div>
                
                <div class="flex gap-2 mr-4">
                    <button id="btnViewReport" class="tab-btn active" onclick="switchView('report')">Report</button>
                    <button id="btnViewGrail" class="tab-btn" onclick="switchView('grail')">Grail</button>
                </div>

                <div class="text-right flex flex-col items-end gap-1">
                     <button onclick="toggleDashLang()" class="text-[10px] font-mono text-muted hover:text-theme transition-colors border border-white/10 px-2 py-1 rounded hover:bg-white/5 uppercase mb-1">
                        <i class="fa-solid fa-globe mr-1"></i><span id="langToggleText">EN</span>
                    </button>
                    <div class="flex items-center gap-2 text-[10px] text-muted font-mono">
                         <span id="filterStatus" class="hidden text-theme animate-pulse">
                            <i class="fa-solid fa-filter mr-1"></i><span id="filteringText">Filtering</span>: <span id="filterName">--</span>
                        </span>
                        <span id="reportDate">--</span>
                    </div>
                </div>
                 <button onclick="resetFilter()" class="ml-2 text-xs border border-white/10 hover:border-theme hover:text-theme p-2 rounded transition-colors bg-white/5" title="Reset">
                    <i class="fa-solid fa-rotate-left"></i>
                </button>
            </div>
        </header>

        <!-- Report View -->
        <div id="reportView" class="space-y-6">
        
        <!-- KPI Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in-up" style="animation-delay: 100ms;">
            <div class="glass-card p-5 group flex flex-col items-center justify-center text-center">
                <div class="text-[10px] text-muted uppercase tracking-widest mb-1 group-hover:text-theme transition-colors" id="txtRuns">总场次</div>
                <div class="text-3xl font-mono font-bold text-white group-hover:text-theme transition-colors" id="kpiRuns">0</div>
            </div>
            <div class="glass-card p-5 group flex flex-col items-center justify-center text-center">
                 <div class="text-[10px] text-muted uppercase tracking-widest mb-1 group-hover:text-theme transition-colors" id="txtTime">总耗时</div>
                <div class="text-2xl font-mono font-bold text-theme" style="color: var(--c-success)" id="kpiTime">0s</div>
            </div>
             <div class="glass-card p-5 group flex flex-col items-center justify-center text-center">
                 <div class="text-[10px] text-muted uppercase tracking-widest mb-1 group-hover:text-theme transition-colors" id="txtDrops">总掉落</div>
                <div class="text-3xl font-mono font-bold text-theme" style="color: var(--c-secondary)" id="kpiDrops">0</div>
            </div>
             <div class="glass-card p-5 group flex flex-col items-center justify-center text-center">
                 <div class="text-[10px] text-muted uppercase tracking-widest mb-1 group-hover:text-theme transition-colors" id="txtUnique">稀有掉落</div>
                <div class="text-2xl font-mono font-bold text-theme" style="color: var(--c-warn)" id="kpiUnique">0</div>
            </div>
        </div>
        
        <!-- Detailed KPIs -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in-up" style="animation-delay: 150ms;">
             <div class="glass-card p-3 flex flex-col items-center justify-center">
                <span class="text-[10px] text-muted uppercase" id="txtPB">PB / Record</span>
                <span class="text-xl font-mono font-bold text-emerald-400" id="kpiPB">0s</span>
                <span class="text-[8px] text-muted opacity-50" id="kpiPBDate">--</span>
            </div>
             <div class="glass-card p-3 flex flex-col items-center justify-center">
                <span class="text-[10px] text-muted uppercase" id="txtAvg">Avg Time</span>
                <span class="text-xl font-mono font-bold text-blue-400" id="kpiAvg">0s</span>
            </div>
             <div class="glass-card p-3 flex flex-col items-center justify-center">
                <span class="text-[10px] text-muted uppercase" id="txtWorst">Worst</span>
                <span class="text-xl font-mono font-bold text-red-400" id="kpiWorst">0s</span>
                <span class="text-[8px] text-muted opacity-50" id="kpiWorstDate">--</span>
            </div>
             <div class="glass-card p-3 flex flex-col items-center justify-center">
                <span class="text-[10px] text-muted uppercase" id="txtRate">Drop Rate</span>
                <span class="text-xl font-mono font-bold text-violet-400" id="kpiDropRate">0%</span>
            </div>
        </div>
        
        <!-- Trend Chart (Top) -->
        <div class="glass-card p-6 fade-in-up" style="animation-delay: 200ms;">
             <h3 class="text-xs font-bold uppercase tracking-widest text-muted mb-4 flex items-center">
                <span class="w-1 h-3 bg-theme mr-2 rounded-full" style="background: var(--c-primary)"></span>
                <span id="txtTrend">趋势分析</span>
            </h3>
            <div class="h-[250px] w-full">
                <canvas id="trendChart"></canvas>
            </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in-up" style="animation-delay: 250ms;">
             <div class="glass-card p-6 flex flex-col">
                <h3 class="text-xs font-bold uppercase tracking-widest text-muted mb-4 flex items-center">
                    <span class="w-1 h-3 bg-theme mr-2 rounded-full" style="background: var(--c-primary)"></span>
                    <span id="txtSceneDist">场景分布</span>
                </h3>
                <div class="flex-1 relative min-h-[200px]">
                     <canvas id="sceneChart"></canvas>
                      <div id="sceneChartCenter" class="absolute inset-0 flex items-center justify-center pointer-events-none flex-col opacity-0 transition-opacity duration-300">
                        <span class="text-2xl font-bold text-white" id="centerPercent">0%</span>
                    </div>
                </div>
            </div>
            
             <div class="glass-card p-6 flex flex-col">
                <h3 class="text-xs font-bold uppercase tracking-widest text-muted mb-4 flex items-center">
                    <span class="w-1 h-3 mr-2 rounded-full" style="background: var(--c-secondary)"></span>
                    <span id="txtQualityDist">品质分析</span>
                </h3>
                <div class="flex-1 relative min-h-[200px]">
                     <canvas id="dropQualityChart"></canvas>
                </div>
            </div>

             <div class="glass-card p-6 flex flex-col">
                <h3 class="text-xs font-bold uppercase tracking-widest text-muted mb-4 flex items-center">
                    <span class="w-1 h-3 mr-2 rounded-full" style="background: var(--c-success)"></span>
                    <span id="txtPerfDist">效率分析</span>
                </h3>
                <div class="flex-1 min-h-[200px]">
                     <canvas id="scenePerformanceChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="glass-card fade-in-up overflow-hidden" style="animation-delay: 350ms;">
             <div class="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
                <h3 class="text-xs font-bold uppercase tracking-widest text-muted"><i class="fa-solid fa-list mr-2"></i><span id="txtLog">运行记录</span></h3>
                <span class="text-[10px] text-muted font-mono" id="tableCount">--</span>
            </div>
            <div class="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table class="w-full text-left text-xs">
                    <thead class="text-[10px] text-muted uppercase bg-white/5 sticky top-0 backdrop-blur-md">
                        <tr>
                            <th class="px-6 py-3 font-medium">Time</th>
                            <th class="px-6 py-3 font-medium">Scene</th>
                            <th class="px-6 py-3 font-medium text-right">Duration</th>
                            <th class="px-6 py-3 font-medium">Drops</th>
                        </tr>
                    </thead>
                    <tbody id="runTableBody" class="divide-y divide-white/5 font-mono text-gray-400">
                    </tbody>
                </table>
            </div>
        </div>
        
        </div> <!-- End Report View -->
        
        <!-- Grail View -->
        <div id="grailView" class="hidden space-y-6 fade-in-up" style="animation-delay: 100ms;">
            
            <!-- 1. Total Summary Dashboard -->
            <div class="glass-card p-6 text-center overflow-hidden relative">
                 <h2 class="text-2xl font-cinzel font-bold text-theme mb-4" id="grailTitle">Sanctuary Grail</h2>
                 <div class="flex justify-center items-center gap-12 relative z-10">
                     <div class="text-right">
                         <div class="text-[10px] text-muted tracking-widest uppercase">Collected</div>
                         <div class="text-3xl font-mono font-bold text-white shadow-text" id="grailCollected">0</div>
                     </div>
                     <div class="relative w-24 h-24 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-black/40 rounded-full border border-white/5">
                         <div id="grailCircle" class="absolute inset-0 rounded-full transition-all duration-1000" style="background: conic-gradient(var(--c-primary) 0%, transparent 0%); mask-image: radial-gradient(transparent 60%, black 61%); -webkit-mask-image: radial-gradient(transparent 60%, black 61%);"></div>
                         <span class="text-lg font-mono font-bold text-theme" id="grailPercent">0%</span>
                     </div>
                     <div class="text-left">
                         <div class="text-[10px] text-muted tracking-widest uppercase">Total</div>
                         <div class="text-3xl font-mono font-bold text-muted" id="grailTotal">0</div>
                     </div>
                 </div>
            </div>

            <!-- 2. Split Dashboards (Unique / Set / Runes) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <!-- Unique -->
                 <div class="glass-card p-4 flex flex-col items-center">
                     <h3 class="text-xs font-bold uppercase tracking-widest mb-3" style="color: #d4af37">Uniques</h3>
                     <div class="relative w-16 h-16 flex items-center justify-center">
                         <div id="circleUnique" class="absolute inset-0 rounded-full transition-all duration-1000" style="background: conic-gradient(#d4af37 0%, transparent 0%); mask-image: radial-gradient(transparent 60%, black 61%); -webkit-mask-image: radial-gradient(transparent 60%, black 61%);"></div>
                         <span class="text-xs font-mono font-bold text-[#d4af37]" id="pctUnique">0%</span>
                     </div>
                     <div class="mt-2 text-xs font-mono opacity-70"><span id="countUnique">0</span> / <span id="totalUnique">0</span></div>
                 </div>
                 
                 <!-- Set -->
                 <div class="glass-card p-4 flex flex-col items-center">
                     <h3 class="text-xs font-bold uppercase tracking-widest mb-3" style="color: #22c55e">Sets</h3>
                     <div class="relative w-16 h-16 flex items-center justify-center">
                         <div id="circleSet" class="absolute inset-0 rounded-full transition-all duration-1000" style="background: conic-gradient(#22c55e 0%, transparent 0%); mask-image: radial-gradient(transparent 60%, black 61%); -webkit-mask-image: radial-gradient(transparent 60%, black 61%);"></div>
                         <span class="text-xs font-mono font-bold text-[#22c55e]" id="pctSet">0%</span>
                     </div>
                     <div class="mt-2 text-xs font-mono opacity-70"><span id="countSet">0</span> / <span id="totalSet">0</span></div>
                 </div>

                 <!-- Runes -->
                 <div class="glass-card p-4 flex flex-col items-center">
                     <h3 class="text-xs font-bold uppercase tracking-widest mb-3" style="color: #ffa500">Runes</h3>
                     <div class="relative w-16 h-16 flex items-center justify-center">
                         <div id="circleRunes" class="absolute inset-0 rounded-full transition-all duration-1000" style="background: conic-gradient(#ffa500 0%, transparent 0%); mask-image: radial-gradient(transparent 60%, black 61%); -webkit-mask-image: radial-gradient(transparent 60%, black 61%);"></div>
                         <span class="text-xs font-mono font-bold text-[#ffa500]" id="pctRunes">0%</span>
                     </div>
                     <div class="mt-2 text-xs font-mono opacity-70"><span id="countRunes">0</span> / <span id="totalRunes">0</span></div>
                 </div>
            </div>

            
            <!-- Grail Navigation (Tabs) -->
            <div class="grail-tabs">
                <button class="grail-tab active" onclick="switchGrailTab('unique')">Unique</button>
                <button class="grail-tab" onclick="switchGrailTab('set')">Set</button>
                <button class="grail-tab" onclick="switchGrailTab('runes')">Runes</button>
            </div>
            
            <!-- Grail Grid Container -->
            <div id="grailContainer" class="space-y-6"></div>
        </div>

        <footer class="text-center text-zinc-600 text-[10px] pt-8 pb-4 font-mono opacity-50">
            GENERATED BY D2 RUNNER • <span id="genTime"></span>
        </footer>

    </div>

    <script src="data.js"></script>
    <script>
        // === Data & State ===
        let globalData = { runs: [], scenes: [], items: [] };
        let activeFilter = { sceneId: null, dateStart: null, dateEnd: null, quality: null }; 
        let charts = {};
        let currentLang = localStorage.getItem('dashboard-lang') || 'CN';
        
        let kpiState = { runs: 0, time: 0, drops: 0, unique: 0, pb: 0, worst: 0, dropRate: 0, avg: 0 };
        let currentView = 'report';

        // === I18n ===

        // === I18n ===
        const i18n = {
            CN: {
                title: '庇护之地战报', sub: 'Sanctuary Analytics Dashboard',
                filtering: '正在筛选', runs: '总场次', time: '总耗时', drops: '总掉落', unique: '稀有掉落',
                scene: '场景分布', quality: '品质分析', perf: '效率分析', trend: '趋势分析', log: '运行记录',
                pb: '最速纪录 (PB)', avg: '平均耗时', worst: '最慢纪录', rate: '掉落概率',
                noData: '无数据源',
                viewReport: '战报分析', viewGrail: '收藏图鉴',
                grailTitle: '全收藏进度'
            },
            EN: {
                title: 'Sanctuary Report', sub: 'Sanctuary Analytics Dashboard',
                filtering: 'Filtering', runs: 'Total Runs', time: 'Total Time', drops: 'Total Drops', unique: 'Unique Drops',
                scene: 'Scene Dist', quality: 'Quality Dist', perf: 'Performance', trend: 'Trend', log: 'Run Log',
                pb: 'Personal Best', avg: 'Avg Time', worst: 'Worst Time', rate: 'Drop Rate',
                noData: 'No Data',
                viewReport: 'REPORT', viewGrail: 'GRAIL',
                grailTitle: 'Grail Collection'
            }
        };

        function t(k) { return i18n[currentLang][k] || k; }

        // === Theme System ===
        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('d2-theme', theme);
            document.querySelectorAll('.theme-btn').forEach(b => {
                b.classList.toggle('active', b.getAttribute('onclick').includes(theme));
            });
            // Update chart colors by re-rendering
            if(globalData.runs.length > 0) applyFilters();
        }

        function getThemeColor(varName) {
            return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        }

        // === Init ===
        window.onload = function() {
            // Restore theme
            const savedTheme = localStorage.getItem('d2-theme') || 'sanctuary';
            setTheme(savedTheme);

            if (typeof RUN_DATA !== 'undefined') {
                globalData = RUN_DATA;
                if (globalData.customItems) globalData.items = [...globalData.items, ...globalData.customItems];
                
                document.getElementById('reportDate').innerText = new Date().toLocaleDateString();
                document.getElementById('genTime').innerText = new Date().toLocaleString();
                updateLangUI();
                applyFilters();
                
                if (globalData.initialView === 'grail') {
                    switchView('grail');
                }
            } else {
                document.body.innerHTML = '<div class="flex h-screen items-center justify-center text-theme">' + t('noData') + '</div>';
            }
        };

        function toggleDashLang() {
            currentLang = currentLang === 'CN' ? 'EN' : 'CN';
            localStorage.setItem('dashboard-lang', currentLang);
            updateLangUI();
        }

        function updateLangUI() {
            const data = i18n[currentLang];
            document.getElementById('dashTitle').innerText = data.title;
            document.getElementById('dashSubtitle').innerText = data.sub;
            document.getElementById('langToggleText').innerText = currentLang === 'CN' ? 'EN' : 'CN';
            
            document.getElementById('txtRuns').innerText = data.runs;
            document.getElementById('txtTime').innerText = data.time;
            document.getElementById('txtDrops').innerText = data.drops;
            document.getElementById('txtUnique').innerText = data.unique;
            
            document.getElementById('txtPB').innerText = data.pb;
            document.getElementById('txtAvg').innerText = data.avg;
            document.getElementById('txtWorst').innerText = data.worst;
            document.getElementById('txtRate').innerText = data.rate;
            
            document.getElementById('txtSceneDist').innerText = data.scene;
            document.getElementById('txtQualityDist').innerText = data.quality;
            document.getElementById('txtPerfDist').innerText = data.perf;
            document.getElementById('txtTrend').innerText = data.trend;
            document.getElementById('txtLog').innerText = data.log;
            
            if(document.getElementById('filteringText')) document.getElementById('filteringText').innerText = data.filtering;
            
            document.getElementById('btnViewReport').innerText = data.viewReport;
            document.getElementById('btnViewGrail').innerText = data.viewGrail;
            document.getElementById('grailTitle').innerText = data.grailTitle;
        }

        function switchView(view) {
            currentView = view;
            document.getElementById('reportView').classList.toggle('hidden', view !== 'report');
            document.getElementById('grailView').classList.toggle('hidden', view !== 'grail');
            
            document.getElementById('btnViewReport').classList.toggle('active', view === 'report');
            document.getElementById('btnViewGrail').classList.toggle('active', view === 'grail');
            
            if(view === 'grail') renderGrail();
        }

        let activeGrailTab = 'unique';

        // === Grail Logic ===
        function renderGrail() {
            // Re-render every time in case tab changed? Or just toggle visibility?
            // Better to re-render to keep DOM tight, or render all and toggle.
            // Let's render all tabs but hidden, or just render active.
            
            const container = document.getElementById('grailContainer');
            
            // Calculate collected
            const collected = new Set();
            globalData.runs.forEach(r => {
                if(r.drops) r.drops.forEach(d => collected.add(d));
            });
            
            // Stats
            const total = globalData.items.length;
            const count = collected.size;
            const pct = total > 0 ? Math.round(count / total * 100) : 0;
            
            animateNumber('grailCollected', 0, count);
            document.getElementById('grailTotal').innerText = total;
            document.getElementById('grailPercent').innerText = pct + '%';
            document.getElementById('grailCircle').style.background = 'conic-gradient(var(--c-primary) ' + pct + '%, transparent ' + pct + '%)';

            // Group Items
            const groups = {
                'runes': { name: 'Runes & Words', items: [], color: '#ffa500' },
                'set': { name: 'Set Items', items: [], color: '#22c55e' },
                'unique': { name: 'Uniques', items: [], color: '#d4af37' }
            };
            
            globalData.items.forEach(item => {
                let r = String(item.rarity || '1');
                const c = (item.color || '').toLowerCase();
                // Fallback: If color is Green, force Set
                if (c.includes('00ff00') || c.includes('22c55e')) r = '2';
                
                if(r === '1') groups.unique.items.push(item);
                else if(r === '2') groups.set.items.push(item);
                else if(r === '3' || r === '4') groups.runes.items.push(item);
                else groups.unique.items.push(item);
            });
            
            // Update Mini Dashboards (Unique, Set, Runes)
            const updateMini = (id, group) => {
                const grpTotal = group.items.length;
                const grpCollected = group.items.filter(i => collected.has(i._id)).length;
                const grpPct = grpTotal > 0 ? Math.round(grpCollected / grpTotal * 100) : 0;
                
                animateNumber('count' + id, 0, grpCollected);
                if(document.getElementById('total' + id)) document.getElementById('total' + id).innerText = grpTotal;
                if(document.getElementById('pct' + id)) document.getElementById('pct' + id).innerText = grpPct + '%';
                if(document.getElementById('circle' + id)) document.getElementById('circle' + id).style.background = 'conic-gradient(' + group.color + ' ' + grpPct + '%, transparent ' + grpPct + '%)';
            };
            
            updateMini('Unique', groups.unique);
            updateMini('Set', groups.set);
            updateMini('Runes', groups.runes);
            
            // Render Active Tab
            const g = groups[activeGrailTab];
            if(!g) return;

            // Generate HTML for Active Tab
            let html = '<div class="fade-in-up">';
            html += '<div class="grail-stash">';
            
            // Sort? Maybe by ID or Name. Items usually sorted in file.
            g.items.forEach(item => {
                const isCollected = collected.has(item._id);
                const name = currentLang === 'CN' ? item.name_zh : item.name;
                const color = item.color || g.color; 
                
                const cls = isCollected ? 'grail-slot found' : 'grail-slot';
                const style = '--slot-color:' + color;
                
                html += '<div class="' + cls + '" style="' + style + '" title="' + name + '">';
                html += '<span class="grail-slot-name">' + name + '</span>';
                html += '</div>';
            });
            html += '</div></div>';
            
            container.innerHTML = html;
        }

        function switchGrailTab(tab) {
            activeGrailTab = tab;
            // Update buttons
            document.querySelectorAll('.grail-tab').forEach(b => {
                b.classList.toggle('active', b.getAttribute('onclick').includes(tab));
            });
            renderGrail();
        }


        // === Filter Logic ===
        function resetFilter() {
            activeFilter = { sceneId: null, dateStart: null, dateEnd: null, quality: null };
            applyFilters();
        }

        function applyFilters() {
            let filtered = globalData.runs;

            if (activeFilter.sceneId) filtered = filtered.filter(r => r.scene_id === activeFilter.sceneId);
            if (activeFilter.quality) {
                filtered = filtered.filter(r => r.drops && r.drops.some(did => getQualityCode(resolveItem(did)) === activeFilter.quality));
            }
            if (activeFilter.dateStart && activeFilter.dateEnd) {
                filtered = filtered.filter(r => r.date_str >= activeFilter.dateStart && r.date_str <= activeFilter.dateEnd);
            }

            updateFilterUI();
            updateKPI(filtered);
            renderTable(filtered);
            
            // Charts
            const primary = getThemeColor('--c-primary');
            const secondary = getThemeColor('--c-secondary');
            const success = getThemeColor('--c-success');
            
            renderSceneChart(globalData.runs, primary);
            renderQualityChart(filtered.length ? filtered : globalData.runs);
            renderPerfChart(filtered.length ? filtered : globalData.runs);
            renderTrendChart(activeFilter.sceneId ? filtered : globalData.runs);
        }

        function updateFilterUI() {
            const el = document.getElementById('filterStatus');
            const txt = document.getElementById('filterName');
            const parts = [];
            
            if (activeFilter.sceneId) parts.push(resolveSceneName(activeFilter.sceneId));
            if (activeFilter.quality) parts.push('Q' + activeFilter.quality);
            if (activeFilter.dateStart) parts.push(activeFilter.dateStart === activeFilter.dateEnd ? activeFilter.dateStart : activeFilter.dateStart + '~');

            if (parts.length) {
                el.classList.remove('hidden');
                txt.innerText = parts.join(' + ');
            } else {
                el.classList.add('hidden');
            }
        }

        // === Renderers ===
        function updateKPI(runs) {
            const totalTime = runs.reduce((a, b) => a + b.duration_ms, 0);
            const totalDrops = runs.reduce((a, b) => a + (b.drops?.length || 0), 0);
            const unique = new Set();
            let pb = Infinity, worst = 0, pbDate = '', worstDate = '';

            runs.forEach(r => {
                if(r.drops) r.drops.forEach(d => unique.add(d));
                if(r.duration_ms < pb) { pb = r.duration_ms; pbDate = r.date_str; }
                if(r.duration_ms > worst) { worst = r.duration_ms; worstDate = r.date_str; }
            });

            const uniqueCount = unique.size;
            const dropRate = runs.length ? (runs.filter(r => r.drops?.length).length / runs.length) * 100 : 0;
            const avgTime = runs.length ? totalTime / runs.length : 0;

            // Animations
            animateNumber('kpiRuns', kpiState.runs, runs.length);
            animateNumber('kpiDrops', kpiState.drops, totalDrops);
            animateNumber('kpiUnique', kpiState.unique, uniqueCount);
            
            animateTime('kpiTime', kpiState.time, totalTime);
            animateTime('kpiAvg', kpiState.avg, avgTime);
            animateTime('kpiPB', kpiState.pb === Infinity ? 0 : kpiState.pb, pb === Infinity ? 0 : pb);
            animateTime('kpiWorst', kpiState.worst, worst);
            animateNumber('kpiDropRate', kpiState.dropRate, dropRate, 1, '%');
            
            document.getElementById('kpiPBDate').innerText = pbDate;
            document.getElementById('kpiWorstDate').innerText = worstDate;

            // Update State
            kpiState = { runs: runs.length, time: totalTime, drops: totalDrops, unique: uniqueCount, pb: pb, worst: worst, avg: avgTime, dropRate: dropRate };
        }

        function renderTable(runs) {
            const tbody = document.getElementById('runTableBody');
            tbody.innerHTML = '';
            document.getElementById('tableCount').innerText = Math.min(runs.length, 100) + ' / ' + runs.length;
            
            runs.slice(0, 100).forEach(r => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-white/5 transition-colors border-b border-white/5';
                
                let dropsHtml = '<span class="text-zinc-600">-</span>';
                if(r.drops && r.drops.length) {
                    dropsHtml = r.drops.map(did => {
                        const item = resolveItem(did);
                        return '<span class="inline-block px-1 py-0.5 rounded bg-black/50 border border-white/10 text-[9px] mr-1" style="color:' + item.color + '">' + item.name_zh + '</span>';
                    }).join('');
                }

                // Scene name with TZ purple color
                const sceneColor = r.is_tz ? 'var(--c-secondary)' : 'inherit';
                const sceneName = resolveSceneName(r.scene_id);

                tr.innerHTML = 
                    '<td class="px-6 py-2 text-muted">' + new Date(r.timestamp).toLocaleTimeString() + '</td>' +
                    '<td class="px-6 py-2" style="color:' + sceneColor + '">' + sceneName + '</td>' +
                    '<td class="px-6 py-2 text-right ' + getTimeColor(r.duration_ms) + '">' + formatTime(r.duration_ms) + '</td>' +
                    '<td class="px-6 py-2">' + dropsHtml + '</td>';
                tbody.appendChild(tr);
            });
        }

        // === Chart Wrappers ===
        function renderSceneChart(runs, color) {
            const ctx = document.getElementById('sceneChart').getContext('2d');
            const counts = {};
            runs.forEach(r => counts[r.scene_id] = (counts[r.scene_id] || 0) + 1);
            const labels = Object.keys(counts).map(id => resolveSceneName(id));
            const data = Object.values(counts);
            const keys = Object.keys(counts);
            const colors = [color, getThemeColor('--c-secondary'), getThemeColor('--c-success'), getThemeColor('--c-warn'), '#ef4444', '#8b5cf6'];
            
            const offsets = keys.map(k => k === activeFilter.sceneId ? 20 : 0);

             if (charts.scene) {
                charts.scene.data.labels = labels;
                charts.scene.data.datasets[0].data = data;
                charts.scene.data.datasets[0].backgroundColor = colors;
                charts.scene.data.datasets[0].offset = offsets;
                charts.scene.update();
            } else {
                charts.scene = new Chart(ctx, {
                    type: 'doughnut',
                    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, offset: offsets, hoverOffset: 15 }] },
                    options: { 
                        cutout: '70%', responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        onClick: (e, els) => {
                             if(els.length) {
                                 const idx = els[0].index;
                                 const id = Object.keys(counts)[idx];
                                 activeFilter.sceneId = activeFilter.sceneId === id ? null : id;
                                 applyFilters();
                             }
                        }
                    }
                });
            }
            
            if(activeFilter.sceneId) {
                const total = runs.length;
                const filtered = runs.filter(r => r.scene_id === activeFilter.sceneId).length;
                const pct = total ? Math.round(filtered/total*100) : 0;
                document.getElementById('sceneChartCenter').style.opacity = 1;
                document.getElementById('centerPercent').innerText = pct + '%';
            } else {
                 document.getElementById('sceneChartCenter').style.opacity = 0;
            }
        }

        function renderQualityChart(runs) {
             const ctx = document.getElementById('dropQualityChart').getContext('2d');
             const stats = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
             runs.forEach(r => r.drops?.forEach(d => {
                 const q = getQualityCode(resolveItem(d));
                 if(stats[q] !== undefined) stats[q]++;
             }));
             
             // Map correctly: Keys are 5->1, so data must be mapped 5->1
             const keys = ['5','4','3','2','1'];
             const data = keys.map(k => stats[k]); 
             
             if (charts.quality) {
                 charts.quality.data.datasets[0].data = data;
                 charts.quality.update();
             } else {
                 charts.quality = new Chart(ctx, {
                     type: 'doughnut',
                     data: { 
                         labels: ['Leg/Rune', 'Unique', 'Rare', 'Magic', 'Base'], 
                         datasets: [{ 
                             data, 
                             backgroundColor: ['#ea580c', '#d4af37', '#facc15', '#3b82f6', '#71717a'], 
                             borderWidth: 0,
                             hoverOffset: 15
                        }] 
                     },
                     options: { 
                         cutout: '70%', responsive: true, maintainAspectRatio: false,
                         plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => c.label + ': ' + c.raw } } }
                     }
                 });
             }
        }
        
        function renderPerfChart(runs) {
             const ctx = document.getElementById('scenePerformanceChart').getContext('2d');
             const stats = {};
             runs.forEach(r => {
                 if(!stats[r.scene_id]) stats[r.scene_id] = {c:0, t:0};
                 stats[r.scene_id].c++; stats[r.scene_id].t += r.duration_ms;
             });
             // Convert to seconds
             const scenes = Object.entries(stats).map(([k,v]) => ({name: resolveSceneName(k), avg: Math.round(v.t/v.c/1000)})).sort((a,b)=>a.avg - b.avg).slice(0, 8);
             
             const bg = scenes.map(s => s.avg < 45 ? '#10b981' : s.avg < 90 ? '#f59e0b' : '#ef4444');
             
             if(charts.perf) {
                 charts.perf.data.labels = scenes.map(s=>s.name);
                 charts.perf.data.datasets[0].data = scenes.map(s=>s.avg);
                 charts.perf.data.datasets[0].backgroundColor = bg;
                 charts.perf.update();
             } else {
                 charts.perf = new Chart(ctx, {
                     type: 'bar',
                     data: { labels: scenes.map(s=>s.name), datasets: [{ data: scenes.map(s=>s.avg), backgroundColor: bg, borderRadius: 4 }] },
                     options: { 
                         indexAxis: 'y', responsive: true, maintainAspectRatio: false, 
                         plugins: { legend: {display:false} }, 
                         scales: { 
                             x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: v => v+'s' } }, 
                             y: { grid: { display: false } } 
                         } 
                    }
                 });
             }
        }
        
        function renderTrendChart(runs) {
            const ctx = document.getElementById('trendChart').getContext('2d');
            const daily = {};
            const drops = {};
            runs.forEach(r => {
                const d = r.date_str || new Date(r.timestamp).toLocaleDateString();
                daily[d] = (daily[d]||0)+1;
                drops[d] = (drops[d]||0) + (r.drops ? r.drops.length : 0);
            });
            const labels = Object.keys(daily).sort();
            const dataRun = labels.map(k=>daily[k]);
            const dataDrop = labels.map(k=>drops[k]);
            
            const color = getThemeColor('--c-primary');
            const colorSec = getThemeColor('--c-secondary');
            const rgb = getThemeColor('--c-primary-rgb');
            const gradient = ctx.createLinearGradient(0,0,0,300);
            gradient.addColorStop(0, 'rgba(' + rgb + ', 0.2)');
            gradient.addColorStop(1, 'transparent');

            // Point styles based on selection
            const pointColors = labels.map(d => {
                if (activeFilter.dateStart && d >= activeFilter.dateStart && d <= activeFilter.dateEnd) return color;
                return 'rgba(0,0,0,0)';
            });
            const pointRadii = labels.map(d => {
                if (activeFilter.dateStart && d >= activeFilter.dateStart && d <= activeFilter.dateEnd) return 5;
                return 0; 
            });

             if(charts.trend) {
                 charts.trend.data.labels = labels;
                 charts.trend.data.datasets[0].data = dataRun;
                 charts.trend.data.datasets[0].borderColor = color;
                 charts.trend.data.datasets[0].backgroundColor = gradient;
                 charts.trend.data.datasets[0].pointBackgroundColor = pointColors;
                 charts.trend.data.datasets[0].pointRadius = pointRadii;
                 
                 // Update 2nd dataset
                 if(charts.trend.data.datasets[1]) {
                     charts.trend.data.datasets[1].data = dataDrop;
                     charts.trend.data.datasets[1].borderColor = colorSec;
                 }
                 
                 charts.trend.update();
             } else {
                 charts.trend = new Chart(ctx, {
                     type: 'line',
                     data: { 
                         labels, 
                         datasets: [
                            { 
                                label: 'Run',
                                data: dataRun, 
                                borderColor: color, 
                                backgroundColor: gradient, 
                                fill: true, 
                                tension: 0.4, 
                                pointBackgroundColor: pointColors, 
                                pointRadius: pointRadii,
                                pointHoverRadius: 6,
                                pointHitRadius: 20,
                                order: 2
                            },
                            {
                                label: 'Drops',
                                data: dataDrop,
                                borderColor: colorSec,
                                borderDash: [5, 5],
                                borderWidth: 1,
                                tension: 0.4,
                                pointRadius: 0,
                                pointHoverRadius: 0,
                                fill: false,
                                order: 1
                            }
                        ] 
                     },
                     options: { 
                         responsive: true, 
                         maintainAspectRatio: false, 
                         plugins: { legend: {display:false} }, 
                         scales: { x: { display: false }, y: { grid: { color: 'rgba(255,255,255,0.05)' } } },
                         interaction: { mode: 'index', intersect: false },
                         onClick: (e, els) => {
                             // Always use the first element (runs) index for date filtering
                             if(els.length) {
                                 const idx = els[0].index; 
                                 handleDateSelection(labels[idx]);
                             }
                         }
                     }
                 });
             }
        }
        
        function handleDateSelection(date) {
            if (!activeFilter.dateStart || activeFilter.dateStart !== activeFilter.dateEnd) {
                // New single selection or reset range
                activeFilter.dateStart = date;
                activeFilter.dateEnd = date;
            } else {
                // Extend range (or unselect if same)
                if (date === activeFilter.dateStart) {
                    activeFilter.dateStart = null;
                    activeFilter.dateEnd = null;
                } else {
                    if (date < activeFilter.dateStart) activeFilter.dateStart = date;
                    else activeFilter.dateEnd = date;
                }
            }
            applyFilters();
        }

        // === Helpers ===
        function resolveItem(id) {
             const std = globalData.items.find(i => i._id === id);
             if (std) return std;
             if (id.startsWith('custom:')) {
                 const [_, n, q] = id.split(':');
                 // Sync with runStore.ts colors
                 const cm = {
                    '1': '#a0aec0', // Normal
                    '2': '#4169e1', // Magic
                    '3': '#ffd700', // Rare
                    '4': '#ff8c00', // Unique
                    '5': '#ff6b6b'  // Rune
                 };
                 return { _id: id, name_zh: n, color: cm[q] || '#fff', rarity: q };
             }
             return { name_zh: 'Unknown', color: '#666', rarity: '1' };
        }
        
        function resolveSceneName(id) {
            return globalData.scenes.find(s => s.name === id)?.name || id;
        }

        function getQualityCode(item) { 
             // Prioritize Color because Standard Items have unreliable rarity (e.g. Uniques are '1')
             if (item?.color) {
                 const c = item.color.toLowerCase();
                 // Runes (Standard & Store)
                 if (c === '#ffa500' || c === '#ff6b6b' || c === '#ea580c') return '5';
                 
                 // Unique (Standard & Store) + Set (#00ff00)
                 if (c === '#d4af37' || c === '#ff8c00' || c === '#00ff00') return '4';
                 
                 // Rare
                 if (c === '#ffd700' || c === '#facc15' || c === '#ffff00') return '3';
                 
                 // Magic
                 if (c === '#4169e1' || c === '#3b82f6') return '2';
                 
                 // Base
                 if (c === '#a0aec0' || c === '#a1a1aa' || c === '#ffffff') return '1';
             }
             
             // Fallback to rarity if color lookup failed (shouldn't happen for valid items)
             return item?.rarity || '1';
        }
        
        function formatTime(ms) {
            if(!ms) return '0s';
            const s = Math.floor(ms/1000);
            return s > 60 ? Math.floor(s/60) + 'm ' + (s%60) + 's' : s + 's';
        }
        
        function getTimeColor(ms) { return ms < 45000 ? 'text-emerald-400' : ms > 90000 ? 'text-red-400' : 'text-zinc-400'; }

        // Animation Helpers
        function animateNumber(id, start, end, decimals = 0, suffix = '') {
            const obj = document.getElementById(id);
            if (!obj) return;
            if (start === end) {
                obj.innerText = end.toFixed(decimals) + suffix;
                return;
            }
            const duration = 800;
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                // Ease out quart
                const ease = 1 - Math.pow(1 - progress, 4);
                const current = start + (end - start) * ease;
                obj.innerText = current.toFixed(decimals) + suffix;
                if (progress < 1) window.requestAnimationFrame(step);
                else obj.innerText = end.toFixed(decimals) + suffix;
            };
            window.requestAnimationFrame(step);
        }

        function animateTime(id, startMs, endMs) {
            const obj = document.getElementById(id);
            if (!obj) return;
            if (startMs === endMs) {
                obj.innerText = formatTime(endMs);
                return;
            }
            const duration = 800;
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 4);
                const current = startMs + (endMs - startMs) * ease;
                obj.innerText = formatTime(current);
                if (progress < 1) window.requestAnimationFrame(step);
                else obj.innerText = formatTime(endMs);
            };
            window.requestAnimationFrame(step);
        }

    </script>
</body>
</html>
`;
