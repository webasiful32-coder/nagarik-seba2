import Link from 'next/link'
import { Mail, MapPin, MessageCircle, ArrowRight, Shield, Clock, Star } from 'lucide-react'

// Facebook ও Youtube lucide-react থেকে remove হয়েছে তাই SVG দিয়ে বানানো হয়েছে
const FacebookIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const YoutubeIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
)

const quickLinks = [
  { href: '/', label: 'হোম' },
  { href: '/auth/register', label: 'রেজিস্ট্রেশন' },
  { href: '/auth/login', label: 'লগইন' },
  { href: '/dashboard', label: 'ড্যাশবোর্ড' },
  { href: '/dashboard/orders', label: 'অর্ডার লিস্ট' },
]

const popularServices = [
  'NID কপি',
  'স্মার্ট কার্ড',
  'TIN ডাউনলোড',
  'জন্ম নিবন্ধন',
  'বায়োমেট্রিক তথ্য',
  'ভোটার লিস্ট',
]

const trustBadges = [
  { icon: Shield, label: '১০০% নিরাপদ' },
  { icon: Clock, label: '২৪/৭ সেবা' },
  { icon: Star, label: 'বিশ্বস্ত প্ল্যাটফর্ম' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0f0329]">
      {/* gradient blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-violet-700/20 blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-fuchsia-700/15 blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* ── top strip: trust badges ── */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-violet-300 text-sm font-semibold">
              <Icon size={16} className="text-violet-400" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── main grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-[0_4px_20px_rgba(124,58,237,0.5)]">
                <span className="text-white font-black text-xl">ন</span>
              </div>
              <div>
                <div className="text-white font-black text-lg leading-tight">নাগরিক সেবা</div>
                <div className="text-violet-400 text-[11px] font-medium tracking-wide">Nagarik Sheba</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              বাংলাদেশের সকল সরকারি সেবা এখন এক জায়গায়। দ্রুত, সহজ এবং সম্পূর্ণ নির্ভরযোগ্য।
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 group"
              >
                <FacebookIcon size={17} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
              >
                <YoutubeIcon size={17} />
              </a>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300"
              >
                <MessageCircle size={17} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-violet-500 rounded-full inline-block" />
              দ্রুত লিংক
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-gray-400 hover:text-violet-300 transition-colors text-sm group"
                  >
                    <ArrowRight size={13} className="text-violet-600 group-hover:translate-x-1 transition-transform" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular services */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-violet-500 rounded-full inline-block" />
              জনপ্রিয় সেবা
            </h3>
            <ul className="space-y-3">
              {popularServices.map(s => (
                <li key={s} className="flex items-center gap-2 text-gray-400 text-sm hover:text-violet-300 transition-colors cursor-pointer group">
                  <span className="w-5 h-5 rounded-md bg-violet-900/60 flex items-center justify-center text-violet-400 text-[10px] font-black group-hover:bg-violet-700/60 transition-colors flex-shrink-0">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-violet-500 rounded-full inline-block" />
              যোগাযোগ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-900/50 border border-violet-700/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={15} className="text-violet-400" />
                </div>
                <span className="text-gray-400 text-sm leading-relaxed">ঢাকা, বাংলাদেশ</span>
              </li>
              <li>
                <Link
                  href="https://wa.me/message/JJZIWPGL7JTXB1"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#25D366", // WhatsApp Green
                    fontWeight: "600",
                    textDecoration: "none"
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.88-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  WhatsApp এ মেসেজ দিন
                </Link>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-900/50 border border-violet-700/30 flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-violet-400" />
                </div>
                <a href="mailto:support@digitalshebabd.com" className="text-gray-400 text-sm hover:text-violet-300 transition-colors break-all leading-relaxed">
                  support@digitalshebabd.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── bottom bar ── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs text-center sm:text-left">
            © ২০২৬ <span className="text-violet-400 font-semibold">নাগরিক সেবা</span>। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-violet-300 transition-colors">গোপনীয়তা নীতি</Link>
            <span className="text-gray-700">|</span>
            <Link href="/terms" className="hover:text-violet-300 transition-colors">শর্তাবলী</Link>
            <span className="text-gray-700">|</span>
            <Link href="/contact" className="hover:text-violet-300 transition-colors">যোগাযোগ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}