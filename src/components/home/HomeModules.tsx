import CardSection from "@/components/sections/CardSection";
import ContactSection from "@/components/sections/ContactSection";
import LegalSection from "@/components/sections/LegalSection";
import SakhaAshrams from "@/components/sections/SakhaAshrams";
import { activeModules, type HomeModule } from "@/data/modules";

/**
 * Renders homepage sections 4–15 from the module registry, in order.
 * Reordering / enabling sections is done purely in `src/data/modules.ts` —
 * this component never needs to change.
 */
function renderModule(module: HomeModule) {
  switch (module.kind) {
    case "cards":
      return <CardSection key={module.id} module={module} />;
    case "contact":
      return <ContactSection key={module.id} module={module} />;
    case "legal":
      return <LegalSection key={module.id} module={module} />;
    case "sakha":
      // Content comes from `ashrams` in site.ts — no module payload needed.
      return <SakhaAshrams key={module.id} />;
  }
}

export default function HomeModules() {
  return <>{activeModules.map(renderModule)}</>;
}
