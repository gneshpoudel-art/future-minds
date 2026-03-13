'use strict';
const API = window.location.origin;
let TOKEN = localStorage.getItem('fm_admin_token') || 'dev_bypass_token';
if (!localStorage.getItem('fm_admin_token')) {
    localStorage.setItem('fm_admin_token', 'dev_bypass_token');
}
let modalContext = { type: '', id: null, data: null };
let chartDaily, chartHourly;

// ── Auth ─────────────────────────────────────────────────────────────────
async function checkAuth() {
    if (!TOKEN) { redirect(); return; }
    try {
        const r = await fetch(API + '/api/auth/verify', {
            headers: { 'Authorization': 'Bearer ' + TOKEN }
        });
        if (!r.ok) { redirect(); return; }
        const data = await r.json();
        const name = data.admin?.fullName || data.admin?.username || 'Administrator';
        document.getElementById('adminName').textContent = name;
    } catch (e) {
        document.getElementById('adminName').textContent = 'Administrator';
    }
}
function redirect() {
    console.warn('Redirect blocked: Auth bypass active');
    // localStorage.removeItem('fm_admin_token');
    // location.replace('index.html');
}
document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('fm_admin_token');
    location.replace('index.html');
};

// ── API helper ────────────────────────────────────────────────────────────
function apiFetch(path, opts = {}) {
    return fetch(API + path, {
        ...opts,
        headers: { ...(TOKEN ? { 'Authorization': 'Bearer ' + TOKEN } : {}), ...(opts.headers || {}) },
    });
}
async function apiJSON(path, opts = {}) {
    const r = await apiFetch(path, opts);
    if (r.status === 401) { redirect(); return {}; }
    return r.json();
}

// ── Toast ─────────────────────────────────────────────────────────────────
function toast(msg, type = 'ok') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = 'toast show ' + type;
    setTimeout(() => el.className = 'toast', 3500);
}

// ── Navigation ────────────────────────────────────────────────────────────
const panels = {
    titles: {
        dashboard: 'Dashboard', statistics: 'Statistics', whyus: 'Why Choose Us',
        services: 'Services', partners: 'Partners', testimonials: 'Testimonials',
        gallery: 'Gallery', branches: 'Branches', leadership: 'Leadership',
        stories: 'Success Stories', blogs: 'Blog Posts', faqs: 'FAQs',
        events: 'Events', downloads: 'Downloads', contacts: 'Contact Inbox', password: 'Change Password'
    },
    loaders: {}
};
document.querySelectorAll('.nav-link[data-panel]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        const id = btn.dataset.panel;
        document.getElementById('panel-' + id).classList.add('active');
        document.getElementById('pageTitle').textContent = panels.titles[id] || id;
        if (panels.loaders[id]) panels.loaders[id]();
    });
});

