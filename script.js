
document.addEventListener('DOMContentLoaded', () => {

    /* ===== TOC ACTIVE TRACKING ===== */
    const tocLinks = document.querySelectorAll('.toc-list a');
    const sections = [];

    tocLinks.forEach(link => {
        const id = link.getAttribute('href')?.replace('#', '');
        if (id) {
            const el = document.getElementById(id);
            if (el) sections.push({ el, link });
        }
    });

    if (sections.length > 0) {
        const updateActive = () => {
            let current = sections[0];
            for (const s of sections) {
                if (s.el.getBoundingClientRect().top <= 150) current = s;
            }
            tocLinks.forEach(l => l.classList.remove('active'));
            current.link.classList.add('active');
        };
        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
    }

    /* ===== QUIZ FUNCTIONALITY ===== */
    const quizContainers = document.querySelectorAll('.quiz-container');

    // Baza pytań dla Lekcji 1
    const questionsL1 = [
        { q: "Czym jest Perceptron?", opts: [{t: "Najprostszym sztucznym neuronem, klasyfikatorem liniowym", c: true}, {t: "Zaawansowaną głęboką siecią", c: false}, {t: "Metodą redukcji wymiarów", c: false}] },
        { q: "Do czego służy parametr Bias (W0)?", opts: [{t: "Do mnożenia wyników na końcu pętli", c: false}, {t: "Do przesuwania granicy decyzyjnej, jako punkt startowy", c: true}, {t: "To wyjście funkcji Softmax", c: false}] },
        { q: "Jak Perceptron modyfikuje swoje wagi w pętli uczącej?", opts: [{t: "Wagi są zawsze stałe", c: false}, {t: "Tylko wtedy, gdy poprawnie odgadnie etykietę", c: false}, {t: "Bierze pod uwagę rozmiar i kierunek popełnionego błędu", c: true}] },
        { q: "Czym jest funkcja krokowa (Step function) w perceptronie?", opts: [{t: "Ogranicza sygnał do wartości binarnej 0 lub 1 w zależności od progu", c: true}, {t: "Zwraca ułamek prawdopodobieństwa", c: false}, {t: "Liczy średnią ważoną", c: false}] },
        { q: "Dlaczego Klasyczny Perceptron poległ na problemie XOR?", opts: [{t: "Ponieważ nie ma dość pamięci RAM", c: false}, {t: "Ponieważ dane w XOR nie układają się w sposób liniowy do oddzielenia 1 kreską", c: true}, {t: "Ponieważ bramki logiczne nie istnieją w statystyce", c: false}] }
    ];

    // Baza pytań dla Lekcji 2
    const questionsL2 = [
        { q: "Do czego służy warstwa Dense (Gęsta) w sieci MLP?", opts: [{t: "Filtruje szum z obrazków", c: false}, {t: "Każdy neuron jest powiązany z każdym neuronem z warstwy poprzedniej", c: true}, {t: "Służy do przechowywania baz danych", c: false}] },
        { q: "Za co odpowiada funkcja aktywacji ReLU?", opts: [{t: "Zwraca 0 dla wartości ujemnych, a dla reszty przepuszcza sygnał bez zmian", c: true}, {t: "Zwraca prawdopodobieństwa od 0 do 1", c: false}, {t: "Liczy kwadrat z wejścia", c: false}] },
        { q: "Do czego najczęściej stosuje się funkcję Softmax?", opts: [{t: "Na wejściu, by wyczyścić szumy", c: false}, {t: "Na samym końcu, aby zmienić wartości na dystrybucję szans sumującą się do 100%", c: true}, {t: "Do odcinania zera podczas propagacji wstecznej", c: false}] },
        { q: "Dlaczego algorytm Adam jest lepszy od sztywnego Learning Rate?", opts: [{t: "Nie jest lepszy, to tylko przestarzała nakładka", c: false}, {t: "Sam dynamicznie modyfikuje wielkość kroku nauki podczas opadania na mapie błędu", c: true}, {t: "Oblicza zawsze dokładnie 0 na wyjściu", c: false}] },
        { q: "Funkcja np.argmax(probs, axis=1) służy do:", opts: [{t: "Wyciągnięcia z tabeli Softmax indeksu klasy o największej pewności (zwycięzcy)", c: true}, {t: "Podniesienia do maksymalnej potęgi każdej wartości", c: false}, {t: "Usunięcia danych", c: false}] }
    ];

    // Baza pytań dla Lekcji 3
    const questionsL3 = [
        { q: "Którą funkcję aktywacji użylibyśmy w ostatniej warstwie w problemie Regresji?", opts: [{t: "Nie używalibyśmy żadnej (zwykle Linear/None), bo zniekształciłoby to naszą liczbę predykcji", c: true}, {t: "Softmax, aby rozrzucić prawodpodobieństwa do równego 100 procentowego stopnia.", c: false}, {t: "Trzeba używać zawsze ReLU na wyjściach.", c: false}] },
        { q: "Co jest kluczową zaletą zdefiniowanej funkcji błędów: Huber Loss?", opts: [{t: "To, że najszybciej się zlicza na GPU o słabych statystykach.", c: false}, {t: "Odwzorowuje idealny logarytm.", c: false}, {t: "Łączy spadek bezwzględny z kwadratowym odcięciem przez wariacyjne wygłuszanie szumów od silnych wartości odstających w zbiorze danych.", c: true}] },
        { q: "W jakim celu uruchamiane jest narzędzie tf.data.Dataset w Tensorflow?", opts: [{t: "Zwiększa rozmiar obwodu Dense tworząc więcej przestrzeni uczenia", c: false}, {t: "Tworzy asynchroniczne porcjowanie danych i ich ładowanie w locie skracające spowalniające wąskie gardła w sprzęcie na ram k. graficznej.", c: true}, {t: "Wyręcza kod w generowaniu klas na Softmax.", c: false}] },
        { q: "Do czego odnosi się polecenie '.shuffle()' w klasie Data Dataset?", opts: [{t: "Podrzuca dane wejściowe by sieć uczyła się na wzorcach, a nie na zablokowanej kolejności i rytmie zgadywanek", c: true}, {t: "Skaluje je wymiarem 1 do zera usuwając braki.", c: false}, {t: "Wymazuje wszystkie dane poza zakresem Delta.", c: false}] },
        { q: "Co ułatwia korzystanie z tzw. Class Subclassing API (dziedziczenie) w kodzie Model Keras z definicją __init__ w architekturach sieci MLP?", opts: [{t: "Wprowadza ograniczenie używania klas TensorFlow wykluczając ewentualne zawieszenie modelu przed jego zakończeniem.", c: false}, {t: "Kod nie staje się przez to szybszy, funkcja istnieje tylko w imię optymalizowania pliku kodu bez uzytku dla inżynierów", c: false}, {t: "Obudowywuje układy w szczelną klasę, ułatwia debugowanie skomplikowanych rozgałęzień (np skip connections).", c: true}] }
    ];

    function renderQuiz(container, questions) {
        if(!container) return;
        // Wyczyśćmy istniejący kod w HTML quizu
        const titleHTML = `<h3>🎓 Sprawdź swoją wiedzę</h3><p class="text-muted mt-2">5 pytań z materiału. Wybierz poprawną odpowiedź.</p>`;
        let qHTML = '';
        
        questions.forEach((item, idx) => {
            // randomize options optionally, but we leave it as is for simplicity
            let optionsHTML = '';
            item.opts.forEach(opt => {
                optionsHTML += `<div class="quiz-option" data-correct="${opt.c}">${opt.t}</div>`;
            });
            
            qHTML += `
            <div class="quiz-question">
                <p><strong>${idx+1}.</strong> ${item.q}</p>
                <div class="quiz-options">
                    ${optionsHTML}
                </div>
                <div class="quiz-feedback"></div>
            </div>`;
        });
        
        container.innerHTML = titleHTML + qHTML;

        // Podepnijmy listenery
        container.querySelectorAll('.quiz-option').forEach(opt => {
            opt.addEventListener('click', function() {
                const qBox = this.closest('.quiz-question');
                const allOpts = qBox.querySelectorAll('.quiz-option');
                const feedback = qBox.querySelector('.quiz-feedback');
                
                if (this.classList.contains('disabled')) return;
                
                // Disable all
                allOpts.forEach(o => {
                    o.classList.add('disabled');
                    if(o.dataset.correct === "true") o.classList.add('correct');
                });
                
                const isCorrect = this.dataset.correct === "true";
                if(isCorrect) {
                    this.classList.add('correct');
                    feedback.innerHTML = "Brawo! Prawidłowa odpowiedź.";
                    feedback.className = "quiz-feedback show success";
                } else {
                    this.classList.add('wrong');
                    feedback.innerHTML = "Niestety, to błędna odpowiedź.";
                    feedback.className = "quiz-feedback show error";
                }
            });
        });
    }

    const qL1 = document.getElementById('quiz-l1');
    if(qL1) renderQuiz(qL1, questionsL1);
    
    const qL2 = document.getElementById('quiz-l2');
    if(qL2) renderQuiz(qL2, questionsL2);

    const qL3 = document.getElementById('quiz-l3');
    if(qL3) renderQuiz(qL3, questionsL3);


    /* ===== MLP LOGIC (ARGMAX & SOFTMAX) ===== */
    const plSlider = document.getElementById('pl-slider');
    const plValText = document.getElementById('pl-val');
    const probsList = document.getElementById('probs-list');
    const finalChoice = document.getElementById('final-choice');

    if (plSlider) {
        plSlider.addEventListener('input', updateMLPLogic);
    }

    const flowerNames = ['Setosa (0)', 'Versicolor (1)', 'Virginica (2)'];

    function updateMLPLogic() {
        if (!plSlider || !probsList || !finalChoice) return;

        const pl = parseFloat(plSlider.value);
        if (plValText) plValText.innerText = pl.toFixed(1);

        let p0, p1, p2;
        if (pl < 2.5) {
            p0 = 0.85 + Math.random() * 0.1;
            p1 = (1 - p0) * 0.8;
            p2 = 1 - p0 - p1;
        } else if (pl > 4.8) {
            p2 = 0.8 + Math.random() * 0.15;
            p1 = (1 - p2) * 0.7;
            p0 = 1 - p2 - p1;
        } else {
            p1 = 0.7 + Math.random() * 0.25;
            p0 = (1 - p1) * 0.5;
            p2 = 1 - p1 - p0;
        }

        const probsArr = [p0.toFixed(2), p1.toFixed(2), p2.toFixed(2)];
        probsList.innerText = `[${probsArr[0]},  ${probsArr[1]},  ${probsArr[2]}]`;

        const maxVal = Math.max(...probsArr.map(Number));
        const maxIdx = probsArr.map(Number).indexOf(maxVal);
        
        const winner = flowerNames[maxIdx];
        finalChoice.innerText = `Wynik = Klasa Gatunkowa: ${winner}`;
    }
    if(plSlider) updateMLPLogic();


    /* ===== PERCEPTRON LOGIC (BIKE) ===== */
    const bSun = document.getElementById('bike-sun');
    const bTime = document.getElementById('bike-time');
    const bOk = document.getElementById('bike-ok');
    const bResult = document.getElementById('bike-result');

    function updateBike() {
        if(!bSun || !bTime || !bOk || !bResult) return;
        
        let x1 = bSun.checked ? 1 : 0;
        let x2 = bTime.checked ? 1 : 0;
        let x3 = bOk.checked ? 1 : 0;

        let w0 = -0.41;
        let w1 = -0.0797;
        let w2 = 0.3138;
        let w3 = 0.2271;

        let s = w0 + (w1 * x1) + (w2 * x2) + (w3 * x3);
        
        let isGoing = s >= 0 ? true : false;

        bResult.classList.remove('yes-go', 'no-go');
        
        if(isGoing) {
            bResult.classList.add('yes-go');
            bResult.innerText = `Potencjał wyjścia: ${s.toFixed(2)} ≥ 0 ➔ Decyzja Pozytywna (1)`;
        } else {
            bResult.classList.add('no-go');
            bResult.innerText = `Potencjał wyjścia: ${s.toFixed(2)} < 0 ➔ Decyzja Negatywna (0)`;
        }
    }

    if(bSun) bSun.addEventListener('change', updateBike);
    if(bTime) bTime.addEventListener('change', updateBike);
    if(bOk) bOk.addEventListener('change', updateBike);

    if(bSun) updateBike();


    /* ===== CHART.JS GLOBAL DEFAULTS ===== */
    if (window.Chart) {
        Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
        Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        Chart.defaults.plugins.tooltip.titleColor = '#fff';
        Chart.defaults.plugins.tooltip.bodyColor = '#ccc';
        Chart.defaults.plugins.tooltip.cornerRadius = 4;
        Chart.defaults.plugins.tooltip.padding = 10;
    }

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
                        { 
                            label: 'Klasa 0', 
                            data: pts.filter(p=>p.class===0), 
                            backgroundColor: '#e06c75', 
                            pointRadius: 8,
                            hoverRadius: 10,
                            borderWidth: 2,
                            borderColor: 'rgba(255,255,255,0.1)'
                        },
                        { 
                            label: 'Klasa 1', 
                            data: pts.filter(p=>p.class===1), 
                            backgroundColor: '#61afef', 
                            pointRadius: 8,
                            hoverRadius: 10,
                            borderWidth: 2,
                            borderColor: 'rgba(255,255,255,0.1)'
                        },
                        { 
                            label: 'Granica', 
                            data: lineData, 
                            type: 'line', 
                            borderColor: '#fff', 
                            borderWidth: 3, 
                            borderDash: [5, 5],
                            fill: false, 
                            pointRadius: 0,
                            tension: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false,
                    scales: {
                        x: { 
                            min: 0, max: 5,
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            title: { display: true, text: 'Cecha X1', color: '#888' }
                        },
                        y: { 
                            min: 0, max: 5,
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            title: { display: true, text: 'Cecha X2', color: '#888' }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                padding: 20,
                                font: { size: 12 }
                            }
                        }
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
            for(let x = -5; x <= 5; x+=0.2) {
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
                        borderWidth: 4,
                        pointRadius: 0,
                        fill: true,
                        backgroundColor: 'rgba(198, 120, 221, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 600, easing: 'easeOutQuart' },
                    scales: {
                        x: { 
                            min: -5, max: 5,
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            title: { display: true, text: 'Sygnał wejściowy (Z)', color: '#888' }
                        },
                        y: { 
                            min: funcType==='relu' ? -1 : -1.5, 
                            max: funcType==='relu' ? 5 : 1.5,
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            title: { display: true, text: 'Aktywacja (A)', color: '#888' }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        sel.addEventListener('change', drawActivation);
        drawActivation();
    }

    /* ===== LEKCJA 3: REGRESSION METRICS CHART ===== */
    const regCanvas = document.getElementById('regressionChart');
    if(regCanvas) {
        const ctx3 = regCanvas.getContext('2d');
        let regChart;

        // Wygenerujemy zbiór sztucznych punktów danych laboratoryjnych
        // np. X: 1..10, Y = ~2.5*X + 5 + noise
        const scatterPts = [];
        for(let i=0; i<40; i++) {
            let x = Math.random() * 10;
            let noise = (Math.random() - 0.5) * 8; // szum od -4 do 4
            scatterPts.push({ x: x, y: (2.5 * x + 5) + noise });
        }

        const rwSlider = document.getElementById('reg-w-slider');
        const rbSlider = document.getElementById('reg-b-slider');
        const txtMSE = document.getElementById('metric-mse');
        const txtMAE = document.getElementById('metric-mae');
        const txtW = document.getElementById('reg-w-val');
        const txtB = document.getElementById('reg-b-val');

        function drawRegressionLine() {
            if(!rwSlider || !rbSlider) return;

            const w = parseFloat(rwSlider.value);
            const b = parseFloat(rbSlider.value);

            txtW.innerText = w.toFixed(1);
            txtB.innerText = b.toFixed(1);

            let linePoints = [
                { x: 0, y: (w * 0) + b },
                { x: 10, y: (w * 10) + b }
            ];

            // Calculate Metrics
            let sum_se = 0;
            let sum_ae = 0;
            scatterPts.forEach(pt => {
                let pred = (w * pt.x) + b;
                let error = pt.y - pred;
                sum_se += error * error;
                sum_ae += Math.abs(error);
            });
            let mse = sum_se / scatterPts.length;
            let mae = sum_ae / scatterPts.length;

            txtMSE.innerText = mse.toFixed(2);
            txtMAE.innerText = mae.toFixed(2);

            if(regChart) regChart.destroy();

            regChart = new Chart(ctx3, {
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: 'Punkty laboratoryjne (True Y)',
                            data: scatterPts,
                            backgroundColor: '#61afef',
                            pointRadius: 5,
                            hoverRadius: 8,
                            borderColor: 'rgba(255,255,255,0.05)',
                        },
                        {
                            label: 'Regresja Modelu (Pred Y)',
                            data: linePoints,
                            type: 'line',
                            borderColor: '#e06c75',
                            borderWidth: 3,
                            pointRadius: 0,
                            fill: false,
                            tension: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false,
                    scales: {
                        x: { 
                            min: 0, max: 10,
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            title: { display: true, text: 'Zmienna Niezależna X', color: '#888' }
                        },
                        y: { 
                            min: 0, max: 40,
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            title: { display: true, text: 'Zmienna Zależna Y', color: '#888' }
                        }
                    },
                    plugins: {
                        legend: { position: 'top' }
                    }
                }
            });
        }

        rwSlider.addEventListener('input', drawRegressionLine);
        rbSlider.addEventListener('input', drawRegressionLine);
        drawRegressionLine();
    }
});
