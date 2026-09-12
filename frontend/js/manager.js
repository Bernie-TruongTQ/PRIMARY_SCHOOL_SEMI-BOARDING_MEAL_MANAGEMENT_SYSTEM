/**
 * MODULE 2 & 3: MANAGER PORTAL LOGIC (SCR-MGR-01, 02, 03, 04, 05)
 * Traceability: docs/04-information-architecture/task-flows.md (TF-02, TF-03, TF-05)
 */

window.managerModule = {
  init() {
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    // Stepper buttons for buffer percentage
    const btnBufferMinus = document.getElementById('btnBufferMinus');
    const btnBufferPlus = document.getElementById('btnBufferPlus');
    if (btnBufferMinus && btnBufferPlus) {
      btnBufferMinus.addEventListener('click', () => {
        const state = window.stateStore.getState();
        window.stateStore.setBufferPercentage(state.demand.buffer_percentage - 1);
        this.render();
      });
      btnBufferPlus.addEventListener('click', () => {
        const state = window.stateStore.getState();
        window.stateStore.setBufferPercentage(state.demand.buffer_percentage + 1);
        this.render();
      });
    }

    // Manager tab buttons
    const navBar = document.getElementById('managerSubNav');
    if (navBar) {
      navBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.sub-nav-item');
        if (btn) {
          const tab = btn.dataset.tab;
          window.stateStore.setManagerTab(tab);
          this.switchTab(tab);
        }
      });
    }
  },

  switchTab(tab) {
    document.querySelectorAll('.manager-tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('#managerSubNav .sub-nav-item').forEach(b => b.classList.remove('active'));

    const activeBtn = document.querySelector(`#managerSubNav .sub-nav-item[data-tab="${tab}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    const content = document.getElementById(`mgrTab_${tab}`);
    if (content) content.style.display = 'block';

    this.render();
  },

  render() {
    const state = window.stateStore.getState();

    // 1. Render SCR-MGR-01: Demand Determination Dashboard
    this.renderDemandBoard(state);

    // 2. Render SCR-MGR-02: Dish Quantity Calculation
    this.renderDishQuantities(state);

    // 3. Render SCR-MGR-03: Demand Changes Review Queue
    this.renderReviewQueue(state);

    // 4. Render SCR-MGR-04: Prep Plan
    this.renderPrepPlan(state);

    // 5. Render SCR-MGR-05: Prep Summary & Sign-off
    this.renderPrepSummary(state);
  },

  // SCR-MGR-01: Bảng tổng hợp nhu cầu suất ăn toàn trường
  renderDemandBoard(state) {
    // KPI metrics
    document.getElementById('kpiRegistered').textContent = state.demand.total_registered;
    document.getElementById('kpiAttended').textContent = state.demand.actual_attended;
    document.getElementById('kpiBufferPct').textContent = `${state.demand.buffer_percentage}%`;
    document.getElementById('kpiFinalHeadcount').textContent = state.demand.final_headcount;
    document.getElementById('bufferValueDisplay').textContent = `${state.demand.buffer_percentage}%`;

    // Calculation Method selector
    const methodCards = document.querySelectorAll('.method-card');
    methodCards.forEach(card => {
      const method = card.dataset.method;
      if (method === state.demand.calculation_method) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });

    // Submission Progress
    const confirmedCount = state.classes.filter(c => c.status === 'confirmed').length;
    const totalClasses = state.classes.length;
    const pct = Math.round((confirmedCount / totalClasses) * 100);

    const progressFill = document.getElementById('submissionProgressFill');
    if (progressFill) progressFill.style.width = `${pct}%`;

    const progressText = document.getElementById('submissionProgressText');
    if (progressText) progressText.textContent = `${confirmedCount}/${totalClasses} Lớp đã chốt (${pct}%)`;

    const chipsRow = document.getElementById('classChipsRow');
    if (chipsRow) {
      chipsRow.innerHTML = state.classes.map(c => `
        <span class="class-chip-status ${c.status}">
          <span>● ${c.name}</span>
          <span>(${c.status === 'confirmed' ? 'Đã chốt' : 'Đang điểm danh'})</span>
        </span>
      `).join('');
    }

    // Confirm button state
    const confirmBtn = document.getElementById('btnConfirmDemand');
    if (confirmBtn) {
      if (state.demand.status === 'confirmed') {
        confirmBtn.disabled = true;
        confirmBtn.className = 'btn btn-secondary';
        confirmBtn.innerHTML = `<span>✓ Nhu Cầu Đã Được Xác Nhận</span>`;
      } else {
        confirmBtn.disabled = false;
        confirmBtn.className = 'btn btn-primary btn-lg';
        confirmBtn.innerHTML = `<span>Xác Nhận Nhu Cầu Suất Ăn (${state.demand.final_headcount} Suất)</span>`;
      }
    }
  },

  selectMethod(method) {
    window.stateStore.setCalculationMethod(method);
    window.app.showToast(`Đã chuyển phương pháp tính: ${method}`);
    this.render();
  },

  confirmDemandAction() {
    window.stateStore.confirmDemand();
    window.app.showToast('Đã chốt tổng nhu cầu và chuyển định lượng sang nhà bếp (SCR-MGR-01)!');
    this.render();
  },

  // SCR-MGR-02: Bảng tính định lượng món ăn
  renderDishQuantities(state) {
    const tableBody = document.getElementById('dishQuantityTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = state.dish_quantities.map(dish => `
      <tr>
        <td>
          <div style="font-weight:700; color:var(--color-text-primary);">${dish.name}</div>
          <div style="font-size:0.775rem; color:var(--color-text-muted);">${dish.category}</div>
        </td>
        <td>
          <strong>${dish.standard_portion}</strong> ${dish.unit}/học sinh
        </td>
        <td>
          <strong style="color:#0284C7;">${dish.calculated_raw_qty}</strong> ${dish.unit}
        </td>
        <td>
          <input 
            type="number" 
            step="0.5" 
            class="table-input-number" 
            value="${dish.override_raw_qty}" 
            onchange="window.managerModule.updateDishOverride('${dish.id}', this.value)"
          >
          <span style="font-size:0.8rem; color:var(--color-text-secondary); margin-left:4px;">${dish.unit}</span>
        </td>
        <td>
          <strong style="color:var(--color-primary); font-size:1.05rem;">${dish.final_planned_qty}</strong> ${dish.unit}
        </td>
        <td>
          <input 
            type="text" 
            class="form-input" 
            style="padding:4px 8px; font-size:0.8rem;" 
            value="${dish.notes || ''}" 
            placeholder="Ghi chú điều chỉnh..."
            onchange="window.managerModule.updateDishNotes('${dish.id}', this.value)"
          >
        </td>
      </tr>
    `).join('');
  },

  updateDishOverride(dishId, value) {
    window.stateStore.overrideDishQuantity(dishId, value);
    window.app.showToast('Đã lưu điều chỉnh định lượng');
    this.render();
  },

  updateDishNotes(dishId, note) {
    const state = window.stateStore.getState();
    const dish = state.dish_quantities.find(d => d.id === dishId);
    if (dish) {
      dish.notes = note;
      window.stateStore.saveState();
    }
  },

  // SCR-MGR-03: Hàng đợi thẩm định yêu cầu thay đổi khẩn cấp
  renderReviewQueue(state) {
    const queueList = document.getElementById('emergencyQueueList');
    if (!queueList) return;

    if (state.emergency_changes.length === 0) {
      queueList.innerHTML = `<p style="color:var(--color-text-muted); padding:24px; text-align:center;">Không có yêu cầu khẩn cấp nào.</p>`;
      return;
    }

    queueList.innerHTML = state.emergency_changes.map(req => {
      let badgeClass = 'badge-warning';
      let statusLabel = 'Chờ thẩm định';
      if (req.status === 'approved') { badgeClass = 'badge-success'; statusLabel = 'Đã duyệt'; }
      if (req.status === 'rejected') { badgeClass = 'badge-danger'; statusLabel = 'Từ chối'; }

      const deltaText = req.delta_headcount > 0 ? `+${req.delta_headcount}` : `${req.delta_headcount}`;

      return `
        <div class="queue-card ${req.status}">
          <div class="queue-main">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge ${badgeClass}">${statusLabel}</span>
              <span style="font-weight:700; font-size:1.05rem;">${req.class_name} (Thay đổi: ${deltaText} suất)</span>
              <span style="font-size:0.775rem; color:var(--color-text-muted);">${req.submitted_at}</span>
            </div>
            <div style="font-size:0.875rem;">
              <strong>Lý do:</strong> "${req.reason}" • Người gửi: <strong>${req.requested_by}</strong>
            </div>
            <div style="font-size:0.825rem; color:#0284C7; background:#F0F9FF; padding:8px 12px; border-radius:6px; margin-top:4px;">
              ⚡ <strong>Tác động nhà bếp:</strong> ${req.kitchen_impact}
            </div>
            ${req.reviewed_by ? `
              <div style="font-size:0.775rem; color:var(--color-text-secondary); margin-top:4px;">
                Đã thẩm định bởi: <strong>${req.reviewed_by}</strong> lúc ${req.reviewed_at}
              </div>
            ` : ''}
          </div>

          <div class="queue-actions">
            ${req.status === 'pending' ? `
              <button class="btn btn-success btn-sm" onclick="window.managerModule.reviewRequest('${req.id}', 'approved')">
                ✓ Phê Duyệt (+${req.delta_headcount})
              </button>
              <button class="btn btn-danger btn-sm" onclick="window.managerModule.reviewRequest('${req.id}', 'rejected')">
                ✕ Từ Chối
              </button>
            ` : `
              <span style="font-size:0.85rem; font-weight:700; color:var(--color-text-muted);">Đã hoàn tất</span>
            `}
          </div>
        </div>
      `;
    }).join('');
  },

  reviewRequest(reqId, action) {
    window.stateStore.reviewEmergencyChange(reqId, action);
    window.app.showToast(`Đã ${action === 'approved' ? 'phê duyệt' : 'từ chối'} yêu cầu khẩn cấp!`);
    this.render();
  },

  // SCR-MGR-04: Kế hoạch chuẩn bị ca bếp
  renderPrepPlan(state) {
    const container = document.getElementById('prepPlanDetails');
    if (!container) return;

    container.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-bottom:20px;">
        <div class="kpi-card">
          <span class="kpi-label">Ca nấu</span>
          <span class="kpi-value" style="font-size:1.3rem;">${state.prep_plan.shift_name}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Bếp trưởng phụ trách</span>
          <span class="kpi-value" style="font-size:1.3rem;">${state.prep_plan.head_chef}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Thời gian bắt đầu</span>
          <span class="kpi-value" style="font-size:1.3rem;">${state.prep_plan.start_time}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Hạn hoàn thành chia cơm</span>
          <span class="kpi-value" style="font-size:1.3rem; color:var(--color-primary);">${state.prep_plan.target_completion_time}</span>
        </div>
      </div>
      <div class="data-table-card">
        <div style="padding:16px 20px; border-bottom:1px solid var(--color-border); font-weight:700;">
          Danh sách chỉ tiêu món ăn giao cho nhà bếp (5 món)
        </div>
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Món ăn</th>
                <th>Phân loại</th>
                <th>Chỉ tiêu định mức</th>
                <th>Trạng thái Kiosk</th>
              </tr>
            </thead>
            <tbody>
              ${state.dish_quantities.map(d => `
                <tr>
                  <td style="font-weight:700;">${d.name}</td>
                  <td>${d.category}</td>
                  <td style="font-weight:700; color:var(--color-primary);">${d.final_planned_qty} ${d.unit}</td>
                  <td><span class="badge badge-success">Đã đồng bộ Kiosk bếp</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // SCR-MGR-05: Nghiệm thu chế biến & Ký duyệt ca
  renderPrepSummary(state) {
    const auditTableBody = document.getElementById('auditSummaryTableBody');
    if (auditTableBody) {
      auditTableBody.innerHTML = state.verification_records.map(rec => `
        <tr>
          <td style="font-weight:700;">${rec.dish_name}</td>
          <td>${rec.planned_qty} ${rec.unit}</td>
          <td style="font-weight:700;">${rec.actual_qty} ${rec.unit}</td>
          <td>
            <span class="badge ${rec.is_acceptable ? 'badge-success' : 'badge-danger'}">
              ${rec.variance_percent} (${rec.variance > 0 ? '+' : ''}${rec.variance} ${rec.unit})
            </span>
          </td>
          <td>${rec.discrepancy_reason || 'Đạt tiêu chuẩn'}</td>
          <td style="font-size:0.775rem; color:var(--color-text-muted);">${rec.verified_by} (${rec.verified_at})</td>
        </tr>
      `).join('');
    }

    const signoffBox = document.getElementById('signoffAuditBox');
    if (signoffBox) {
      if (state.shift_audit.manager_signed) {
        signoffBox.innerHTML = `
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="font-size:2.5rem; color:var(--color-success);">✓</div>
            <div>
              <h4 style="color:#15803D;">Ca Nấu Đã Được Quản Lý Ký Duyệt Nghiệm Thu (SCR-MGR-05)</h4>
              <p style="font-size:0.85rem; color:var(--color-text-secondary); margin-top:4px;">
                Người ký: <strong>${state.shift_audit.manager_name}</strong> lúc <strong>${state.shift_audit.signed_at}</strong>
              </p>
              <p style="font-size:0.85rem; color:var(--color-text-secondary); margin-top:4px; font-style:italic;">
                Ý kiến kiểm tra: "${state.shift_audit.manager_notes}"
              </p>
            </div>
          </div>
        `;
      } else {
        signoffBox.innerHTML = `
          <div>
            <h4>Ký duyệt nghiệm thu ca chế biến</h4>
            <p style="font-size:0.85rem; color:var(--color-text-secondary); margin-bottom:12px;">
              Xác nhận số lượng, dung sai chênh lệch và chất lượng an toàn thực phẩm trước khi bàn giao suất ăn tới học sinh.
            </p>
            <div class="form-group">
              <input type="text" id="mgrSignNotes" class="form-input" placeholder="Ghi chú ý kiến kiểm tra an toàn thực phẩm...">
            </div>
            <button class="btn btn-primary" onclick="window.managerModule.executeSignOff()">
              ✍️ Ký Duyệt & Bàn Giao Suất Ăn
            </button>
          </div>
        `;
      }
    }
  },

  executeSignOff() {
    const input = document.getElementById('mgrSignNotes');
    const notes = input ? input.value : '';
    window.stateStore.signOffShiftAudit(notes);
    window.app.showToast('Đã ký duyệt nghiệm thu ca nấu và đóng ca thành công!');
    this.render();
  }
};
