export interface Service {
  id: string
  title: string
  titleEn: string
  description: string
  icon: string
  color: string
  category: string
  price: number
  popular?: boolean
  inputLabel?: string
  inputPlaceholder?: string
}

export const services: Service[] = [
  // NID সেবা
  { id: 'server-copy', title: 'সার্ভার কপি', titleEn: 'Server Copy', description: 'NID কার্ডের তথ্য যাচাই (সার্ভার কপি)', icon: '📋', color: 'bg-blue-400', category: 'nid', price: 18, popular: true, inputLabel: 'আইডি নাম্বার ও জন্ম তারিখ', inputPlaceholder: 'আইডি নাম্বার / জন্ম তারিখ (DD/MM/YYYY)' },
  { id: 'sign-copy', title: 'সাইন কপি', titleEn: 'Sign Copy', description: 'NID কার্ডের সাইন কপি সংগ্রহ', icon: '🖋️', color: 'bg-blue-500', category: 'nid', price: 18, inputLabel: 'ভোটার/আইডি নাম্বার', inputPlaceholder: 'ভোটার নাম্বার বা আইডি নাম্বার দিন' },
  { id: 'nid-pdf', title: 'NID কার্ড PDF', titleEn: 'NID Card PDF', description: 'অরিজিনাল জাতীয় পরিচয়পত্রের PDF', icon: '🪪', color: 'bg-indigo-600', category: 'nid', price: 33, popular: true, inputLabel: 'আইডি নাম্বার ও জন্ম তারিখ', inputPlaceholder: 'আইডি নাম্বার / জন্ম তারিখ (DD/MM/YYYY)' },
  { id: 'form-sign-copy', title: 'ফরম নং → সাইন কপি', titleEn: 'Form to Sign Copy', description: 'ফরম নাম্বার দিয়ে সাইন কপি সংগ্রহ', icon: '📝', color: 'bg-indigo-500', category: 'nid', price: 23, inputLabel: 'ফরম নাম্বার', inputPlaceholder: 'ফরম নাম্বার দিন' },
  { id: 'nid-voter-number', title: 'NID ভোটার নাম্বার দিয়ে সার্ভিস', titleEn: 'NID service by Voter Number', description: 'ভোটার নাম্বার দিয়ে NID সেবা', icon: '🗳️', color: 'bg-teal-500', category: 'nid', price: 45, inputLabel: 'ভোটার নাম্বার', inputPlaceholder: 'ভোটার নাম্বার দিন' },
  { id: 'official-server-copy', title: 'অফিসিয়াল সার্ভার কপি', titleEn: 'Official Server Copy', description: 'সরকারি অফিসিয়াল সার্ভার কপি', icon: '🏛️', color: 'bg-blue-800', category: 'nid', price: 59, inputLabel: 'আইডি নাম্বার ও জন্ম তারিখ', inputPlaceholder: 'আইডি নাম্বার / জন্ম তারিখ (DD/MM/YYYY)' },
  { id: 'nid-correction', title: 'NID সংশোধন', titleEn: 'NID Correction', description: 'NID সংশোধন আবেদন', icon: '✏️', color: 'bg-blue-600', category: 'nid', price: 120, inputLabel: 'আইডি নাম্বার ও সংশোধনের তথ্য', inputPlaceholder: 'আইডি নাম্বার ও কী সংশোধন করতে চান লিখুন' },
  { id: 'nid-address-change', title: 'NID ঠিকানা পরিবর্তন', titleEn: 'NID Address Change', description: 'জাতীয় পরিচয়পত্রের ঠিকানা আপডেট', icon: '🏠', color: 'bg-blue-300', category: 'nid', price: 80, inputLabel: 'আইডি নাম্বার ও নতুন ঠিকানা', inputPlaceholder: 'আইডি নাম্বার / নতুন ঠিকানা লিখুন' },
  { id: 'smart-id-card', title: 'স্মার্ট ID কার্ড', titleEn: 'Smart ID Card', description: 'অরিজিনাল স্মার্ট আইডি কার্ড কপি', icon: '💳', color: 'bg-purple-700', category: 'nid', price: 699, popular: true, inputLabel: 'নাম ও আইডি নাম্বার', inputPlaceholder: 'পূর্ণ নাম / আইডি নাম্বার দিন' },
  { id: 'mobile-number-id-card', title: 'মোবাইল নাম্বার দিয়ে ID কার্ড', titleEn: 'ID Card by Mobile Number', description: 'মোবাইল নাম্বার দিয়ে ID কার্ড', icon: '📱', color: 'bg-purple-700', category: 'nid', price: 115, popular: true, inputLabel: 'মোবাইল নাম্বার', inputPlaceholder: 'মোবাইল নাম্বার' },
  { id: 'mobile-number-server-copy', title: 'মোবাইল নাম্বার দিয়ে সার্ভার কপি', titleEn: 'Server Copy by Mobile Number', description: 'মোবাইল নাম্বার দিয়ে সার্ভার কপি', icon: '📋', color: 'bg-purple-700', category: 'nid', price: 115, popular: true, inputLabel: 'মোবাইল নাম্বার', inputPlaceholder: 'মোবাইল নাম্বার' },
  { id: 'mobile-number-sign-copy', title: 'মোবাইল নাম্বার দিয়ে সাইন কপি', titleEn: 'Sign Copy by Mobile Number', description: 'মোবাইল নাম্বার দিয়ে সাইন কপি', icon: '🖋️', color: 'bg-purple-700', category: 'nid', price: 115, popular: true, inputLabel: 'মোবাইল নাম্বার', inputPlaceholder: 'মোবাইল নাম্বার' },
  { id: 'name-address-id-card', title: 'নাম ঠিকানা দিয়ে আইডি কার্ড', titleEn: 'ID Card by Name & Address', description: 'নাম ও ঠিকানা দিয়ে আইডি কার্ড অনুসন্ধান', icon: '🪪', color: 'bg-purple-700', category: 'nid', price: 185, popular: true, inputLabel: 'প্রয়োজনীয় তথ্য', inputPlaceholder: 'নিজের নাম / পিতার নাম / মাতার নাম / জেলা / উপজেলা / থানা / গ্রাম' },

  // জন্ম নিবন্ধন
  { id: 'new-birth-reg', title: 'নতুন জন্মনিবন্ধন', titleEn: 'New Birth Registration', description: 'সম্পূর্ণ নতুন জন্মনিবন্ধন আবেদন', icon: '👶', color: 'bg-green-700', category: 'birth', price: 510, inputLabel: 'নাম ও জন্ম তারিখ', inputPlaceholder: 'শিশুর নাম / জন্ম তারিখ / পিতামাতার নাম' },
  { id: 'birth-copy', title: 'জন্ম নিবন্ধন কপি', titleEn: 'Birth Reg Copy', description: 'জন্মনিবন্ধন সনদের ডিজিটাল কপি', icon: '📄', color: 'bg-green-500', category: 'birth', price: 35, popular: true, inputLabel: 'জন্ম নিবন্ধন নাম্বার', inputPlaceholder: 'জন্ম নিবন্ধন নাম্বার দিন' },
  { id: 'birth-correction', title: 'জন্মনিবন্ধন সংশোধন', titleEn: 'Birth Reg Correction', description: 'জন্মনিবন্ধনের তথ্য সংশোধন', icon: '✏️', color: 'bg-green-600', category: 'birth', price: 200, inputLabel: 'জন্ম নিবন্ধন নাম্বার ও সংশোধনের তথ্য', inputPlaceholder: 'জন্ম নিবন্ধন নাম্বার / কী সংশোধন করতে চান' },
  { id: 'death-certificate', title: 'মৃত্যু সনদ', titleEn: 'Death Certificate', description: 'মৃত্যু নিবন্ধন সনদ সংগ্রহ', icon: '📜', color: 'bg-gray-600', category: 'birth', price: 150, inputLabel: 'মৃত ব্যক্তির নাম ও তথ্য', inputPlaceholder: 'মৃত ব্যক্তির নাম / মৃত্যু তারিখ' },

  // TIN / ট্যাক্স
  { id: 'tin-certificate', title: 'টিন সার্টিফিকেট', titleEn: 'TIN Certificate', description: 'নতুন বা পুরাতন টিন সার্টিফিকেট', icon: '📄', color: 'bg-orange-600', category: 'tax', price: 59, inputLabel: 'আইডি কার্ড নাম্বার', inputPlaceholder: 'জাতীয় পরিচয়পত্র নাম্বার দিন' },
  { id: 'tin-new', title: 'নতুন TIN রেজিস্ট্রেশন', titleEn: 'New TIN Registration', description: 'নতুন ট্যাক্স আইডেন্টিফিকেশন নম্বর', icon: '🧾', color: 'bg-orange-500', category: 'tax', price: 99, inputLabel: 'আইডি কার্ড নাম্বার ও নাম', inputPlaceholder: 'আইডি নাম্বার / পূর্ণ নাম দিন' },
  { id: 'income-tax-return', title: 'আয়কর রিটার্ন', titleEn: 'Income Tax Return', description: 'বার্ষিক আয়কর রিটার্ন জমা', icon: '💼', color: 'bg-orange-700', category: 'tax', price: 350, inputLabel: 'TIN নাম্বার', inputPlaceholder: 'TIN নাম্বার দিন' },

  // মোবাইল সেবা
  { id: 'sim-biometric', title: 'সিম বায়োমেট্রিক', titleEn: 'SIM Biometric', description: 'বায়োমেট্রিক দিয়ে সিম তথ্য যাচাই', icon: '📲', color: 'bg-pink-600', category: 'mobile', price: 49, inputLabel: 'মোবাইল নাম্বার', inputPlaceholder: '01XXXXXXXXX নাম্বার দিন' },
  { id: 'call-list', title: '৩ মাস কল লিস্ট', titleEn: '3 Months Call List', description: 'মোবাইলের ৩ মাসের কল রেকর্ড', icon: '📞', color: 'bg-cyan-600', category: 'mobile', price: 349, inputLabel: 'মোবাইল নাম্বার', inputPlaceholder: '01XXXXXXXXX নাম্বার দিন' },
  { id: 'sms-list', title: '৩ মাস SMS লিস্ট', titleEn: '3 Months SMS List', description: 'মোবাইলের ৩ মাসের SMS রেকর্ড', icon: '💬', color: 'bg-cyan-700', category: 'mobile', price: 349, inputLabel: 'মোবাইল নাম্বার', inputPlaceholder: '01XXXXXXXXX নাম্বার দিন' },
  { id: 'imei-number', title: 'IMEI টু নাম্বার', titleEn: 'IMEI to Number', description: 'IMEI দিয়ে সক্রিয় নাম্বার বের করুন', icon: '📱', color: 'bg-cyan-500', category: 'mobile', price: 210, inputLabel: 'IMEI নাম্বার', inputPlaceholder: '15 সংখ্যার IMEI নাম্বার দিন' },
  { id: 'bkash-info', title: 'বিকাশ তথ্য', titleEn: 'Bkash Info', description: 'বিকাশ একাউন্টের তথ্য অনুসন্ধান', icon: '💰', color: 'bg-pink-500', category: 'mobile', price: 399, inputLabel: 'বিকাশ নাম্বার', inputPlaceholder: 'বিকাশ নাম্বার দিন (01XXXXXXXXX)' },
  { id: 'nagad-info', title: 'নগদ তথ্য', titleEn: 'Nagad Info', description: 'নগদ একাউন্টের তথ্য অনুসন্ধান', icon: '💸', color: 'bg-orange-500', category: 'mobile', price: 399, inputLabel: 'নগদ নাম্বার', inputPlaceholder: 'নগদ নাম্বার দিন (01XXXXXXXXX)' },
  { id: 'rocket-info', title: 'রকেট তথ্য', titleEn: 'Rocket Info', description: 'ডাচ বাংলা রকেট তথ্য অনুসন্ধান', icon: '🚀', color: 'bg-purple-500', category: 'mobile', price: 399, inputLabel: 'রকেট নাম্বার', inputPlaceholder: 'রকেট নাম্বার দিন (01XXXXXXXXX)' },

  // লোকেশন ট্র্যাকিং
  { id: 'number-location', title: 'নম্বর টু লোকেশন', titleEn: 'Number to Location', description: 'মোবাইল নম্বর দিয়ে লোকেশন ট্র্যাকিং', icon: '📍', color: 'bg-red-500', category: 'location', price: 170, popular: true, inputLabel: 'মোবাইল নাম্বার', inputPlaceholder: '01XXXXXXXXX নাম্বার দিন' },
  { id: 'live-location', title: 'লাইভ লোকেশন', titleEn: 'Live Location', description: 'রিয়েলটাইম লোকেশন ট্র্যাকিং', icon: '🗺️', color: 'bg-red-600', category: 'location', price: 250, inputLabel: 'মোবাইল নাম্বার', inputPlaceholder: '01XXXXXXXXX নাম্বার দিন' },

  // সনদপত্র
  { id: 'bmet-service', title: 'BMET সেবা', titleEn: 'BMET Service', description: 'বৈদেশিক কর্মসংস্থান সংক্রান্ত সেবা', icon: '✈️', color: 'bg-sky-600', category: 'cert', price: 210, inputLabel: 'পাসপোর্ট / আইডি নাম্বার', inputPlaceholder: 'পাসপোর্ট নাম্বার বা আইডি নাম্বার দিন' },
  { id: 'police-clearance', title: 'পুলিশ ক্লিয়ারেন্স', titleEn: 'Police Clearance', description: 'পুলিশ ক্লিয়ারেন্স সার্টিফিকেট', icon: '👮', color: 'bg-blue-700', category: 'cert', price: 300, inputLabel: 'আইডি নাম্বার ও ঠিকানা', inputPlaceholder: 'আইডি নাম্বার / স্থায়ী ঠিকানা দিন' },
  { id: 'char-certificate', title: 'চারিত্রিক সনদ', titleEn: 'Character Certificate', description: 'চারিত্রিক সনদপত্র সংগ্রহ', icon: '🎓', color: 'bg-teal-600', category: 'cert', price: 100, inputLabel: 'নাম ও ঠিকানা', inputPlaceholder: 'পূর্ণ নাম / ঠিকানা দিন' },
  { id: 'driving-license', title: 'ড্রাইভিং লাইসেন্স', titleEn: 'Driving License', description: 'ড্রাইভিং লাইসেন্স আবেদন ও নবায়ন', icon: '🚗', color: 'bg-yellow-600', category: 'cert', price: 350, inputLabel: 'আইডি নাম্বার ও নাম', inputPlaceholder: 'আইডি নাম্বার / পূর্ণ নাম দিন' },
  { id: 'passport-apply', title: 'পাসপোর্ট আবেদন', titleEn: 'Passport Apply', description: 'নতুন পাসপোর্ট আবেদন সহায়তা', icon: '🛂', color: 'bg-green-800', category: 'cert', price: 500, inputLabel: 'আইডি নাম্বার ও নাম', inputPlaceholder: 'আইডি নাম্বার / পূর্ণ নাম দিন' },

  // ট্রেড / ব্যবসা
  { id: 'trade-license', title: 'ট্রেড লাইসেন্স', titleEn: 'Trade License', description: 'ট্রেড লাইসেন্স আবেদন ও নবায়ন', icon: '🏪', color: 'bg-yellow-700', category: 'trade', price: 600, inputLabel: 'ব্যবসার নাম ও ঠিকানা', inputPlaceholder: 'ব্যবসার নাম / ঠিকানা দিন' },
  { id: 'company-reg', title: 'কোম্পানি রেজিস্ট্রেশন', titleEn: 'Company Registration', description: 'ব্যবসা প্রতিষ্ঠান নিবন্ধন', icon: '🏢', color: 'bg-yellow-500', category: 'trade', price: 1500, inputLabel: 'কোম্পানির নাম ও তথ্য', inputPlaceholder: 'কোম্পানির নাম / ধরন / মালিকের নাম' },
  { id: 'vat-reg', title: 'VAT রেজিস্ট্রেশন', titleEn: 'VAT Registration', description: 'ভ্যাট নিবন্ধন ও সনদ', icon: '🧾', color: 'bg-amber-600', category: 'trade', price: 400, inputLabel: 'TIN নাম্বার ও ব্যবসার নাম', inputPlaceholder: 'TIN নাম্বার / ব্যবসার নাম দিন' },

  // ভূমি সেবা
  { id: 'land-service', title: 'ভূমি সেবা', titleEn: 'Land Service', description: 'খতিয়ান ও দাগের তথ্য যাচাই', icon: '🏡', color: 'bg-lime-700', category: 'land', price: 100, popular: true, inputLabel: 'দাগ নাম্বার ও মৌজা', inputPlaceholder: 'দাগ নাম্বার / মৌজা / জেলা দিন' },
  { id: 'land-mutation', title: 'নামজারি আবেদন', titleEn: 'Land Mutation', description: 'জমির নামজারি আবেদন প্রক্রিয়া', icon: '🗂️', color: 'bg-lime-600', category: 'land', price: 250, inputLabel: 'দাগ নাম্বার ও মালিকের নাম', inputPlaceholder: 'দাগ নাম্বার / মালিকের নাম / জেলা' },
  { id: 'land-record', title: 'জমির রেকর্ড', titleEn: 'Land Record', description: 'RS/BS/SA খতিয়ান ডাউনলোড', icon: '📑', color: 'bg-lime-800', category: 'land', price: 150, inputLabel: 'খতিয়ান নাম্বার ও জেলা', inputPlaceholder: 'খতিয়ান নাম্বার / জেলা / উপজেলা দিন' },
  { id: 'porcha-copy', title: 'পর্চা কপি', titleEn: 'Porcha Copy', description: 'ডিজিটাল পর্চা কপি সংগ্রহ', icon: '🗃️', color: 'bg-green-900', category: 'land', price: 80, inputLabel: 'দাগ নাম্বার ও মৌজা', inputPlaceholder: 'দাগ নাম্বার / মৌজা দিন' },

  // শিক্ষা সেবা
  { id: 'ssc-certificate', title: 'SSC সনদ', titleEn: 'SSC Certificate', description: 'SSC/দাখিল সনদের সত্যায়িত কপি', icon: '🎓', color: 'bg-purple-600', category: 'education', price: 200, inputLabel: 'রোল নাম্বার ও বোর্ড', inputPlaceholder: 'রোল নাম্বার / পাসের সাল / বোর্ড দিন' },
  { id: 'hsc-certificate', title: 'HSC সনদ', titleEn: 'HSC Certificate', description: 'HSC/আলিম সনদের সত্যায়িত কপি', icon: '📚', color: 'bg-purple-700', category: 'education', price: 200, inputLabel: 'রোল নাম্বার ও বোর্ড', inputPlaceholder: 'রোল নাম্বার / পাসের সাল / বোর্ড দিন' },
  { id: 'marksheet', title: 'মার্কশিট', titleEn: 'Mark Sheet', description: 'SSC/HSC মার্কশিটের কপি', icon: '📊', color: 'bg-violet-600', category: 'education', price: 150, inputLabel: 'রোল নাম্বার ও পরীক্ষার নাম', inputPlaceholder: 'রোল নাম্বার / পাসের সাল / পরীক্ষার নাম' },

  // অন্যান্য
  { id: 'make-cv', title: 'CV তৈরি', titleEn: 'Make CV', description: 'পেশাদার CV তৈরি করুন', icon: '📃', color: 'bg-violet-500', category: 'other', price: 50, inputLabel: 'নাম ও তথ্য', inputPlaceholder: 'আপনার নাম / পেশা / যোগাযোগ নাম্বার দিন' },
  { id: 'voter-list', title: 'ভোটার লিস্ট', titleEn: 'Voter List', description: 'ভোটার তালিকা ডাউনলোড', icon: '🗳️', color: 'bg-emerald-600', category: 'other', price: 30, inputLabel: 'এলাকার নাম ও ঠিকানা', inputPlaceholder: 'ইউনিয়ন / ওয়ার্ড / উপজেলা দিন' },
  { id: 'electric-bill', title: 'বিদ্যুৎ বিল', titleEn: 'Electric Bill', description: 'বিদ্যুৎ বিলের তথ্য ও পেমেন্ট', icon: '⚡', color: 'bg-yellow-400', category: 'other', price: 20, inputLabel: 'মিটার নাম্বার', inputPlaceholder: 'বিদ্যুৎ মিটার নাম্বার দিন' },
  { id: 'water-bill', title: 'পানি বিল', titleEn: 'Water Bill', description: 'ওয়াসা পানি বিলের তথ্য', icon: '💧', color: 'bg-blue-400', category: 'other', price: 20, inputLabel: 'একাউন্ট নাম্বার', inputPlaceholder: 'ওয়াসা একাউন্ট নাম্বার দিন' },
  { id: 'gas-bill', title: 'গ্যাস বিল', titleEn: 'Gas Bill', description: 'তিতাস/বাখরাবাদ গ্যাস বিল', icon: '🔥', color: 'bg-orange-400', category: 'other', price: 20, inputLabel: 'গ্যাস একাউন্ট নাম্বার', inputPlaceholder: 'গ্যাস একাউন্ট নাম্বার দিন' },
  { id: 'marriage-cert', title: 'বিবাহ সনদ', titleEn: 'Marriage Certificate', description: 'কাবিননামা ও বিবাহ নিবন্ধন', icon: '💍', color: 'bg-rose-500', category: 'other', price: 300, inputLabel: 'নাম ও বিবাহের তারিখ', inputPlaceholder: 'বর/কনের নাম / বিবাহের তারিখ দিন' },
]

