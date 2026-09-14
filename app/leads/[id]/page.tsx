import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeadById } from "@/lib/leads";
import { site } from "@/lib/site-config";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export const metadata = {
  title: "Service request",
  robots: { index: false, follow: false },
};

export default async function LeadDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { token } = await searchParams;
  const secret = process.env.LEAD_VIEW_SECRET;

  if (!secret || token !== secret) {
    notFound();
  }

  const lead = await getLeadById(id);
  if (!lead) notFound();

  return (
    <article className="lead-detail">
      <p>
        <Link href="/">← {site.shortName}</Link>
      </p>
      <h1>Service request</h1>
      <p>Status: <strong>{lead.status}</strong></p>
      <dl>
        <dt>Name</dt>
        <dd>{lead.first_name} {lead.last_name}</dd>
        <dt>Phone</dt>
        <dd><a href={`tel:${lead.phone.replace(/\D/g, "")}`}>{lead.phone}</a></dd>
        <dt>Email</dt>
        <dd><a href={`mailto:${lead.email}`}>{lead.email}</a></dd>
        <dt>ZIP</dt>
        <dd>{lead.zip}</dd>
        <dt>Service</dt>
        <dd>{lead.service}</dd>
        <dt>Urgency</dt>
        <dd>{lead.urgency}</dd>
        <dt>SMS consent</dt>
        <dd>{lead.sms_consent ? "Yes" : "No"}</dd>
        <dt>Submitted</dt>
        <dd>{new Date(lead.created_at).toLocaleString()}</dd>
        {lead.description ? (
          <>
            <dt>Details</dt>
            <dd>{lead.description}</dd>
          </>
        ) : null}
      </dl>
      {lead.photo_urls?.length ? (
        <div className="lead-photos">
          {lead.photo_urls.map((url) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Customer uploaded problem photo" />
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
