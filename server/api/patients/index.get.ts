export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const prisma = usePrismaClient()

  try {
    const { search, limit = 50, offset = 0 } = query

    const where = search
      ? {
          OR: [
            { fullName: { contains: search as string, mode: 'insensitive' as const } },
            { userId: { contains: search as string, mode: 'insensitive' as const } },
            { affiliationId: { contains: search as string, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        include: {
          authorUser: true,
          provider: true,
          plan: true,
        },
        orderBy: { created: 'desc' },
        take: Number(limit),
        skip: Number(offset),
      }),
      prisma.patient.count({ where }),
    ])

    return {
      data: patients,
      total,
      limit: Number(limit),
      offset: Number(offset),
    }
  } catch (error) {
    console.error('Error fetching patients:', error)
    throw createError({
      statusCode: 500,
      message: 'Error fetching patients',
    })
  }
})
