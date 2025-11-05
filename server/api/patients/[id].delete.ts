export default defineEventHandler(async (event) => {
  const prisma = usePrismaClient()
  const id = getRouterParam(event, 'id')
  const session = await getServerSession(event)

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  try {
    await prisma.patient.delete({
      where: { id },
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting patient:', error)
    throw createError({
      statusCode: 500,
      message: 'Error deleting patient',
    })
  }
})
