'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="hero-gradient py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-3">যোগাযোগ করুন</h1>
        <p className="text-violet-100">আমরা সবসময় আপনার সাহায্যে প্রস্তুত</p>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">আমাদের সাথে যোগাযোগ</h2>
            <div className="space-y-4">
              {[
                { icon: Phone, label: 'ফোন', value: '', href: 'tel:' },
                { icon: Mail, label: 'ইমেইল', value: 'support@digitalshebabd.com', href: 'mailto:support@digitalshebabd.com' },
                
              ].map((item, i) => (
                <a key={i} href={item.href} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#7c3aed] transition-colors">
                  <div className="w-12 h-12 bg-[#e8f5e9] rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon size={20} className="text-[#7c3aed]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-medium text-gray-800">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-[#7c3aed]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">বার্তা পাঠানো হয়েছে!</h3>
                <p className="text-gray-500">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-5">বার্তা পাঠান</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম</label>
                    <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="নাম লিখুন" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নম্বর</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="01XXXXXXXXX" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">বার্তা</label>
                    <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="আপনার বার্তা লিখুন..." rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm resize-none" required></textarea>
                  </div>
                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 btn-primary text-white font-bold rounded-xl">
                    {loading ? <><div className="w-4 h-4 spinner"></div> পাঠানো হচ্ছে...</> : <><Send size={18} /> বার্তা পাঠান</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
