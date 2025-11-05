import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create default users
  const user1 = await prisma.user.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'Dr. Juan',
      surname: 'Pérez',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      name: 'Dra. María',
      surname: 'González',
    },
  })

  console.log('✅ Users created')

  // Create providers (Health Insurance Companies)
  const osde = await prisma.provider.upsert({
    where: { machineName: 'osde' },
    update: {},
    create: {
      name: 'OSDE',
      machineName: 'osde',
    },
  })

  const swissMedical = await prisma.provider.upsert({
    where: { machineName: 'swiss-medical' },
    update: {},
    create: {
      name: 'Swiss Medical',
      machineName: 'swiss-medical',
    },
  })

  const galeno = await prisma.provider.upsert({
    where: { machineName: 'galeno' },
    update: {},
    create: {
      name: 'Galeno',
      machineName: 'galeno',
    },
  })

  console.log('✅ Providers created')

  // Create provider plans
  const osde210 = await prisma.providerPlan.upsert({
    where: { machineName: 'osde-210' },
    update: {},
    create: {
      providerId: osde.id,
      name: 'Plan 210',
      machineName: 'osde-210',
    },
  })

  const osde310 = await prisma.providerPlan.upsert({
    where: { machineName: 'osde-310' },
    update: {},
    create: {
      providerId: osde.id,
      name: 'Plan 310',
      machineName: 'osde-310',
    },
  })

  const osde410 = await prisma.providerPlan.upsert({
    where: { machineName: 'osde-410' },
    update: {},
    create: {
      providerId: osde.id,
      name: 'Plan 410',
      machineName: 'osde-410',
    },
  })

  const swissClassic = await prisma.providerPlan.upsert({
    where: { machineName: 'swiss-classic' },
    update: {},
    create: {
      providerId: swissMedical.id,
      name: 'SMG Clásico',
      machineName: 'swiss-classic',
    },
  })

  const swissBlue = await prisma.providerPlan.upsert({
    where: { machineName: 'swiss-blue' },
    update: {},
    create: {
      providerId: swissMedical.id,
      name: 'SMG Blue',
      machineName: 'swiss-blue',
    },
  })

  const galenoPlata = await prisma.providerPlan.upsert({
    where: { machineName: 'galeno-plata' },
    update: {},
    create: {
      providerId: galeno.id,
      name: 'Galeno Plata',
      machineName: 'galeno-plata',
    },
  })

  const galenoOro = await prisma.providerPlan.upsert({
    where: { machineName: 'galeno-oro' },
    update: {},
    create: {
      providerId: galeno.id,
      name: 'Galeno Oro',
      machineName: 'galeno-oro',
    },
  })

  console.log('✅ Provider plans created')

  // Create diagnoses
  const diagnoses = [
    { name: 'Hipertensión Arterial', machineName: 'hipertension' },
    { name: 'Diabetes Mellitus', machineName: 'diabetes' },
    { name: 'Infección Respiratoria', machineName: 'infeccion-respiratoria' },
    { name: 'Gastritis', machineName: 'gastritis' },
    { name: 'Migraña', machineName: 'migraña' },
    { name: 'Artritis', machineName: 'artritis' },
    { name: 'Asma', machineName: 'asma' },
    { name: 'Ansiedad', machineName: 'ansiedad' },
    { name: 'Depresión', machineName: 'depresion' },
    { name: 'Alergia', machineName: 'alergia' },
  ]

  for (const diagnosis of diagnoses) {
    await prisma.diagnosis.upsert({
      where: { machineName: diagnosis.machineName },
      update: {},
      create: diagnosis,
    })
  }

  console.log('✅ Diagnoses created')

  // Create sample medicines
  const medicines = [
    { tradeName: 'Enalapril 10mg', activeSubstance: 'Enalapril', author: user1.id },
    { tradeName: 'Losartán 50mg', activeSubstance: 'Losartán', author: user1.id },
    { tradeName: 'Metformina 850mg', activeSubstance: 'Metformina', author: user1.id },
    { tradeName: 'Insulina NPH', activeSubstance: 'Insulina', author: user1.id },
    { tradeName: 'Amoxicilina 500mg', activeSubstance: 'Amoxicilina', author: user1.id },
    { tradeName: 'Ibuprofeno 600mg', activeSubstance: 'Ibuprofeno', author: user2.id },
    { tradeName: 'Paracetamol 500mg', activeSubstance: 'Paracetamol', author: user2.id },
    { tradeName: 'Omeprazol 20mg', activeSubstance: 'Omeprazol', author: user2.id },
    { tradeName: 'Salbutamol Aerosol', activeSubstance: 'Salbutamol', author: user1.id },
    { tradeName: 'Loratadina 10mg', activeSubstance: 'Loratadina', author: user1.id },
  ]

  for (const medicine of medicines) {
    await prisma.medicine.create({
      data: medicine,
    })
  }

  console.log('✅ Medicines created')

  // Create sample patients
  await prisma.patient.create({
    data: {
      fullName: 'Ana María Rodriguez',
      userId: '12345678',
      affiliationId: 'OSDE-001-12345',
      affiliationProvider: osde.id,
      affiliationPlan: osde310.id,
      author: user1.id,
    },
  })

  await prisma.patient.create({
    data: {
      fullName: 'Carlos Alberto Fernández',
      userId: '23456789',
      affiliationId: 'SWISS-002-23456',
      affiliationProvider: swissMedical.id,
      affiliationPlan: swissBlue.id,
      author: user2.id,
    },
  })

  await prisma.patient.create({
    data: {
      fullName: 'Laura Beatriz Martinez',
      userId: '34567890',
      affiliationId: 'GAL-003-34567',
      affiliationProvider: galeno.id,
      affiliationPlan: galenoOro.id,
      author: user1.id,
    },
  })

  console.log('✅ Sample patients created')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
