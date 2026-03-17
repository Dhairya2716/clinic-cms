import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length === 0) {
    // For development, provide a fallback. In production, this should throw
    return 'super-secret-key-for-clinic-cms-dev-only'
  }
  return secret
}

export const signToken = async (
  payload: { userId: number; role: string; clinicId: number; clinicCode: string; clinicName: string }
) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(new TextEncoder().encode(getJwtSecretKey()))
}

export const verifyToken = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    )
    return verified.payload as JWTPayload & {
      userId: number
      role: string
      clinicId: number
      clinicCode: string
      clinicName: string
    }
  } catch (error) {
    return null
  }
}

export const getUserContext = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  return await verifyToken(token)
}
