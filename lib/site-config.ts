export const site = {
  businessName: "Indiana Sewer & Drain LLC",
  shortName: "Indiana Sewer & Drain",
  phone: "317-847-7044",
  phoneTel: "tel:+13178477044",
  email: "indianasewerdrain@outlook.com",
  city: "Camby",
  state: "IN",
  zip: "46113",
  locationLine: "Camby, Indiana 46113",
  facebookUrl: "https://www.facebook.com/",
  serviceAreaPrimary: "Camby, Indiana",
  serviceAreaHeadline: "Serving Camby and Central Indiana",
  /** Google Maps embed (no API key) — centered on Camby, wider view for Central Indiana */
  mapEmbedUrl: "https://maps.google.com/maps?q=Camby,+IN+46113&hl=en&z=10&output=embed",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Camby,+IN+46113",
  /** Cities to enable once confirmed by the owner */
  serviceAreaCitiesPending: [
    "Mooresville",
    "Plainfield",
    "Avon",
    "Indianapolis",
    "Greenwood",
    "Martinsville",
  ] as const,
};

export const SERVICE_OPTIONS = [
  "Clogged / Slow Drain",
  "Sewer Line Problem",
  "Camera Inspection",
  "Water Heater",
  "Sink / Faucet",
  "Toilet / Urinal",
  "Plumbing Repair",
  "Other / Not Sure",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export const URGENCY_OPTIONS = [
  "I need help ASAP",
  "Today if possible",
  "Within the next few days",
  "Just getting information",
] as const;

export type UrgencyOption = (typeof URGENCY_OPTIONS)[number];

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Scheduled",
  "Closed",
  "Not a Fit",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
