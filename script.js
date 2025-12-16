document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation & Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) navLinks.classList.remove('active');
            }
        });
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.2 });

    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => observer.observe(el));

    // Navbar Scroll Shadow
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.style.boxShadow = '0 10px 30px -10px rgba(2, 12, 27, 0.7)';
        else navbar.style.boxShadow = 'none';
    });

    // Mobile Menu
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                Object.assign(navLinks.style, {
                    display: 'flex', flexDirection: 'column', position: 'absolute',
                    top: '80px', right: '0', width: '100%',
                    background: '#050f1a', padding: '2rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                });
            } else {
                navLinks.style.display = '';
            }
        });
    }

    // --- PHASE 2 IMPL ---

    // 1. Real-Time Status Panel Simulation
    function updateDashboard() {
        const agents = document.querySelector('#activeAgents');
        const level = document.querySelector('#threatLevel');
        const sync = document.querySelector('#lastSync');

        if (agents) agents.innerText = Math.floor(Math.random() * 5) + 2; // Random 2-6
        if (level && !document.body.classList.contains('threat-mode')) {
            const levels = ['LOW', 'MODERATE', 'GUARDED'];
            level.innerText = levels[Math.floor(Math.random() * levels.length)];
            level.style.color = '#64ffda';
        }
        if (sync) {
            const now = new Date();
            sync.innerText = now.toLocaleTimeString();
        }
    }
    setInterval(updateDashboard, 10000); // Update 10s
    updateDashboard(); // Init

    // 2. Alert Feed Simulation
    const alertFeed = document.getElementById('alertFeed');
    const alertsData = [
        { rule: 'SSH Brute Force Detected', agent: 'Web-Srv-01', severity: 'HIGH', badge: '12', color: 'high' },
        { rule: 'Suspicious Powershell Exec', agent: 'Workstation-HR', severity: 'HIGH', badge: '10', color: 'high' },
        { rule: 'Outbound Traffic to Tor', agent: 'DB-Main', severity: 'MED', badge: '6', color: 'med' },
        { rule: 'New Admin User Created', agent: 'AD-Controller', severity: 'HIGH', badge: '15', color: 'high' },
        { rule: 'SQL Injection Attempt', agent: 'Public-Portal', severity: 'MED', badge: '8', color: 'med' }
    ];

    function addAlert() {
        if (!alertFeed) return;
        const alert = alertsData[Math.floor(Math.random() * alertsData.length)];
        const el = document.createElement('div');
        el.className = `alert-card severity-${alert.color}`;
        el.innerHTML = `
            <div class="alert-info">
                <span class="alert-badge ${alert.color}">Lvl ${alert.badge}</span>
                <span>${alert.rule}</span>
            </div>
            <div class="alert-meta">
                <span class="alert-host">${alert.agent}</span>
            </div>
        `;

        alertFeed.prepend(el);
        if (alertFeed.children.length > 3) {
            alertFeed.lastElementChild.remove(); // Keep only 3
        }
    }
    setInterval(addAlert, 4000);
    addAlert();

    // 3. Threat Mode Toggle & Matrix Effect
    const threatToggle = document.getElementById('threatToggle');
    const canvas = document.getElementById('matrixCanvas');
    let matrixInterval;

    if (threatToggle) {
        threatToggle.addEventListener('change', function () {
            if (this.checked) {
                document.body.classList.add('threat-mode');
                document.getElementById('threatLevel').innerText = 'CRITICAL';
                document.getElementById('threatLevel').style.color = '#ff4444';
                startMatrix();
            } else {
                document.body.classList.remove('threat-mode');
                document.getElementById('threatLevel').innerText = 'LOW';
                document.getElementById('threatLevel').style.color = '#64ffda';
                stopMatrix();
            }
        });
    }

    function startMatrix() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let x = 0; x < columns; x++) drops[x] = 1;

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#ff003c'; // Red for Threat Mode
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
                    drops[i] = 0;
                drops[i]++;
            }
        };

        matrixInterval = setInterval(draw, 30);
    }

    function stopMatrix() {
        clearInterval(matrixInterval);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --- Project Card PDF Download Logic ---
    const projectCards = document.querySelectorAll('.project-card');

    // Map existing project titles to PDF filenames
    // Note: Titles must match the index.html content (or use includes)
    const pdfMapping = {
        'Wazuh → Telegram Alerting': 'public/pdfs/SIEM Alert Automation.pdf',
        'External Perimeter Assessment': 'public/pdfs/External Permieter Assesment.pdf',
        'Internal Application Security Review': 'public/pdfs/Internal_Application_Security_Review.pdf'
    };

    projectCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Do not trigger download if clicking on an interactive element (link/button)
            if (e.target.closest('a') || e.target.closest('button')) return;

            const titleEl = this.querySelector('h3');
            if (titleEl) {
                const title = titleEl.innerText.trim();
                const pdfFile = pdfMapping[title];

                if (pdfFile) {
                    // Create invisible link to trigger download
                    const link = document.createElement('a');
                    link.href = pdfFile;
                    link.download = pdfFile;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        });
    });
});

