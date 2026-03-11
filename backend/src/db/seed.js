require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./client');

async function seed() {
    console.log('[Seed] Running schema...');
    await db.runSchema();
    console.log('[Seed] Schema applied.');

    // Admin user
    const existing = await db.get('SELECT id FROM admins WHERE username = ?', [process.env.ADMIN_USERNAME || 'admin']);
    if (!existing) {
        const password = process.env.ADMIN_PASSWORD || 'FutureMinds@2025!';
        const hash = await bcrypt.hash(password, 12);
        await db.run('INSERT INTO admins (username, password_hash, full_name) VALUES (?, ?, ?)',
            [process.env.ADMIN_USERNAME || 'admin', hash, 'Site Administrator']);
        console.log('[Seed] Admin user created.');
    } else {
        console.log('[Seed] Admin user already exists, skipping.');
    }

    // Statistics
    const statCount = await db.get('SELECT COUNT(*) as cnt FROM statistics');
    if (!statCount || statCount.cnt === 0) {
        const stats = [
            { label: 'Students Abroad', value: '5000', suffix: '+', icon: 'Users', display_order: 1 },
            { label: 'Partner Universities', value: '120', suffix: '+', icon: 'GraduationCap', display_order: 2 },
            { label: 'Visa Success Rate', value: '98', suffix: '%', icon: 'Award', display_order: 3 },
            { label: 'Countries Covered', value: '15', suffix: '+', icon: 'Globe', display_order: 4 },
        ];
        for (const s of stats) {
            await db.run('INSERT INTO statistics (label, value, suffix, icon, display_order) VALUES (?,?,?,?,?)',
                [s.label, s.value, s.suffix, s.icon, s.display_order]);
        }
        console.log('[Seed] Statistics seeded.');
    }

    // Why Choose Us
    const wcuCount = await db.get('SELECT COUNT(*) as cnt FROM why_choose_us');
    if (!wcuCount || wcuCount.cnt === 0) {
        const cards = [
            { title: 'Proven Track Record', description: 'Over 5,000 students successfully placed in top universities worldwide with a 98% visa success rate.', icon: 'CheckCircle', display_order: 1 },
            { title: 'Global Network', description: 'Partnerships with 120+ universities across South Korea, UK, and Europe for diverse opportunities.', icon: 'Globe', display_order: 2 },
            { title: 'Dedicated Student Care', description: 'From pre-departure to post-arrival, our support system ensures you never feel alone abroad.', icon: 'Users', display_order: 3 },
            { title: 'Expert Test Prep', description: 'Comprehensive IELTS, TOEFL, PTE, and Korean language training with experienced instructors.', icon: 'BookOpen', display_order: 4 },
            { title: 'Seamless Visa Process', description: 'Our expert visa team handles every detail, ensuring a smooth and stress-free visa application.', icon: 'FileCheck', display_order: 5 },
            { title: 'Scholarship Guidance', description: 'We help identify and apply for scholarships to make your education affordable.', icon: 'DollarSign', display_order: 6 },
        ];
        for (const c of cards) {
            await db.run('INSERT INTO why_choose_us (title, description, icon, display_order) VALUES (?,?,?,?)',
                [c.title, c.description, c.icon, c.display_order]);
        }
        console.log('[Seed] Why Choose Us seeded.');
    }

    // Services
    const svcCount = await db.get('SELECT COUNT(*) as cnt FROM services');
    if (!svcCount || svcCount.cnt === 0) {
        const services = [
            { title: 'Career Counselling', description: 'Expert guidance on choosing the right career path and university programs.', icon: 'Compass', slug: 'career', display_order: 1 },
            { title: 'Test Preparation', description: 'IELTS, TOEFL, PTE, and Korean language coaching.', icon: 'BookOpen', slug: 'test', display_order: 2 },
            { title: 'Visa Processing', description: 'End-to-end visa application support with 98% success rate.', icon: 'FileCheck', slug: 'visa', display_order: 3 },
            { title: 'Admission Guidance', description: 'University selection, application, and documentation support.', icon: 'GraduationCap', slug: 'admission', display_order: 4 },
            { title: 'Finance Assistance', description: 'Scholarship hunting, loan guidance, and financial planning.', icon: 'DollarSign', slug: 'finance', display_order: 5 },
        ];
        for (const s of services) {
            await db.run('INSERT INTO services (title, description, icon, slug, display_order) VALUES (?,?,?,?,?)',
                [s.title, s.description, s.icon, s.slug, s.display_order]);
        }
        console.log('[Seed] Services seeded.');
    }

    // Partner universities
    const partnerCount = await db.get('SELECT COUNT(*) as cnt FROM partners');
    if (!partnerCount || partnerCount.cnt === 0) {
        const universities = [
            'Seoul National University', 'Yonsei University', 'Korea University', 'KAIST',
            'Hanyang University', 'Kyung Hee University', 'University of London', 'University of Manchester',
            'University of Edinburgh', 'University of Leeds', 'Sorbonne University', 'TU Munich',
            'University of Amsterdam', 'ETH Zurich', 'Politecnico di Milano', 'Chungnam National University',
        ];
        for (let i = 0; i < universities.length; i++) {
            await db.run('INSERT INTO partners (university_name, display_order) VALUES (?,?)', [universities[i], i + 1]);
        }
        console.log('[Seed] Partners seeded.');
    }

    // Branches
    const branchCount = await db.get('SELECT COUNT(*) as cnt FROM branches');
    if (!branchCount || branchCount.cnt === 0) {
        const branches = [
            { branch_name: 'Banepa (Head Office)', address: 'Banepa, Kavrepalanchok, Nepal', phone: '+977-011-660123', map_link: 'https://maps.google.com/?q=Banepa,Nepal', display_order: 1 },
            { branch_name: 'Kathmandu', address: 'New Baneshwor, Kathmandu', phone: '+977-01-4567890', map_link: 'https://maps.google.com/?q=New+Baneshwor,Kathmandu', display_order: 2 },
            { branch_name: 'Pokhara', address: 'Lakeside, Pokhara', phone: '+977-061-123456', map_link: 'https://maps.google.com/?q=Lakeside,Pokhara', display_order: 3 },
            { branch_name: 'Seoul', address: 'Seoul, South Korea', phone: '+82-2-1234-5678', map_link: 'https://maps.google.com/?q=Seoul,South+Korea', display_order: 4 },
        ];
        for (const b of branches) {
            await db.run('INSERT INTO branches (branch_name, address, phone, map_link, display_order) VALUES (?,?,?,?,?)',
                [b.branch_name, b.address, b.phone, b.map_link, b.display_order]);
        }
        console.log('[Seed] Branches seeded.');
    }

    // FAQs
    const faqCount = await db.get('SELECT COUNT(*) as cnt FROM faqs');
    if (!faqCount || faqCount.cnt === 0) {
        const faqs = [
            { question: 'What countries can I study in through Future Minds?', answer: 'We currently facilitate admissions to South Korea, United Kingdom, and various European countries including Germany, France, Netherlands, and more.', display_order: 1 },
            { question: 'What is the visa success rate?', answer: 'We maintain a 98% visa success rate across all destinations, thanks to our experienced visa processing team.', display_order: 2 },
            { question: 'Do you offer scholarships?', answer: 'We guide students in finding and applying for scholarships including KGSP, Chevening, Erasmus Mundus, and university-specific awards.', display_order: 3 },
            { question: 'How long does the admission process take?', answer: 'The timeline varies by destination, but typically 2-4 months from initial counselling to receiving an admission letter.', display_order: 4 },
            { question: 'Do you provide post-arrival support?', answer: 'Yes, our Seoul branch provides comprehensive post-arrival support including airport pickup, orientation, and ongoing assistance.', display_order: 5 },
        ];
        for (const f of faqs) {
            await db.run('INSERT INTO faqs (question, answer, display_order) VALUES (?,?,?)', [f.question, f.answer, f.display_order]);
        }
        console.log('[Seed] FAQs seeded.');
    }

    // Gallery (use Unsplash placeholders)
    const galleryCount = await db.get('SELECT COUNT(*) as cnt FROM gallery');
    if (!galleryCount || galleryCount.cnt === 0) {
        const images = [
            { image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&q=80', caption: 'Graduation Ceremony 2023', comment: 'Our students celebrating their achievements in Seoul', display_order: 1 },
            { image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80', caption: 'Campus Life in South Korea', comment: 'Experiencing world-class education facilities', display_order: 2 },
            { image_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80', caption: 'Cultural Exchange Program', comment: 'Building connections across borders', display_order: 3 },
            { image_url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80', caption: 'Pre-departure Orientation', comment: 'Preparing students for their journey abroad', display_order: 4 },
            { image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', caption: 'University Visit Day', comment: 'Exploring partner universities', display_order: 5 },
            { image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80', caption: 'Language Class Session', comment: 'Korean language training in progress', display_order: 6 },
            { image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', caption: 'IELTS Preparation Class', comment: 'Intensive training for top scores', display_order: 7 },
            { image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80', caption: 'Career Counselling Session', comment: 'One-on-one guidance for every student', display_order: 8 },
        ];
        for (const img of images) {
            await db.run('INSERT INTO gallery (image_url, caption, comment, display_order) VALUES (?,?,?,?)',
                [img.image_url, img.caption, img.comment, img.display_order]);
        }
        console.log('[Seed] Gallery seeded.');
    }

    // Testimonials
    const testCount = await db.get('SELECT COUNT(*) as cnt FROM testimonials');
    if (!testCount || testCount.cnt === 0) {
        const testimonials = [
            { name: 'Aarav Sharma', university: 'Seoul National University', message: 'Future Minds made my dream of studying in South Korea a reality. Their guidance through the entire visa process was invaluable.', status: 'approved' },
            { name: 'Priya Adhikari', university: 'University of London', message: 'From test preparation to admission, Future Minds supported me at every step. I am now pursuing my degree in the UK thanks to their expert counselling.', status: 'approved' },
            { name: 'Rohan Thapa', university: 'Yonsei University', message: 'The Korean language classes and student care system helped me adjust to life in Seoul seamlessly. Highly recommended.', status: 'approved' },
            { name: 'Sita Gurung', university: 'University of Manchester', message: 'Professional, supportive, and genuinely caring. Future Minds is the best educational consultancy in Nepal.', status: 'approved' },
        ];
        for (const t of testimonials) {
            await db.run('INSERT INTO testimonials (name, university, message, status) VALUES (?,?,?,?)',
                [t.name, t.university, t.message, t.status]);
        }
        console.log('[Seed] Testimonials seeded.');
    }

    // Blog posts
    const blogCount = await db.get('SELECT COUNT(*) as cnt FROM blogs');
    if (!blogCount || blogCount.cnt === 0) {
        const blogs = [
            { title: 'Top 10 Universities in South Korea for 2025', slug: 'top-universities-south-korea-2025', excerpt: 'Explore the best universities in South Korea for international students.', category: 'Study Abroad', published: 1 },
            { title: 'IELTS vs TOEFL: Which Test Should You Take?', slug: 'ielts-vs-toefl', excerpt: 'A comprehensive comparison to help you choose the right English test.', category: 'Test Prep', published: 1 },
            { title: 'Complete Guide to Korean Student Visa', slug: 'korean-student-visa-guide', excerpt: 'Everything you need to know about applying for a Korean student visa.', category: 'Visa Guide', published: 1 },
            { title: 'Scholarship Opportunities in Europe', slug: 'europe-scholarships', excerpt: 'Discover top scholarships available for Nepali students in Europe.', category: 'Scholarships', published: 1 },
            { title: 'Life as a Nepali Student in Seoul', slug: 'life-nepali-student-seoul', excerpt: 'A first-hand look at student life in South Korea.', category: 'Student Life', published: 1 },
            { title: 'How to Write a Winning Statement of Purpose', slug: 'winning-statement-of-purpose', excerpt: 'Tips and templates for writing a compelling SOP.', category: 'Admissions', published: 1 },
        ];
        for (const b of blogs) {
            await db.run('INSERT INTO blogs (title, slug, excerpt, category, published) VALUES (?,?,?,?,?)',
                [b.title, b.slug, b.excerpt, b.category, b.published]);
        }
        console.log('[Seed] Blogs seeded.');
    }

    // Events
    const eventCount = await db.get('SELECT COUNT(*) as cnt FROM events');
    if (!eventCount || eventCount.cnt === 0) {
        const events = [
            { title: 'Education Fair 2025', description: 'Join us at the annual education fair in Kathmandu.', event_date: '2025-03-15', location: 'Kathmandu' },
            { title: 'IELTS Workshop', description: 'Free IELTS preparation workshop at Banepa office.', event_date: '2025-03-22', location: 'Banepa' },
            { title: 'Korea Info Session', description: 'Everything you need to know about studying in South Korea.', event_date: '2025-04-05', location: 'Online' },
        ];
        for (const e of events) {
            await db.run('INSERT INTO events (title, description, event_date, location) VALUES (?,?,?,?)',
                [e.title, e.description, e.event_date, e.location]);
        }
        console.log('[Seed] Events seeded.');
    }

    // Downloads
    const dlCount = await db.get('SELECT COUNT(*) as cnt FROM downloads');
    if (!dlCount || dlCount.cnt === 0) {
        const downloads = [
            { title: 'Student Handbook 2025', file_url: '#', file_type: 'pdf' },
            { title: 'Visa Checklist', file_url: '#', file_type: 'pdf' },
            { title: 'Scholarship Guide', file_url: '#', file_type: 'pdf' },
        ];
        for (const d of downloads) {
            await db.run('INSERT INTO downloads (title, file_url, file_type) VALUES (?,?,?)', [d.title, d.file_url, d.file_type]);
        }
        console.log('[Seed] Downloads seeded.');
    }

    console.log('[Seed] All done!');
}

seed().then(() => process.exit(0)).catch(err => { console.error('[Seed] Error:', err); process.exit(1); });
