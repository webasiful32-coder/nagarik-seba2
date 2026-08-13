-- ══════════════════════════════════════════════════
-- সহজ ডিজিটাল সেবা - Complete Database Setup
-- Supabase SQL Editor এ এই পুরো SQL টা Run করুন
-- ══════════════════════════════════════════════════

-- ১. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  nid TEXT,
  balance DECIMAL(10,2) DEFAULT 0,
  role TEXT DEFAULT 'client',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ২. Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  order_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  amount DECIMAL(10,2) DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  input_data JSONB,
  result_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ৩. Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('recharge', 'deduct', 'refund')),
  amount DECIMAL(10,2) NOT NULL,
  trx_id TEXT UNIQUE,
  method TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'deduct', 'refund')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ৪. Extra columns (যদি আগে থেকে থাকে তাও কাজ করবে)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS method TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS trx_id TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS description TEXT;

-- ৫. RLS চালু করুন
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- ৬. পুরনো policies মুছুন
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('profiles', 'orders', 'transactions') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- ৭. Admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ৮. RLS Policies
CREATE POLICY "Profiles view"   ON public.profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Profiles update" ON public.profiles FOR UPDATE USING (auth.uid() = id OR is_admin());
CREATE POLICY "Profiles insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Orders view"   ON public.orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Orders insert" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Orders update" ON public.orders FOR UPDATE USING (is_admin());

CREATE POLICY "Transactions view"   ON public.transactions FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Transactions insert" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Transactions update" ON public.transactions FOR UPDATE USING (is_admin());

-- ৯. Auto profile তৈরি (registration এর সময়)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, nid, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'ব্যবহারকারী'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.raw_user_meta_data->>'nid',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ১০. Updated_at auto update
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ১১. Place Order RPC
DROP FUNCTION IF EXISTS public.place_order(TEXT, TEXT, DECIMAL, TEXT);
CREATE OR REPLACE FUNCTION public.place_order(
  p_service_id TEXT,
  p_service_name TEXT,
  p_price DECIMAL,
  p_input_data TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_current_balance DECIMAL;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  SELECT balance INTO v_current_balance FROM public.profiles WHERE id = v_user_id FOR UPDATE;

  IF v_current_balance < p_price THEN
    RETURN jsonb_build_object('success', false, 'message', 'পর্যাপ্ত ব্যালেন্স নেই');
  END IF;

  INSERT INTO public.orders (user_id, service_id, service_name, amount, price, input_data, status)
  VALUES (v_user_id, p_service_id, p_service_name, p_price, p_price, jsonb_build_object('input', p_input_data), 'pending');

  UPDATE public.profiles SET balance = balance - p_price WHERE id = v_user_id;

  INSERT INTO public.transactions (user_id, type, amount, description)
  VALUES (v_user_id, 'deduct', p_price, 'Order: ' || p_service_name);

  RETURN jsonb_build_object('success', true, 'message', 'অর্ডার সফল হয়েছে!');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;

-- ১২. Admin: Approve Transaction (manually)
DROP FUNCTION IF EXISTS public.approve_transaction(UUID);
CREATE OR REPLACE FUNCTION public.approve_transaction(p_transaction_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_amount DECIMAL;
  v_status TEXT;
BEGIN
  SELECT user_id, amount, status INTO v_user_id, v_amount, v_status
  FROM public.transactions
  WHERE id = p_transaction_id FOR UPDATE;

  IF v_status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Transaction আর pending নেই');
  END IF;

  UPDATE public.profiles SET balance = balance + v_amount WHERE id = v_user_id;
  UPDATE public.transactions SET status = 'approved' WHERE id = p_transaction_id;

  RETURN jsonb_build_object('success', true, 'message', 'Balance যোগ হয়েছে!');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;

-- ১৩. Auto-Approve Recharge (user নিজেই recharge করলে সাথে সাথে balance যোগ হবে)
DROP FUNCTION IF EXISTS public.auto_approve_recharge(DECIMAL, TEXT, TEXT, TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.auto_approve_recharge(
  p_amount       DECIMAL,
  p_trx_id      TEXT,
  p_method      TEXT,
  p_description TEXT DEFAULT NULL,
  p_account_type TEXT DEFAULT 'Personal'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'আগে লগিন করুন');
  END IF;

  IF p_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'message', 'টাকার পরিমাণ সঠিক নয়');
  END IF;

  INSERT INTO public.transactions (user_id, type, amount, trx_id, method, status, description)
  VALUES (
    v_user_id, 'recharge', p_amount, p_trx_id, p_method, 'approved',
    COALESCE(p_description, 'Auto-approved recharge: ' || p_account_type)
  );

  UPDATE public.profiles SET balance = balance + p_amount WHERE id = v_user_id;

  RETURN jsonb_build_object('success', true, 'message', 'ব্যালেন্স সফলভাবে যোগ হয়েছে!');

EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('success', false, 'message', 'এই TrxID আগে ব্যবহার হয়েছে। অন্য TrxID দিন।');
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;

GRANT EXECUTE ON FUNCTION public.auto_approve_recharge(DECIMAL, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- ১৪. Phone lookup function
DROP FUNCTION IF EXISTS public.get_email_by_phone(TEXT);
CREATE OR REPLACE FUNCTION public.get_email_by_phone(p_phone TEXT)
RETURNS TABLE (email TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT p.email FROM public.profiles p WHERE p.phone = p_phone LIMIT 1;
END;
$$;

-- ══════════════════════════════════════════════
-- সব শেষে আপনাকে Admin করুন:
-- নিচের line এ আপনার phone number দিন
-- ══════════════════════════════════════════════
-- UPDATE public.profiles SET role = 'admin' WHERE phone = '017XXXXXXXX';