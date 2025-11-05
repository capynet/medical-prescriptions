export default defineEventHandler(async (event) => {
  const prisma = usePrismaClient()
  const id = getRouterParam(event, 'id')

  try {
    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        plans: true,
      },
    })

    if (!provider) {
      throw createError({
        statusCode: 404,
        message: 'Provider not found',
      })
    }

    return { data: provider }
  } catch (error) {
    console.error('Error fetching provider:', error)
    throw createError({
      statusCode: 500,
      message: 'Error fetching provider',
    })
  }
})
