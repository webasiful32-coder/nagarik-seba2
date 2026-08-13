import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { stats } from '@/lib/services'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="hero-gradient py-20 text-center text-white">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">আমাদের সম্পর্কে</h1>
        <p className="text-violet-100 text-lg max-w-2xl mx-auto px-4">বাংলাদেশের সরকারি সেবাকে সহজলভ্য ও ডিজিটাল করার লক্ষ্যে আমাদের যাত্রা</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">আমাদের লক্ষ্য</h2>
            <p className="text-gray-600 leading-relaxed mb-4">ডিজিটাল শেবা বিডি বাংলাদেশের সকল নাগরিককে সরকারি সেবা সহজে পেতে সাহায্য করে। আমরা বিশ্বাস করি প্রযুক্তি ব্যবহার করে সরকারি সেবাকে আরো দ্রুত, সহজ এবং সাশ্রয়ী করা সম্ভব।</p>
            <div className="space-y-3">
              {['দ্রুত ও নির্ভরযোগ্য সেবা', 'Supabase দ্বারা সম্পূর্ণ নিরাপদ', '২৪/৭ কাস্টমার সাপোর্ট', 'সাশ্রয়ী মূল্যে সর্বোচ্চ মানের সেবা'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle size={20} className="text-[#7c3aed] flex-shrink-0" /> {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl font-bold text-[#7c3aed]">{s.value}</div>
                <div className="text-gray-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#4c1d95] to-[#7c3aed] rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">আজই যোগ দিন</h2>
          <p className="text-violet-100 mb-6">বিনামূল্যে অ্যাকাউন্ট খুলুন এবং সকল সেবা উপভোগ করুন</p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#7c3aed] font-bold rounded-xl hover:bg-violet-50 transition-all">
            রেজিস্ট্রেশন করুন <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
