
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Using environment variables for Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize client
export const supabase: SupabaseClient | null = SUPABASE_URL && SUPABASE_ANON_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export const isSupabaseConfigured = !!supabase;

export async function uploadImage(file: File | Blob, path: string) {
  if (!supabase) throw new Error("Supabase is not configured properly.");
  
  const { data, error } = await supabase.storage
    .from('detections')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('detections')
    .getPublicUrl(path);
    
  return publicUrl;
}

export async function saveDetectionRecord(userId: string, originalUrl: string, resultUrl: string, insight: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  
  const { data, error } = await supabase
    .from('history')
    .insert([
      { 
        user_id: userId, 
        original_url: originalUrl, 
        result_url: resultUrl, 
        insight: insight 
      }
    ]);

  if (error) throw error;
  return data;
}

export async function fetchUserHistory(userId: string) {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
