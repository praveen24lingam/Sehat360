import { differenceInDays, differenceInWeeks, addDays, format } from 'date-fns'
import { hi as hiLocale, enIN } from 'date-fns/locale'

export function calculatePregnancyWeek(lmpDate: string): number {
  return Math.floor(differenceInDays(new Date(), new Date(lmpDate)) / 7)
}

export function calculateDueDate(lmpDate: string): string {
  return addDays(new Date(lmpDate), 280).toISOString().split('T')[0]
}

export function calculateAgeInMonths(dob: string): number {
  return Math.floor(differenceInDays(new Date(), new Date(dob)) / 30.44)
}

export function calculateVaccineDueDate(dob: string, dueAgeDays: number): string {
  return addDays(new Date(dob), dueAgeDays).toISOString().split('T')[0]
}

export function getVaccineStatus(dueDate: string, done: boolean): 'done' | 'overdue' | 'dueSoon' | 'upcoming' {
  if (done) return 'done'
  const days = differenceInDays(new Date(dueDate), new Date())
  if (days < 0) return 'overdue'
  if (days <= 14) return 'dueSoon'
  return 'upcoming'
}

export function formatDateInLocale(date: string, locale: 'hi' | 'en'): string {
  return format(new Date(date), 'd MMM yyyy', { locale: locale === 'hi' ? hiLocale : enIN })
}