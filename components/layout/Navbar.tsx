'use client'
import Link from 'next/link'
import { LayoutDashboard, ArrowRight } from 'lucide-react'

const WHATSAPP_LINK = "https://wa.me/message/XL3KF7UP7WZOL1"

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-xs">
      {/* টপ ব্যানার */}
      <div className="bg-[#4c1d95] text-purple-100 text-[11px] sm:text-xs py-1.5 px-4 flex justify-between items-center">
        <span className="flex items-center gap-1.5">
          <span>🇧🇩</span>
          <span>বাংলাদেশের সহজ নাগরিক সেবা প্ল্যাটফর্ম</span>
        </span>
        <span className="hidden sm:inline text-purple-200">📞 01602797394</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* লোগো */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#9333ea] flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              ন
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black text-gray-900 block leading-tight">
                নাগরিক সেবা
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium tracking-wider">
                Nagarik Sheba
              </span>
            </div>
          </Link>

          {/* মেনু লিঙ্কসমূহ */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-gray-700 hover:text-[#7c3aed] transition-colors">
              হোম
            </Link>
            <Link href="/dashboard" className="text-sm font-bold text-gray-700 hover:text-[#7c3aed] transition-colors">
              সেবাসমূহ
            </Link>
            <Link href="/about" className="text-sm font-bold text-gray-700 hover:text-[#7c3aed] transition-colors">
              আমাদের সম্পর্কে
            </Link>
            <Link href="/contact" className="text-sm font-bold text-gray-700 hover:text-[#7c3aed] transition-colors">
              যোগাযোগ
            </Link>
          </div>

          {/* ডানদিকের অ্যাকশন বাটনসমূহ */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* WhatsApp মেসেজ বাটন */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-[#00c853] hover:bg-[#00b34a] text-white font-bold text-xs sm:text-sm rounded-full shadow-md transition-all hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.88-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp এ মেসেজ দিন</span>
            </a>

            {/* 🔥 লগইন ও রেজিস্ট্রেশন বাটন সরিয়ে এখানে আকর্ষণীয় "ড্যাশবোর্ড" বাটন */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#9333ea] hover:from-[#6d28d9] hover:to-[#7e22ce] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <LayoutDashboard size={16} />
              <span>ড্যাশবোর্ড / সেবাসমূহ</span>
              <ArrowRight size={14} className="hidden sm:inline" />
            </Link>
          </div>

        </div>
      </div>
    </nav>
  )
}