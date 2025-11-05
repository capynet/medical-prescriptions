export default defineEventHandler(async (event) => {
  const prisma = usePrismaClient()

  try {
    const providers = await prisma.provider.findMany({
      include: {
        plans: true,
      },
      orderBy: { name: 'asc' },
    })

    return { data: providers }
  } catch (error) {
    console.error('Error fetching providers:', error)
    throw createError({
      statusCode: 500,
      message: 'Error fetching providers',
    })
  }
})
