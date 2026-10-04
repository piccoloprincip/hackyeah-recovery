# HEP-0 — Hand Exoskeleton Protocol (fikcyjny)

**Status:** draft / simulator-only  
**Wersja:** `0.1.0-demo`  
**Zakres:** demonstracja komunikacji aplikacja ↔ symulator egzoszkieletu dłoni

Ten dokument opisuje wymyślony format wiadomości do prototypu. Nie jest specyfikacją medyczną, radiową ani instrukcją sterowania realnym urządzeniem.

## Transport

- Warstwa: lokalny kanał JSON-over-WebSocket w symulatorze.
- Częstotliwość telemetrii: 20 Hz w scenariuszu demonstracyjnym.
- Każda wiadomość ma `schema`, `kind`, `timestamp_ms` i `session_id`.
- W realnym urządzeniu komendy ruchu powinny mieć domyślnie stan bezpieczny, limit siły i niezależny przycisk zatrzymania.

## Przykładowe wiadomości

```json
{
  "schema": "hep/0.1-demo",
  "kind": "intent",
  "timestamp_ms": 1710000000123,
  "session_id": "demo-session-001",
  "target": "index_flexion",
  "value": 0.35,
  "unit": "normalized",
  "ttl_ms": 250
}
```

```json
{
  "schema": "hep/0.1-demo",
  "kind": "telemetry",
  "timestamp_ms": 1710000000173,
  "session_id": "demo-session-001",
  "battery_pct": 87,
  "joint_angles_deg": {"thumb": 18, "index": 31},
  "motor_current_ma": {"index": 112},
  "safety_state": "simulated"
}
```

## Walidacja i prywatność

Wartości spoza zakresu `0..1` dla `intent.value`, wygasłe `ttl_ms` i nieznane cele należy odrzucić w symulatorze. Dane sesji są fikcyjne; aplikacja demonstracyjna nie przesyła zdjęć RTG ani sygnałów neurofizjologicznych.