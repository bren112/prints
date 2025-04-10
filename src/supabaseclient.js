import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yswtmpgzhxiizyoccpex.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzd3RtcGd6aHhpaXp5b2NjcGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNTAzNjEsImV4cCI6MjA1NzYyNjM2MX0.-2jY8ghCQmBy0mrVfWu5rFnRsYlQBs5hYBlQ2-5a7fA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
