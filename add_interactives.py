import os
import re

base_dir = r"c:/Users/recyt/Documents/GitHub/Nauka-na-Deep-Learning"
l1_path = os.path.join(base_dir, "lekcja1.html")
l2_path = os.path.join(base_dir, "lekcja2.html")
js_path = os.path.join(base_dir, "script.js")
css_path = os.path.join(base_dir, "style.css")

# --- LEKCJA 1: Perceptron Interactive Boundary ---

l1_interactive_html = """
    <div class="viz-container scale-in" style="background:#111; padding:30px; border-radius:8px; border:1px solid #333; margin:40px 0;">
        <div class="viz-title" style="color:#fff; font-size:18px; margin-bottom:15px; font-weight:bold;">📈 Interaktywna Granica Decyzyjna (Perceptron)</div>
        <p style="color:#aaa; font-size:14px; margin-bottom:20px;">Dopasuj wagi (W1, W2) i Bias, aby linia oddzieliła czerwone punkty od niebieskich.</p>
        <div class="controls" style="display:flex; gap:20px; flex-wrap:wrap; margin-bottom: 20px;">
            <div class="control-group">
                <label style="color:#61afef; font-size:12px; font-weight:bold;">Waga 1 (oś X): <span id="w1-val">1.0</span></label>
                <input type="range" id="w1-slider" min="-5" max="5" step="0.1" value="1.0" style="width:120px;">
            </div>
            <div class="control-group">
                <label style="color:#61afef; font-size:12px; font-weight:bold;">Waga 2 (oś Y): <span id="w2-val">-1.0</span></label>
                <input type="range" id="w2-slider" min="-5" max="5" step="0.1" value="-1.0" style="width:120px;">
            </div>
            <div class="control-group">
                <label style="color:#c678dd; font-size:12px; font-weight:bold;">Bias: <span id="b-val">0.0</span></label>
                <input type="range" id="b-slider" min="-10" max="10" step="0.5" value="0.0" style="width:120px;">
            </div>
        </div>
        <div style="position:relative; height: 350px; width: 100%; max-width: 500px; margin:0 auto; background:#fff; border-radius:4px;">
            <canvas id="decisionBoundaryChart"></canvas>
        </div>
    </div>
"""

with open(l1_path, "r", encoding="utf-8") as f:
    l1_html = f.read()

# Wklejamy tuż pod sekcją Ewaluacja Dokładności
match = re.search(r'(<section id="sec-6".*?</section>)', l1_html, re.DOTALL)
if match:
    sec6 = match.group(1)
    l1_html = l1_html.replace(sec6, sec6 + "\n" + l1_interactive_html)
    with open(l1_path, "w", encoding="utf-8") as f:
        f.write(l1_html)


# --- LEKCJA 2: Aktywacje Interactive Chart ---

l2_interactive_html = """
    <div class="viz-container scale-in" style="background:#111; padding:30px; border-radius:8px; border:1px solid #333; margin:40px 0;">
        <div class="viz-title" style="color:#fff; font-size:18px; margin-bottom:15px; font-weight:bold;">📈 Porównanie Funkcji Aktywacji</div>
        <p style="color:#aaa; font-size:14px; margin-bottom:20px;">Wybierz funkcję z listy, aby zobaczyć, jak przekształca sygnał wejściowy (Z) na wyjście (A).</p>
        <div class="controls" style="display:flex; gap:20px; margin-bottom: 20px; align-items:center;">
            <select id="activation-select" style="padding:10px; border-radius:4px; font-weight:bold; background:#222; color:#fff; border:1px solid #555;">
                <option value="relu">ReLU: max(0, Z)</option>
                <option value="sigmoid">Sigmoid: 1 / (1 + e^-Z)</option>
                <option value="tanh">Tanh: (e^Z - e^-Z) / (e^Z + e^-Z)</option>
            </select>
        </div>
        <div style="position:relative; height: 350px; width: 100%; max-width: 500px; margin:0 auto; background:#fff; border-radius:4px;">
            <canvas id="activationChart"></canvas>
        </div>
    </div>
"""

with open(l2_path, "r", encoding="utf-8") as f:
    l2_html = f.read()

# Wklejamy tuż pod Zdefiniowanie Połączeń (Dense i ReLU) (sekcja 3)
match = re.search(r'(<section id="sec-3".*?</section>)', l2_html, re.DOTALL)
if match:
    sec3 = match.group(1)
    l2_html = l2_html.replace(sec3, sec3 + "\n" + l2_interactive_html)
    with open(l2_path, "w", encoding="utf-8") as f:
        f.write(l2_html)


