import { PrismaClient, AttendanceStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PostgreSQL database for Semi-Boarding Meal Management...');

  // 1. Seed classes and students
  const sampleStudents = [
    { code: 'HS-00101', name: 'Nguyễn Hoàng An', className: '1A', allergies: ['Hải sản'] },
    { code: 'HS-00102', name: 'Trần Bảo Châu', className: '1A', allergies: [] },
    { code: 'HS-00103', name: 'Lê Minh Khôi', className: '1A', allergies: ['Đậu phộng'] },
    { code: 'HS-00104', name: 'Phạm Ngọc Diệp', className: '1A', allergies: [] },
    { code: 'HS-00105', name: 'Vũ Tuấn Kiệt', className: '1A', allergies: ['Trứng gà'] },
    { code: 'HS-00106', name: 'Đặng Thảo Vy', className: '1A', allergies: [] },
    { code: 'HS-00107', name: 'Hoàng Gia Bảo', className: '1A', allergies: [] },
    { code: 'HS-00108', name: 'Bùi Khánh Linh', className: '1A', allergies: [] },

    { code: 'HS-00109', name: 'Đỗ Đức Thắng', className: '1B', allergies: [] },
    { code: 'HS-00110', name: 'Vũ Thu Quỳnh', className: '1B', allergies: ['Tôm tép'] },
    { code: 'HS-00111', name: 'Phạm Minh Trí', className: '1B', allergies: [] },
    { code: 'HS-00112', name: 'Ngô Hải Yến', className: '1B', allergies: [] },

    { code: 'HS-00201', name: 'Lý Quốc Huy', className: '2A', allergies: [] },
    { code: 'HS-00202', name: 'Nguyễn Tường Vy', className: '2A', allergies: ['Sữa bò tươi'] },
    { code: 'HS-00203', name: 'Hoàng Nhật Minh', className: '2A', allergies: [] },
    { code: 'HS-00204', name: 'Đoàn Phương Linh', className: '2A', allergies: [] },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const s of sampleStudents) {
    const student = await prisma.student.upsert({
      where: { studentCode: s.code },
      update: { fullName: s.name, className: s.className },
      create: {
        studentCode: s.code,
        fullName: s.name,
        className: s.className,
      },
    });

    for (const allergen of s.allergies) {
      await prisma.allergyRecord.create({
        data: {
          studentId: student.id,
          allergen,
          severity: 'HIGH',
        },
      });
    }

    await prisma.dailyAttendance.upsert({
      where: {
        studentId_date: {
          studentId: student.id,
          date: today,
        },
      },
      update: {},
      create: {
        studentId: student.id,
        date: today,
        status: AttendanceStatus.PRESENT,
      },
    });
  }

  // 2. Seed Menu and Dishes
  const dishesData = [
    { name: 'Thịt heo kho cút trứng', calories: 280, allergens: ['Trứng'] },
    { name: 'Đậu hũ dồn thịt sốt cà', calories: 220, allergens: ['Đậu nành'] },
    { name: 'Canh bí đao sườn non', calories: 120, allergens: [] },
    { name: 'Rau cải ngọt xào tỏi', calories: 65, allergens: [] },
    { name: 'Chuối già Nam Mỹ tráng miệng', calories: 90, allergens: [] },
  ];

  for (const d of dishesData) {
    await prisma.dish.upsert({
      where: { name: d.name },
      update: { calories: d.calories, allergens: d.allergens },
      create: {
        name: d.name,
        calories: d.calories,
        allergens: d.allergens,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
