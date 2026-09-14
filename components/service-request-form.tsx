"use client";

import { useEffect, useRef, useState } from "react";
import { IconArrow } from "@/components/icons";
import { SERVICE_OPTIONS, URGENCY_OPTIONS, type ServiceOption } from "@/lib/site-config";

type FormStatus = "idle" | "loading" | "success" | "error";

type ServiceRequestFormProps = {
  formId?: string;
  source?: string;
  preselectedService?: ServiceOption | "";
};

export function ServiceRequestForm({
  formId = "service-request-form",
  source = "primary-form",
  preselectedService = "",
}: ServiceRequestFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceOption | "">(preselectedService);

  useEffect(() => {
    if (preselectedService) setSelectedService(preselectedService);
  }, [preselectedService]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = new FormData(form);
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/lead", { method: "POST", body: payload });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to send your request.");
      setStatus("success");
      form.reset();
      setSelectedService("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success-panel" role="status">
        <h3>Request received.</h3>
        <p>
          Indiana Sewer &amp; Drain has your information. We&apos;ll use the contact information you provided to
          follow up.
        </p>
        <button
          type="button"
          className="button button-ghost"
          onClick={() => {
            setStatus("idle");
            formRef.current?.reset();
          }}
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} id={formId} className="service-form" onSubmit={onSubmit}>
      <input className="honey" name="formCheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input type="hidden" name="source" value={source} />

      <div className="form-row">
        <label>
          First name *
          <input name="firstName" autoComplete="given-name" required placeholder="First name" />
        </label>
        <label>
          Last name *
          <input name="lastName" autoComplete="family-name" required placeholder="Last name" />
        </label>
      </div>

      <div className="form-row">
        <label>
          Phone *
          <input name="phone" type="tel" autoComplete="tel" required placeholder="(317) 847-7044" />
        </label>
        <label>
          Email *
          <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        </label>
      </div>

      <div className="form-row form-row--zip">
        <label>
          ZIP code *
          <input name="zip" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} required placeholder="46113" />
        </label>
        <label>
          What do you need help with? *
          <select
            name="service"
            required
            value={selectedService}
            onChange={(event) => setSelectedService(event.target.value as ServiceOption)}
          >
            <option value="" disabled>Select a service</option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="urgency-fieldset">
        <legend>How urgent is this? *</legend>
        <div className="urgency-options">
          {URGENCY_OPTIONS.map((option) => (
            <label key={option} className="urgency-option">
              <input type="radio" name="urgency" value={option} required />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        Tell us what&apos;s happening
        <textarea
          name="description"
          rows={4}
          placeholder="Example: Kitchen sink backed up and water is coming into the other basin."
        />
      </label>

      <label className="file-field">
        Upload a photo of the problem <span>(optional, up to 3)</span>
        <span className="file-control">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 16V4m-4 4 4-4 4 4M5 14v5h14v-5" />
          </svg>
          <span>JPG, PNG, WEBP, or HEIC — great for leaks, backups, and visible damage</span>
          <input
            name="photos"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
          />
        </span>
        <small>Up to 3 photos, 4 MB each.</small>
      </label>

      <label className="consent-check">
        <input name="smsConsent" type="checkbox" value="yes" />
        <span>Text me about my service request.</span>
      </label>
      <p className="sms-disclosure">
        By checking this box, you agree to receive text messages from Indiana Sewer &amp; Drain LLC about your
        service request. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP
        for help. Consent is not a condition of purchase.
      </p>

      <button className="button button-green form-submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Request Service"}
        <IconArrow />
      </button>
      <p className="form-note">No pressure. Your information is only used to respond to your request.</p>
      {status === "error" && errorMessage && (
        <p className="form-message error" role="alert">{errorMessage}</p>
      )}
    </form>
  );
}

export function scrollToServiceForm(service?: ServiceOption) {
  const section = document.getElementById("service-request");
  section?.scrollIntoView({ behavior: "smooth", block: "start" });
  if (service) {
    window.setTimeout(() => {
      const select = document.querySelector<HTMLSelectElement>("#service-request-form select[name='service']");
      if (select) {
        select.value = service;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
      document.querySelector<HTMLInputElement>("#service-request-form input[name='firstName']")?.focus({
        preventScroll: true,
      });
    }, 500);
  }
}
