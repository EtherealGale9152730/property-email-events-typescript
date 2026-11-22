import { z } from "zod";
import { infrai } from "./infrai.ts";

export const campaignRequest = z.object({
  tenantEmail: z.string().email(),
  tenantName: z.string().min(1),
  maintenanceRequest: z.string().min(1),
  documentName: z.string().min(1),
  inspectionDate: z.string().min(1)
});

export type CampaignRequest = z.infer<typeof campaignRequest>;

export function campaignMessage(input: CampaignRequest) {
  return {
    to: input.tenantEmail,
    subject: `Property update for ${input.tenantName}`,
    html: `<h1>Property update</h1><p>Maintenance: ${input.maintenanceRequest}</p><p>Document: ${input.documentName}</p><p>Inspection reminder: ${input.inspectionDate}</p>`
  };
}

export async function sendPropertyCampaign(raw: unknown) {
  const input = campaignRequest.parse(raw);
  const message = await infrai.email.send(campaignMessage(input), `property-campaign-${input.tenantEmail}-${input.inspectionDate}`);
  const events = await infrai.email.event.list(message.message_id);
  return { messageId: message.message_id, events };
}
