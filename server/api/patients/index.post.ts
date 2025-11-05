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
      // Create user if doesn't exist
      const [firstName, ...lastNameParts] = (session.user.name || '').split(' ')
      user = await prisma.user.create({
        data: {
          name: firstName,
          surname: lastNameParts.join(' '),
        },
      })
    }

    const patient = await prisma.patient.create({
      data: {
        fullName: body.fullName,
        userId: body.userId,
        affiliationId: body.affiliationId,
        affiliationProvider: body.affiliationProvider,
        affiliationPlan: body.affiliationPlan,
        author: user.id,
      },
      include: {
        authorUser: true,
        provider: true,
        plan: true,
      },
    })

    return { data: patient }
  } catch (error) {
    console.error('Error creating patient:', error)
    throw createError({
      statusCode: 500,
      message: 'Error creating patient',
    })
  }
})
