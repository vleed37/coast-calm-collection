CREATE OR REPLACE FUNCTION public.submit_enquiry(
  p_name text,
  p_email text,
  p_phone text DEFAULT NULL,
  p_property_of_interest text DEFAULT NULL,
  p_check_in date DEFAULT NULL,
  p_check_out date DEFAULT NULL,
  p_message text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_id uuid;
BEGIN
  IF p_name IS NULL OR length(btrim(p_name)) < 1 OR length(btrim(p_name)) > 200 THEN
    RAISE EXCEPTION 'invalid name'; END IF;
  IF p_email IS NULL OR length(p_email) < 3 OR length(p_email) > 320
     OR p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'invalid email'; END IF;
  IF p_message IS NOT NULL AND length(p_message) > 5000 THEN
    RAISE EXCEPTION 'message too long'; END IF;
  INSERT INTO public.enquiries (name, email, phone, property_of_interest, check_in, check_out, message)
  VALUES (btrim(p_name), p_email, p_phone, p_property_of_interest, p_check_in, p_check_out, p_message)
  RETURNING id INTO new_id;
  RETURN new_id;
END; $$;

REVOKE ALL ON FUNCTION public.submit_enquiry(text, text, text, text, date, date, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_enquiry(text, text, text, text, date, date, text) TO anon, authenticated;