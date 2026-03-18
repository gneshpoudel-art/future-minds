import { motion } from "framer-motion";
import { useState } from "react";
import { Send, MapPin, Phone, Mail, Loader2, CheckCircle } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import emailjs from "@emailjs/browser";
import { useEffect } from "react";

interface Branch {
  id: number;
  branch_name: string;
  email: string;
  phone: string;
  address: string;
}

const Contact = () => {
  const { t } = useLanguage();
  const short = (text: string, len: number) => {
    if (!text) return "";
    return text.length > len ? text.substring(0, len) + "..." : text;
  };

  const [formType, setFormType] = useState<"inquiry" | "appointment">("inquiry");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/branches");
        if (response.ok) {
          const data = await response.json();
          // Sort by display_order
          const sorted = data.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
          setBranches(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch branches", error);
      }
    };
    fetchBranches();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const selectedBranchName = formData.get("branch") as string;
    const selectedBranch = branches.find(b => b.branch_name === selectedBranchName);

    if (!selectedBranch && branches.length > 0) {
      setLoading(false);
      toast({ title: t("contact.toast.error"), description: t("contact.toast.selectBranch"), variant: "destructive" });
      return;
    }

    const data = {
      full_name: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formType === "appointment" ? "Appointment: " + (formData.get("service") || "Consultation") : formData.get("subject"),
      preferred_date: formData.get("preferredDate") || "",
      service: formData.get("service") || "",
      branch: selectedBranchName,
      message: formData.get("message"),
      form_type: formType,
      to_email: selectedBranch?.email || "info@futureminds.edu.np"
    };

    try {
      // 1. Save to database
      console.log("[Contact] Submitting to DB:", data);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("[Contact] DB Error:", error);
        throw new Error(error.error || "Failed to send message");
      }

      // 2. Send via EmailJS
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_4x2s3hs";
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_9nbcy9c";
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "z_c7eJCMqRndObBEh";

      console.log("[Contact] Sending to EmailJS with to_email:", data.to_email);
      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            name: data.full_name,
            email: data.email,
            phone: data.phone,
            country: data.subject || "N/A",
            branch: data.branch,
            preferred_date: data.preferred_date || "N/A",
            service: data.service || "N/A",
            message: data.message,
            to_email: data.to_email,
            form_type: data.form_type
          },
          publicKey
        );
        toast({
          title: t("contact.toast.success"),
          description: t("contact.toast.routed").replace("{branch}", selectedBranchName),
        });
      } catch (emailErr) {
        console.error("EmailJS error:", emailErr);
        toast({
          title: t("contact.toast.received"),
          description: t("contact.toast.savedInfo"),
          variant: "default",
        });
      }

      setSubmitted(true);
      form.reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: t("contact.toast.error"),
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="gradient-primary py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t('contact.hero.title')}
          </motion.h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            {t('contact.hero.description')}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="flex gap-3 mb-8">
                {(["inquiry", "appointment"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormType(type)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${formType === type ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {type === "inquiry" ? t("contact.form.inquiry") : t("contact.form.appointment")}
                  </button>
                ))}
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t('contact.form.fullName')}</label>
                    <input name="fullName" type="text" required maxLength={100} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder={t('contact.form.fullNamePlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t('contact.form.email')}</label>
                    <input name="email" type="email" required maxLength={255} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder={t('contact.form.emailPlaceholder')} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t('contact.form.phone')}</label>
                    <input name="phone" type="tel" required maxLength={20} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder={t('contact.form.phonePlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t('contact.form.selectBranch')}</label>
                    <select name="branch" required className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="">{t('contact.form.selectBranchPlaceholder')}</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.branch_name}>{b.branch_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {formType === "appointment" ? t("contact.form.preferredDate") : t("contact.form.subject")}
                  </label>
                  {formType === "appointment" ? (
                    <input name="preferredDate" type="date" required className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  ) : (
                    <input name="subject" type="text" required maxLength={200} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder={t('contact.form.subjectPlaceholder')} />
                  )}
                </div>
                {formType === "appointment" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t('contact.form.serviceInterest')}</label>
                    <select name="service" required className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="">{t('contact.form.servicePlaceholder')}</option>
                      <option value="career">{t('services.career.title')}</option>
                      <option value="test">{t('services.test.title')}</option>
                      <option value="visa">{t('services.visa.title')}</option>
                      <option value="admission">{t('services.admission.title')}</option>
                      <option value="finance">{t('services.finance.title')}</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t('contact.form.message')}</label>
                  <textarea name="message" required maxLength={1000} rows={5} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder={t('contact.form.messagePlaceholder')} />
                </div>
                <button type="submit" disabled={loading} className="inline-flex items-center gap-2 gradient-primary text-primary-foreground rounded-xl px-8 py-3.5 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('contact.form.sending')}
                    </>
                  ) : submitted ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      {t('contact.form.sent')}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {formType === "appointment" ? t("contact.form.book") : t("contact.form.sendMessage")}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <SectionHeading title={t('contact.sidebar.branches')} centered={false} />
              {branches.length > 0 ? branches.map((b) => (
                <div key={b.id} className="rounded-xl bg-card p-5 shadow-card border border-border">
                  <p className="font-semibold text-foreground text-sm mb-2">{b.branch_name}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span>{b.phone}</span>
                    </div>
                    {b.address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>{short(b.address, 40)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span className="truncate">{b.email}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground italic">{t('contact.sidebar.loading')}</p>
              )}

              <div className="rounded-xl bg-card p-5 shadow-card border border-border">
                <p className="font-semibold text-foreground text-sm mb-3">{t('contact.sidebar.general')}</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-primary" /><span>info@futureminds.edu.np</span></div>
                  <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" /><span>{t('footer.address.banepa')}</span></div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="rounded-xl bg-muted h-48 flex items-center justify-center border border-border">
                <p className="text-sm text-muted-foreground">{t('contact.sidebar.map')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
