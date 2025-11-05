export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const prisma = usePrismaClient()

  try {
    const {
      dateFrom,
      dateTo,
      patientName,
      userId,
      affiliationId,
      author,
      affiliationProvider,
      page = 1,
      limit = 20,
    } = query

    const where: any = {}

    // Date filters
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom as string)
      if (dateTo) where.createdAt.lte = new Date(dateTo as string)
    }

    // Author filter
    if (author) {
      where.author = author
    }

    // Patient filters
    if (patientName || userId || affiliationId || affiliationProvider) {
      where.patient = {}
      if (patientName) {
        where.patient.fullName = { contains: patientName as string, mode: 'insensitive' as const }
      }
      if (userId) {
        where.patient.userId = { contains: userId as string, mode: 'insensitive' as const }
      }
      if (affiliationId) {
        where.patient.affiliationId = { contains: affiliationId as string, mode: 'insensitive' as const }
      }
      if (affiliationProvider) {
        where.patient.affiliationProvider = affiliationProvider
      }
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip,
      }),
      prisma.prescription.count({ where }),
    ])

    return {
      data: prescriptions,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    }
  } catch (error) {
    console.error('Error fetching prescriptions:', error)
    throw createError({
      statusCode: 500,
      message: 'Error fetching prescriptions',
    })
  }
})
