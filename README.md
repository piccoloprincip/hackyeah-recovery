# ręcovery

Mobilny prototyp aplikacji wspierającej rehabilitację dłoni, przygotowany na HackYeah. Zbudowany w React Native i Expo, z interfejsem po polsku oraz podglądem w przeglądarce.

## Uruchomienie

Wymagania: Node.js 20 lub nowszy oraz npm.

```sh
npm ci
npm run web
```

Podgląd przeglądarkowy jest dostępny pod adresem wyświetlonym przez Expo, zwykle `http://localhost:8081`.

Na iOS: `npm run ios` (macOS i Xcode). Na Androidzie: `npm run android` (Android SDK i emulator lub urządzenie). Projekt korzysta z Expo SDK 53; klient mobilny musi obsługiwać tę wersję SDK.

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

Informacje o projekcie graficznym i pochodzeniu ilustracji: [DESIGN.md](./DESIGN.md).
