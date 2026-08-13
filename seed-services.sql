-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  popular BOOLEAN DEFAULT FALSE,
  input_label TEXT,
  input_placeholder TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read services
CREATE POLICY "Allow public read access" ON public.services FOR SELECT USING (true);

-- Insert services data
INSERT INTO public.services (id, title, title_en, description, icon, color, category, price, popular, input_label, input_placeholder)
VALUES
('server-copy', 'সার্ভার কপি', 'Server Copy', 'NID কার্ডের তথ্য যাচাই (সার্ভার কপি)', '📋', 'bg-blue-400', 'nid', 18, true, 'আইডি নাম্বার ও জন্ম তারিখ', 'আইডি নাম্বার / জন্ম তারিখ (DD/MM/YYYY)'),
('sign-copy', 'সাইন কপি', 'Sign Copy', 'NID কার্ডের সাইন কপি সংগ্রহ', '🖋️', 'bg-blue-500', 'nid', 18, false, 'ভোটার/আইডি নাম্বার', 'ভোটার নাম্বার বা আইডি নাম্বার দিন'),
('nid-pdf', 'NID কার্ড PDF', 'NID Card PDF', 'অরিজিনাল জাতীয় পরিচয়পত্রের PDF', '🪪', 'bg-indigo-600', 'nid', 33, true, 'আইডি নাম্বার ও জন্ম তারিখ', 'আইডি নাম্বার / জন্ম তারিখ (DD/MM/YYYY)'),
('form-sign-copy', 'ফরম নং → সাইন কপি', 'Form to Sign Copy', 'ফরম নাম্বার দিয়ে সাইন কপি সংগ্রহ', '📝', 'bg-indigo-500', 'nid', 23, false, 'ফরম নাম্বার', 'ফরম নাম্বার দিন'),
('nid-voter-number', 'NID ভোটার নাম্বার দিয়ে সার্ভিস', 'NID service by Voter Number', 'ভোটার নাম্বার দিয়ে NID সেবা', '🗳️', 'bg-teal-500', 'nid', 45, false, 'ভোটার নাম্বার', 'ভোটার নাম্বার দিন'),
('official-server-copy', 'অফিসিয়াল সার্ভার কপি', 'Official Server Copy', 'সরকারি অফিসিয়াল সার্ভার কপি', '🏛️', 'bg-blue-800', 'nid', 59, false, 'আইডি নাম্বার ও জন্ম তারিখ', 'আইডি নাম্বার / জন্ম তারিখ (DD/MM/YYYY)'),
('nid-correction', 'NID সংশোধন', 'NID Correction', 'NID সংশোধন আবেদন', '✏️', 'bg-blue-600', 'nid', 120, false, 'আইডি নাম্বার ও সংশোধনের তথ্য', 'আইডি নাম্বার ও কী সংশোধন করতে চান লিখুন'),
('nid-address-change', 'NID ঠিকানা পরিবর্তন', 'NID Address Change', 'জাতীয় পরিচয়পত্রের ঠিকানা আপডেট', '🏠', 'bg-blue-300', 'nid', 80, false, 'আইডি নাম্বার ও নতুন ঠিকানা', 'আইডি নাম্বার / নতুন ঠিকানা লিখুন'),
('smart-id-card', 'স্মার্ট ID কার্ড', 'Smart ID Card', 'অরিজিনাল স্মার্ট আইডি কার্ড কপি', '💳', 'bg-purple-700', 'nid', 699, true, 'নাম ও আইডি নাম্বার', 'পূর্ণ নাম / আইডি নাম্বার দিন'),
('new-birth-reg', 'নতুন জন্মনিবন্ধন', 'New Birth Registration', 'সম্পূর্ণ নতুন জন্মনিবন্ধন আবেদন', '👶', 'bg-green-700', 'birth', 510, false, 'নাম ও জন্ম তারিখ', 'শিশুর নাম / জন্ম তারিখ / পিতামাতার নাম'),
('birth-copy', 'জন্ম নিবন্ধন কপি', 'Birth Reg Copy', 'জন্মনিবন্ধন সনদের ডিজিটাল কপি', '📄', 'bg-green-500', 'birth', 35, true, 'জন্ম নিবন্ধন নাম্বার', 'জন্ম নিবন্ধন নাম্বার দিন'),
('birth-correction', 'জন্মনিবন্ধন সংশোধন', 'Birth Reg Correction', 'জন্মনিবন্ধনের তথ্য সংশোধন', '✏️', 'bg-green-600', 'birth', 200, false, 'জন্ম নিবন্ধন নাম্বার ও সংশোধনের তথ্য', 'জন্ম নিবন্ধন নাম্বার / কী সংশোধন করতে চান'),
('death-certificate', 'মৃত্যু সনদ', 'Death Certificate', 'মৃত্যু নিবন্ধন সনদ সংগ্রহ', '📜', 'bg-gray-600', 'birth', 150, false, 'মৃত ব্যক্তির নাম ও তথ্য', 'মৃত ব্যক্তির নাম / মৃত্যু তারিখ'),
('tin-certificate', 'টিন সার্টিফিকেট', 'TIN Certificate', 'নতুন বা পুরাতন টিন সার্টিফিকেট', '📄', 'bg-orange-600', 'tax', 59, false, 'আইডি কার্ড নাম্বার', 'জাতীয় পরিচয়পত্র নাম্বার দিন'),
('tin-new', 'নতুন TIN রেজিস্ট্রেশন', 'New TIN Registration', 'নতুন ট্যাক্স আইডেন্টিফিকেশন নম্বর', '🧾', 'bg-orange-500', 'tax', 99, false, 'আইডি কার্ড নাম্বার ও নাম', 'আইডি নাম্বার / পূর্ণ নাম দিন'),
('income-tax-return', 'আয়কর রিটার্ন', 'Income Tax Return', 'বার্ষিক আয়কর রিটার্ন জমা', '💼', 'bg-orange-700', 'tax', 350, false, 'TIN নাম্বার', 'TIN নাম্বার দিন'),
('sim-biometric', 'সিম বায়োমেট্রিক', 'SIM Biometric', 'বায়োমেট্রিক দিয়ে সিম তথ্য যাচাই', '📲', 'bg-pink-600', 'mobile', 49, false, 'মোবাইল নাম্বার', '01XXXXXXXXX নাম্বার দিন'),
('call-list', '৩ মাস কল লিস্ট', '3 Months Call List', 'মোবাইলের ৩ মাসের কল রেকর্ড', '📞', 'bg-cyan-600', 'mobile', 349, false, 'মোবাইল নাম্বার', '01XXXXXXXXX নাম্বার দিন'),
('sms-list', '৩ মাস SMS লিস্ট', '3 Months SMS List', 'মোবাইলের ৩ মাসের SMS রেকর্ড', '💬', 'bg-cyan-700', 'mobile', 349, false, 'মোবাইল নাম্বার', '01XXXXXXXXX নাম্বার দিন'),
('imei-number', 'IMEI টু নাম্বার', 'IMEI to Number', 'IMEI দিয়ে সক্রিয় নাম্বার বের করুন', '📱', 'bg-cyan-500', 'mobile', 210, false, 'IMEI নাম্বার', '15 সংখ্যার IMEI নাম্বার দিন'),
('bkash-info', 'বিকাশ তথ্য', 'Bkash Info', 'বিকাশ একাউন্টের তথ্য অনুসন্ধান', '💰', 'bg-pink-500', 'mobile', 399, false, 'বিকাশ নাম্বার', 'বিকাশ নাম্বার দিন (01XXXXXXXXX)'),
('nagad-info', 'নগদ তথ্য', 'Nagad Info', 'নগদ একাউন্টের তথ্য অনুসন্ধান', '💸', 'bg-orange-500', 'mobile', 399, false, 'নগদ নাম্বার', 'নগদ নাম্বার দিন (01XXXXXXXXX)'),
('rocket-info', 'রকেট তথ্য', 'Rocket Info', 'ডাচ বাংলা রকেট তথ্য অনুসন্ধান', '🚀', 'bg-purple-500', 'mobile', 399, false, 'রকেট নাম্বার', 'রকেট নাম্বার দিন (01XXXXXXXXX)'),
('number-location', 'নম্বর টু লোকেশন', 'Number to Location', 'মোবাইল নম্বর দিয়ে লোকেশন ট্র্যাকিং', '📍', 'bg-red-500', 'location', 170, true, 'মোবাইল নাম্বার', '01XXXXXXXXX নাম্বার দিন'),
('live-location', 'লাইভ লোকেশন', 'Live Location', 'রিয়েলটাইম লোকেশন ট্র্যাকিং', '🗺️', 'bg-red-600', 'location', 250, false, 'মোবাইল নাম্বার', '01XXXXXXXXX নাম্বার দিন'),
('bmet-service', 'BMET সেবা', 'BMET Service', 'বৈদেশিক কর্মসংস্থান সংক্রান্ত সেবা', '✈️', 'bg-sky-600', 'cert', 210, false, 'পাসপোর্ট / আইডি নাম্বার', 'পাসপোর্ট নাম্বার বা আইডি নাম্বার দিন'),
('police-clearance', 'পুলিশ ক্লিয়ারেন্স', 'Police Clearance', 'পুলিশ ক্লিয়ারেন্স সার্টিফিকেট', '👮', 'bg-blue-700', 'cert', 300, false, 'আইডি নাম্বার ও ঠিকানা', 'আইডি নাম্বার / স্থায়ী ঠিকানা দিন'),
('char-certificate', 'চারিত্রিক সনদ', 'Character Certificate', 'চারিত্রিক সনদপত্র সংগ্রহ', '🎓', 'bg-teal-600', 'cert', 100, false, 'নাম ও ঠিকানা', 'পূর্ণ নাম / ঠিকানা দিন'),
('driving-license', 'ড্রাইভিং লাইসেন্স', 'Driving License', 'ড্রাইভিং লাইসেন্স আবেদন ও নবায়ন', '🚗', 'bg-yellow-600', 'cert', 350, false, 'আইডি নাম্বার ও নাম', 'আইডি নাম্বার / পূর্ণ নাম দিন'),
('passport-apply', 'পাসপোর্ট আবেদন', 'Passport Apply', 'নতুন পাসপোর্ট আবেদন সহায়তা', '🛂', 'bg-green-800', 'cert', 500, false, 'আইডি নাম্বার ও নাম', 'আইডি নাম্বার / পূর্ণ নাম দিন'),
('trade-license', 'ট্রেড লাইসেন্স', 'Trade License', 'ট্রেড লাইসেন্স আবেদন ও নবায়ন', '🏪', 'bg-yellow-700', 'trade', 600, false, 'ব্যবসার নাম ও ঠিকানা', 'ব্যবসার নাম / ঠিকানা দিন'),
('company-reg', 'কোম্পানি রেজিস্ট্রেশন', 'Company Registration', 'ব্যবসা প্রতিষ্ঠান নিবন্ধন', '🏢', 'bg-yellow-500', 'trade', 1500, false, 'কোম্পানির নাম ও তথ্য', 'কোম্পানির নাম / ধরন / মালিকের নাম'),
('vat-reg', 'VAT রেজিস্ট্রেশন', 'VAT Registration', 'ভ্যাট নিবন্ধন ও সনদ', '🧾', 'bg-amber-600', 'trade', 400, false, 'TIN নাম্বার ও ব্যবসার নাম', 'TIN নাম্বার / ব্যবসার নাম দিন'),
('land-service', 'ভূমি সেবা', 'Land Service', 'খতিয়ান ও দাগের তথ্য যাচাই', '🏡', 'bg-lime-700', 'land', 100, true, 'দাগ নাম্বার ও মৌজা', 'দাগ নাম্বার / মৌজা / জেলা দিন'),
('land-mutation', 'নামজারি আবেদন', 'Land Mutation', 'জমির নামজারি আবেদন প্রক্রিয়া', '🗂️', 'bg-lime-600', 'land', 250, false, 'দাগ নাম্বার ও মালিকের নাম', 'দাগ নাম্বার / মালিকের নাম / জেলা'),
('land-record', 'জমির রেকর্ড', 'Land Record', 'RS/BS/SA খতিয়ান ডাউনলোড', '📑', 'bg-lime-800', 'land', 150, false, 'খতিয়ান নাম্বার ও জেলা', 'খতিয়ান নাম্বার / জেলা / উপজেলা দিন'),
('porcha-copy', 'পর্চা কপি', 'Porcha Copy', 'ডিজিটাল পর্চা কপি সংগ্রহ', '🗃️', 'bg-green-900', 'land', 80, false, 'দাগ নাম্বার ও মৌজা', 'দাগ নাম্বার / মৌজা দিন'),
('ssc-certificate', 'SSC সনদ', 'SSC Certificate', 'SSC/দাখিল সনদের সত্যায়িত কপি', '🎓', 'bg-purple-600', 'education', 200, false, 'রোল নাম্বার ও বোর্ড', 'রোল নাম্বার / পাসের সাল / বোর্ড দিন'),
('hsc-certificate', 'HSC সনদ', 'HSC Certificate', 'HSC/আলিম সনদের সত্যায়িত কপি', '📚', 'bg-purple-700', 'education', 200, false, 'রোল নাম্বার ও বোর্ড', 'রোল নাম্বার / পাসের সাল / বোর্ড দিন'),
('marksheet', 'মার্কশিট', 'Mark Sheet', 'SSC/HSC মার্কশিটের কপি', '📊', 'bg-violet-600', 'education', 150, false, 'রোল নাম্বার ও পরীক্ষার নাম', 'রোল নাম্বার / পাসের সাল / পরীক্ষার নাম'),
('make-cv', 'CV তৈরি', 'Make CV', 'পেশাদার CV তৈরি করুন', '📃', 'bg-violet-50', 'other', 50, false, 'নাম ও তথ্য', 'আপনার নাম / পেশা / যোগাযোগ নাম্বার দিন'),
('voter-list', 'ভোটার লিস্ট', 'Voter List', 'ভোটার তালিকা ডাউনলোড', '🗳️', 'bg-emerald-600', 'other', 30, false, 'এলাকার নাম ও ঠিকানা', 'ইউনিয়ন / ওয়ার্ড / উপজেলা দিন'),
('electric-bill', 'বিদ্যুৎ বিল', 'Electric Bill', 'বিদ্যুৎ বিলের তথ্য ও পেমেন্ট', '⚡', 'bg-yellow-400', 'other', 20, false, 'মিটার নাম্বার', 'বিদ্যুৎ মিটার নাম্বার দিন'),
('water-bill', 'পানি বিল', 'Water Bill', 'ওয়াসা পানি বিলের তথ্য', '💧', 'bg-blue-400', 'other', 20, false, 'একাউন্ট নাম্বার', 'ওয়াসা একাউন্ট নাম্বার দিন'),
('gas-bill', 'গ্যাস বিল', 'Gas Bill', 'তিতাস/বাখরাবাদ গ্যাস বিল', '🔥', 'bg-orange-400', 'other', 20, false, 'গ্যাস একাউন্ট নাম্বার', 'গ্যাস একাউন্ট নাম্বার দিন'),
('marriage-cert', 'বিবাহ সনদ', 'Marriage Certificate', 'কাবিননামা ও বিবাহ নিবন্ধন', '💍', 'bg-rose-500', 'other', 300, false, 'নাম ও বিবাহের তারিখ', 'বর/কনের নাম / বিবাহের তারিখ দিন')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_en = EXCLUDED.title_en,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  popular = EXCLUDED.popular,
  input_label = EXCLUDED.input_label,
  input_placeholder = EXCLUDED.input_placeholder;
