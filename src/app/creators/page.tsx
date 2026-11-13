import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";
import { CreatorDirectory } from "@/components/pages/CreatorDirectory";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Creators",
  description: "Meet the creators building Universes on Leam.",
};

export default function CreatorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Creators"
        lines={["The people", "behind the rooms."]}
        lede="Musicians, painters, directors, teachers and hosts — each running a Universe their way. (Demo profiles: names are fictional and photos are illustrative.)"
        image={IMG.womanCloak}
        imagePosition="50% 30%"
      />
      <section className="shell section-tight">
        <CreatorDirectory />
      </section>
    </>
  );
}
