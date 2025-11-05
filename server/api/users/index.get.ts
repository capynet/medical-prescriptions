export default defineEventHandler(async (event) => {
  const prisma = usePrismaClient()

  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
    })

    return { data: users }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw createError({
      statusCode: 500,
      message: 'Error fetching users',
    })
  }
})
