import { useState, useEffect } from "react";
import { getTestimonials, submitTestimonial } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Send, X, User } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  university: string;
  message: string;
  photo_url?: string;
}

const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [idx, setIdx] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ name: "", university: "", message: "", photo: null as File | null });

  useEffect(() => {
    getTestimonials()
      .then(data => setTestimonials(data))
      .catch(() => { });
  }, []);

  const next = () => setIdx(i => (i + 1) % Math.max(testimonials.length, 1));
  const prev = () => setIdx(i => (i - 1 + Math.max(testimonials.length, 1)) % Math.max(testimonials.length, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, photo: e.target.files?.[0] || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim() || !form.message.trim()) {
      setFormError("Name and message are required.");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("university", form.university);
      fd.append("message", form.message);
      if (form.photo) fd.append("photo", form.photo);

      const res = await submitTestimonial(fd);
      if (res.id) { // Assuming success if ID is returned
        setSubmitted(true);
        setForm({ name: "", university: "", message: "", photo: null });
      } else {
        setFormError(res.error || "Failed to submit testimonial.");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-6">No testimonials yet. Be the first to share your experience!</p>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Send className="h-4 w-4" /> Share Your Experience
        </button>
        {showForm && renderForm()}
      </div>
    );
  }

  function renderForm() {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setSubmitted(false); setFormError(""); } }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card border border-border rounded-2xl p-8 w-full max-w-lg shadow-2xl relative"
          >
            <button
              onClick={() => { setShowForm(false); setSubmitted(false); setFormError(""); }}
              className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground">Your testimonial has been submitted and will appear after our team reviews it.</p>
                <button
                  onClick={() => { setShowForm(false); setSubmitted(false); }}
                  className="mt-6 inline-flex items-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground">
                    <Quote className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Share Your Experience</h3>
                    <p className="text-sm text-muted-foreground">Your story inspires others</p>
                  </div>
                </div>

                {formError && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Aarav Sharma"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">University / School</label>
                    <input
                      name="university"
                      value={form.university}
                      onChange={handleChange}
                      placeholder="Seoul National University"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Your Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Share your experience with Future Minds..."
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Your Photo (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setFormError(""); }}
                      className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      {submitting ? "Submitting…" : <><Send className="h-4 w-4" /> Submit</>}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
          className="text-center px-8"
        >
          <Quote className="h-10 w-10 mx-auto mb-6 text-primary/30" />
          {testimonials[idx]?.photo_url ? (
            <img src={testimonials[idx].photo_url} alt={testimonials[idx].name} className="h-16 w-16 rounded-full object-cover mx-auto mb-4 border-2 border-primary/20" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-primary/40" />
            </div>
          )}
          <p className="text-lg text-foreground leading-relaxed mb-6 italic">
            "{testimonials[idx]?.message}"
          </p>
          <p className="font-semibold text-foreground">{testimonials[idx]?.name}</p>
          <p className="text-sm text-primary font-medium">{testimonials[idx]?.university}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button onClick={prev} className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : "w-2 bg-border"}`}
            />
          ))}
        </div>
        <button onClick={next} className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-primary/30 px-5 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Send className="h-3.5 w-3.5" /> Share Your Experience
        </button>
      </div>

      {showForm && renderForm()}
    </div>
  );
};

export default TestimonialSlider;
