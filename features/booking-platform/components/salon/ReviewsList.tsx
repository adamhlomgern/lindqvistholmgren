import { Star } from "lucide-react";
import { Card } from "@/components/demo/Card";
import type { Review } from "@/features/booking-platform/types";
import { formatDateSv } from "@/features/booking-platform/utils/dates";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={13} className={index < rating ? "fill-demo-warning text-demo-warning" : "text-demo-border"} />
      ))}
    </div>
  );
}

// Static/read-only in this demo — there's no "skriv recension"-flow, just
// browsing what's seeded (see types.ts's Review comment). Shown on every
// salon's own profile page, which is how each of the catalog's companies
// gets a reviews view rather than a separate reviews hub.
export function ReviewsList({ reviews, rating, reviewCount }: { reviews: Review[]; rating: number; reviewCount: number }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-demo-text">Recensioner</h2>
        <p className="flex items-center gap-1.5 text-sm font-semibold text-demo-text">
          <Star size={14} className="fill-demo-warning text-demo-warning" />
          {rating.toFixed(1)}
          <span className="font-normal text-demo-text-faint">({reviewCount} omdömen)</span>
        </p>
      </div>

      {reviews.length === 0 ? (
        <p className="mt-3 text-sm text-demo-text-faint">Inga recensioner ännu.</p>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {reviews.map((review) => (
            <Card key={review.id} padding="compact">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-demo-text">{review.authorName}</p>
                  <p className="text-xs text-demo-text-faint">{formatDateSv(review.createdAt)}</p>
                </div>
                <StarRow rating={review.rating} />
              </div>
              <p className="mt-2 text-sm text-demo-text-muted">{review.comment}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
