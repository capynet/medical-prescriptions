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
    const medicine = await prisma.medicine.update({
      where: { id },
      data: {
        tradeName: body.tradeName,
        activeSubstance: body.activeSubstance,
      },
      include: {
        authorUser: true,
      },
    })

    return { data: medicine }
  } catch (error) {
    console.error('Error updating medicine:', error)
    throw createError({
      statusCode: 500,
      message: 'Error updating medicine',
    })
  }
})
