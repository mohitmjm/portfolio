import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { skillGroups } from "@/data/skills";

const accentClass: Record<string, string> = {
  cyan: "text-cyan border-cyan/40",
  violet: "text-violet border-violet/40",
  electric: "text-electric border-electric/40",
  signal: "text-signal border-signal/40",
  "amber-hud": "text-amber-hud border-amber-hud/40",
};

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-28">
      <div className="container">
        <SectionHeader
          eyebrow="// TECH ORBIT"
          title="Skill nodes in continuous rotation."
          description="Grouped by domain. Each node is something I've actually shipped or worked with."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((g, i) => (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <HolographicPanel className="h-full group hover:shadow-glow transition-shadow">
                <div className={`font-hud text-[10px] tracking-[0.3em] mb-3 ${accentClass[g.accent].split(" ")[0]}`}>
                  {g.name.toUpperCase()}
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s) => (
                    <span
                      key={s}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium bg-secondary/60 border ${accentClass[g.accent]} transition-colors`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </HolographicPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
