'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, UserPlus, Phone, Mail, User, Lock, CreditCard, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '', phone: '', email: '', nid: '',
    password: '', confirmPassword: '', agreeTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.phone || !form.password) { setError('সকল প্রয়োজনীয় তথ্য পূরণ করুন'); return }
    if (form.phone.length < 11) { setError('সঠিক মোবাইল নম্বর দিন (১১ সংখ্যা)'); return }
    if (form.password.length < 6) { setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'); return }
    if (form.password !== form.confirmPassword) { setError('পাসওয়ার্ড মিলছে না'); return }
    if (!form.agreeTerms) { setError('শর্তাবলী মেনে নিতে হবে'); return }
    if (!form.email) { setError('ইমেইল দিতে হবে (Supabase Authentication এর জন্য প্রয়োজন)'); return }

    setLoading(true)

    // ১. আগে চেক করো ফোন নাম্বারটি ব্যবহার হয়েছে কি না
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', form.phone)
      .maybeSingle()

    if (existingProfile) {
      setError('এই মোবাইল নম্বর দিয়ে আগেই রেজিস্ট্রেশন করা হয়েছে')
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          phone: form.phone,
          nid: form.nid || null,
        }
      }
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('এই ইমেইল দিয়ে আগেই রেজিস্ট্রেশন করা হয়েছে')
      } else if (signUpError.message.includes('Database error saving new user')) {
        setError('ডাটাবেজ এ সেভ করতে সমস্যা হচ্ছে। এই মোবাইল বা ইমেইল আগে ব্যবহার হয়ে থাকতে পারে।')
      } else {
        setError(signUpError.message)
      }
      setLoading(false)
      return
    }

    setLoading(false)
    setSuccess(true)

    // Email confirmation না থাকলে সরাসরি dashboard এ যাও
    if (data.session) {
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#dcfce7] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-violet-300 blur-3xl"></div>
        </div>
        <div className="relative z-10 text-white text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold">ন</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">নাগরিক সেবা</h1>
          <p className="text-violet-100 text-lg mb-10 leading-relaxed">বাংলাদেশের সকল সরকারি সেবা এক জায়গায়</p>
          <div className="space-y-4 text-left">
            {['NID ও স্মার্টকার্ড সেবা', 'জন্ম নিবন্ধন সেবা', 'TIN ও ট্যাক্স সেবা', '২৪/৭ কাস্টমার সাপোর্ট', 'সম্পূর্ণ বিনামূল্যে রেজিস্ট্রেশন'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white">
                <CheckCircle size={20} className="text-violet-300 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#8b5cf6] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">ড</span>
              </div>
              <div className="text-left">
                <div className="text-[#7c3aed] font-bold text-xl">নাগরিক সেবা</div>
                <div className="text-gray-400 text-xs">Digital Sheba BD</div>
              </div>
            </Link>
          </div>

          {success ? (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-[#7c3aed]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">রেজিস্ট্রেশন সম্পন্ন! 🎉</h2>
              <p className="text-gray-500 mb-2">আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে</p>
              <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-xl">
                📧 আপনার ইমেইলে একটি confirmation link পাঠানো হয়েছে। লগইন করতে ইমেইল confirm করুন।
              </p>
              <Link href="/auth/login" className="mt-4 inline-block px-6 py-3 btn-primary text-white rounded-xl font-bold">
                লগইন পেজে যান
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">নতুন অ্যাকাউন্ট</h2>
                <p className="text-gray-500 mt-1">আজই বিনামূল্যে রেজিস্ট্রেশন করুন</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">পূর্ণ নাম <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="আপনার পূর্ণ নাম" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" required />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নম্বর <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX" maxLength={11} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" required />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="example@gmail.com" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" required />
                  </div>
                </div>



                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="কমপক্ষে ৬ অক্ষর" className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="পাসওয়ার্ড আবার লিখুন" className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" required />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">পাসওয়ার্ড মিলছে না</p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input type="checkbox" name="agreeTerms" id="terms" checked={form.agreeTerms} onChange={handleChange} className="mt-0.5 w-4 h-4 accent-[#7c3aed]" />
                  <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                    আমি <Link href="/terms" className="text-[#7c3aed] hover:underline font-medium">শর্তাবলী</Link> ও <Link href="/privacy" className="text-[#7c3aed] hover:underline font-medium">গোপনীয়তা নীতি</Link> মেনে নিচ্ছি
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl animate-fade-in">
                    ⚠️ {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 btn-primary text-white font-bold rounded-xl text-lg">
                  {loading ? <><div className="w-5 h-5 spinner"></div> রেজিস্ট্রেশন হচ্ছে...</> : <><UserPlus size={20} /> রেজিস্ট্রেশন করুন</>}
                </button>

                <p className="text-center text-sm text-gray-500">
                  ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                  <Link href="/auth/login" className="text-[#7c3aed] font-bold hover:underline">লগইন করুন</Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
