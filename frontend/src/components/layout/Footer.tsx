import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-brand-border/60 py-12 mt-auto">
      <div className="max-w-shell-desktop mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="col-span-1 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-premium rounded-xl flex items-center justify-center shadow-sm text-white">
              <span className="font-extrabold text-lg font-sans tracking-tighter">S</span>
            </div>
            <div className="flex items-baseline leading-none">
              <span className="text-xl font-black text-brand-ink tracking-tight font-sans">Sehat</span>
              <span className="text-xl font-black text-brand-saffron tracking-tight font-sans">Mitra</span>
            </div>
          </div>
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
            <Link href="/dashboard" className="hover:text-brand-deepGreen transition-colors">Dashboard</Link>
            <Link href="/awareness" className="hover:text-brand-deepGreen transition-colors">Health Info</Link>
            <Link href="/settings" className="hover:text-brand-deepGreen transition-colors">Settings</Link>
          </div>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="font-bold text-brand-ink mb-4">Legal</h4>
          <div className="flex flex-col gap-3 text-sm font-medium text-brand-inkSoft">
            <span className="hover:text-brand-deepGreen transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-brand-deepGreen transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-brand-deepGreen transition-colors cursor-pointer">Contact Us</span>
          </div>
        </div>

      </div>
      
      <div className="max-w-shell-desktop mx-auto px-6 mt-12 pt-6 border-t border-brand-border/40 text-center text-xs text-brand-inkSoft font-medium">
        © {new Date().getFullYear()} SehatMitra. All rights reserved.
      </div>
    </footer>
  )
}
