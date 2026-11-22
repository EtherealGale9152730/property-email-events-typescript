import { sendPropertyCampaign } from "./property_campaign.ts";

const to = process.env.DEMO_EMAIL_TO;
if (!to) throw new Error("DEMO_EMAIL_TO is required");

const result = await sendPropertyCampaign({
  tenantEmail: to,
  tenantName: "Demo tenant",
  maintenanceRequest: "Replace the hallway light",
  documentName: "Move-in checklist.pdf",
  inspectionDate: "2026-11-03"
});
console.log(JSON.stringify(result, null, 2));
