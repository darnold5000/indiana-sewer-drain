import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { LeadStatus, ServiceOption, UrgencyOption } from "@/lib/site-config";

export type StoredLead = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  zip: string;
  service: ServiceOption | string;
  urgency: UrgencyOption | string;
  description: string | null;
  photo_urls: string[];
  sms_consent: boolean;
  sms_consent_timestamp: string | null;
  sms_consent_source: string | null;
  lead_source: string;
  status: LeadStatus;
  created_at: string;
};

export type CreateLeadInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  zip: string;
  service: string;
  urgency: string;
  description: string;
  smsConsent: boolean;
  leadSource: string;
  photoUrls: string[];
};

function getServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function isLeadStorageConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function uploadLeadPhotos(
  leadId: string,
  files: { name: string; type: string; buffer: Buffer }[],
): Promise<string[]> {
  const supabase = getServiceClient();
  if (!supabase || files.length === 0) return [];

  const urls: string[] = [];
  for (const [index, file] of files.entries()) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || `photo-${index + 1}`;
    const path = `${leadId}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("isd-lead-photos").upload(path, file.buffer, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      console.error("Photo upload failed:", error.message);
      continue;
    }
    const { data } = supabase.storage.from("isd-lead-photos").getPublicUrl(path);
    if (data.publicUrl) urls.push(data.publicUrl);
  }
  return urls;
}

export async function updateLeadPhotoUrls(leadId: string, photoUrls: string[]): Promise<void> {
  const supabase = getServiceClient();
  if (!supabase) return;
  await supabase.from("isd_service_leads").update({ photo_urls: photoUrls }).eq("id", leadId);
}

export async function createLeadRecord(input: CreateLeadInput): Promise<StoredLead | null> {
  const supabase = getServiceClient();
  if (!supabase) {
    console.info("Lead storage skipped: Supabase not configured");
    return null;
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("isd_service_leads")
    .insert({
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone,
      email: input.email,
      zip: input.zip,
      service: input.service,
      urgency: input.urgency,
      description: input.description || null,
      photo_urls: input.photoUrls,
      sms_consent: input.smsConsent,
      sms_consent_timestamp: input.smsConsent ? now : null,
      sms_consent_source: input.smsConsent ? "website_service_request" : null,
      lead_source: input.leadSource,
      status: "New",
    })
    .select()
    .single();

  if (error) {
    console.error("Lead insert failed:", error.message);
    return null;
  }

  return data as StoredLead;
}

export async function getLeadById(id: string): Promise<StoredLead | null> {
  const supabase = getServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("isd_service_leads").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return data as StoredLead;
}

export function buildLeadViewUrl(leadId: string): string | undefined {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const secret = process.env.LEAD_VIEW_SECRET;
  if (!base || !secret) return undefined;
  return `${base}/leads/${leadId}?token=${encodeURIComponent(secret)}`;
}
