/**
 * MODULE 3: KITCHEN KIOSK PORTAL LOGIC (SCR-KIT-01, 02, 03, 04)
 * Traceability: docs/04-information-architecture/task-flows.md (TF-04 & TF-05)
 */

window.kitchenModule = {
  activeTimerInterval: null,

  init() {
    this.render();
    this.bindEvents();
    this.startClock();
  },

  startClock() {
    const clockEl = document.getElementById('kioskLiveClock');
    const update = () => {
      if (clockEl) {
        const d = new Date();
        clockEl.textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
      }
    };
    update();
    setInterval(update, 1000);
  },

  bindEvents() {
    const navBar = document.getElementById('kitchenSubNav');
    if (navBar) {
      navBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.sub-nav-item');
        if (btn) {
          const tab = btn.dataset.tab;
          window.stateStore.setKitchenTab(tab);
          this.switchTab(tab);
        }
      });
    }
  },

  switchTab(tab) {
    document.querySelectorAll('.kitchen-tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('#kitchenSubNav .sub-nav-item').forEach(b => b.classList.remove('active'));

    const activeBtn = document.querySelector(`#kitchenSubNav .sub-nav-item[data-tab="${tab}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    const content = document.getElementById(`kitTab_${tab}`);
    if (content) content.style.display = 'block';

    this.render();
  },

  render() {
    const state = window.stateStore.getState();

    // 1. Render SCR-KIT-01: Kiosk Wallboard
    this.renderKioskWallboard(state);

    // 2. Render SCR-KIT-02: Ingredient Checklist
    this.renderIngredientChecklist(state);

    // 3. Render SCR-KIT-03: Cooking Batches
    this.renderCookingBatches(state);

    // 4. Render SCR-KIT-04: Quantity Verification
    this.renderVerification(state);
  },

  // SCR-KIT-01: Kiosk Kế hoạch ca bếp
  renderKioskWallboard(state) {
    const container = document.getElementById('kioskDishesContainer');
    if (!container) return;

    container.innerHTML = state.dish_quantities.map(dish => {
      const isDone = state.verification_records.find(v => v.dish_id === dish.id);
      return `
        <div class="dish-kiosk-card ${isDone ? 'status-completed' : ''}">
          <div>
            <div class="dish-kiosk-header">
              <span class="badge badge-screen-id">SCR-KIT-01</span>
              <span class="badge ${isDone ? 'badge-success' : 'badge-warning'}">
                ${isDone ? '✓ Đã nấu xong' : 'Đang chế biến'}
              </span>
            </div>
            <div class="dish-kiosk-name" style="margin-top:10px;">${dish.name}</div>
            <div style="font-size:0.85rem; color:var(--color-text-secondary); margin-top:4px;">${dish.category}</div>
          </div>

          <div style="background:#F8FAFC; padding:12px 16px; border-radius:12px; border:1px solid var(--color-border);">
            <div style="font-size:0.75rem; color:var(--color-text-muted); font-weight:700; text-transform:uppercase;">
              Chỉ tiêu suất ăn ca trưa
            </div>
            <div class="dish-kiosk-metric">
              <span class="dish-target-qty">${dish.final_planned_qty}</span>
              <span class="dish-unit">${dish.unit}</span>
              <span style="font-size:0.775rem; color:var(--color-text-secondary); margin-left:auto;">
                (${state.demand.final_headcount} suất)
              </span>
            </div>
          </div>

          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="window.kitchenModule.switchTab('cooking')">
              🍳 Trạm nấu
            </button>
            <button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.kitchenModule.switchTab('verification')">
              ⚖️ Cân nghiệm thu
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  // SCR-KIT-02: Bảng kiểm nhận nguyên liệu từ kho
  renderIngredientChecklist(state) {
    const container = document.getElementById('ingredientChecklistContainer');
    if (!container) return;

    container.innerHTML = state.ingredient_allocations.map(item => `
      <div class="ingredient-row-card ${item.status}">
        <div class="ing-name-group">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge badge-screen-id">SCR-KIT-02</span>
            <span style="font-weight:800; font-size:1.05rem;">${item.name}</span>
            <span class="badge ${item.status === 'checked' ? 'badge-success' : (item.status === 'shortage' ? 'badge-danger' : 'badge-warning')}">
              ${item.status === 'checked' ? '✓ Đã nhận đủ' : (item.status === 'shortage' ? '⚠️ Thiếu hụt' : 'Chờ nhận')}
            </span>
          </div>
          <div class="ing-loc-tag">Vị trí lấy: <strong>${item.storage_loc}</strong></div>
        </div>

        <div style="display:flex; align-items:center; gap:16px;">
          <div style="text-align:right;">
            <div style="font-size:0.75rem; color:var(--color-text-muted);">Yêu cầu / Thực nhận</div>
            <div style="font-weight:800; font-size:1.1rem; color:var(--color-text-primary);">
              ${item.requested_qty} ${item.unit} / 
              <span style="color:var(--color-primary);">${item.actual_received_qty} ${item.unit}</span>
            </div>
          </div>

          <div style="display:flex; gap:8px;">
            <button class="btn ${item.status === 'checked' ? 'btn-success' : 'btn-secondary'} btn-sm" onclick="window.kitchenModule.toggleIngCheck('${item.id}')">
              ${item.status === 'checked' ? '✓ Đủ cân' : 'Xác nhận đủ'}
            </button>
            <button class="btn btn-danger btn-sm" onclick="window.kitchenModule.openShortagePrompt('${item.id}', ${item.requested_qty})">
              Báo thiếu
            </button>
          </div>
        </div>
      </div>
    `).join('');
  },

  toggleIngCheck(ingId) {
    window.stateStore.toggleIngredientCheck(ingId);
    window.app.showToast('Đã cập nhật trạng thái kiểm nhận nguyên liệu');
    this.render();
  },

  openShortagePrompt(ingId, reqQty) {
    const val = prompt(`Nhập số lượng thực tế nhận được (Yêu cầu: ${reqQty}):`, reqQty);
    if (val !== null && !isNaN(val)) {
      window.stateStore.reportIngredientShortage(ingId, val);
      window.app.showToast('Đã ghi nhận báo thiếu hụt nguyên liệu xuất kho');
      this.render();
    }
  },

  // SCR-KIT-03: Trạm nấu & Mẻ nấu
  renderCookingBatches(state) {
    const container = document.getElementById('cookingBatchesContainer');
    if (!container) return;

    container.innerHTML = state.cooking_batches.map(batch => {
      const isCooking = batch.status === 'cooking';
      const isDone = batch.status === 'completed';

      return `
        <div class="batch-station-card">
          <div class="batch-station-header">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="badge badge-screen-id">SCR-KIT-03</span>
              <span class="station-pill">${batch.station}</span>
              <span class="badge ${isDone ? 'badge-success' : (isCooking ? 'badge-primary' : 'badge-warning')}">
                ${isDone ? 'Hoàn thành mẻ' : (isCooking ? 'Đang đun nấu' : 'Chờ bắt đầu')}
              </span>
            </div>
            <div style="font-size:0.85rem; color:var(--color-text-secondary);">
              Người nấu: <strong>${batch.cook_name}</strong>
            </div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;">
            <div>
              <h3 style="font-size:1.25rem;">${batch.dish_name} - ${batch.batch_number}</h3>
              <div style="font-size:0.85rem; color:var(--color-text-secondary); margin-top:4px;">
                Mục tiêu mẻ: <strong>${batch.target_yield} ${batch.unit}</strong> • 
                Bắt đầu: <strong>${batch.started_at || '--:--'}</strong> • 
                Hoàn thành: <strong>${batch.finished_at || '--:--'}</strong>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:12px;">
              ${isCooking ? `
                <div class="timer-display">🔥 42:15</div>
                <button class="btn btn-success btn-lg" onclick="window.kitchenModule.finishBatch('${batch.id}', ${batch.target_yield})">
                  ✓ Xong mẻ & Cân (${batch.unit})
                </button>
              ` : (isDone ? `
                <div style="text-align:right;">
                  <div style="font-size:0.75rem; color:var(--color-text-muted);">Thành phẩm thực tế</div>
                  <div style="font-size:1.3rem; font-weight:800; color:var(--color-success);">${batch.actual_yield} ${batch.unit}</div>
                </div>
              ` : `
                <button class="btn btn-primary btn-lg" onclick="window.kitchenModule.startBatch('${batch.id}')">
                  ▶ Bắt Đầu Nấu
                </button>
              `)}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  startBatch(batchId) {
    window.stateStore.startCookingBatch(batchId);
    window.app.showToast('Đã bắt đầu bấm giờ mẻ nấu!');
    this.render();
  },

  finishBatch(batchId, defaultYield) {
    const val = prompt('Nhập khối lượng thành phẩm cân thực tế tại bếp:', defaultYield);
    if (val !== null && !isNaN(val)) {
      window.stateStore.completeCookingBatch(batchId, val);
      window.app.showToast('Đã ghi nhận hoàn thành mẻ nấu!');
      this.render();
    }
  },

  // SCR-KIT-04: Cân nghiệm thu thành phẩm & Soát chênh lệch
  renderVerification(state) {
    const container = document.getElementById('verificationContainer');
    if (!container) return;

    container.innerHTML = state.verification_records.map(rec => {
      const isPass = rec.is_acceptable;

      return `
        <div class="verification-card">
          <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                <span class="badge badge-screen-id">SCR-KIT-04</span>
                <span class="badge ${isPass ? 'badge-success' : 'badge-danger'}">
                  ${isPass ? '✓ Dung sai đạt chuẩn (<= 5%)' : '⚠️ Vượt dung sai quy định!'}
                </span>
              </div>
              <h3 style="font-size:1.2rem;">${rec.dish_name}</h3>
            </div>

            <div style="display:flex; align-items:center; gap:20px;">
              <div style="text-align:right;">
                <div style="font-size:0.75rem; color:var(--color-text-muted);">Kế hoạch</div>
                <div style="font-size:1.1rem; font-weight:700;">${rec.planned_qty} ${rec.unit}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:0.75rem; color:var(--color-text-muted);">Cân thực tế</div>
                <input 
                  type="number" 
                  step="0.1" 
                  class="table-input-number" 
                  value="${rec.actual_qty}" 
                  onchange="window.kitchenModule.updateActualWeight('${rec.dish_id}', this.value)"
                >
                <span style="font-size:0.8rem; font-weight:600;">${rec.unit}</span>
              </div>
            </div>
          </div>

          <div class="variance-meter ${isPass ? 'pass' : 'alert'}">
            <span class="variance-badge">${rec.variance_percent}</span>
            <div style="flex:1; font-size:0.85rem;">
              Chênh lệch khối lượng: <strong>${rec.variance > 0 ? '+' : ''}${rec.variance} ${rec.unit}</strong>.
              ${isPass ? 'Nằm trong ngưỡng sai số nhiệt học và tỷ lệ nước cho phép.' : 'Cần giải trình nguyên nhân với Quản lý dinh dưỡng!'}
            </div>
          </div>

          <div style="margin-top:14px; display:flex; align-items:center; gap:12px;">
            <label style="font-size:0.85rem; font-weight:600; white-space:nowrap;">Lý do chênh lệch:</label>
            <input 
              type="text" 
              class="form-input" 
              style="padding:6px 12px; font-size:0.85rem;" 
              value="${rec.discrepancy_reason || ''}" 
              placeholder="Nhập nguyên nhân hao hụt hoặc dôi dư..."
              onchange="window.kitchenModule.updateReason('${rec.dish_id}', this.value)"
            >
          </div>
        </div>
      `;
    }).join('');
  },

  updateActualWeight(dishId, val) {
    window.stateStore.updateVerification(dishId, val);
    window.app.showToast('Đã tính toán lại dung sai chênh lệch');
    this.render();
  },

  updateReason(dishId, reason) {
    const state = window.stateStore.getState();
    const rec = state.verification_records.find(r => r.dish_id === dishId);
    if (rec) {
      window.stateStore.updateVerification(dishId, rec.actual_qty, reason);
      window.app.showToast('Đã lưu lý do giải trình');
    }
  }
};
