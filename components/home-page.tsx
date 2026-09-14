"use client";

import Image from "next/image";
import { useState } from "react";
import { IconArrow, IconPhone } from "@/components/icons";
import { ServiceRequestForm, scrollToServiceForm } from "@/components/service-request-form";
import { site, type ServiceOption } from "@/lib/site-config";

const services = [
  {
    title: "Drain Cleaning",
    copy: "Clearing slow and clogged drains and getting water moving again.",
    cta: "I have a clogged drain",
    value: "Clogged / Slow Drain" as ServiceOption,
    image: "/images/services/drain-cleaning.jpg",
  },
  {
    title: "Sewer Line Service",
    copy: "Help diagnosing sewer backups, blockages, and line problems.",
    cta: "I have a sewer problem",
    value: "Sewer Line Problem" as ServiceOption,
    image: "/images/services/sewer-line.jpg",
  },
  {
    title: "Camera Inspections",
    copy: "See what's happening inside the line before making decisions about repairs.",
    cta: "Schedule an inspection",
    value: "Camera Inspection" as ServiceOption,
    image: "/images/services/camera-inspection.jpg",
  },
  {
    title: "Water Heaters",
    copy: "Water heater diagnosis, repair, replacement, and installation.",
    cta: "Water heater help",
    value: "Water Heater" as ServiceOption,
    image: "/images/services/water-heater.jpg",
  },
  {
    title: "Sinks & Faucets",
    copy: "Repairs, replacements, leaks, and fixture installation.",
    cta: "Sink or faucet help",
    value: "Sink / Faucet" as ServiceOption,
    image: "/images/services/sink-faucet.jpg",
  },
  {
    title: "Toilets & Urinals",
    copy: "Repair, replacement, installation, and drainage issues.",
    cta: "Toilet help",
    value: "Toilet / Urinal" as ServiceOption,
    image: "/images/services/toilet.jpg",
  },
];

const symptoms = [
  { title: "Slow drains", icon: "⌛" },
  { title: "Gurgling sounds", icon: "〰" },
  { title: "Foul odors", icon: "!" },
  { title: "Standing water / backups", icon: "▲" },
];

