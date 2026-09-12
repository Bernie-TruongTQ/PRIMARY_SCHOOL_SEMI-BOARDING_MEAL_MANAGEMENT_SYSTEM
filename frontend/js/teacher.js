/**
 * MODULE 1: TEACHER PORTAL LOGIC (SCR-TCH-01, 02, 03, 04)
 * Traceability: docs/04-information-architecture/task-flows.md (TF-01 & TF-03)
 */

window.teacherModule = {
  searchTerm: '',
  selectedFilter: 'all',
  editingStudentId: null,

  init() {
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('rosterSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.renderStudentList();
      });
    }

    // Filter chips
    const filterContainer = document.getElementById('rosterFilterGroup');
    if (filterContainer) {
      filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (btn) {
          filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedFilter = btn.dataset.filter;
          this.renderStudentList();
        }
      });
    }

    // Modal forms
    const amendForm = document.getElementById('amendParticipationForm');
    if (amendForm) {
      amendForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitAmendment();
      });
    }

    const emergencyForm = document.getElementById('emergencyRequestForm');
    if (emergencyForm) {
      emergencyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitEmergencyRequest();
      });
    }
  },

  render() {
    const state = window.stateStore.getState();
    const currentClass = state.classes.find(c => c.id === state.selectedClassId) || state.classes[0];

    // 1. Render Session Header
    const sessionHeader = document.getElementById('teacherSessionHeader');
    if (sessionHeader) {
      const isConfirmed = currentClass.status === 'confirmed';
      sessionHeader.innerHTML = `
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <span class="badge badge-screen-id">SCR-TCH-01</span>
            <span class="badge ${isConfirmed ? 'badge-success' : 'badge-warning'}">
              ${isConfirmed ? 'Đã Chốt Sĩ Số Sáng' : 'Đang Điểm Danh Lớp'}
            </span>
          </div>
          <h2 style="font-size:1.3rem;">Điểm Danh Bán Trú: ${currentClass.name}</h2>
          <div style="font-size:0.85rem; color:var(--color-text-secondary);">
            GVCN: <strong>${currentClass.teacher}</strong> • Sĩ số danh sách: <strong>${currentClass.total_students} học sinh</strong>
          </div>
        </div>
        <div class="cutoff-timer-box ${isConfirmed ? 'locked' : ''}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <div>
            <div>Giờ chốt suất ăn: <strong>${state.schedule.cutoff_time}</strong></div>
            <div style="font-size:0.75rem;">${isConfirmed ? 'Đã khóa sổ danh sách' : 'Còn 25 phút để chỉnh sửa'}</div>
          </div>
        </div>
      `;
    }

    // 2. Render Class Selection Ribbon
    const ribbon = document.getElementById('classSelectorRibbon');
    if (ribbon) {
      ribbon.innerHTML = state.classes.map(cls => `
        <button class="class-pill-btn ${cls.id === state.selectedClassId ? 'active' : ''}" onclick="window.teacherModule.selectClass('${cls.id}')">
          <span class="class-status-dot ${cls.status}"></span>
          <span>${cls.name}</span>
          <span style="font-size:0.725rem; opacity:0.8;">(${cls.status === 'confirmed' ? 'Đã chốt' : 'Mở'})</span>
        </button>
      `).join('');
    }

    // 3. Render Student Roster
    this.renderStudentList();

    // 4. Render Sticky Roster Summary
    this.renderRosterSummary();

    // 5. Render Audit Trail
    this.renderAuditTrail();
  },

  selectClass(classId) {
    window.stateStore.selectClass(classId);
    window.app.showToast(`Đã chuyển sang ${classId}`);
    this.render();
  },

  renderStudentList() {
    const state = window.stateStore.getState();
    const listEl = document.getElementById('studentRosterList');
    if (!listEl) return;

    let students = state.students.filter(s => s.class_id === state.selectedClassId);

    // Apply text search
    if (this.searchTerm) {
      students = students.filter(s =>
        s.name.toLowerCase().includes(this.searchTerm) ||
        s.code.toLowerCase().includes(this.searchTerm)
      );
    }

    // Apply status filter
    if (this.selectedFilter !== 'all') {
      students = students.filter(s => s.status === this.selectedFilter);
    }

    if (students.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding:36px; background:#fff; border-radius:12px; border:1px dashed var(--color-border);">
          <div style="font-size:1.8rem; margin-bottom:8px;">🔍</div>
          <p style="color:var(--color-text-secondary); font-weight:600;">Không tìm thấy học sinh phù hợp với bộ lọc.</p>
        </div>
      `;
      return;
    }

    const currentClass = state.classes.find(c => c.id === state.selectedClassId);
    const isLocked = currentClass && currentClass.status === 'confirmed';

    listEl.innerHTML = students.map((stu, index) => {
      let statusLabel = 'Ăn bán trú';
      let statusClass = 'btn-attended';
      if (stu.status === 'excused_absence') { statusLabel = 'Nghỉ có phép'; statusClass = 'btn-excused'; }
      if (stu.status === 'unexcused_absence') { statusLabel = 'Nghỉ không phép'; statusClass = 'btn-unexcused'; }
      if (stu.status === 'guest_meal') { statusLabel = 'Suất khách'; statusClass = 'btn-guest'; }

      return `
        <div class="student-card status-${stu.status}">
          <div class="student-info">
            <div class="student-name-row">
              <span style="font-size:0.8rem; color:var(--color-text-muted); font-weight:700;">#${index + 1}</span>
              <span class="student-name">${stu.name}</span>
              <span class="student-code">${stu.code}</span>
              ${stu.allergen && stu.allergen !== 'Không' ? `
                <span class="allergen-pill" title="Cảnh báo an toàn thực phẩm!">
                  ⚠️ ${stu.allergen}
                </span>
              ` : ''}
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:0.775rem; color:var(--color-text-secondary);">Giới tính: ${stu.gender}</span>
              ${stu.note ? `<span class="student-note">• ${stu.note}</span>` : ''}
            </div>
          </div>

          <div class="student-controls">
            ${isLocked ? `
              <span class="badge badge-neutral" title="Danh sách lớp đã chốt sổ, không thể đổi trực tiếp">
                🔒 ${statusLabel}
              </span>
            ` : `
              <button class="status-toggle-btn ${statusClass}" title="Bấm để chuyển nhanh trạng thái" onclick="window.teacherModule.toggleStatus('${stu.id}')">
                <span>●</span>
                <span>${statusLabel}</span>
              </button>
              <button class="btn btn-ghost btn-sm" title="Mở modal chỉnh sửa chi tiết và ghi lý do" onclick="window.teacherModule.openAmendModal('${stu.id}')">
                ✏️ Lý do
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  },

  renderRosterSummary() {
    const state = window.stateStore.getState();
    const students = state.students.filter(s => s.class_id === state.selectedClassId);
    const attended = students.filter(s => s.status === 'attended').length;
    const excused = students.filter(s => s.status === 'excused_absence').length;
    const unexcused = students.filter(s => s.status === 'unexcused_absence').length;
    const guest = students.filter(s => s.status === 'guest_meal').length;

    const summaryEl = document.getElementById('rosterSummaryCounts');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="count-chip green">
          <span>● Ăn: <strong>${attended}</strong></span>
        </div>
        <div class="count-chip orange">
          <span>● Phép: <strong>${excused}</strong></span>
        </div>
        <div class="count-chip red">
          <span>● K.Phép: <strong>${unexcused}</strong></span>
        </div>
        <div class="count-chip blue">
          <span>● Khách: <strong>${guest}</strong></span>
        </div>
        <div style="font-weight:700; border-left:1px solid var(--color-border); padding-left:12px;">
          Tổng suất đăng ký: <strong style="color:var(--color-primary); font-size:1.1rem;">${attended + guest}</strong>
        </div>
      `;
    }

    const currentClass = state.classes.find(c => c.id === state.selectedClassId);
    const lockBtn = document.getElementById('btnLockRoster');
    if (lockBtn && currentClass) {
      if (currentClass.status === 'confirmed') {
        lockBtn.disabled = true;
        lockBtn.innerHTML = `<span>✓ Lớp Đã Chốt Sổ</span>`;
        lockBtn.className = 'btn btn-secondary';
      } else {
        lockBtn.disabled = false;
        lockBtn.innerHTML = `<span>🔒 Chốt Sổ Sĩ Số (SCR-TCH-03)</span>`;
        lockBtn.className = 'btn btn-primary';
      }
    }
  },

  renderAuditTrail() {
    const state = window.stateStore.getState();
    const timelineEl = document.getElementById('teacherAuditTimeline');
    if (!timelineEl) return;

    const changes = state.participation_changes.slice(0, 5);
    if (changes.length === 0) {
      timelineEl.innerHTML = `<p style="font-size:0.8rem; color:var(--color-text-muted);">Chưa có thay đổi nào được ghi lại.</p>`;
      return;
    }

    timelineEl.innerHTML = changes.map(item => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div>
          <strong>${item.student_name}</strong>: 
          <span style="color:var(--color-text-muted); text-decoration:line-through;">${item.previous_status}</span>
          ➜ <span style="color:var(--color-success); font-weight:700;">${item.new_status}</span>
        </div>
        <div style="font-size:0.775rem; color:var(--color-text-secondary);">
          Lý do: "${item.reason}" (${item.change_category})
        </div>
        <div class="timeline-meta">${item.updated_at} • Bởi: ${item.updated_by}</div>
      </div>
    `).join('');
  },

  toggleStatus(studentId) {
    window.stateStore.toggleStudentStatus(studentId);
    window.app.showToast('Đã cập nhật trạng thái học sinh');
    this.render();
  },

  // SCR-TCH-02: Modal chỉnh sửa có lý do
  openAmendModal(studentId) {
    const state = window.stateStore.getState();
    const student = state.students.find(s => s.id === studentId);
    if (!student) return;

    this.editingStudentId = studentId;
    document.getElementById('amendStudentName').textContent = student.name;
    document.getElementById('amendStudentCode').textContent = student.code;
    document.getElementById('amendTargetStatus').value = student.status;
    document.getElementById('amendReason').value = student.note || '';

    window.app.openModal('modalAmendParticipation');
  },

  submitAmendment() {
    if (!this.editingStudentId) return;

    const newStatus = document.getElementById('amendTargetStatus').value;
    const category = document.getElementById('amendCategory').value;
    const reason = document.getElementById('amendReason').value.trim();

    if (!reason) {
      alert('Vui lòng nhập lý do điều chỉnh!');
      return;
    }

    window.stateStore.updateStudentParticipation(this.editingStudentId, newStatus, category, reason);
    window.app.closeModal('modalAmendParticipation');
    window.app.showToast('Đã lưu lý do điều chỉnh trạng thái vào nhật ký');
    this.render();
  },

  // SCR-TCH-03: Chốt sổ sĩ số lớp
  openLockConfirmationModal() {
    const state = window.stateStore.getState();
    const currentClass = state.classes.find(c => c.id === state.selectedClassId);
    const students = state.students.filter(s => s.class_id === state.selectedClassId);
    const totalMeals = students.filter(s => s.status === 'attended' || s.status === 'guest_meal').length;

    document.getElementById('confirmLockClassName').textContent = currentClass.name;
    document.getElementById('confirmLockTotalCount').textContent = `${totalMeals} suất ăn`;

    window.app.openModal('modalConfirmLockRoster');
  },

  executeLockRoster() {
    const state = window.stateStore.getState();
    window.stateStore.confirmClassRoster(state.selectedClassId);
    window.app.closeModal('modalConfirmLockRoster');
    window.app.showToast(`Đã chốt sổ sĩ số ${state.selectedClassId} thành công!`);
    this.render();
  },

  // SCR-TCH-04: Gửi yêu cầu đột xuất sau chốt sổ
  openEmergencyModal() {
    window.app.openModal('modalEmergencyRequest');
  },

  submitEmergencyRequest() {
    const state = window.stateStore.getState();
    const delta = document.getElementById('emgDeltaHeadcount').value;
    const reason = document.getElementById('emgReason').value.trim();

    if (!reason) {
      alert('Vui lòng nhập lý do yêu cầu khẩn cấp!');
      return;
    }

    window.stateStore.submitEmergencyChange(state.selectedClassId, delta, reason);
    window.app.closeModal('modalEmergencyRequest');
    window.app.showToast('Đã gửi yêu cầu thay đổi khẩn cấp tới Quản lý bếp (SCR-TCH-04)');
    document.getElementById('emergencyRequestForm').reset();
    this.render();
  }
};
