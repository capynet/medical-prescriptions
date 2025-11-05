export default defineEventHandler(async (event) => {
  const prisma = usePrismaClient()
  const body = await readBody(event)
  const session = await getServerSession(event)

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  try {
    // Get or create user
    let user = await prisma.user.findFirst({
      where: { name: session.user.name || '' },
    })

    if (!user) {
      const [firstName, ...lastNameParts] = (session.user.name || '').split(' ')
      user = await prisma.user.create({
        data: {
          name: firstName,
          surname: lastNameParts.join(' '),
        },
      })
    }

    // Create prescription with medicines
    const prescription = await prisma.prescription.create({
      data: {
        author: user.id,
        diagnosis: body.diagnosis,
        patientId: body.patientId,
        medicines: {
          create: body.medicines.map((med: any) => ({
            medicineId: med.medicineId,
            qty: med.qty,
            instructions: med.instructions,
          })),
        },
      },
      include: {
        authorUser: true,
        diagnosisInfo: true,
        patient: {
          include: {
            provider: true,
            plan: true,
          },
        },
        medicines: {
          include: {
            medicine: true,
          },
        },
      },
    })

    return { data: prescription }
  } catch (error) {
    console.error('Error creating prescription:', error)
    throw createError({
      statusCode: 500,
      message: 'Error creating prescription',
    })
  }
})
