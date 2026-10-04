# ręcovery

Mobilna aplikacja wspierająca rehabilitację dłoni, przygotowana na HackYeah. Zbudowana w React Native i Expo, z interfejsem po polsku oraz podglądem w przeglądarce.

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

Przy tworzeniu projektu korzystaliśmy z **ChatGPT i OpenAI Codex** do projektowania interfejsu, generowania i modyfikowania kodu oraz przygotowania dokumentacji. Wykorzystaliśmy również dostarczoną grafikę Aparatu wygenerowaną przy użyciu **Google Gemini**.

Obecna aplikacja nie wywołuje modeli AI podczas działania i nie analizuje medycznie zdjęć RTG. Podgląd dłoni, pomiary oraz wspomaganie ruchu są dostępne bezpośrednio w aplikacji.

## Funkcje

- Wybór zdjęcia RTG, podgląd, zmiana oraz przycisk usunięcia zdjęcia i wyzerowania całej sesji. Limit 20 MB, gdy rozmiar pliku jest dostępny.
- Dolne zakładki: RTG (zdjęcie i podgląd), Ćwiczenia, Postępy.
- Gotowy model dłoni pojawiający się dopiero po dodaniu zdjęcia. Wybór struktur przez kolorowe punkty na ilustracji.
- Trzy ćwiczenia, licznik czasu, pauza, wznowienie i zakończenie sesji.
- Wspomaganie ruchu, pomiary chwytu i zakresu ruchu oraz licznik ukończonych sesji.
- Wykresy i paski postępu. Interfejs mobilny z dolną nawigacją; na komputerze podgląd o szerokości do 480 px.
- Aparat na dłoń i połączenie ze sprzętem.

## Zakres aplikacji

Interfejs obejmuje obsługę zdjęć RTG, ćwiczenia, pomiary i sterowanie Aparatem. Aplikacja nie wykonuje diagnostyki medycznej.

Wybrane zdjęcie pozostaje w pamięci sesji i nie jest przesyłane do serwera. Przeładowanie aplikacji lub przycisk resetowania usuwa je z bieżącej sesji.

## Pakiet materiałów badawczych

Katalog [`research/`](./research/) zawiera artefakty koncepcyjne: model STL, szkic SVG, protokół komunikacji, dane sesji oraz notatki o kierunkach BCI.

Informacje o projekcie graficznym i pochodzeniu ilustracji: [DESIGN.md](./DESIGN.md).
