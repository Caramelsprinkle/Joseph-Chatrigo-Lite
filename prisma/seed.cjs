/*
  Seed script for Supabase Postgres using Prisma.

  IMPORTANT:
  - This seeds ChatSession/Message for an existing Supabase Auth user.
  - Set SEED_USER_ID to the user's UUID (auth.users.id) before running.

  Example:
    $env:SEED_USER_ID="<uuid>"
    npx prisma db seed
*/

const { PrismaClient } = require('../src/generated/prisma')

const prisma = new PrismaClient()

async function main() {
  const userId = process.env.SEED_USER_ID

  if (!userId) {
    throw new Error(
      'Missing SEED_USER_ID. Set it to a Supabase auth.users.id UUID before seeding.',
    )
  }

  // Create 2 chat sessions with a few messages each
  const now = new Date()

  const session1 = await prisma.chatSession.create({
    data: {
      userId,
      title: 'Welcome chat',
      lastMessageAt: now,
      messages: {
        create: [
          {
            role: 'assistant',
            content: 'Hi! Welcome to Chatrigo Lite. What do you want to build today?',
          },
          {
            role: 'user',
            content: 'Help me set up my chat app UI.',
          },
          {
            role: 'assistant',
            content: 'Sure — let\'s start with the sidebar and message bubbles.',
          },
        ],
      },
    },
  })

  const session2 = await prisma.chatSession.create({
    data: {
      userId,
      title: 'Ideas',
      lastMessageAt: now,
      messages: {
        create: [
          { role: 'user', content: 'Give me 3 project ideas.' },
          {
            role: 'assistant',
            content: '1) Chat app 2) Habit tracker 3) Expense tracker',
          },
        ],
      },
    },
  })

  console.log('Seeded sessions:', session1.id, session2.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
