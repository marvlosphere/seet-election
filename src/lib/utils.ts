import { v4 as uuidv4 } from 'uuid'

/**
 * Generates a human-friendly 8-character token
 * e.g. "A3F7-K2P9"
 * Avoids confusing characters: 0, O, I, 1, L
 */
export function generateToken(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let token = ''
  for (let i = 0; i < 8; i++) {
    if (i === 4) token += '-'
    token += chars[Math.floor(Math.random() * chars.length)]
  }
  return token
}

/**
 * Generates a secure admin session key
 */
export function generateAdminKey(): string {
  return uuidv4()
}

/**
 * Masks a phone number for display
 * e.g. 08012345678 → 080****5678
 */
export function maskPhone(phone: string): string {
  if (phone.length < 7) return phone
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

/**
 * Validates a Nigerian matric number format
 * Most Nigerian universities use formats like:
 * ENG/2021/001, 21/ENG/001, etc.
 * We accept any alphanumeric string with slashes or dashes, 5–20 chars
 */
export function isValidMatricNumber(matric: string): boolean {
  return /^[A-Za-z0-9\-\/]{5,20}$/.test(matric.trim())
}

/**
 * Validates a Nigerian phone number
 */
export function isValidPhone(phone: string): boolean {
  return /^(\+?234|0)[789][01]\d{8}$/.test(phone.replace(/\s/g, ''))
}

/**
 * Normalizes phone to international format
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '')
  if (cleaned.startsWith('0')) return '+234' + cleaned.slice(1)
  if (cleaned.startsWith('234')) return '+' + cleaned
  return cleaned
}
