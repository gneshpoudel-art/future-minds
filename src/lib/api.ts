const API_BASE = import.meta.env.VITE_API_URL || '';

async function apiFetch(path: string, opts: RequestInit = {}) {
    const res = await fetch(API_BASE + path, {
        headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
        ...opts,
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
    return res.json();
}

// Statistics
export const getStatistics = () => apiFetch('/api/statistics');

// Why Choose Us
export const getWhyChooseUs = () => apiFetch('/api/why-choose-us');

// Services
export const getServices = () => apiFetch('/api/services');

// Partners
export const getPartners = () => apiFetch('/api/partners');

// Testimonials (approved only)
export const getTestimonials = () => apiFetch('/api/testimonials');

// Submit testimonial (public)
export const submitTestimonial = (formData: FormData) =>
    fetch(API_BASE + '/api/testimonials', { method: 'POST', body: formData }).then(r => r.json());

// Gallery
export const getGallery = () => apiFetch('/api/gallery');

// Branches
export const getBranches = () => apiFetch('/api/branches');

// Leadership
export const getLeadership = () => apiFetch('/api/leadership');

// Success Stories
export const getSuccessStories = () => apiFetch('/api/success-stories');

// Blogs
export const getBlogs = (params?: { category?: string; limit?: number; offset?: number }) => {
    const q = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString() : '';
    return apiFetch('/api/blogs' + q);
};
export const getBlogBySlug = (slug: string) => apiFetch('/api/blogs/' + slug);

// FAQs
export const getFaqs = () => apiFetch('/api/faqs');

// Events
export const getEvents = () => apiFetch('/api/events');

// Downloads
export const getDownloads = () => apiFetch('/api/downloads');
export const trackDownload = (id: number) =>
    fetch(API_BASE + '/api/downloads/download/' + id, { method: 'POST' }).then(r => r.json());

// Contact form
export const submitContact = (data: Record<string, string>) =>
    apiFetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