// Modal Global Functions
window.openModal = function (e) {
    if (e) e.preventDefault();
    document.getElementById('contactModal').style.display = 'flex';
}

window.closeModal = function () {
    document.getElementById('contactModal').style.display = 'none';
}

/* --- Interactive Terminal Logic --- */
document.addEventListener('DOMContentLoaded', () => {
    const termOutput = document.getElementById('terminalOutput');
    const termInput = document.getElementById('terminalInput');
    const termBody = document.getElementById('terminalBody');
    const inputDisplay = document.getElementById('inputDisplay');

    if (!termInput) return; // Guard clause if element missing

    let commandHistory = [];
    let historyIndex = -1;

    // Sync input to display span
    termInput.addEventListener('input', () => {
        inputDisplay.innerText = termInput.value;
    });

    const commands = {
        help: () => {
            return `
<div class="cmd-list">
  <div class="cmd-item"><span>skills</span>Show Blue Team / Red Team capabilities</div>
  <div class="cmd-item"><span>projects</span>List cybersecurity case studies</div>
  <div class="cmd-item"><span>about</span>About me</div>
  <div class="cmd-item"><span>contact</span>Show communication channels</div>
  <div class="cmd-item"><span>clear</span>Clear the terminal screen</div>
</div>`;
        },
        skills: () => {
            return `
<div class="response-info">
  <strong>Blue Team:</strong><br>
  &nbsp;&nbsp;• Log Analysis<br>
  &nbsp;&nbsp;• SIEM (Wazuh)<br>
  &nbsp;&nbsp;• Incident Response<br>
  &nbsp;&nbsp;• Threat Hunting<br>
  <br>
  <strong>Red Team:</strong><br>
  &nbsp;&nbsp;• Reconnaissance<br>
  &nbsp;&nbsp;• Basic Exploitation<br>
  &nbsp;&nbsp;• Web Penetration Testing<br>
  &nbsp;&nbsp;• Social Engineering Simulation
</div>`;
        },
        projects: () => {
            return `
<div class="response-info">
  1. <strong>Wazuh SIEM Alert Automation System</strong><br>
  2. <strong>Brute-Force Detection and Response R&D</strong><br>
  3. <strong>Cybersecurity Portfolio (Blue + Red Team Showcase)</strong>
</div>`;
        },
        about: () => {
            return `
<div class="response-info">
  <strong>Operator:</strong> Kahlil Gibran<br>
  <strong>Role:</strong> Blue Team + Red Team Hybrid<br>
  <strong>Status:</strong> <span style="color: #00ff00">Online</span>
</div>`;
        },
        contact: () => {
            return `
<div class="response-info">
  <strong>LinkedIn:</strong> <a href="#" style="color: #64ffda">linkedin.com/in/kahlilgibran</a><br>
  <strong>GitHub:</strong> <a href="#" style="color: #64ffda">github.com/kahlilgibran</a><br>
  <strong>Telegram:</strong> <a href="#" style="color: #64ffda">@kahlil_sec</a>
</div>`;
        },
        clear: () => {
            termOutput.innerHTML = '';
            return '';
        }
    };

    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = termInput.value.trim();
            if (!input) {
                // Just new line
                addToOutput(`root@portfolio:~$ `);
                // Clear input
                termInput.value = '';
                inputDisplay.innerText = '';
                scrollToBottom();
                return;
            }

            // Add value to output
            addToOutput(`root@portfolio:~$ ${escapeHtml(input)}`);

            // Add to history
            commandHistory.push(input);
            historyIndex = commandHistory.length;

            // Process command
            processCommand(input.toLowerCase());

            // Clear input
            termInput.value = '';
            inputDisplay.innerText = '';
            scrollToBottom();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                termInput.value = commandHistory[historyIndex];
                inputDisplay.innerText = termInput.value;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                termInput.value = commandHistory[historyIndex];
                inputDisplay.innerText = termInput.value;
            } else {
                historyIndex = commandHistory.length;
                termInput.value = '';
                inputDisplay.innerText = '';
            }
        }
    });

    function processCommand(cmd) {
        if (commands[cmd]) {
            const response = commands[cmd]();
            if (response) addToOutput(response);
        } else {
            addToOutput(`<div class="response-error">Command not recognized. Type <span class="cmd-highlight">'help'</span> for available commands.</div>`);
        }
    }

    function addToOutput(html) {
        const div = document.createElement('div');
        div.className = 'output-line';
        div.innerHTML = html;
        termOutput.appendChild(div);
    }

    function scrollToBottom() {
        termBody.scrollTop = termBody.scrollHeight;
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Auto focus on click
    document.querySelector('.terminal-window').addEventListener('click', () => {
        termInput.focus();
    });
});
