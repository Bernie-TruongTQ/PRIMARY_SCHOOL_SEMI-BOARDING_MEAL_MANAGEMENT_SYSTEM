/**
 * MASTER APPLICATION ORCHESTRATOR
 * Handles Role / Portal routing, Viewport simulation, Toasts, and State Subscriptions
 */

window.app = {
  init() {
    console.log('Hoa Sen Semi-Boarding System UI initializing...');

    // 1. Initialize Modules
    window.teacherModule.init();
    window.managerModule.init();
    window.kitchenModule.init();

    // 2. Bind Shell Controls
    this.bindPortalSwitcher();
    this.bindViewportControls();
    this.bindModalListeners();

    // 3. Subscribe to State Changes
    window.stateStore.subscribe((state) => {
      this.syncUIWithState(state);
    });

    // 4. Initial Sync
    this.syncUIWithState(window.stateStore.getState());
  },

  bindPortalSwitcher() {
    const portalSwitcher = document.getElementById('portalSwitcher');
    if (portalSwitcher) {
      portalSwitcher.addEventListener('click', (e) => {
        const btn = e.target.closest('.portal-nav-btn');
        if (btn) {
          const targetPortal = btn.dataset.portal;
          this.switchPortal(targetPortal);
        }
      });
    }
  },

  switchPortal(portal) {
    window.stateStore.setPortal(portal);

    // Update buttons
    document.querySelectorAll('#portalSwitcher .portal-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.portal === portal);
    });

    // Toggle sections
    document.querySelectorAll('.portal-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const activeSec = document.getElementById(`portal_${portal}`);
    if (activeSec) {
      activeSec.classList.add('active');
    }

    // Auto-adjust default viewport depending on role if desired:
    // Teachers usually on mobile; kitchen kiosk & manager on desktop/tablet
    if (portal === 'teacher' && window.stateStore.getState().viewportMode === 'mobile') {
      this.setViewport('mobile');
    }

    this.showToast(`Đã chuyển sang giao diện: ${this.getPortalLabel(portal)}`);
  },

  getPortalLabel(portal) {
    switch (portal) {
      case 'teacher': return 'Giáo viên (Module 1: Điểm danh)';
      case 'manager': return 'Quản lý Dinh dưỡng (Module 2: Nhu cầu & Định lượng)';
      case 'kitchen': return 'Kiosk Nhà bếp (Module 3: Chế biến & Nghiệm thu)';
      default: return portal;
    }
  },

  bindViewportControls() {
    const btnMobile = document.getElementById('btnViewMobile');
    const btnDesktop = document.getElementById('btnViewDesktop');

    if (btnMobile) {
      btnMobile.addEventListener('click', () => this.setViewport('mobile'));
    }
    if (btnDesktop) {
      btnDesktop.addEventListener('click', () => this.setViewport('desktop'));
    }
  },

  setViewport(mode) {
    window.stateStore.setViewportMode(mode);
    const container = document.getElementById('appContainer');
    const btnMobile = document.getElementById('btnViewMobile');
    const btnDesktop = document.getElementById('btnViewDesktop');

    if (mode === 'mobile') {
      container.classList.add('mode-mobile');
      container.classList.remove('mode-desktop');
      btnMobile.classList.add('active');
      btnDesktop.classList.remove('active');
    } else {
      container.classList.remove('mode-mobile');
      container.classList.add('mode-desktop');
      btnMobile.classList.remove('active');
      btnDesktop.classList.add('active');
    }
  },

  bindModalListeners() {
    // Backdrop click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      }
    });
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  },

  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : (type === 'danger' ? '⚠️' : 'ℹ️')}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  resetData() {
    if (confirm('Bạn có chắc muốn khôi phục toàn bộ dữ liệu về trạng thái mẫu ban đầu?')) {
      window.stateStore.resetToInitial();
      this.showToast('Đã khôi phục dữ liệu mẫu thành công!');
      setTimeout(() => location.reload(), 300);
    }
  },

  syncUIWithState(state) {
    // Sync portal switcher buttons
    document.querySelectorAll('#portalSwitcher .portal-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.portal === state.activePortal);
    });

    // Sync portal section visibility
    document.querySelectorAll('.portal-section').forEach(sec => {
      sec.classList.remove('active');
    });
    const activeSec = document.getElementById(`portal_${state.activePortal}`);
    if (activeSec) activeSec.classList.add('active');

    // Sync viewport mode
    const container = document.getElementById('appContainer');
    if (state.viewportMode === 'mobile') {
      container.classList.add('mode-mobile');
      container.classList.remove('mode-desktop');
      document.getElementById('btnViewMobile')?.classList.add('active');
      document.getElementById('btnViewDesktop')?.classList.remove('active');
    } else {
      container.classList.remove('mode-mobile');
      container.classList.add('mode-desktop');
      document.getElementById('btnViewMobile')?.classList.remove('active');
      document.getElementById('btnViewDesktop')?.classList.add('active');
    }
  }
};

// Document ready bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