# --- SCRIPT JS (Append behavior) ---

js_append = """
    /* ===== LEKCJA 1: INTERACTIVE BOUNDARY ===== */
    const dbCanvas = document.getElementById('decisionBoundaryChart');
    if(dbCanvas) {
        const ctx = dbCanvas.getContext('2d');
        let dbChart;

        // Dataset (Red vs Blue points)
        const pts = [
            {x: 1, y: 1, class: 0}, {x: 2, y: 1.5, class: 0}, {x: 1.5, y: 2, class: 0},
            {x: 3, y: 3, class: 1}, {x: 4, y: 2.5, class: 1}, {x: 3.5, y: 4, class: 1}
        ];

        const w1sl = document.getElementById('w1-slider');
        const w2sl = document.getElementById('w2-slider');
        const bsl = document.getElementById('b-slider');

        function drawDecisionBoundary() {
            if(!w1sl || !w2sl || !bsl) return;
            const w1 = parseFloat(w1sl.value);
            const w2 = parseFloat(w2sl.value);
            const b = parseFloat(bsl.value);

            document.getElementById('w1-val').innerText = w1.toFixed(1);
            document.getElementById('w2-val').innerText = w2.toFixed(1);
            document.getElementById('b-val').innerText = b.toFixed(1);

            // Calculate line: w1*x + w2*y + b = 0  => y = (-w1*x - b) / w2
            let lineData = [];
            if(Math.abs(w2) > 0.01) {
                lineData.push({x: -5, y: (-w1 * -5 - b)/w2});
                lineData.push({x: 5, y: (-w1 * 5 - b)/w2});
            } else {
                lineData.push({x: -b/w1, y: -5});
                lineData.push({x: -b/w1, y: 5});
            }

            if(dbChart) dbChart.destroy();
            dbChart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [
                        { label: 'Klasa 0', data: pts.filter(p=>p.class===0), backgroundColor: '#e06c75', pointRadius:6 },
                        { label: 'Klasa 1', data: pts.filter(p=>p.class===1), backgroundColor: '#61afef', pointRadius:6 },
                        { label: 'Granica (-w1*X - b)/w2', data: lineData, type: 'line', borderColor: '#222', borderWidth: 2, fill: false, pointRadius:0}
                    ]
                },
                options: {
                    animation: false,
                    scales: {
                        x: { min: 0, max: 5 },
                        y: { min: 0, max: 5 }
                    }
                }
            });
        }

        w1sl.addEventListener('input', drawDecisionBoundary);
        w2sl.addEventListener('input', drawDecisionBoundary);
        bsl.addEventListener('input', drawDecisionBoundary);
        drawDecisionBoundary();
    }


    /* ===== LEKCJA 2: ACTIVATION CHART ===== */
    const actCanvas = document.getElementById('activationChart');
    if(actCanvas) {
        const ctx2 = actCanvas.getContext('2d');
        let actChart;

        const sel = document.getElementById('activation-select');

        function drawActivation() {
            const funcType = sel.value;
            let dataPoints = [];
            for(let x = -5; x <= 5; x+=0.5) {
                let y = 0;
                if(funcType === 'relu') y = Math.max(0, x);
                if(funcType === 'sigmoid') y = 1 / (1 + Math.exp(-x));
                if(funcType === 'tanh') y = Math.tanh(x);
                dataPoints.push({x: x, y: y});
            }

            if(actChart) actChart.destroy();
            actChart = new Chart(ctx2, {
                type: 'line',
                data: {
                    datasets: [{
                        label: funcType.toUpperCase(),
                        data: dataPoints,
                        borderColor: '#c678dd',
                        borderWidth: 3,
                        pointRadius: 2,
                        fill: false
                    }]
                },
                options: {
                    animation: { duration: 400 },
                    scales: {
                        x: { min: -5, max: 5 },
                        y: { min: funcType==='relu' ? -1 : -1.5, max: funcType==='relu' ? 5 : 1.5 }
                    }
                }
            });
        }

        sel.addEventListener('change', drawActivation);
        drawActivation();
    }
"""

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

# Append to loop
pos = js.rfind("});")
if pos != -1:
    js = js[:pos] + js_append + js[pos:]
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js)

print("Interactives added successfully!")
