# Nauka na Deep Learning

Witaj w repozytorium stanowiącym kompleksowy dziennik mojej nauki w dziedzinie Głębokiego Uczenia (Deep Learning) oraz Sztucznych Sieci Neuronowych. Jako student informatyki i Sztucznej Inteligencji, traktuję ten projekt jako szczegółowy zapis mojego rozwoju, dokumentujący od podstaw działanie i architekturę nowoczesnych algorytmów uczenia maszynowego. 

Znajdziesz tutaj zarówno interaktywne implementacje teoretyczne, jak i w pełni funkcjonalną stronę internetową prezentującą wyniki mojej pracy analitycznej.

**Adres strony projektu (GitHub Pages):** [https://recytator.github.io/Nauka-na-Deep-Learning/](https://recytator.github.io/Nauka-na-Deep-Learning/)

### Cały front-end w formie strony internetowej został wykonany przy użyciu Google Antigravity - jeżeli nadal jakieś kwestie w trakcie nauki niezrozumiałe - napisz proszę, a udoskonalę projekt

## Cel Repozytorium i Założenia Projektowe

Moim nadrzędnym celem jest pełne, głębokie zrozumienie wewnętrznych mechanizmów sieci neuronowych, a nie tylko bezrefleksyjne korzystanie z gotowych bibliotek. Repozytorium ma stanowić miejsce, w którym zaawansowana matematyka i teoria spotykają się z czystym kodem programistycznym.

Planuję w sposób ciągły i regularny dodawać tutaj nowe lekcje, projekty oraz eksperymenty. Z biegiem czasu projekt rozrośnie się od prostych perceptronów aż do skomplikowanych architektur używanych obecnie w przemyśle technologicznym. Jeśli szukasz materiałów, które wchodzą w szczegóły algorytmów krok po kroku, to repozytorium będzie do tego idealnym źródłem.

## Obecna Zawartość i Struktura Plików

W tym momencie repozytorium skupia się na solidnych fundamentach i bazowych koncepcjach budowy sieci. Poniżej przedstawiam dokładny opis plików znajdujących się obecnie w projekcie:

* **Pli o rozszerzeniu .ipynb**: Są to autorskie notatniki robione w trakcie zajęć w Google Colab. Wzbogacam je o teksty i komentarze oraz czasami trafią się dodatkowe przykłady. Jeżeli nie masz kodu z zajęć, bądź on nie działa - korzystaj do woli.
* **nauka_script.py**: Plik roboczy zawierający natywny kod Pythona. Gromadzę w nim bazowe definicje, funkcje pomocnicze i czysty skryptowy kod związany z testowaniem, trenowaniem oraz ewaluacją moich modeli bez użycia komórek notatnika.
* **Pliki Webowe (index.html, style.css, script.js)**: Zestaw plików front-endowych. Zaprojektowałem własny interfejs graficzny hostowany bezpośrednio przez mechanizm GitHub Pages, aby wizualizować efekty nauki w interaktywnej formie bez konieczności klonowania repozytorium przez odwiedzających.

## Wykorzystywane Technologie

Materiały zawarte w tym repozytorium opierają się na starannie dobranym stosie technologicznym, który ułatwia swobodny proces badawczy:
* **Python**: Podstawowy język całego przedsięwzięcia, dający olbrzymie możliwości analityczne.
* **Jupyter Notebook**: Platforma pozwalająca pisać i uruchamiać kod komórka po komórce, co znacząco ułatwia prowadzenie narracji edukacyjnej.
* **HTML5, CSS3, JavaScript (Vanilla JS)**: Technologie webowe, za pomocą których buduję strukturę wizualną reprezentacji mojej zdobytej wiedzy w witrynie przeglądarkowej.

## Plany Rozwoju Projektu

W związku z tym, że proces nauki będzie trwał przez cały semestr, nowe sekcje na podstawie piątkowych zajęć pojawiać się będą w poniedziałki.

## Instrukcja Uruchomienia Lokalnego

Jeśli chcesz z jakiegoś powodu włączyć stronę u siebie lokalnie, przejrzeć kod, to przygotowałem dla Ciebie bardzo dokładną instrukcję krok po kroku.

**Krok 1: Klonowanie repozytorium**
Otwórz terminal (lub wiersz poleceń) i wykonaj poniższą komendę gita, aby pobrać pełną kopię plików:
`git clone https://github.com/recytator/Nauka-na-Deep-Learning.git`

**Krok 2: Przejście do utworzonego katalogu**
Zmień aktualną ścieżkę roboczą na główny folder z projektem:
`cd Nauka-na-Deep-Learning`

**Krok 3: Tworzenie środowiska wirtualnego (Krok opcjonalny, ale mocno zalecany)**
W celu uniknięcia problematycznych konfliktów zależności pakietów w systemie, warto stworzyć wyizolowane środowisko programistyczne Pythona:
`python -m venv venv`
Następnie aktywuj środowisko odpowiednim poleceniem:
W systemie Windows: `venv\Scripts\activate`
W systemach Linux lub macOS: `source venv/bin/activate`

**Krok 4: Instalacja odpowiednich pakietów**
Upewnij się, że posiadasz odpowiednie narzędzia do uruchomienia plików posiadających format `.ipynb`. Zainstaluj środowisko Jupyter i bazowe pakiety numeryczne korzystając z polecenia pip:
`pip install jupyter numpy matplotlib`

**Krok 5: Uruchomienie Jupytera**
Rozpocznij pracę z przygotowanymi notatnikami wydając polecenie:
`jupyter notebook`
Twoja domyślna przeglądarka internetowa powinna otworzyć się automatycznie na porcie lokalnym (zazwyczaj localhost:8888). Z widocznego tam drzewa plików wybierz na przykład plik `DLANN_MLP.ipynb`, aby czytać treść lekcji i kompilować poszczególne komórki zawierające zaimplementowany kod.

Zachęcam do zgłaszania własnych uwag, zadawania pytań w zakładce Issues oraz bardzo regularnego odwiedzania strony, aby nie przegapić najnowszych, regularnie dodawanych lekcji!
