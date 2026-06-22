import Link from 'next/link'
import { Heart, Mail, Phone, Twitter, Facebook, Instagram } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-brand-border/60 pt-12 pb-24 md:pb-12 mt-auto relative overflow-hidden">
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-lightGreen/20 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-shell-desktop mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* Brand Column */}
        <div className="col-span-1 lg:col-span-1">
          <Logo className="mb-4" />
          <p className="text-sm text-brand-inkSoft font-medium max-w-xs mb-6">
            Apni sehat ka poora hisaab, ek jagah. Free, secure, aur family-first.
          </p>
          <div className="inline-flex items-center gap-1.5 text-[11px] text-brand-inkSoft font-bold bg-brand-smoke px-3 py-1.5 rounded-full border border-brand-border shadow-sm">
            <span>Made with</span>
            <Heart size={12} className="text-brand-danger fill-brand-danger" />
            <span>in India</span>
          </div>
        </div>

        {/* Links Column */}
        <div>
          <h4 className="font-bold text-brand-ink mb-4">Quick Links</h4>
          <div className="flex flex-col gap-3 text-sm font-medium text-brand-inkSoft">
            <Link href="/dashboard" className="hover:text-brand-deepGreen transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-border" /> Dashboard</Link>
            <Link href="/awareness" className="hover:text-brand-deepGreen transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-border" /> Health Info</Link>
            <Link href="/schemes" className="hover:text-brand-deepGreen transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-border" /> Government Schemes</Link>
          </div>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="font-bold text-brand-ink mb-4">Contact Us</h4>
          <div className="flex flex-col gap-3 text-sm font-medium text-brand-inkSoft">
            <a href="mailto:support@sehatmitra.in" className="hover:text-brand-deepGreen transition-colors flex items-center gap-2">
              <Mail size={16} /> support@sehatmitra.in
            </a>
            <a href="tel:104" className="hover:text-brand-deepGreen transition-colors flex items-center gap-2">
              <Phone size={16} /> Health Helpline: 104
            </a>
          </div>
        </div>

        {/* Social & Legal Column */}
        <div>
          <h4 className="font-bold text-brand-ink mb-4">Follow Us</h4>
          <div className="flex gap-4 mb-6">
            <a href="#" className="w-10 h-10 rounded-full bg-brand-smoke text-brand-inkSoft flex items-center justify-center hover:bg-brand-deepGreen hover:text-white transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-brand-smoke text-brand-inkSoft flex items-center justify-center hover:bg-brand-deepGreen hover:text-white transition-colors">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-brand-smoke text-brand-inkSoft flex items-center justify-center hover:bg-brand-deepGreen hover:text-white transition-colors">
              <Instagram size={18} />
            </a>
          </div>
          <div className="flex flex-col gap-2 text-xs font-medium text-brand-inkSoft">
            <span className="hover:text-brand-deepGreen transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-brand-deepGreen transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
      
      <div className="max-w-shell-desktop mx-auto px-6 mt-12 pt-6 border-t border-brand-border/40 text-center text-xs text-brand-inkSoft font-medium relative z-10">
        © {new Date().getFullYear()} SehatMitra. All rights reserved.
      </div>
    </footer>
  )
}
