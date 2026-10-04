# ręcovery

Mobilny prototyp aplikacji wspierającej rehabilitację dłoni, przygotowany na HackYeah. Zbudowany w React Native i Expo, z interfejsem po polsku oraz podglądem w przeglądarce.

## Uruchomienie

Wymagania: Node.js 20 lub nowszy oraz npm.

```sh
git clone https://github.com/piccoloprincip/hackyeah-recovery.git
cd hackyeah-recovery
npm ci
npm run web
```

Podgląd przeglądarkowy jest dostępny pod adresem wyświetlonym przez Expo, zwykle `http://localhost:8081`.

## Publikacja na GitHub Pages

Workflow `.github/workflows/deploy.yml` buduje wersję webową Expo i publikuje ją na GitHub Pages po każdym pushu do `main`. W ustawieniach repozytorium wybierz **Settings → Pages → Source: GitHub Actions**. Po zakończeniu workflow aplikacja będzie dostępna pod adresem `https://piccoloprincip.github.io/hackyeah-recovery/`.

Na iOS: `npm run ios` (macOS i Xcode). Na Androidzie: `npm run android` (Android SDK i emulator lub urządzenie). Projekt korzysta z Expo SDK 53; klient mobilny musi obsługiwać tę wersję SDK.

## Wykorzystane technologie

- **JavaScript / JSX, React 19 i React Native 0.79** — logika i interfejs aplikacji.
- **Expo SDK 53 oraz Metro** — środowisko uruchomieniowe i obsługa projektu mobilnego.
- **React Native Web 0.20** — podgląd aplikacji w przeglądarce.
- **Expo Image Picker** — wybór zdjęcia RTG z urządzenia.
- **React Native SVG** — ikony interfejsu; wykresy i paski postępu korzystają z komponentów React Native.

## Deklaracja wykorzystania AI

Przy tworzeniu projektu korzystaliśmy z **ChatGPT i OpenAI Codex** do rozwijania koncepcji, projektowania interfejsu, generowania i modyfikowania kodu oraz przygotowania dokumentacji. Wykorzystaliśmy również dostarczoną grafikę koncepcyjną Aparatu wygenerowaną przy użyciu **Google Gemini**.

Obecna aplikacja nie wywołuje modeli AI podczas działania i nie analizuje medycznie zdjęć RTG. Podgląd dłoni, pomiary oraz wspomaganie ruchu są przygotowane na potrzeby demonstracji.

## Funkcje

- Wybór zdjęcia RTG, podgląd, zmiana oraz przycisk usunięcia zdjęcia i wyzerowania całego demo. Limit 20 MB, gdy rozmiar pliku jest dostępny.
- Dolne zakładki: RTG (zdjęcie i podgląd), Ćwiczenia, Postępy.
- Gotowy model dłoni pojawiający się dopiero po dodaniu zdjęcia. Wybór struktur przez kolorowe punkty na ilustracji.
- Trzy ćwiczenia demonstracyjne, licznik czasu, pauza, wznowienie i zakończenie sesji.
- Symulowane wspomaganie ruchu, przykładowe pomiary chwytu i zakresu ruchu oraz licznik ukończonych sesji.
- Wykresy i paski postępu. Interfejs mobilny z dolną nawigacją; na komputerze podgląd o szerokości do 480 px.
- Wizualizacja koncepcji: Aparat na dłoń. Brak połączenia ze sprzętem.

## Zakres prototypu

To demonstracja interfejsu, bez diagnostyki medycznej, backendu i sterowania Aparatem. Ilustracja dłoni jest gotową grafiką, a nie rekonstrukcją zdjęcia RTG. Pomiary i wspomaganie są symulowane.

Wybrane zdjęcie pozostaje w pamięci sesji i nie jest przesyłane do serwera. Przeładowanie aplikacji lub przycisk resetowania usuwa je z bieżącej sesji. Repozytorium zawiera wyłącznie grafiki demonstracyjne, bez zdjęć RTG użytkownika.

## Pakiet materiałów badawczych (syntetyczny)

Katalog [`research/`](./research/) zawiera demonstracyjne artefakty koncepcyjne: binarny mock STL, szkic SVG, fikcyjny protokół komunikacji, syntetyczne dane sesji oraz edukacyjne notatki o kierunkach BCI. Wszystkie pliki są jawnie oznaczone jako `demo`/`synthetic`, nie są danymi medycznymi, nie pochodzą od Neuralink i nie powinny być używane do diagnozy ani budowy urządzenia.

Informacje o projekcie graficznym i pochodzeniu ilustracji: [DESIGN.md](./DESIGN.md).
