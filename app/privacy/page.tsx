import Link from "next/link";
import { site } from "@/lib/site-config";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <article className="prose-page">
      <p>
        <Link href="/">← Back to home</Link>
      </p>
      <h1>Privacy Policy</h1>
      <p>
        {site.businessName} (&quot;we,&quot; &quot;us&quot;) uses the information you submit through our website
        service request form to respond to your inquiry about sewer, drain, or plumbing service.
      </p>
      <p>
        If you opt in to text messages, we may send SMS updates about your service request. Message frequency
        varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a
        condition of purchase.
      </p>
      <p>
        We do not sell your personal information. For questions, contact us at{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> or <a href={site.phoneTel}>{site.phone}</a>.
      </p>
    </article>
  );
}
