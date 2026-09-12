/**
 * Hệ thống Quản lý Bán trú Tiểu học - Central State Store
 * Traceability: Mapped to DB Entities in docs/06-database/schema.dbml
 * 100% Data Reactive across Module 1, 2, and 3
 */

const STORAGE_KEY = 'HOA_SEN_SEMI_BOARDING_STATE_V2';

// Dữ liệu ban đầu chuẩn theo DBML và Schema thực tế
const INITIAL_STATE = {
  activePortal: 'teacher', // 'teacher' | 'manager' | 'kitchen'
  activeTeacherTab: 'roster', // 'roster' | 'emergency'
  activeManagerTab: 'demand', // 'demand' | 'dishes' | 'queue' | 'prep_plan' | 'summary'
  activeKitchenTab: 'kiosk', // 'kiosk' | 'ingredients' | 'cooking' | 'verification'
  viewportMode: 'desktop', // 'mobile' | 'desktop'

  // Master Reference Data
  schedule: {
    id: 'SCH-20260912-LUNCH',
    date: '2026-09-12',
    meal_type: 'Bữa trưa',
    academic_year: '2026-2027',
    cutoff_time: '08:30:00',
    meal_serving_time: '11:15:00',
    school_name: 'Trường Tiểu học Bán trú Hoa Sen',
    is_locked: false
  },

  classes: [
    { id: 'CLS-1A', name: 'Lớp 1A', grade: 1, teacher: 'Cô Nguyễn Mai Hương', total_students: 35, status: 'in_progress' },
    { id: 'CLS-1B', name: 'Lớp 1B', grade: 1, teacher: 'Cô Trần Thanh Hà', total_students: 36, status: 'confirmed' },
    { id: 'CLS-2A', name: 'Lớp 2A', grade: 2, teacher: 'Thầy Lê Văn Tuấn', total_students: 34, status: 'confirmed' },
    { id: 'CLS-2B', name: 'Lớp 2B', grade: 2, teacher: 'Cô Phạm Bích Ngọc', total_students: 35, status: 'confirmed' },
    { id: 'CLS-3A', name: 'Lớp 3A', grade: 3, teacher: 'Cô Đỗ Thùy Linh', total_students: 36, status: 'in_progress' },
    { id: 'CLS-3B', name: 'Lớp 3B', grade: 3, teacher: 'Thầy Hoàng Quốc Bảo', total_students: 34, status: 'confirmed' }
  ],

  // Module 1: meal_participations
  selectedClassId: 'CLS-1A',
  students: [
    { id: 'STU-001', class_id: 'CLS-1A', code: 'HS101', name: 'Nguyễn Gia Bảo', gender: 'Nam', status: 'attended', allergen: 'Không', note: '' },
    { id: 'STU-002', class_id: 'CLS-1A', code: 'HS102', name: 'Trần Phương Linh', gender: 'Nữ', status: 'attended', allergen: 'Dị ứng lạc (đậu phộng)', note: 'Ăn suất riêng' },
    { id: 'STU-003', class_id: 'CLS-1A', code: 'HS103', name: 'Lê Minh Khôi', gender: 'Nam', status: 'excused_absence', allergen: 'Không', note: 'Phụ huynh xin nghỉ sốt virus' },
    { id: 'STU-004', class_id: 'CLS-1A', code: 'HS104', name: 'Phạm Quỳnh Chi', gender: 'Nữ', status: 'attended', allergen: 'Dị ứng hải sản', note: '' },
    { id: 'STU-005', class_id: 'CLS-1A', code: 'HS105', name: 'Vũ Đức An', gender: 'Nam', status: 'attended', allergen: 'Không', note: '' },
    { id: 'STU-006', class_id: 'CLS-1A', code: 'HS106', name: 'Đặng Ngọc Ánh', gender: 'Nữ', status: 'attended', allergen: 'Không', note: '' },
    { id: 'STU-007', class_id: 'CLS-1A', code: 'HS107', name: 'Bùi Tuấn Kiệt', gender: 'Nam', status: 'unexcused_absence', allergen: 'Không', note: 'Chưa liên lạc được phụ huynh' },
    { id: 'STU-008', class_id: 'CLS-1A', code: 'HS108', name: 'Hoàng Thùy Dung', gender: 'Nữ', status: 'attended', allergen: 'Không', note: '' },
    { id: 'STU-009', class_id: 'CLS-1A', code: 'HS109', name: 'Ngô Kiến Huy', gender: 'Nam', status: 'attended', allergen: 'Không', note: '' },
    { id: 'STU-010', class_id: 'CLS-1A', code: 'HS110', name: 'Đỗ Hà My', gender: 'Nữ', status: 'guest_meal', allergen: 'Không', note: 'Học sinh dự thính chuyển trường' },
    { id: 'STU-011', class_id: 'CLS-1A', code: 'HS111', name: 'Trịnh Quốc Trung', gender: 'Nam', status: 'attended', allergen: 'Không', note: '' },
    { id: 'STU-012', class_id: 'CLS-1A', code: 'HS112', name: 'Phan Bảo Trâm', gender: 'Nữ', status: 'attended', allergen: 'Không', note: '' }
  ],

  // Module 1: meal_participation_changes (Audit trail)
  participation_changes: [
    {
      id: 'CHG-001',
      student_id: 'STU-003',
      student_name: 'Lê Minh Khôi',
      class_id: 'CLS-1A',
      previous_status: 'attended',
      new_status: 'excused_absence',
      change_category: 'status_update',
      reason: 'Phụ huynh gọi điện báo sốt lúc 07:45',
      updated_by: 'Cô Nguyễn Mai Hương',
      updated_at: '2026-09-12 07:50:12'
    },
    {
      id: 'CHG-002',
      student_id: 'STU-010',
      student_name: 'Đỗ Hà My',
      class_id: 'CLS-1A',
      previous_status: 'unexcused_absence',
      new_status: 'guest_meal',
      change_category: 'correction',
      reason: 'Đăng ký suất ăn thử nghiệm sinh hoạt lớp',
      updated_by: 'Cô Nguyễn Mai Hương',
      updated_at: '2026-09-12 08:05:30'
    }
  ],

  // Module 2: meal_demands
  demand: {
    id: 'DMD-20260912',
    schedule_id: 'SCH-20260912-LUNCH',
    calculation_method: 'participation_based', // 'participation_based' | 'manual_forecast' | 'historical_average'
    total_registered: 210,
    actual_attended: 202,
    buffer_percentage: 3, // % dự phòng thức ăn
    final_headcount: 208, // 202 + 3% buffer làm tròn
    status: 'calculated', // 'draft' | 'calculated' | 'confirmed'
    confirmed_by: 'Quản lý Dinh dưỡng - Vũ Thu Phương',
    confirmed_at: '2026-09-12 08:35:00'
  },

  // Module 2: meal_demand_dish_quantities
  dish_quantities: [
    {
      id: 'DQ-01',
      dish_id: 'DSH-01',
      name: 'Cơm gạo tám thơm',
      category: 'Món chính tinh bột',
      standard_portion: 0.18, // kg / học sinh
      unit: 'kg',
      calculated_raw_qty: 37.4,
      override_raw_qty: 38.0,
      final_planned_qty: 38.0,
      notes: 'Tăng thêm 0.6kg vì học sinh khối 2 ăn khỏe'
    },
    {
      id: 'DQ-02',
      dish_id: 'DSH-02',
      name: 'Thịt lợn kho trứng cút',
      category: 'Món đạm mặn',
      standard_portion: 0.14,
      unit: 'kg',
      calculated_raw_qty: 29.1,
      override_raw_qty: 29.5,
      final_planned_qty: 29.5,
      notes: 'Bao gồm 15kg thịt mông sấn + 14.5kg trứng cút'
    },
    {
      id: 'DQ-03',
      dish_id: 'DSH-03',
      name: 'Canh rau ngót nấu thịt nạc băm',
      category: 'Món canh',
      standard_portion: 0.22,
      unit: 'kg/lít',
      calculated_raw_qty: 45.8,
      override_raw_qty: 46.0,
      final_planned_qty: 46.0,
      notes: 'Rau ngót hữu cơ sơ chế sạch'
    },
    {
      id: 'DQ-04',
      dish_id: 'DSH-04',
      name: 'Su su luộc chấm muối vừng',
      category: 'Món xào/luộc',
      standard_portion: 0.09,
      unit: 'kg',
      calculated_raw_qty: 18.7,
      override_raw_qty: 19.0,
      final_planned_qty: 19.0,
      notes: 'Su su tươi non gọt vỏ'
    },
    {
      id: 'DQ-05',
      dish_id: 'DSH-05',
      name: 'Chuối tiêu tráng miệng',
      category: 'Tráng miệng',
      standard_portion: 1.0,
      unit: 'quả',
      calculated_raw_qty: 208,
      override_raw_qty: 210,
      final_planned_qty: 210,
      notes: '1 quả/suất + 2 quả dự phòng'
    }
  ],

  // Module 2: meal_demand_changes (Emergency requests post-lock)
  emergency_changes: [
    {
      id: 'EMG-001',
      demand_id: 'DMD-20260912',
      class_id: 'CLS-1A',
      class_name: 'Lớp 1A',
      requested_by: 'Cô Nguyễn Mai Hương',
      delta_headcount: 1, // +1 suất
      reason: 'Có 1 học sinh đến muộn lúc 08:45 phụ huynh bổ sung phiếu ăn',
      status: 'pending', // 'pending' | 'approved' | 'rejected'
      kitchen_impact: 'Khả thi, đang dùng phần đệm dự phòng 3%',
      reviewed_by: null,
      reviewed_at: null,
      submitted_at: '2026-09-12 08:50:00'
    },
    {
      id: 'EMG-002',
      demand_id: 'DMD-20260912',
      class_id: 'CLS-3A',
      class_name: 'Lớp 3A',
      requested_by: 'Cô Đỗ Thùy Linh',
      delta_headcount: -2,
      reason: '2 học sinh về sớm tham gia đội tuyển cờ vua cấp quận',
      status: 'approved',
      kitchen_impact: 'Đã báo bếp giảm bớt 2 phần chia cơm khay',
      reviewed_by: 'Quản lý Vũ Thu Phương',
      reviewed_at: '2026-09-12 09:10:00',
      submitted_at: '2026-09-12 08:55:00'
    }
  ],

  // Module 3: meal_preparation_plans & ingredient_allocations
  prep_plan: {
    id: 'PRP-PLAN-20260912-01',
    shift_name: 'Ca Nấu Trưa Bán Trú',
    head_chef: 'Bếp trưởng Nguyễn Quốc Hưng',
    start_time: '08:45',
    target_completion_time: '10:45',
    status: 'cooking', // 'draft' | 'staged' | 'cooking' | 'verified' | 'closed'
    dishes_assigned: 5
  },

  ingredient_allocations: [
    { id: 'ING-01', name: 'Gạo tám thơm Hải Hậu', requested_qty: 38.0, unit: 'kg', actual_received_qty: 38.0, status: 'checked', storage_loc: 'Kho khô A1' },
    { id: 'ING-02', name: 'Thịt mông sấn tươi sạch', requested_qty: 15.0, unit: 'kg', actual_received_qty: 15.0, status: 'checked', storage_loc: 'Tủ mát bảo quản 0-4°C' },
    { id: 'ING-03', name: 'Trứng cút sạch đã luộc bóc vỏ', requested_qty: 14.5, unit: 'kg', actual_received_qty: 14.5, status: 'checked', storage_loc: 'Kho mát thực phẩm' },
    { id: 'ING-04', name: 'Rau ngót búp tươi hữu cơ', requested_qty: 12.0, unit: 'kg', actual_received_qty: 12.0, status: 'checked', storage_loc: 'Khu sơ chế rau củ' },
    { id: 'ING-05', name: 'Thịt nạc vai xay nhuyễn', requested_qty: 5.0, unit: 'kg', actual_received_qty: 5.0, status: 'checked', storage_loc: 'Tủ đông thực phẩm' },
    { id: 'ING-06', name: 'Su su non giống Sa Pa', requested_qty: 19.0, unit: 'kg', actual_received_qty: 19.0, status: 'checked', storage_loc: 'Kho rau củ quả' },
    { id: 'ING-07', name: 'Chuối tiêu tiêu chuẩn VietGAP', requested_qty: 210, unit: 'quả', actual_received_qty: 210, status: 'checked', storage_loc: 'Kho quả tráng miệng' }
  ],

  // Module 3: meal_preparations & meal_preparation_dish_records (Batches)
  cooking_batches: [
    {
      id: 'BTC-01',
      dish_name: 'Cơm gạo tám thơm',
      station: 'Tủ nấu cơm công nghiệp 24 khay',
      cook_name: 'Phụ bếp Trần Hữu Toàn',
      batch_number: 'Mẻ 1',
      status: 'completed', // 'waiting' | 'cooking' | 'completed'
      started_at: '09:00',
      finished_at: '09:50',
      target_yield: 38.0,
      actual_yield: 38.2,
      unit: 'kg'
    },
    {
      id: 'BTC-02',
      dish_name: 'Thịt lợn kho trứng cút',
      station: 'Chảo xào áp suất công nghiệp số 1',
      cook_name: 'Bếp trưởng Nguyễn Quốc Hưng',
      batch_number: 'Mẻ 1',
      status: 'cooking',
      started_at: '09:15',
      finished_at: null,
      target_yield: 29.5,
      actual_yield: 29.0,
      unit: 'kg'
    },
    {
      id: 'BTC-03',
      dish_name: 'Canh rau ngót nấu thịt nạc',
      station: 'Nồi nấu canh điện 100L',
      cook_name: 'Đầu bếp Hoàng Thị Lan',
      batch_number: 'Mẻ 1',
      status: 'cooking',
      started_at: '09:30',
      finished_at: null,
      target_yield: 46.0,
      actual_yield: 46.0,
      unit: 'kg/lít'
    },
    {
      id: 'BTC-04',
      dish_name: 'Su su luộc chấm muối vừng',
      station: 'Nồi luộc rau công nghiệp',
      cook_name: 'Phụ bếp Lê Kim Liên',
      batch_number: 'Mẻ 1',
      status: 'waiting',
      started_at: null,
      finished_at: null,
      target_yield: 19.0,
      actual_yield: 18.8,
      unit: 'kg'
    }
  ],

  // Module 3: prepared_quantity_confirmations (Verification & Sign-off)
  verification_records: [
    {
      dish_id: 'DSH-01',
      dish_name: 'Cơm gạo tám thơm',
      planned_qty: 38.0,
      actual_qty: 38.2,
      unit: 'kg',
      variance: 0.2,
      variance_percent: '+0.5%',
      is_acceptable: true,
      discrepancy_reason: 'Nở xốp tốt do gạo mới vụ',
      verified_by: 'Bếp trưởng Nguyễn Quốc Hưng',
      verified_at: '09:55'
    },
    {
      dish_id: 'DSH-02',
      dish_name: 'Thịt lợn kho trứng cút',
      planned_qty: 29.5,
      actual_qty: 29.0,
      unit: 'kg',
      variance: -0.5,
      variance_percent: '-1.7%',
      is_acceptable: true,
      discrepancy_reason: 'Hao hụt nước kho caramen cô đặc đạt độ sánh tiêu chuẩn',
      verified_by: 'Bếp trưởng Nguyễn Quốc Hưng',
      verified_at: '10:15'
    },
    {
      dish_id: 'DSH-03',
      dish_name: 'Canh rau ngót nấu thịt nạc băm',
      planned_qty: 46.0,
      actual_qty: 46.0,
      unit: 'kg/lít',
      variance: 0.0,
      variance_percent: '0.0%',
      is_acceptable: true,
      discrepancy_reason: 'Đạt chuẩn dung tích và độ ngọt tự nhiên',
      verified_by: 'Bếp trưởng Nguyễn Quốc Hưng',
      verified_at: '10:25'
    },
    {
      dish_id: 'DSH-04',
      dish_name: 'Su su luộc chấm muối vừng',
      planned_qty: 19.0,
      actual_qty: 18.8,
      unit: 'kg',
      variance: -0.2,
      variance_percent: '-1.1%',
      is_acceptable: true,
      discrepancy_reason: 'Loại bỏ xơ đuôi củ su su',
      verified_by: 'Bếp trưởng Nguyễn Quốc Hưng',
      verified_at: '10:20'
    },
    {
      dish_id: 'DSH-05',
      dish_name: 'Chuối tiêu tráng miệng',
      planned_qty: 210,
      actual_qty: 210,
      unit: 'quả',
      variance: 0,
      variance_percent: '0.0%',
      is_acceptable: true,
      discrepancy_reason: 'Đủ 210 quả chín đều',
      verified_by: 'Bếp trưởng Nguyễn Quốc Hưng',
      verified_at: '09:00'
    }
  ],

  // Module 3 & MGR Sign-off
  shift_audit: {
    manager_signed: true,
    manager_name: 'Quản lý Dinh dưỡng - Vũ Thu Phương',
    signed_at: '2026-09-12 10:35:00',
    manager_notes: 'Chất lượng cảm quan đạt chuẩn. Suất ăn an toàn vệ sinh, mâm mẫu lưu nghiệm 24h đầy đủ tại tủ lạnh lưu mẫu.'
  }
};

