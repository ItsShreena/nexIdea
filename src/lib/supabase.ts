import { createClient, User as SupabaseUser, Session } from '@supabase/supabase-js';
import { SavedReport, AnalysisResult } from '../types';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create the Supabase client safely if configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Gets a clean user-specific storage key for local persistence
 */
const getStorageKey = (userId: string) => `nexidea_reports_user_${userId}`;

/**
 * Saves a report associated with an authenticated user
 */
/**
 * Saves a report associated with an authenticated user
 */
export async function saveReport(
  userId: string,
  name: string,
  ideaDescription: string,
  result: AnalysisResult
): Promise<SavedReport> {

  const analysisId =
    'an_' + Math.random().toString(36).substring(2, 15);

  const reportPayload: SavedReport = {
    id: analysisId,
    userId,
    name,
    ideaDescription,
    result,
    createdAt: new Date().toISOString()
  };

  // Guest users -> local only
  if (
    userId === "guest-sandbox" ||
    !userId.includes("-")
  ) {
    const userKey = getStorageKey(userId);

    const existingReportsRaw =
      localStorage.getItem(userKey);

    const existingReports: SavedReport[] =
      existingReportsRaw
        ? JSON.parse(existingReportsRaw)
        : [];

    existingReports.unshift(reportPayload);

    localStorage.setItem(
      userKey,
      JSON.stringify(existingReports)
    );

    return reportPayload;
  }

  // Real authenticated users
  if (supabase) {
    try {
      const { error } = await supabase
        .from("startup_analyses")
        .insert([
          {
            id: analysisId,
            user_id: userId,
            name,
            idea_description: ideaDescription,
            result,
            created_at: reportPayload.createdAt
          }
        ]);

      if (error) {
        console.warn(
          "Supabase writing failed:",
          error
        );
      } else {
        console.log(
          "Saved report to Supabase successfully"
        );
      }
    } catch (e) {
      console.warn(
        "Supabase error:",
        e
      );
    }
  }

  // Local backup for all users
  const userKey = getStorageKey(userId);

  const existingReportsRaw =
    localStorage.getItem(userKey);

  const existingReports: SavedReport[] =
    existingReportsRaw
      ? JSON.parse(existingReportsRaw)
      : [];

  existingReports.unshift(reportPayload);

  localStorage.setItem(
    userKey,
    JSON.stringify(existingReports)
  );

  return reportPayload;
}
/**
 * Lists all reports for an authenticated user
 */
export async function getReports(userId: string): Promise<SavedReport[]> {
  const userKey = getStorageKey(userId);

  // Try retrieving from Supabase first if available
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('startup_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Map Supabase layout to our SavedReport type
        return data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          name: d.name,
          ideaDescription: d.idea_description,
          result: d.result,
          createdAt: d.created_at || d.inserted_at
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch failed or table not found, loading user-specific local storage reports:", e);
    }
  }

  // Load user's local persistent reports
  const reportsRaw = localStorage.getItem(userKey);
  return reportsRaw ? JSON.parse(reportsRaw) : [];
}

/**
 * Retrieves a single report by ID
 */
export async function getReportById(reportId: string, userId?: string | null): Promise<SavedReport | null> {
  // If sharing with public, check if Supabase is queried
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('startup_analyses')
        .select('*')
        .eq('id', reportId)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          name: data.name,
          ideaDescription: data.idea_description,
          result: data.result,
          createdAt: data.created_at
        };
      }
    } catch (e) {
      console.warn("Could not retrieve report from Supabase by ID, falling back to local search:", e);
    }
  }

  // Fallback: search across user keys in localStorage
  if (userId) {
    const list = await getReports(userId);
    const found = list.find(r => r.id === reportId);
    if (found) return found;
  }

  // Scan all local storage keys to enable sharing links
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('nexidea_reports_user_')) {
      try {
        const list: SavedReport[] = JSON.parse(localStorage.getItem(key) || '[]');
        const found = list.find(r => r.id === reportId);
        if (found) return found;
      } catch { }
    }
  }

  return null;
}

/**
 * Deletes a report for an authenticated user
 */
export async function deleteReport(reportId: string, userId: string): Promise<void> {
  // Try remote delete first
  if (supabase) {
    try {
      const { error } = await supabase
        .from('startup_analyses')
        .delete()
        .eq('id', reportId)
        .eq('user_id', userId);

      if (error) {
        console.warn("Supabase database delete failed:", error);
      }
    } catch (e) {
      console.warn("Supabase delete action unsupported or tables missing:", e);
    }
  }

  // Delete from user's local persistent ledger
  const userKey = getStorageKey(userId);
  const list = await getReports(userId);
  const updatedList = list.filter(r => r.id !== reportId);
  localStorage.setItem(userKey, JSON.stringify(updatedList));
}
