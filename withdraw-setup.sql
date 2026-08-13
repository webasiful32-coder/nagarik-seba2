-- ══════════════════════════════════════════════════════
-- উইথড্র সিস্টেম সেটআপ - Supabase SQL Editor এ Run করুন
-- ══════════════════════════════════════════════════════

-- ১. withdraw_requests table তৈরি করুন
CREATE TABLE IF NOT EXISTS public.withdraw_requests (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount        DECIMAL(10,2) NOT NULL CHECK (amount >= 500),
  method        TEXT NOT NULL CHECK (method IN ('bKash', 'Nagad')),
  account_number TEXT NOT NULL,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note    TEXT,
  processed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ২. RLS চালু করুন
ALTER TABLE public.withdraw_requests ENABLE ROW LEVEL SECURITY;

-- ৩. Policies
-- User নিজের রিকোয়েস্ট দেখতে পারবে
CREATE POLICY "Withdraw view own"
  ON public.withdraw_requests FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

-- User নিজের রিকোয়েস্ট insert করতে পারবে
CREATE POLICY "Withdraw insert own"
  ON public.withdraw_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- শুধু Admin আপডেট করতে পারবে
CREATE POLICY "Withdraw admin update"
  ON public.withdraw_requests FOR UPDATE
  USING (is_admin());

-- ৪. Admin: উইথড্র অ্যাপ্রুভ করার function
DROP FUNCTION IF EXISTS public.process_withdraw(UUID, TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.process_withdraw(
  p_withdraw_id UUID,
  p_action      TEXT,  -- 'approve' অথবা 'reject'
  p_note        TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_amount  DECIMAL;
  v_status  TEXT;
BEGIN
  -- Admin check
  IF NOT is_admin() THEN
    RETURN jsonb_build_object('success', false, 'message', 'অনুমতি নেই');
  END IF;

  SELECT user_id, amount, status INTO v_user_id, v_amount, v_status
  FROM public.withdraw_requests
  WHERE id = p_withdraw_id FOR UPDATE;

  IF v_status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'message', 'এই রিকোয়েস্ট আর pending নেই');
  END IF;

  IF p_action = 'approve' THEN
    UPDATE public.withdraw_requests
    SET status = 'approved', admin_note = p_note, processed_at = NOW()
    WHERE id = p_withdraw_id;

    -- Transaction record update (latest pending withdraw transaction)
    UPDATE public.transactions
    SET status = 'approved'
    WHERE id = (
      SELECT id FROM public.transactions
      WHERE user_id = v_user_id
        AND description LIKE 'Withdraw request%'
        AND status = 'pending'
      ORDER BY created_at DESC
      LIMIT 1
    );

    RETURN jsonb_build_object('success', true, 'message', 'উইথড্র অ্যাপ্রুভ করা হয়েছে');

  ELSIF p_action = 'reject' THEN
    UPDATE public.withdraw_requests
    SET status = 'rejected', admin_note = p_note, processed_at = NOW()
    WHERE id = p_withdraw_id;

    -- Balance ফেরত দাও
    UPDATE public.profiles
    SET balance = balance + v_amount
    WHERE id = v_user_id;

    -- Refund transaction
    INSERT INTO public.transactions (user_id, type, amount, status, description)
    VALUES (v_user_id, 'refund', v_amount, 'refund', 'Withdraw rejected: ' || COALESCE(p_note, 'No reason'));

    RETURN jsonb_build_object('success', true, 'message', 'উইথড্র বাতিল করা হয়েছে এবং ব্যালেন্স ফেরত দেওয়া হয়েছে');
  END IF;

  RETURN jsonb_build_object('success', false, 'message', 'অবৈধ action');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;

GRANT EXECUTE ON FUNCTION public.process_withdraw(UUID, TEXT, TEXT) TO authenticated;

-- ══════════════════════════════════════════════════════
-- ✅ সব শেষ! এখন withdraw পেজ কাজ করবে।
-- ══════════════════════════════════════════════════════
