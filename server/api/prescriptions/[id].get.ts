export default defineEventHandler(async (event) => {
  const prisma = usePrismaClient()
  const id = getRouterParam(event, 'id')

  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
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
    })

    if (!prescription) {
      throw createError({
        statusCode: 404,
        message: 'Prescription not found',
      })
    }

    return { data: prescription }
  } catch (error) {
    console.error('Error fetching prescription:', error)
    throw createError({
      statusCode: 500,
      message: 'Error fetching prescription',
    })
  }
})