class StateStore {
  constructor() {
    this.subscribers = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not load stored state:', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error saving state:', e);
    }
    this.notify();
  }

  resetToInitial() {
    this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.saveState();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => {
      try {
        cb(this.state);
      } catch (err) {
        console.error('State subscriber error:', err);
      }
    });
  }

  getState() {
    return this.state;
  }

  // Setters
  setPortal(portal) {
    this.state.activePortal = portal;
    this.saveState();
  }

  setTeacherTab(tab) {
    this.state.activeTeacherTab = tab;
    this.saveState();
  }

  setManagerTab(tab) {
    this.state.activeManagerTab = tab;
    this.saveState();
  }

  setKitchenTab(tab) {
    this.state.activeKitchenTab = tab;
    this.saveState();
  }

  setViewportMode(mode) {
    this.state.viewportMode = mode;
    this.saveState();
  }

  selectClass(classId) {
    this.state.selectedClassId = classId;
    this.saveState();
  }

  // --- Module 1 Actions (Teacher) ---
  toggleStudentStatus(studentId) {
    const student = this.state.students.find(s => s.id === studentId);
    if (!student) return;

    // Chu trình: attended -> excused_absence -> unexcused_absence -> guest_meal -> attended
    const cycle = ['attended', 'excused_absence', 'unexcused_absence', 'guest_meal'];
    const curIdx = cycle.indexOf(student.status);
    const nextStatus = cycle[(curIdx + 1) % cycle.length];

    this.updateStudentParticipation(studentId, nextStatus, 'status_update', 'Thầy/Cô bấm chuyển nhanh trạng thái');
  }

  updateStudentParticipation(studentId, newStatus, category, reason) {
    const student = this.state.students.find(s => s.id === studentId);
    if (!student) return;

    const oldStatus = student.status;
    student.status = newStatus;

    // Ghi log vào meal_participation_changes
    const changeLog = {
      id: 'CHG-' + Date.now().toString().slice(-5),
      student_id: student.id,
      student_name: student.name,
      class_id: student.class_id,
      previous_status: oldStatus,
      new_status: newStatus,
      change_category: category || 'status_update',
      reason: reason || 'Cập nhật điểm danh',
      updated_by: 'Giáo viên Chủ nhiệm',
      updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.state.participation_changes.unshift(changeLog);

    // Tự động tính lại tổng sĩ số
    this.recalculateDemandHeadcount();
    this.saveState();
  }

  confirmClassRoster(classId) {
    const cls = this.state.classes.find(c => c.id === classId);
    if (cls) {
      cls.status = 'confirmed';
    }
    this.recalculateDemandHeadcount();
    this.saveState();
  }

  submitEmergencyChange(classId, delta, reason) {
    const cls = this.state.classes.find(c => c.id === classId) || { name: 'Lớp 1A' };
    const newReq = {
      id: 'EMG-' + Date.now().toString().slice(-4),
      demand_id: this.state.demand.id,
      class_id: classId,
      class_name: cls.name,
      requested_by: cls.teacher || 'Giáo viên Chủ nhiệm',
      delta_headcount: parseInt(delta, 10),
      reason: reason,
      status: 'pending',
      kitchen_impact: delta > 0 ? `Cần thêm ${delta} suất ăn từ phần đệm dự phòng` : `Giảm bớt ${Math.abs(delta)} phần khay ăn`,
      reviewed_by: null,
      reviewed_at: null,
      submitted_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.state.emergency_changes.unshift(newReq);
    this.saveState();
  }

  // --- Module 2 Actions (Manager) ---
  setCalculationMethod(method) {
    this.state.demand.calculation_method = method;
    this.recalculateDemandHeadcount();
    this.saveState();
  }

  setBufferPercentage(pct) {
    this.state.demand.buffer_percentage = Math.max(0, Math.min(20, pct));
    this.recalculateDemandHeadcount();
    this.saveState();
  }

  recalculateDemandHeadcount() {
    // Sĩ số lớp 1A thực tế
    const attendedIn1A = this.state.students.filter(s => s.status === 'attended' || s.status === 'guest_meal').length;
    // Cộng các lớp khác đã chốt
    const otherClassesAttended = 34 + 32 + 35 + 34 + 33; // các lớp khác
    const totalAttended = attendedIn1A + otherClassesAttended;

    this.state.demand.actual_attended = totalAttended;

    let base = totalAttended;
    if (this.state.demand.calculation_method === 'manual_forecast') {
      base = this.state.demand.total_registered; // 210
    } else if (this.state.demand.calculation_method === 'historical_average') {
      base = 205; // Trung bình 7 ngày
    }

    const bufferMultiplier = 1 + (this.state.demand.buffer_percentage / 100);
    this.state.demand.final_headcount = Math.round(base * bufferMultiplier);

    // Tự động tính lại định lượng các món
    this.state.dish_quantities.forEach(dish => {
      const calculated = parseFloat((this.state.demand.final_headcount * dish.standard_portion).toFixed(1));
      dish.calculated_raw_qty = calculated;
      if (!dish.override_raw_qty) {
        dish.final_planned_qty = calculated;
      } else {
        dish.final_planned_qty = dish.override_raw_qty;
      }
    });
  }

  overrideDishQuantity(dishId, newQty, reason) {
    const dish = this.state.dish_quantities.find(d => d.id === dishId);
    if (dish) {
      dish.override_raw_qty = parseFloat(newQty);
      dish.final_planned_qty = parseFloat(newQty);
      if (reason) dish.notes = reason;
      this.saveState();
    }
  }

  confirmDemand() {
    this.state.demand.status = 'confirmed';
    this.state.demand.confirmed_at = new Date().toISOString().replace('T', ' ').slice(0, 19);
    this.saveState();
  }

  reviewEmergencyChange(reqId, action, reviewNotes) {
    const req = this.state.emergency_changes.find(r => r.id === reqId);
    if (!req) return;

    req.status = action; // 'approved' | 'rejected'
    req.reviewed_by = 'Quản lý Vũ Thu Phương';
    req.reviewed_at = new Date().toISOString().replace('T', ' ').slice(0, 19);
    if (reviewNotes) req.review_notes = reviewNotes;

    if (action === 'approved') {
      this.state.demand.final_headcount += req.delta_headcount;
      this.recalculateDemandHeadcount();
    }
    this.saveState();
  }

  // --- Module 3 Actions (Kitchen) ---
  toggleIngredientCheck(ingId) {
    const item = this.state.ingredient_allocations.find(i => i.id === ingId);
    if (item) {
      item.status = item.status === 'checked' ? 'pending' : 'checked';
      this.saveState();
    }
  }

  reportIngredientShortage(ingId, actualQty) {
    const item = this.state.ingredient_allocations.find(i => i.id === ingId);
    if (item) {
      item.actual_received_qty = parseFloat(actualQty);
      item.status = item.actual_received_qty < item.requested_qty ? 'shortage' : 'checked';
      this.saveState();
    }
  }

  startCookingBatch(batchId) {
    const batch = this.state.cooking_batches.find(b => b.id === batchId);
    if (batch) {
      batch.status = 'cooking';
      const now = new Date();
      batch.started_at = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      this.saveState();
    }
  }

  completeCookingBatch(batchId, actualYield) {
    const batch = this.state.cooking_batches.find(b => b.id === batchId);
    if (batch) {
      batch.status = 'completed';
      const now = new Date();
      batch.finished_at = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (actualYield) {
        batch.actual_yield = parseFloat(actualYield);
      }
      this.saveState();
    }
  }

  updateVerification(dishId, actualQty, reason) {
    const rec = this.state.verification_records.find(r => r.dish_id === dishId);
    if (rec) {
      rec.actual_qty = parseFloat(actualQty);
      rec.variance = parseFloat((rec.actual_qty - rec.planned_qty).toFixed(1));
      const pct = ((rec.variance / rec.planned_qty) * 100).toFixed(1);
      rec.variance_percent = (pct > 0 ? '+' : '') + pct + '%';
      rec.is_acceptable = Math.abs(parseFloat(pct)) <= 5.0; // Dung sai cho phép +/- 5%
      rec.discrepancy_reason = reason || rec.discrepancy_reason;
      rec.verified_at = new Date().toISOString().replace('T', ' ').slice(11, 16);
      this.saveState();
    }
  }

  signOffShiftAudit(managerNotes) {
    this.state.shift_audit = {
      manager_signed: true,
      manager_name: 'Quản lý Dinh dưỡng - Vũ Thu Phương',
      signed_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      manager_notes: managerNotes || 'Đã kiểm tra định lượng, cảm quan và an toàn thực phẩm. Cho phép bàn giao suất ăn tới các lớp.'
    };
    this.state.prep_plan.status = 'closed';
    this.saveState();
  }
}

// Global Singleton
window.stateStore = new StateStore();
