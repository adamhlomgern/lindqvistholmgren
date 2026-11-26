"use client";

import { FormEvent, useState } from "react";
import { CalendarCheck, Mail, MessageSquare, Phone, PhoneCall, PhoneMissed, PhoneOutgoing } from "lucide-react";
import { Modal } from "@/components/demo/Modal";
import { Field, inputClass } from "@/components/demo/Field";
import { Button } from "@/components/demo/Button";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { diffInDays, formatDateSv, toISODate, addDays } from "@/features/service-platform/utils/dates";
import type { Asset, CallOutcome, ContactChannel, Customer } from "@/features/service-platform/types";

const firstName = (name: string) => name.split(" ")[0];

function whenText(asset: Asset): string {
  if (!asset.nextServiceDate) return "Det är dags att boka in nästa service.";
  const diff = diffInDays(new Date(asset.nextServiceDate), new Date());
  if (diff < 0) return `Servicen skulle ha gjorts för ${Math.abs(diff)} dagar sedan.`;
  return `Nästa service rekommenderas ${formatDateSv(asset.nextServiceDate)}.`;
}

export function smsTemplate(customer: Customer, asset?: Asset): string {
  if (!asset) return `Hej ${firstName(customer.name)}! `;
  return `Hej ${firstName(customer.name)}! Dags för service av ${asset.name}${asset.identifier ? ` (${asset.identifier})` : ""}. ${whenText(asset)} Svara på detta sms eller ring oss så bokar vi en tid. Vänliga hälsningar`;
}

function emailTemplate(customer: Customer, asset?: Asset): { subject: string; body: string } {
  if (!asset) return { subject: "", body: `Hej ${firstName(customer.name)},\n\n\n\nVänliga hälsningar` };
  return {
    subject: `Dags för service: ${asset.name}`,
    body: `Hej ${firstName(customer.name)},\n\n${whenText(asset)} Svara på det här mejlet med ett par tider som passar, eller ring oss så hittar vi en tid tillsammans.\n\nVänliga hälsningar`,
  };
}

const outcomes: { key: CallOutcome; label: string; icon: typeof Phone }[] = [
  { key: "booked", label: "Bokade tid", icon: CalendarCheck },
  { key: "talked", label: "Pratade, ingen bokning", icon: PhoneCall },
  { key: "call_back", label: "Ringer tillbaka", icon: PhoneOutgoing },
  { key: "no_answer", label: "Inget svar", icon: PhoneMissed },
];

export const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"];

export function defaultBookingDate(asset?: Asset): string {
  const tomorrow = toISODate(addDays(new Date(), 1));
  if (!asset?.nextServiceDate) return tomorrow;
  return asset.nextServiceDate < tomorrow ? tomorrow : asset.nextServiceDate;
}

type Props = {
  open: boolean;
  onClose: () => void;
  channel: ContactChannel;
  customer: Customer;
  asset?: Asset;
};

// Ett ställe för att ringa, sms:a eller mejla kunden från Servicekoll.
// SMS och mejl är förifyllda utifrån objektets servicestatus men går att
// ändra; samtal loggas med utfall och kan sluta i en bokad tid.
export function ContactComposer({ open, onClose, channel, customer, asset }: Props) {
  if (!open) return null;
  return <ComposerBody key={`${channel}-${customer.id}-${asset?.id ?? ""}`} onClose={onClose} channel={channel} customer={customer} asset={asset} />;
}

