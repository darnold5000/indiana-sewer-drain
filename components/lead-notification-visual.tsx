import { site } from "@/lib/site-config";

export function LeadNotificationVisual() {
  return (
    <div className="notify-flow" aria-hidden="true">
      <div className="notify-card notify-card--customer">
        <span className="notify-label">Service request received</span>
        <strong>Joe M.</strong>
        <span>Clogged / Slow Drain</span>
        <small>{site.city}, {site.state}</small>
      </div>
      <div className="notify-arrow">
        <span className="pulse-dot" />
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14m-5-6 6 6-6 6" />
        </svg>
      </div>
      <div className="notify-card notify-card--owner">
        <span className="notify-label">Owner notified by text</span>
        <strong>NEW SERVICE REQUEST</strong>
        <span>Issue + urgency on your phone</span>
        <small>+ email with photos</small>
      </div>
      <p className="notify-caption">
        Your request doesn&apos;t just disappear into an inbox. New website requests can notify{" "}
        {site.shortName} immediately by text and email.
      </p>
    </div>
  );
}
