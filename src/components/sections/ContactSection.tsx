import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { GlowButton } from "@/components/ui/GlowButton";
import { siteConfig, socialLinks } from "@/data/siteConfig";
import { toast } from "sonner";
import { Github, Instagram, Linkedin, Mail, Send, Download } from "lucide-react";

type FormData = { name: string; email: string; subject: string; message: string };

export function ContactSection() {
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSending(true);
    try {
      const res = await fetch(siteConfig.formspree, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Signal received — I'll be in touch soon.");
      reset();
    } catch {
      toast.error("Transmission failed. Try email instead.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-28">
      <div className="container">
        <SectionHeader
          eyebrow="// LAUNCH TERMINAL"
          title="Open a channel."
          description="Recruiters, collaborators, curious builders — the terminal is live."
        />

        <div className="grid lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <HolographicPanel strong scanline>
              <div className="flex items-center gap-2 mb-6 font-mono text-xs">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-hud" />
                <span className="h-2.5 w-2.5 rounded-full bg-signal" />
                <span className="ml-3 text-muted-foreground">mohit@portfolio:~/contact$</span>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-hud text-[10px] tracking-[0.25em] text-muted-foreground">NAME</label>
                    <input
                      {...register("name", { required: true, minLength: 2 })}
                      className="w-full mt-1 h-11 px-3 rounded-lg bg-background/60 border border-border focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">Name required</p>}
                  </div>
                  <div>
                    <label className="font-hud text-[10px] tracking-[0.25em] text-muted-foreground">EMAIL</label>
                    <input
                      type="email"
                      {...register("email", { required: true, pattern: /\S+@\S+\.\S+/ })}
                      className="w-full mt-1 h-11 px-3 rounded-lg bg-background/60 border border-border focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                      placeholder="you@domain.com"
                    />
                    {errors.email && <p className="text-xs text-destructive mt-1">Valid email required</p>}
                  </div>
                </div>
                <div>
                  <label className="font-hud text-[10px] tracking-[0.25em] text-muted-foreground">SUBJECT</label>
                  <input
                    {...register("subject", { required: true, minLength: 3 })}
                    className="w-full mt-1 h-11 px-3 rounded-lg bg-background/60 border border-border focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                    placeholder="Topic of transmission"
                  />
                  {errors.subject && <p className="text-xs text-destructive mt-1">Subject required</p>}
                </div>
                <div>
                  <label className="font-hud text-[10px] tracking-[0.25em] text-muted-foreground">MESSAGE</label>
                  <textarea
                    rows={5}
                    {...register("message", { required: true, minLength: 10 })}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background/60 border border-border focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan resize-none"
                    placeholder="Send your signal..."
                  />
                  {errors.message && <p className="text-xs text-destructive mt-1">At least 10 characters</p>}
                </div>
                <GlowButton type="submit" disabled={sending} className="w-full sm:w-auto">
                  {sending ? "TRANSMITTING..." : (<>TRANSMIT <Send className="h-3.5 w-3.5" /></>)}
                </GlowButton>
              </form>
            </HolographicPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <HolographicPanel>
              <div className="font-hud text-[10px] tracking-[0.3em] text-cyan mb-3">DIRECT CHANNELS</div>
              <div className="space-y-2 text-sm">
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 hover:text-cyan transition-colors">
                  <Mail className="h-4 w-4 text-cyan" /> {siteConfig.email}
                </a>
                <a href={`mailto:${siteConfig.collegeEmail}`} className="flex items-center gap-3 hover:text-cyan transition-colors">
                  <Mail className="h-4 w-4 text-violet" /> {siteConfig.collegeEmail}
                </a>
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-cyan transition-colors">
                  <Linkedin className="h-4 w-4 text-electric" /> LinkedIn
                </a>
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-cyan transition-colors">
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-cyan transition-colors">
                  <Instagram className="h-4 w-4 text-accent" /> Instagram
                </a>
              </div>
            </HolographicPanel>

            <HolographicPanel strong>
              <div className="font-hud text-[10px] tracking-[0.3em] text-cyan mb-2">MISSION READY</div>
              <p className="text-sm text-muted-foreground mb-4">
                Open to internships, freelance and full-time in AI/ML, cybersecurity, automation and full-stack.
              </p>
              <a href={siteConfig.resume} download={siteConfig.resumeDownloadName}>
                <GlowButton className="w-full">
                  <Download className="h-3.5 w-3.5" /> DOWNLOAD RESUME
                </GlowButton>
              </a>
            </HolographicPanel>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
