
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

    /* ===== LEKCJA 4: QUIZ ===== */
    const questionsL4 = [
        { q: "Czym jest hiperparametr Learning Rate (Współczynnik uczenia)?", opts: [{t: "Rozmiarem pamięci graficznej (VRAM) wymaganej do pobrania.", c: false}, {t: "Mnożnikiem kontrolującym jak wielki krok w stronę minimum błędu sieć stawia po korekcie logiki.", c: true}, {t: "Czasem pomiędzy kolejnymi paczkami ładowanymi z CSV.", c: false}] },
        { q: "Jak zachowa się sieć trenowana ze zbyt wielkim Learning Rate (np. rzędu 500.0)?", opts: [{t: "Algorytm może zgubić zbieżność, chaotycznie przeskakując minimum a błąd wzrośnie do nieskończoności.", c: true}, {t: "Nauka przebiegnie ekstremalnie powoli i precyzyjnie.", c: false}, {t: "Wykres Loss w ogóle się nie narysuje przez brak zgodności typów w Pandasie.", c: false}] },
        { q: "Co determinuje mały Batch Size (Rozmiar Paczki = 16)?", opts: [{t: "Obliczenia oparte tylko na 16 próbkach dają chwiejny ale bardzo szybki krok schodzący w dół.", c: true}, {t: "Wymaga ogromnej mocy procesora do uśredniania dziesiątek tysięcy losowań gradientu by gładko iść.", c: false}, {t: "Zmniejsza moc sieci tak że uczy się tylko 16 warstw układu głębokiego ukrytego.", c: false}] },
        { q: "Za co odpowiada Optymalizator 'Adam' w Kerasie?", opts: [{t: "Jest to funkcja straty używana zamiast Huber do oceny problemów kategorycznych", c: false}, {t: "Jest inteligentnym algorytmem zjazdowym, który z każdym krokiem dostosowuje pęd i współczynnik LR bezwładnościowo dla każdej wagi strukturalnej zmniejszając wpływ wahań w labiryncie błędu.", c: true}, {t: "Część frameworku wczytująca zdjęcia z systemu lokalnego komputera do GPU.", c: false}] },
        { q: "Co się najprawdopodobniej stanie gdy ułożymy strukturę o głębi np. 10.000 warstw dla małego pliku Excela (z 20 wierszami prób)?", opts: [{t: "Model się zawiesi brakiem możliwości przetworzenia w Pythonie", c: false}, {t: "Sieć wykaże zjawisko Overfittingu (Przeuczenia) z powodu ogromnej ilości miejsca do memoratyzacji prób.", c: true}, {t: "Wygeneruje świetny wynik na teście, zwalczając całkowicie błąd Underfittingu", c: false}] }
    ];
    const qL4 = document.getElementById('quiz-l4');
    if(qL4) renderQuiz(qL4, questionsL4);


    /* ===== LEKCJA 4: BATCH SIZE INTERACTIVE ===== */
    const bsButtons = document.querySelectorAll('.bs-btn');
    const bsActiveLine = document.getElementById('bs-active-line');
    const bsDescText = document.getElementById('bs-desc-text');

    if (bsButtons.length > 0 && bsActiveLine && bsDescText) {
        bsButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                bsButtons.forEach(b => {
                    b.classList.remove('active');
                    b.style.background = 'transparent';
                });
                
                btn.classList.add('active');
                
                const bsType = btn.getAttribute('data-bs');
                if (bsType === 'small') {
                    btn.style.background = 'rgba(224, 108, 117, 0.2)';
                    bsActiveLine.className = 'bs-line bs-zigzag';
                    bsDescText.innerHTML = '<b>Rozmiar 16:</b> Trening maszynowy jest "głośny" i wysoce chaotyczny! Wykres stochastycznie skacze z gigantycznymi schodami, ponieważ poprawka nakładana jest na logikę na podstawie niepewnej opinii od garstki zaledwie szesnastu przykładów. Daje to jednak zjawisko pomocnego "szumu" ułatwiającego wyrwanie się z pułapek optymalizacji matematycznej.';
                } else if (bsType === 'large') {
                    btn.style.background = 'rgba(97, 175, 239, 0.2)';
                    bsActiveLine.className = 'bs-line bs-smooth';
                    bsDescText.innerHTML = '<b>Rozmiar 1024:</b> Trening maszynowy jest "łagodny" i spokojny jak rzeka. Uśredniona masa ponad tysiąca próbek stłumiła każdą pojedynczą odstającą pomyłkę. Pozwala to sieci idealnie skupić się na inżynieryjnych kierunkach spadku funkcji, ale biada jej, jeśli po drodze znajdzie się fałszywa głęboka dziura (tzw. Local Minima) - ugrzęźnie w niej nie mając szalonych skoków by z niej wyskoczyć!';
                }
            });
        });
    }


    /* ===== LEKCJA 4: HYPERPARAM TRAINING SIMULATOR ===== */
    const simCanvas = document.getElementById('trainSimChart');
    if (simCanvas) {
        const ctx4 = simCanvas.getContext('2d');
        let simChart;
        
        const lrSlider = document.getElementById('sim-lr-slider'); // 0 to 3
        const bsSlider = document.getElementById('sim-bs-slider'); // 0 to 2
        const lrVal = document.getElementById('sim-lr-val');
        const bsVal = document.getElementById('sim-bs-val');
        const btnTrain = document.getElementById('sim-train-btn');
        
        let trainInterval;
        let epoch = 0;
        let lossHistory = [];
        let valLossHistory = [];
        let currentLoss = 2.0; 
        
        // Zależności do logiki
        // LRs: 0 -> mały, 1 -> optymalny, 2 -> wysoki, 3 -> ogromny
        const lrMap = [0.0001, 0.001, 0.1, 10.0];
        const lrNames = ["0.0001 (Micro)", "0.001 (Optymalny)", "0.1 (Zbyt duży)", "10.0 (Wybuchowy)"];
        // Batches: 0 -> 16, 1 -> 64, 2 -> 1024
        const bsMap = [16, 64, 1024];

        const terminalContent = document.getElementById('terminal-content');
        function addTerminalLog(ep, lossVal, valLossVal) {
            if (!terminalContent) return;
            const logLine = document.createElement('div');
            logLine.style.marginBottom = '6px';
            logLine.innerHTML = `Epoch ${ep}/50 <br><span style="color:#98c379;">100/100 ━━━━━━━━━━━━━━━━━━━━</span> <span style="color:#61afef;">loss:</span> <span style="color:#fff;">${lossVal.toFixed(4)}</span> - <span style="color:#e5c07b;">val_loss:</span> <span style="color:#fff;">${valLossVal.toFixed(4)}</span>`;
            terminalContent.appendChild(logLine);
            terminalContent.scrollTop = terminalContent.scrollHeight;
        }

        function clearTerminal() {
            if (terminalContent) {
                terminalContent.innerHTML = '<div style="color:#5c2d91; margin-bottom:5px;"><i>-- Przygotowywanie rdzeni GPU, Model.fit() w gotowości... --</i></div>';
            }
        }

        function initSimChart() {
            if (simChart) simChart.destroy();
            lossHistory = [];
            valLossHistory = [];
            epoch = 0;
            currentLoss = 2.0;
            
            clearTerminal();

            simChart = new Chart(ctx4, {
                type: 'line',
                data: {
                    labels: [], // epochs
                    datasets: [
                        {
                            label: 'Strata Treningowa (Loss)',
                            data: lossHistory,
                            borderColor: '#61afef',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            tension: 0.1,
                            pointRadius: 2
                        },
                        {
                            label: 'Strata Walidacyjna (Val_Loss)',
                            data: valLossHistory,
                            borderColor: '#e5c07b',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            tension: 0.1,
                            pointRadius: 2,
                            borderDash: [5, 3]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 0 },
                    scales: {
                        x: {
                            title: { display: true, text: 'Epoki (Czas)', color: '#888' },
                            grid: { color: 'rgba(255,255,255,0.05)' }
                        },
                        y: {
                            min: 0, suggestedMax: 2.5,
                            title: { display: true, text: 'Poziom błędu (Loss)', color: '#888' },
                            grid: { color: 'rgba(255,255,255,0.05)' }
                        }
                    }
                }
            });
        }

        function updateLabels() {
            if(lrSlider) lrVal.innerText = lrNames[parseInt(lrSlider.value)];
            if(bsSlider) bsVal.innerText = bsMap[parseInt(bsSlider.value)].toString();
        }

        if(lrSlider) lrSlider.addEventListener('input', updateLabels);
        if(bsSlider) bsSlider.addEventListener('input', updateLabels);
        
        function stepTraining() {
            if (epoch >= 50) {
                clearInterval(trainInterval);
                btnTrain.innerText = "Trening Zakończony (Zresetuj)";
                btnTrain.style.background = "linear-gradient(135deg, #5c2d91 0%, #3e1b66 100%)";
                if (terminalContent) {
                     const endNote = document.createElement('div');
                     endNote.style.color = '#fff';
                     endNote.style.marginTop = '10px';
                     endNote.style.fontWeight = 'bold';
                     endNote.innerText = "Model dopasowany. Trening przerwany.";
                     terminalContent.appendChild(endNote);
                     terminalContent.scrollTop = terminalContent.scrollHeight;
                }
                return;
            }

            const lrIdx = parseInt(lrSlider.value);
            const bsIdx = parseInt(bsSlider.value);

            // Logika symulacji
            let stochNoise = 0;
            if (bsIdx === 0) stochNoise = (Math.random() - 0.5) * 0.4; // 16: dużo szumu
            if (bsIdx === 1) stochNoise = (Math.random() - 0.5) * 0.1; // 64: zbalansowany szum
            if (bsIdx === 2) stochNoise = (Math.random() - 0.5) * 0.02; // 1024: gładko

            let descent = 0;
            if (lrIdx === 0) descent = 0.01 + stochNoise * 0.1; // bardzo powoli schodzi
            if (lrIdx === 1) descent = (currentLoss * 0.1) + stochNoise; // optymalnie schodzi (krzywa eksponencjalna)
            if (lrIdx === 2) descent = (currentLoss * -0.05) + stochNoise * 2; // odbija się / nie schodzi efektywnie
            if (lrIdx === 3) descent = -1.0; // wybuch gradientu
            
            currentLoss = currentLoss - descent;
            
            // Zmodyfikowany ogranicznik, wykres naturalnie dopasuje skalę Y dla wielkich liczb
            if (currentLoss > 100.0) currentLoss = 100.0; 
            if (currentLoss < 0.1) currentLoss = 0.1 + Math.abs(stochNoise * 0.5);

            let vLoss = currentLoss + Math.abs(stochNoise * 1.5) + (epoch/100); // lekki overfit na koniec

            lossHistory.push(currentLoss);
            valLossHistory.push(vLoss);
            simChart.data.labels.push(epoch + 1);
            
            simChart.update();
            addTerminalLog(epoch + 1, currentLoss, vLoss);
            epoch++;
        }

        if(btnTrain) {
            btnTrain.addEventListener('click', () => {
                if (btnTrain.innerText.includes("Zatrzymaj")) {
                    clearInterval(trainInterval);
                    btnTrain.innerText = "Wznów Trening";
                    btnTrain.style.background = "linear-gradient(135deg, #5c2d91 0%, #3e1b66 100%)";
                } else {
                    if (epoch >= 50) initSimChart(); // zaczynamy od nowa jezeli juz doszlismy do min epok
                    if(epoch === 0) clearTerminal();
                    btnTrain.innerText = "Zatrzymaj (Stop)";
                    btnTrain.style.background = "#e06c75";
                    trainInterval = setInterval(stepTraining, 100);
                }
            });
        }
        
        updateLabels();
        initSimChart();
    }

    /* ===== LEKCJA 5: QUIZ ===== */
    const questionsL5 = [
        { q: "Jaką rolę pełni warstwa BatchNormalization?", opts: [{t: "Przyspiesza ładowanie zdjęć na kartę graficzną.", c: false}, {t: "Standaryzuje ukryte aktywacje wewnątrz sieci, zapobiegając nadmiernym wahaniom gradientów i przyspieszając naukę.", c: true}, {t: "Kasuje połowę danych ze zbioru MNIST by zmniejszyć objętość.", c: false}] },
        { q: "Czym jest zjawisko Overfittingu?", opts: [{t: "Błędem sprzętowym wynikającym z przeładowania VRAM.", c: false}, {t: "Niedostosowaniem modelu, gdy jest on zbyt słaby na rozróżnianie klas.", c: false}, {t: "Przeuczeniem; sieć doskonale zdaje sprawdzian naukowy 'na pamięć' gubiąc zdolność poprawnej klasyfikacji całkowicie nowych przykładów (tzw. brak generalizacji).", c: true}] },
        { q: "Co dokładnie robi L2 Regularization (Ridge)?", opts: [{t: "Redukuje wymiary fotografii podczas podglądu.", c: false}, {t: "Dodaje karę do funkcji straty za nazbyt duże wzrosty wag komórek, co zmusza układ do gładkości wektorów.", c: true}, {t: "Przerywa odpalony proces fit() po 5 krokach straty.", c: false}] },
        { q: "Do czego służy parametr `patience=5` przy uruchomieniu Callbacks (EarlyStopping)?", opts: [{t: "Model poczeka z rozpoczęciem treningu 5 minut po wywołaniu kodu.", c: false}, {t: "Przerwie szkolenie gdy strata walidacyjna nie odnotuje poprawy od pięciu Epok z rzędu powracając do najlepszych wag z przeszłości.", c: true}, {t: "Zatrzyma uczenie za pięć piętnasta.", c: false}] },
        { q: "Kiedy powinniśmy użyć Keras Tunera RandomSearch zamiast ręcznego zgadywania np. Dropout Rate w kodzie?", opts: [{t: "Używamy go zawsze, bo szaleńczo zmniejsza nasz czas ręcznego szukania najlepszego stosunku cech poprzez maszynowe próby i błędy.", c: true}, {t: "Nigdy, to zabroniona praktyka i zawsze powinno wpisywać się `0.5`.", c: false}, {t: "Wyłącznie przy podłączeniach na API w chmurze Google Colab dla serwera wirtualnego.", c: false}] }
    ];
    const qL5 = document.getElementById('quiz-l5');
    if(qL5) renderQuiz(qL5, questionsL5);

    /* ===== LEKCJA 5: DROPOUT INTERACTIVE ===== */
    const doNet = document.getElementById('dropout-net');
    if(doNet) {
        let hHTML = '';
        for(let i=0; i<8; i++) {
            hHTML += `<div id="do-node-${i}" style="width:40px; height:40px; border-radius:50%; background:#c678dd; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; transition: all 0.3s ease;">
                <div class="cross" style="display:none; position:absolute; width:100%; height:4px; background:#e06c75; transform:rotate(45deg); box-shadow: 0 0 5px #000;"></div>
                <div class="cross" style="display:none; position:absolute; width:100%; height:4px; background:#e06c75; transform:rotate(-45deg); box-shadow: 0 0 5px #000;"></div>
            </div>`;
        }
        doNet.innerHTML = hHTML;

        setInterval(() => {
            for(let i=0; i<8; i++) {
                let n = document.getElementById(`do-node-${i}`);
                if(n) {
                    n.style.background = '#c678dd';
                    n.querySelectorAll('.cross').forEach(c => c.style.display = 'none');
                    n.style.opacity = '1';
                    n.style.transform = 'scale(1)';
                }
            }
            let dropped = [];
            while(dropped.length < 3) {
                let rd = Math.floor(Math.random() * 8);
                if(!dropped.includes(rd)) dropped.push(rd);
            }
            dropped.forEach(d => {
                let n = document.getElementById(`do-node-${d}`);
                if(n) {
                    n.style.background = '#333';
                    n.style.opacity = '0.3';
                    n.style.transform = 'scale(0.8)';
                    n.querySelectorAll('.cross').forEach(c => c.style.display = 'block');
                }
            });
        }, 1500);
    }

    /* ===== LEKCJA 5: REGULARIZATION SIMULATOR ===== */
    const regSimCanvas = document.getElementById('regularizationSimChart');
    if (regSimCanvas) {
        const ctx5 = regSimCanvas.getContext('2d');
        let regSimChart;
        
        const regSlider = document.getElementById('reg-str-slider'); // 0=None, 1=Good, 2=Heavy
        const regValText = document.getElementById('reg-str-val');
        const btnRegTrain = document.getElementById('reg-train-btn');
        const regTerminalContent = document.getElementById('reg-terminal-content');
        const earlyStopBanner = document.getElementById('early-stop-banner');
        
        let regInterval;
        let regEpoch = 0;
        let rLossHistory = [];
        let rValLossHistory = [];
        let rCurrentLoss = 2.0; 
        let patienceCounter = 0;
        let minValLoss = 999;
        let isStopped = false;

        const regNames = ["Brak (Overfitting Alert!)", "Optymalna (L2 + Dropout)", "Zbyt Silna (Underfit)"];

        function addRegTerminalLog(ep, lossVal, valLossVal, msgStr = '') {
            if (!regTerminalContent) return;
            const logLine = document.createElement('div');
            logLine.style.marginBottom = '6px';
            if (msgStr) {
                logLine.innerHTML = `<span style="color:#e06c75; font-weight:bold;">${msgStr}</span>`;
            } else {
                logLine.innerHTML = `Epoch ${ep}/50 <br><span style="color:#c678dd;">100/100 ━━━━━━━━━━━━━━━━━━━━</span> <span style="color:#61afef;">loss:</span> <span style="color:#fff;">${lossVal.toFixed(4)}</span> - <span style="color:#e5c07b;">val_loss:</span> <span style="color:#fff;">${valLossVal.toFixed(4)}</span>`;
            }
            regTerminalContent.appendChild(logLine);
            regTerminalContent.scrollTop = regTerminalContent.scrollHeight;
        }

        function clearRegTerminal() {
            if (regTerminalContent) {
                regTerminalContent.innerHTML = '<div style="color:#c678dd; margin-bottom:5px;"><i>-- Model.fit() zainicjowane z Callbacks --</i></div>';
            }
        }

        function initRegSimChart() {
            if (regSimChart) regSimChart.destroy();
            rLossHistory = [];
            rValLossHistory = [];
            regEpoch = 0;
            patienceCounter = 0;
            minValLoss = 999;
            rCurrentLoss = 2.0;
            isStopped = false;
            
            clearRegTerminal();
            if(earlyStopBanner) earlyStopBanner.style.display = 'none';

            regSimChart = new Chart(ctx5, {
                type: 'line',
                data: {
                    labels: [], // epochs
                    datasets: [
                        {
                            label: 'Loss',
                            data: rLossHistory,
                            borderColor: '#61afef',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            tension: 0.2,
                            pointRadius: 1
                        },
                        {
                            label: 'Val_Loss',
                            data: rValLossHistory,
                            borderColor: '#e06c75',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            tension: 0.2,
                            pointRadius: 1,
                            borderDash: [4, 4]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 0 },
                    scales: {
                        x: {
                            title: { display: true, text: 'Epoki', color: '#888' },
                            grid: { color: 'rgba(255,255,255,0.05)' }
                        },
                        y: {
                            min: 0, suggestedMax: 2.5,
                            title: { display: true, text: 'Błąd (Loss)', color: '#888' },
                            grid: { color: 'rgba(255,255,255,0.05)' }
                        }
                    }
                }
            });
        }

        function updateRegLabels() {
            if(regSlider && regValText) regValText.innerText = regNames[parseInt(regSlider.value)];
        }

        if(regSlider) regSlider.addEventListener('input', updateRegLabels);
        
        function stepRegTraining() {
            if (regEpoch >= 50 || isStopped) {
                clearInterval(regInterval);
                btnRegTrain.innerText = isStopped ? "Zrestartuj Model" : "Zakończono Trening (Reset)";
                btnRegTrain.style.background = "linear-gradient(135deg, #c678dd 0%, #85379e 100%)";
                return;
            }

            const rIdx = parseInt(regSlider.value);
            
            let descent = 0;
            let overfitPenalty = 0;

            if (rIdx === 0) {
                descent = (rCurrentLoss * 0.15);
                if(regEpoch > 8) overfitPenalty = (regEpoch - 8) * 0.08; 
            } else if (rIdx === 1) {
                descent = (rCurrentLoss * 0.08);
                if(regEpoch > 15) overfitPenalty = -0.01;
            } else if (rIdx === 2) {
                descent = (rCurrentLoss * 0.02);
                overfitPenalty = 0;
            }

            rCurrentLoss = rCurrentLoss - descent;
            if (rCurrentLoss < 0.05) rCurrentLoss = 0.05;

            let stochNoise = (Math.random() - 0.5) * 0.05;

            let vLoss = rCurrentLoss + overfitPenalty + Math.abs(stochNoise) + 0.1;

            if (vLoss < minValLoss) {
                minValLoss = vLoss;
                patienceCounter = 0;
            } else {
                patienceCounter++;
            }

            rLossHistory.push(rCurrentLoss);
            rValLossHistory.push(vLoss);
            regSimChart.data.labels.push(regEpoch + 1);
            
            regSimChart.update();
            addRegTerminalLog(regEpoch + 1, rCurrentLoss, vLoss);

            if (patienceCounter >= 5) {
                addRegTerminalLog(regEpoch + 1, 0, 0, `early_stop: Brak poprawy val_loss przez 5 epok. Przerwanie uczenia.`);
                if(earlyStopBanner) earlyStopBanner.style.display = 'block';
                isStopped = true;
            }

            regEpoch++;
        }

        if(btnRegTrain) {
            btnRegTrain.addEventListener('click', () => {
                if (btnRegTrain.innerText.includes("Zatrzymaj")) {
                    clearInterval(regInterval);
                    btnRegTrain.innerText = "Wznów Trening";
                    btnRegTrain.style.background = "linear-gradient(135deg, #c678dd 0%, #85379e 100%)";
                } else {
                    if (regEpoch >= 50 || isStopped) initRegSimChart(); 
                    if(regEpoch === 0) clearRegTerminal();
                    btnRegTrain.innerText = "Zatrzymaj (Stop)";
                    btnRegTrain.style.background = "#e06c75";
                    regInterval = setInterval(stepRegTraining, 120);
                }
            });
        }
        
        updateRegLabels();
        initRegSimChart();
    }
});
