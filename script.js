document.addEventListener('DOMContentLoaded', () => {

    /* --- MENU LOGIC --- */
    const homeScreen = document.getElementById('home-screen');
    const menuCards = document.querySelectorAll('.menu-card');
    const backBtn = document.getElementById('back-to-menu-top');
    const navLogo = document.getElementById('nav-logo');
    const lessonScreens = document.querySelectorAll('.lesson-flow');
    const goHomeBtns = document.querySelectorAll('.go-home-btn');

    function resetLesson(lessonId) {
        const lesson = document.getElementById(lessonId);
        if(!lesson) return;
        const sections = lesson.querySelectorAll('section.card');
        sections.forEach((s, idx) => {
            if(idx === 0) {
                s.classList.remove('hidden');
                s.classList.add('active-section');
            } else {
                s.classList.remove('active-section');
                s.classList.add('hidden');
            }
        });
    }

    function goToMenu() {
        lessonScreens.forEach(screen => {
            screen.classList.remove('active-screen');
            screen.classList.add('hidden-screen');
            setTimeout(() => {
                screen.style.display = 'none'; // force hide
            }, 500);
        });
        
        homeScreen.style.display = 'block';
        setTimeout(() => {
            homeScreen.classList.remove('hidden-screen');
            homeScreen.classList.add('active-screen');
        }, 10);
        
        backBtn.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    menuCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            
            homeScreen.classList.remove('active-screen');
            setTimeout(() => {
                homeScreen.classList.add('hidden-screen');
                homeScreen.style.display = 'none';
            }, 300);

            lessonScreens.forEach(s => {
                s.classList.add('hidden-screen');
                s.style.display = 'none';
            });
            
            resetLesson(targetId);
            const targetScreen = document.getElementById(targetId);
            
            setTimeout(() => {
                targetScreen.style.display = 'block';
                targetScreen.classList.remove('hidden-screen');
                targetScreen.classList.add('active-screen');
            }, 350);
            
            backBtn.classList.remove('hidden');
        });
    });

    backBtn.addEventListener('click', goToMenu);
    navLogo.addEventListener('click', goToMenu);
    goHomeBtns.forEach(btn => btn.addEventListener('click', goToMenu));


    /* --- NAVIGATION WITHIN LESSONS --- */
    const lessonContainers = document.querySelectorAll('.lesson-flow');
    
    lessonContainers.forEach(container => {
        const sections = container.querySelectorAll('section.card');
        const nextBtns = container.querySelectorAll('.next-btn');
        const prevBtns = container.querySelectorAll('.prev-btn');

        nextBtns.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                if(idx + 1 < sections.length) {
                    sections[idx].classList.remove('active-section');
                    setTimeout(() => sections[idx].classList.add('hidden'), 400);
                    
                    setTimeout(() => {
                        sections[idx+1].classList.remove('hidden');
                        sections[idx+1].classList.add('active-section');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 400);
                }
            });
        });

        prevBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                let currentIdx = -1;
                sections.forEach((s, i) => { if (s.classList.contains('active-section')) currentIdx = i; });
                if (currentIdx > 0) {
                    sections[currentIdx].classList.remove('active-section');
                    setTimeout(() => sections[currentIdx].classList.add('hidden'), 400);
                    
                    setTimeout(() => {
                        sections[currentIdx-1].classList.remove('hidden');
                        sections[currentIdx-1].classList.add('active-section');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 400);
                }
            });
        });
    });

    /* --- MLP LOGIC (ARGMAX & SOFTMAX) --- */
    const plSlider = document.getElementById('pl-slider');
    const plValText = document.getElementById('pl-val');
    const probsList = document.getElementById('probs-list');
    const finalChoice = document.getElementById('final-choice');

    if (plSlider) {
        plSlider.addEventListener('input', updateMLPLogic);
    }

    const flowerNames = ['Setosa (0)', 'Versicolor (1)', 'Virginica (2)'];
    const flowerColors = {
        'Setosa (0)': '#3b82f6',     
        'Versicolor (1)': '#a78bfa', 
        'Virginica (2)': '#f43f5e',  
    };

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
        finalChoice.innerText = `Wynik = Gatunek ${maxIdx} ! (${winner})`;
        finalChoice.style.color = flowerColors[winner];
        finalChoice.style.borderLeftColor = flowerColors[winner];
    }
    updateMLPLogic();


    /* --- PERCEPTRON LOGIC (BIKE) --- */
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
            bResult.style.background = 'rgba(16, 185, 129, 0.2)';
            bResult.style.border = '2px solid #10b981';
            bResult.style.color = '#10b981';
            bResult.innerText = `Potencjał wyjścia: ${s.toFixed(2)} ≥ 0 ➔ Aktywacja Perceptronu (Klasa Pozytywna)`;
        } else {
            bResult.classList.add('no-go');
            bResult.style.background = 'rgba(239, 68, 68, 0.2)';
            bResult.style.border = '2px solid #ef4444';
            bResult.style.color = '#fca5a5';
            bResult.innerText = `Potencjał wyjścia: ${s.toFixed(2)} < 0 ➔ Brak Aktywacji (Klasa Negatywna)`;
        }
    }

    if(bSun) bSun.addEventListener('change', updateBike);
    if(bTime) bTime.addEventListener('change', updateBike);
    if(bOk) bOk.addEventListener('change', updateBike);

    updateBike();
});
