// Mock data for Primary School Semi-Boarding Meal Operation System
// Grounded in the SQL schema: meal_sessions, classes, students, daily_meal_demands, expected_meal_quantities, etc.

const MOCK_DATA = {
  currentDate: "2026-09-11",
  activeSession: "lunch",
  userRole: "kitchen", // 'kitchen' | 'teacher' | 'supervisor'
  
  schoolInfo: {
    name: "Hoa Sen Primary School",
    subName: "Semi-Boarding Dining Operation Center",
    academicYear: "2026 - 2027",
    kitchenManager: "Head Chef Tran Lan",
    leadSupervisor: "Ms. Nguyen Mai"
  },

  sessions: {
    breakfast: {
      code: "breakfast",
      name: "Breakfast",
      timeWindow: "06:45 - 07:30",
      cutoffTime: "06:00",
      isLocked: true,
      cutoffMessage: "Locked at 06:00 AM",
      menuName: "Warm Rice Congee with Minced Pork & Quail Eggs"
    },
    lunch: {
      code: "lunch",
      name: "Lunch (Main Meal)",
      timeWindow: "11:15 - 12:30",
      cutoffTime: "08:30",
      isLocked: false,
      cutoffCountdown: "Cutoff in 42 mins (08:30 AM)",
      cutoffMessage: "Open for changes until 08:30 AM",
      menuName: "Thursday Nutritious Standard Menu (Week 2)"
    },
    snack: {
      code: "snack",
      name: "Afternoon Snack",
      timeWindow: "14:30 - 15:15",
      cutoffTime: "13:00",
      isLocked: false,
      cutoffCountdown: "Cutoff at 01:00 PM",
      cutoffMessage: "Open for changes until 01:00 PM",
      menuName: "Warm Soy Pudding & Mung Bean Pastry"
    }
  },

  // Daily Demand Summary across all classes for Lunch
  demandSummary: {
    registeredStudents: 420,
    confirmedAttend: 408,
    absent: 16,
    extraGuests: 4, // Teachers / visiting monitors
    determinationStatus: "confirmed", // 'draft' | 'confirmed' | 'locked'
    totalHeadcount: 412 // confirmedAttend + extraGuests
  },

  // Class breakdown
  classes: [
    {
      id: 1,
      name: "Class 1A",
      grade: "Grade 1",
      teacher: "Ms. Le Thu Ha",
      registered: 35,
      confirmed: 33,
      absent: 2,
      extra: 0,
      status: "delivered", // 'pending' | 'delivered' | 'confirmed'
      deliveryTime: "10:55 AM",
      deliveredBy: "Nguyen Van Minh (Kitchen Staff)",
      receivedBy: "Ms. Le Thu Ha (Homeroom Teacher)",
      notes: "1 student with peanut allergy (provided separate safe meal tray)",
      studentsList: [
        { id: 101, name: "Nguyen An Binh", status: "attend", allergy: "None" },
        { id: 102, name: "Tran Gia Bao", status: "absent", reason: "Fever / Sick note" },
        { id: 103, name: "Pham Minh Chau", status: "absent", reason: "Family dental visit" },
        { id: 104, name: "Hoang Duc Duy", status: "attend", allergy: "Peanuts (Strict)" }
      ]
    },
    {
      id: 2,
      name: "Class 1B",
      grade: "Grade 1",
      teacher: "Ms. Vu Bich Ngoc",
      registered: 35,
      confirmed: 35,
      absent: 0,
      extra: 1, // Student intern helper
      status: "confirmed",
      deliveryTime: "10:50 AM",
      deliveredBy: "Nguyen Van Minh (Kitchen Staff)",
      receivedBy: "Ms. Vu Bich Ngoc (Homeroom Teacher)",
      notes: "Full attendance today. Received all 36 portions warm.",
      studentsList: [
        { id: 105, name: "Dang Tuan Kiet", status: "attend", allergy: "None" },
        { id: 106, name: "Do Phuong Linh", status: "attend", allergy: "None" }
      ]
    },
    {
      id: 3,
      name: "Class 2A",
      grade: "Grade 2",
      teacher: "Mr. Pham Quang Dung",
      registered: 36,
      confirmed: 34,
      absent: 3,
      extra: 1,
      status: "delivered",
      deliveryTime: "11:02 AM",
      deliveredBy: "Tran Thi Hoa (Kitchen Staff)",
      receivedBy: "Pending Teacher Signature",
      notes: "Meal cart parked outside classroom Room 204",
      studentsList: [
        { id: 107, name: "Bui Thanh Mai", status: "absent", reason: "Medical leave" },
        { id: 108, name: "Ngo Viet Anh", status: "attend", allergy: "Lactose sensitive" }
      ]
    },
    {
      id: 4,
      name: "Class 2B",
      grade: "Grade 2",
      teacher: "Ms. Hoang Yen Nhi",
      registered: 36,
      confirmed: 36,
      absent: 0,
      extra: 0,
      status: "pending",
      deliveryTime: "--",
      deliveredBy: "--",
      receivedBy: "--",
      notes: "Cart scheduled for elevator dispatch at 11:08 AM",
      studentsList: []
    },
    {
      id: 5,
      name: "Class 3A",
      grade: "Grade 3",
      teacher: "Ms. Trinh My Duyen",
      registered: 38,
      confirmed: 37,
      absent: 2,
      extra: 1,
      status: "confirmed",
      deliveryTime: "10:48 AM",
      deliveredBy: "Tran Thi Hoa (Kitchen Staff)",
      receivedBy: "Ms. Trinh My Duyen",
      notes: "Digital confirmation logged via school mobile app",
      studentsList: []
    },
    {
      id: 6,
      name: "Class 3B",
      grade: "Grade 3",
      teacher: "Mr. Dinh The Vinh",
      registered: 38,
      confirmed: 37,
      absent: 2,
      extra: 1,
      status: "pending",
      deliveryTime: "--",
      deliveredBy: "--",
      receivedBy: "--",
      notes: "Building B 3rd Floor",
      studentsList: []
    },
    {
      id: 7,
      name: "Class 4A",
      grade: "Grade 4",
      teacher: "Ms. Nguyen Khanh Linh",
      registered: 40,
      confirmed: 39,
      absent: 1,
      extra: 0,
      status: "pending",
      deliveryTime: "--",
      deliveredBy: "--",
      receivedBy: "--",
      notes: "Hot thermal box ready in Kitchen Station 2",
      studentsList: []
    },
    {
      id: 8,
      name: "Class 5A",
      grade: "Grade 5",
      teacher: "Mr. Vu Hoang Long",
      registered: 42,
      confirmed: 40,
      absent: 2,
      extra: 0,
      status: "pending",
      deliveryTime: "--",
      deliveredBy: "--",
      receivedBy: "--",
      notes: "Requires additional cutlery set for 2 teachers",
      studentsList: []
    }
  ],

  // Menu and Expected Meal Quantity Table
  expectedQuantities: {
    menuName: "Thursday Nutritious Standard Menu (Week 2)",
    plannedHeadcount: 412,
    bufferPercentage: 5, // 5% shrinkage / safety buffer
    calculationMethod: "auto", // 'auto' | 'manual'
    lastCalculatedAt: "08:15 AM (System Auto-Sync)",
    dishes: [
      {
        id: "d1",
        name: "Steamed Fragrant Jasmine Rice",
        category: "Staple Grain",
        icon: "bowl-rice",
        portionSize: 160,
        portionUnit: "g",
        unit: "kg",
        calculatedTotal: 69.2, // 412 * 160g * 1.05 = 69.2 kg cooked
        isCustomized: false
      },
      {
        id: "d2",
        name: "Caramelized Braised Salmon & Pork Balls",
        category: "Main Protein",
        icon: "fish",
        portionSize: 95,
        portionUnit: "g",
        unit: "kg",
        calculatedTotal: 41.1, // 412 * 95g * 1.05 = 41.09 kg
        isCustomized: false
      },
      {
        id: "d3",
        name: "Kabocha Pumpkin & Minced Pork Broth",
        category: "Soup / Broth",
        icon: "soup",
        portionSize: 220,
        portionUnit: "ml",
        unit: "liters",
        calculatedTotal: 95.2, // 412 * 220ml * 1.05 = 95.17 L
        isCustomized: false
      },
      {
        id: "d4",
        name: "Stir-fried Sweet Bok Choy & Straw Mushrooms",
        category: "Vegetables",
        icon: "leaf",
        portionSize: 85,
        portionUnit: "g",
        unit: "kg",
        calculatedTotal: 36.8, // 412 * 85g * 1.05 = 36.77 kg
        isCustomized: false
      },
      {
        id: "d5",
        name: "Fresh Cavendish Banana & Probiotic Yogurt",
        category: "Dessert & Fruit",
        icon: "apple",
        portionSize: 1,
        portionUnit: "set",
        unit: "portions",
        calculatedTotal: 433, // 412 * 1.05 buffer = 433 portions
        isCustomized: false
      }
    ]
  },

  // Preparation Kanban Cards
  prepBoard: {
    overallProgress: 68,
    prepStartTime: "08:45 AM",
    expectedReadyTime: "10:45 AM",
    columns: {
      toPrepare: [
        {
          id: "prep-5",
          dishName: "Fresh Cavendish Banana & Probiotic Yogurt",
          category: "Dessert & Fruit",
          quantity: "433 sets",
          assignedTo: {
            name: "Chef Minh",
            role: "Pantry & Cold Prep",
            avatar: "👨‍🍳"
          },
          statusTime: "Starts 10:15 AM",
          step: "Chilling & sorting ripe fruits",
          completedSubtasks: 0,
          totalSubtasks: 2,
          timerState: "standby"
        }
      ],
      inProgress: [
        {
          id: "prep-2",
          dishName: "Caramelized Braised Salmon & Pork Balls",
          category: "Main Protein",
          quantity: "41.1 kg",
          assignedTo: {
            name: "Chef Lan",
            role: "Hot Cooking Lead",
            avatar: "👩‍🍳"
          },
          statusTime: "18 mins remaining",
          step: "Simmering in kettles, internal temp 84°C",
          completedSubtasks: 3,
          totalSubtasks: 4,
          timerState: "running",
          urgent: false
        },
        {
          id: "prep-4",
          dishName: "Stir-fried Sweet Bok Choy & Straw Mushrooms",
          category: "Vegetables",
          quantity: "36.8 kg",
          assignedTo: {
            name: "Cook Nam",
            role: "Wok Station",
            avatar: "👨‍🍳"
          },
          statusTime: "12 mins remaining",
          step: "Wok flash stir-fry batch 3 of 4",
          completedSubtasks: 2,
          totalSubtasks: 3,
          timerState: "running",
          urgent: true
        }
      ],
      ready: [
        {
          id: "prep-1",
          dishName: "Steamed Fragrant Jasmine Rice",
          category: "Staple Grain",
          quantity: "69.2 kg (8 trays)",
          assignedTo: {
            name: "Cook Nam",
            role: "Grain Cooker",
            avatar: "👨‍🍳"
          },
          statusTime: "Ready at 10:10 AM",
          step: "Transferred to thermal holding cabinet (68°C)",
          completedSubtasks: 3,
          totalSubtasks: 3,
          timerState: "completed",
          qcPassed: true
        },
        {
          id: "prep-3",
          dishName: "Kabocha Pumpkin & Minced Pork Broth",
          category: "Soup / Broth",
          quantity: "95.2 L (4 cauldrons)",
          assignedTo: {
            name: "Cook Hoa",
            role: "Soup Station",
            avatar: "👩‍🍳"
          },
          statusTime: "Ready at 10:20 AM",
          step: "Seasoning approved, insulated vats sealed",
          completedSubtasks: 4,
          totalSubtasks: 4,
          timerState: "completed",
          qcPassed: true
        }
      ]
    }
  },

  // Meal Reconciliation Data
  reconciliation: {
    accuracyRate: 98.1,
    wasteRate: 1.9,
    totalPlannedPortions: 412,
    totalConsumedPortions: 408,
    leftoverPortions: 4,
    items: [
      {
        id: "rec-1",
        dishName: "Steamed Fragrant Jasmine Rice",
        unit: "kg",
        plannedQty: 69.2,
        actualPrepared: 70.0,
        actualConsumed: 67.8,
        leftover: 2.2,
        variancePercent: 3.2,
        status: "surplus_ok",
        cause: "Slight surplus reserved for second servings"
      },
      {
        id: "rec-2",
        dishName: "Braised Salmon & Pork Balls",
        unit: "kg",
        plannedQty: 41.1,
        actualPrepared: 41.5,
        actualConsumed: 41.0,
        leftover: 0.5,
        variancePercent: 1.2,
        status: "normal",
        cause: "Exact portion balance achieved"
      },
      {
        id: "rec-3",
        dishName: "Pumpkin & Minced Pork Broth",
        unit: "liters",
        plannedQty: 95.2,
        actualPrepared: 95.0,
        actualConsumed: 94.2,
        leftover: 0.8,
        variancePercent: 0.8,
        status: "normal",
        cause: "High student preference, well consumed"
      },
      {
        id: "rec-4",
        dishName: "Stir-fried Sweet Bok Choy",
        unit: "kg",
        plannedQty: 36.8,
        actualPrepared: 37.0,
        actualConsumed: 34.5,
        leftover: 2.5,
        variancePercent: 7.2,
        status: "waste_alert",
        cause: "Grade 1 students consumed fewer green vegetable portions"
      },
      {
        id: "rec-5",
        dishName: "Cavendish Banana & Yogurt",
        unit: "portions",
        plannedQty: 433,
        actualPrepared: 433,
        actualConsumed: 412,
        leftover: 21,
        variancePercent: 5.1,
        status: "surplus_ok",
        cause: "Buffer stock safely returned to cool storage for afternoon snack"
      }
    ],
    supervisorNotes: [
      {
        id: "note-1",
        author: "Ms. Nguyen Mai",
        role: "Boarding Supervisor",
        timestamp: "12:45 PM",
        text: "Grade 1 classrooms reported high appetite for pumpkin soup. For stir-fried bok choy, recommend chopping into finer ribbons for lower grades to improve vegetable intake."
      },
      {
        id: "note-2",
        author: "Chef Tran Lan",
        role: "Kitchen Staff",
        timestamp: "01:05 PM",
        text: "21 leftover unopened yogurts and bananas logged into cold inventory. Re-purposing eligible portions for 14:30 afternoon snack with zero waste."
      }
    ]
  }
};
