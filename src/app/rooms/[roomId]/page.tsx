import { use } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LiveRoom } from "@/components/room/LiveRoom";
import { ROOMS, getRoom, getUniverse } from "@/lib/data";
import { liveKitConfigured } from "@/lib/livekit";

type Params = { roomId: string };
export function generateStaticParams() {
  return ROOMS.map((r) => ({ roomId: r.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const r = getRoom((await params).roomId);
  return r ? { title: r.title, description: `A live room in ${getUniverse(r.universe)?.title} on Leam.` } : {};
}

export default function RoomPage({ params }: { params: Promise<Params> }) {
  const { roomId } = use(params);
  const room = getRoom(roomId);
  if (!room) notFound();
  const uni = getUniverse(room.universe)!;
  return (
    <section className="shell-wide room-page">
      <div className="room-crumbs">
        <Link href={`/universes/${uni.slug}`}>
          <ArrowLeft size={14} style={{ display: "inline", verticalAlign: -2 }} /> {uni.title}
        </Link>
        <span className="tiny faint">{room.status === "live" ? "Live now" : `Scheduled · ${room.startsAt} — preview of the room UI`}</span>
      </div>
      <h1 className="sr-only">{room.title}</h1>
      <LiveRoom roomId={room.id} liveConfigured={liveKitConfigured()} />
    </section>
  );
}
