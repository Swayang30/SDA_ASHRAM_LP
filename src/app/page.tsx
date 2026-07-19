import Hero from "@/components/sections/Hero";
import EventsHighlights from "@/components/sections/EventsHighlights";
import QuoteBand from "@/components/sections/QuoteBand";
import SacredActivities from "@/components/sections/SacredActivities";
import FounderFeature from "@/components/sections/FounderFeature";
import Ashram from "@/components/sections/Ashram";
import BooksPublications from "@/components/sections/BooksPublications";
import Gallery from "@/components/sections/Gallery";
import ContactMap from "@/components/sections/ContactMap";

export default function Home() {
  return (
    <>
      <Hero />
      <EventsHighlights />
      <QuoteBand />
      <SacredActivities />
      <FounderFeature />
      <Ashram />
      <BooksPublications />
      <Gallery />
      <ContactMap />
    </>
  );
}
