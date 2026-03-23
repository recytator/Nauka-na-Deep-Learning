import logging
import re

logging.basicConfig(level=logging.INFO)

file_path = r'c:\Users\48516\Downloads\Nauka MLP\MLP_Explainer\index.html'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
except Exception as e:
    logging.error(f"Failed to read file: {e}")
    exit(1)

perceptron_theory = """
            <!-- P0: THEORY PERCEPTRON -->
            <section class="card glass-effect active-section">
                <div class="card-content">
                    <span class="badge b-red">Krok 1 / 11 (Teoria)</span>
                    <h1>Czym jest Perceptron?</h1>
                    <p>W dziedzinie sztucznej inteligencji <b>Perceptron</b> uchodzi za historycznego ojca u Sieci Neuronowych. Opracowany matematycznie w 1957 roku przez dr Franka Rosenblatta był zapowiedzią zasymulowania wzroku i działania mózgu.</p>
                    
                    <div class="line-by-line">
                        <div class="code-row">
                            <div class="code-header">Biologia ➔ Matematyka</div>
                            <div class="code-desc">Biologiczny neuron odbiera sygnał za pomocą dendrytów, kumuluje iskrę, i wyrzuca impuls aksonem dalej. <b>W programie jest to po prostu funkcja sumująca liczby.</b> Odbiera wejścia (liczby ułamkowe), waży je przez "ważność" sygnału (tzw. Wagi synaptyczne) i jeśli suma wykaże ładunek wystarczająco na plus - funkcja strzela wartością absolutną <code>1</code>. W innym wypadku <code>0</code>.</div>
                        </div>
                        <div class="code-row">
                            <div class="code-header">Liniowa Separowalność (Pięta Achillesa)</div>
                            <div class="code-desc">Pojedynczy Perceptron operuje płasko - rysuje podczas wyrokowania wyłącznie <b>jedną twardą prostą na wykresie.</b> Z tego powodu uchodzi za model matematycznie liniowy i nie jest w stanie pociąć bardziej zawiłych problemów z zachodzącymi na siebie danymi (np. XOR). Pchnęło to świat do budowania ich w pionowe "ściany" dziesiątek neuronów naraz (tzw. MLP).</div>
                        </div>
                    </div>
                    
                    <div class="anim-box">
                        <div class="perceptron-diagram">
                            <div class="p-inputs">
                                <div class="p-in-node">X1</div><div class="p-in-node">X2</div><div class="p-in-node">X3</div>
                            </div>
                            <div class="p-lines"></div>
                            <div class="p-soma">Suma = Σ (W*X)</div>
                            <div class="p-arrow">➔</div>
                            <div class="p-out">Wyj: 1</div>
                        </div>
                        <p class="anim-desc">Podrzynanie i sumowanie wszystkich drutów z informacją by wyrzucić jedną twardą decyzję.</p>
                    </div>

                    <button class="btn btn-primary next-btn">Jak to ująć w Kodzie? DALEJ ➔</button>
                </div>
            </section>"""

mlp_theory = """
            <!-- M0: THEORY MLP -->
            <section class="card glass-effect active-section">
                <div class="card-content">
                    <span class="badge b-blue">MLP 1 / 11 (Teoria)</span>
                    <h1>Czym jest Sieć MLP? <span>(Multi-Layer)</span></h1>
                    <p><b>MLP (Multi-Layer Perceptron)</b>. Co zrobisz, jeżeli twój zbiór chorych pacjentów na osi wykresu okrąża zdrowych dookoła uiszczając "zbiór w zbiorze"? Jedna płaska prosta noża logicznego wyuczonego w poprzedniej lekcji straci głowę i pocięłaby wszystkich na wskroś. Z pomocą idą rzędy komórek ułożone warstwami jedna po drugiej!</p>
                    
                    <div class="line-by-line">
                        <div class="code-row">
                            <div class="code-header">Warstwy Ukryte (Hidden Layers)</div>
                            <div class="code-desc">Zamiast prosić pojedynczą komórkę o wyrok, zatrudniamy np. siatkę 64 komórek. Pierwsza ściana patrzy na dane początkowe, po czym wypuszcza 64 strzały opinii z połączeń na ewoluującą dalej kolejną ścianę mózgów, które szukają już wzorców opartych na abstrakcjach wygenerowanych wcześniej. To prawdziwa potęga <b>Deep Learning</b> układająca klocki nieliniowe pojęcia formy np koła czy spirali klasowej.</div>
                        </div>
                        <div class="code-row">
                            <div class="code-header">Wsteczna Propagacja Błędu (Backpropagation)</div>
                            <div class="code-desc">Jak powiedzieć tysiącom ukrytych w głębi neuronów, żeby zmodyfikowały Wagi skoro wiedzą o błędzie tylko u wylotu tablicy predykcyjnej? Używamy fali wstecznej (Backprop). Bólowa Strata klasyfikacji cofa się w tył silnikiem pochodnych macierzy (W tym błyszczy C++ z TensorFlow i gradienty). Kara cofa się wytypowanymi ścieżkami ucinając i modyfikując wagi na drodze ewolucji zwanej np. z użyciem Adama na tysiącach połączeń symultanicznie!</div>
                        </div>
                    </div>

                    <div class="anim-box">
                        <div class="mlp-diagram">
                            <div class="layer l-in"><div class="mnode">Wejściowa</div></div>
                            <div class="layer l-hid1"><div class="mnode"></div><div class="mnode"></div><div class="mnode"></div></div>
                            <div class="layer l-hid2"><div class="mnode"></div><div class="mnode"></div><div class="mnode"></div></div>
                            <div class="layer l-out"><div class="mnode">Wyjściowa</div></div>
                        </div>
                        <p class="anim-desc">Błąd płynie pod prąd w szale wstecznej nauki po ukończonym zliczeniu Straty na końcu.</p>
                    </div>

                    <button class="btn btn-primary next-btn">Jak Wygląda Kod w Tensorflow? ➔</button>
                </div>
            </section>"""

# Replace Perceptron
content = content.replace(
    '        <div id="lesson-perceptron" class="hidden-screen lesson-flow">\n            <!-- P1: INIT -->\n            <section class="card glass-effect active-section">',
    '        <div id="lesson-perceptron" class="hidden-screen lesson-flow">\n' + perceptron_theory + '\n            <!-- P1: INIT -->\n            <section class="card glass-effect hidden">'
)

def fix_p_badge(match):
    num = int(match.group(1))
    return f'<span class="badge b-red">Krok {num+1} / 11</span>'
content = re.sub(r'<span class="badge b-red">Krok (\d+) / 10</span>', fix_p_badge, content)


# Replace MLP
content = content.replace(
    '        <div id="lesson-mlp" class="hidden-screen lesson-flow">\n            <!-- M1: IMPORTS -->\n            <section class="card glass-effect active-section">',
    '        <div id="lesson-mlp" class="hidden-screen lesson-flow">\n' + mlp_theory + '\n            <!-- M1: IMPORTS -->\n            <section class="card glass-effect hidden">'
)

def fix_m_badge(match):
    num = int(match.group(1))
    return f'<span class="badge b-blue">MLP {num+1} / 9</span>'
content = re.sub(r'<span class="badge b-blue">MLP (\d+) / 10</span>', fix_m_badge, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated index.html successfully.")
