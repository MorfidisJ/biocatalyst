        // 0. Brutalist Loader & Preloader
        const loader = document.getElementById('brutal-loader');
        const loaderFill = document.getElementById('loaderFill');
        const loaderLog = document.getElementById('loaderLog');
        
        const loadingLogs = [
            "> Synthesizing DNA strands...",
            "> Compiling Kirby Krackle Engine...",
            "> Fetching exclusive merch assets...",
            "> Allocating compute nodes...",
            "> Securing funding..."
        ];
        
        let loadProgress = 0;
        let logIdx = 0;
        let isWindowLoaded = false;
        
        window.addEventListener('load', () => {
            isWindowLoaded = true;
            loadState();
        });

        const simInterval = setInterval(() => {
            // Fast progress until 85%, then wait for actual load
            if (loadProgress < 85 || isWindowLoaded) {
                loadProgress += Math.random() * 15 + 5;
            }
            
            if (loadProgress > 100) loadProgress = 100;
            loaderFill.style.width = loadProgress + '%';
            
            let expectedLogIdx = Math.floor((loadProgress / 100) * loadingLogs.length);
            if (expectedLogIdx >= loadingLogs.length) expectedLogIdx = loadingLogs.length - 1;
            if (expectedLogIdx > logIdx) {
                logIdx = expectedLogIdx;
                loaderLog.innerText = loadingLogs[logIdx];
            }

            if (loadProgress >= 100 && isWindowLoaded) {
                clearInterval(simInterval);
                loaderLog.innerText = "> SYSTEM ONLINE. READY TO BUILD.";
                loaderLog.style.color = "var(--yellow)";
                
                setTimeout(() => {
                    loader.style.transform = 'translateY(-100vh)';
                    setTimeout(() => loader.remove(), 800);
                }, 600);
            }
        }, 120);

        // 1. Dynamic Canvas Animation (Kirby Krackle) with Mouse Physics
        const canvas = document.getElementById('bgCanvas');
        const ctx = canvas.getContext('2d');
        let width, height;
        let isBiohazard = false;
        const MOUSE_REPEL_RADIUS = 150;
        const MOUSE_REPEL_FORCE = 8;
        const MAX_BUBBLES = 60;
        let mouseCanvasX = -999;
        let mouseCanvasY = -999;

        // Matrix Rain State
        let canvasMode = 'kirby'; 
        const matrixChars = ['A', 'T', 'C', 'G', 'U', 'H₂O', 'CO₂', '🧬', '🔬', '☣️'];
        const fontSize = 16;
        let columns = [];

        function initMatrixMode() {
            const colCount = Math.floor(window.innerWidth / fontSize) + 1;
            columns = [];
            for (let i = 0; i < colCount; i++) {
                columns.push({
                    x: i * fontSize,
                    y: Math.random() * -window.innerHeight - 100,
                    speed: Math.random() * 3 + 2
                });
            }
        }

        function drawMatrixRain() {
            ctx.fillStyle = 'rgba(18, 18, 18, 0.08)';
            ctx.fillRect(0, 0, width, height);

            ctx.font = 'bold ' + fontSize + 'px monospace';

            columns.forEach(col => {
                const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                
                if (document.body.classList.contains('cyber-red')) {
                    ctx.fillStyle = '#f43f5e';
                } else if (document.body.classList.contains('biohazard')) {
                    ctx.fillStyle = '#4ade80';
                } else {
                    ctx.fillStyle = '#5c359d'; // Purple in light theme
                }

                ctx.fillText(char, col.x, col.y);

                col.y += col.speed;
                if (col.y > height && Math.random() > 0.975) {
                    col.y = Math.random() * -100;
                    col.speed = Math.random() * 3 + 2;
                }
            });
        }

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            if (canvasMode === 'matrix') initMatrixMode();
        }
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 200);
        });
        resizeCanvas();

        const bubbles = [];
        const numStandardBubbles = 20; 
        const numMassiveBubbles = 4;

        for (let i = 0; i < numStandardBubbles; i++) {
            bubbles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 50 + 15,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2
            });
        }
        
        for (let i = 0; i < numMassiveBubbles; i++) {
            bubbles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 120 + 80,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        // Track mouse position for canvas repulsion
        document.addEventListener('mousemove', (e) => {
            mouseCanvasX = e.clientX;
            mouseCanvasY = e.clientY;
        });
        document.addEventListener('mouseleave', () => {
            mouseCanvasX = -999;
            mouseCanvasY = -999;
        });

        // Click to split: find the closest bubble and divide it
        document.addEventListener('click', (e) => {
            if (bubbles.length >= MAX_BUBBLES) return;
            let closestIdx = -1;
            let closestDist = Infinity;

            bubbles.forEach((b, i) => {
                const dx = b.x - e.clientX;
                const dy = b.y - e.clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < b.r + 60 && dist < closestDist) {
                    closestDist = dist;
                    closestIdx = i;
                }
            });

            if (closestIdx !== -1) {
                const parent = bubbles[closestIdx];
                if (parent.r < 12) return; // too small to split
                const childR = parent.r * 0.65;
                const angle = Math.random() * Math.PI * 2;
                const offset = childR * 1.2;

                // Replace parent with two children
                bubbles.splice(closestIdx, 1,
                    {
                        x: parent.x + Math.cos(angle) * offset,
                        y: parent.y + Math.sin(angle) * offset,
                        r: childR,
                        vx: Math.cos(angle) * 2.5 + parent.vx,
                        vy: Math.sin(angle) * 2.5 + parent.vy
                    },
                    {
                        x: parent.x - Math.cos(angle) * offset,
                        y: parent.y - Math.sin(angle) * offset,
                        r: childR,
                        vx: -Math.cos(angle) * 2.5 + parent.vx,
                        vy: -Math.sin(angle) * 2.5 + parent.vy
                    }
                );
            }
        });

        function animateCanvas() {
            if (canvasMode === 'matrix') {
                drawMatrixRain();
            } else {
                // Background color
                ctx.fillStyle = document.body.classList.contains('cyber-red') ? '#18181b' : (isBiohazard ? '#18181b' : '#f0ebf7');
                ctx.fillRect(0, 0, width, height);

                // Draw grid lines in biohazard mode
                if (isBiohazard) {
                    ctx.strokeStyle = 'rgba(57, 255, 20, 0.06)';
                    ctx.lineWidth = 1;
                    const gridSize = 40;
                    for (let gx = 0; gx < width; gx += gridSize) {
                        ctx.beginPath();
                        ctx.moveTo(gx, 0);
                        ctx.lineTo(gx, height);
                        ctx.stroke();
                    }
                    for (let gy = 0; gy < height; gy += gridSize) {
                        ctx.beginPath();
                        ctx.moveTo(0, gy);
                        ctx.lineTo(width, gy);
                        ctx.stroke();
                    }
                }

                const isCyberRed = document.body.classList.contains('cyber-red');

                // Draw Mycelium connections
                ctx.lineWidth = 1.5;
                for (let i = 0; i < bubbles.length; i++) {
                    for (let j = i + 1; j < bubbles.length; j++) {
                        const dx = bubbles[i].x - bubbles[j].x;
                        const dy = bubbles[i].y - bubbles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const maxDist = 200;
                        if (dist < maxDist) {
                            const opacity = 1 - (dist / maxDist);
                            if (isCyberRed) {
                                ctx.strokeStyle = `rgba(244, 63, 94, ${opacity * 0.5})`;
                            } else if (isBiohazard) {
                                ctx.strokeStyle = `rgba(74, 222, 128, ${opacity * 0.8})`;
                            } else {
                                ctx.strokeStyle = `rgba(17, 17, 17, ${opacity * 0.3})`;
                            }
                            ctx.beginPath();
                            ctx.moveTo(bubbles[i].x, bubbles[i].y);
                            ctx.lineTo(bubbles[j].x, bubbles[j].y);
                            ctx.stroke();
                        }
                    }
                }

                bubbles.forEach(b => {
                    // Mouse repulsion physics
                    const dx = b.x - mouseCanvasX;
                    const dy = b.y - mouseCanvasY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MOUSE_REPEL_RADIUS && dist > 0) {
                        const force = (MOUSE_REPEL_RADIUS - dist) / MOUSE_REPEL_RADIUS * MOUSE_REPEL_FORCE;
                        b.vx += (dx / dist) * force * 0.15;
                        b.vy += (dy / dist) * force * 0.15;
                    }

                    // Dampen velocity slightly so they don't fly off forever
                    b.vx *= 0.995;
                    b.vy *= 0.995;

                    b.x += b.vx;
                    b.y += b.vy;

                    if (b.x - b.r > width) b.x = -b.r;
                    if (b.x + b.r < 0) b.x = width + b.r;
                    if (b.y - b.r > height) b.y = -b.r;
                    if (b.y + b.r < 0) b.y = height + b.r;

                    if (isCyberRed) {
                        ctx.fillStyle = '#f43f5e';
                    } else if (isBiohazard) {
                        ctx.fillStyle = '#bb86fc';
                    } else {
                        ctx.fillStyle = '#111111';
                    }

                    ctx.beginPath();
                    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                    ctx.fill();
                });
            }

            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();

        // 2. Fix and Drive Custom Tracking Cursor
        const cursorDot = document.getElementById('cursorDot');
        let cursorX = -50;
        let cursorY = -50;
        let isCursorMoving = false;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            if (!isCursorMoving) {
                isCursorMoving = true;
                requestAnimationFrame(updateCursor);
            }
        });

        function updateCursor() {
            cursorDot.style.left = cursorX + 'px';
            cursorDot.style.top = cursorY + 'px';
            isCursorMoving = false;
        }

        // Track and Attach Hover Status for Click Elements (Updated with event delegation for dynamic elements)
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.hover-trigger, button, summary, .bento-box, .perk-card, .speaker-card, .sponsor-card, a')) {
                cursorDot.classList.add('cursor-hover');
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.hover-trigger, button, summary, .bento-box, .perk-card, .speaker-card, .sponsor-card, a')) {
                cursorDot.classList.remove('cursor-hover');
            }
        });

        // 3. Schedule View Controller & Filter Engine
        function filterSchedule() {
            const activeTagBtn = document.querySelector('.filter-tag-btn.active');
            const activeTag = activeTagBtn ? activeTagBtn.getAttribute('data-tag') : 'all';

            document.querySelectorAll('.timeline-pane').forEach(pane => {
                const isPaneActive = pane.classList.contains('active');
                const rows = pane.querySelectorAll('.timeline-row');
                let matchCount = 0;

                rows.forEach(row => {
                    const tagsStr = row.getAttribute('data-tags') || '';
                    const tags = tagsStr.split(',').map(t => t.trim());

                    const matchesTag = activeTag === 'all' || tags.includes(activeTag);

                    if (matchesTag) {
                        row.style.display = 'flex';
                        matchCount++;
                    } else {
                        row.style.display = 'none';
                    }
                });

                let emptyMsg = pane.querySelector('.empty-schedule-msg');
                if (matchCount === 0 && isPaneActive) {
                    if (!emptyMsg) {
                        emptyMsg = document.createElement('div');
                        emptyMsg.className = 'empty-schedule-msg';
                        emptyMsg.style.textAlign = 'center';
                        emptyMsg.style.padding = '3rem 1.5rem';
                        emptyMsg.style.fontWeight = 'bold';
                        emptyMsg.style.fontSize = '1.2rem';
                        emptyMsg.style.textTransform = 'uppercase';
                        emptyMsg.style.color = 'var(--pink)';
                        emptyMsg.style.fontFamily = 'monospace';
                        emptyMsg.innerText = '⚠️ NO BIO_EVENTS MATCH TAG CONFIG';
                        pane.appendChild(emptyMsg);
                    }
                } else if (emptyMsg) {
                    emptyMsg.remove();
                }
            });
        }

        // Attach listeners for schedule search & filtering
        document.addEventListener('DOMContentLoaded', () => {
            
            document.querySelectorAll('.filter-tag-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.filter-tag-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    filterSchedule();
                    
                    if (typeof audioCtx !== 'undefined' && audioCtx) {
                        const now = audioCtx.currentTime;
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(500, now);
                        gain.gain.setValueAtTime(0.05, now);
                        gain.gain.linearRampToValueAtTime(0, now + 0.04);
                        osc.start(now);
                        osc.stop(now + 0.04);
                    }
                });
            });
        });

        function switchTab(tabId, btnElement) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            if (btnElement) {
                btnElement.classList.add('active');
            }
            
            if (tabId === 'all') {
                document.querySelectorAll('.timeline-pane').forEach(p => p.classList.add('active'));
            } else {
                document.querySelectorAll('.timeline-pane').forEach(p => p.classList.remove('active'));
                const target = document.getElementById(tabId);
                if (target) {
                    target.classList.add('active');
                }
            }
            filterSchedule();
        }
        window.switchTab = switchTab;


        // 4. Hyper-Marquee Accelerate Loop
        const marqueeBox = document.getElementById('marqueeBox');
        const marqueeText = document.getElementById('marqueeText');
        
        if (marqueeBox && marqueeText && window.matchMedia("(hover: hover)").matches) {
            marqueeBox.addEventListener('mouseenter', () => marqueeText.classList.add('marquee-fast'));
            marqueeBox.addEventListener('mouseleave', () => marqueeText.classList.remove('marquee-fast'));
        }

        // 5. Time Warp Interactive Clock Loop
        const clockFace = document.getElementById('clockFace');
        const hourHand = document.getElementById('hourHand');
        const minuteHand = document.getElementById('minuteHand');
        const secondHand = document.getElementById('secondHand');

        let isTimeWarping = false;
        let warpOffset = 0;
        let warpVelocity = 0;
        let springOffset = 0;
        let springVel = 0;

        if (clockFace && hourHand && minuteHand && secondHand) {
            clockFace.addEventListener('mouseenter', () => { isTimeWarping = true; });
            clockFace.addEventListener('mouseleave', () => { isTimeWarping = false; });

            function updateClockTime() {
                const current = new Date();
                let baseSec = current.getSeconds() + (current.getMilliseconds() / 1000);
                
                if (isTimeWarping) {
                    warpVelocity = Math.min(60, warpVelocity + 0.5);
                    warpOffset += warpVelocity;
                    springOffset = warpOffset;
                } else {
                    warpVelocity = 0;
                    const tension = 0.08;
                    const friction = 0.82;
                    springVel += (0 - springOffset) * tension;
                    springVel *= friction;
                    springOffset += springVel;
                    warpOffset = springOffset;
                }

                const totalSec = baseSec + warpOffset;
                const secRatio = totalSec / 60;
                const minRatio = (totalSec / 60 + current.getMinutes()) / 60;
                const hrRatio = (minRatio + current.getHours()) / 12;

                hourHand.style.transform = `translateX(-50%) rotate(${hrRatio * 360}deg)`;
                minuteHand.style.transform = `translateX(-50%) rotate(${minRatio * 360}deg)`;
                secondHand.style.transform = `translateX(-50%) rotate(${secRatio * 360}deg)`;
                
                requestAnimationFrame(updateClockTime);
            }
            updateClockTime();
        }

        // 6. High Intensity Action Confirmation for Target Button
        const claimBtn = document.getElementById('claimBtn');
        const puncherTool = document.getElementById('puncherTool');
        const ticketContainer = document.getElementById('ticketContainer');
        const printedTicket = document.getElementById('printedTicket');
        const punchedHole = document.getElementById('punchedHole');
        let ticketPrinted = false;
        let isRipped = false;

        if (claimBtn && puncherTool && ticketContainer && printedTicket && punchedHole) {
            claimBtn.addEventListener('mouseenter', () => {
                if (!ticketPrinted) puncherTool.classList.add('active');
            });
            claimBtn.addEventListener('mouseleave', () => {
                if (!ticketPrinted) puncherTool.classList.remove('active');
            });

            claimBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (ticketPrinted) return;
                ticketPrinted = true;
                
                // 1. Punch Animation
                puncherTool.classList.add('punching');
                
                // 2. Drop Star Scrap
                const scrap = document.createElement('div');
                scrap.className = 'star-scrap';
                scrap.innerText = '★';
                const rect = puncherTool.getBoundingClientRect();
                scrap.style.left = rect.left + 20 + 'px';
                scrap.style.top = rect.bottom + 'px';
                document.body.appendChild(scrap);
                setTimeout(() => scrap.remove(), 1000);

                // 3. Update Button
                setTimeout(() => {
                    puncherTool.classList.remove('punching');
                    puncherTool.classList.remove('active');
                    claimBtn.innerHTML = "TICKET PUNCHED 💸";
                    claimBtn.style.backgroundColor = "var(--purple)";
                    claimBtn.style.color = "var(--white)";
                    
                    // 4. Roll out Receipt
                    setTimeout(() => {
                        claimBtn.innerHTML = "PRINTING RECEIPT...";
                        ticketContainer.style.height = printedTicket.scrollHeight + 'px';
                        punchedHole.classList.add('visible');
                    }, 400);
                }, 200);
            });

            // Rip mechanics
            let dragStartX = 0;
            let isDraggingTicket = false;
            
            printedTicket.addEventListener('mousedown', (e) => {
                if (!ticketPrinted || isRipped) return;
                isDraggingTicket = true;
                dragStartX = e.clientX;
            });
            window.addEventListener('mouseup', () => { isDraggingTicket = false; });
            window.addEventListener('mousemove', (e) => {
                if (!isDraggingTicket || isRipped) return;
                const deltaX = Math.abs(e.clientX - dragStartX);
                if (deltaX > 150) { // Rip threshold
                    isRipped = true;
                    isDraggingTicket = false;
                    
                    // Rip effect
                    document.body.style.animation = 'wiggle 0.2s';
                    setTimeout(() => document.body.style.animation = '', 200);
                    
                    const rect = printedTicket.getBoundingClientRect();
                    printedTicket.classList.add('ripped');
                    printedTicket.style.left = rect.left + 'px';
                    printedTicket.style.top = rect.top + 'px';
                    printedTicket.style.width = rect.width + 'px';
                    ticketContainer.style.display = 'none';
                    
                    const ripLine = document.getElementById('ripLine');
                    if (ripLine) ripLine.innerHTML = 'TICKET SECURED';
                    setTimeout(() => {
                        window.open('https://luma.com/ucuahrx5?utm_content=link_in_bio&utm_id=97760_v0_s00_e0_tv3&utm_medium=social&utm_source=ig', '_blank');
                    }, 600);
                    
                    // Confetti
                    for(let i=0; i<40; i++) {
                        const particle = document.createElement('div');
                        particle.className = 'emoji-particle';
                        particle.innerText = Math.random() > 0.5 ? '🎟️' : '💸';
                        particle.style.left = e.clientX + 'px';
                        particle.style.top = e.clientY + 'px';
                        particle.style.animationDuration = (0.5 + Math.random()) + 's';
                        document.body.appendChild(particle);
                        setTimeout(() => particle.remove(), 1500);
                    }
                }
            });
        }

        // 7. Bio-Hazard / Cyber-Red Dark Mode Toggle
        let currentTheme = 0; // 0 = Default, 1 = Biohazard, 2 = Cyber-Red
        let cyberRedUnlocked = false;

        const hazardToggle = document.getElementById('hazardToggle');
        if (hazardToggle) {
            hazardToggle.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent bubble-split on toggle click
                
                let maxTheme = cyberRedUnlocked ? 2 : 1;
                currentTheme = (currentTheme + 1) % (maxTheme + 1);

                document.body.classList.remove('biohazard', 'cyber-red');
                isBiohazard = false;

                if (currentTheme === 1) {
                    document.body.classList.add('biohazard');
                    isBiohazard = true;
                    hazardToggle.innerHTML = '☀️';
                } else if (currentTheme === 2) {
                    document.body.classList.add('cyber-red');
                    hazardToggle.innerHTML = '☢️';
                } else {
                    hazardToggle.innerHTML = '🌙';
                }
            });
        }

        // 10. ARCADE GAME: GENOME SEQUENCER
        let audioCtx = null;
        function initAudio() {
            if (audioCtx) return;
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
            window.audioCtx = audioCtx;
        }

        function playSound(type) {
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            const now = audioCtx.currentTime;
            
            switch(type) {
                case 1: // line clear
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.setValueAtTime(600, now + 0.1);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.2);
                    osc.start(now); osc.stop(now + 0.2);
                    break;
                case 4: // soft drop
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(200, now);
                    gain.gain.setValueAtTime(0.05, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                    osc.start(now); osc.stop(now + 0.05);
                    break;
                case 5: // hard drop kick
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.exponentialRampToValueAtTime(20, now + 0.2);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                    osc.start(now); osc.stop(now + 0.2);
                    break;
            }
        }

        const arcadeTrigger = document.getElementById('arcadeTrigger');
        const arcadeOverlay = document.getElementById('arcadeOverlay');
        const arcadeCloseBtn = document.getElementById('arcadeCloseBtn');
        
        if (arcadeTrigger && arcadeOverlay && arcadeCloseBtn) {
            arcadeTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                arcadeOverlay.classList.add('open');
            });
            arcadeCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                arcadeOverlay.classList.remove('open');
                stopGame();
            });
        }

        const gCanvas = document.getElementById('arcadeScreen');
        let gCtx = null;
        let gWidth = 200;
        let gHeight = 400;
        const btnStart = document.getElementById('arcadeStartBtn');
        const btnRestart = document.getElementById('arcadeRestartBtn');
        const screenStart = document.getElementById('arcadeStartScreen');
        const screenGameover = document.getElementById('arcadeGameoverScreen');

        if (gCanvas) {
            gCtx = gCanvas.getContext('2d');
            gCanvas.width = gWidth;
            gCanvas.height = gHeight;
        }
        
        let gameReq;
        let isPlaying = false;
        
        if (btnStart) btnStart.addEventListener('click', startGame);
        if (btnRestart) btnRestart.addEventListener('click', startGame);
        
        let board = Array(20).fill().map(() => Array(10).fill(0));
        let score = 0;
        let lines = 0;
        let level = 1;

        // Unlocked Milestones state & functions
        let unlockedMilestones = {
            cyberRed: false,
            crtMode: false,
            bioSynth: false,
            matrixRain: false
        };

        function saveState() {
            sessionStorage.setItem('biocatalyst_unlocked_milestones', JSON.stringify(unlockedMilestones));
            sessionStorage.setItem('biocatalyst_cyberRedUnlocked', cyberRedUnlocked ? 'true' : 'false');
            sessionStorage.setItem('biocatalyst_canvasMode', canvasMode);
        }

        function loadState() {
            const stored = sessionStorage.getItem('biocatalyst_unlocked_milestones');
            if (stored) {
                unlockedMilestones = JSON.parse(stored);
                if (unlockedMilestones.cyberRed) {
                    cyberRedUnlocked = true;
                }
                if (unlockedMilestones.crtMode) {
                    document.getElementById('crtToggle').style.display = 'flex';
                }
                if (unlockedMilestones.bioSynth) {
                    document.getElementById('arcadeSynthPad').style.display = 'block';
                }
                if (unlockedMilestones.matrixRain) {
                    canvasMode = 'matrix';
                    initMatrixMode();
                }
            }
        }

        function checkMilestones() {
            let unlockedSomething = false;
            let alertMsg = "";
            
            // Milestone 1: 5 lines - Cyber-Red Mode
            if (lines >= 5 && !unlockedMilestones.cyberRed) {
                unlockedMilestones.cyberRed = true;
                cyberRedUnlocked = true;
                unlockedSomething = true;
                alertMsg = "MUTATION: CYBER-RED THEME!";
                triggerUnlockConfetti();
            }
            
            // Milestone 2: 15 lines - CRT Glitch Vision
            if (lines >= 15 && !unlockedMilestones.crtMode) {
                unlockedMilestones.crtMode = true;
                unlockedSomething = true;
                alertMsg = "UPGRADE: CRT SCANLINE MODE!";
                document.getElementById('crtToggle').style.display = 'flex';
                triggerUnlockConfetti();
            }
            
            // Milestone 3: 30 lines - Bio-Synth Drum Pad
            if (lines >= 30 && !unlockedMilestones.bioSynth) {
                unlockedMilestones.bioSynth = true;
                unlockedSomething = true;
                alertMsg = "HARDWARE: BIO-SYNTH PAD KEYPAD!";
                document.getElementById('arcadeSynthPad').style.display = 'block';
                triggerUnlockConfetti();
            }
            
            // Milestone 4: 50 lines - DNA Matrix Rain Canvas
            if (lines >= 50 && !unlockedMilestones.matrixRain) {
                unlockedMilestones.matrixRain = true;
                unlockedSomething = true;
                alertMsg = "SYSTEM: DNA MATRIX RAIN CANVAS!";
                canvasMode = 'matrix';
                initMatrixMode();
                triggerUnlockConfetti();
            }
            
            if (unlockedSomething) {
                saveState();
                displayMilestoneAlert(alertMsg);
            }
        }

        function displayMilestoneAlert(msg) {
            const alertDiv = document.getElementById('milestoneAlert');
            const textDiv = document.getElementById('milestoneAlertText');
            textDiv.innerText = msg;
            alertDiv.style.display = 'block';
            
            if (window.audioCtx) {
                // Triumphant sound
                const now = audioCtx.currentTime;
                const osc1 = audioCtx.createOscillator();
                const osc2 = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc1.type = 'triangle';
                osc2.type = 'square';
                osc1.frequency.setValueAtTime(523.25, now); // C5
                osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
                osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5
                osc1.frequency.setValueAtTime(1046.50, now + 0.3); // C6
                
                osc2.frequency.setValueAtTime(523.25 / 2, now);
                osc2.frequency.setValueAtTime(659.25 / 2, now + 0.1);
                osc2.frequency.setValueAtTime(783.99 / 2, now + 0.2);
                osc2.frequency.setValueAtTime(1046.50 / 2, now + 0.3);
                
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.6);
                
                osc1.start(now);
                osc2.start(now);
                osc1.stop(now + 0.6);
                osc2.stop(now + 0.6);
            }
            
            setTimeout(() => {
                alertDiv.style.display = 'none';
            }, 3500);
        }

        function triggerUnlockConfetti() {
            for(let i=0; i<60; i++) {
                const c = document.createElement('div');
                c.className = 'confetti-piece';
                c.style.left = Math.random() * 100 + 'vw';
                c.style.background = COLORS[Math.floor(Math.random() * 7) + 1];
                c.style.animationDuration = (Math.random() * 2 + 2) + 's';
                c.style.animationDelay = (Math.random() * 0.5) + 's';
                document.body.appendChild(c);
                setTimeout(() => c.remove(), 5000);
            }
        }
        
        const COLORS = [
            null,
            '#ff6bdf', // I (pink)
            '#4da6ff', // J (blue)
            '#ffb84d', // L (orange)
            '#ffee55', // O (yellow)
            '#44b549', // S (green)
            '#9d4edd', // T (purple)
            '#ff073a'  // Z (red)
        ];

        const PIECES = [
            [],
            [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], // I
            [[2,0,0],[2,2,2],[0,0,0]],                 // J
            [[0,0,3],[3,3,3],[0,0,0]],                 // L
            [[4,4],[4,4]],                             // O
            [[0,5,5],[5,5,0],[0,0,0]],                 // S
            [[0,6,0],[6,6,6],[0,0,0]],                 // T
            [[7,7,0],[0,7,7],[0,0,0]]                  // Z
        ];

        let piece = null;
        let nextPieceType = 0;
        let dropCounter = 0;
        let dropInterval = 1000;
        let lastTime = 0;
        
        const nCanvas = document.getElementById('arcadeNextCanvas');
        const nCtx = nCanvas.getContext('2d');

        function createPiece(type) {
            return {
                matrix: PIECES[type],
                pos: {x: type === 4 ? 4 : 3, y: 0},
                type: type
            };
        }

        function drawMatrix(matrix, offset, ctxToDraw, isGhost = false) {
            matrix.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        if (isGhost) {
                            ctxToDraw.fillStyle = 'rgba(255,255,255,0.05)';
                            ctxToDraw.fillRect(x + offset.x, y + offset.y, 1, 1);
                            ctxToDraw.lineWidth = 0.05;
                            ctxToDraw.strokeStyle = 'rgba(255,255,255,0.3)';
                            ctxToDraw.strokeRect(x + offset.x, y + offset.y, 1, 1);
                        } else {
                            ctxToDraw.fillStyle = COLORS[value];
                            ctxToDraw.fillRect(x + offset.x, y + offset.y, 1, 1);
                            ctxToDraw.lineWidth = 0.05;
                            ctxToDraw.strokeStyle = '#111';
                            ctxToDraw.strokeRect(x + offset.x, y + offset.y, 1, 1);
                            
                            // Inner highlight
                            ctxToDraw.fillStyle = 'rgba(255,255,255,0.2)';
                            ctxToDraw.fillRect(x + offset.x, y + offset.y, 1, 0.2);
                        }
                    }
                });
            });
        }

        function merge(board, piece) {
            piece.matrix.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        board[y + piece.pos.y][x + piece.pos.x] = value;
                    }
                });
            });
        }

        function collide(board, piece) {
            const m = piece.matrix;
            const o = piece.pos;
            for (let y = 0; y < m.length; ++y) {
                for (let x = 0; x < m[y].length; ++x) {
                    if (m[y][x] !== 0 &&
                       (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
                        return true;
                    }
                }
            }
            return false;
        }

        function rotate(matrix, dir) {
            const transposed = matrix.map((_, colIndex) => matrix.map(row => row[colIndex]));
            if (dir > 0) return transposed.map(row => row.reverse());
            return transposed.reverse();
        }

        function playerRotate() {
            if (!piece) return;
            const pos = piece.pos.x;
            let offset = 1;
            const rotated = rotate(piece.matrix, 1);
            const oldMatrix = piece.matrix;
            piece.matrix = rotated;
            while (collide(board, piece)) {
                piece.pos.x += offset;
                offset = -(offset + (offset > 0 ? 1 : -1));
                if (offset > rotated[0].length) {
                    piece.matrix = oldMatrix;
                    piece.pos.x = pos;
                    return;
                }
            }
            if (window.audioCtx) {
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            }
        }

        function playerMove(offset) {
            if (!piece) return;
            piece.pos.x += offset;
            if (collide(board, piece)) {
                piece.pos.x -= offset;
            } else {
                if (window.audioCtx) {
                    const now = audioCtx.currentTime;
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(1200, now);
                    gain.gain.setValueAtTime(0.05, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.02);
                    osc.start(now);
                    osc.stop(now + 0.02);
                }
            }
        }

        function sweep() {
            let rowCount = 0;
            outer: for (let y = board.length - 1; y >= 0; --y) {
                for (let x = 0; x < board[y].length; ++x) {
                    if (board[y][x] === 0) continue outer;
                }
                const row = board.splice(y, 1)[0].fill(0);
                board.unshift(row);
                ++y;
                rowCount++;
            }
            if (rowCount > 0) {
                lines += rowCount;
                score += [0, 40, 100, 300, 1200][rowCount] * level;
                if (audioCtx) playSound(1); // Play sound on line clear
                if (lines >= level * 5) {
                    level++;
                    dropInterval *= 0.8;
                }
                updateHUD();

                checkMilestones();
            }
        }

        function playerDrop() {
            piece.pos.y++;
            if (collide(board, piece)) {
                piece.pos.y--;
                merge(board, piece);
                sweep();
                if(!isPlaying) return; // if game over triggered inside sweep
                piece = createPiece(nextPieceType);
                nextPieceType = Math.floor(Math.random() * 7) + 1;
                drawNextPiece();
                if (collide(board, piece)) {
                    gameOver();
                }
                if (audioCtx) playSound(4); // Drop sound
            }
            dropCounter = 0;
        }

        function drawNextPiece() {
            nCtx.fillStyle = '#050505';
            nCtx.fillRect(0, 0, nCanvas.width, nCanvas.height);
            const m = PIECES[nextPieceType];
            const offset = {
                x: m[0].length === 4 ? 0 : (m.length === 2 ? 1 : 0.5),
                y: m.length === 2 ? 1 : (m[0].length === 4 ? -0.5 : 0.5)
            };
            nCtx.save();
            nCtx.scale(15, 15); // Scale up to fit 60x60
            drawMatrix(m, offset, nCtx);
            nCtx.restore();
        }

        function updateHUD() {
            document.getElementById('arcadeScore').innerText = score;
            document.getElementById('arcadeLines').innerText = lines;
            document.getElementById('arcadeLvl').innerText = level;
        }

        function startGame(e) {
            if(e) e.stopPropagation();
            screenStart.style.display = 'none';
            screenGameover.style.display = 'none';
            
            board = Array(20).fill().map(() => Array(10).fill(0));
            score = 0;
            lines = 0;
            level = 1;
            dropInterval = 800;
            
            nextPieceType = Math.floor(Math.random() * 7) + 1;
            piece = createPiece(Math.floor(Math.random() * 7) + 1);
            drawNextPiece();
            
            updateHUD();
            isPlaying = true;
            lastTime = 0;
            gameLoop();
        }

        function stopGame() {
            isPlaying = false;
            cancelAnimationFrame(gameReq);
        }

        function gameOver() {
            stopGame();
            document.getElementById('gameoverScore').innerText = score;
            screenGameover.style.display = 'flex';
            document.getElementById('arcadeGameoverTitle').innerText = "SYS_FAILURE";
            
            let msg = "";
            if (lines >= 50) msg = "ALL MILESTONES CLEARED!";
            else if (lines >= 30) msg = "UNLOCKED: BIO-SYNTH PAD";
            else if (lines >= 15) msg = "UNLOCKED: CRT SCANLINES";
            else if (lines >= 5) msg = "UNLOCKED: CYBER-RED MODE";
            else msg = "CLEAR 5 LINES TO BEGIN UNLOCKS";
            
            document.getElementById('arcadeUnlockMsg').innerText = msg;
        }

        function gameLoop(time = 0) {
            if (!isPlaying) return;
            const deltaTime = time - lastTime;
            lastTime = time;

            dropCounter += deltaTime;
            if (dropCounter > dropInterval) {
                playerDrop();
            }

            gCtx.fillStyle = '#050505';
            gCtx.fillRect(0, 0, gWidth, gHeight);
            
            gCtx.save();
            gCtx.scale(gWidth / 10, gHeight / 20);
            
            drawMatrix(board, {x: 0, y: 0}, gCtx);
            if(piece) {
                // Draw ghost piece
                const ghost = {
                    matrix: piece.matrix,
                    pos: { x: piece.pos.x, y: piece.pos.y },
                    type: piece.type
                };
                while (!collide(board, ghost)) {
                    ghost.pos.y++;
                }
                ghost.pos.y--;
                drawMatrix(ghost.matrix, ghost.pos, gCtx, true);
                
                // Draw active piece
                drawMatrix(piece.matrix, piece.pos, gCtx);
            }
            
            gCtx.restore();

            gameReq = requestAnimationFrame(gameLoop);
        }

        function handleInput(action) {
            if(!isPlaying) return;
            if(!window.audioCtx) initAudio();
            else if(window.audioCtx.state === 'suspended') window.audioCtx.resume();
            
            if(action === 'left') playerMove(-1);
            if(action === 'right') playerMove(1);
            if(action === 'down') playerDrop();
            if(action === 'rotate') playerRotate();
            if(action === 'hardDrop') {
                if(!piece) return;
                while(!collide(board, piece)) {
                    piece.pos.y++;
                }
                piece.pos.y--;
                playerDrop();
                if (window.audioCtx) playSound(5); // Hard drop kick sound
            }
        }

        window.addEventListener('keydown', (e) => {
            if(!isPlaying) return;
            if(e.key === 'ArrowLeft') handleInput('left');
            if(e.key === 'ArrowRight') handleInput('right');
            if(e.key === 'ArrowDown') handleInput('down');
            if(e.key === 'ArrowUp') handleInput('rotate');
            if(e.key === ' ') handleInput('hardDrop');
            if(['ArrowLeft','ArrowRight','ArrowDown','ArrowUp',' '].includes(e.key)) e.preventDefault();
        });

        const mLeftBtn = document.getElementById('arcadeLeftBtn');
        const mRightBtn = document.getElementById('arcadeRightBtn');
        const mDownBtn = document.getElementById('arcadeDownBtn');
        const mRotBtn = document.getElementById('arcadeRotateBtn');
        const mDropBtn = document.getElementById('arcadeDropBtn');
        
        let softDropInterval;
        
        if (mLeftBtn) mLeftBtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); handleInput('left'); });
        if (mRightBtn) mRightBtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); handleInput('right'); });
        if (mRotBtn) mRotBtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); handleInput('rotate'); });
        
        if (mDownBtn) {
            mDownBtn.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                handleInput('down');
                softDropInterval = setInterval(() => handleInput('down'), 100);
            });
            mDownBtn.addEventListener('pointerup', () => clearInterval(softDropInterval));
            mDownBtn.addEventListener('pointerleave', () => clearInterval(softDropInterval));
        }

        if (mDropBtn) {
            mDropBtn.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                handleInput('hardDrop');
            });
        }

        // CRT Toggle Listener
        const crtToggle = document.getElementById('crtToggle');
        if (crtToggle) {
            crtToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                document.body.classList.toggle('crt-active');
                
                // Save state of CRT toggle active
                const isCrt = document.body.classList.contains('crt-active');
                sessionStorage.setItem('biocatalyst_crt_active', isCrt ? 'true' : 'false');
                
                // Subtle sound click
                if (audioCtx) {
                    const now = audioCtx.currentTime;
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(isCrt ? 800 : 400, now);
                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.05);
                    osc.start(now);
                    osc.stop(now + 0.05);
                }
            });
        }

        // Restore active CRT vision from storage
        if (sessionStorage.getItem('biocatalyst_crt_active') === 'true') {
            document.body.classList.add('crt-active');
        }

        // Bio-Synth drum machine synthesizer sound trigger function
        function triggerSynth(note) {
            if (!audioCtx) initAudio();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            let freq = 440;
            let type = 'sine';
            
            switch(note) {
                case 'A': freq = 220; type = 'sawtooth'; break;
                case 'T': freq = 277.18; type = 'triangle'; break;
                case 'C': freq = 329.63; type = 'square'; break;
                case 'G': freq = 392.00; type = 'sine'; break;
            }
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.12);
            
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            
            osc.start(now);
            osc.stop(now + 0.3);
        }

        // Synth pad button hooks
        const btnA = document.getElementById('synthBtnA');
        const btnT = document.getElementById('synthBtnT');
        const btnC = document.getElementById('synthBtnC');
        const btnG = document.getElementById('synthBtnG');

        if (btnA) btnA.addEventListener('pointerdown', (e) => { e.stopPropagation(); triggerSynth('A'); });
        if (btnT) btnT.addEventListener('pointerdown', (e) => { e.stopPropagation(); triggerSynth('T'); });
        if (btnC) btnC.addEventListener('pointerdown', (e) => { e.stopPropagation(); triggerSynth('C'); });
        if (btnG) btnG.addEventListener('pointerdown', (e) => { e.stopPropagation(); triggerSynth('G'); });

        // Speaker Modal Logic
        const speakerData = {
            "Dr. Ioannis Chantas": {
                role: "AI & Data Architect",
                bio: "Dr. Chantas leads the AI infrastructure initiative at the University, focusing on scalable neural network architectures and decentralized data processing. He previously engineered predictive models for top European tech firms.",
                img: "assets/images/speaker_chantas.png",
                color: "var(--green)",
                socials: [
                    { name: "LinkedIn", link: "#" },
                    { name: "Twitter", link: "#" }
                ]
            },
            "Nasos Koskinas": {
                role: "Innovation Lead",
                bio: "Spearheading the transition from academic research to market-ready products. Koskinas has a proven track record of nurturing deep-tech startups and establishing vital industry partnerships across the Mediterranean.",
                img: "assets/images/speaker_koskinas.png",
                color: "var(--pink)",
                socials: [
                    { name: "LinkedIn", link: "#" },
                    { name: "GitHub", link: "#" }
                ]
            },
            "Tassos Koutlas": {
                role: "Venture Partner",
                bio: "With over a decade of experience in early-stage venture capital, Koutlas identifies and accelerates high-potential bio-tech and software startups. He actively mentors the next generation of founders.",
                img: "assets/images/speaker_koutlas.png",
                color: "var(--blue)",
                socials: [
                    { name: "LinkedIn", link: "#" },
                    { name: "Website", link: "#" }
                ]
            }
        };

        const speakerCards = document.querySelectorAll('.speaker-card');
        const modalOverlay = document.getElementById('speakerModalOverlay');
        const btnCloseModal = document.getElementById('closeSpeakerModal');
        
        const modName = document.getElementById('modalSpeakerName');
        const modRole = document.getElementById('modalSpeakerRole');
        const modBio = document.getElementById('modalSpeakerBio');
        const modImg = document.getElementById('modalSpeakerImg');
        const modImgBg = document.getElementById('modalSpeakerImgBg');
        const modSocials = document.getElementById('modalSpeakerSocials');

        function openSpeakerModal(name) {
            const data = speakerData[name];
            if (!data) return;
            
            modName.textContent = name;
            modRole.textContent = data.role;
            modBio.textContent = data.bio;
            modImg.src = data.img;
            modImgBg.style.backgroundColor = data.color;
            
            modSocials.innerHTML = '';
            data.socials.forEach(s => {
                const a = document.createElement('a');
                a.className = 'speaker-social-btn hover-trigger';
                a.href = s.link;
                a.target = '_blank';
                a.textContent = s.name;
                modSocials.appendChild(a);
            });
            
            modalOverlay.classList.add('active');
            
            if (typeof audioCtx !== 'undefined' && audioCtx) {
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            }
        }

        function closeSpeakerModal() {
            modalOverlay.classList.remove('active');
        }

        if (speakerCards.length > 0 && modalOverlay) {
            speakerCards.forEach(card => {
                card.addEventListener('click', () => {
                    const name = card.querySelector('.speaker-name').textContent.trim();
                    openSpeakerModal(name);
                });
            });

            btnCloseModal.addEventListener('click', closeSpeakerModal);
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    closeSpeakerModal();
                }
            });
        }

        // Sponsor Modal Logic
        const sponsorData = {
            "UNIMATES": {
                tier: "HEADLINE SPONSOR",
                bio: "UNIMATES is the premier startup incubator and tech community in the region. They provide the necessary capital, mentorship, and cloud credits to help student founders go from zero to one.",
                img: "logo_unimates_1782424150873.png",
                color: "var(--green)",
                links: [{ name: "Website", link: "#" }, { name: "Careers", link: "#" }]
            },
            "TEDx Mavili": {
                tier: "EVENT PARTNER",
                bio: "TEDx Mavili brings 'Ideas Worth Spreading' to the vibrant city of Ioannina. They support the hackathon by sourcing incredible speakers and providing presentation coaching.",
                img: "logo_tedx_1782424157933.png",
                color: "var(--pink)",
                links: [{ name: "Website", link: "#" }]
            },
            "Campus Hub": {
                tier: "COMMUNITY SPONSOR",
                bio: "Campus Hub is the ultimate student networking platform. They've sponsored our hardware labs and are providing free premium accounts for all hackathon attendees.",
                img: "logo_campus_1782424165723.png",
                color: "var(--blue)",
                links: [{ name: "App Store", link: "#" }]
            },
            "BioTech Inc.": {
                tier: "TECH SPONSOR",
                bio: "BioTech Inc. is a leading pioneer in computational biology. They've supplied the dataset APIs and bio-informatics tools that participants are using to build their prototypes.",
                img: "logo_biotech_1782424172847.png",
                color: "var(--yellow)",
                links: [{ name: "API Docs", link: "#" }, { name: "Website", link: "#" }]
            }
        };

        const sponsorCards = document.querySelectorAll('.sponsor-card');
        const spModalOverlay = document.getElementById('sponsorModalOverlay');
        const btnCloseSpModal = document.getElementById('closeSponsorModal');
        
        const spModName = document.getElementById('modalSponsorName');
        const spModTier = document.getElementById('modalSponsorTier');
        const spModBio = document.getElementById('modalSponsorBio');
        const spModImg = document.getElementById('modalSponsorImg');
        const spModImgBg = document.getElementById('modalSponsorImgBg');
        const spModLinks = document.getElementById('modalSponsorLinks');

        function openSponsorModal(name) {
            const data = sponsorData[name];
            if (!data) return;
            
            spModName.textContent = name;
            spModTier.textContent = data.tier;
            spModBio.textContent = data.bio;
            spModImg.src = data.img;
            spModImgBg.style.backgroundColor = data.color;
            
            spModLinks.innerHTML = '';
            data.links.forEach(s => {
                const a = document.createElement('a');
                a.className = 'speaker-social-btn hover-trigger';
                a.href = s.link;
                a.target = '_blank';
                a.textContent = s.name;
                spModLinks.appendChild(a);
            });
            
            spModalOverlay.classList.add('active');
            
            if (typeof audioCtx !== 'undefined' && audioCtx) {
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            }
        }

        function closeSponsorModal() {
            spModalOverlay.classList.remove('active');
        }

        if (sponsorCards.length > 0 && spModalOverlay) {
            sponsorCards.forEach(card => {
                card.addEventListener('click', () => {
                    const name = card.getAttribute('data-name');
                    openSponsorModal(name);
                });
            });

            btnCloseSpModal.addEventListener('click', closeSponsorModal);
            spModalOverlay.addEventListener('click', (e) => {
                if (e.target === spModalOverlay) {
                    closeSponsorModal();
                }
            });
        }

        // Schedule Sidebar Logic
        const scheduleData = {
            // Page 1: 10:30 – 13:10
            "qr-tickets": {
                title: "Υποδοχή | Σκανάρισμα QR Tickets",
                titleEn: "Reception & QR Tickets Check-in",
                time: "10:30 – 11:00",
                speaker: "",
                speakerEn: "",
                desc: "Υποδοχή των παρευρισκόμενων και σκανάρισμα QR Tickets / Check-in στο χώρο της διοργάνωσης. Παραλαβή badge, welcome kit και προετοιμασία για την έναρξη του συνεδρίου.",
                descEn: "Welcome reception, QR ticket scanning, badge distribution, and attendee onboarding.",
                loc: "📍 FOYER / LOBBY"
            },
            "welcome-joist": {
                title: "Καλωσόρισμα | Joist",
                titleEn: "Welcome Address & Joist Presentation",
                time: "11:00 – 11:25",
                speaker: "Οργανωτική επιτροπή, Joist Innovation Park",
                speakerEn: "Organizing Committee & Joist Innovation Park",
                desc: "Τι είναι το Bio Catalyst, ανάλυση του προγράμματος, ευχαριστίες στους χορηγούς και παρουσίαση του Joist ως χώρου καινοτομίας στα Ιωάννινα.",
                descEn: "Introduction to Bio Catalyst, schedule analysis, sponsor acknowledgments, and presentation of the Joist Innovation Park in Ioannina.",
                loc: "📍 MAIN AUDITORIUM"
            },
            "igem-greece": {
                title: "iGEM Greece",
                titleEn: "iGEM Greece Project Showcase",
                time: "11:25 – 12:00",
                speaker: "iGEM Ioannina, iGEM Space Hellas, iGEM Athens, iGEM UniCrete",
                speakerEn: "iGEM Ioannina, iGEM Space Hellas, iGEM Athens, iGEM UniCrete",
                desc: "Παρουσίαση των φετινών project των ελληνικών ομάδων iGEM.",
                descEn: "Showcase of synthetic biology and competitive research projects from Greek collegiate iGEM teams.",
                loc: "📍 MAIN AUDITORIUM"
            },
            "student-startups": {
                title: "Φοιτητικές | Νέες Startup",
                titleEn: "Student & Early-Stage Startups",
                time: "12:00 – 12:25",
                speaker: "Unimates, Scilend",
                speakerEn: "Unimates, Scilend",
                desc: "Ανάδειξη φοιτητικών startups στον χώρο της βιοχημείας και της γενικής επιχειρηματικότητας.",
                descEn: "Spotlighting university student startups in biochemistry, deep tech, and general entrepreneurship.",
                loc: "📍 MAIN AUDITORIUM"
            },
            "bio-entrepreneurship-summit": {
                title: "Biotechnology Entrepreneurship Summit",
                titleEn: "Biotechnology Entrepreneurship Summit",
                time: "12:25 – 12:35",
                speaker: "Πανελλήνιο Συνέδριο Επιχειρηματικής Βιοτεχνολογίας",
                speakerEn: "Panhellenic Biotechnology Entrepreneurship Summit",
                desc: "Παρουσίαση του Πανελλήνιου Συνεδρίου Επιχειρηματικής Βιοτεχνολογίας.",
                descEn: "Introductory presentation and mission roadmap for the Panhellenic Biotechnology Entrepreneurship Summit.",
                loc: "📍 MAIN AUDITORIUM"
            },
            "round-table": {
                title: "Round Table",
                titleEn: "Round Table: Student Entrepreneurship",
                time: "12:35 – 13:10",
                speaker: "Πανελλήνιο Φοιτητικό Συνέδριο Βιοεπιστημών, Ioannina Science Festival, AIESEC Ioannina, Limbic Structures of the Brain Summer School",
                speakerEn: "Panhellenic Student Biosciences Conference, Ioannina Science Festival, AIESEC Ioannina, Limbic Structures of the Brain Summer School",
                desc: "Συζήτηση φοιτητικών ομάδων για την οργάνωση δραστηριοτήτων στα Ιωάννινα γύρω από την επιχειρηματικότητα.",
                descEn: "Panel discussion with university student teams on organizing and advancing entrepreneurial initiatives in Ioannina.",
                loc: "📍 MAIN STAGE"
            },

            // Page 2: 13:10 – 15:50
            "local-scaleup": {
                title: "Local Scale Up | Success Story",
                titleEn: "Local Scale Up: Success Story",
                time: "13:10 – 13:30",
                speaker: "Snappi",
                speakerEn: "Snappi",
                desc: "Μια επιχείρηση των Ιωαννίνων μιλάει για τη δική της πορεία μέχρι να φτάσει στην κλιμάκωση.",
                descEn: "A homegrown Ioannina enterprise shares its authentic founding story and scaling journey.",
                loc: "📍 MAIN AUDITORIUM"
            },
            "how-to-bmc": {
                title: "How to make your BMC",
                titleEn: "How to make your BMC: Ideation & Competition Kickoff",
                time: "13:30 – 13:45",
                speaker: "Μονάδα Καινοτομίας και Επιχειρηματικότητας (ΜΟΚΕ) Πανεπιστημίου Ιωαννίνων (Γιώργος Γκολέτσης, Αναπλ. Καθηγητής Οικονομικών Επιστημών) & στελέχη εταιρειών",
                speakerEn: "MOKE University of Ioannina (Assoc. Prof. George Gkoletsis) & Corporate Executives",
                desc: "Έναρξη καθοδήγησης και διαγωνισμού. Οι ομιλητές καθοδηγούν τους διαγωνιζόμενους στην κατασκευή ενός robust business plan. Έναρξη διαγωνισμού.",
                descEn: "Competition kickoff: mentors guide participants in formulating a robust Business Model Canvas and pitch foundation.",
                loc: "📍 WORKSHOP BAY"
            },
            "how-to-startup": {
                title: "How to “Start-Up”",
                titleEn: "How to Start-Up: Fundamentals & Academic Decision Making",
                time: "13:45 – 14:20",
                speaker: "Παναγιώτης Τζαβάρας, Founder of OneThink και κ. Σωτηρία Τριαντάρη, Καθηγήτρια Λήψης Επιχειρηματικών Αποφάσεων, UOWM",
                speakerEn: "Panagiotis Tzavaras (Founder, OneThink) & Prof. Sotiria Triantari (UOWM)",
                desc: "Προσκεκλημένοι ομιλητές, ακαδημαϊκοί και επαγγελματίες, δίνουν τα θεμέλια του πώς κατασκευάζεις μια startup. (13:45 - 14:05 παρουσίαση Παναγιώτη & QnA. 14:05 - 14:20 παρουσίαση κ. Τριαντάρη & QnA).",
                descEn: "Keynote speakers and academic leaders explore startup fundamentals (13:45-14:05 Panagiotis Tzavaras talk & Q&A; 14:05-14:20 Prof. Sotiria Triantari talk & Q&A).",
                loc: "📍 MAIN AUDITORIUM"
            },
            "lunch-bmc-networking": {
                title: "Lunch Break | BMC Workshop | Networking",
                titleEn: "Lunch Break, BMC Workshop & Networking",
                time: "14:20 – 14:50",
                speaker: "ΜΟΚΕ Πανεπιστημίου Ιωαννίνων και στελέχη συμβουλευτικών εταιρειών",
                speakerEn: "MOKE University of Ioannina & Advisory Executives",
                desc: "Παράλληλη δράση του BMC Workshop: κατασκευή BMC και pitch decks για παρουσίαση στους παρευρισκόμενους.",
                descEn: "Parallel working session building Business Model Canvases and pitch decks alongside networking and catered lunch.",
                loc: "📍 ATRIUM & LOUNGE"
            },
            "funding-session": {
                title: "Funding Session",
                titleEn: "Startup Funding & Venture Banking Session",
                time: "14:50 – 15:20",
                speaker: "Ευθύμης Γεωργακόπουλος, EGG Programme Manager, Eurobank",
                speakerEn: "Efthymis Georgakopoulos, EGG Programme Manager, Eurobank",
                desc: "Στέλεχος του egg της Eurobank παρουσιάζει το πρόγραμμα και εξηγεί πώς χρηματοδοτείται μια startup στα πρώτα της βήματα: πηγές χρηματοδότησης σε κάθε στάδιο, τι κοιτάζουν οι επενδυτές και πώς παρουσιάζεις την ιδέα σου για να τους πείσεις. Ακολουθούν ερωτήσεις για το venture capital.",
                descEn: "Eurobank egg Programme Manager presents funding avenues for early-stage startups, investor expectations, pitch mechanics, and venture capital Q&A.",
                loc: "📍 MAIN AUDITORIUM"
            },
            "legal-startups": {
                title: "Legal for Startups 101",
                titleEn: "Legal for Startups 101",
                time: "15:20 – 15:50",
                speaker: "Θοδωρής Ζέρβας, Ιδρυτής, startuplawyer.gr",
                speakerEn: "Thodoris Zervas, Founder, startuplawyer.gr",
                desc: "Consulting session για τα συχνότερα νομικά θέματα που αφορούν μια startup.",
                descEn: "Consulting session addressing legal foundations, contracts, intellectual property, and key legal essentials for startups.",
                loc: "📍 MAIN AUDITORIUM"
            },
            "legal-patent": {
                title: "Legal for Startups 101",
                titleEn: "Legal for Startups 101",
                time: "15:20 – 15:50",
                speaker: "Θοδωρής Ζέρβας, Ιδρυτής, startuplawyer.gr",
                speakerEn: "Thodoris Zervas, Founder, startuplawyer.gr",
                desc: "Consulting session για τα συχνότερα νομικά θέματα που αφορούν μια startup.",
                descEn: "Consulting session addressing legal foundations, contracts, intellectual property, and key legal essentials for startups.",
                loc: "📍 MAIN AUDITORIUM"
            },

            // Page 3: 15:50 – 18:00
            "bioeconomy-career": {
                title: "Καριέρα στη Βιοοικονομία",
                titleEn: "Careers in Bioeconomy",
                time: "15:50 – 16:15",
                speaker: "Ανδρέας Βίτσος, Καθηγητής, Τμήμα Φαρμακευτικής, ΕΚΠΑ",
                speakerEn: "Prof. Andreas Vitsos, Department of Pharmacy, NKUA",
                desc: "Πως συνδέουμε τις θετικές επιστήμες (χημεία, φαρμακευτική) με την επιχειρηματικότητα και τη καινοτομία.",
                descEn: "Bridging natural sciences (chemistry, pharmacy) with entrepreneurship, commercialization, and innovation.",
                loc: "📍 MAIN AUDITORIUM"
            },
            "coffee-bmc-check": {
                title: "Coffee Break | Έλεγχος των BMC Projects",
                titleEn: "Coffee Break & BMC Projects Review",
                time: "16:15 – 16:40",
                speaker: "Οργανωτική επιτροπή & Μέντορες",
                speakerEn: "Mentors & Organizing Committee",
                desc: "Διάλειμμα για καφέ και έλεγχος των BMC Projects από τους μέντορες.",
                descEn: "Coffee break with concurrent mentor review and check-in on contestant BMC projects.",
                loc: "📍 LOUNGE"
            },
            "campus-to-career": {
                title: "From Campus to Career | Soft Skills & Personal Branding",
                titleEn: "From Campus to Career: Soft Skills & Personal Branding",
                time: "16:40 – 17:00",
                speaker: "Ελένη Κουτελίδα, Subject Matter Expert, Talent Acquisition",
                speakerEn: "Eleni Koutelida, Subject Matter Expert, Talent Acquisition",
                desc: "Τα soft skills που χρειάζεται κάποιος για να περάσει από τη θεωρία του πανεπιστημίου στην πράξη της εργασίας και για να διαχειριστεί μια startup, καθώς και personal branding: πώς χτίζεις σωστά το προφίλ σου στο LinkedIn και πώς ξεχωρίζεις στη σημερινή αγορά εργασίας.",
                descEn: "Key soft skills required to transition from university into industry, startup management, personal branding, and optimizing LinkedIn presence.",
                loc: "📍 MAIN AUDITORIUM"
            },
            "digital-health": {
                title: "Digital Health",
                titleEn: "Digital Health & Medical Informatics",
                time: "17:00 – 17:20",
                speaker: "Δημήτριος Φωτιάδης, Καθηγητής, Τμήμα Μηχανικών Επιστήμης Υλικών, Διευθυντής του ΔΠΜΣ «Ψηφιακή Ιατρική», Πανεπιστήμιο Ιωαννίνων",
                speakerEn: "Prof. Dimitrios Fotiadis, Director of MSc Digital Medicine, University of Ioannina",
                desc: "Η πληροφορική στον χώρο της βιοϋγείας και παρουσίαση του μεταπτυχιακού προγράμματος «Ψηφιακή Ιατρική» του Πανεπιστημίου Ιωαννίνων.",
                descEn: "Informatics in bio-health and presentation of the Interdepartmental MSc in Digital Medicine at the University of Ioannina.",
                loc: "📍 MAIN AUDITORIUM"
            },
            "ioannina-ecosystem": {
                title: "Οικοσύστημα Ιωαννίνων: παρόν και μέλλον",
                titleEn: "Ioannina Ecosystem: Present & Future",
                time: "17:20 – 17:40",
                speaker: "κ. Κούτλας, CTO της DropSolid AI, Κοινότητα Ψηφιακών Νομάδων Ιωαννίνων",
                speakerEn: "Mr. Koutlas, CTO of DropSolid AI, Ioannina Digital Nomads Community",
                desc: "Προέλευση και δημιουργία της κοινότητας Ψηφιακών Νομάδων. Παρόν και μέλλον του οικοσυστήματος των Ιωαννίνων.",
                descEn: "Origins and creation of the Digital Nomads community: current landscape and future roadmap for Ioannina's tech ecosystem.",
                loc: "📍 MAIN AUDITORIUM"
            },
            "research-anchor": {
                title: "Research Anchor",
                titleEn: "Research Anchor: Student Innovation Showcase",
                time: "17:40 – 18:00",
                speaker: "Κατερίνα Τούντα, με startup idea βραβευμένη στο Falling Walls Lab Athens, και regrape project",
                speakerEn: "Katerina Tounta (Falling Walls Lab Athens Awardee) & regrape project",
                desc: "Ολιγόλεπτες παρουσιάσεις πτυχιακών και ερευνών φοιτητών που αφορούν την αγορά την οποία στοχεύουν οι ίδιοι.",
                descEn: "Flash presentations of student theses and research projects targeting real-world market applications.",
                loc: "📍 MAIN AUDITORIUM"
            },

            // Page 4: 18:00 – 19:00
            "panathenea": {
                title: "Panathēnea",
                titleEn: "Panathēnea: Innovation & European Scale",
                time: "18:00 – 18:30",
                speaker: "Ιωάννα Καραχάλιου, Representative of Panathenea και Lars Rasmussen, Co-Founder of Google Maps",
                speakerEn: "Ioanna Karachaliou (Panathenea) & Lars Rasmussen (Co-Founder of Google Maps)",
                desc: "Εκπρόσωπος του γνωστού ελληνικού φεστιβάλ καινοτομίας μιλάει για την επιχειρηματικότητα στην Ελλάδα και την ανάπτυξη των ελληνικών startups σε ευρωπαϊκό επίπεδο.",
                descEn: "Representative of the acclaimed Greek Innovation Festival discusses entrepreneurship in Greece and scaling startups across Europe, joined by Google Maps Co-Founder Lars Rasmussen.",
                loc: "📍 MAIN AUDITORIUM"
            },
            "closing-awards": {
                title: "Closing Remarks-Networking - Βράβευση καλύτερης BMC ιδέας",
                titleEn: "Closing Ceremony, Grand Jury BMC Awards & Networking",
                time: "18:30 – 19:00",
                speaker: "Οργανωτική επιτροπή",
                speakerEn: "Organizing Committee & Grand Jury",
                desc: "Βράβευση της καλύτερης BMC ιδέας και του καλύτερου pitch deck, που επιλέγονται από κριτική επιτροπή αποτελούμενη από τους ομιλητές της ημέρας. Κλείσιμο και networking.",
                descEn: "Awards ceremony for the best BMC and pitch deck selected by the grand jury of the day's speakers, closing remarks, and celebration networking.",
                loc: "📍 MAIN STAGE & ATRIUM"
            }
        };

        const sidebarOverlay = document.getElementById('scheduleSidebarOverlay');
        const btnCloseSidebar = document.getElementById('closeSidebarBtn');
        
        const sbTitle = document.getElementById('sidebarEventTitle');
        const sbTime = document.getElementById('sidebarEventTime');
        const sbSpeaker = document.getElementById('sidebarEventSpeaker');
        const sbDesc = document.getElementById('sidebarEventDesc');
        const sbLoc = document.getElementById('sidebarEventLoc');

        function openScheduleSidebar(eventId) {
            const data = scheduleData[eventId];
            if (!data) return;
            
            if (sbTitle) sbTitle.textContent = data.title;
            if (sbTime) sbTime.textContent = data.time;
            if (sbSpeaker) {
                if (data.speaker) {
                    sbSpeaker.textContent = "🎙️ " + data.speaker;
                    sbSpeaker.style.display = "block";
                } else {
                    sbSpeaker.textContent = "";
                    sbSpeaker.style.display = "none";
                }
            }
            if (sbDesc) sbDesc.textContent = data.desc;
            if (sbLoc) sbLoc.textContent = data.loc;
            
            if (sidebarOverlay) sidebarOverlay.classList.add('active');
            
            if (typeof audioCtx !== 'undefined' && audioCtx) {
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            }
        }

        function closeScheduleSidebar() {
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }

        // Delegate timeline clicks so all rows in any pane trigger the modal reliably
        document.addEventListener('click', (e) => {
            const row = e.target.closest('.timeline-row');
            if (row && sidebarOverlay) {
                const eventId = row.getAttribute('data-event');
                if (eventId) {
                    openScheduleSidebar(eventId);
                }
            }
        });

        if (btnCloseSidebar) btnCloseSidebar.addEventListener('click', closeScheduleSidebar);
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', (e) => {
                if (e.target === sidebarOverlay) {
                    closeScheduleSidebar();
                }
            });
        }

        // Direct PDF Download via jsPDF — Official Brutalist Event Program
        const downloadPdfBtn = document.getElementById('downloadPdfBtn');

        if(downloadPdfBtn && typeof jspdf !== 'undefined') {
            downloadPdfBtn.addEventListener('click', () => {
                const originalText = downloadPdfBtn.innerHTML;
                downloadPdfBtn.innerHTML = 'GENERATING...';
                downloadPdfBtn.style.pointerEvents = 'none';

                try {
                    const { jsPDF } = jspdf;
                    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                    const pageW = doc.internal.pageSize.getWidth();
                    const pageH = doc.internal.pageSize.getHeight();
                    const mL = 15;
                    const mR = 15;
                    const cW = pageW - mL - mR;
                    let y = 0;
                    let pageNum = 1;

                    const C = {
                        purple: [92, 53, 157],
                        green: [68, 181, 73],
                        pink: [255, 107, 223],
                        yellow: [255, 238, 85],
                        blue: [77, 166, 255],
                        black: [17, 17, 17],
                        white: [255, 255, 255],
                        grey: [200, 200, 200]
                    };

                    function checkPage(needed) {
                        if (y + needed > pageH - 18) {
                            addPageFooter();
                            doc.addPage();
                            pageNum++;
                            y = 12;
                        }
                    }

                    function addPageFooter() {
                        const stripeY = pageH - 10;
                        doc.setFillColor(...C.yellow);
                        doc.rect(0, stripeY, pageW, 10, 'F');
                        for (let sx = -5; sx < pageW + 20; sx += 8) {
                            doc.setFillColor(...C.black);
                            doc.triangle(sx, stripeY, sx + 4, stripeY, sx + 4, pageH, 'F');
                        }
                        doc.setFontSize(7);
                        doc.setFont('courier', 'normal');
                        doc.setTextColor(...C.black);
                        doc.text('PAGE ' + pageNum, pageW - mR - 14, pageH - 3);
                    }

                    // ============ PAGE 1 HEADER ============
                    doc.setFillColor(...C.black);
                    doc.rect(0, 0, pageW, 65, 'F');

                    doc.setFillColor(...C.purple);
                    doc.rect(0, 0, pageW, 4, 'F');

                    doc.setFillColor(...C.green);
                    for (let dx = mL; dx < pageW - mR; dx += 12) {
                        const dotY = 8 + Math.sin(dx * 0.15) * 3;
                        doc.circle(dx, dotY, 1.2, 'F');
                    }

                    doc.setTextColor(...C.white);
                    doc.setFontSize(36);
                    doc.setFont('helvetica', 'bold');
                    doc.text('BIOCATALYST', mL, 28);

                    doc.setTextColor(...C.pink);
                    doc.setFontSize(15);
                    doc.setFont('courier', 'bold');
                    doc.text('// OFFICIAL EVENT PROGRAM', mL, 38);

                    doc.setTextColor(...C.grey);
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    doc.text('FRIDAY, 23 OCTOBER 2026  |  10:30 - 19:00  |  UNIVERSITY OF IOANNINA', mL, 47);

                    doc.setFillColor(...C.yellow);
                    doc.rect(mL, 52, 65, 8, 'F');
                    doc.setTextColor(...C.black);
                    doc.setFontSize(8);
                    doc.setFont('courier', 'bold');
                    doc.text('STARTUP GREECE WEEK 2026', mL + 3, 57.5);

                    doc.setFillColor(...C.green);
                    doc.rect(0, 63, pageW, 2, 'F');

                    y = 74;

                    // ============ SCHEDULE SESSIONS ============
                    const sections = [
                        { name: 'PAGE 1 // 10:30 - 13:10', color: C.purple, keys: ['qr-tickets', 'welcome-joist', 'igem-greece', 'student-startups', 'bio-entrepreneurship-summit', 'round-table'] },
                        { name: 'PAGE 2 // 13:10 - 15:50', color: C.green, keys: ['local-scaleup', 'how-to-bmc', 'how-to-startup', 'lunch-bmc-networking', 'funding-session', 'legal-startups'] },
                        { name: 'PAGE 3 // 15:50 - 18:00', color: C.pink, keys: ['bioeconomy-career', 'coffee-bmc-check', 'campus-to-career', 'digital-health', 'ioannina-ecosystem', 'research-anchor'] },
                        { name: 'PAGE 4 // 18:00 - 19:00', color: C.blue, keys: ['panathenea', 'closing-awards'] }
                    ];

                    let itemCounter = 1;
                    sections.forEach((sec) => {
                        checkPage(22);

                        doc.setFillColor(...C.black);
                        doc.rect(mL, y - 2, cW, 14, 'F');
                        doc.setFillColor(...sec.color);
                        doc.rect(mL, y - 2, 4, 14, 'F');

                        doc.setTextColor(...C.white);
                        doc.setFontSize(14);
                        doc.setFont('helvetica', 'bold');
                        doc.text(sec.name, mL + 10, y + 8);

                        doc.setTextColor(...C.yellow);
                        doc.setFontSize(14);
                        doc.text('*', mL + cW - 10, y + 8);

                        y += 20;

                        sec.keys.forEach((k, evIdx) => {
                            const d = scheduleData[k];
                            if (!d) return;

                            const titleText = (d.titleEn || d.title).toUpperCase();
                            const descText = d.descEn || d.desc;
                            const speakerClean = (d.speakerEn || d.speaker || '').replace(/[^\x00-\x7F]/g, '').trim();
                            const locClean = (d.loc || '').replace(/[^\x00-\x7F]/g, '').trim();
                            const descLines = doc.splitTextToSize(descText, cW - 22);
                            const extraH = speakerClean ? 5 : 0;
                            const blockH = 12 + (descLines.length * 4.5) + 10 + 8 + extraH;
                            checkPage(blockH);

                            const isAlt = evIdx % 2 === 0;
                            doc.setFillColor(isAlt ? 245 : 252, isAlt ? 243 : 250, isAlt ? 250 : 255);
                            doc.rect(mL, y - 3, cW, blockH, 'F');

                            doc.setFillColor(...sec.color);
                            doc.rect(mL, y - 3, 4, blockH, 'F');

                            doc.setFillColor(...C.black);
                            doc.circle(mL + 12, y + 3, 4, 'F');
                            doc.setTextColor(...C.white);
                            doc.setFontSize(8);
                            doc.setFont('courier', 'bold');
                            doc.text(String(itemCounter++).padStart(2, '0'), mL + 9.8, y + 4.8);

                            doc.setFillColor(...C.black);
                            doc.setFontSize(9);
                            doc.setFont('courier', 'bold');
                            const tw = doc.getTextWidth(d.time) + 8;
                            doc.roundedRect(mL + 20, y - 1, tw, 7, 1.5, 1.5, 'F');
                            doc.setTextColor(...C.yellow);
                            doc.text(d.time, mL + 24, y + 4);

                            y += 12;

                            doc.setTextColor(...C.black);
                            doc.setFontSize(11);
                            doc.setFont('helvetica', 'bold');
                            doc.text(titleText, mL + 10, y);
                            y += 6;

                            if (speakerClean) {
                                doc.setTextColor(92, 53, 157);
                                doc.setFontSize(8);
                                doc.setFont('helvetica', 'bold');
                                doc.text('SPEAKER: ' + speakerClean, mL + 10, y);
                                y += 5;
                            }

                            doc.setTextColor(70, 70, 70);
                            doc.setFontSize(9);
                            doc.setFont('helvetica', 'normal');
                            descLines.forEach(line => {
                                doc.text(line, mL + 10, y);
                                y += 4.5;
                            });
                            y += 2;

                            doc.setDrawColor(...C.grey);
                            doc.setLineWidth(0.2);
                            doc.setLineDashPattern([2, 2], 0);
                            doc.line(mL + 10, y, mL + 10 + 60, y);
                            doc.setLineDashPattern([], 0);
                            y += 4;
                            doc.setTextColor(...sec.color);
                            doc.setFontSize(7);
                            doc.setFont('courier', 'bold');
                            doc.text(locClean, mL + 10, y);

                            y += 10;
                        });

                        y += 6;
                    });

                    // ============ FOOTER ============
                    checkPage(25);
                    doc.setFillColor(...C.black);
                    doc.rect(mL, y, cW, 0.8, 'F');
                    y += 6;
                    doc.setTextColor(150, 150, 150);
                    doc.setFontSize(7);
                    doc.setFont('courier', 'normal');
                    doc.text('GENERATED FROM BIOCATALYST.GR  //  ALL TIMES INDICATIVE & SUBJECT TO MINOR ADJUSTMENTS', mL, y);
                    y += 5;
                    doc.setTextColor(...C.purple);
                    doc.setFontSize(8);
                    doc.setFont('courier', 'bold');
                    doc.text('#BIOCATALYST  #STARTUPGREECEWEEK2026  #UOI  #IOANNINA', mL, y);

                    addPageFooter();

                    doc.save('Biocatalyst_Official_Program_2026.pdf');
                } catch(err) {
                    console.error('PDF generation error:', err);
                }

                downloadPdfBtn.innerHTML = originalText;
                downloadPdfBtn.style.pointerEvents = 'auto';
            });
        }

        // Speed-Inertia Skewing (Scroll Dynamics)
        const skewElements = document.querySelectorAll('.bento-grid, .speaker-grid, .sponsor-grid, .perks-grid');
        let currentScroll = window.scrollY;
        let skewVelocity = 0;

        function animateSkew() {
            const newScroll = window.scrollY;
            const delta = newScroll - currentScroll;
            currentScroll = newScroll;
            
            skewVelocity = skewVelocity * 0.8 + (delta * 0.05);
            const skewAngle = Math.max(-12, Math.min(12, skewVelocity));
            
            skewElements.forEach(el => {
                el.style.transform = `skewY(${skewAngle}deg)`;
            });

            if (Math.abs(delta) < 1 && Math.abs(skewAngle) < 0.1) {
                skewVelocity = 0;
                skewElements.forEach(el => el.style.transform = 'skewY(0deg)');
            } else {
                window.skewRafId = requestAnimationFrame(animateSkew);
            }
        }
        window.addEventListener('scroll', () => {
            if (!window.skewRafId) window.skewRafId = requestAnimationFrame(animateSkew);
        });
        window.skewRafId = requestAnimationFrame(animateSkew);

        // Kinetic Particle Typography
        const kCanvas = document.getElementById('kineticText');
        if (kCanvas) {
            const kCtx = kCanvas.getContext('2d', { willReadFrequently: true });
            const pWidth = kCanvas.width;
            const pHeight = kCanvas.height;
            let particles = [];
            
            const words = ['HACK', 'BUILD', 'CODE', 'MUTATE', 'SOLVE'];
            let currentWordIndex = 0;
            
            const osCanvas = document.createElement('canvas');
            osCanvas.width = pWidth;
            osCanvas.height = pHeight;
            const osCtx = osCanvas.getContext('2d', { willReadFrequently: true });
            
            function sampleWord(word) {
                osCtx.clearRect(0, 0, pWidth, pHeight);
                osCtx.fillStyle = 'white';
                osCtx.font = 'bold 45px "Arial Black", Impact, sans-serif';
                osCtx.textAlign = 'center';
                osCtx.textBaseline = 'middle';
                osCtx.fillText(word, pWidth/2, pHeight/2);
                
                const imgData = osCtx.getImageData(0, 0, pWidth, pHeight).data;
                const newTargets = [];
                for (let y = 0; y < pHeight; y += 3) {
                    for (let x = 0; x < pWidth; x += 3) {
                        const idx = (y * pWidth + x) * 4;
                        if (imgData[idx + 3] > 128) {
                            newTargets.push({x, y});
                        }
                    }
                }
                
                while (particles.length < newTargets.length) {
                    particles.push({
                        x: Math.random() * pWidth,
                        y: Math.random() * pHeight,
                        baseX: pWidth/2,
                        baseY: pHeight/2,
                        vx: 0, vy: 0,
                        size: Math.random() * 1.5 + 1
                    });
                }
                if (particles.length > newTargets.length) {
                    particles.length = newTargets.length;
                }
                
                newTargets.sort(() => Math.random() - 0.5);
                for (let i = 0; i < newTargets.length; i++) {
                    particles[i].baseX = newTargets[i].x;
                    particles[i].baseY = newTargets[i].y;
                }
            }
            
            sampleWord(words[currentWordIndex]);
            
            let kmouse = { x: -999, y: -999 };
            kCanvas.addEventListener('mousemove', (e) => {
                const rect = kCanvas.getBoundingClientRect();
                kmouse.x = e.clientX - rect.left;
                kmouse.y = e.clientY - rect.top;
            });
            kCanvas.addEventListener('mouseleave', () => {
                kmouse.x = -999;
                kmouse.y = -999;
            });
            
            kCanvas.addEventListener('click', () => {
                particles.forEach(p => {
                    p.vx = (Math.random() - 0.5) * 50;
                    p.vy = (Math.random() - 0.5) * 50;
                });
                
                currentWordIndex = (currentWordIndex + 1) % words.length;
                sampleWord(words[currentWordIndex]);
                
                if (window.audioCtx) {
                    const now = window.audioCtx.currentTime;
                    const osc = window.audioCtx.createOscillator();
                    osc.connect(window.audioCtx.destination);
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(100, now);
                    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
                    osc.start(now); osc.stop(now + 0.1);
                }
            });

            function animateKinetic() {
                kCtx.clearRect(0, 0, pWidth, pHeight);
                kCtx.fillStyle = document.body.classList.contains('cyber-red') ? '#f43f5e' : (document.body.classList.contains('biohazard') ? '#4ade80' : '#ffffff');
                
                particles.forEach(p => {
                    const dx = p.x - kmouse.x;
                    const dy = p.y - kmouse.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 40) {
                        const force = (40 - dist) / 40;
                        p.vx += (dx / dist) * force * 5;
                        p.vy += (dy / dist) * force * 5;
                    }
                    
                    p.vx += (p.baseX - p.x) * 0.05;
                    p.vy += (p.baseY - p.y) * 0.05;
                    
                    p.vx *= 0.8;
                    p.vy *= 0.8;
                    
                    p.x += p.vx;
                    p.y += p.vy;
                    
                    kCtx.beginPath();
                    kCtx.arc(p.x, p.y, p.size, 0, Math.PI*2);
                    kCtx.fill();
                });
                
                requestAnimationFrame(animateKinetic);
            }
            animateKinetic();
        }


        // Wobbly "Bio-Wave" Headers
        const wobblyHeaders = document.querySelectorAll('h1, h2.section-header');
        wobblyHeaders.forEach(header => {
            const text = header.innerText;
            header.innerHTML = '';
            header.style.display = 'inline-block';
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.innerText = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                span.style.transition = 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                header.appendChild(span);
            });
            
            header.addEventListener('mouseenter', () => {
                const spans = header.querySelectorAll('span');
                spans.forEach((span, i) => {
                    setTimeout(() => {
                        span.style.transform = 'translateY(-15px) scaleY(1.3) skewX(-10deg)';
                        setTimeout(() => {
                            span.style.transform = 'translateY(0) scaleY(1) skewX(0)';
                        }, 200);
                    }, i * 35);
                });
            });
        });

        // Spring-Loaded CTA Buttons
        const springBtns = document.querySelectorAll('.cta-btn, .tab-btn, button');
        springBtns.forEach(btn => {
            btn.style.transformOrigin = 'center';
            btn.style.display = 'inline-block';
            let sScale = 1; let vScale = 0; let tScale = 1;
            
            btn.addEventListener('mousedown', () => { tScale = 0.85; if (!btn.rafId) btn.rafId = requestAnimationFrame(animateBtn); });
            btn.addEventListener('mouseup', () => { tScale = 1; vScale = 0.2; if (!btn.rafId) btn.rafId = requestAnimationFrame(animateBtn); });
            btn.addEventListener('mouseleave', () => { tScale = 1; if (!btn.rafId) btn.rafId = requestAnimationFrame(animateBtn); });
            
            function animateBtn() {
                vScale += (tScale - sScale) * 0.3;
                vScale *= 0.7;
                sScale += vScale;
                if (Math.abs(vScale) > 0.001 || Math.abs(tScale - sScale) > 0.001) {
                    btn.style.transform = `scale(${sScale})`;
                    btn.rafId = requestAnimationFrame(animateBtn);
                } else {
                    btn.rafId = null;
                }
            }
        });

        // 6. Elastic "Jelly" Bento Cards Physics
        const bentoBoxes = document.querySelectorAll('.bento-box');
        bentoBoxes.forEach(box => {
            box.spring = {
                rotX: 0, vRotX: 0, tRotX: 0,
                rotY: 0, vRotY: 0, tRotY: 0,
                scaleX: 1, vScaleX: 0, tScaleX: 1,
                scaleY: 1, vScaleY: 0, tScaleY: 1,
                transX: 0, vTransX: 0, tTransX: 0,
                transY: 0, vTransY: 0, tTransY: 0,
                shadow: 10, vShadow: 0, tShadow: 10
            };
            
            box.addEventListener('mousemove', (e) => {
                const rect = box.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                box.spring.tRotX = ((y - centerY) / centerY) * -10; 
                box.spring.tRotY = ((x - centerX) / centerX) * 10;
                box.spring.tScaleX = 1.02;
                box.spring.tScaleY = 1.02;
                box.spring.tTransX = 4;
                box.spring.tTransY = 4;
                box.spring.tShadow = 4;
                if (!window.jellyRafId) window.jellyRafId = requestAnimationFrame(animateJelly);
            });

            box.addEventListener('mouseleave', () => {
                box.spring.tRotX = 0;
                box.spring.tRotY = 0;
                box.spring.tScaleX = 1;
                box.spring.tScaleY = 1;
                box.spring.tTransX = 0;
                box.spring.tTransY = 0;
                box.spring.tShadow = 10;
                
                // Organic wobble on exit
                box.spring.vScaleX = (Math.random() > 0.5 ? 0.04 : -0.04);
                box.spring.vScaleY = (Math.random() > 0.5 ? 0.04 : -0.04);
                box.spring.vRotX = (Math.random() > 0.5 ? 2 : -2);
                box.spring.vRotY = (Math.random() > 0.5 ? 2 : -2);
                if (!window.jellyRafId) window.jellyRafId = requestAnimationFrame(animateJelly);
            });
            
            box.addEventListener('mousedown', () => {
                box.spring.tScaleX = 0.95;
                box.spring.tScaleY = 0.95;
                if (!window.jellyRafId) window.jellyRafId = requestAnimationFrame(animateJelly);
            });
            
            box.addEventListener('mouseup', () => {
                box.spring.tScaleX = 1.02;
                box.spring.tScaleY = 1.02;
                box.spring.vScaleX = 0.08;
                box.spring.vScaleY = 0.08;
                if (!window.jellyRafId) window.jellyRafId = requestAnimationFrame(animateJelly);
            });
        });

        function animateJelly() {
            const tension = 0.15;
            const friction = 0.75;
            let active = false;
            
            bentoBoxes.forEach(box => {
                const s = box.spring;
                
                s.vRotX += (s.tRotX - s.rotX) * tension; s.vRotX *= friction; s.rotX += s.vRotX;
                s.vRotY += (s.tRotY - s.rotY) * tension; s.vRotY *= friction; s.rotY += s.vRotY;
                s.vScaleX += (s.tScaleX - s.scaleX) * tension; s.vScaleX *= friction; s.scaleX += s.vScaleX;
                s.vScaleY += (s.tScaleY - s.scaleY) * tension; s.vScaleY *= friction; s.scaleY += s.vScaleY;
                s.vTransX += (s.tTransX - s.transX) * tension; s.vTransX *= friction; s.transX += s.vTransX;
                s.vTransY += (s.tTransY - s.transY) * tension; s.vTransY *= friction; s.transY += s.vTransY;
                s.vShadow += (s.tShadow - s.shadow) * tension; s.vShadow *= friction; s.shadow += s.vShadow;
                
                if (Math.abs(s.vRotX)>0.01 || Math.abs(s.tRotX-s.rotX)>0.01 || Math.abs(s.vRotY)>0.01 || Math.abs(s.tRotY-s.rotY)>0.01 || Math.abs(s.vScaleX)>0.01 || Math.abs(s.tScaleX-s.scaleX)>0.01 || Math.abs(s.vScaleY)>0.01 || Math.abs(s.tScaleY-s.scaleY)>0.01 || Math.abs(s.vTransX)>0.01 || Math.abs(s.tTransX-s.transX)>0.01 || Math.abs(s.vTransY)>0.01 || Math.abs(s.tTransY-s.transY)>0.01 || Math.abs(s.vShadow)>0.01 || Math.abs(s.tShadow-s.shadow)>0.01) {
                    active = true;
                    box.style.transform = `perspective(1000px) translate(${s.transX}px, ${s.transY}px) rotateX(${s.rotX}deg) rotateY(${s.rotY}deg) scale3d(${s.scaleX}, ${s.scaleY}, 1)`;
                    box.style.boxShadow = `${s.shadow}px ${s.shadow}px 0px var(--black)`;
                }
            });
            
            if (active) window.jellyRafId = requestAnimationFrame(animateJelly);
            else window.jellyRafId = null;
        }

        // 7. Hero Jelly Blocks Physics
        const heroContainers = document.querySelectorAll('.block-green, .block-purple');
        heroContainers.forEach(container => {
            const jellyText = container.querySelector('.jelly-text');
            if (!jellyText) return;
            
            jellyText.spring = {
                rotX: 0, vRotX: 0, tRotX: 0,
                rotY: 0, vRotY: 0, tRotY: 0,
                scaleX: 1, vScaleX: 0, tScaleX: 1,
                scaleY: 1, vScaleY: 0, tScaleY: 1
            };
            
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                jellyText.spring.tRotX = ((y - centerY) / centerY) * -25;
                jellyText.spring.tRotY = ((x - centerX) / centerX) * 25;
                jellyText.spring.tScaleX = 1.1;
                jellyText.spring.tScaleY = 1.1;
                if (!window.heroJellyRafId) window.heroJellyRafId = requestAnimationFrame(animateHeroJelly);
            });

            container.addEventListener('mouseleave', () => {
                jellyText.spring.tRotX = 0;
                jellyText.spring.tRotY = 0;
                jellyText.spring.tScaleX = 1;
                jellyText.spring.tScaleY = 1;
                
                jellyText.spring.vScaleX = (Math.random() > 0.5 ? 0.1 : -0.1);
                jellyText.spring.vScaleY = (Math.random() > 0.5 ? 0.1 : -0.1);
                jellyText.spring.vRotX = (Math.random() > 0.5 ? 8 : -8);
                jellyText.spring.vRotY = (Math.random() > 0.5 ? 8 : -8);
                if (!window.heroJellyRafId) window.heroJellyRafId = requestAnimationFrame(animateHeroJelly);
            });
            
            container.addEventListener('mousedown', () => {
                jellyText.spring.tScaleX = 0.85;
                jellyText.spring.tScaleY = 0.85;
                if (!window.heroJellyRafId) window.heroJellyRafId = requestAnimationFrame(animateHeroJelly);
            });
            
            container.addEventListener('mouseup', () => {
                jellyText.spring.tScaleX = 1.1;
                jellyText.spring.tScaleY = 1.1;
                jellyText.spring.vScaleX = 0.2;
                jellyText.spring.vScaleY = 0.2;
                if (!window.heroJellyRafId) window.heroJellyRafId = requestAnimationFrame(animateHeroJelly);
            });
        });

        function animateHeroJelly() {
            const tension = 0.12;
            const friction = 0.70;
            let active = false;
            
            const jellyTexts = document.querySelectorAll('.jelly-text');
            jellyTexts.forEach(jellyText => {
                if (!jellyText.spring) return;
                const s = jellyText.spring;
                
                s.vRotX += (s.tRotX - s.rotX) * tension; s.vRotX *= friction; s.rotX += s.vRotX;
                s.vRotY += (s.tRotY - s.rotY) * tension; s.vRotY *= friction; s.rotY += s.vRotY;
                s.vScaleX += (s.tScaleX - s.scaleX) * tension; s.vScaleX *= friction; s.scaleX += s.vScaleX;
                s.vScaleY += (s.tScaleY - s.scaleY) * tension; s.vScaleY *= friction; s.scaleY += s.vScaleY;
                
                if (Math.abs(s.vRotX)>0.01 || Math.abs(s.tRotX-s.rotX)>0.01 || Math.abs(s.vRotY)>0.01 || Math.abs(s.tRotY-s.rotY)>0.01 || Math.abs(s.vScaleX)>0.01 || Math.abs(s.tScaleX-s.scaleX)>0.01 || Math.abs(s.vScaleY)>0.01 || Math.abs(s.tScaleY-s.scaleY)>0.01) {
                    active = true;
                    jellyText.style.transform = `perspective(800px) rotateX(${s.rotX}deg) rotateY(${s.rotY}deg) scale3d(${s.scaleX}, ${s.scaleY}, 1)`;
                }
            });
            
            if (active) window.heroJellyRafId = requestAnimationFrame(animateHeroJelly);
            else window.heroJellyRafId = null;
        }

        // 8. Perk Scratch & Burst Physics
        const perkCards = document.querySelectorAll('.perk-card');
        const burstThemes = {
            'merch': ['🎒', '👕', '🏷️', '✨', '🎟️', '🧢'],
            'catering': ['☕', '🥐', '🍕', '🥪', '🥤', '🍩'],
            'awards': ['🏆', '🥇', '⭐', '🚀', '💡', '🎉'],
            'mentorship': ['💼', '📈', '⚖️', '🤝', '🎯', '🏛️'],
            'networking': ['🌐', '👥', '🧬', '💬', '⚡', '🤝'],
            'certificate': ['📜', '🎓', '🏅', '✨', '🖋️', '⭐'],
            'hardware': ['🔋', '💻', '⚡', '💾', '⚙️']
        };

        perkCards.forEach(card => {
            const canvas = card.querySelector('.scratch-pad');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let isDrawing = false;
            let isRevealed = false;

            function initCanvas() {
                const w = card.offsetWidth || 280;
                const h = card.offsetHeight || 280;
                canvas.width = w;
                canvas.height = h;
                
                ctx.fillStyle = '#b3b3b3';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                for(let i=0; i<900; i++) {
                    ctx.fillStyle = Math.random() > 0.5 ? '#999' : '#ccc';
                    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 3, 3);
                }
                
                ctx.fillStyle = '#000';
                ctx.font = 'bold 22px "Space Grotesk", Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('SCRATCH ME ★', canvas.width/2, canvas.height/2 + 8);
                
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.lineWidth = 45;
                ctx.globalCompositeOperation = 'destination-out';
            }
            setTimeout(initCanvas, 150);
            window.addEventListener('resize', () => { if(!isRevealed) initCanvas(); });

            function getMousePos(e) {
                const rect = canvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return { x: clientX - rect.left, y: clientY - rect.top };
            }

            function scratch(e) {
                if (!isDrawing || isRevealed) return;
                const pos = getMousePos(e);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
                
                if (Math.random() > 0.75) checkReveal();
            }

            canvas.addEventListener('mousedown', (e) => {
                if(isRevealed) return;
                isDrawing = true;
                const pos = getMousePos(e);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
            });

            canvas.addEventListener('mousemove', scratch);
            window.addEventListener('mouseup', () => { isDrawing = false; });

            canvas.addEventListener('touchstart', (e) => {
                if(isRevealed) return;
                isDrawing = true;
                const pos = getMousePos(e);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
            }, { passive: true });

            canvas.addEventListener('touchmove', scratch, { passive: true });
            window.addEventListener('touchend', () => { isDrawing = false; });

            canvas.addEventListener('dblclick', () => {
                revealCard();
            });

            function checkReveal() {
                const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                let transparentPixels = 0;
                for (let i = 3; i < pixels.length; i += 4) {
                    if (pixels[i] === 0) transparentPixels++;
                }
                const clearPercentage = transparentPixels / (pixels.length / 4);
                
                if (clearPercentage > 0.35) { 
                    revealCard();
                }
            }

            function revealCard() {
                if (isRevealed) return;
                isRevealed = true;
                canvas.style.opacity = '0';
                setTimeout(() => canvas.style.pointerEvents = 'none', 500);
                triggerBurst(card);
            }

            function triggerBurst(card) {
                const rect = card.getBoundingClientRect();
                const theme = card.getAttribute('data-perk');
                const emojis = burstThemes[theme] || ['✨'];
                
                for(let i=0; i<30; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'emoji-particle';
                    particle.innerText = emojis[Math.floor(Math.random() * emojis.length)];
                    
                    const startX = rect.left + (Math.random() * rect.width);
                    const startY = rect.top + (rect.height / 2);
                    particle.style.left = startX + 'px';
                    particle.style.top = startY + 'px';
                    
                    const duration = 0.8 + Math.random() * 0.7;
                    particle.style.animationDuration = duration + 's';
                    
                    document.body.appendChild(particle);
                    setTimeout(() => particle.remove(), duration * 1000);
                }
            }
        });

        // 9. Tactile Elastic Accordion
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const summary = item.querySelector('.faq-summary');
            const icon = item.querySelector('.faq-icon');
            const wrapper = item.querySelector('.faq-content-wrapper');
            const content = item.querySelector('.faq-content');
            
            let isOpen = false;
            let currentHeight = 0;
            let targetHeight = 0;
            let currentRot = 0;
            let targetRot = 0;
            
            let vHeight = 0;
            let vRot = 0;
            
            const tension = 0.15;
            const friction = 0.75;
            
            summary.addEventListener('click', () => {
                isOpen = !isOpen;
                item.setAttribute('data-open', isOpen);
                targetHeight = isOpen ? content.offsetHeight : 0;
                targetRot = isOpen ? 180 : 0;
                if (!item.faqRafId) item.faqRafId = requestAnimationFrame(animateFAQ);
            });

            function animateFAQ() {
                vHeight += (targetHeight - currentHeight) * tension;
                vHeight *= friction;
                currentHeight += vHeight;
                
                vRot += (targetRot - currentRot) * tension;
                vRot *= friction;
                currentRot += vRot;
                
                let active = false;
                if (Math.abs(vHeight) > 0.01 || Math.abs(targetHeight - currentHeight) > 0.01) {
                    wrapper.style.height = Math.max(0, currentHeight) + 'px';
                    active = true;
                }
                if (Math.abs(vRot) > 0.01 || Math.abs(targetRot - currentRot) > 0.01) {
                    icon.style.transform = `rotate(${currentRot}deg)`;
                    active = true;
                }
                
                if (active) {
                    item.faqRafId = requestAnimationFrame(animateFAQ);
                } else {
                    item.faqRafId = null;
                }
            }
        });

        // 10. Footer Bio-Slime Wave
        const slimeCanvas = document.getElementById('slimeCanvas');
        if (slimeCanvas) {
            const ctxSlime = slimeCanvas.getContext('2d');
            let nodes = [];
            const numNodes = 100;

            function initSlime() {
                slimeCanvas.width = window.innerWidth;
                slimeCanvas.height = 42;
                nodes = [];
                for (let i = 0; i <= numNodes; i++) {
                    nodes.push({ x: (i / numNodes) * slimeCanvas.width, y: 35, vy: 0, targetY: 35 });
                }
            }
            initSlime();
            window.addEventListener('resize', initSlime);

            window.addEventListener('mousemove', (e) => {
                const rect = slimeCanvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                // If cursor is near the canvas top edge (which is at top -40)
                if (mouseX > 0 && mouseX < slimeCanvas.width && mouseY > -50 && mouseY < 100) {
                    const index = Math.round((mouseX / slimeCanvas.width) * numNodes);
                    if (index >= 0 && index <= numNodes) {
                        // Push node down
                        nodes[index].vy += 15;
                        if (index > 0) nodes[index-1].vy += 8;
                        if (index < numNodes) nodes[index+1].vy += 8;
                        if (index > 1) nodes[index-2].vy += 4;
                        if (index < numNodes-1) nodes[index+2].vy += 4;
                    }
                    if (!slimeCanvas.slimeRafId) slimeCanvas.slimeRafId = requestAnimationFrame(drawSlime);
                }
            });

            function drawSlime() {
                ctxSlime.clearRect(0, 0, slimeCanvas.width, slimeCanvas.height);
                
                const tension = 0.05;
                const friction = 0.85;
                let active = false;
                for (let i = 0; i <= numNodes; i++) {
                    let n = nodes[i];
                    n.vy += (n.targetY - n.y) * tension;
                    n.vy *= friction;
                    n.y += n.vy;
                    if (Math.abs(n.vy) > 0.01 || Math.abs(n.targetY - n.y) > 0.01) active = true;
                }

                ctxSlime.beginPath();
                ctxSlime.moveTo(nodes[0].x, nodes[0].y);
                for (let i = 1; i <= numNodes; i++) {
                    ctxSlime.lineTo(nodes[i].x, nodes[i].y);
                }
                ctxSlime.strokeStyle = '#00ff00';
                ctxSlime.lineWidth = 6;
                ctxSlime.lineJoin = 'round';
                ctxSlime.stroke();

                ctxSlime.lineTo(slimeCanvas.width, slimeCanvas.height);
                ctxSlime.lineTo(0, slimeCanvas.height);
                ctxSlime.closePath();
                ctxSlime.fillStyle = '#111111'; // var(--black) equivalent
                ctxSlime.fill();
                
                if (active) slimeCanvas.slimeRafId = requestAnimationFrame(drawSlime);
                else slimeCanvas.slimeRafId = null;
            }
        }

        // 11. Springy Socials

        const socialIconsList = document.querySelectorAll('.social-icon');
        socialIconsList.forEach(icon => {
            icon.spring = { rot: 0, vRot: 0, tRot: 0, y: 0, vY: 0, tY: 0 };
            icon.addEventListener('mouseenter', () => { 
                icon.spring.tY = -15; 
                icon.spring.tRot = -10 + Math.random() * 20; 
                if (!window.socialsRafId) window.socialsRafId = requestAnimationFrame(animateSocials);
            });
            icon.addEventListener('mouseleave', () => { 
                icon.spring.tY = 0; 
                icon.spring.tRot = 0; 
                if (!window.socialsRafId) window.socialsRafId = requestAnimationFrame(animateSocials);
            });
        });
        
        function animateSocials() {
            let active = false;
            socialIconsList.forEach(icon => {
                let s = icon.spring;
                s.vY += (s.tY - s.y) * 0.2; s.vY *= 0.7; s.y += s.vY;
                s.vRot += (s.tRot - s.rot) * 0.2; s.vRot *= 0.7; s.rot += s.vRot;
                if (Math.abs(s.vY) > 0.01 || Math.abs(s.vRot) > 0.01 || Math.abs(s.tY - s.y) > 0.01) {
                    active = true;
                    icon.style.transform = `translateY(${s.y}px) rotate(${s.rot}deg)`;
                }
            });
            if (active) window.socialsRafId = requestAnimationFrame(animateSocials);
            else window.socialsRafId = null;
        }

        // 12. Liquid Squish Physics for Floating Buttons
        const liquidBtns = [document.getElementById('hazardToggle'), document.getElementById('crtToggle'), document.getElementById('arcadeTrigger')].filter(Boolean);
        
        liquidBtns.forEach(btn => {
            btn.liquidSpring = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, squish: 1, vs: 0 };
            
            // On Click Squish
            btn.addEventListener('click', () => {
                btn.liquidSpring.squish = 0.4; // flatten vertically
                if (!window.liquidRafId) window.liquidRafId = requestAnimationFrame(animateLiquidBtns);
            });
            btn.addEventListener('mouseenter', () => { if (!window.liquidRafId) window.liquidRafId = requestAnimationFrame(animateLiquidBtns); });
            btn.addEventListener('mouseleave', () => { if (!window.liquidRafId) window.liquidRafId = requestAnimationFrame(animateLiquidBtns); });
        });

        function animateLiquidBtns() {
            let active = false;
            liquidBtns.forEach(btn => {
                const isArcade = btn.id === 'arcadeTrigger';

                // Spring Physics
                btn.liquidSpring.vx += (btn.liquidSpring.tx - btn.liquidSpring.x) * 0.15;
                btn.liquidSpring.vx *= 0.75;
                btn.liquidSpring.x += btn.liquidSpring.vx;

                btn.liquidSpring.vy += (btn.liquidSpring.ty - btn.liquidSpring.y) * 0.15;
                btn.liquidSpring.vy *= 0.75;
                btn.liquidSpring.y += btn.liquidSpring.vy;

                // Squish physics
                btn.liquidSpring.vs += (1 - btn.liquidSpring.squish) * 0.25;
                btn.liquidSpring.vs *= 0.7;
                btn.liquidSpring.squish += btn.liquidSpring.vs;

                if (Math.abs(btn.liquidSpring.vx)>0.01 || Math.abs(btn.liquidSpring.vy)>0.01 || Math.abs(btn.liquidSpring.vs)>0.01 || Math.abs(btn.liquidSpring.tx-btn.liquidSpring.x)>0.01 || Math.abs(btn.liquidSpring.ty-btn.liquidSpring.y)>0.01 || Math.abs(1-btn.liquidSpring.squish)>0.01) {
                    active = true;
                    let transformStr = isArcade ? `translateX(calc(-50% + ${btn.liquidSpring.x}px))` : `translateX(${btn.liquidSpring.x}px)`;
                    transformStr += ` translateY(${btn.liquidSpring.y}px) scaleY(${btn.liquidSpring.squish}) scaleX(${1 + (1 - btn.liquidSpring.squish) * 0.5})`;
                    btn.style.transform = transformStr;
                }
            });
            if (active) window.liquidRafId = requestAnimationFrame(animateLiquidBtns);
            else window.liquidRafId = null;
        }
        // 13. Mobile Burger Menu Toggle
        function toggleMobileMenu() {
            document.getElementById('mobileNav').classList.toggle('open');
            document.getElementById('burgerBtn').classList.toggle('open');
        }
        document.getElementById('burgerBtn')?.addEventListener('click', toggleMobileMenu);


