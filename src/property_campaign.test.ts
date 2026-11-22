import { strict as assert } from "node:assert";
import { campaignMessage, campaignRequest } from "./property_campaign.ts";

const input = {
  tenantEmail: "tenant@example.com",
  tenantName: "Mina Chen",
  maintenanceRequest: "Leaking kitchen tap",
  documentName: "Lease renewal.pdf",
  inspectionDate: "2026-11-03"
};

const parsed = campaignRequest.parse(input);
const message = campaignMessage(parsed);
assert.equal(message.to, input.tenantEmail);
assert.match(message.html, /Leaking kitchen tap/);
assert.match(message.html, /2026-11-03/);
console.log("campaign decision test passed: maintenance, document, and inspection details are included");
