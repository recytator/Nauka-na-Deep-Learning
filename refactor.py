import os
import re

base_dir = r"c:/Users/recyt/Documents/GitHub/Nauka-na-Deep-Learning"
index_path = os.path.join(base_dir, "index.html")

with open(index_path, "r", encoding="utf-8") as f:
    html = f.read()

# Zbudujmy szablony
nav_template = """
    <nav class="site-nav">
        <div class="nav-inner">
            <a href="index.html" class="nav-logo" id="nav-logo">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="Logo">
                    <rect x="2" y="18" width="6" height="12" rx="1.5" fill="currentColor" opacity="0.3"/>
                    <rect x="10" y="12" width="6" height="18" rx="1.5" fill="currentColor" opacity="0.5"/>
                    <rect x="18" y="6" width="6" height="24" rx="1.5" fill="currentColor" opacity="0.7"/>
                    <rect x="26" y="2" width="6" height="28" rx="1.5" fill="currentColor"/>
                </svg>
                [ Deep Learning ]
            </a>
            <ul class="nav-links">
                <li><a href="index.html" class="{active_home}">Strona główna</a></li>
                <li><a href="lekcja1.html" class="{active_l1}">Klasyczny Perceptron</a></li>
                <li><a href="lekcja2.html" class="{active_l2}">Sieć MLP</a></li>
            </ul>
        </div>
    </nav>
"""

head_template = """<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="bg-mesh"></div>
    {nav}
"""

footer_template = """
    <footer class="site-footer">Wykonanie: Projekt Nauka na Deep Learning</footer>
    <script src="script.js"></script>
</body>
</html>
"""

# Extract content blocks using regex
perceptron_match = re.search(r'<div id="lesson-perceptron"[^>]*>(.*?)</div>\s*<div id="lesson-mlp"', html, re.DOTALL)
mlp_match = re.search(r'<div id="lesson-mlp"[^>]*>(.*?)</div>\s*</main>', html, re.DOTALL)

perceptron_html = perceptron_match.group(1) if perceptron_match else ""
mlp_html = mlp_match.group(1) if mlp_match else ""


def convert_lesson(lesson_html, title, nav_active):
    # Znajdź sekcje <section class="card ...">
    sections = re.findall(r'<section class="card[^>]*>(.*?)</section>', lesson_html, re.DOTALL)
    
    lesson_content = f'<header class="lesson-hero"><div class="lesson-hero-content"><h1>{title}</h1></div></header>\n'
    lesson_content += '<div class="lesson-layout">\n'
    
    # Składanie TOC i main content
    toc_links = ""
    main_sections = ""
    
    for i, sec in enumerate(sections, 1):
        # Extract title
        title_match = re.search(r'<h1>(.*?)<br><span>(.*?)</span></h1>', sec, re.DOTALL)
        if not title_match:
            title_match = re.search(r'<h1>(.*?)</h1>', sec, re.DOTALL)
            main_title = title_match.group(1).strip() if title_match else f"Sekcja {i}"
            sub_title = ""
        else:
            main_title = title_match.group(1).strip()
            sub_title = title_match.group(2).strip()
            
        full_title = f"{main_title} {sub_title}".strip()
        sec_id = f"sec-{i}"
        
        toc_links += f'<li><a href="#{sec_id}">{i}. {full_title}</a></li>\n'
        
        # Oczyść zawartość z niepotrzebnych divów card-content i badge i buttons
        content = sec
        content = re.sub(r'<div class="card-content">', '', content)
        content = re.sub(r'<span class="badge">.*?</span>', '', content, flags=re.DOTALL)
        content = re.sub(r'<div class="buttons">.*?</div>', '', content, flags=re.DOTALL)
        content = re.sub(r'</div>$', '', content) # remove card-content closing div
        
        main_sections += f'<section id="{sec_id}" class="content-section fade-in">\n'
        main_sections += content
        main_sections += '</section>\n'

    # Dodajmy Quiz sekcję
    quiz_html = f"""
    <section id="quiz" class="content-section fade-in">
        <h2>Quiz końcowy</h2>
        <div class="quiz-container" id="quiz-{nav_active}">
            <h3>🎓 Sprawdź swoją wiedzę</h3>
            <p class="text-muted mt-2">Pytania z modułu. Wybierz poprawną odpowiedź.</p>
            
            <div class="quiz-question">
                <p><strong>1.</strong> Przykładowe pytanie?</p>
                <div class="quiz-options">
                    <div class="quiz-option" data-correct="true">Poprawna odpowiedź</div>
                    <div class="quiz-option" data-correct="false">Błędna odpowiedź</div>
                </div>
                <div class="quiz-feedback"></div>
            </div>
            <!-- W JS wygenerujemy więcej pytań z tablicy dla wygody -->
        </div>
    </section>
    """
    
    main_sections += quiz_html
    
    lesson_content += f"""
    <aside class="lesson-sidebar">
        <div class="toc-wrapper">
            <div class="toc-title">Spis treści</div>
            <ol class="toc-list">
                {toc_links}
                <li><a href="#quiz">Quiz końcowy</a></li>
            </ol>
        </div>
    </aside>
    """
    
    lesson_content += f'<main class="lesson-content">{main_sections}</main>\n</div>'
    
    # Wrap in full HTML
    nav = nav_template.format(active_home="", active_l1="active" if nav_active=="l1" else "", active_l2="active" if nav_active=="l2" else "")
    full_page = head_template.format(title=title, nav=nav) + lesson_content + footer_template
    
    return full_page


