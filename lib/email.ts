import { site } from "@/lib/site-config";

export type EmailAttachment = {
  filename: string;
  content: string;
};

export async function sendOwnerLeadEmail(
  subject: string,
  text: string,
  replyTo: string,
  attachments: EmailAttachment[],
): Promise<boolean> {
  const { RESEND_API_KEY, OWNER_EMAIL, LEAD_FROM_EMAIL } = process.env;
  const missing = [
    !RESEND_API_KEY && "RESEND_API_KEY",
    !OWNER_EMAIL && "OWNER_EMAIL",
    !LEAD_FROM_EMAIL && "LEAD_FROM_EMAIL",
  ].filter(Boolean);

  if (missing.length) {
    console.error(`Owner email failed: missing configuration (${missing.join(", ")})`);
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: LEAD_FROM_EMAIL,
      to: [OWNER_EMAIL],
      subject,
      text,
      reply_to: replyTo,
      ...(attachments.length ? { attachments } : {}),
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`Resend returned ${response.status}: ${detail}`);
  }

  console.info("Owner email sent");
  return true;
}

export function buildOwnerEmailBody(lead: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  zip: string;
  service: string;
  urgency: string;
  description: string;
  smsConsent: boolean;
  source: string;
  photoCount: number;
  leadUrl?: string;
}) {
  return [
    `New service request — ${site.businessName}`,
    "",
    `Name: ${lead.firstName} ${lead.lastName}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `ZIP: ${lead.zip}`,
    `Service: ${lead.service}`,
    `Urgency: ${lead.urgency}`,
    lead.description ? `Details: "${lead.description}"` : null,
    lead.photoCount > 0 ? `Photos: ${lead.photoCount} attached to this email.` : null,
    `SMS consent: ${lead.smsConsent ? "Yes" : "No"}`,
    `Source: ${lead.source || "website"}`,
    lead.leadUrl ? `View online: ${lead.leadUrl}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
