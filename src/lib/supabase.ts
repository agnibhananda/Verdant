import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = 'https://wfwtgqqgzdwvzlzpbkkg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmd3RncXFnemR3dnpsenBia2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMjU4NTMsImV4cCI6MjA1MjgwMTg1M30.C8xkmVd-sm5xclIak48QxpmEaeX5bVBgzeKJ6Tb32lo';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);