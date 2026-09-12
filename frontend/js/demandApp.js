// ==========================================================================
// DEMAND & QUANTITY MANAGEMENT MODULE — APPLICATION LOGIC
// ui/js/demandApp.js
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

  // ── Deep-copy mutable state from mock data ─────────────────────────────
  const state = {
    session: DEMAND_DATA.currentSession,
    role: DEMAND_DATA.userRole,
    classes: JSON.parse(JSON.stringify(DEMAND_DATA.classes)),
    dishes: JSON.parse(JSON.stringify(DEMAND_DATA.menu.dishes)),
    changeRequests: JSON.parse(JSON.stringify(DEMAND_DATA.changeRequests)),
    changeLog: JSON.parse(JSON.stringify(DEMAND_DATA.changeLog)),
    activeTab: "screen-demand",     // 'screen-demand' | 'screen-quantity' | 'screen-changes'
    viewMode: "desktop",            // 'desktop' | 'mobile'
    newChangeSheetOpen: false,
    historyLogOpen: false
  };

  // ── DOM references ──────────────────────────────────────────────────────
  const appContainer     = document.getElementById("dmAppContainer");
  const tabBtns          = document.querySelectorAll(".dm-tab-btn");
  const screenViews      = document.querySelectorAll(".dm-screen");
  const sessionTabs      = document.querySelectorAll(".session-tab-btn");
  const cutoffBadge      = document.getElementById("dmCutoffBadge");
  const roleBadgeBtn     = document.getElementById("dmRoleBadgeBtn");
  const roleDropdown     = document.getElementById("dmRoleDropdown");
  const roleOpts         = document.querySelectorAll(".dm-role-opt");
  const toastEl          = document.getElementById("dmToast");
  const toastMsg         = document.getElementById("dmToastMsg");
  const viewMobileBtn    = document.getElementById("dmBtnMobile");
  const viewDesktopBtn   = document.getElementById("dmBtnDesktop");
  const bottomSheet      = document.getElementById("newChangeSheet");
  const bottomSheetOverlay = document.getElementById("sheetOverlay");

  // ── Toast ───────────────────────────────────────────────────────────────
  function showToast(msg, type = "success") {
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = msg;
    toastEl.className = `dm-toast show ${type}`;
    setTimeout(() => toastEl.classList.remove("show"), 3400);
  }

  // ── Tab Navigation ───────────────────────────────────────────────────────
  function navigateTo(screenId) {
    state.activeTab = screenId;
    tabBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.tab === screenId));
    screenViews.forEach(view => view.classList.toggle("active", view.id === screenId));
    document.getElementById("dmScreensViewport").scrollTop = 0;
  }

  // ── Session Switcher ────────────────────────────────────────────────────
  function setSession(code) {
    state.session = code;
    sessionTabs.forEach(btn => btn.classList.toggle("active", btn.dataset.session === code));
    renderCutoffBadge();
  }

  function renderCutoffBadge() {
    const s = DEMAND_DATA.sessions[state.session];
    if (!cutoffBadge) return;
    if (s.isLocked) {
      cutoffBadge.className = "cutoff-badge locked";
      cutoffBadge.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span>Locked (cutoff passed)</span>`;
    } else {
      cutoffBadge.className = "cutoff-badge open";
      const mins = s.countdownMinutes || 0;
      cutoffBadge.innerHTML = `
        <span class="cutoff-pulse"></span>
        <span>Open — Cutoff in ${mins} min (${s.cutoffTime} AM)</span>`;
    }
  }

  // ── Role Switcher ────────────────────────────────────────────────────────
  const roleLabels = { kitchen: "Kitchen Staff", teacher: "Homeroom Teacher", supervisor: "Boarding Supervisor" };
  function setRole(role) {
    state.role = role;
    const nameEl = document.getElementById("dmCurrentRole");
    if (nameEl) nameEl.textContent = roleLabels[role];
    roleOpts.forEach(o => o.classList.toggle("active", o.dataset.role === role));
    if (roleDropdown) roleDropdown.classList.remove("show");
    showToast(`Perspective: ${roleLabels[role]}`);
  }

  // ── Viewport Toggle ──────────────────────────────────────────────────────
  function setViewMode(mode) {
    state.viewMode = mode;
    appContainer.classList.toggle("mode-mobile", mode === "mobile");
    appContainer.classList.toggle("mode-desktop", mode === "desktop");
    viewMobileBtn.classList.toggle("active", mode === "mobile");
    viewDesktopBtn.classList.toggle("active", mode === "desktop");
  }

  // ==========================================================================
  // SCREEN 1: DETERMINE MEAL DEMAND
  // ==========================================================================
  function renderSummaryCards() {
    const totals = state.classes.reduce((acc, cls) => {
      acc.base      += cls.base;
      acc.confirmed += cls.confirmed;
      acc.absent    += cls.absent;
      acc.extra     += cls.extra;
      return acc;
    }, { base: 0, confirmed: 0, absent: 0, extra: 0 });

    setEl("statBase",      totals.base);
    setEl("statConfirmed", totals.confirmed);
    setEl("statAbsent",    totals.absent);
    setEl("statExtra",     totals.extra);
  }

  function renderClassList() {
    const container = document.getElementById("classListEl");
    if (!container) return;
    container.innerHTML = state.classes.map(cls => renderClassCard(cls)).join("");
  }

  function renderClassCard(cls) {
    const completeness = cls.base > 0 ? Math.round(((cls.confirmed) / cls.base) * 100) : 0;
    const circumference = 2 * Math.PI * 18;
    const offset = circumference - (completeness / 100) * circumference;
    const statusColor = cls.status === "confirmed" ? "var(--secondary)" : cls.status === "draft" ? "var(--tertiary)" : "#64748B";
    const statusLabel = cls.status === "confirmed" ? "Confirmed" : cls.status === "locked" ? "Locked" : "Draft";

    const studentRows = cls.students.length > 0 ? cls.students.map(s => {
      const tag = s.withinCutoff
        ? `<span class="report-tag on-time">On time</span>`
        : `<span class="report-tag late">Late report</span>`;
      const allergy = s.allergy ? `<span class="allergy-badge">⚠️ ${s.allergy}</span>` : "";
      const reason  = s.reason  ? `<div class="student-reason">${s.reason}</div>` : "";
      return `
        <div class="student-row" id="srow-${s.id}">
          <div class="student-info">
            <div class="student-name">${s.name} ${allergy}</div>
            ${reason}
            <div class="student-meta">${tag} · ${s.reportTime}</div>
          </div>
          <div class="student-toggles">
            <label class="toggle-opt ${s.status === 'attend' ? 'active attend' : ''}">
              <input type="radio" name="st-${s.id}" value="attend" ${s.status === 'attend' ? 'checked' : ''}
                     onchange="window.setStudentStatus(${cls.id}, ${s.id}, 'attend')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Attend</span>
            </label>
            <label class="toggle-opt ${s.status === 'absent' ? 'active absent' : ''}">
              <input type="radio" name="st-${s.id}" value="absent" ${s.status === 'absent' ? 'checked' : ''}
                     onchange="window.setStudentStatus(${cls.id}, ${s.id}, 'absent')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <span>Absent</span>
            </label>
            <label class="toggle-opt ${s.status === 'extra_guest' ? 'active extra' : ''}">
              <input type="radio" name="st-${s.id}" value="extra_guest" ${s.status === 'extra_guest' ? 'checked' : ''}
                     onchange="window.setStudentStatus(${cls.id}, ${s.id}, 'extra_guest')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Extra</span>
            </label>
          </div>
        </div>`;
    }).join("") : `<div class="no-students-note">No individual records yet — use the summary counts above.</div>`;

    return `
      <div class="class-card" id="cc-${cls.id}">
        <div class="class-card-header" onclick="window.toggleClass(${cls.id})">
          <div class="cc-left">
            <div class="class-tag">${cls.name.replace("Class ", "")}</div>
            <div>
              <div class="cc-title">${cls.name}</div>
              <div class="cc-sub">${cls.teacher} &bull; ${cls.grade}</div>
            </div>
          </div>
          <div class="cc-right">
            <div class="ring-wrap" title="${completeness}% confirmed">
              <svg width="44" height="44" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#F1F5F9" stroke-width="5"/>
                <circle cx="22" cy="22" r="18" fill="none" stroke="${statusColor}" stroke-width="5"
                  stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                  stroke-linecap="round" transform="rotate(-90 22 22)"/>
              </svg>
              <span class="ring-pct">${completeness}%</span>
            </div>
            <div class="cc-counts">
              <span class="count-chip attend">${cls.confirmed} ✓</span>
              <span class="count-chip absent">${cls.absent} ✗</span>
              ${cls.extra > 0 ? `<span class="count-chip extra">+${cls.extra}</span>` : ""}
            </div>
            <svg class="chevron-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <div class="class-card-body" id="ccbody-${cls.id}">
          <div class="student-list">${studentRows}</div>
          <div class="class-card-actions">
            <button class="btn btn-secondary btn-sm" onclick="window.saveClassDraft(${cls.id})">Save Draft</button>
            <button class="btn btn-primary btn-sm" onclick="window.confirmClass(${cls.id})">Confirm Class</button>
          </div>
        </div>
      </div>`;
  }

  function renderDetermineFooter() {
    const allConfirmed = state.classes.every(c => c.status === "confirmed" || c.status === "locked");
    const session = DEMAND_DATA.sessions[state.session];
    const btn = document.getElementById("btnDetermineAndLock");
    if (btn) {
      btn.disabled = !allConfirmed;
      btn.title = allConfirmed ? "Lock and push to kitchen" : "All classes must be confirmed first";
    }
    const countdownEl = document.getElementById("cutoffCountdown");
    if (countdownEl) {
      countdownEl.textContent = session.isLocked
        ? `Session locked at ${session.cutoffTime} AM`
        : `Registration cutoff: ${session.cutoffTime} AM (${session.countdownMinutes || '--'} min remaining)`;
    }
  }

  // Global handlers for class interactions
  window.toggleClass = (classId) => {
    const body = document.getElementById(`ccbody-${classId}`);
    const card = document.getElementById(`cc-${classId}`);
    if (body) {
      const open = body.classList.toggle("open");
      if (card) card.classList.toggle("expanded", open);
    }
  };

  window.setStudentStatus = (classId, studentId, newStatus) => {
    const cls = state.classes.find(c => c.id === classId);
    if (!cls) return;
    const student = cls.students.find(s => s.id === studentId);
    if (!student) return;
    const oldStatus = student.status;
    student.status = newStatus;
    // Update class totals
    const recount = (stat) => cls.students.filter(s => s.status === stat).length;
    cls.confirmed = recount("attend");
    cls.absent    = recount("absent");
    cls.extra     = recount("extra_guest");
    renderSummaryCards();
    // Update DOM for visual feedback without full re-render
    const srow = document.getElementById(`srow-${studentId}`);
    if (srow) {
      srow.querySelectorAll(".toggle-opt").forEach(lbl => {
        lbl.classList.remove("active", "attend", "absent", "extra");
        if (lbl.querySelector("input").value === newStatus) {
          lbl.classList.add("active", newStatus === "attend" ? "attend" : newStatus === "absent" ? "absent" : "extra");
        }
      });
    }
    // Update class card header counts
    const card = document.getElementById(`cc-${classId}`);
    if (card) {
      const chips = card.querySelectorAll(".count-chip");
      chips.forEach(chip => {
        if (chip.classList.contains("attend")) chip.textContent = `${cls.confirmed} ✓`;
        if (chip.classList.contains("absent")) chip.textContent = `${cls.absent} ✗`;
      });
    }
    showToast(`${student.name} marked as ${newStatus.replace("_", " ")}`);
  };

  window.saveClassDraft = (classId) => {
    const cls = state.classes.find(c => c.id === classId);
    if (cls) { cls.status = "draft"; showToast(`${cls.name} saved as draft`); }
  };

  window.confirmClass = (classId) => {
    const cls = state.classes.find(c => c.id === classId);
    if (cls) {
      cls.status = "confirmed";
      // Update status badge in card
      const card = document.getElementById(`cc-${classId}`);
      if (card) {
        const body = document.getElementById(`ccbody-${classId}`);
        if (body) body.classList.remove("open");
        card.classList.remove("expanded");
      }
      renderClassList();
      renderSummaryCards();
      renderDetermineFooter();
      showToast(`${cls.name} confirmed!`, "success");
    }
  };

  // ==========================================================================
  // SCREEN 2: EXPECTED MEAL QUANTITY
  // ==========================================================================
  function calcTotal(dish) {
    const result = dish.headcount * dish.portionSize * (1 + dish.bufferPct / 100);
    if (dish.unit === "kg" || dish.unit === "liters") return parseFloat((result / 1000).toFixed(1));
    return Math.ceil(result);
  }

  function renderQuantityScreen() {
    const headcount = state.classes.reduce((sum, c) => sum + c.confirmed + c.extra, 0);
    setEl("qtyTotalHeadcount", headcount);
    setEl("qtyDishCount", state.dishes.length);

    const tbody = document.getElementById("dishTableBody");
    if (!tbody) return;

    tbody.innerHTML = state.dishes.map(dish => {
      const total = calcTotal(dish);
      const badgeClass = dish.method === "auto" ? "badge-auto" : "badge-manual";
      const badgeLabel = dish.method === "auto" ? "Auto-calculated" : "Manually adjusted";
      const formula = `${dish.headcount} headcount × ${dish.portionSize} ${dish.portionUnit} × (1 + ${dish.bufferPct}% buffer) = ${total} ${dish.unit}`;
      return `
        <tr class="dish-row" id="dishrow-${dish.id}">
          <td>
            <div class="dish-name-cell">
              <div class="dish-icon-box">${getDishIcon(dish.icon)}</div>
              <div>
                <div class="dish-name-txt">${dish.name}</div>
                <div class="dish-cat-txt">${dish.category}</div>
              </div>
            </div>
          </td>
          <td><strong>${dish.portionSize} ${dish.portionUnit}</strong></td>
          <td>${dish.headcount}</td>
          <td>
            <div class="buffer-stepper">
              <button class="stepper-btn" onclick="window.adjustBuffer('${dish.id}', -1)">−</button>
              <span class="stepper-val">${dish.bufferPct}%</span>
              <button class="stepper-btn" onclick="window.adjustBuffer('${dish.id}', +1)">+</button>
            </div>
          </td>
          <td><span class="total-qty-val">${total} ${dish.unit}</span></td>
          <td><span class="qty-method-badge ${badgeClass}">${badgeLabel}</span></td>
          <td>
            <button class="btn-formula-toggle" onclick="window.toggleFormula('${dish.id}')" title="Show formula">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </button>
          </td>
        </tr>
        <tr class="formula-row" id="formula-${dish.id}" style="display:none;">
          <td colspan="7">
            <div class="formula-panel">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M6 2v6M18 2v6M2 10h20M12 14v4M10 18h4"/></svg>
              <span><strong>Formula:</strong> ${formula}</span>
            </div>
          </td>
        </tr>`;
    }).join("");

    renderStickyGrandTotal();
  }

  function renderStickyGrandTotal() {
    const grandTotals = {};
    state.dishes.forEach(d => {
      if (!grandTotals[d.unit]) grandTotals[d.unit] = 0;
      grandTotals[d.unit] += calcTotal(d);
    });
    const el = document.getElementById("grandTotalSummary");
    if (!el) return;
    el.innerHTML = Object.entries(grandTotals).map(([unit, val]) =>
      `<span class="grand-total-chip"><strong>${parseFloat(val.toFixed(1))} ${unit}</strong></span>`
    ).join(" &nbsp;+&nbsp; ");
  }

  window.adjustBuffer = (dishId, delta) => {
    const dish = state.dishes.find(d => d.id === dishId);
    if (!dish) return;
    dish.bufferPct = Math.max(0, Math.min(20, dish.bufferPct + delta));
    dish.method = "manual";
    const total = calcTotal(dish);
    const row = document.getElementById(`dishrow-${dishId}`);
    if (row) {
      row.querySelector(".stepper-val").textContent = `${dish.bufferPct}%`;
      row.querySelector(".total-qty-val").textContent = `${total} ${dish.unit}`;
      const badge = row.querySelector(".qty-method-badge");
      badge.className = "qty-method-badge badge-manual";
      badge.textContent = "Manually adjusted";
    }
    renderStickyGrandTotal();
  };

  window.toggleFormula = (dishId) => {
    const formulaRow = document.getElementById(`formula-${dishId}`);
    if (formulaRow) {
      formulaRow.style.display = formulaRow.style.display === "none" ? "table-row" : "none";
    }
  };

  window.recalculateAll = () => {
    const headcount = state.classes.reduce((sum, c) => sum + c.confirmed + c.extra, 0);
    state.dishes.forEach(d => { d.headcount = headcount; d.method = "auto"; });
    renderQuantityScreen();
    showToast("All quantities recalculated from confirmed headcount");
  };

  // ==========================================================================
  // SCREEN 3: MANAGE DEMAND & QUANTITY CHANGES
  // ==========================================================================
  const changeTypeLabels = {
    add: { label: "Add",             cls: "ct-add" },
    cancel: { label: "Cancel",       cls: "ct-cancel" },
    modify_quantity: { label: "Modify Qty", cls: "ct-modify" },
    absence: { label: "Absence",     cls: "ct-absence" },
    extra_guest: { label: "Extra Guest", cls: "ct-extra" }
  };

  const statusLabels = {
    pending:  { label: "Pending",  cls: "st-pending"  },
    approved: { label: "Approved", cls: "st-approved" },
    rejected: { label: "Rejected", cls: "st-rejected" }
  };

  function renderChangeRequests() {
    const container = document.getElementById("changeRequestsList");
    if (!container) return;
    container.innerHTML = state.changeRequests.map(cr => {
      const ct = changeTypeLabels[cr.changeType] || { label: cr.changeType, cls: "" };
      const st = statusLabels[cr.approvalStatus] || { label: cr.approvalStatus, cls: "" };
      const deltaSign = cr.quantityDelta > 0 ? `+${cr.quantityDelta}` : `${cr.quantityDelta}`;
      const emergencyBadge = cr.isEmergency
        ? `<span class="emergency-badge">⚡ Emergency</span>`
        : `<span class="standard-badge">Standard</span>`;
      const who = cr.studentName ? `${cr.studentName} <em>(${cr.className})</em>` : `<em>${cr.className}</em>`;
      const ts = new Date(cr.requestedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const approvalActions = cr.approvalStatus === "pending" ? `
        <div class="approval-actions">
          <button class="btn btn-success btn-xs" onclick="window.approveChange('${cr.id}')">Approve</button>
          <button class="btn btn-danger btn-xs" onclick="window.rejectChange('${cr.id}')">Reject</button>
        </div>` : `<div class="approved-info">${cr.approvedBy ? `by ${cr.approvedBy} at ${new Date(cr.approvedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}</div>`;

      return `
        <div class="change-request-card ${cr.isEmergency ? 'is-emergency' : ''}">
          <div class="cr-top">
            <div class="cr-badges">
              <span class="change-type-badge ${ct.cls}">${ct.label}</span>
              ${emergencyBadge}
              <span class="delta-chip">${deltaSign} portion(s)</span>
            </div>
            <span class="status-chip ${st.cls}">${st.label}</span>
          </div>
          <div class="cr-who">${who}</div>
          <div class="cr-reason">${cr.reason}</div>
          <div class="cr-meta">
            <span>By <strong>${cr.requestedBy}</strong></span>
            <span>${ts}</span>
          </div>
          ${approvalActions}
        </div>`;
    }).join("");
  }

  function renderChangeLog() {
    const container = document.getElementById("changeLogTimeline");
    if (!container) return;
    container.innerHTML = state.changeLog.map((entry, idx) => {
      const ts = new Date(entry.changedAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
      return `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="tl-header">
              <span class="tl-field">${entry.fieldChanged.replace(/_/g, " ")}</span>
              <span class="tl-ts">${ts}</span>
            </div>
            <div class="tl-change">
              <span class="tl-old">${entry.oldValue}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              <span class="tl-new">${entry.newValue}</span>
            </div>
            ${entry.note ? `<div class="tl-note">${entry.note}</div>` : ""}
            <div class="tl-by">— ${entry.changedBy}</div>
          </div>
        </div>`;
    }).join("");
  }

  window.approveChange = (crId) => {
    const cr = state.changeRequests.find(r => r.id === crId);
    if (!cr) return;
    cr.approvalStatus = "approved";
    cr.approvedBy = `${roleLabels[state.role]}`;
    cr.approvedAt = new Date().toISOString();
    state.changeLog.unshift({
      id: `log-new-${Date.now()}`, changeRequestId: crId,
      dailyDemandId: null,
      fieldChanged: cr.changeType === "absence" ? "absence_count" : "extra_count",
      oldValue: "--", newValue: `${cr.quantityDelta > 0 ? "+" : ""}${cr.quantityDelta}`,
      changedBy: roleLabels[state.role],
      changedAt: new Date().toISOString(),
      note: `Approved: ${cr.reason}`
    });
    renderChangeRequests();
    renderChangeLog();
    showToast("Change request approved");
  };

  window.rejectChange = (crId) => {
    const cr = state.changeRequests.find(r => r.id === crId);
    if (!cr) return;
    cr.approvalStatus = "rejected";
    cr.approvedBy = `${roleLabels[state.role]}`;
    cr.approvedAt = new Date().toISOString();
    renderChangeRequests();
    showToast("Change request rejected", "warning");
  };

  // ── Bottom Sheet: New Change Request ────────────────────────────────────
  function openBottomSheet() {
    if (bottomSheet) bottomSheet.classList.add("open");
    if (bottomSheetOverlay) bottomSheetOverlay.classList.add("show");
  }
  function closeBottomSheet() {
    if (bottomSheet) bottomSheet.classList.remove("open");
    if (bottomSheetOverlay) bottomSheetOverlay.classList.remove("show");
  }

  window.submitNewChange = (e) => {
    e.preventDefault();
    const classVal  = document.getElementById("ncClass").value;
    const typeVal   = document.getElementById("ncType").value;
    const deltaVal  = parseInt(document.getElementById("ncDelta").value, 10);
    const reasonVal = document.getElementById("ncReason").value;
    if (!classVal || !typeVal || isNaN(deltaVal) || !reasonVal) { showToast("Please fill in all fields", "warning"); return; }
    const cutoffPassed = DEMAND_DATA.sessions[state.session].isLocked;
    const now = new Date().toISOString();
    const newCr = {
      id: `cr-new-${Date.now()}`,
      studentName: null, className: classVal,
      changeType: typeVal, quantityDelta: deltaVal,
      reason: reasonVal,
      requestedBy: roleLabels[state.role],
      requestedAt: now,
      isEmergency: cutoffPassed,
      approvalStatus: "pending",
      approvedBy: null, approvedAt: null
    };
    state.changeRequests.unshift(newCr);
    renderChangeRequests();
    document.getElementById("formNewChange").reset();
    closeBottomSheet();
    showToast("New change request submitted");
  };

  // ── Utility Helpers ──────────────────────────────────────────────────────
  function setEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function getDishIcon(type) {
    const icons = {
      rice: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 11h16a1 1 0 0 1 1 1c0 5-4 9-9 9s-9-4-9-9a1 1 0 0 1 1-1Z"/><path d="M6 8c2-3 5-3 6-3s4 0 6 3"/></svg>`,
      fish: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6Z"/><path d="M18 12h.01"/><path d="M2 16l4.5-4L2 8"/></svg>`,
      soup: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 8V3M12 8V3M17 8V3"/></svg>`,
      leaf: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
      apple: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="8"/><path d="M12 5V2M9 2c3 1 3 3 3 3"/></svg>`
    };
    return icons[type] || icons.rice;
  }

  // ── History Log Toggle ───────────────────────────────────────────────────
  window.toggleHistoryLog = () => {
    state.historyLogOpen = !state.historyLogOpen;
    const body = document.getElementById("historyLogBody");
    const arrow = document.getElementById("historyArrow");
    if (body) body.classList.toggle("open", state.historyLogOpen);
    if (arrow) arrow.style.transform = state.historyLogOpen ? "rotate(180deg)" : "";
  };

  // ── Setup All Event Listeners ────────────────────────────────────────────
  function setupEvents() {
    // Tab navigation
    tabBtns.forEach(btn => btn.addEventListener("click", () => navigateTo(btn.dataset.tab)));

    // Session tabs
    sessionTabs.forEach(btn => btn.addEventListener("click", () => setSession(btn.dataset.session)));

    // Role switcher
    if (roleBadgeBtn) roleBadgeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      roleDropdown?.classList.toggle("show");
    });
    roleOpts.forEach(o => o.addEventListener("click", (e) => { e.stopPropagation(); setRole(o.dataset.role); }));
    document.addEventListener("click", () => roleDropdown?.classList.remove("show"));

    // Viewport
    if (viewMobileBtn) viewMobileBtn.addEventListener("click", () => setViewMode("mobile"));
    if (viewDesktopBtn) viewDesktopBtn.addEventListener("click", () => setViewMode("desktop"));

    // Recalculate button (Screen 2)
    const recalcBtn = document.getElementById("btnRecalcAll");
    if (recalcBtn) recalcBtn.addEventListener("click", window.recalculateAll);

    // Determine & Lock button (Screen 1)
    const lockBtn = document.getElementById("btnDetermineAndLock");
    if (lockBtn) {
      lockBtn.addEventListener("click", () => {
        state.classes.forEach(c => { if (c.status === "confirmed") c.status = "locked"; });
        renderClassList();
        renderDetermineFooter();
        showToast("All confirmed demands have been locked and sent to kitchen!");
      });
    }

    // FAB: New Change
    const fab = document.getElementById("fabNewChange");
    if (fab) fab.addEventListener("click", openBottomSheet);
    const closeSheetBtn = document.getElementById("btnCloseSheet");
    if (closeSheetBtn) closeSheetBtn.addEventListener("click", closeBottomSheet);
    if (bottomSheetOverlay) bottomSheetOverlay.addEventListener("click", closeBottomSheet);
    const formChange = document.getElementById("formNewChange");
    if (formChange) formChange.addEventListener("submit", window.submitNewChange);
  }

  // ── INITIALIZE ───────────────────────────────────────────────────────────
  function init() {
    setViewMode("desktop");
    renderCutoffBadge();
    renderSummaryCards();
    renderClassList();
    renderDetermineFooter();
    renderQuantityScreen();
    renderChangeRequests();
    renderChangeLog();
    setupEvents();
  }

  init();
});
