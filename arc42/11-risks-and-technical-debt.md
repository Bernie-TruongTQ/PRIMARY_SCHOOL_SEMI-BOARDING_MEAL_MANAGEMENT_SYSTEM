# 11. Risks and Technical Debt

## Overview

This section maintains the operational and architectural risk register along with known technical debt items for the Semi-Boarding Meal Management System. It establishes actionable mitigation strategies, remediation timelines, and risk priorities based on Probability × Impact scoring.

---

## 11.1 Risk Register

| Risk ID | Risk Description | Probability | Impact | Priority | Mitigation Strategy | Status |
|:---:|:---|:---:|:---:|:---:|:---|:---:|
| **RISK-01** | **Campus Wi-Fi Congestion During Morning Roll-Call**<br>Peak traffic at 07:45–08:00 AM causes network timeouts on teacher mobile devices during classroom check-in. | High | High | **Critical** | Client-side optimistic UI state management with local buffer; automatic background retry queue on network restoration; lightweight payload (< 5KB JSON). | Open |
| **RISK-02** | **Manager Workload Spike from Post-Cutoff Emergencies**<br>Multiple teachers submitting late emergency arrivals creates a triage bottleneck for the single Meal Manager between 08:00–08:15 AM. | Medium | Medium | **Medium** | Automated audio/visual push chimes on Manager console; pre-cutoff automated reminders sent at 07:50 AM (10-min warning) and 07:55 AM (5-min warning) to minimize late submissions. | Open |
| **RISK-03** | **Manual Scale Weight Transcription Errors**<br>Kitchen staff incorrectly enter kilograms into kiosk touchscreens when reconciling finished dish yields. | Medium | Medium | **Medium** | Mandatory photographic capture of digital scale LCD display for all batches; planned direct Bluetooth BLE / USB integration with smart weighing scales. | Open |
| **RISK-04** | **Single On-Premise Database Server Failure (SPOF)**<br>Hardware crash on local school campus server disrupts morning meal operations. | Low | High | **Medium** | Automated daily pg_dump snapshots at 01:00 AM with remote off-site backup; containerized Docker Compose architecture allowing rapid restore on standby backup hardware in < 15 minutes. | Open |

---

## 11.2 Technical Debt Backlog

| Debt ID | Affected Component | Debt Type | Description & Operational Impact | Remediation Plan & Effort |
|:---:|:---|:---:|:---|:---|
| **DEBT-01** | `PortionCalculationEngine` | *Deliberate* | Base ingredient-to-dish portion scaling currently uses static recipe coefficients in JSON tables rather than a dynamic seasonal yield variation model. | Introduce seasonal ingredient yield loss factors (e.g. wet-season vegetables vs dry-season) in Phase 2. *Effort: Medium (2 weeks).* |
| **DEBT-02** | `IF-01 (SIS Integration)` | *Accidental* | Nightly student sync currently executes via scheduled batch API polling rather than an event-driven webhook listener from the central SIS. | Implement an authenticated incoming webhook receiver endpoint (`POST /api/v1/webhooks/sis/roster-change`) with HMAC validation. *Effort: Small (3 days).* |
| **DEBT-03** | `Teacher Mobile UI` | *Deliberate* | Offline mode caches attendance records in browser `localStorage` rather than a full IndexedDB Service Worker architecture. | Upgrade client storage to Service Worker + IndexedDB background sync for complete zero-connectivity tolerance. *Effort: Medium (1 week).* |
