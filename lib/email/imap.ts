import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCustomerByEmail } from "@/lib/data/customers";

type SyncResult = { fetched: number; matched: number };

type SyncState = { last_uid: number; uid_validity: string | null };

export async function syncInbox(): Promise<SyncResult> {
  const supabase = createServiceRoleClient();

  const { data: state } = await supabase
    .from("email_sync_state")
    .select("last_uid, uid_validity")
    .eq("id", 1)
    .single<SyncState>();

  let lastUid = state?.last_uid ?? 0;
  const storedUidValidity = state?.uid_validity ?? null;

  const client = new ImapFlow({
    host: process.env.IMAP_HOST!,
    port: Number(process.env.IMAP_PORT ?? 993),
    secure: process.env.IMAP_SECURE !== "false",
    auth: { user: process.env.IMAP_USER!, pass: process.env.IMAP_PASSWORD! },
    logger: false,
  });

  let fetched = 0;
  let matched = 0;

  await client.connect();
  try {
    const lock = await client.getMailboxLock("INBOX");
    try {
      const currentUidValidity = String(client.mailbox && "uidValidity" in client.mailbox ? client.mailbox.uidValidity : "");
      const uidNext = client.mailbox && "uidNext" in client.mailbox ? client.mailbox.uidNext : 1;

      // The IMAP server invalidated the UID sequence (can happen after
      // mailbox reorganization on some Dovecot/cPanel setups) — start over
      // rather than silently skipping mail whose UIDs no longer mean what
      // we think they mean.
      if (storedUidValidity && storedUidValidity !== currentUidValidity) {
        console.warn("[syncInbox] uidValidity changed, resetting last_uid to 0");
        lastUid = 0;
      }

      if (lastUid + 1 >= uidNext) {
        return { fetched: 0, matched: 0 };
      }

      let maxUidSeen = lastUid;
      const rows: Record<string, unknown>[] = [];

      for await (const message of client.fetch(
        { uid: `${lastUid + 1}:*` },
        { envelope: true, source: true, uid: true },
      )) {
        if (!message.source) continue;
        const parsed = await simpleParser(message.source);
        const fromAddress = parsed.from?.value[0]?.address ?? message.envelope?.from?.[0]?.address;
        if (!fromAddress) continue;

        const customer = await getCustomerByEmail(fromAddress);
        if (customer) matched += 1;

        rows.push({
          customer_id: customer?.id ?? null,
          message_id: parsed.messageId ?? `<no-id-${message.uid}@local>`,
          uid: message.uid,
          from_address: fromAddress,
          from_name: parsed.from?.value[0]?.name ?? null,
          to_address: Array.isArray(parsed.to) ? parsed.to[0]?.text : parsed.to?.text ?? null,
          subject: parsed.subject ?? null,
          body_text: parsed.text ?? null,
          body_html: parsed.html || null,
          received_at: (parsed.date ?? new Date()).toISOString(),
        });

        maxUidSeen = Math.max(maxUidSeen, message.uid);
        fetched += 1;
      }

      if (rows.length > 0) {
        const { error } = await supabase
          .from("emails")
          .upsert(rows, { onConflict: "message_id", ignoreDuplicates: true });
        if (error) console.error("[syncInbox] Kunde inte spara mejl", error);
      }

      await supabase
        .from("email_sync_state")
        .update({
          last_uid: maxUidSeen,
          uid_validity: currentUidValidity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }

  return { fetched, matched };
}
