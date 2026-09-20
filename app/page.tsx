'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { categories } from '@/lib/services'
import { Search, Loader2, CreditCard, ClipboardList, FileText, ShieldCheck, Headphones, Zap, Trophy, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const coreServices = [
  {
    icon: <span className="text-2xl">🪪</span>,
    title: 'NID সেবা',
    desc: 'ভোটার আইডি কার্ড তৈরি ও হারানো আইডি কার্ড ডাউনলোড করুন',
    color: 'bg-blue-100',
  },
  {
    icon: <CreditCard size={24} className="text-teal-600" />,
    title: 'স্মার্টকার্ড সেবা',
    desc: 'স্মার্টকার্ড ডাউনলোড এবং আপগ্রেড করতে আবেদন করুন',
    color: 'bg-teal-100',
  },
  {
    icon: <ClipboardList size={24} className="text-pink-600" />,
    title: 'জন্ম নিবন্ধন সেবা',
    desc: 'অনলাইনে জন্ম নিবন্ধন সনদ ডাউনলোড এবং সংশোধন করুন',
    color: 'bg-pink-100',
  },
  {
    icon: <FileText size={24} className="text-green-600" />,
    title: 'TIN সেবা',
    desc: 'ইলেক্ট্রনিক ট্যাক্স আইডেন্টিফিকেশন নম্বর রেজিস্ট্রেশন ও ডাউনলোড করুন',
    color: 'bg-green-100',
  },
]

const whyUs = [
  {
    icon: <Zap size={24} className="text-violet-700" />,
    title: 'সরল ও দ্রুত প্রক্রিয়া',
    desc: 'আমাদের অনলাইন প্ল্যাটফর্ম ব্যবহার করে ঘরে বসেই আবেদন করুন',
  },
  {
    icon: <Headphones size={24} className="text-violet-700" />,
    title: '২৪/৭ গ্রাহক সেবা',
    desc: 'আমাদের দক্ষ সাপোর্ট টিম সর্বদা আপনার পাশে থেকে সেবা দিতে প্রস্তুত',
  },
  {
    icon: <ShieldCheck size={24} className="text-violet-700" />,
    title: 'নির্ভরযোগ্য ও নিরাপদ',
    desc: 'আমাদের নিরাপদ প্ল্যাটফর্ম আপনার পরিচয়পত্র ও তথ্য সুরক্ষিত রাখে',
  },
  {
    icon: <Trophy size={24} className="text-violet-700" />,
    title: 'বিশ্বস্ত কর্মদল',
    desc: 'আমাদের বিশেষ টিন সেবা গ্রহণ করে অংশীদারদের সুবিধা উপভোগ করুন',
  },
]

export default function HomePage() {
  const [services, setServices] = useState<any[]>([])
  const [stats, setStats] = useState([
    { icon: '⚡', value: '...', label: 'মোট সেবা সংখ্যা' },
    { icon: '👥', value: '...', label: 'মোট ব্যবহারকারী' },
    { icon: '👤', value: '৭,৬২৯', label: 'মোট উদ্যোক্তা' },
    { icon: '🏢', value: '৩২৯', label: 'মোট সেন্টার' },
  ])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: servicesData } = await supabase.from('services').select('*')
        const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

        setServices(servicesData || [])
        setStats(prev => [
          { ...prev[0], value: `${servicesData?.length || 0}+` },
          { ...prev[1], value: (Number(count || 0) + 339714).toLocaleString('bn-BD') },
          prev[2],
          prev[3]
        ])
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredServices = services.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory
    const matchSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.title_en && s.title_en.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2e1065] via-[#7c3aed] to-[#a855f7] pt-12 pb-24 sm:pt-20 sm:pb-32">
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-white opacity-10 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full bg-violet-300 opacity-20 blur-[160px] translate-x-1/4 translate-y-1/4" />

        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4 drop-shadow-lg leading-tight animate-float">
            নাগরিক সেবা
          </h1>
          <p className="text-violet-100 text-sm sm:text-lg md:text-xl mb-1 sm:mb-2 font-medium">
            {stats[1].value} ব্যবহারকারী আমাদের সাথে যুক্ত
          </p>
          <p className="text-violet-100 text-sm sm:text-lg md:text-xl mb-6 sm:mb-8 font-medium">
            লগইন ছাড়াই সরাসরি সকল সেবা ও ড্যাশবোর্ড দেখুন
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 sm:px-10 sm:py-4 bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white font-black rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
            >
              <span>সরাসরি ড্যাশবোর্ডে প্রবেশ করুন</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 -mt-16 sm:-mt-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-orange-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-md">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{s.icon}</div>
              <div className="text-lg sm:text-2xl font-black text-gray-800 leading-tight">{s.value}</div>
              <div className="text-gray-500 text-[11px] sm:text-sm mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CORE SERVICES ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
            NID, স্মার্টকার্ড, TIN, জন্ম নিবন্ধন সহ
          </h2>
          <p className="text-gray-500 mt-2 text-base font-medium">
            {services.length}টিরও বেশি সরকারি সেবা এখন আপনার হাতের মুঠোয়
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {coreServices.map((cs, i) => (
            <Link
              key={i}
              href="/dashboard"
              className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-blue-400 hover:-translate-y-1 transition-all flex items-start gap-4 text-left shadow-sm group"
            >
              <div className={`w-12 h-12 ${cs.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0`}>
                {cs.icon}
              </div>
              <div>
                <h3 className="font-black text-gray-800 mb-1">{cs.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{cs.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 text-center mb-10">
            কেন আমাদের সেবা ব্যবহার করবেন?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {whyUs.map((w, i) => (
              <div key={i} className="group">
                <div className="w-16 h-16 mx-auto bg-violet-50 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-sm">
                  {w.icon}
                </div>
                <h3 className="font-black text-gray-800 text-sm mb-2">{w.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL SERVICES ── */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">সকল সেবাসমূহ</h2>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="সেবা খুঁজুন..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm w-56 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredServices.map(s => (
              <Link
                key={s.id}
                href="/dashboard"
                className="bg-emerald-50 rounded-2xl p-5 text-center border border-emerald-100 shadow-sm hover:shadow-md transition group"
              >
                <div className={`w-14 h-14 ${s.color || 'bg-purple-100'} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
                <p className="text-sm font-bold text-gray-800 leading-tight mb-2 line-clamp-2">{s.title}</p>
                <div className="inline-flex items-center px-2.5 py-1 bg-violet-50 text-[#7c3aed] rounded-full text-[10px] font-black border border-violet-100">
                  <span>৳ {s.price}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}