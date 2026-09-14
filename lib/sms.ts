import { site } from "@/lib/site-config";

export type OwnerLeadSms = {
  customerName: string;
  phone: string;
  zip: string;
  service: string;
  urgency: string;
  message: string;
  photoCount: number;
  leadUrl?: string;
};

export type CustomerConfirmationSms = {
  firstName: string;
  phone: string;
};

const TRIAL_OWNER_BODY = "sms_feedback_surveys";
const TRIAL_CUSTOMER_BODY = "sms_customer_support";

function isTrialMode(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

function formatOwnerMessage(lead: OwnerLeadSms) {
  const quote = lead.message.replace(/\s+/g, " ").trim().slice(0, 280) || "Not provided";
  const photoLine =
    lead.photoCount > 0
      ? `Photos: Customer attached ${lead.photoCount} photo${lead.photoCount === 1 ? "" : "s"}.`
      : null;

  const lines = [
    "NEW SERVICE REQUEST",
    "",
    lead.customerName,
    lead.phone,
    lead.zip,
    "",
    `Issue: ${lead.service}`,
    `Urgency: ${lead.urgency}`,
    "",
    `"${quote}"`,
    photoLine,
    lead.leadUrl ? `\nView: ${lead.leadUrl}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

async function sendTwilioSms(to: string, body: string): Promise<boolean> {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;
  const missing = [
    !TWILIO_ACCOUNT_SID && "TWILIO_ACCOUNT_SID",
    !TWILIO_AUTH_TOKEN && "TWILIO_AUTH_TOKEN",
    !TWILIO_FROM_NUMBER && "TWILIO_FROM_NUMBER",
  ].filter(Boolean);

  if (missing.length) {
    console.error(`SMS not sent: missing configuration (${missing.join(", ")})`);
    return false;
  }

  const authorization = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: to,
        From: TWILIO_FROM_NUMBER!,
        Body: body,
      }),
    },
  );

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`Twilio returned ${response.status}: ${detail}`);
  }

  return true;
}

export async function sendOwnerSms(lead: OwnerLeadSms): Promise<boolean> {
  try {
    const { OWNER_PHONE_NUMBER, TWILIO_TRIAL_MODE } = process.env;
    if (!OWNER_PHONE_NUMBER) {
      console.error("Owner SMS not sent: missing OWNER_PHONE_NUMBER");
      return false;
    }
    if (!TWILIO_TRIAL_MODE) {
      console.error("Owner SMS not sent: missing TWILIO_TRIAL_MODE");
      return false;
    }

    const body = isTrialMode(TWILIO_TRIAL_MODE) ? TRIAL_OWNER_BODY : formatOwnerMessage(lead);
    await sendTwilioSms(OWNER_PHONE_NUMBER, body);
    console.info("Owner SMS sent");
    return true;
  } catch (error) {
    console.error("Owner SMS failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

export async function sendCustomerConfirmationSms(lead: CustomerConfirmationSms): Promise<boolean> {
  try {
    const { TWILIO_TRIAL_MODE } = process.env;
    if (!TWILIO_TRIAL_MODE) {
      console.error("Customer SMS not sent: missing TWILIO_TRIAL_MODE");
      return false;
    }

    const body = isTrialMode(TWILIO_TRIAL_MODE)
      ? TRIAL_CUSTOMER_BODY
      : `${site.shortName}: We received your service request and will follow up as soon as possible. Reply STOP to opt out.`;

    await sendTwilioSms(lead.phone, body);
    console.info("Customer SMS sent");
    return true;
  } catch (error) {
    console.error("Customer SMS failed:", error instanceof Error ? error.message : error);
    return false;
  }
}
