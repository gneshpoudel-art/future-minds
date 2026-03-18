import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.studyAbroad': 'Study Abroad',
    'nav.language': 'Language',
    'nav.resources': 'Resources',
    'nav.contact': 'Contact',
    'nav.appointment': 'Get Appointment',

    'hero.tagline': "Nepal's Trusted Educational Partner",
    'hero.title': 'We Inspire. We Guide. We Empower.',
    'hero.description': 'Your journey to world-class education begins here. Future Minds Educational Consultancy is your gateway to top universities across South Korea, UK, and Europe.',
    'hero.cta': 'Get Appointment',
    'hero.explore': 'Explore Study Abroad',

    'stats.students': 'Students Guided',
    'stats.visa': 'Visa Success Rate',
    'stats.partners': 'Partner Universities',
    'stats.experience': 'Years Experience',

    'why.badge': 'Why Choose Us',
    'why.title': 'Your Success Is Our Mission',
    'why.description': 'We combine expertise, technology, and personalized care to guide every student toward their dream university.',

    'services.badge': 'Our Services',
    'services.title': 'Comprehensive Student Services',
    'services.description': 'Everything you need for a successful academic journey abroad.',
    'services.learnMore': 'Learn More',

    'partners.badge': 'Our Partners',
    'partners.title': 'Partner Universities',
    'partners.description': 'We collaborate with top-ranked institutions across the globe.',

    'testimonials.badge': 'Testimonials',
    'testimonials.title': 'What Our Students Say',
    'testimonials.description': 'Hear from students who achieved their dreams with Future Minds.',

    'gallery.badge': 'Gallery',
    'gallery.title': 'Moments That Matter',
    'gallery.description': 'A visual journey through our community of learners and achievers.',

    'branches.badge': 'Our Branches',
    'branches.title': 'Find Us Near You',

    'about.hero.title': 'About Future Minds',
    'about.hero.description': 'Transforming lives through education since our founding, we have empowered thousands of students to achieve their international academic dreams.',

    'about.mission.title': 'Our Mission',
    'about.mission.text': 'To provide world-class educational consultancy services that empower students from Nepal to access global academic opportunities, fostering personal growth and professional success.',
    'about.vision.title': 'Our Vision',
    'about.vision.text': 'To be the most trusted and impactful educational consultancy in South Asia, bridging the gap between aspiring students and top international universities.',

    'about.leadership.badge': 'Leadership',
    'about.leadership.title': 'Messages from the Desk',
    'about.leadership.none': 'No leadership messages available yet.',

    'about.values.badge': 'Our Values',
    'about.values.title': 'What We Stand For',
    'about.values.student.title': 'Student First',
    'about.values.student.desc': 'Every decision we make centres around student success and well-being.',
    'about.values.integrity.title': 'Integrity',
    'about.values.integrity.desc': 'Transparent processes and honest guidance at every step.',
    'about.values.excellence.title': 'Excellence',
    'about.values.excellence.desc': 'We strive for the highest standards in service delivery.',
    'about.values.innovation.title': 'Innovation',
    'about.values.innovation.desc': 'Embracing new approaches to educational consultancy.',

    'about.success.badge': 'Success Stories',
    'about.success.title': 'Our Students, Our Pride',
    'about.success.description': 'Real stories from students who achieved their dreams with Future Minds.',

    'about.stories.binod.text': 'From Banepa to Seoul - Future Minds made it possible. Their Korean language training and visa support were exceptional.',
    'about.stories.anita.text': 'I received a full scholarship thanks to the guidance of Future Minds. They helped with every document and interview prep.',
    'about.stories.sujan.text': 'Studying engineering in Germany was my dream. Future Minds helped me navigate the complex European admission process smoothly.',

    'cta.title': 'Ready to Begin Your Journey?',
    'cta.description': 'Take the first step toward your international education. Book a free consultation with our expert counsellors today.',
    'cta.button': 'Book Free Consultation',

    'footer.description': 'Empowering students to achieve their dreams of studying abroad with expert guidance and unwavering support.',
    'footer.quickLinks': 'Quick Links',
    'footer.studyDestinations': 'Study Destinations',
    'footer.languageCourses': 'Language Courses',
    'footer.contact': 'Contact Us',
    'footer.rights': 'All rights reserved.',

    'footer.links.about': 'About Us',
    'footer.links.services': 'Services',
    'footer.links.visa': 'Visa Records',
    'footer.links.care': 'Student Care',
    'footer.links.branches': 'Branches',
    'footer.links.contact': 'Contact',

    'footer.destinations.korea': 'South Korea',
    'footer.destinations.uk': 'United Kingdom',
    'footer.destinations.europe': 'Europe',

    'footer.address.banepa': 'Banepa Head Office, Nepal',
    'footer.address.kathmandu': 'New Baneshwor, Kathmandu',
    'footer.address.pokhara': 'Pokhara, Nepal',
    'footer.address.seoul': 'Seoul, South Korea',

    'services.hero.title': 'Our Services',
    'services.hero.description': 'Comprehensive support at every stage of your academic journey abroad.',
    'services.offer.title': 'What We Offer',
    'services.offer.description': 'Each service is designed to address specific needs in your study abroad journey.',

    'services.career.title': 'Career Counselling',
    'services.career.desc': 'Expert guidance to help you choose the right course, university, and country based on your academic profile, interests, and career goals.',
    'services.career.details': 'Our experienced counsellors conduct in-depth assessments of your academic background, career aspirations, and personal preferences to recommend the best-fit programs and institutions. We provide personalized roadmaps covering timeline, requirements, and budget planning.',

    'services.test.title': 'Test Preparation',
    'services.test.desc': 'Comprehensive coaching for IELTS, TOEFL, PTE, TOPIK, EPS-TOPIK, and KLPT with experienced instructors.',
    'services.test.details': 'State-of-the-art facilities, mock tests, and personalized feedback ensure you achieve your target score. Our classes include small batch sizes, flexible timings, and access to extensive practice materials. We track progress through regular assessments.',

    'services.visa.title': 'Visa Processing',
    'services.visa.desc': 'End-to-end visa application support with a 98% success rate across all destinations.',
    'services.visa.details': 'From document preparation to interview coaching, our visa experts handle every aspect of the process. We maintain up-to-date knowledge of embassy requirements and immigration policies to ensure your application is flawless.',

    'services.admission.title': 'Admission Guidance',
    'services.admission.desc': 'Complete support for university applications including SOP writing, document verification, and application tracking.',
    'services.admission.details': 'We assist with selecting universities, preparing application materials, writing compelling statements of purpose, and managing deadlines. Our partnerships with 120+ universities often provide fast-track admission pathways.',

    'services.finance.title': 'Finance Assistance',
    'services.finance.desc': 'Guidance on scholarships, education loans, and financial planning for your study abroad journey.',
    'services.finance.details': 'We help identify scholarship opportunities, prepare compelling scholarship applications, and connect students with trusted financial institutions for education loans. Our team assists with financial documentation required by embassies.',

    'contact.hero.title': 'Contact Us',
    'contact.hero.description': 'Get in touch with our expert counsellors. We are here to help you every step of the way.',
    'contact.form.inquiry': 'General Inquiry',
    'contact.form.appointment': 'Book Appointment',
    'contact.form.fullName': 'Full Name',
    'contact.form.fullNamePlaceholder': 'Your full name',
    'contact.form.email': 'Email',
    'contact.form.emailPlaceholder': 'your@email.com',
    'contact.form.phone': 'Phone',
    'contact.form.phonePlaceholder': '+977-XXXXXXXXXX',
    'contact.form.selectBranch': 'Select Branch',
    'contact.form.selectBranchPlaceholder': 'Select a branch',
    'contact.form.preferredDate': 'Preferred Date',
    'contact.form.subject': 'Subject / Preferred Country',
    'contact.form.subjectPlaceholder': 'e.g. Study in South Korea',
    'contact.form.serviceInterest': 'Service Interested In',
    'contact.form.servicePlaceholder': 'Select a service',
    'contact.form.message': 'Message',
    'contact.form.messagePlaceholder': 'Tell us more...',
    'contact.form.sending': 'Sending...',
    'contact.form.sent': 'Sent Successfully',
    'contact.form.sendMessage': 'Send Message',
    'contact.form.book': 'Book Appointment',

    'contact.sidebar.branches': 'Our Branches',
    'contact.sidebar.general': 'General Contact',
    'contact.sidebar.loading': 'Loading branches...',
    'contact.sidebar.map': 'Google Map Integration',

    'contact.toast.error': 'Error',
    'contact.toast.selectBranch': 'Please select a branch',
    'contact.toast.success': 'Success!',
    'contact.toast.routed': 'Your message has been received and routed to the {branch} branch.',
    'contact.toast.received': 'Message Received',
    'contact.toast.savedInfo': 'Your inquiry has been saved in our system. However, the email notification failed. We will still contact you soon.',

    'study.hero.destinationNotFound': 'Destination not found.',
    'study.badge.universities': 'Universities',
    'study.badge.scholarships': 'Scholarships',
    'study.title.requirements': 'Admission Requirements',
    'study.title.visa': 'Visa Process',
    'study.title.scholarships': 'Scholarship Opportunities',
    'study.button.apply': 'Apply Now',
    'study.popularUniversities': 'Popular Universities in {country}',

    'study.korea.title': 'Study in South Korea',
    'study.korea.overview': 'South Korea is a global leader in technology, innovation, and education. Home to world-class universities and a vibrant culture, it offers affordable tuition, generous scholarships, and excellent career opportunities for international students.',
    'study.korea.requirements': 'High school diploma or equivalent|Korean language proficiency (TOPIK Level 3+) or English proficiency (IELTS 5.5+)|Statement of Purpose|Letters of Recommendation|Financial documentation|Valid passport',
    'study.korea.visaSteps': 'Receive university admission letter|Prepare required documents|Apply for D-2 student visa at Korean Embassy|Attend visa interview if required|Receive visa and prepare for departure',
    'study.korea.scholarships': 'Korean Government Scholarship (KGSP)|University-specific merit scholarships|NIIED Scholarship Program|Regional government scholarships',

    'study.uk.title': 'Study in the United Kingdom',
    'study.uk.overview': 'The UK is home to some of the world\'s oldest and most prestigious universities. With a rich academic tradition and globally recognized qualifications, studying in the UK opens doors to exceptional career prospects worldwide.',
    'study.uk.requirements': 'Academic transcripts|IELTS score of 6.0 or above|Personal Statement|References|Proof of financial support|Valid passport',
    'study.uk.visaSteps': 'Receive CAS from university|Complete online visa application|Pay visa fee and immigration health surcharge|Attend biometrics appointment|Submit supporting documents',
    'study.uk.scholarships': 'Chevening Scholarships|Commonwealth Scholarships|University-specific bursaries|British Council scholarships',

    'study.europe.title': 'Study in Europe',
    'study.europe.overview': 'Europe offers diverse, high-quality education often at low or zero tuition fees. From Germany\'s engineering excellence to France\'s art and culture, European universities provide world-class programs in a multicultural environment.',
    'study.europe.requirements': 'Academic transcripts|Language proficiency (English or local language)|Motivation letter|CV/Resume|Financial proof|Valid passport',
    'study.europe.visaSteps': 'Receive admission letter|Apply for student visa at respective embassy|Provide biometrics and documents|Wait for visa processing|Plan travel and accommodation',
    'study.europe.scholarships': 'Erasmus Mundus|DAAD Scholarships (Germany)|Holland Scholarship (Netherlands)|Swiss Government Excellence Scholarships',

    'language.hero.title': 'Language Courses',
    'language.hero.description': 'Master the language skills needed for your academic and professional goals.',
    'language.program.title': 'Our Language Programs',
    'language.program.description': 'Expert-led courses designed for success.',
    'language.course.duration': 'Duration: {duration}',
    'language.course.enroll': 'Enroll Now',
    'language.course.ielts.title': 'IELTS',
    'language.course.ielts.desc': 'International English Language Testing System. Accepted by universities, employers, and immigration authorities worldwide.',
    'language.course.toefl.title': 'TOEFL',
    'language.course.toefl.desc': 'Test of English as a Foreign Language. Required by many North American and international institutions.',
    'language.course.pte.title': 'PTE Academic',
    'language.course.pte.desc': 'Pearson Test of English Academic. Computer-based test accepted by thousands of institutions globally.',
    'language.course.korean.title': 'EPS-TOPIK',
    'language.course.korean.desc': 'Employment Permit System Test of Proficiency in Korean. Required for workers seeking employment in South Korea.',
    'language.course.klpt.title': 'KLPT',
    'language.course.klpt.desc': 'Korean Language Proficiency Test for evaluating Korean language skills of non-native speakers.',
    'language.course.topik.title': 'TOPIK',
    'language.course.topik.desc': 'Test of Proficiency in Korean for academic purposes. Required for university admission in South Korea.',

    'resources.hero.title': 'Resources',
    'resources.hero.description': 'Explore our blog, gallery, FAQs, and downloadable resources.',
    'resources.blog.badge': 'Blog',
    'resources.blog.title': 'Latest Articles',
    'resources.blog.description': 'Stay informed with our latest insights and guides.',
    'resources.blog.post1.title': 'Top 10 Universities in South Korea for 2024',
    'resources.blog.post2.title': 'IELTS vs TOEFL: Which Test Should You Take?',
    'resources.blog.post3.title': 'Complete Guide to Korean Student Visa',
    'resources.blog.post4.title': 'Scholarship Opportunities in Europe',
    'resources.blog.post5.title': 'Life as a Nepali Student in Seoul',
    'resources.blog.post6.title': 'How to Write a Winning Statement of Purpose',
    'resources.blog.cat.study': 'Study Abroad',
    'resources.blog.cat.prep': 'Test Prep',
    'resources.blog.cat.visa': 'Visa Guide',
    'resources.blog.cat.scholarships': 'Scholarships',
    'resources.blog.cat.life': 'Student Life',
    'resources.blog.cat.admissions': 'Admissions',

    'resources.gallery.badge': 'Gallery',
    'resources.gallery.title': 'Photo Gallery',

    'resources.downloads.badge': 'Downloads',
    'resources.downloads.title': 'Downloadable Resources',
    'resources.downloads.handbook': 'Student Handbook 2024',
    'resources.downloads.checklist': 'Visa Checklist',
    'resources.downloads.guide': 'Scholarship Guide',

    'resources.faq.badge': 'FAQs',
    'resources.faq.title': 'Frequently Asked Questions',
    'resources.faq.q1': 'What countries can I study in through Future Minds?',
    'resources.faq.a1': 'We currently facilitate admissions to South Korea, United Kingdom, and various European countries including Germany, France, Netherlands, and more.',
    'resources.faq.q2': 'What is the visa success rate?',
    'resources.faq.a2': 'We maintain a 98% visa success rate across all destinations, thanks to our experienced visa processing team.',
    'resources.faq.q3': 'Do you offer scholarships?',
    'resources.faq.a3': 'We guide students in finding and applying for scholarships including KGSP, Chevening, Erasmus Mundus, and university-specific awards.',
    'resources.faq.q4': 'How long does the admission process take?',
    'resources.faq.a4': 'The timeline varies by destination, but typically 2-4 months from initial counselling to receiving an admission letter.',
    'resources.faq.q5': 'Do you provide post-arrival support?',
    'resources.faq.a5': 'Yes, our Seoul branch provides comprehensive post-arrival support including airport pickup, orientation, and ongoing assistance.',

    'resources.events.badge': 'Events',
    'resources.events.title': 'News & Events',
    'resources.events.description': 'Stay updated with our latest activities and announcements.',
    'resources.event1.title': 'Education Fair 2025',
    'resources.event1.desc': 'Join us at the annual education fair in Kathmandu.',
    'resources.event2.title': 'IELTS Workshop',
    'resources.event2.desc': 'Free IELTS preparation workshop at Banepa office.',
    'resources.event3.title': 'Korea Info Session',
    'resources.event3.desc': 'Everything you need to know about studying in South Korea.',

    'branches.hero.title': 'Our Branches',
    'branches.hero.description': 'Visit us at any of our four locations across Nepal and South Korea.',
    'branches.hours': 'Hours',
    'branches.kathmandu.city': 'Kathmandu',
    'branches.kathmandu.address': 'New Baneshwor, Kathmandu, Nepal',
    'branches.kathmandu.hours': 'Sun-Fri: 9:00 AM - 5:00 PM',
    'branches.kathmandu.desc': 'Our Kathmandu branch serves students from the capital region with comprehensive counselling and test preparation services.',
    'branches.banepa.city': 'Banepa (Head Office)',
    'branches.banepa.address': 'Banepa, Kavrepalanchok, Nepal',
    'branches.banepa.hours': 'Sun-Fri: 9:00 AM - 5:00 PM',
    'branches.banepa.desc': 'Our head office in Banepa is the heart of Future Minds operations, providing the full range of consultancy services.',
    'branches.pokhara.city': 'Pokhara',
    'branches.pokhara.address': 'Lakeside, Pokhara, Nepal',
    'branches.pokhara.hours': 'Sun-Fri: 9:00 AM - 5:00 PM',
    'branches.pokhara.desc': 'Serving students from the western region of Nepal with personalized guidance and support.',
    'branches.seoul.city': 'Seoul',
    'branches.seoul.address': 'Seoul, South Korea',
    'branches.seoul.hours': 'Mon-Fri: 9:00 AM - 6:00 PM',
    'branches.seoul.desc': 'Our international branch in Seoul provides post-arrival support, emergency assistance, and university mediation for students in South Korea.',

    'gallery.hero.title': 'Gallery',
    'gallery.hero.description': 'A visual journey through our students\' experiences and achievements.',
    'gallery.main.title': 'Moments That Matter',
    'gallery.main.description': 'Explore photos from events, campus visits, graduations, and more.',

    'studentCare.hero.title': 'Student Care System',
    'studentCare.hero.description': 'We do not just send students abroad. We support them every step of the way.',
    'studentCare.main.title': 'Your Journey With Us',
    'studentCare.main.description': 'A comprehensive care system from pre-departure to graduation.',
    'studentCare.step.korean.title': 'Korean Language Training',
    'studentCare.step.korean.desc': 'Comprehensive language courses to prepare you for life and study in South Korea.',
    'studentCare.step.pickup.title': 'Airport Pickup',
    'studentCare.step.pickup.desc': 'Our Seoul team greets you at the airport and helps you settle in.',
    'studentCare.step.orientation.title': 'Orientation Program',
    'studentCare.step.orientation.desc': 'Detailed orientation covering academics, culture, and daily life in Korea.',
    'studentCare.step.groups.title': 'Support Groups',
    'studentCare.step.groups.desc': 'Connect with fellow Nepali students through organized community groups.',
    'studentCare.step.festival.title': 'Festival Organization',
    'studentCare.step.festival.desc': 'We organize cultural events and festivals to keep you connected to home.',
    'studentCare.step.seoul.title': 'Seoul Office Support',
    'studentCare.step.seoul.desc': 'Our Seoul branch provides ongoing administrative and personal support.',
    'studentCare.step.emergency.title': 'Emergency Assistance',
    'studentCare.step.emergency.desc': '24/7 emergency support for any urgent situations.',
    'studentCare.step.mediation.title': 'University Mediation',
    'studentCare.step.mediation.desc': 'We act as a bridge between you and your university for any academic concerns.',

    'visaRecords.hero.title': 'Visa Success Records',
    'visaRecords.hero.description': 'Our track record speaks for itself. Over 5,000 students successfully placed worldwide.',
    'visaRecords.stat.totalStudents': 'Total Students',
    'visaRecords.stat.successRate': 'Success Rate',
    'visaRecords.stat.universities': 'Universities',
    'visaRecords.stat.countries': 'Countries',
    'visaRecords.main.title': 'Students Sent by University',
    'visaRecords.uni.snu': 'Seoul National University',
    'visaRecords.uni.yonsei': 'Yonsei University',
    'visaRecords.uni.korea': 'Korea University',
    'visaRecords.uni.hanyang': 'Hanyang University',
    'visaRecords.uni.kyunghee': 'Kyung Hee University',
    'visaRecords.uni.kaist': 'KAIST',
    'visaRecords.uni.chungnam': 'Chungnam National University',
    'visaRecords.uni.skku': 'Sungkyunkwan University',
    'visaRecords.uni.london': 'University of London',
    'visaRecords.uni.manchester': 'University of Manchester',
    'visaRecords.uni.edinburgh': 'University of Edinburgh',
    'visaRecords.uni.munich': 'TU Munich',
    'visaRecords.uni.amsterdam': 'University of Amsterdam',
    'visaRecords.uni.sorbonne': 'Sorbonne University',

    'notFound.title': '404',
    'notFound.message': 'Oops! Page not found',
    'notFound.return': 'Return to Home',
  },
  ko: {
    'nav.home': '홈',
    'nav.about': '소개',
    'nav.services': '서비스',
    'nav.studyAbroad': '해외 유학',
    'nav.language': '언어',
    'nav.resources': '리소스',
    'nav.contact': '문의',
    'nav.appointment': '약속 잡기',

    'hero.tagline': "네팔의 신뢰할 수 있는 교육 파트너",
    'hero.title': '우리는 영감을 줍니다. 우리는 안내합니다. 우리는 권한을 부여합니다.',
    'hero.description': '당신의 세계 수준의 교육 여정이 여기서 시작됩니다. Future Minds 교육 컨설팅은 한국, 영국, 유럽의 최고 대학으로 가는 관문입니다.',
    'hero.cta': '약속 잡기',
    'hero.explore': '해외 유학 탐색',

    'stats.students': '가이드된 학생 수',
    'stats.visa': '비자 합격률',
    'stats.partners': '협력 대학',
    'stats.experience': '운영 경력',

    'why.badge': '우리를 선택해야 하는 이유',
    'why.title': '당신의 성공이 우리의 사명입니다',
    'why.description': '우리는 전문 지식, 기술 및 맞춤형 케어를 결합하여 모든 학생이 꿈의 대학으로 갈 수 있도록 안내합니다.',

    'services.badge': '우리의 서비스',
    'services.title': '종합 학생 서비스',
    'services.description': '성공적인 해외 학업 여정을 위해 필요한 모든 것.',
    'services.learnMore': '더 알아보기',

    'partners.badge': '우리의 파트너',
    'partners.title': '협력 대학',
    'partners.description': '우리는 전 세계 최고의 교육 기관들과 협력합니다.',

    'testimonials.badge': '수강 후기',
    'testimonials.title': '학생들의 목소리',
    'testimonials.description': 'Future Minds와 함께 꿈을 이룬 학생들의 이야기를 들어보세요.',

    'gallery.badge': '갤러리',
    'gallery.title': '소중한 순간들',
    'gallery.description': '학습자와 성취자들로 구성된 커뮤니티의 시각적 여정.',

    'branches.badge': '우리의 지점',
    'branches.title': '가까운 지점 찾기',

    'about.hero.title': 'Future Minds 소개',
    'about.hero.description': '창립 이래 교육을 통해 삶을 변화시켜 왔으며, 수천 명의 학생들이 국제적인 학업의 꿈을 이룰 수 있도록 지원해 왔습니다.',

    'about.mission.title': '우리의 사명',
    'about.mission.text': '네팔 학생들이 글로벌 학업 기회에 접근할 수 있도록 세계적 수준의 교육 컨설팅 서비스를 제공하여 개인의 성장과 전문적인 성공을 촉진합니다.',
    'about.vision.title': '우리의 비전',
    'about.vision.text': '열정적인 학생들과 최고의 국제 대학 사이의 가교 역할을 하는 남아시아에서 가장 신뢰받고 영향력 있는 교육 컨설팅사가 되는 것입니다.',

    'about.leadership.badge': '리더십',
    'about.leadership.title': '데스크에서의 메시지',
    'about.leadership.none': '아직 사용 가능한 리더십 메시지가 없습니다.',

    'about.values.badge': '우리의 가치',
    'about.values.title': '우리가 추구하는 가치',
    'about.values.student.title': '학생 우선',
    'about.values.student.desc': '우리가 내리는 모든 결정은 학생의 성공과 안녕을 중심으로 합니다.',
    'about.values.integrity.title': '정직',
    'about.values.integrity.desc': '모든 단계에서 투명한 프로세스와 정직한 가이드를 제공합니다.',
    'about.values.excellence.title': '탁월함',
    'about.values.excellence.desc': '서비스 제공에 있어 최고 수준의 표준을 지향합니다.',
    'about.values.innovation.title': '혁신',
    'about.values.innovation.desc': '교육 컨설팅에 대한 새로운 접근 방식을 받아들입니다.',

    'about.success.badge': '성공 사례',
    'about.success.title': '우리의 학생, 우리의 자부심',
    'about.success.description': 'Future Minds와 함께 꿈을 이룬 학생들의 실제 이야기.',

    'about.stories.binod.text': '바네파에서 서울까지 - Future Minds가 가능하게 했습니다. 한국어 교육과 비자 지원이 매우 뛰어났습니다.',
    'about.stories.anita.text': 'Future Minds의 안내 덕분에 전액 장학금을 받았습니다. 모든 서류 준비와 인터뷰 준비를 도와주셨습니다.',
    'about.stories.sujan.text': '독일에서 공학을 공부하는 것이 제 꿈이었습니다. Future Minds는 복잡한 유럽 입학 절차를 순조롭게 진행할 수 있도록 도와주었습니다.',

    'cta.title': '여정을 시작할 준비가 되셨나요?',
    'cta.description': '국제 교육을 위한 첫 걸음을 내딛으세요. 오늘 전문가와 무료 상담을 예약하세요.',
    'cta.button': '무료 상담 예약',

    'footer.description': '전문가 가이드와 확고한 지원으로 학생들이 해외 유학의 꿈을 이룰 수 있도록 지원합니다.',
    'footer.quickLinks': '빠른 링크',
    'footer.studyDestinations': '유학 목적지',
    'footer.languageCourses': '언어 코스',
    'footer.contact': '문의하기',
    'footer.rights': '모든 권리 보유.',

    'footer.links.about': '회사 소개',
    'footer.links.services': '서비스',
    'footer.links.visa': '비자 기록',
    'footer.links.care': '학생 관리',
    'footer.links.branches': '지점 안내',
    'footer.links.contact': '문의처',

    'footer.destinations.korea': '대한민국',
    'footer.destinations.uk': '영국',
    'footer.destinations.europe': '유럽',

    'footer.address.banepa': '바네파 본사, 네팔',
    'footer.address.kathmandu': '뉴 바네슈워, 카트만두',
    'footer.address.pokhara': '포카라, 네팔',
    'footer.address.seoul': '서울, 대한민국',

    'services.hero.title': '우리의 서비스',
    'services.hero.description': '해외 학업 여정의 모든 단계에서 종합적인 지원을 제공합니다.',
    'services.offer.title': '제공 서비스',
    'services.offer.description': '각 서비스는 해외 유학 여정의 특정 요구 사항을 해결하도록 설계되었습니다.',

    'services.career.title': '진로 상담',
    'services.career.desc': '학업 프로필, 관심사 및 경력 목표를 기반으로 적합한 과정, 대학 및 국가를 선택할 수 있도록 돕는 전문가 가이드입니다.',
    'services.career.details': '경험이 풍부한 상담사들이 귀하의 학업 배경, 경력 포부 및 개인적 선호도를 심층적으로 평가하여 가장 적합한 프로그램과 교육 기관을 추천합니다. 일정, 요구 사항 및 예산 계획을 포함한 맞춤형 로드맵을 제공합니다.',

    'services.test.title': '시험 준비',
    'services.test.desc': '숙련된 강사진과 함께하는 IELTS, TOEFL, PTE, TOPIK, EPS-TOPIK 및 KLPT 종합 코칭.',
    'services.test.details': '최첨단 시설, 모의 테스트 및 맞춤형 피드백을 통해 목표 점수를 달성할 수 있도록 보장합니다. 소규모 수업, 유연한 시간대 및 광범위한 연습 자료를 제공합니다. 정기적인 평가를 통해 성적을 관리합니다.',

    'services.visa.title': '비자 절차',
    'services.visa.desc': '모든 국가에 대해 98%의 성공률을 자랑하는 엔드 투 엔드 비자 신청 지원.',
    'services.visa.details': '서류 준비부터 인터뷰 코칭까지, 비자 전문가가 프로세스의 모든 측면을 처리합니다. 대사관 요구 사항과 이민 정책에 대한 최신 지식을 유지하여 신청서가 완벽하도록 보장합니다.',

    'services.admission.title': '입학 안내',
    'services.admission.desc': 'SOP 작성, 서류 확인 및 신청 추적을 포함한 대학 신청 전 과정 지원.',
    'services.admission.details': '대학 선택, 지원 서류 준비, 설득력 있는 학업 계획서 작성 및 마감일 관리를 도와드립니다. 120개 이상의 협력 대학과의 파트너십을 통해 빠른 입학 경로를 제공하는 경우가 많습니다.',

    'services.finance.title': '금융 지원',
    'services.finance.desc': '해외 유학 여정을 위한 장학금, 교육 대출 및 재정 계획 안내.',
    'services.finance.details': '장학금 기회를 확인하고, 설득력 있는 장학금 신청서를 준비하며, 교육 대출을 위해 신뢰할 수 있는 금융 기관과 학생을 연결해 드립니다. 대사관에서 요구하는 재정 서류 준비를 지원합니다.',

    'contact.hero.title': '문의하기',
    'contact.hero.description': '전문 상담사에게 문의하세요. 모든 단계에서 도움을 드릴 준비가 되어 있습니다.',
    'contact.form.inquiry': '일반 문의',
    'contact.form.appointment': '상담 예약',
    'contact.form.fullName': '성함',
    'contact.form.fullNamePlaceholder': '성함을 입력하세요',
    'contact.form.email': '이메일',
    'contact.form.emailPlaceholder': 'example@email.com',
    'contact.form.phone': '연락처',
    'contact.form.phonePlaceholder': '+977-XXXXXXXXXX',
    'contact.form.selectBranch': '지점 선택',
    'contact.form.selectBranchPlaceholder': '지점을 선택하세요',
    'contact.form.preferredDate': '희망 날짜',
    'contact.form.subject': '제목 / 희망 국가',
    'contact.form.subjectPlaceholder': '예: 한국 유학 관련',
    'contact.form.serviceInterest': '관심 서비스',
    'contact.form.servicePlaceholder': '서비스를 선택하세요',
    'contact.form.message': '메시지',
    'contact.form.messagePlaceholder': '상세 내용을 입력하세요...',
    'contact.form.sending': '전송 중...',
    'contact.form.sent': '전송 완료',
    'contact.form.sendMessage': '메시지 보내기',
    'contact.form.book': '예약하기',

    'contact.sidebar.branches': '우리의 지점',
    'contact.sidebar.general': '일반 연락처',
    'contact.sidebar.loading': '지점 정보를 불러오는 중...',
    'contact.sidebar.map': '구글 지도 통합',

    'contact.toast.error': '오류',
    'contact.toast.selectBranch': '지점을 선택해 주세요',
    'contact.toast.success': '성공!',
    'contact.toast.routed': '메시지가 접수되어 {branch} 지점으로 전달되었습니다.',
    'contact.toast.received': '메시지 접수됨',
    'contact.toast.savedInfo': '문의 사항이 시스템에 저장되었습니다. 다만, 이메일 알림 전송에 실패했습니다. 곧 연락드리겠습니다.',

    'study.hero.destinationNotFound': '목적지를 찾을 수 없습니다.',
    'study.badge.universities': '대학',
    'study.badge.scholarships': '장학금',
    'study.title.requirements': '입학 요건',
    'study.title.visa': '비자 절차',
    'study.title.scholarships': '장학금 기회',
    'study.button.apply': '지금 지원하기',
    'study.popularUniversities': '{country}의 인기 대학',

    'study.korea.title': '한국 유학',
    'study.korea.overview': '한국은 기술, 혁신 및 교육 분야의 글로벌 리더입니다. 세계 수준의 대학과 활기찬 문화가 있는 한국은 유학생들에게 저렴한 학비, 관대한 장학금 및 훌륭한 경력 기회를 제공합니다.',
    'study.korea.requirements': '고등학교 졸업장 또는 이와 동등한 학력|한국어 능력(TOPIK 3급 이상) 또는 영어 능력(IELTS 5.5 이상)|학업 계획서|추천서|재정 증명 서류|유효한 여권',
    'study.korea.visaSteps': '대학 입학 허가서 수령|필요 서류 준비|한국 대사관에 D-2 학생 비자 신청|필요한 경우 비자 인터뷰 참석|비자 수령 및 출국 준비',
    'study.korea.scholarships': '한국 정부 장학금(KGSP)|대학별 성적 장학금|NIIED 장학 프로그램|지역 정부 장학금',

    'study.uk.title': '영국 유학',
    'study.uk.overview': '영국은 세계에서 가장 오래되고 권위 있는 대학들의 본거지입니다. 풍부한 학문적 전통과 세계적으로 인정받는 자격증을 통해 영국에서의 학업은 전 세계적으로 탁월한 경력 전망의 문을 열어줍니다.',
    'study.uk.requirements': '성적 증명서|IELTS 점수 6.0 이상|개인 진술서|추천서|재정 지원 증명|유효한 여권',
    'study.uk.visaSteps': '대학으로부터 CAS 수령|온라인 비자 신청 완료|비자 수수료 및 이민국 건강 부담금 지불|생체 인식 예약 참석|증빙 서류 제출',
    'study.uk.scholarships': '치브닝 장학금|연방 장학금|대학별 보조금|영국 문화원 장학금',

    'study.europe.title': '유럽 유학',
    'study.europe.overview': '유럽은 저렴하거나 무료인 학비로 다양하고 수준 높은 교육을 제공합니다. 독일의 공학적 우수성부터 프랑스의 예술과 문화에 이르기까지, 유럽 대학들은 다문화 환경에서 세계적인 프로그램을 제공합니다.',
    'study.europe.requirements': '성적 증명서|언어 능력(영어 또는 현지 언어)|자기소개서|이력서|재정 증명|유효한 여권',
    'study.europe.visaSteps': '입학 허가서 수령|해당 대사관에 학생 비자 신청|생체 인식 및 서류 제공|비자 처리 대기|여행 및 숙소 계획',
    'study.europe.scholarships': '에라스무스 문두스|DAAD 장학금(독일)|홀란드 장학금(네덜란드)|스위스 정부 우수 장학금',

    'language.hero.title': '어학 과정',
    'language.hero.description': '학업 및 업무 목표에 필요한 언어 능력을 마스터하세요.',
    'language.program.title': '어학 프로그램',
    'language.program.description': '수행 중심의 전문가 주도 과정입니다.',
    'language.course.duration': '과정 기간: {duration}',
    'language.course.enroll': '지금 등록하기',
    'language.course.ielts.title': 'IELTS',
    'language.course.ielts.desc': '국제 영어 능력 시험 시스템. 전 세계 대학, 고용주 및 이민국에서 인정합니다.',
    'language.course.toefl.title': 'TOEFL',
    'language.course.toefl.desc': '외국어로서의 영어 시험. 많은 북미 및 국제 기관에서 요구합니다.',
    'language.course.pte.title': 'PTE Academic',
    'language.course.pte.desc': '피어슨 영어 학술 시험. 전 세계 수천 개의 기관에서 인정하는 컴퓨터 기반 시험입니다.',
    'language.course.korean.title': 'EPS-TOPIK',
    'language.course.korean.desc': '고용 허가제 한국어 능력 시험. 한국 취업 희망자에게 필수적입니다.',
    'language.course.klpt.title': 'KLPT',
    'language.course.klpt.desc': '비원어민의 한국어 능력을 평가하기 위한 한국어 능력 시험.',
    'language.course.topik.title': 'TOPIK',
    'language.course.topik.desc': '학술 목적의 한국어 능력 시험. 한국 대학 입학에 필수적입니다.',

    'resources.hero.title': '리소스',
    'resources.hero.description': '블로그, 갤러리, FAQ 및 다운로드 가능한 자료를 살펴보세요.',
    'resources.blog.badge': '블로그',
    'resources.blog.title': '최신 기사',
    'resources.blog.description': '최신 인사이트와 가이드를 통해 정보를 얻으세요.',
    'resources.blog.post1.title': '2024년 한국 상위 10개 대학',
    'resources.blog.post2.title': 'IELTS vs TOEFL: 어떤 시험을 치러야 할까요?',
    'resources.blog.post3.title': '한국 학생 비자 완전 가이드',
    'resources.blog.post4.title': '유럽 장학금 기회',
    'resources.blog.post5.title': '서울에서의 네팔 유학생 생활',
    'resources.blog.post6.title': '우승하는 학업 계획서 작성 방법',
    'resources.blog.cat.study': '해외 유학',
    'resources.blog.cat.prep': '시험 준비',
    'resources.blog.cat.visa': '비자 가이드',
    'resources.blog.cat.scholarships': '장학금',
    'resources.blog.cat.life': '학생 생활',
    'resources.blog.cat.admissions': '입학',

    'resources.gallery.badge': '갤러리',
    'resources.gallery.title': '사진 갤러리',

    'resources.downloads.badge': '다운로드',
    'resources.downloads.title': '다운로드 가능한 리소스',
    'resources.downloads.handbook': '2024 학생 핸드북',
    'resources.downloads.checklist': '비자 체크리스트',
    'resources.downloads.guide': '장학금 가이드',

    'resources.faq.badge': '자주 묻는 질문',
    'resources.faq.title': 'FAQ',
    'resources.faq.q1': 'Future Minds를 통해 어느 나라에서 공부할 수 있나요?',
    'resources.faq.a1': '현재 한국, 영국 및 독일, 프랑스, 네덜란드 등 다양한 유럽 국가로의 입학을 지원하고 있습니다.',
    'resources.faq.q2': '비자 성공률은 어떻게 되나요?',
    'resources.faq.a2': '숙련된 비자 처리 팀 덕분에 모든 목적지에서 98%의 비자 성공률을 유지하고 있습니다.',
    'resources.faq.q3': '장학금을 제공하나요?',
    'resources.faq.a3': 'KGSP, 치브닝, 에라스무스 문두스 및 대학별 장학금을 포함한 장학금을 찾고 신청하는 데 도움을 드립니다.',
    'resources.faq.q4': '입학 절차는 얼마나 걸리나요?',
    'resources.faq.a4': '기간은 목적지에 따라 다르지만, 일반적으로 초기 상담부터 입학 허가서를 받기까지 2-4개월이 소요됩니다.',
    'resources.faq.q5': '입국 후 지원을 제공하나요?',
    'resources.faq.a5': '네, 서울 지점에서 공항 픽업, 오리엔테이션 및 지속적인 지원을 포함한 포괄적인 입국 후 지원을 제공합니다.',

    'resources.events.badge': '이벤트',
    'resources.events.title': '뉴스 및 이벤트',
    'resources.events.description': '최신 활동과 공지 사항을 확인하세요.',
    'resources.event1.title': '2025 교육 박람회',
    'resources.event1.desc': '카트만두에서 열리는 어학 교육 박람회에 참여하세요.',
    'resources.event2.title': 'IELTS 워크숍',
    'resources.event2.desc': '바네파 사무실에서 열리는 무료 IELTS 준비 워크숍.',
    'resources.event3.title': '한국 안내 세션',
    'resources.event3.desc': '한국 유학에 대해 알아야 할 모든 것.',

    'branches.hero.title': '지점 안내',
    'branches.hero.description': '네팔과 한국에 위치한 4개 지점 중 가까운 곳을 방문하세요.',
    'branches.hours': '영업 시간',
    'branches.kathmandu.city': '카트만두',
    'branches.kathmandu.address': '뉴 바네슈워, 카트만두, 네팔',
    'branches.kathmandu.hours': '일-금: 오전 9:00 - 오후 5:00',
    'branches.kathmandu.desc': '카트만두 지점은 수도권 학생들에게 포괄적인 상담 및 시험 준비 서비스를 제공합니다.',
    'branches.banepa.city': '바네파 (본사)',
    'branches.banepa.address': '바네파, 카브레팔란촉, 네팔',
    'branches.banepa.hours': '일-금: 오전 9:00 - 오후 5:00',
    'branches.banepa.desc': '바네파 본사는 퓨처 마인츠 운영의 중심지로, 모든 범위의 컨설팅 서비스를 제공합니다.',
    'branches.pokhara.city': '포카라',
    'branches.pokhara.address': '레이크사이드, 포카라, 네팔',
    'branches.pokhara.hours': '일-금: 오전 9:00 - 오후 5:00',
    'branches.pokhara.desc': '네팔 서부 지역 학생들에게 맞춤형 안내와 지원을 제공합니다.',
    'branches.seoul.city': '서울',
    'branches.seoul.address': '대한민국 서울',
    'branches.seoul.hours': '월-금: 오전 9:00 - 오후 6:00',
    'branches.seoul.desc': '서울 지점은 한국 내 유학생들에게 입국 후 지원, 긴급 지원 및 대학 중재 서비스를 제공합니다.',

    'gallery.hero.title': '갤러리',
    'gallery.hero.description': '우리 학생들의 경험과 성취를 담은 시각적 여정.',
    'gallery.main.title': '중요한 순간들',
    'gallery.main.description': '이벤트, 캠퍼스 방문, 졸업식 등 다양한 사진을 구경하세요.',

    'studentCare.hero.title': '학생 케어 시스템',
    'studentCare.hero.description': '우리는 단지 학생들을 해외로 보내는 것에 그치지 않습니다. 모든 단계를 지원합니다.',
    'studentCare.main.title': '우리와 함께하는 여정',
    'studentCare.main.description': '출국 전부터 졸업까지 이어지는 종합 케어 시스템.',
    'studentCare.step.korean.title': '한국어 교육',
    'studentCare.step.korean.desc': '한국 생활과 학업을 준비하기 위한 종합적인 언어 과정.',
    'studentCare.step.pickup.title': '공항 픽업',
    'studentCare.step.pickup.desc': '서울 팀이 공항에서 여러분을 맞이하고 정착을 돕습니다.',
    'studentCare.step.orientation.title': '오리엔테이션 프로그램',
    'studentCare.step.orientation.desc': '학업, 문화 및 한국의 일상 생활을 다루는 상세 오리엔테이션.',
    'studentCare.step.groups.title': '지원 그룹',
    'studentCare.step.groups.desc': '조직된 커뮤니티 그룹을 통해 동료 학생들과 교류하세요.',
    'studentCare.step.festival.title': '문화 축제 개최',
    'studentCare.step.festival.desc': '고국과 연결될 수 있도록 다양한 문화 행사와 축제를 개최합니다.',
    'studentCare.step.seoul.title': '서울 사무소 지원',
    'studentCare.step.seoul.desc': '서울 지점에서 지속적인 행정 및 개인 지원을 제공합니다.',
    'studentCare.step.emergency.title': '긴급 지원',
    'studentCare.step.emergency.desc': '긴급 상황 발생 시 24시간 연중무휴 지원.',
    'studentCare.step.mediation.title': '대학 중재',
    'studentCare.step.mediation.desc': '학업 관련 고민에 대해 학생과 대학 사이의 가교 역할을 합니다.',

    'visaRecords.hero.title': '비자 성공 기록',
    'visaRecords.hero.description': '우리의 실적이 모든 것을 말해줍니다. 전 세계 5,000명 이상의 학생들을 성공적으로 파견했습니다.',
    'visaRecords.stat.totalStudents': '총 학생 수',
    'visaRecords.stat.successRate': '성공률',
    'visaRecords.stat.universities': '대학 수',
    'visaRecords.stat.countries': '국가 수',
    'visaRecords.main.title': '대학별 파견 학생 수',
    'visaRecords.uni.snu': '서울대학교',
    'visaRecords.uni.yonsei': '연세대학교',
    'visaRecords.uni.korea': '고려대학교',
    'visaRecords.uni.hanyang': '한양대학교',
    'visaRecords.uni.kyunghee': '경희대학교',
    'visaRecords.uni.kaist': 'KAIST (한국과학기술원)',
    'visaRecords.uni.chungnam': '충남대학교',
    'visaRecords.uni.skku': '성균관대학교',
    'visaRecords.uni.london': '런던 대학교',
    'visaRecords.uni.manchester': '맨체스터 대학교',
    'visaRecords.uni.edinburgh': '에든버러 대학교',
    'visaRecords.uni.munich': '뮌헨 공과대학교',
    'visaRecords.uni.amsterdam': '암스테르담 대학교',
    'visaRecords.uni.sorbonne': '소르본 대학교',

    'notFound.title': '404',
    'notFound.message': '죄송합니다! 페이지를 찾을 수 없습니다',
    'notFound.return': '홈으로 돌아가기',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Fallback for flat keys that might contain dots or simple key lookup
        return (translations[language] as any)[key] || key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
