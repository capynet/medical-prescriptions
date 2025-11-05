export default defineEventHandler(async (event) => {
  const prisma = usePrismaClient()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const session = await getServerSession(event)

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  try {
    const patient = await prisma.patient.update({
      where: { id },
      data: {
        fullName: body.fullName,
        userId: body.userId,
        affiliationId: body.affiliationId,
        affiliationProvider: body.affiliationProvider,
        affiliationPlan: body.affiliationPlan,
      },
      include: {
        authorUser: true,
        provider: true,
        plan: true,
      },
    })

    return { data: patient }
  } catch (error) {
    console.error('Error updating patient:', error)
    throw createError({
      statusCode: 500,
      message: 'Error updating patient',
    })
  }
})