const whyUs = [
  { title: "Quick & effective service", copy: "Straightforward help when drains and lines stop working." },
  { title: "Upfront, honest communication", copy: "Clear answers about what's going on and what comes next." },
  { title: "Professional equipment", copy: "Including camera inspections to see inside the line." },
  { title: "Locally owned & operated", copy: `Based in ${site.city} and serving Central Indiana.` },
];

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<ServiceOption | "">("");

  function pickService(service: ServiceOption) {
    setPreselectedService(service);
    scrollToServiceForm(service);
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label={`${site.shortName} home`}>
          <Image
            className="brand__logo"
            src="/logo.png"
            alt=""
            width={56}
            height={56}
            priority
          />
        </a>
        <nav className={menuOpen ? "open" : ""} aria-label="Main navigation">
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#camera-inspections" onClick={() => setMenuOpen(false)}>Camera Inspections</a>
          <a href="#why-us" onClick={() => setMenuOpen(false)}>Why Us</a>
          <a href="#service-area" onClick={() => setMenuOpen(false)}>Service Area</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <div className="header-actions">
          <a className="header-phone" href={site.phoneTel}>
            <IconPhone />
            Call {site.phone}
          </a>
          <a className="button button-green" href="#service-request" onClick={() => setMenuOpen(false)}>
            Request Service
            <IconArrow />
          </a>
        </div>
        <button
          type="button"
          className="menu-button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span /><span />
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-media">
          <Image
            src="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1400&q=80"
            alt="Plumber working on drain and sewer service"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          <div className="hero-media-accent" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">SEWER · DRAIN · PLUMBING</p>
          <h1>Fast help when things stop flowing.</h1>
          <p>
            Drain problems don&apos;t usually happen at a convenient time. Indiana Sewer &amp; Drain provides
            straightforward sewer, drain, and plumbing service throughout Central Indiana.
          </p>
          <div className="hero-ctas">
            <a className="button button-green" href="#service-request">
              Request Service
              <IconArrow />
            </a>
            <a className="button button-outline-dark" href={site.phoneTel}>
              Call {site.phone}
            </a>
          </div>
          <ul className="hero-trust">
            <li>Same-day service when available</li>
            <li>Upfront communication</li>
            <li>Locally owned &amp; operated</li>
          </ul>
          <p className="hero-local">Serving Camby &amp; Central Indiana</p>
        </div>
      </section>

      <section className="lead-band" id="service-request">
        <div className="lead-band__form">
          <header className="lead-band__head">
            <p className="eyebrow eyebrow--green">SERVICE REQUEST</p>
            <h2>Tell us what&apos;s going on.</h2>
            <p>
              Send a few details and Indiana Sewer &amp; Drain can respond directly about your service request.
            </p>
          </header>
          <ServiceRequestForm preselectedService={preselectedService} />
        </div>
      </section>

      <section className="section section--light" id="services">
        <div className="section-head">
          <p className="eyebrow eyebrow--green">WHAT WE DO</p>
          <h2>Sewer, drain &amp; plumbing services.</h2>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article key={service.title} className="service-card">
              <div className="service-card__image">
                <Image src={service.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" />
              </div>
              <div className="service-card__body">
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <button type="button" className="service-card__cta" onClick={() => pickService(service.value)}>
                  {service.cta}
                  <IconArrow />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section diagnostic" id="diagnostics">
        <div className="section-head section-head--center">
          <h2>Something not draining right?</h2>
        </div>
        <div className="symptom-grid">
          {symptoms.map((item) => (
            <article key={item.title} className="symptom-card">
              <span className="symptom-icon" aria-hidden="true">{item.icon}</span>
              <h3>{item.title}</h3>
            </article>
          ))}
        </div>
        <p className="diagnostic-copy">
          These can be early signs of a blockage or sewer/drain issue. Tell us what you&apos;re seeing and we&apos;ll
          help determine the next step.
        </p>
        <button type="button" className="button button-green" onClick={() => scrollToServiceForm()}>
          Describe the problem
          <IconArrow />
        </button>
      </section>

      <section className="camera-feature" id="camera-inspections">
        <div className="camera-feature__media">
          <Image
            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80"
            alt="Sewer camera inspection equipment"
            fill
            sizes="100vw"
          />
        </div>
        <div className="camera-feature__copy">
          <p className="eyebrow eyebrow--light">SEE THE PROBLEM BEFORE YOU FIX THE PROBLEM</p>
          <h2>Know what&apos;s happening inside the line.</h2>
          <p>
            A sewer camera inspection can help locate blockages, roots, breaks, deterioration, or other problems
            without guessing.
          </p>
          <ul className="camera-benefits">
            <li>Find the source</li>
            <li>Avoid guesswork</li>
            <li>Understand repair options</li>
            <li>Useful before buying or selling a home</li>
          </ul>
          <button type="button" className="button button-green" onClick={() => pickService("Camera Inspection")}>
            Request a Camera Inspection
            <IconArrow />
          </button>
          <p className="camera-secondary">
            <strong>Buying or selling a home?</strong> Get a better look at one of the systems you can&apos;t see
            during a normal walk-through.
          </p>
        </div>
      </section>

      <section className="section section--light" id="how-it-works">
        <div className="section-head">
          <h2>Getting help shouldn&apos;t be complicated.</h2>
        </div>
        <ol className="steps">
          <li>
            <span>01</span>
            <h3>Tell us what&apos;s happening</h3>
            <p>Call, text, or send a service request.</p>
          </li>
          <li>
            <span>02</span>
            <h3>We follow up</h3>
            <p>Indiana Sewer &amp; Drain contacts you to understand the issue and arrange the next step.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Fix the problem</h3>
            <p>Diagnose the issue, explain the options, and get your plumbing moving again.</p>
          </li>
        </ol>
      </section>

      <section className="section" id="why-us">
        <div className="section-head">
          <h2>Straightforward service. No guesswork.</h2>
        </div>
        <div className="why-grid">
          {whyUs.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--light service-area" id="service-area">
        <div className="section-head">
          <h2>{site.serviceAreaHeadline}.</h2>
        </div>
        <div className="service-area__layout">
          <div className="service-area__info">
            <div className="service-area__primary">
              <span className="service-area__pin" aria-hidden="true">◎</span>
              <div>
                <strong>{site.serviceAreaPrimary}</strong>
                <p>Additional cities can be added here once confirmed.</p>
              </div>
            </div>
            <p className="service-area__zip">
              Not sure if you&apos;re in the service area? Enter your ZIP code in the service request form or{" "}
              <button type="button" className="text-link" onClick={() => scrollToServiceForm()}>send a request</button>.
            </p>
            <a className="service-area__maps-link" href={site.mapLink} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
          </div>
          <div className="service-area__map">
            <iframe
              title={`Map of ${site.serviceAreaPrimary} and surrounding Central Indiana`}
              src={site.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="urgent-cta">
        <h2>Drain backed up? Sewer problem? No hot water?</h2>
        <p>Don&apos;t spend your time trying to figure out which service you need. Tell us what is happening.</p>
        <div className="urgent-cta__actions">
          <a className="button button-outline-light" href={site.phoneTel}>Call {site.phone}</a>
          <a className="button button-green" href="#service-request">Request Service</a>
        </div>
      </section>

      <footer className="site-footer" id="contact">
        <div>
          <strong>{site.businessName}</strong>
          <p>{site.city}, {site.state} {site.zip}</p>
          <p>
            <a href={site.phoneTel}>{site.phone}</a>
            <br />
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <nav aria-label="Footer">
          <a href="#services">Services</a>
          <a href="#camera-inspections">Camera Inspections</a>
          <a href="#service-area">Service Area</a>
          <a href="#contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
          <a href={site.facebookUrl} rel="noopener noreferrer">Facebook</a>
        </nav>
        <p className="footer-note">© {new Date().getFullYear()} {site.businessName}</p>
      </footer>

      <div className="mobile-sticky-bar" aria-label="Quick contact">
        <a href={site.phoneTel}>Call Now</a>
        <a href="#service-request">Request Service</a>
      </div>
    </>
  );
}