export const categories = [
  { id: 'all', label: 'সকল সেবা', icon: '⚡' },
  { id: 'nid', label: 'NID সেবা', icon: '🪪' },
  { id: 'birth', label: 'জন্ম নিবন্ধন', icon: '📋' },
  { id: 'tax', label: 'TIN/ট্যাক্স', icon: '📄' },
  { id: 'mobile', label: 'মোবাইল সেবা', icon: '📱' },
  { id: 'location', label: 'লোকেশন', icon: '📍' },
  { id: 'cert', label: 'সনদপত্র', icon: '📜' },
  { id: 'land', label: 'ভূমি সেবা', icon: '🏡' },
  { id: 'education', label: 'শিক্ষা', icon: '🎓' },
  { id: 'trade', label: 'ট্রেড/ব্যবসা', icon: '🏪' },
  { id: 'other', label: 'অন্যান্য', icon: '🔧' },
]

export const stats = [
  { label: 'মোট সেবা সংখ্যা', value: '৪২', icon: '⚡' },
  { label: 'মোট ব্যবহারকারী', value: '৩,৩৯,৯৭১', icon: '👥' },
  { label: 'মোট উদ্যোক্তা', value: '৭,৬২৯', icon: '👤' },
  { label: 'মোট সেন্টার', value: '৩২৯', icon: '🏢' },
]