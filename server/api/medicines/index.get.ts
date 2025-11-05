export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const prisma = usePrismaClient()

  try {
    const { search, limit = 50, offset = 0 } = query

    const where = search
      ? {
          OR: [
            { tradeName: { contains: search as string, mode: 'insensitive' as const } },
            { activeSubstance: { contains: search as string, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [medicines, total] = await Promise.all([
      prisma.medicine.findMany({
        where,
        include: {
          authorUser: true,
        },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip: Number(offset),
      }),
      prisma.medicine.count({ where }),
    ])

    return {
      data: medicines,
      total,
      limit: Number(limit),
      offset: Number(offset),
    }
  } catch (error) {
    console.error('Error fetching medicines:', error)
    throw createError({
      statusCode: 500,
      message: 'Error fetching medicines',
    })
  }
})
