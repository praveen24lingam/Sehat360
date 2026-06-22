import Link from 'next/link'
import { Heart, Mail, Phone, Twitter, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
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
              <Facebook size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white border border-brand-border text-brand-inkSoft flex items-center justify-center hover:bg-brand-deepGreen hover:text-white hover:border-brand-deepGreen transition-all shadow-sm">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white border border-brand-border text-brand-inkSoft flex items-center justify-center hover:bg-brand-deepGreen hover:text-white hover:border-brand-deepGreen transition-all shadow-sm">
              <Twitter size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white border border-brand-border text-brand-inkSoft flex items-center justify-center hover:bg-brand-deepGreen hover:text-white hover:border-brand-deepGreen transition-all shadow-sm">
              <Linkedin size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white border border-brand-border text-brand-inkSoft flex items-center justify-center hover:bg-brand-danger hover:text-white hover:border-brand-danger transition-all shadow-sm">
              <Youtube size={16} />
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