# 1. Lekcja 1
l1_html = convert_lesson(perceptron_html, "Klasyczny Perceptron", "l1")
with open(os.path.join(base_dir, "lekcja1.html"), "w", encoding="utf-8") as f:
    f.write(l1_html)

# 2. Lekcja 2
l2_html = convert_lesson(mlp_html, "Sieć MLP", "l2")
with open(os.path.join(base_dir, "lekcja2.html"), "w", encoding="utf-8") as f:
    f.write(l2_html)

# 3. Zaktualizuj index.html (Home page o strukturze StatMaster)
home_content = f"""
<header class="hero glass-effect" style="max-width:900px; margin: 50px auto; padding: 60px 40px; text-align:center;">
    <h1 class="main-title" style="margin-bottom: 20px;">Deep Learning i Sieci Neuronowe</h1>
    <p style="color:#bbb; font-size:18px; margin-bottom: 40px; line-height:1.6;">Opanuj sztuczną inteligencję od podstaw. Od pojedynczego matematycznego neuronu, po głębokie sieci wielowarstwowe. Architektura krok po kroku z sekcją "Po ludzku".</p>
    <a href="lekcja1.html" class="btn btn-primary" style="font-size: 16px; padding: 15px 30px;">Zacznij naukę ➔</a>
</header>

<div class="lessons-grid" style="max-width: 900px; margin: 0 auto; padding-bottom: 60px;">
    <a href="lekcja1.html" class="lesson-card glass-effect">
        <div class="lesson-number" style="background:#111; border:1px solid #61afef; color:#61afef;">01</div>
        <h3>Klasyczny Perceptron</h3>
        <p>Zrozumienie podstaw: architektura neuronu, reguła uczenia, operacje logiczne, klasyfikacja na zbiorze medycznym i interaktywny symulator decyzji.</p>
        <div class="lesson-topics">
            <span class="topic-tag">Matematyka</span>
            <span class="topic-tag">Wagi i Bias</span>
            <span class="topic-tag">Logika XOR</span>
            <span class="topic-tag">Scikit-Learn</span>
        </div>
    </a>
    
    <a href="lekcja2.html" class="lesson-card glass-effect">
        <div class="lesson-number" style="background:#111; border:1px solid #c678dd; color:#c678dd;">02</div>
        <h3>Sieć MLP (Keras)</h3>
        <p>Architektury wielowarstwowe (Dense), funkcje aktywacji ReLU i Softmax, optymalizator Adam oraz skalowanie danych z interaktywnymi wizualizacjami.</p>
        <div class="lesson-topics">
            <span class="topic-tag">Keras i TF</span>
            <span class="topic-tag">Hidden Layers</span>
            <span class="topic-tag">Softmax</span>
            <span class="topic-tag">Propagacja Wsteczna</span>
        </div>
    </a>
</div>

<section style="max-width: 900px; margin: 0 auto 80px auto; text-align:center;">
    <h2 style="font-size: 28px; margin-bottom: 30px; color:#fff;">Jak korzystać z kursu?</h2>
    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
        <div class="glass-effect" style="padding:30px; margin-bottom:0;">
            <h3 style="color:#e5c07b; margin-bottom: 10px;">1. Moduł "Po ludzku"</h3>
            <p style="color:#aaa; font-size:14px;">Zawsze gdy matematyka staje się zawiła, szukaj bloków "Po ludzku", w których omawiamy trudne zagadnienia na prostych, życiowych przykładach.</p>
        </div>
        <div class="glass-effect" style="padding:30px; margin-bottom:0;">
            <h3 style="color:#61afef; margin-bottom: 10px;">2. Interaktywne Wizualizacje</h3>
            <p style="color:#aaa; font-size:14px;">Baw się suwakami i symulatorami. Zobaczysz na żywo, jak zmiana wag lub danych wejściowych wpływa na wynik sieci i decyzję klasyfikatora.</p>
        </div>
        <div class="glass-effect" style="padding:30px; margin-bottom:0;">
            <h3 style="color:#98c379; margin-bottom: 10px;">3. Quizy</h3>
            <p style="color:#aaa; font-size:14px;">Na końcu każdej lekcji rozwiąż quiz ewaluacyjny, aby utrwalić zdobytą wiedzę i zweryfikować zrozumienie materiału.</p>
        </div>
    </div>
</section>
"""

nav_home = nav_template.format(active_home="active", active_l1="", active_l2="")
index_full = head_template.format(title="Deep Learning i Sieci Neuronowe", nav=nav_home) + home_content + footer_template

with open(os.path.join(base_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_full)

print("HTML files generated successfully.")
