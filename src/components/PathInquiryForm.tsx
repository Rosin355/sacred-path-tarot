import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  inquiryPathLabels,
  inquiryTopics,
  type InquiryPath,
  type InquiryTopic,
} from "@/config/inquiries";
import { isPrivacyContactConfigured } from "@/config/privacy";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Inserisci almeno 2 caratteri.").max(100, "Il nome è troppo lungo."),
  email: z.string().trim().email("Inserisci un indirizzo email valido.").max(254, "L’email è troppo lunga."),
  phone: z.string().trim().max(30, "Il numero è troppo lungo."),
  topic: z.string().min(1, "Scegli il motivo della richiesta."),
  message: z.string().trim().min(20, "Scrivi almeno 20 caratteri.").max(2000, "Il messaggio è troppo lungo."),
  privacyAccepted: z.boolean().refine((value) => value === true, {
    message: "Devi confermare di aver letto l’informativa privacy.",
  }),
  company: z.string().optional(),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

interface PathInquiryFormProps {
  path: InquiryPath;
  selectedTopic?: InquiryTopic;
}

const createSubmissionToken = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

export function PathInquiryForm({ path, selectedTopic }: PathInquiryFormProps) {
  const [submissionState, setSubmissionState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const submissionTokenRef = useRef(createSubmissionToken());
  const topics = inquiryTopics[path];
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: selectedTopic ?? "",
      message: "",
      privacyAccepted: false,
      company: "",
    },
  });

  useEffect(() => {
    if (selectedTopic && topics.some((topic) => topic.value === selectedTopic)) {
      form.setValue("topic", selectedTopic, { shouldValidate: true });
    }
  }, [form, selectedTopic, topics]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!isPrivacyContactConfigured || submissionState === "submitting") return;
    if (!topics.some((topic) => topic.value === values.topic)) {
      form.setError("topic", { message: "Scegli un motivo valido per questa Via." });
      return;
    }

    setSubmissionState("submitting");
    setStatusMessage("Invio della richiesta in corso…");

    const { error } = await supabase.rpc("submit_contact_inquiry", {
      p_submission_token: submissionTokenRef.current,
      p_via: path,
      p_topic: values.topic,
      p_name: values.name,
      p_email: values.email,
      p_phone: values.phone,
      p_message: values.message,
      p_privacy_accepted: values.privacyAccepted,
      p_company: values.company ?? "",
    });

    if (error) {
      setSubmissionState("error");
      setStatusMessage(
        error.message.includes("rate_limit_exceeded")
          ? "Hai già inviato diverse richieste. Attendi un’ora prima di riprovare."
          : "Non è stato possibile inviare la richiesta. I dati sono rimasti nel form: puoi riprovare tra poco.",
      );
      return;
    }

    setSubmissionState("success");
    setStatusMessage("La tua richiesta è stata accolta. Ti risponderemo con cura.");
    submissionTokenRef.current = createSubmissionToken();
    form.reset({
      name: "",
      email: "",
      phone: "",
      topic: selectedTopic ?? "",
      message: "",
      privacyAccepted: false,
      company: "",
    });
  });

  const inputClass = "border-border/40 bg-background/35 focus-visible:ring-accent/60";

  return (
    <section id="richiesta" className="relative scroll-mt-24 px-6 py-20 md:py-28" aria-labelledby={`${path}-inquiry-title`}>
      <div className="mx-auto max-w-3xl">
        <div className="sacred-card p-7 md:p-10">
          <div className="mb-9 text-center">
            <p className="mb-4 font-caption text-[10px] uppercase tracking-[0.28em] text-accent/60">
              {inquiryPathLabels[path]}
            </p>
            <h2 id={`${path}-inquiry-title`} className="font-display text-2xl text-foreground md:text-3xl">
              Inizia da una domanda
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-muted-foreground md:text-base">
              Racconta a Jessica cosa stai cercando. La Via selezionata accompagnerà automaticamente la tua richiesta.
            </p>
          </div>

          {!isPrivacyContactConfigured && (
            <div className="mb-7 rounded-md border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-100" role="status">
              Il contatto è temporaneamente in configurazione. Il form sarà disponibile non appena verrà impostato il recapito privacy.
            </div>
          )}

          <form onSubmit={onSubmit} noValidate className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${path}-name`}>Nome</Label>
                <Input id={`${path}-name`} autoComplete="name" maxLength={100} className={inputClass} disabled={!isPrivacyContactConfigured || submissionState === "submitting"} {...form.register("name")} />
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${path}-email`}>Email</Label>
                <Input id={`${path}-email`} type="email" inputMode="email" autoComplete="email" maxLength={254} className={inputClass} disabled={!isPrivacyContactConfigured || submissionState === "submitting"} {...form.register("email")} />
                {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${path}-phone`}>Telefono <span className="text-muted-foreground">(facoltativo)</span></Label>
                <Input id={`${path}-phone`} type="tel" inputMode="tel" autoComplete="tel" maxLength={30} className={inputClass} disabled={!isPrivacyContactConfigured || submissionState === "submitting"} {...form.register("phone")} />
                {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${path}-topic`}>Motivo della richiesta</Label>
                <select id={`${path}-topic`} className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus:ring-2 ${inputClass}`} disabled={!isPrivacyContactConfigured || submissionState === "submitting"} {...form.register("topic")}>
                  <option value="">Scegli un motivo</option>
                  {topics.map((topic) => <option key={topic.value} value={topic.value}>{topic.label}</option>)}
                </select>
                {form.formState.errors.topic && <p className="text-sm text-destructive">{form.formState.errors.topic.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${path}-message`}>Messaggio</Label>
              <Textarea id={`${path}-message`} rows={6} minLength={20} maxLength={2000} className={inputClass} disabled={!isPrivacyContactConfigured || submissionState === "submitting"} {...form.register("message")} />
              <div className="flex justify-between gap-4 text-xs text-muted-foreground">
                <span>{form.formState.errors.message?.message}</span>
                <span>{form.watch("message").length}/2000</span>
              </div>
            </div>

            <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <Label htmlFor={`${path}-company`}>Azienda</Label>
              <Input id={`${path}-company`} tabIndex={-1} autoComplete="off" {...form.register("company")} />
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id={`${path}-privacy`}
                checked={form.watch("privacyAccepted")}
                onCheckedChange={(checked) => form.setValue("privacyAccepted", checked === true, { shouldValidate: true })}
                disabled={!isPrivacyContactConfigured || submissionState === "submitting"}
              />
              <div className="space-y-1">
                <Label htmlFor={`${path}-privacy`} className="font-normal leading-relaxed">
                  Dichiaro di aver letto l’<Link to="/privacy" className="text-accent underline underline-offset-4">informativa privacy</Link> per la gestione della mia richiesta.
                </Label>
                {form.formState.errors.privacyAccepted && <p className="text-sm text-destructive">{form.formState.errors.privacyAccepted.message}</p>}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 pt-2">
              <Button type="submit" size="lg" className="min-w-52" disabled={!isPrivacyContactConfigured || submissionState === "submitting"}>
                {submissionState === "submitting" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Invia la richiesta
              </Button>
              <div className={`min-h-6 text-center text-sm ${submissionState === "error" ? "text-destructive" : "text-muted-foreground"}`} role={submissionState === "error" ? "alert" : "status"} aria-live="polite">
                {submissionState === "success" && <CheckCircle2 className="mr-2 inline h-4 w-4 text-accent" aria-hidden="true" />}
                {statusMessage}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
