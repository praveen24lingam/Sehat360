import Link from 'next/link'
import { Heart, Mail, Phone } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'

export function Footer() {
  return (
    <footer className="w-full bg-brand-smoke border-t border-brand-border/60 pt-16 pb-24 md:pb-16 mt-auto relative overflow-hidden">
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-lightGreen/40 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-shell-desktop mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 relative z-10">
        
        {/* Brand Column */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col items-start">
          <Logo className="mb-5" />
          <p className="text-sm text-brand-inkSoft font-medium max-w-[280px] mb-6 leading-relaxed">
            Apni sehat ka poora hisaab, ek jagah. Free, secure, aur family-first.
          </p>
          <div className="inline-flex items-center gap-1.5 text-[11px] text-brand-inkSoft font-bold bg-white px-3 py-1.5 rounded-full border border-brand-border shadow-sm">
            <span>Made with</span>
            <Heart size={12} className="text-brand-danger fill-brand-danger" />
            <span>in India</span>
          </div>
        </div>

        {/* Links Column */}
        <div>
          <h4 className="font-bold text-brand-ink mb-5">Quick Links</h4>
          <div className="flex flex-col gap-3.5 text-sm font-medium text-brand-inkSoft">
            <Link href="/dashboard" className="hover:text-brand-deepGreen transition-colors flex items-center gap-2 w-fit"><span className="w-1 h-1 rounded-full bg-brand-border" /> Dashboard</Link>
            <Link href="/awareness" className="hover:text-brand-deepGreen transition-colors flex items-center gap-2 w-fit"><span className="w-1 h-1 rounded-full bg-brand-border" /> Health Info</Link>
            <Link href="/schemes" className="hover:text-brand-deepGreen transition-colors flex items-center gap-2 w-fit"><span className="w-1 h-1 rounded-full bg-brand-border" /> Government Schemes</Link>
          </div>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="font-bold text-brand-ink mb-5">Contact Us</h4>
          <div className="flex flex-col gap-3.5 text-sm font-medium text-brand-inkSoft">
            <a href="mailto:support@sehatmitra.in" className="hover:text-brand-deepGreen transition-colors flex items-center gap-2.5 w-fit">
              <Mail size={16} className="text-brand-deepGreen" /> support@sehatmitra.in
            </a>
            <a href="tel:104" className="hover:text-brand-deepGreen transition-colors flex items-center gap-2.5 w-fit">
              <Phone size={16} className="text-brand-deepGreen" /> Health Helpline: 104
            </a>
          </div>
        </div>

        {/* Social & Legal Column */}
        <div>
          <h4 className="font-bold text-brand-ink mb-5">Follow Us</h4>
          <div className="flex flex-wrap gap-3 mb-8">
            <a href="#" className="w-9 h-9 rounded-full bg-white border border-brand-border text-brand-inkSoft flex items-center justify-center hover:bg-brand-deepGreen hover:text-white hover:border-brand-deepGreen transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white border border-brand-border text-brand-inkSoft flex items-center justify-center hover:bg-brand-deepGreen hover:text-white hover:border-brand-deepGreen transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white border border-brand-border text-brand-inkSoft flex items-center justify-center hover:bg-brand-deepGreen hover:text-white hover:border-brand-deepGreen transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white border border-brand-border text-brand-inkSoft flex items-center justify-center hover:bg-brand-deepGreen hover:text-white hover:border-brand-deepGreen transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white border border-brand-border text-brand-inkSoft flex items-center justify-center hover:bg-brand-danger hover:text-white hover:border-brand-danger transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.5 7.1 2.5 7.1 2.5 7.1c-.2.8-.2 1.6-.2 2.4v5c0 .8 0 1.6.2 2.4 0 0 0 0 0 0 .2.8.9 1.4 1.7 1.5 1.7.2 5.1.2 7.8.2s6.1 0 7.8-.2c.8-.1 1.5-.7 1.7-1.5 0 0 0 0 0 0 .2-.8.2-1.6.2-2.4v-5c0-.8 0-1.6-.2-2.4 0 0 0 0 0 0-.2-.8-.9-1.4-1.7-1.5C18.1 5 14.7 5 12 5s-6.1 0-7.8.2c-.8.1-1.5.7-1.7 1.5z"/><path d="m9.5 15.5 6-3.5-6-3.5z"/></svg>
            </a>
          </div>
          <div className="flex flex-col gap-3 text-xs font-medium text-brand-inkSoft">
            <span className="hover:text-brand-deepGreen transition-colors cursor-pointer w-fit">Privacy Policy</span>
            <span className="hover:text-brand-deepGreen transition-colors cursor-pointer w-fit">Terms of Service</span>
          </div>
        </div>

      </div>
      
      <div className="max-w-shell-desktop mx-auto px-6 mt-16 pt-8 border-t border-brand-border/60 text-center text-xs text-brand-inkSoft font-medium relative z-10">
        © {new Date().getFullYear()} SehatMitra. All rights reserved.
      </div>
    </footer>
  )
}
