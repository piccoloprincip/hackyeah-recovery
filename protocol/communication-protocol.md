# HEP-0 — Hand Exoskeleton Protocol

**Status:** active
**Wersja:** `0.1.0`
**Zakres:** komunikacja aplikacja ↔ egzoszkielet dłoni

Ten dokument opisuje format wiadomości używany przez system.

## Transport

- Warstwa: kanał JSON-over-WebSocket.
- Częstotliwość telemetrii: 20 Hz.
- Każda wiadomość ma `schema`, `kind`, `timestamp_ms` i `session_id`.
- W realnym urządzeniu komendy ruchu powinny mieć domyślnie stan bezpieczny, limit siły i niezależny przycisk zatrzymania.

## Wiadomości

```json
{
  "schema": "hep/0.1",
  "kind": "intent",
  "timestamp_ms": 1710000000123,
  "session_id": "session-001",
  "target": "index_flexion",
  "value": 0.35,
  "unit": "normalized",
  "ttl_ms": 250
}
```

```json
{
  "schema": "hep/0.1",
  "kind": "telemetry",
  "timestamp_ms": 1710000000173,
  "session_id": "session-001",
  "battery_pct": 87,
  "joint_angles_deg": {"thumb": 18, "index": 31},
  "motor_current_ma": {"index": 112},
  "safety_state": "safe"
}
```

## Walidacja i prywatność

Wartości spoza zakresu `0..1` dla `intent.value`, wygasłe `ttl_ms` i nieznane cele należy odrzucić. Dane sesji są przechowywane lokalnie; aplikacja nie przesyła zdjęć RTG ani sygnałów neurofizjologicznych.