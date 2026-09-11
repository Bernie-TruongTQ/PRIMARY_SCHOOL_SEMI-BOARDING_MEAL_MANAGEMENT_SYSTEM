// ==========================================================================
// PRIMARY SCHOOL SEMI-BOARDING MEAL OPERATION SYSTEM - APPLICATION LOGIC
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    currentScreen: "dashboard",
    currentSession: "lunch",
    currentRole: "kitchen", // 'kitchen' | 'teacher' | 'supervisor'
    data: JSON.parse(JSON.stringify(MOCK_DATA)), // deep copy
    filterGrade: "all",
    searchQuery: ""
  };

  // DOM Elements
  const appContainer = document.getElementById("appContainer");
  const screensViewport = document.getElementById("screensViewport");
  const navItems = document.querySelectorAll(".nav-item");
  const screenViews = document.querySelectorAll(".screen-view");
  const sessionTabBtns = document.querySelectorAll(".session-tab-btn");
  const cutoffBadge = document.getElementById("cutoffBadge");
  const roleBadgeBtn = document.getElementById("roleBadgeBtn");
  const roleDropdown = document.getElementById("roleDropdown");
  const roleOptions = document.querySelectorAll(".role-opt");
  const toastNotification = document.getElementById("toastNotification");
  const toastMessage = document.getElementById("toastMessage");

  // Viewport Switcher
  const btnViewMobile = document.getElementById("btnViewMobile");
  const btnViewDesktop = document.getElementById("btnViewDesktop");

  // Modal Elements
  const reportChangeModal = document.getElementById("reportChangeModal");
  const btnOpenReportChange = document.getElementById("btnOpenReportChange");
  const btnCloseReportChange = document.getElementById("btnCloseReportChange");
  const btnCancelReportChange = document.getElementById("btnCancelReportChange");
  const formReportChange = document.getElementById("formReportChange");

  const exportReportModal = document.getElementById("exportReportModal");
  const btnCloseExportModal = document.getElementById("btnCloseExportModal");

  // --- INITIALIZATION ---
  function init() {
    renderSessionInfo();
    renderScreen1Dashboard();
    renderScreen2ExpectedQuantities();
    renderScreen3Preparation();
    renderScreen4Distribution();
    renderScreen5Reconciliation();
    setupEventListeners();
  }

  // --- TOAST NOTIFIER ---
  function showToast(message) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotification.classList.add("show");
    setTimeout(() => {
      toastNotification.classList.remove("show");
    }, 3200);
  }

  // --- SCREEN NAVIGATION ---
  function navigateTo(screenId) {
    state.currentScreen = screenId;
    
    // Update nav item active states
    navItems.forEach(item => {
      if (item.dataset.screen === screenId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update screen views
    screenViews.forEach(view => {
      if (view.id === `screen-${screenId}`) {
        view.classList.add("active");
      } else {
        view.classList.remove("active");
      }
    });

    // Scroll viewport to top
    if (screensViewport) screensViewport.scrollTop = 0;
  }

  // --- SESSION SWITCHER ---
  function setSession(sessionCode) {
    state.currentSession = sessionCode;
    sessionTabBtns.forEach(btn => {
      if (btn.dataset.session === sessionCode) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    renderSessionInfo();
    showToast(`Switched session to ${state.data.sessions[sessionCode].name}`);
  }

  function renderSessionInfo() {
    const session = state.data.sessions[state.currentSession];
    if (!cutoffBadge || !session) return;

    if (session.isLocked) {
      cutoffBadge.className = "cutoff-badge locked";
      cutoffBadge.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        <span>${session.cutoffMessage}</span>
      `;
    } else {
      cutoffBadge.className = "cutoff-badge open";
      cutoffBadge.innerHTML = `
        <span class="cutoff-pulse"></span>
        <span>${session.cutoffCountdown || session.cutoffMessage}</span>
      `;
    }
  }

  // --- ROLE SWITCHER ---
  function setUserRole(roleKey) {
    state.currentRole = roleKey;
    const roleLabels = {
      kitchen: "Kitchen Staff",
      teacher: "Homeroom Teacher",
      supervisor: "Boarding Supervisor"
    };

    const roleNameEl = document.getElementById("currentRoleName");
    if (roleNameEl) roleNameEl.textContent = roleLabels[roleKey];

    roleOptions.forEach(opt => {
      opt.classList.toggle("active", opt.dataset.role === roleKey);
    });

    if (roleDropdown) roleDropdown.classList.remove("show");
    showToast(`Switched perspective to: ${roleLabels[roleKey]}`);
  }

  // ==========================================================================
  // RENDER SCREEN 1: MEAL DEMAND DASHBOARD
  // ==========================================================================
  function renderScreen1Dashboard() {
    const summary = state.data.demandSummary;

    // Update Summary Metric Cards
    const valReg = document.getElementById("statValRegistered");
    const valConf = document.getElementById("statValConfirmed");
    const valAbs = document.getElementById("statValAbsent");
    const valExtra = document.getElementById("statValExtra");

    if (valReg) valReg.textContent = summary.registeredStudents;
    if (valConf) valConf.textContent = summary.confirmedAttend;
    if (valAbs) valAbs.textContent = summary.absent;
    if (valExtra) valExtra.textContent = summary.extraGuests;

    // Render Classes List
    const classListEl = document.getElementById("classListContainer");
    if (!classListEl) return;

    classListEl.innerHTML = state.data.classes.map(cls => {
      const attendanceRate = Math.round((cls.confirmed / cls.registered) * 100);
      const studentItems = cls.studentsList && cls.studentsList.length > 0 
        ? cls.studentsList.map(st => `
            <div class="roster-item">
              <div>
                <strong>${st.name}</strong>
                ${st.allergy && st.allergy !== 'None' ? `<span class="allergy-badge">⚠️ ${st.allergy}</span>` : ''}
                ${st.reason ? `<div style="font-size: 10px; color: #DC2626; margin-top:2px;">Reason: ${st.reason}</div>` : ''}
              </div>
              <span class="status-chip-sm ${st.status}">${st.status === 'absent' ? 'Absent' : 'Attend'}</span>
            </div>
          `).join('')
        : `<div style="color: #94A3B8; font-style: italic; font-size: 11px;">Standard class registration. No individual medical/dietary variances flagged.</div>`;

      return `
        <div class="class-card" id="card-class-${cls.id}">
          <div class="class-card-header" onclick="window.toggleCardExpansion('card-class-${cls.id}')">
            <div class="class-name-badge-grp">
              <div class="class-icon-tag">${cls.name.replace('Class ', '')}</div>
              <div class="class-meta">
                <span class="class-title">${cls.name}</span>
                <span class="class-teacher">${cls.teacher} &bull; ${cls.grade}</span>
              </div>
            </div>
            <div class="class-counts">
              <div class="count-pill">
                <div class="count-val">${cls.confirmed} / ${cls.registered}</div>
                <div class="count-lbl">${attendanceRate}% Confirmed</div>
              </div>
              <svg class="chevron-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          <div class="class-card-body">
            <div style="display: flex; justify-content: space-between; font-weight: 600; color: #475569; margin-bottom: 4px;">
              <span>Student Details & Attendance Notes:</span>
              <span>Absences: ${cls.absent} | Extra: ${cls.extra}</span>
            </div>
            <div class="student-roster-mini">
              ${studentItems}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Global toggle for expandable cards
  window.toggleCardExpansion = (cardId) => {
    const card = document.getElementById(cardId);
    if (card) {
      card.classList.toggle("expanded");
    }
  };

  // ==========================================================================
  // RENDER SCREEN 2: EXPECTED MEAL QUANTITY
  // ==========================================================================
  function renderScreen2ExpectedQuantities() {
    const expected = state.data.expectedQuantities;
    const bannerHeadcount = document.getElementById("bannerHeadcount");
    const bannerBuffer = document.getElementById("bannerBuffer");
    const badgeCalcMethod = document.getElementById("badgeCalcMethod");
    const lastCalculatedAtEl = document.getElementById("lastCalculatedAt");

    if (bannerHeadcount) bannerHeadcount.textContent = expected.plannedHeadcount;
    if (bannerBuffer) bannerBuffer.textContent = `+${expected.bufferPercentage}%`;
    if (badgeCalcMethod) {
      badgeCalcMethod.innerHTML = expected.calculationMethod === "auto" 
        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg> Auto-calculated`
        : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Manually adjusted`;
    }
    if (lastCalculatedAtEl) lastCalculatedAtEl.textContent = expected.lastCalculatedAt;

    // Render Table Rows
    const tableBody = document.getElementById("dishesTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = expected.dishes.map(dish => {
      return `
        <tr>
          <td>
            <div class="dish-cell">
              <div class="dish-icon-box">
                ${getDishIconSvg(dish.icon)}
              </div>
              <div>
                <div class="dish-name-txt">${dish.name}</div>
                <div class="dish-cat-txt">${dish.category}</div>
              </div>
            </div>
          </td>
          <td><strong>${dish.portionSize} ${dish.portionUnit}</strong> / portion</td>
          <td>${expected.plannedHeadcount} kids</td>
          <td>
            <span class="total-qty-highlight">${dish.calculatedTotal} ${dish.unit}</span>
          </td>
          <td>
            <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="window.adjustDishPortion('${dish.id}')">
              Adjust
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.adjustDishPortion = (dishId) => {
    const dish = state.data.expectedQuantities.dishes.find(d => d.id === dishId);
    if (!dish) return;
    const newPortion = prompt(`Adjust portion size for "${dish.name}" (${dish.portionUnit}):`, dish.portionSize);
    if (newPortion && !isNaN(newPortion) && Number(newPortion) > 0) {
      dish.portionSize = Number(newPortion);
      dish.isCustomized = true;
      state.data.expectedQuantities.calculationMethod = "manual";
      recalculateQuantities(false);
      showToast(`Updated portion size for ${dish.name} to ${newPortion} ${dish.portionUnit}`);
    }
  };

  function recalculateQuantities(isAutoReset = true) {
    const expected = state.data.expectedQuantities;
    const headcount = state.data.demandSummary.totalHeadcount;
    expected.plannedHeadcount = headcount;
    const bufferMultiplier = 1 + (expected.bufferPercentage / 100);

    expected.dishes.forEach(dish => {
      if (dish.unit === "kg") {
        dish.calculatedTotal = parseFloat(((headcount * dish.portionSize * bufferMultiplier) / 1000).toFixed(1));
      } else if (dish.unit === "liters") {
        dish.calculatedTotal = parseFloat(((headcount * dish.portionSize * bufferMultiplier) / 1000).toFixed(1));
      } else {
        dish.calculatedTotal = Math.ceil(headcount * bufferMultiplier);
      }
    });

    if (isAutoReset) {
      expected.calculationMethod = "auto";
      expected.lastCalculatedAt = "Just now (Auto-recalculated)";
    } else {
      expected.lastCalculatedAt = "Just now (Manual adjustment)";
    }

    renderScreen2ExpectedQuantities();
  }

  // ==========================================================================
  // RENDER SCREEN 3: MEAL PREPARATION KANBAN
  // ==========================================================================
  function renderScreen3Preparation() {
    const prep = state.data.prepBoard;

    // Update Progress Bar
    const totalDishes = prep.columns.toPrepare.length + prep.columns.inProgress.length + prep.columns.ready.length;
    const readyCount = prep.columns.ready.length;
    const inProgressCount = prep.columns.inProgress.length;
    const calculatedPct = totalDishes > 0 ? Math.round(((readyCount + inProgressCount * 0.5) / totalDishes) * 100) : 0;
    prep.overallProgress = calculatedPct;

    const prepProgressPct = document.getElementById("prepProgressPct");
    const prepProgressFill = document.getElementById("prepProgressFill");
    const prepCountSummary = document.getElementById("prepCountSummary");

    if (prepProgressPct) prepProgressPct.textContent = `${prep.overallProgress}%`;
    if (prepProgressFill) prepProgressFill.style.width = `${prep.overallProgress}%`;
    if (prepCountSummary) prepCountSummary.textContent = `${readyCount} of ${totalDishes} Dishes Ready`;

    // Render Columns
    renderKanbanColumn("toPrepareStack", prep.columns.toPrepare, "toPrepare");
    renderKanbanColumn("inProgressStack", prep.columns.inProgress, "inProgress");
    renderKanbanColumn("readyStack", prep.columns.ready, "ready");

    const toPrepCount = document.getElementById("countToPrepare");
    const inProgCount = document.getElementById("countInProgress");
    const readyBadgeCount = document.getElementById("countReady");

    if (toPrepCount) toPrepCount.textContent = prep.columns.toPrepare.length;
    if (inProgCount) inProgCount.textContent = prep.columns.inProgress.length;
    if (readyBadgeCount) readyBadgeCount.textContent = prep.columns.ready.length;
  }

  function renderKanbanColumn(elementId, items, columnType) {
    const container = document.getElementById(elementId);
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 24px 10px; color: #94A3B8; font-size: 11px;">No dishes in this stage</div>`;
      return;
    }

    container.innerHTML = items.map(card => {
      let actionButtons = "";
      if (columnType === "toPrepare") {
        actionButtons = `
          <button class="btn-move-col" onclick="window.movePrepCard('${card.id}', 'toPrepare', 'inProgress')">
            Start Cooking &rarr;
          </button>
        `;
      } else if (columnType === "inProgress") {
        actionButtons = `
          <button class="btn-move-col" style="background: #16A34A; color: #fff;" onclick="window.movePrepCard('${card.id}', 'inProgress', 'ready')">
            Mark Ready &check;
          </button>
        `;
      } else if (columnType === "ready") {
        actionButtons = `
          <span style="font-size: 11px; color: #16A34A; font-weight: 700; display: flex; align-items: center; gap: 3px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Hot Holding
          </span>
        `;
      }

      return `
        <div class="kanban-card" id="card-${card.id}">
          <div class="kanban-card-top">
            <span class="dish-prep-name">${card.dishName}</span>
            <span class="prep-qty-pill">${card.quantity}</span>
          </div>
          <div class="prep-step-info">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>${card.step}</span>
          </div>
          <div class="kanban-card-footer">
            <div class="assigned-avatar-grp">
              <span class="staff-avatar-circle">${card.assignedTo.avatar}</span>
              <span>${card.assignedTo.name}</span>
            </div>
            <div class="prep-card-actions">
              ${actionButtons}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  window.movePrepCard = (cardId, fromCol, toCol) => {
    const prepCols = state.data.prepBoard.columns;
    const cardIndex = prepCols[fromCol].findIndex(c => c.id === cardId);
    if (cardIndex !== -1) {
      const [card] = prepCols[fromCol].splice(cardIndex, 1);
      if (toCol === "inProgress") {
        card.step = "Active cooking / temperature monitoring";
        card.timerState = "running";
      } else if (toCol === "ready") {
        card.step = "Inspected, transferred to thermal boxes";
        card.qcPassed = true;
        card.timerState = "completed";
      }
      prepCols[toCol].push(card);
      renderScreen3Preparation();
      showToast(`Dish "${card.dishName}" moved to ${toCol === 'inProgress' ? 'In Progress' : 'Ready'}`);
    }
  };

  // ==========================================================================
  // RENDER SCREEN 4: MEAL DISTRIBUTION & HANDOVER
  // ==========================================================================
  function renderScreen4Distribution() {
    const listContainer = document.getElementById("distributionListContainer");
    if (!listContainer) return;

    const filtered = state.data.classes.filter(cls => {
      const matchGrade = state.filterGrade === "all" || cls.grade.toLowerCase().includes(state.filterGrade);
      const matchSearch = state.searchQuery === "" || 
        cls.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
        cls.teacher.toLowerCase().includes(state.searchQuery.toLowerCase());
      return matchGrade && matchSearch;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `<div style="text-align: center; padding: 32px; color: #94A3B8;">No classes match your filter</div>`;
      return;
    }

    listContainer.innerHTML = filtered.map(cls => {
      let statusBadge = "";
      let actionButton = "";

      if (cls.status === "pending") {
        statusBadge = `<span class="dist-status-badge pending">⏳ Pending Dispatch</span>`;
        actionButton = `
          <button class="btn btn-primary" style="padding: 6px 12px; font-size: 11px;" onclick="window.markDelivered(${cls.id})">
            Mark as Delivered &rarr;
          </button>
        `;
      } else if (cls.status === "delivered") {
        statusBadge = `<span class="dist-status-badge delivered">🚚 Delivered</span>`;
        actionButton = `
          <button class="btn btn-success" style="padding: 6px 12px; font-size: 11px;" onclick="window.confirmReceipt(${cls.id})">
            Confirm Receipt &check;
          </button>
        `;
      } else if (cls.status === "confirmed") {
        statusBadge = `<span class="dist-status-badge confirmed">✅ Confirmed Received</span>`;
        actionButton = `
          <span style="font-size: 11px; color: #16A34A; font-weight: 600;">Handover Complete</span>
        `;
      }

      return `
        <div class="distribution-row" id="dist-row-${cls.id}">
          <div class="dist-header-row" onclick="window.toggleCardExpansion('dist-row-${cls.id}')">
            <div class="dist-class-info">
              <div class="class-icon-tag" style="background: #F1F5F9; color: #334155; border: 1px solid #E2E8F0;">
                ${cls.name.replace('Class ', '')}
              </div>
              <div>
                <div style="font-weight: 700; font-family: var(--font-display);">${cls.name}</div>
                <div style="font-size: 11px; color: var(--text-muted);">${cls.teacher} &bull; ${cls.confirmed} portions</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              ${statusBadge}
              <svg class="chevron-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          <div class="dist-expanded-details">
            <div class="handover-receipt-grid">
              <div class="receipt-item">
                <div class="receipt-item-label">Quantity Delivered</div>
                <div class="receipt-item-value">${cls.confirmed} Standard Trays</div>
              </div>
              <div class="receipt-item">
                <div class="receipt-item-label">Delivery Timestamp</div>
                <div class="receipt-item-value">${cls.deliveryTime}</div>
              </div>
              <div class="receipt-item">
                <div class="receipt-item-label">Kitchen Dispatcher</div>
                <div class="receipt-item-value">${cls.deliveredBy}</div>
              </div>
              <div class="receipt-item">
                <div class="receipt-item-label">Receiving Teacher</div>
                <div class="receipt-item-value">${cls.receivedBy}</div>
              </div>
            </div>
            ${cls.notes ? `<div style="font-size: 11px; color: #78350F; background: #FEF3C7; padding: 6px 10px; border-radius: 6px; margin-bottom: 10px;"><strong>Notice:</strong> ${cls.notes}</div>` : ''}
            <div class="handover-action-footer">
              <span style="font-size: 11px; color: var(--text-muted);">Digital verification & signature receipt</span>
              <div>${actionButton}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  window.markDelivered = (classId) => {
    const cls = state.data.classes.find(c => c.id === classId);
    if (!cls) return;
    cls.status = "delivered";
    cls.deliveryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    cls.deliveredBy = "Chef Tran Lan (Kitchen Lead)";
    renderScreen4Distribution();
    showToast(`${cls.name} marked as Delivered at ${cls.deliveryTime}`);
  };

  window.confirmReceipt = (classId) => {
    const cls = state.data.classes.find(c => c.id === classId);
    if (!cls) return;
    cls.status = "confirmed";
    cls.receivedBy = `${cls.teacher} (Homeroom Teacher)`;
    renderScreen4Distribution();
    showToast(`${cls.name} handover confirmed by ${cls.teacher}`);
  };

  // ==========================================================================
  // RENDER SCREEN 5: MEAL RECONCILIATION
  // ==========================================================================
  function renderScreen5Reconciliation() {
    const rec = state.data.reconciliation;

    // Reconciliation Accuracy Donut Chart (SVG)
    const donutWrap = document.getElementById("reconcileDonutChart");
    if (donutWrap) {
      const accuracy = rec.accuracyRate;
      const circumference = 2 * Math.PI * 45;
      const strokeDashoffset = circumference - (accuracy / 100) * circumference;

      donutWrap.innerHTML = `
        <svg width="140" height="140" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#F1F5F9" stroke-width="9" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#16A34A" stroke-width="9" 
                  stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" 
                  stroke-linecap="round" transform="rotate(-90 50 50)" />
        </svg>
        <div class="donut-inner-txt">
          <span class="accuracy-value">${accuracy}%</span>
          <span class="accuracy-sub">Accuracy</span>
        </div>
      `;
    }

    // Render Table Rows
    const tableBody = document.getElementById("reconcileTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = rec.items.map(item => {
      let badge = "";
      if (item.status === "normal") {
        badge = `<span class="variance-badge normal">&plusmn;${item.variancePercent}%</span>`;
      } else if (item.status === "surplus_ok") {
        badge = `<span class="variance-badge surplus">+${item.variancePercent}% surplus</span>`;
      } else {
        badge = `<span class="variance-badge alert">&minus;${item.variancePercent}% variance</span>`;
      }

      return `
        <tr>
          <td><strong>${item.dishName}</strong></td>
          <td>${item.plannedQty} ${item.unit}</td>
          <td>${item.actualPrepared} ${item.unit}</td>
          <td>${item.actualConsumed} ${item.unit}</td>
          <td><strong style="color: ${item.leftover > 1.5 ? '#EA580C' : '#16A34A'};">${item.leftover} ${item.unit}</strong></td>
          <td>${badge}</td>
        </tr>
      `;
    }).join('');

    // Render Notes
    renderSupervisorNotes();
  }

  function renderSupervisorNotes() {
    const notesContainer = document.getElementById("notesListContainer");
    if (!notesContainer) return;

    notesContainer.innerHTML = state.data.reconciliation.supervisorNotes.map(n => `
      <div class="note-item">
        <div class="note-meta">
          <span class="note-author">${n.author}</span>
          <span>${n.timestamp}</span>
        </div>
        <p class="note-text">${n.text}</p>
      </div>
    `).join('');
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Navigation items click
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        navigateTo(item.dataset.screen);
      });
    });

    // Session tabs click
    sessionTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        setSession(btn.dataset.session);
      });
    });

    // Viewport Mode Switcher
    if (btnViewMobile) {
      btnViewMobile.addEventListener("click", () => {
        appContainer.classList.remove("mode-desktop");
        appContainer.classList.add("mode-mobile");
        btnViewMobile.classList.add("active");
        btnViewDesktop.classList.remove("active");
      });
    }

    if (btnViewDesktop) {
      btnViewDesktop.addEventListener("click", () => {
        appContainer.classList.remove("mode-mobile");
        appContainer.classList.add("mode-desktop");
        btnViewDesktop.classList.add("active");
        btnViewMobile.classList.remove("active");
      });
    }

    // Role Dropdown Toggle
    if (roleBadgeBtn) {
      roleBadgeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        roleDropdown.classList.toggle("show");
      });
    }

    roleOptions.forEach(opt => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        setUserRole(opt.dataset.role);
      });
    });

    document.addEventListener("click", () => {
      if (roleDropdown) roleDropdown.classList.remove("show");
    });

    // Recalculate Button on Screen 2
    const btnRecalculate = document.getElementById("btnRecalculate");
    if (btnRecalculate) {
      btnRecalculate.addEventListener("click", () => {
        btnRecalculate.classList.add("loading");
        setTimeout(() => {
          recalculateQuantities(true);
          btnRecalculate.classList.remove("loading");
          showToast("Ingredients and batch portions recalculated successfully!");
        }, 300);
      });
    }

    // Distribution Filter Chips
    const filterChips = document.querySelectorAll(".filter-chip-btn");
    filterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        filterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        state.filterGrade = chip.dataset.grade;
        renderScreen4Distribution();
      });
    });

    // Distribution Search Input
    const distSearchInput = document.getElementById("distSearchInput");
    if (distSearchInput) {
      distSearchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        renderScreen4Distribution();
      });
    }

    // Modal: Report Change (Screen 1 FAB)
    if (btnOpenReportChange) {
      btnOpenReportChange.addEventListener("click", () => {
        if (reportChangeModal) reportChangeModal.classList.add("open");
      });
    }

    const closeReportModal = () => {
      if (reportChangeModal) reportChangeModal.classList.remove("open");
    };

    if (btnCloseReportChange) btnCloseReportChange.addEventListener("click", closeReportModal);
    if (btnCancelReportChange) btnCancelReportChange.addEventListener("click", closeReportModal);

    if (formReportChange) {
      formReportChange.addEventListener("submit", (e) => {
        e.preventDefault();
        const classSelect = document.getElementById("selectClass");
        const changeType = document.getElementById("selectChangeType").value;
        const studentName = document.getElementById("inputStudentName").value;
        const reason = document.getElementById("inputReason").value;
        const isEmergency = document.getElementById("checkEmergency").checked;

        const targetClass = state.data.classes.find(c => c.name === classSelect.value);

        if (changeType === "absence") {
          state.data.demandSummary.confirmedAttend -= 1;
          state.data.demandSummary.absent += 1;
          state.data.demandSummary.totalHeadcount -= 1;
          if (targetClass) {
            targetClass.confirmed -= 1;
            targetClass.absent += 1;
            targetClass.studentsList.push({
              id: Date.now(),
              name: studentName || "Student Reported Absent",
              status: "absent",
              reason: reason || "Unspecified absence note"
            });
          }
        } else if (changeType === "extra_guest") {
          state.data.demandSummary.extraGuests += 1;
          state.data.demandSummary.totalHeadcount += 1;
          if (targetClass) {
            targetClass.extra += 1;
          }
        }

        recalculateQuantities(true);
        renderScreen1Dashboard();
        closeReportModal();
        formReportChange.reset();
        showToast(`Change request registered: ${changeType === 'absence' ? 'Absence recorded' : 'Extra guest added'}`);
      });
    }

    // Reconciliation: Add Note
    const btnAddNote = document.getElementById("btnAddNote");
    const inputNote = document.getElementById("inputNoteText");
    if (btnAddNote && inputNote) {
      btnAddNote.addEventListener("click", () => {
        const text = inputNote.value.trim();
        if (!text) return;

        const authorNames = {
          kitchen: "Chef Tran Lan (Kitchen Lead)",
          teacher: "Ms. Le Thu Ha (Homeroom Teacher)",
          supervisor: "Ms. Nguyen Mai (Boarding Supervisor)"
        };

        state.data.reconciliation.supervisorNotes.unshift({
          id: `note-${Date.now()}`,
          author: authorNames[state.currentRole] || "Staff Member",
          role: state.currentRole,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: text
        });

        renderSupervisorNotes();
        inputNote.value = "";
        showToast("Reconciliation observation note saved.");
      });
    }

    // Export Report Modal
    const btnExportReport = document.getElementById("btnExportReport");
    if (btnExportReport) {
      btnExportReport.addEventListener("click", () => {
        if (exportReportModal) exportReportModal.classList.add("open");
      });
    }

    if (btnCloseExportModal) {
      btnCloseExportModal.addEventListener("click", () => {
        if (exportReportModal) exportReportModal.classList.remove("open");
      });
    }

    const btnDownloadPdf = document.getElementById("btnDownloadPdf");
    if (btnDownloadPdf) {
      btnDownloadPdf.addEventListener("click", () => {
        showToast("Generating official meal operations log PDF...");
        setTimeout(() => {
          if (exportReportModal) exportReportModal.classList.remove("open");
          showToast("Daily Reconciliation Report (PDF) generated successfully!");
        }, 1200);
      });
    }
  }

  // Helper Icon SVGs
  function getDishIconSvg(type) {
    if (type === "fish") {
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6Z"/><path d="M18 12h.01"/><path d="M2 16l4.5-4L2 8"/></svg>`;
    } else if (type === "soup") {
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 8V3M12 8V3M17 8V3"/></svg>`;
    } else if (type === "leaf") {
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
    } else if (type === "apple") {
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="8"/><path d="M12 5V2M9 2c3 1 3 3 3 3"/></svg>`;
    }
    // Default Bowl Rice
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 11h16a1 1 0 0 1 1 1c0 5-4 9-9 9s-9-4-9-9a1 1 0 0 1 1-1Z"/><path d="M6 8c2-3 5-3 6-3s4 0 6 3"/><path d="M9 21v1M15 21v1"/></svg>`;
  }

  // Start Application
  init();
});
