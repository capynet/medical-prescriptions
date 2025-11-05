export default defineEventHandler(async (event) => {
  const prisma = usePrismaClient()

  try {
    const diagnoses = await prisma.diagnosis.findMany({
      orderBy: { name: 'asc' },
    })

    return { data: diagnoses }
  } catch (error) {
    console.error('Error fetching diagnoses:', error)
    throw createError({
      statusCode: 500,
      message: 'Error fetching diagnoses',
    })
  }
})
