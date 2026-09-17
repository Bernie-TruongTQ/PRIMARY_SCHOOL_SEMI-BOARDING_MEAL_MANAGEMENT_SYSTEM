# 11. Risks and Technical Debt

## Overview

This section maintains the operational and architectural risk register along with known technical debt items for the Semi-Boarding Meal Management System. It establishes actionable mitigation strategies, remediation timelines, and risk priorities based on Probability × Impact scoring under the External Catering Operating Model.

---

## 11.1 Risk Register

| Risk ID | Risk Description | Probability | Impact | Priority | Mitigation Strategy | Status |
|:---:|:---|:---:|:---:|:---:|:---|:---:|
| **RISK-01** | **Campus Wi-Fi Congestion During 08:00–08:30 AM Roll-Call**<br>Peak traffic during morning arrival causes network timeouts on teacher mobile devices during classroom check-in. | High | High | **Critical** | Client-side optimistic UI state management with local buffer; automatic background retry queue on network restoration; lightweight payload (< 5KB JSON). | Open |
| **RISK-02** | **Excessive Buffer Margin Inflating Catering Expenditure**<br>Setting safety buffer margins too high (> 5%) causes unconsumed meals, increasing school semi-boarding costs. | Medium | Medium | **Medium** | System enforces a hard buffer cap at 10% with a default range of 3%–5%; 13:00 PM reconciliation logs leftover buffer portions to guide historical adjustments. | Open |
| **RISK-03** | **Late Catering Delivery Past 10:30 AM Deadline**<br>Vendor traffic delays threaten the 11:00 AM classroom serving window. | Low | High | **High** | Real-time delivery dispatch metadata tracking via Catering Gateway (`IF-02`); automated SMS escalation alert triggered at 10:15 AM if truck has not checked in. | Open |
| **RISK-04** | **Delivery Temperature Deficit (< 65°C) at Receiving Dock**<br>Vendor delivers lukewarm food violating Decision 1246/QĐ-BYT food hygiene rules. | Low | High | **Critical** | `QualityInspectionValidator` blocks acceptance; system triggers emergency protocol requiring vendor to rush replacement hot batch or enact pre-approved contingency meal plan. | Open |

---

## 11.2 Technical Debt Backlog

| Debt ID | Affected Component | Debt Type | Description & Operational Impact | Remediation Plan & Effort |
|:---:|:---|:---:|:---|:---|
| **DEBT-01** | `BufferCalculationEngine` | *Deliberate* | Safety buffer margin currently uses manual coordinator selection (3%–5%) rather than automated machine learning forecasting based on historical day-of-week attendance patterns. | Introduce historical moving-average buffer suggestion algorithm in Phase 2. *Effort: Medium (2 weeks).* |
| **DEBT-02** | `IF-01 (SIS Integration)` | *Accidental* | Nightly student sync currently executes via scheduled batch API polling rather than an event-driven webhook listener from the central SIS. | Implement an authenticated incoming webhook receiver endpoint (`POST /api/v1/webhooks/sis/roster-change`) with HMAC validation. *Effort: Small (3 days).* |
| **DEBT-03** | `Teacher Mobile UI` | *Deliberate* | Offline mode caches attendance records in browser `localStorage` rather than a full IndexedDB Service Worker architecture. | Upgrade client storage to Service Worker + IndexedDB background sync for complete zero-connectivity tolerance. *Effort: Medium (1 week).* |
