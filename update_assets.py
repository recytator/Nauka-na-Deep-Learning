import os
import re

base_dir = r"c:/Users/recyt/Documents/GitHub/Nauka-na-Deep-Learning"
css_path = os.path.join(base_dir, "style.css")
js_path = os.path.join(base_dir, "script.js")

# 1. Update style.css
with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# Add new styles before the media query at the end
# The media query is at the very end
media_query_str = "@media (max-width: 600px)"
if media_query_str in css:
    css_before, css_after = css.split(media_query_str, 1)
else:
    css_before = css
    css_after = "\n}"

new_css = """
/* ===== SITE NAV (Top) ===== */
.site-nav { width: 100%; padding: 15px 50px; display: flex; align-items: center; justify-content: space-between; position: sticky; top:0; z-index: 100; backdrop-filter: blur(12px); background: rgba(5, 5, 5, 0.85); border-bottom: 1px solid #222; }
.nav-inner { width:100%; max-width: 1200px; margin: 0 auto; display:flex; justify-content:space-between; align-items:center; }
.nav-logo { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: 2px; text-transform: uppercase; text-decoration:none; display:flex; align-items:center; gap: 10px;}
.nav-links { display: flex; gap: 20px; list-style:none; }
.nav-links a { color: #888; text-decoration:none; font-weight:600; padding: 8px 16px; border-radius: 4px; transition:0.2s;}
.nav-links a:hover, .nav-links a.active { color:#fff; background: #222; }

/* ===== LESSON LAYOUT ===== */
.lesson-hero { text-align:center; padding: 60px 20px 40px; }
.lesson-hero-content h1 { font-size: 34px; font-weight: 800; color:#fff; }
.lesson-layout { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: grid; grid-template-columns: 260px 1fr; gap: 40px; align-items: start;}

/* ===== TOC SIDEBAR ===== */
.lesson-sidebar { position:sticky; top: 100px; align-self: start; max-height: calc(100vh - 120px); overflow-y: auto; }
.toc-title { font-size: 13px; font-weight:700; color:#666; text-transform:uppercase; letter-spacing:1px; margin-bottom:15px; }
.toc-list { list-style:none; border-left: 2px solid #222; }
.toc-list li { margin-bottom: 2px; }
.toc-list a { display:block; padding: 8px 15px; color:#888; text-decoration:none; font-size:14px; border-left: 2px solid transparent; margin-left:-2px; transition:0.2s; line-height:1.4;}
.toc-list a:hover, .toc-list a.active { color:#61afef; border-left-color: #61afef; background: #111; }

.content-section { margin-bottom: 60px; scroll-margin-top: 100px; }
.content-section h1 { font-size: 28px; margin-bottom: 20px; color:#fff;}
.content-section h2 { font-size: 24px; margin-bottom: 20px; color:#fff; padding-bottom:10px; border-bottom:1px solid #222;}

/* ===== QUIZ SECTION ===== */
.quiz-container { background: #111; border: 1px solid #333; border-radius: 8px; padding: 40px; margin-top: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);}
.quiz-container h3 { font-size: 22px; margin-bottom: 10px; color:#fff; }
.text-muted { color:#888; font-size:14px;}
.mt-2 { margin-top: 10px;}
.quiz-question { background: #0a0a0a; border: 1px solid #222; border-radius: 6px; padding: 20px; margin-top: 25px; }
.quiz-question p { color: #ccc; margin-bottom: 15px; font-weight:600;}
.quiz-options { display: flex; flex-direction: column; gap: 10px; }
.quiz-option { padding: 15px 20px; border: 1px solid #333; border-radius: 4px; background: #161616; color:#aaa; cursor:pointer; transition:0.2s; font-size:14px; font-weight:500;}
.quiz-option:hover { border-color: #666; color:#fff; background: #222;}
.quiz-option.correct { border-color: #98c379; background: #1a2e1d; color:#98c379; }
.quiz-option.wrong { border-color: #e06c75; background: #31181a; color:#e06c75; }
.quiz-option.disabled { pointer-events:none; opacity:0.6; }
.quiz-feedback { margin-top: 15px; padding: 10px 15px; border-radius: 4px; font-size:14px; display:none; }
.quiz-feedback.show { display:block; }
.quiz-feedback.success { background: #1a2e1d; color: #98c379; border: 1px solid #98c379;}
.quiz-feedback.error { background: #31181a; color: #e06c75; border: 1px solid #e06c75;}

/* ===== ADAPTING PREV/NEXT CLASSES ===== */
.lesson-nav { display:flex; justify-content:space-between; padding-top:40px; margin-top:40px; border-top:1px solid #333; }
.lesson-nav a { padding:15px 25px; border-radius:4px; font-weight:bold; background:#fff; color:#000; text-decoration:none; display:inline-block; transition:0.2s;}
.lesson-nav a:hover { background:#ddd; }

"""

combined_css = css_before + new_css + media_query_str + css_after
with open(css_path, "w", encoding="utf-8") as f:
    f.write(combined_css)


# 2. Update script.js
with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

# We need to strip the MENU LOGIC block and NAVIGATION logic since we are no longer SPA.
# We will just write a whole new script.js with the old perceptron and MLP parts and new TOC/Quiz parts.

new_js = """
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

});
"""

with open(js_path, "w", encoding="utf-8") as f:
    f.write(new_js)

print("JS and CSS files updated successfully.")
