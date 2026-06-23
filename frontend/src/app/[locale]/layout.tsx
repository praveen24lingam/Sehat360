import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { createClient } from '@/utils/supabase/server';
import '../globals.css';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  let initialSession = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = createClient();
      // getUser() validates the JWT server-side; getSession() only reads the cookie locally
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        initialSession = session;
      }
    } catch (e) {
      console.error("Failed to fetch initial session", e);
    }
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AuthProvider initialSession={initialSession}>
        {children}
      </AuthProvider>
    </NextIntlClientProvider>
  );
}