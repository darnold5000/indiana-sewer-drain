import { NextResponse } from "next/server";
import { buildOwnerEmailBody, sendOwnerLeadEmail, type EmailAttachment } from "@/lib/email";
import {
  buildLeadViewUrl,
  createLeadRecord,
  updateLeadPhotoUrls,
  uploadLeadPhotos,
} from "@/lib/leads";
import { normalizeUsPhone } from "@/lib/phone";
import { sendCustomerConfirmationSms, sendOwnerSms } from "@/lib/sms";
import { SERVICE_OPTIONS, URGENCY_OPTIONS } from "@/lib/site-config";

export const runtime = "nodejs";

const recentRequests = new Map<string, number>();
const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

function clean(value: FormDataEntryValue | null, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const now = Date.now();
    if (now - (recentRequests.get(ip) || 0) < 30_000) {
      return NextResponse.json(
        { error: "Please wait a moment before sending another request." },
        { status: 429 },
      );
    }

    const data = await request.formData();
    if (data.get("formCheck")) {
      console.info("Lead submission skipped: honeypot field was populated");
      return NextResponse.json({ ok: true });
    }

    const lead = {
      firstName: clean(data.get("firstName"), 60),
      lastName: clean(data.get("lastName"), 60),
      phone: clean(data.get("phone"), 30),
      email: clean(data.get("email"), 120),
      zip: clean(data.get("zip"), 10),
      service: clean(data.get("service"), 100),
      urgency: clean(data.get("urgency"), 80),
      description: clean(data.get("description"), 1500),
      leadSource: clean(data.get("source"), 40) || "website_service_request",
      smsConsent: data.get("smsConsent") === "yes",
    };

    if (
      !lead.firstName ||
      !lead.lastName ||
      !lead.phone ||
      !lead.email ||
      !lead.zip ||
      !lead.service ||
      !lead.urgency
    ) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    if (!(SERVICE_OPTIONS as readonly string[]).includes(lead.service)) {
      return NextResponse.json({ error: "Please select a valid service." }, { status: 400 });
    }

    if (!(URGENCY_OPTIONS as readonly string[]).includes(lead.urgency)) {
      return NextResponse.json({ error: "Please select how urgent this is." }, { status: 400 });
    }

    const customerPhone = normalizeUsPhone(lead.phone);
    if (!customerPhone || !/^\S+@\S+\.\S+$/.test(lead.email) || !/^\d{5}$/.test(lead.zip)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number, email, and five-digit ZIP code." },
        { status: 400 },
      );
    }

    const photoEntries = data
      .getAll("photos")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)
      .slice(0, MAX_PHOTOS);

    for (const photo of photoEntries) {
      if (photo.size > MAX_PHOTO_BYTES) {
        return NextResponse.json({ error: "Please upload photos smaller than 4 MB each." }, { status: 413 });
      }
      if (!ALLOWED_PHOTO_TYPES.has(photo.type)) {
        return NextResponse.json({ error: "Please upload JPG, PNG, WEBP, or HEIC images." }, { status: 415 });
      }
    }

    const stored = await createLeadRecord({
      ...lead,
      photoUrls: [],
    });

    const leadId = stored?.id ?? crypto.randomUUID();
    const photoBuffers = await Promise.all(
      photoEntries.map(async (photo) => ({
        name: photo.name,
        type: photo.type,
        buffer: Buffer.from(await photo.arrayBuffer()),
      })),
    );

    const photoUrls = await uploadLeadPhotos(leadId, photoBuffers);
    if (stored?.id && photoUrls.length) {
      await updateLeadPhotoUrls(stored.id, photoUrls);
    }

    const attachments: EmailAttachment[] = photoBuffers.map((file, index) => ({
      filename: file.name.replace(/[^a-zA-Z0-9._-]/g, "_") || `problem-photo-${index + 1}`,
      content: file.buffer.toString("base64"),
    }));

    const leadUrl = stored?.id ? buildLeadViewUrl(stored.id) : undefined;
    const photoCount = photoEntries.length;

    const emailBody = buildOwnerEmailBody({
      firstName: lead.firstName,
      lastName: lead.lastName,
      phone: lead.phone,
      email: lead.email,
      zip: lead.zip,
      service: lead.service,
      urgency: lead.urgency,
      description: lead.description,
      smsConsent: lead.smsConsent,
      source: lead.leadSource,
      photoCount,
      leadUrl,
    });

    const emailConfigured = Boolean(
      process.env.RESEND_API_KEY && process.env.OWNER_EMAIL && process.env.LEAD_FROM_EMAIL,
    );

    const [emailResult, ownerSmsResult, customerSmsResult] = await Promise.allSettled([
      emailConfigured
        ? sendOwnerLeadEmail(
            `New service request: ${lead.firstName} ${lead.lastName}`,
            emailBody,
            lead.email,
            attachments,
          )
        : Promise.resolve(false),
      sendOwnerSms({
        customerName: `${lead.firstName} ${lead.lastName}`,
        phone: lead.phone,
        zip: lead.zip,
        service: lead.service,
        urgency: lead.urgency,
        message: lead.description,
        photoCount,
        leadUrl,
      }),
      lead.smsConsent
        ? sendCustomerConfirmationSms({ firstName: lead.firstName, phone: customerPhone })
        : Promise.resolve(false),
    ]);

    if (emailConfigured && emailResult.status === "rejected") {
      throw emailResult.reason;
    }

    if (emailConfigured && emailResult.status === "fulfilled" && !emailResult.value) {
      throw new Error("Lead email could not be sent");
    }

    recentRequests.set(ip, now);

    const delivered = [
      emailResult.status === "fulfilled" && emailResult.value ? "owner-email" : null,
      ownerSmsResult.status === "fulfilled" && ownerSmsResult.value ? "owner-sms" : null,
      customerSmsResult.status === "fulfilled" && customerSmsResult.value ? "customer-sms" : null,
    ].filter(Boolean);

    return NextResponse.json({
      ok: true,
      leadId: stored?.id ?? null,
      delivered: delivered.length ? delivered : ["development"],
    });
  } catch (error) {
    console.error("Lead submission error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "We couldn’t send that request. Please try again shortly." },
      { status: 500 },
    );
  }
}
