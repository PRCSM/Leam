import Link from "next/link";
import { Radio, Ticket, Users } from "lucide-react";
import { Photo, Avatar } from "@/components/ui/Photo";
import { getCreator, getUniverse, type Creator, type Room } from "@/lib/data";
import { formatCount, formatPrice } from "@/lib/utils";

export function CreatorCard({ c, size = "md" }: { c: Creator; size?: "md" | "lg" }) {
  return (
    <Link href={`/creators/${c.slug}`} className={`creator-card creator-tile is-${size}`} data-cursor="view">
      <Photo src={c.image} alt={`Illustrative portrait for ${c.name}`} sizes="(max-width: 700px) 50vw, 300px" className="creator-photo" position="50% 25%" />
      <span className="creator-shade" />
      <span className="creator-meta">
        <span className="creator-name">{c.name}</span>
        <span className="creator-price">
          <Ticket size={12} aria-hidden /> {formatPrice(c.priceCents)} a month
        </span>
        <span className="creator-role tiny">{c.role}</span>
      </span>
    </Link>
  );
}

export function RoomCard({ r }: { r: Room }) {
  const host = getCreator(r.host)!;
  const uni = getUniverse(r.universe)!;
  return (
    <Link href={`/rooms/${r.id}`} className="room-card" data-cursor={r.status === "live" ? "watch" : "view"}>
      <Photo src={r.image} alt="" sizes="(max-width: 700px) 80vw, 320px" className="room-card-photo" />
      <span className="room-card-shade" />
      <span className="room-card-top">
        {r.status === "live" ? (
          <span className="live-badge">
            <span className="live-dot" />
            LIVE
          </span>
        ) : (
          <span className="chip room-when">
            <Radio size={11} /> {r.startsAt}
          </span>
        )}
        {r.status === "live" && (
          <span className="room-viewers tiny">
            <Users size={11} /> {formatCount(r.viewers)}
          </span>
        )}
      </span>
      <span className="room-card-body">
        <span className="tiny muted">{uni.title}</span>
        <b>{r.title}</b>
        <span className="room-host tiny">
          <Avatar src={host.image} alt="" size={18} /> {host.name}
        </span>
      </span>
    </Link>
  );
}
