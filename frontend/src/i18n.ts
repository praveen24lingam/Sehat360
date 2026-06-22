import { getRequestConfig } from 'next-intl/server'

function nestMessages(messages: Record<string, string>) {
  const nested: Record<string, unknown> = {}

  Object.entries(messages).forEach(([key, value]) => {
    const parts = key.split('.')
    let cursor = nested

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        cursor[part] = value
        return
      }

      cursor[part] = cursor[part] ?? {}
      cursor = cursor[part] as Record<string, unknown>
    })
  })

  return nested
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale) locale = 'hi';
  if (!['hi', 'en'].includes(locale)) locale = 'hi';

  const messages = (await import(`./messages/${locale}.ts`)).default

  return {
    locale,
    messages: nestMessages(messages),
  }
})
