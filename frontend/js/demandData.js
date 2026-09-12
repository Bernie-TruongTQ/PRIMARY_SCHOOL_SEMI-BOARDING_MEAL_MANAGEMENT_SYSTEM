// ==========================================================================
// DEMAND & QUANTITY MANAGEMENT MODULE — MOCK DATA
// Aligned with SQL schema: daily_meal_demands, expected_meal_quantities,
// meal_demand_change_requests, meal_demand_change_logs
// ==========================================================================

const DEMAND_DATA = {
  currentDate: "2026-09-12",
  displayDate: "Saturday, Sep 12, 2026",
  currentSession: "lunch",
  userRole: "kitchen", // 'kitchen' | 'teacher' | 'supervisor'

  sessions: {
    breakfast: { code: "breakfast", name: "Breakfast", window: "06:45 – 07:30", cutoffTime: "06:00", isLocked: true },
    lunch:     { code: "lunch",     name: "Lunch",     window: "11:15 – 12:30", cutoffTime: "08:30", isLocked: false, countdownMinutes: 38 },
    snack:     { code: "snack",     name: "Snack",     window: "14:30 – 15:15", cutoffTime: "13:00", isLocked: false, countdownMinutes: 296 }
  },

  // ── Screen 1: Determine Meal Demand ──────────────────────────────────────
  summary: {
    baseRegistered: 420,
    confirmedAttend: 396,
    absent: 20,
    extraGuests: 6
  },

  classes: [
    {
      id: 1, name: "Class 1A", grade: "Grade 1",
      teacher: "Ms. Le Thu Ha",
      base: 35, confirmed: 33, absent: 2, extra: 0,
      status: "confirmed", // 'draft' | 'confirmed' | 'locked'
      students: [
        { id: 101, name: "Nguyen An Binh",  status: "attend",      reportTime: "07:45", withinCutoff: true,  allergy: "" },
        { id: 102, name: "Tran Gia Bao",    status: "absent",      reportTime: "06:55", withinCutoff: true,  allergy: "", reason: "Fever, sick note provided" },
        { id: 103, name: "Pham Minh Chau",  status: "absent",      reportTime: "09:10", withinCutoff: false, allergy: "", reason: "Family dental visit — LATE" },
        { id: 104, name: "Hoang Duc Duy",   status: "attend",      reportTime: "07:30", withinCutoff: true,  allergy: "Peanuts (Strict)" },
        { id: 105, name: "Le Khanh Nhi",    status: "attend",      reportTime: "07:28", withinCutoff: true,  allergy: "" },
      ]
    },
    {
      id: 2, name: "Class 1B", grade: "Grade 1",
      teacher: "Ms. Vu Bich Ngoc",
      base: 35, confirmed: 35, absent: 0, extra: 1,
      status: "confirmed",
      students: [
        { id: 106, name: "Dang Tuan Kiet",  status: "attend",      reportTime: "07:20", withinCutoff: true,  allergy: "" },
        { id: 107, name: "Do Phuong Linh",  status: "attend",      reportTime: "07:22", withinCutoff: true,  allergy: "" },
        { id: 108, name: "Bui Xuan Truong", status: "extra_guest", reportTime: "07:55", withinCutoff: true,  allergy: "", reason: "Make-up meal (missed yesterday)" }
      ]
    },
    {
      id: 3, name: "Class 2A", grade: "Grade 2",
      teacher: "Mr. Pham Quang Dung",
      base: 36, confirmed: 33, absent: 3, extra: 1,
      status: "draft",
      students: [
        { id: 109, name: "Bui Thanh Mai",   status: "absent",      reportTime: "08:50", withinCutoff: false, allergy: "", reason: "Medical leave — LATE" },
        { id: 110, name: "Ngo Viet Anh",    status: "attend",      reportTime: "07:40", withinCutoff: true,  allergy: "Lactose sensitive" },
        { id: 111, name: "Tran Hong Hanh",  status: "absent",      reportTime: "07:50", withinCutoff: true,  allergy: "", reason: "School trip exemption" },
        { id: 112, name: "Le Cong Thanh",   status: "attend",      reportTime: "07:35", withinCutoff: true,  allergy: "" }
      ]
    },
    {
      id: 4, name: "Class 2B", grade: "Grade 2",
      teacher: "Ms. Hoang Yen Nhi",
      base: 36, confirmed: 36, absent: 0, extra: 0,
      status: "draft",
      students: [
        { id: 113, name: "Nguyen Thu Trang", status: "attend",     reportTime: "07:15", withinCutoff: true,  allergy: "" },
        { id: 114, name: "Pham Anh Tuan",    status: "attend",     reportTime: "07:18", withinCutoff: true,  allergy: "" }
      ]
    },
    {
      id: 5, name: "Class 3A", grade: "Grade 3",
      teacher: "Ms. Trinh My Duyen",
      base: 38, confirmed: 37, absent: 2, extra: 1,
      status: "confirmed",
      students: [
        { id: 115, name: "Vu Minh Khang",  status: "attend",      reportTime: "07:30", withinCutoff: true,  allergy: "" },
        { id: 116, name: "Le Thi Thu",     status: "absent",      reportTime: "07:45", withinCutoff: true,  allergy: "", reason: "Chicken pox, 3-day leave" }
      ]
    },
    {
      id: 6, name: "Class 3B", grade: "Grade 3",
      teacher: "Mr. Dinh The Vinh",
      base: 38, confirmed: 36, absent: 2, extra: 0,
      status: "draft",
      students: []
    },
    {
      id: 7, name: "Class 4A", grade: "Grade 4",
      teacher: "Ms. Nguyen Khanh Linh",
      base: 40, confirmed: 40, absent: 0, extra: 2,
      status: "confirmed",
      students: []
    },
    {
      id: 8, name: "Class 5A", grade: "Grade 5",
      teacher: "Mr. Vu Hoang Long",
      base: 42, confirmed: 42, absent: 0, extra: 1,
      status: "confirmed",
      students: []
    }
  ],

  // ── Screen 2: Expected Meal Quantity ─────────────────────────────────────
  menu: {
    name: "Saturday Nutritious Balanced Menu (Week 2)",
    totalHeadcount: 402, // confirmed + extra
    dishes: [
      {
        id: "d1", name: "Steamed Fragrant Jasmine Rice",
        category: "Staple Grain", icon: "rice",
        portionSize: 160, portionUnit: "g", unit: "kg",
        headcount: 402, bufferPct: 5, method: "auto",
        get totalQty() { return parseFloat(((this.headcount * this.portionSize * (1 + this.bufferPct / 100)) / 1000).toFixed(1)); }
      },
      {
        id: "d2", name: "Caramelized Braised Salmon & Pork Balls",
        category: "Main Protein", icon: "fish",
        portionSize: 95, portionUnit: "g", unit: "kg",
        headcount: 402, bufferPct: 5, method: "auto",
        get totalQty() { return parseFloat(((this.headcount * this.portionSize * (1 + this.bufferPct / 100)) / 1000).toFixed(1)); }
      },
      {
        id: "d3", name: "Kabocha Pumpkin & Minced Pork Broth",
        category: "Soup / Broth", icon: "soup",
        portionSize: 220, portionUnit: "ml", unit: "liters",
        headcount: 402, bufferPct: 5, method: "auto",
        get totalQty() { return parseFloat(((this.headcount * this.portionSize * (1 + this.bufferPct / 100)) / 1000).toFixed(1)); }
      },
      {
        id: "d4", name: "Stir-fried Bok Choy & Straw Mushrooms",
        category: "Vegetables", icon: "leaf",
        portionSize: 85, portionUnit: "g", unit: "kg",
        headcount: 402, bufferPct: 8, method: "manual",
        get totalQty() { return parseFloat(((this.headcount * this.portionSize * (1 + this.bufferPct / 100)) / 1000).toFixed(1)); }
      },
      {
        id: "d5", name: "Fresh Cavendish Banana & Probiotic Yogurt",
        category: "Dessert & Fruit", icon: "apple",
        portionSize: 1, portionUnit: "set", unit: "portions",
        headcount: 402, bufferPct: 5, method: "auto",
        get totalQty() { return Math.ceil(this.headcount * (1 + this.bufferPct / 100)); }
      }
    ]
  },

  // ── Screen 3: Manage Demand & Quantity Changes ───────────────────────────
  changeRequests: [
    {
      id: "cr-1",
      studentName: "Pham Minh Chau",
      className: "Class 1A",
      changeType: "absence",
      quantityDelta: -1,
      reason: "Family dental appointment — half-day leave, confirmed by parents via app.",
      requestedBy: "Ms. Le Thu Ha",
      requestedAt: "2026-09-12T09:10:00",
      isEmergency: true,
      approvalStatus: "pending",
      approvedBy: null, approvedAt: null
    },
    {
      id: "cr-2",
      studentName: "Bui Thanh Mai",
      className: "Class 2A",
      changeType: "absence",
      quantityDelta: -1,
      reason: "Medical leave — doctor certificate submitted late.",
      requestedBy: "Mr. Pham Quang Dung",
      requestedAt: "2026-09-12T08:50:00",
      isEmergency: true,
      approvalStatus: "pending",
      approvedBy: null, approvedAt: null
    },
    {
      id: "cr-3",
      studentName: null,
      className: "Class 4A",
      changeType: "extra_guest",
      quantityDelta: +2,
      reason: "Educational assessment panel visiting — 2 supervisors attending lunch with students.",
      requestedBy: "Ms. Nguyen Khanh Linh",
      requestedAt: "2026-09-12T07:30:00",
      isEmergency: false,
      approvalStatus: "approved",
      approvedBy: "Kitchen Manager (Chef Lan)", approvedAt: "2026-09-12T07:45:00"
    },
    {
      id: "cr-4",
      studentName: null,
      className: "Class 3B",
      changeType: "modify_quantity",
      quantityDelta: -3,
      reason: "3 students participating in inter-school science competition, returning after lunch period.",
      requestedBy: "Mr. Dinh The Vinh",
      requestedAt: "2026-09-12T07:20:00",
      isEmergency: false,
      approvalStatus: "approved",
      approvedBy: "Boarding Supervisor (Ms. Mai)", approvedAt: "2026-09-12T07:38:00"
    },
    {
      id: "cr-5",
      studentName: "Le Thi Thu",
      className: "Class 3A",
      changeType: "absence",
      quantityDelta: -1,
      reason: "Chicken pox confirmed, 3-day medical leave from parent note.",
      requestedBy: "Ms. Trinh My Duyen",
      requestedAt: "2026-09-12T07:45:00",
      isEmergency: false,
      approvalStatus: "rejected",
      approvedBy: "System (duplicate entry)", approvedAt: "2026-09-12T07:47:00"
    }
  ],

  changeLog: [
    {
      id: "log-1",
      changeRequestId: "cr-3",
      dailyDemandId: 4,
      fieldChanged: "extra_count",
      oldValue: "0",
      newValue: "2",
      changedBy: "Kitchen Manager (Chef Lan)",
      changedAt: "2026-09-12T07:45:00",
      note: "Approved guest addition for assessment panel."
    },
    {
      id: "log-2",
      changeRequestId: "cr-4",
      dailyDemandId: 6,
      fieldChanged: "confirmed_attend_count",
      oldValue: "38",
      newValue: "35",
      changedBy: "Boarding Supervisor (Ms. Mai)",
      changedAt: "2026-09-12T07:38:00",
      note: "Reduced by 3 for science competition participants."
    },
    {
      id: "log-3",
      changeRequestId: null,
      dailyDemandId: 1,
      fieldChanged: "absence_count",
      oldValue: "1",
      newValue: "2",
      changedBy: "Ms. Le Thu Ha",
      changedAt: "2026-09-12T07:25:00",
      note: "Added Tran Gia Bao — fever, parent called in."
    },
    {
      id: "log-4",
      changeRequestId: null,
      dailyDemandId: 2,
      fieldChanged: "extra_count",
      oldValue: "0",
      newValue: "1",
      changedBy: "Ms. Vu Bich Ngoc",
      changedAt: "2026-09-12T07:22:00",
      note: "Added make-up meal for Bui Xuan Truong."
    }
  ]
};
