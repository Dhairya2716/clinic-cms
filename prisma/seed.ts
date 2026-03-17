import prisma from '../src/lib/prisma'
import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('Seeding database...')

  const clinic = await prisma.clinic.upsert({
    where: { code: 'STUD-01' },
    update: {},
    create: {
      name: 'Darshan University Health Center',
      code: 'STUD-01',
    },
  })

  console.log(`Clinic created/exists: ${clinic.name}`)

  const hashedPassword = await bcrypt.hash('password123', 10)

  // System Admin
  const studentEmail = 'enrollment@darshan.ac.in'
  const student = await prisma.user.upsert({
    where: { email: studentEmail },
    update: { password: hashedPassword, role: Role.admin },
    create: {
      name: 'Darshan Student Admin',
      email: studentEmail,
      password: hashedPassword,
      role: Role.admin,
      clinicId: clinic.id,
    },
  })

  console.log(`Student Account created: ${student.email} / password123`)

  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@darshan.ac.in' },
    update: { password: hashedPassword },
    create: {
      name: 'Dr. House',
      email: 'doctor@darshan.ac.in',
      password: hashedPassword,
      role: Role.doctor,
      clinicId: clinic.id,
    },
  })

  const receptionist = await prisma.user.upsert({
    where: { email: 'reception@darshan.ac.in' },
    update: { password: hashedPassword },
    create: {
      name: 'Pam Beesly',
      email: 'reception@darshan.ac.in',
      password: hashedPassword,
      role: Role.receptionist,
      clinicId: clinic.id,
    },
  })

  const patient = await prisma.user.upsert({
    where: { email: 'patient@darshan.ac.in' },
    update: { password: hashedPassword },
    create: {
      name: 'John Doe',
      email: 'patient@darshan.ac.in',
      password: hashedPassword,
      role: Role.patient,
      clinicId: clinic.id,
    },
  })

  console.log('Finished seeding database.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