// ── Dashboard ─────────────────────────────────────────────────────────────
async function loadDashboard() {
    try {
        const data = await apiJSON('/api/analytics/overview');
        const cards = [
            { label: 'Total Visitors', value: data.totalVisitors ?? 0, sub: `${data.returningVisitors ?? 0} returning` },
            { label: 'Page Views', value: data.totalPageViews ?? 0, sub: 'all time' },
            { label: 'Avg Session', value: fmtTime(data.avgSessionTime), sub: 'per visit' },
            { label: 'Pending Reviews', value: data.pendingTestimonials ?? 0, sub: `${data.contactSubmissions ?? 0} contact msgs` },
        ];
        document.getElementById('statsCards').innerHTML = cards.map(c =>
            `<div class="card"><div class="card-title">${c.label}</div><div class="card-value">${c.value}</div><div class="card-sub">${c.sub}</div></div>`
        ).join('');

        // Daily chart
        const daily = await apiJSON('/api/analytics/daily');
        const labels = daily.map(r => r.date?.slice(5));
        const vals = daily.map(r => r.visitors);
        if (chartDaily) chartDaily.destroy();
        chartDaily = new Chart(document.getElementById('chartDaily'), {
            type: 'line',
            data: { labels, datasets: [{ label: 'Visitors', data: vals, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)', fill: true, tension: .4, pointRadius: 3 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#64748b' }, grid: { color: '#1e2d45' } }, y: { ticks: { color: '#64748b' }, grid: { color: '#1e2d45' } } } }
        });

        // Hourly chart
        const hourly = await apiJSON('/api/analytics/hourly');
        const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
        const hMap = Object.fromEntries(hourly.map(r => [r.hour, r.views]));
        if (chartHourly) chartHourly.destroy();
        chartHourly = new Chart(document.getElementById('chartHourly'), {
            type: 'bar',
            data: { labels: hours, datasets: [{ label: 'Views', data: hours.map(h => hMap[h] || 0), backgroundColor: 'rgba(139,92,246,.6)', borderRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#64748b' }, grid: { display: false } }, y: { ticks: { color: '#64748b' }, grid: { color: '#1e2d45' } } } }
        });

        // Top pages
        const pages = await apiJSON('/api/analytics/pages');
        document.getElementById('topPages').innerHTML = pages.length
            ? pages.map(p => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1e2d45"><span style="font-size:13px;color:#94a3b8">${p.page_url}</span><span style="font-size:13px;color:#60a5fa">${p.views}</span></div>`).join('')
            : '<p class="text-muted" style="padding:16px 0">No page views tracked yet. Visit the main site first.</p>';

        // Quick actions
        document.getElementById('quickActions').innerHTML = [
            ['New Blog Post', 'blogs'], ['Upload Gallery', 'gallery'], ['View Inbox', 'contacts'], ['Review Testimonials', 'testimonials']
        ].map(([label, panel]) => `<button class="btn btn-outl" onclick="navTo('${panel}')">${label}</button>`).join('');
    } catch (err) {
        console.error('[Dashboard]', err);
        document.getElementById('statsCards').innerHTML = '<div class="card" style="grid-column:1/-1"><p class="text-muted">Failed to load dashboard. Make sure the backend server is running.</p></div>';
    }
}

function navTo(panel) {
    document.querySelector('[data-panel="' + panel + '"]').click();
}

function fmtTime(sec) {
    if (!sec) return '0s';
    if (sec < 60) return sec + 's';
    return Math.round(sec / 60) + 'm';
}

// ── Statistics ────────────────────────────────────────────────────────────
async function loadStatistics() {
    try {
        const data = await apiJSON('/api/statistics');
        document.getElementById('tbl-statistics').innerHTML = data.length
            ? data.map(s => `<tr>
          <td><input style="width:140px;background:#0f172a;border:1px solid #334155;color:#e2e8f0;padding:6px 10px;border-radius:8px" value="${esc(s.label)}" onchange="patchStat(${s.id},'label',this.value)"/></td>
          <td><input style="width:100px;background:#0f172a;border:1px solid #334155;color:#e2e8f0;padding:6px 10px;border-radius:8px" value="${esc(s.value)}" onchange="patchStat(${s.id},'value',this.value)"/></td>
          <td><input style="width:60px;background:#0f172a;border:1px solid #334155;color:#e2e8f0;padding:6px 10px;border-radius:8px" value="${esc(s.suffix)}" onchange="patchStat(${s.id},'suffix',this.value)"/></td>
          <td><input style="width:120px;background:#0f172a;border:1px solid #334155;color:#e2e8f0;padding:6px 10px;border-radius:8px" value="${esc(s.icon)}" onchange="patchStat(${s.id},'icon',this.value)"/></td>
          <td><input type="number" style="width:60px;background:#0f172a;border:1px solid #334155;color:#e2e8f0;padding:6px 10px;border-radius:8px" value="${s.display_order}" onchange="patchStat(${s.id},'display_order',this.value)"/></td>
          <td><button class="btn btn-success btn-sm" onclick="saveStat(${s.id})">Save</button></td>
        </tr>`).join('')
            : '<tr><td colspan="6" class="text-muted" style="padding:20px">No statistics found. Run the seed script.</td></tr>';
    } catch (e) {
        document.getElementById('tbl-statistics').innerHTML = '<tr><td colspan="6" class="text-muted" style="padding:20px">Error loading statistics.</td></tr>';
    }
}
const statEdits = {};
function patchStat(id, field, val) { if (!statEdits[id]) statEdits[id] = {}; statEdits[id][field] = val; }
async function saveStat(id) {
    if (!statEdits[id]) return toast('No changes to save', 'ok');
    const r = await apiFetch('/api/statistics/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(statEdits[id]) });
    if (r.ok) { toast('Saved!'); delete statEdits[id]; } else toast('Error saving', 'err');
}

// ── Generic CRUD helper ───────────────────────────────────────────────────
// Stores loaded data for modal editing (keyed by type → array)
const crudData = {};

async function loadCRUD(endpoint, tbodyId, rowFn, type) {
    try {
        const data = await apiJSON(endpoint);
        if (type) crudData[type] = data;
        const tbody = document.getElementById(tbodyId);
        tbody.innerHTML = data.length ? data.map(rowFn).join('') : '<tr><td colspan="10" class="text-muted" style="padding:20px">No items yet. Click "+ Add" to create one.</td></tr>';
    } catch (e) {
        const tbody = document.getElementById(tbodyId);
        tbody.innerHTML = '<tr><td colspan="10" class="text-muted" style="padding:20px">Error loading data.</td></tr>';
    }
}
let _deleteCallback = null;
function deleteItem(endpoint, id, reload) {
    const overlay = document.getElementById('confirmOverlay');
    overlay.classList.add('open');
    _deleteCallback = async () => {
        overlay.classList.remove('open');
        const r = await apiFetch(endpoint + '/' + id, { method: 'DELETE' });
        if (r.ok) { toast('Deleted'); reload(); } else toast('Error deleting', 'err');
    };
}
document.getElementById('confirmYes').onclick = () => { if (_deleteCallback) _deleteCallback(); _deleteCallback = null; };
document.getElementById('confirmNo').onclick = () => { document.getElementById('confirmOverlay').classList.remove('open'); _deleteCallback = null; };

function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function short(s, n = 60) { s = String(s || ''); return s.length > n ? s.slice(0, n) + '…' : s; }
function imgTag(url) { return url ? `<img src="${esc(url)}" class="img-thumb" onerror="this.style.display='none'"/>` : '–'; }

// ── Why Choose Us ─────────────────────────────────────────────────────────
function loadWhyUs() {
    loadCRUD('/api/why-choose-us', 'tbl-whyus', r =>
        `<tr><td>${esc(r.title)}</td><td>${short(r.description)}</td><td>${esc(r.icon)}</td><td>${r.display_order}</td>
    <td><button class="btn btn-outl btn-sm" onclick="openModal('whyus',${r.id})">Edit</button>
    <button class="btn btn-danger btn-sm" onclick="deleteItem('/api/why-choose-us',${r.id},loadWhyUs)">Del</button></td></tr>`,
        'whyus'
    );
}

// ── Services ──────────────────────────────────────────────────────────────
function loadServices() {
    loadCRUD('/api/services', 'tbl-services', r =>
        `<tr><td>${esc(r.title)}</td><td>${short(r.description)}</td><td>${esc(r.icon)}</td><td>${r.display_order}</td>
    <td><button class="btn btn-outl btn-sm" onclick="openModal('services',${r.id})">Edit</button>
    <button class="btn btn-danger btn-sm" onclick="deleteItem('/api/services',${r.id},loadServices)">Del</button></td></tr>`,
        'services'
    );
}

// ── Partners ──────────────────────────────────────────────────────────────
function loadPartners() {
    loadCRUD('/api/partners', 'tbl-partners', r =>
        `<tr><td>${imgTag(r.logo_url)}</td><td>${esc(r.university_name)}</td><td>${r.website_link ? `<a href="${esc(r.website_link)}" target="_blank">Link</a>` : '–'}</td><td>${r.display_order}</td>
    <td><button class="btn btn-outl btn-sm" onclick="openModal('partners',${r.id})">Edit</button>
    <button class="btn btn-danger btn-sm" onclick="deleteItem('/api/partners',${r.id},loadPartners)">Del</button></td></tr>`,
        'partners'
    );
}

// ── Testimonials ──────────────────────────────────────────────────────────
async function loadTestimonials() {
    try {
        const status = document.getElementById('testFilter').value;
        const q = status ? '?status=' + status : '';
        const data = await apiJSON('/api/testimonials/admin/all' + q);
        document.getElementById('tbl-testimonials').innerHTML = data.length ? data.map(r =>
            `<tr><td>${esc(r.name)}</td><td>${esc(r.university)}</td><td>${short(r.message, 80)}</td>
        <td><span class="badge-pill badge-${r.status}">${r.status}</span></td>
        <td>${r.created_at?.slice(0, 10)}</td>
        <td>
          ${r.status !== 'approved' ? `<button class="btn btn-success btn-sm" onclick="setTestStatus(${r.id},'approved')">✓ Approve</button>` : ''}
          ${r.status !== 'rejected' ? `<button class="btn btn-danger btn-sm" onclick="setTestStatus(${r.id},'rejected')">✗ Reject</button>` : ''}
          <button class="btn btn-danger btn-sm" onclick="deleteItem('/api/testimonials/admin',${r.id},loadTestimonials)">Del</button>
        </td></tr>`
        ).join('') : '<tr><td colspan="6" class="text-muted" style="padding:20px">No testimonials found.</td></tr>';
    } catch (e) {
        document.getElementById('tbl-testimonials').innerHTML = '<tr><td colspan="6" class="text-muted" style="padding:20px">Error loading testimonials.</td></tr>';
    }
}
async function setTestStatus(id, status) {
    const r = await apiFetch('/api/testimonials/admin/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (r.ok) { toast('Updated'); loadTestimonials(); } else toast('Error', 'err');
}

// ── Gallery ───────────────────────────────────────────────────────────────
function loadGallery() {
    loadCRUD('/api/gallery', 'tbl-gallery', r =>
        `<tr><td>${imgTag(r.image_url)}</td><td>${esc(r.caption)}</td><td>${short(r.comment)}</td><td>${r.display_order}</td>
    <td><button class="btn btn-danger btn-sm" onclick="deleteItem('/api/gallery',${r.id},loadGallery)">Del</button></td></tr>`,
        'gallery'
    );
}

// ── Branches ──────────────────────────────────────────────────────────────
function loadBranches() {
    loadCRUD('/api/branches', 'tbl-branches', r =>
        `<tr><td>${esc(r.branch_name)}</td><td>${esc(r.address)}</td><td>${esc(r.phone)}</td><td>${r.display_order}</td>
    <td><button class="btn btn-outl btn-sm" onclick="openModal('branches',${r.id})">Edit</button>
    <button class="btn btn-danger btn-sm" onclick="deleteItem('/api/branches',${r.id},loadBranches)">Del</button></td></tr>`,
        'branches'
    );
}

// ── Leadership ────────────────────────────────────────────────────────────
function loadLeadership() {
    loadCRUD('/api/leadership', 'tbl-leadership', r =>
        `<tr><td>${imgTag(r.photo_url)}</td><td>${esc(r.name)}</td><td>${esc(r.position)}</td><td>${short(r.message)}</td><td>${r.display_order}</td>
    <td><button class="btn btn-outl btn-sm" onclick="openModal('leadership',${r.id})">Edit</button>
    <button class="btn btn-danger btn-sm" onclick="deleteItem('/api/leadership',${r.id},loadLeadership)">Del</button></td></tr>`,
        'leadership'
    );
}

// ── Success Stories ───────────────────────────────────────────────────────
function loadStories() {
    loadCRUD('/api/success-stories', 'tbl-stories', r =>
        `<tr><td>${imgTag(r.image_url)}</td><td>${esc(r.student_name)}</td><td>${esc(r.country)}</td><td>${esc(r.university)}</td>
    <td><button class="btn btn-outl btn-sm" onclick="openModal('stories',${r.id})">Edit</button>
    <button class="btn btn-danger btn-sm" onclick="deleteItem('/api/success-stories',${r.id},loadStories)">Del</button></td></tr>`,
        'stories'
    );
}

// ── Blogs ─────────────────────────────────────────────────────────────────
function loadBlogs() {
    loadCRUD('/api/blogs/admin/all', 'tbl-blogs', r =>
        `<tr><td>${esc(r.title)}</td><td>${esc(r.category)}</td>
    <td><span class="badge-pill ${r.published ? 'badge-approved' : 'badge-pending'}">${r.published ? 'Published' : 'Draft'}</span></td>
    <td>${r.created_at?.slice(0, 10)}</td>
    <td><button class="btn btn-outl btn-sm" onclick="openModal('blogs',${r.id})">Edit</button>
    <button class="btn btn-danger btn-sm" onclick="deleteItem('/api/blogs',${r.id},loadBlogs)">Del</button></td></tr>`,
        'blogs'
    );
}

// ── FAQs ──────────────────────────────────────────────────────────────────
function loadFaqs() {
    loadCRUD('/api/faqs', 'tbl-faqs', r =>
        `<tr><td>${esc(r.question)}</td><td>${short(r.answer)}</td><td>${r.display_order}</td>
    <td><button class="btn btn-outl btn-sm" onclick="openModal('faqs',${r.id})">Edit</button>
    <button class="btn btn-danger btn-sm" onclick="deleteItem('/api/faqs',${r.id},loadFaqs)">Del</button></td></tr>`,
        'faqs'
    );
}

// ── Events ────────────────────────────────────────────────────────────────
function loadEvents() {
    loadCRUD('/api/events', 'tbl-events', r =>
        `<tr><td>${imgTag(r.image_url)}</td><td>${esc(r.title)}</td><td>${esc(r.event_date)}</td><td>${esc(r.location)}</td>
    <td><button class="btn btn-outl btn-sm" onclick="openModal('events',${r.id})">Edit</button>
    <button class="btn btn-danger btn-sm" onclick="deleteItem('/api/events',${r.id},loadEvents)">Del</button></td></tr>`,
        'events'
    );
}

// ── Downloads ─────────────────────────────────────────────────────────────
function loadDownloads() {
    loadCRUD('/api/downloads', 'tbl-downloads', r =>
        `<tr><td>${esc(r.title)}</td><td>${esc(r.file_type)?.toUpperCase()}</td><td>${r.download_count}</td><td>${r.created_at?.slice(0, 10)}</td>
    <td><button class="btn btn-danger btn-sm" onclick="deleteItem('/api/downloads',${r.id},loadDownloads)">Del</button></td></tr>`,
        'downloads'
    );
}

// ── Contacts ──────────────────────────────────────────────────────────────
function loadContacts() {
    loadCRUD('/api/contact', 'tbl-contacts', r =>
        `<tr><td>${esc(r.full_name)}</td><td>${esc(r.email)}</td><td>${esc(r.phone)}</td><td>${short(r.message, 60)}</td><td>${esc(r.form_type)}</td>
    <td>${r.created_at?.slice(0, 10)}</td>
    <td><button class="btn btn-danger btn-sm" onclick="deleteItem('/api/contact',${r.id},loadContacts)">Del</button></td></tr>`,
        'contacts'
    );
}

// ── Change Password ───────────────────────────────────────────────────────
document.getElementById('pwForm').onsubmit = async (e) => {
    e.preventDefault();
    const np = document.getElementById('newPw').value;
    const cp = document.getElementById('confPw').value;
    if (np !== cp) return toast('Passwords do not match', 'err');
    const r = await apiFetch('/api/auth/change-password', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: document.getElementById('curPw').value, newPassword: np })
    });
    const d = await r.json();
    if (r.ok) { toast('Password updated!'); document.getElementById('pwForm').reset(); }
    else toast(d.error || 'Error updating password', 'err');
};

// ── Modal system ──────────────────────────────────────────────────────────
const modalForms = {
    whyus: (d) => `<div class="form-row"><label>Title *</label><input id="mf-title" value="${esc(d?.title || '')}"/></div>
    <div class="form-row"><label>Description</label><textarea id="mf-description">${esc(d?.description || '')}</textarea></div>
    <div class="form-row"><label>Icon (Lucide name)</label><input id="mf-icon" value="${esc(d?.icon || 'CheckCircle')}"/></div>
    <div class="form-row"><label>Display Order</label><input type="number" id="mf-order" value="${d?.display_order || 0}"/></div>`,

    services: (d) => `<div class="form-row"><label>Title *</label><input id="mf-title" value="${esc(d?.title || '')}"/></div>
    <div class="form-row"><label>Description</label><textarea id="mf-description">${esc(d?.description || '')}</textarea></div>
    <div class="form-row"><label>Icon</label><input id="mf-icon" value="${esc(d?.icon || 'Compass')}"/></div>
    <div class="form-row"><label>Slug</label><input id="mf-slug" value="${esc(d?.slug || '')}"/></div>
    <div class="form-row"><label>Display Order</label><input type="number" id="mf-order" value="${d?.display_order || 0}"/></div>`,

    partners: (d) => `<div class="form-row"><label>University Name *</label><input id="mf-university_name" value="${esc(d?.university_name || '')}"/></div>
    <div class="form-row"><label>Website Link</label><input id="mf-website_link" value="${esc(d?.website_link || '')}"/></div>
    <div class="form-row"><label>Logo Image</label><input type="file" id="mf-logo" accept="image/*"/></div>
    <div class="form-row"><label>Display Order</label><input type="number" id="mf-order" value="${d?.display_order || 0}"/></div>`,

    gallery: (d) => `<div class="form-row"><label>Image *</label><input type="file" id="mf-image" accept="image/*" ${d ? '' : 'required'}/></div>
    <div class="form-row"><label>Caption</label><input id="mf-caption" value="${esc(d?.caption || '')}"/></div>
    <div class="form-row"><label>Comment</label><textarea id="mf-comment">${esc(d?.comment || '')}</textarea></div>
    <div class="form-row"><label>Display Order</label><input type="number" id="mf-order" value="${d?.display_order || 0}"/></div>`,

    branches: (d) => `<div class="form-row"><label>Branch Name *</label><input id="mf-branch_name" value="${esc(d?.branch_name || '')}"/></div>
    <div class="form-row"><label>Address</label><input id="mf-address" value="${esc(d?.address || '')}"/></div>
    <div class="form-row"><label>Phone</label><input id="mf-phone" value="${esc(d?.phone || '')}"/></div>
    <div class="form-row"><label>Google Maps Link</label><input id="mf-map_link" value="${esc(d?.map_link || '')}"/></div>
    <div class="form-row"><label>Display Order</label><input type="number" id="mf-order" value="${d?.display_order || 0}"/></div>`,

    leadership: (d) => `<div class="form-row"><label>Name *</label><input id="mf-name" value="${esc(d?.name || '')}"/></div>
    <div class="form-row"><label>Position</label><input id="mf-position" value="${esc(d?.position || '')}"/></div>
    <div class="form-row"><label>Message *</label><textarea id="mf-message">${esc(d?.message || '')}</textarea></div>
    <div class="form-row"><label>Photo</label><input type="file" id="mf-photo" accept="image/*"/></div>
    <div class="form-row"><label>Display Order</label><input type="number" id="mf-order" value="${d?.display_order || 0}"/></div>`,

    stories: (d) => `<div class="form-row"><label>Student Name *</label><input id="mf-student_name" value="${esc(d?.student_name || '')}"/></div>
    <div class="form-row"><label>Story *</label><textarea id="mf-story_text">${esc(d?.story_text || '')}</textarea></div>
    <div class="form-row"><label>Country</label><input id="mf-country" value="${esc(d?.country || '')}"/></div>
    <div class="form-row"><label>University</label><input id="mf-university" value="${esc(d?.university || '')}"/></div>
    <div class="form-row"><label>Image</label><input type="file" id="mf-image" accept="image/*"/></div>`,

    blogs: (d) => `<div class="form-row"><label>Title *</label><input id="mf-title" value="${esc(d?.title || '')}"/></div>
    <div class="form-row"><label>Slug</label><input id="mf-slug" value="${esc(d?.slug || '')}"/></div>
    <div class="form-row"><label>Category</label><input id="mf-category" value="${esc(d?.category || '')}"/></div>
    <div class="form-row"><label>Excerpt</label><textarea id="mf-excerpt" style="min-height:60px">${esc(d?.excerpt || '')}</textarea></div>
    <div class="form-row"><label>Content (HTML)</label><textarea id="mf-content" style="min-height:180px">${esc(d?.content || '')}</textarea></div>
    <div class="form-row"><label>Featured Image</label><input type="file" id="mf-image" accept="image/*"/></div>
    <div class="form-row"><label>Published</label><select id="mf-published"><option value="0" ${!d?.published ? 'selected' : ''}>Draft</option><option value="1" ${d?.published ? 'selected' : ''}>Published</option></select></div>`,

    faqs: (d) => `<div class="form-row"><label>Question *</label><input id="mf-question" value="${esc(d?.question || '')}"/></div>
    <div class="form-row"><label>Answer *</label><textarea id="mf-answer">${esc(d?.answer || '')}</textarea></div>
    <div class="form-row"><label>Display Order</label><input type="number" id="mf-order" value="${d?.display_order || 0}"/></div>`,

    events: (d) => `<div class="form-row"><label>Title *</label><input id="mf-title" value="${esc(d?.title || '')}"/></div>
    <div class="form-row"><label>Description</label><textarea id="mf-description">${esc(d?.description || '')}</textarea></div>
    <div class="form-row"><label>Event Date</label><input type="date" id="mf-event_date" value="${esc(d?.event_date || '')}"/></div>
    <div class="form-row"><label>Location</label><input id="mf-location" value="${esc(d?.location || '')}"/></div>
    <div class="form-row"><label>Image</label><input type="file" id="mf-image" accept="image/*"/></div>`,

    downloads: (d) => `<div class="form-row"><label>Title *</label><input id="mf-title" value="${esc(d?.title || '')}"/></div>
    <div class="form-row"><label>File</label><input type="file" id="mf-file" accept=".pdf,.doc,.docx,.zip"/></div>`,
};

const modalEndpoints = {
    whyus: '/api/why-choose-us', services: '/api/services', partners: '/api/partners',
    gallery: '/api/gallery', branches: '/api/branches', leadership: '/api/leadership',
    stories: '/api/success-stories', blogs: '/api/blogs', faqs: '/api/faqs',
    events: '/api/events', downloads: '/api/downloads',
};
const modalReloaders = {
    whyus: loadWhyUs, services: loadServices, partners: loadPartners, gallery: loadGallery,
    branches: loadBranches, leadership: loadLeadership, stories: loadStories, blogs: loadBlogs,
    faqs: loadFaqs, events: loadEvents, downloads: loadDownloads,
};

// Fixed openModal: accepts type + optional id (to lookup from crudData) or null for new
function openModal(type, id) {
    let data = null;
    if (id !== undefined && id !== null) {
        const list = crudData[type] || [];
        data = list.find(item => item.id === id) || null;
    }
    modalContext = { type, id: data?.id || null, data };
    document.getElementById('modalTitle').textContent = (data ? 'Edit' : 'Add') + ' ' + (panels.titles[type] || type);
    document.getElementById('modalBody').innerHTML = modalForms[type] ? modalForms[type](data) : '<p>No form available</p>';
    document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }
document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

async function saveModal() {
    const { type, id } = modalContext;
    const endpoint = modalEndpoints[type];
    if (!endpoint) return;

    const bodyEl = document.getElementById('modalBody');
    const fileInputs = bodyEl.querySelectorAll('input[type=file]');
    const hasFile = Array.from(fileInputs).some(el => el.files && el.files[0]);

    const method = id ? 'PUT' : 'POST';
    const url = endpoint + (id ? '/' + id : '');
    let r;

    if (hasFile) {
        const fd = new FormData();
        bodyEl.querySelectorAll('input:not([type=file]), textarea, select').forEach(el => {
            const key = el.id.replace('mf-', '');
            if (key === 'order') fd.append('display_order', el.value);
            else fd.append(key, el.value);
        });
        fileInputs.forEach(el => {
            const key = el.id.replace('mf-', '');
            if (el.files[0]) fd.append(key, el.files[0]);
        });
        r = await apiFetch(url, { method, body: fd });
    } else {
        const obj = {};
        bodyEl.querySelectorAll('input:not([type=file]), textarea, select').forEach(el => {
            const key = el.id.replace('mf-', '');
            if (key === 'order') obj['display_order'] = el.type === 'number' ? Number(el.value) : el.value;
            else if (el.type === 'number') obj[key] = Number(el.value);
            else obj[key] = el.value;
        });
        r = await apiFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        });
    }

    const d = await r.json();
    if (r.ok) {
        toast(id ? 'Updated!' : 'Created!');
        closeModal();
        if (modalReloaders[type]) modalReloaders[type]();
    } else {
        toast(d.error || (d.errors && d.errors[0]?.msg) || 'Error saving', 'err');
    }
}

// ── Wire up panel loaders ─────────────────────────────────────────────────
panels.loaders = {
    dashboard: loadDashboard, statistics: loadStatistics, whyus: loadWhyUs,
    services: loadServices, partners: loadPartners, testimonials: loadTestimonials,
    gallery: loadGallery, branches: loadBranches, leadership: loadLeadership,
    stories: loadStories, blogs: loadBlogs, faqs: loadFaqs, events: loadEvents,
    downloads: loadDownloads, contacts: loadContacts,
};

// ── Init ──────────────────────────────────────────────────────────────────
checkAuth().then(() => loadDashboard());