function ComposerBody({ onClose, channel, customer, asset }: Omit<Props, "open">) {
  const { logContacts, bookService, notify } = useServicePlatform();
  const [sms, setSms] = useState(() => smsTemplate(customer, asset));
  const initialEmail = emailTemplate(customer, asset);
  const [subject, setSubject] = useState(initialEmail.subject);
  const [body, setBody] = useState(initialEmail.body);
  const [outcome, setOutcome] = useState<CallOutcome>("booked");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => defaultBookingDate(asset));
  const [time, setTime] = useState("09:00");

  const title =
    channel === "sms" ? `Sms till ${customer.name}` : channel === "email" ? `Mejl till ${customer.name}` : `Ring ${customer.name}`;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const base = { customerId: customer.id, assetId: asset?.id ?? null, channel };
    if (channel === "sms") {
      logContacts([{ ...base, message: sms.trim() }]);
      notify(`Sms skickat till ${customer.phone ?? customer.name}`);
    } else if (channel === "email") {
      logContacts([{ ...base, message: `${subject.trim()}\n\n${body.trim()}` }]);
      notify(`Mejl skickat till ${customer.email ?? customer.name}`);
    } else {
      const bookingNote = outcome === "booked" && asset ? `Bokad ${formatDateSv(date)} kl ${time}. ` : "";
      logContacts([{ ...base, outcome, message: `${bookingNote}${note.trim()}`.trim() || undefined }]);
      if (outcome === "booked" && asset) {
        bookService(asset.id, `${date}T${time}`);
        notify(`Tid bokad ${formatDateSv(date)} kl ${time}`);
      } else {
        notify("Samtalet är loggat");
      }
    }
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {channel === "sms" && (
          <>
            <div className="flex items-center gap-2 rounded-xl bg-demo-surface-hover px-3 py-2 text-sm text-demo-text-muted">
              <MessageSquare size={15} />
              {customer.phone ?? "Inget nummer"}
            </div>
            <Field label="Meddelande" htmlFor="sms-text">
              <textarea id="sms-text" className={`${inputClass} min-h-36`} value={sms} onChange={(e) => setSms(e.target.value)} />
            </Field>
            <p className="-mt-2 text-right text-xs text-demo-text-faint">
              {sms.length} tecken · {Math.max(1, Math.ceil(sms.length / 160))} sms
            </p>
          </>
        )}

        {channel === "email" && (
          <>
            <div className="flex items-center gap-2 rounded-xl bg-demo-surface-hover px-3 py-2 text-sm text-demo-text-muted">
              <Mail size={15} />
              {customer.email ?? "Ingen e-post"}
            </div>
            <Field label="Ämne" htmlFor="email-subject">
              <input id="email-subject" className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)} />
            </Field>
            <Field label="Meddelande" htmlFor="email-body">
              <textarea id="email-body" className={`${inputClass} min-h-44`} value={body} onChange={(e) => setBody(e.target.value)} />
            </Field>
          </>
        )}

        {channel === "call" && (
          <>
            <a
              href={customer.phone ? `tel:${customer.phone.replace(/[^\d+]/g, "")}` : undefined}
              className="flex items-center justify-between rounded-2xl bg-demo-primary-soft px-4 py-4 text-demo-primary-soft-text transition-colors hover:brightness-95"
            >
              <span>
                <span className="block text-xs">Ring upp</span>
                <span className="block text-xl font-semibold tabular-nums">{customer.phone ?? "Inget nummer"}</span>
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-demo-primary text-white">
                <Phone size={18} />
              </span>
            </a>
            <fieldset>
              <legend className="text-xs font-medium text-demo-text-muted">Hur gick samtalet?</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {outcomes.map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    aria-pressed={outcome === o.key}
                    onClick={() => setOutcome(o.key)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                      outcome === o.key
                        ? "border-demo-primary bg-demo-primary-soft text-demo-primary-soft-text"
                        : "border-demo-border text-demo-text hover:bg-demo-surface-hover"
                    }`}
                  >
                    <o.icon size={15} />
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>
            {outcome === "booked" && asset && (
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <Field label="Datum" htmlFor="book-date">
                  <input id="book-date" type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} max="9999-12-31" required />
                </Field>
                <Field label="Tid" htmlFor="book-time">
                  <select id="book-time" className={inputClass} value={time} onChange={(e) => setTime(e.target.value)}>
                    {timeSlots.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
              </div>
            )}
            <Field label="Anteckning" htmlFor="call-note">
              <textarea
                id="call-note"
                className={`${inputClass} min-h-20`}
                placeholder="T.ex. vill ha lånebil, ring efter kl 15"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Field>
          </>
        )}

        <div className="mt-1 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Avbryt
          </Button>
          <Button type="submit">
            {channel === "sms" ? "Skicka sms" : channel === "email" ? "Skicka mejl" : "Spara samtalet"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
