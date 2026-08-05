import { Section } from "lindqvistholmgren-ui";

export function Forest() {
  return (
    <Section tone="forest">
      <p className="text-bone">Sektion med tone=&quot;forest&quot; — sidans grundyta.</p>
    </Section>
  );
}

export function Olive() {
  return (
    <Section tone="olive">
      <p className="text-bone">Sektion med tone=&quot;olive&quot; — upphöjd yta för omväxling.</p>
    </Section>
  );
}

export function Charcoal() {
  return (
    <Section tone="charcoal">
      <p className="text-bone">
        Sektion med tone=&quot;charcoal&quot; — mörkast, används i header och footer.
      </p>
    </Section>
  );
}
