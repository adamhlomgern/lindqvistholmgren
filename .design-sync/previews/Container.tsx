import { Container } from "lindqvistholmgren-ui";

export function WithContent() {
  return (
    <div className="bg-forest p-6">
      <Container>
        <p className="text-bone">
          Container centrerar innehållet och sätter horisontell padding och max-bredd —
          den yttre ramen för nästan allt innehåll på sidan.
        </p>
      </Container>
    </div>
  );
}
