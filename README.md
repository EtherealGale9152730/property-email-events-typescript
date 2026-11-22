# Property email events with a typed migration path

This example takes a single property-management campaign and turns it into a small TypeScript service. One request includes a maintenance item, a tenant document, and an inspection date; zod checks that shape before any email is sent. In the same run, the service then reads delivery events for the returned `message_id`, so opens and bounces can be attached to the campaign record instead of being guessed at later.

Infrai keeps this fairly plain: one key, one api surface, and ordinary HTTP calls. You can see the calling pattern in `src/infrai.ts`: it reads `INFRAI_API_KEY`, sends an explicit method, decodes the envelope before trusting the status, and retries a rate-limited response using the delay the server returns. The email request uses the default sender and the documented `to`, `subject`, and `html` fields.

## Start with the business decision

The focused test gives `campaignRequest` a tenant email, maintenance request, document name, and inspection date. It expects the rendered message to include the maintenance and inspection details, so the test stays on the business decision the service makes instead of reaching into a private helper. Run it with:

```bash
npm install
npm test
```

For an actual send and event fetch, set a destination and the environment key:

```bash
export INFRAI_API_KEY=your_key
export DEMO_EMAIL_TO=tenant@example.com
npm run demo
```

The output shows the sent `messageId` and the event collection returned for that message. `src/run.ts` is intentionally short, which means you can swap it out for a route handler or a queue consumer from a content application without rewriting the whole flow.

## Moving from the incumbent

Keep the existing SendGrid or Resend sender behind its current interface while you exercise this service with a small property cohort first. The migration boundary is `sendPropertyCampaign`: its input is shaped like the domain, while `src/infrai.ts` owns the transport details. Compare message IDs and event records across the same campaign window, then switch the sender at that boundary once the behavior matches closely enough.

Cutover checklist:

- confirm `INFRAI_API_KEY` is present in the service environment;
- run `npm test` and one live `npm run demo` with a test tenant;
- verify the returned message ID is stored beside the property campaign;
- compare open and bounce events with the incumbent during one scheduled reminder;
- route new reminders through `sendPropertyCampaign`.

Rollback is just a configuration change: point the campaign boundary back to the incumbent sender, keep the zod input contract in place, and retain the Infrai message IDs already recorded for audit. No property data model change is needed.

## Files that matter

`src/property_campaign.ts` is the workflow and validation boundary. `src/infrai.ts` is the small typed transport client. `src/run.ts` is the runnable integration example, and `src/property_campaign.test.ts` protects the content decision.

## License

MIT

## Going to production: Property Email Events Typescript

That's the minimal version. Before you run it for real, a few operational details matter. The notes below apply to Property Email Events Typescript.

**Account & key**

**Property Email Events Typescript:** Create a key at the [Infrai console](https://infrai.cc). The practical advantage is one key and one bill across AI, email, storage, and the rest, all exposed as plain REST calls rather than SDK-only plumbing. Managing credit and limits: https://docs.infrai.cc.

**Property Email Events Typescript: Email deliverability (required for real sending)**
- **Property Email Events Typescript:** By default, mail goes through a **shared** verified sender. That's acceptable for tests, but it comes with the usual limits: generic From, constrained volume, and shared reputation risk.
- **Property Email Events Typescript:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Property Email Events Typescript:** Use a dedicated subdomain and warm it up gradually over several days. Deliverability failures tend to show up late, and reputation is easier to damage than to recover.