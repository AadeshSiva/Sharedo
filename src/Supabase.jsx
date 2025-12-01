import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mbhzlkmwsbjymjnlxerp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iaHpsa213c2JqeW1qbmx4ZXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1Njg0NzAsImV4cCI6MjA4MDE0NDQ3MH0.QGhf8_EG7tjAr1jC72Y472lcqyYEt5T72paM2AOthsc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
