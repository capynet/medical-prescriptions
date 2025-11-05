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

    const medicine = await prisma.medicine.create({
      data: {
        tradeName: body.tradeName,
        activeSubstance: body.activeSubstance,
        author: user.id,
      },
      include: {
        authorUser: true,
      },
    })

    return { data: medicine }
  } catch (error) {
    console.error('Error creating medicine:', error)
    throw createError({
      statusCode: 500,
      message: 'Error creating medicine',
    })
  }
})
