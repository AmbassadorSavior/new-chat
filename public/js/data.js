/* ============================================================
   OPPORA — Mock dataset (demo data)
   ------------------------------------------------------------
   IMPORTANT: every record below is SAMPLE DATA for the prototype.
   Nothing here asserts a live, verified opportunity. In production
   this module is replaced by the Oppora Opportunities API
   (GET /api/opportunities) with verified sources and check dates.
   ============================================================ */

const DAY = 86400000;
const days = (n) => new Date(Date.now() + n * DAY).toISOString().slice(0, 10);

export const MEDIA = {
  heroPortrait: "https://images.pexels.com/photos/14436123/pexels-photo-14436123.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  personaStudent: "https://images.pexels.com/photos/10554201/pexels-photo-10554201.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
  personaPro: "https://images.pexels.com/photos/1181361/pexels-photo-1181361.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
  personaEntre: "https://images.pexels.com/photos/7245801/pexels-photo-7245801.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
  personaVol: "https://images.pexels.com/photos/7475142/pexels-photo-7475142.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
  catScholarship: "https://images.pexels.com/photos/39227630/pexels-photo-39227630.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  catInternship: "https://images.pexels.com/photos/8547282/pexels-photo-8547282.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  catRemote: "https://images.pexels.com/photos/4939701/pexels-photo-4939701.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  catGrant: "https://images.pexels.com/photos/33624055/pexels-photo-33624055.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  catCompetition: "https://images.pexels.com/photos/3866512/pexels-photo-3866512.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  catVolunteer: "https://images.pexels.com/photos/7475183/pexels-photo-7475183.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  catJob: "https://images.pexels.com/photos/1181360/pexels-photo-1181360.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  catFellowship: "https://images.pexels.com/photos/7794015/pexels-photo-7794015.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  mission: "https://images.pexels.com/photos/6147219/pexels-photo-6147219.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  aboutTeam: "https://images.pexels.com/photos/8837565/pexels-photo-8837565.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  videoMission: "https://videos.pexels.com/video-files/7792306/7792306-hd_1920_1080_25fps.mp4",
  videoPoster: "https://images.pexels.com/videos/7792306/pexels-photo-7792306.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
};

export const ORGS = {
  "Mastercard Foundation": { color: "#e8590c", type: "Foundation", region: "International", verified: true },
  "Chevening / UK FCDO": { color: "#1d4ed8", type: "Government", region: "Europe", verified: true },
  DAAD: { color: "#0b7285", type: "Government agency", region: "Europe", verified: true },
  "Mandela Rhodes Foundation": { color: "#2b8a3e", type: "Foundation", region: "Africa", verified: true },
  "African Leadership University": { color: "#5f3dc4", type: "University", region: "Africa", verified: true },
  "Google.org": { color: "#1a73e8", type: "Corporate", region: "North America", verified: true },
  "Erasmus+ / EU": { color: "#0b4ea2", type: "Intergovernmental", region: "Europe", verified: true },
  Flutterwave: { color: "#f5a623", type: "Startup", region: "Africa", verified: true },
  Paystack: { color: "#0ea5e9", type: "Startup", region: "Africa", verified: true },
  "British Council": { color: "#123a6b", type: "Cultural organisation", region: "Europe", verified: true },
  "M-KOPA": { color: "#66a80f", type: "Startup", region: "Africa", verified: true },
  "Wellcome Trust": { color: "#c2255c", type: "Foundation", region: "Europe", verified: true },
  "Microsoft Africa": { color: "#0f766e", type: "Corporate", region: "Africa", verified: true },
  "Tony Elumelu Foundation": { color: "#087f5b", type: "Foundation", region: "Africa", verified: true },
  "African Development Bank": { color: "#1971c2", type: "Multilateral bank", region: "Africa", verified: true },
  AGRA: { color: "#e67700", type: "NGO", region: "Africa", verified: true },
  "Rockefeller Foundation": { color: "#862e9c", type: "Foundation", region: "North America", verified: true },
  Seedstars: { color: "#e03131", type: "Investor / platform", region: "Europe", verified: true },
  Google: { color: "#4285f4", type: "Corporate", region: "North America", verified: true },
  "African Union": { color: "#2f9e44", type: "Intergovernmental", region: "Africa", verified: true },
  Andela: { color: "#364fc7", type: "Startup", region: "Africa", verified: true },
  "World Bank Group": { color: "#073b7a", type: "Multilateral", region: "International", verified: true },
  "Twiga Foods": { color: "#d9480f", type: "Startup", region: "Africa", verified: true },
  "U.S. Department of State": { color: "#1c3d78", type: "Government", region: "North America", verified: true },
  Acumen: { color: "#0ca678", type: "Impact investor", region: "International", verified: true },
  "Schmidt Futures": { color: "#495057", type: "Philanthropy", region: "North America", verified: true },
  "Obama Foundation": { color: "#343a40", type: "Foundation", region: "North America", verified: true },
  "Hult Prize": { color: "#d6336c", type: "Competition", region: "International", verified: true },
  "SAP Africa": { color: "#0070f2", type: "Corporate", region: "Africa", verified: true },
  "African Leadership Academy": { color: "#7048e8", type: "Education", region: "Africa", verified: true },
  "Climate-KIC": { color: "#2b8a3e", type: "Innovation network", region: "Europe", verified: true },
  Deel: { color: "#4c6ef5", type: "Startup", region: "North America", verified: true },
  Canonical: { color: "#e8590c", type: "Corporate", region: "Europe", verified: true },
  Meta: { color: "#0866ff", type: "Corporate", region: "North America", verified: true },
  Cloudflare: { color: "#f08c00", type: "Corporate", region: "North America", verified: true },
  HubSpot: { color: "#ff7a59", type: "Corporate", region: "North America", verified: true },
  "UN Volunteers": { color: "#1971c2", type: "UN agency", region: "International", verified: true },
  "Teach For All": { color: "#a61e4d", type: "NGO", region: "International", verified: true },
  "UN Environment Programme": { color: "#0b7285", type: "UN agency", region: "International", verified: true },
  "Co-Creation Hub": { color: "#212529", type: "Innovation hub", region: "Africa", verified: true },
  "Villgro Africa": { color: "#f76707", type: "Incubator", region: "Africa", verified: true },
  "ALX Africa": { color: "#e03131", type: "Tech training", region: "Africa", verified: true },
  "Amazon Web Services": { color: "#ff922b", type: "Corporate", region: "North America", verified: true },
  "One Young World": { color: "#e8590c", type: "Non-profit", region: "International", verified: true },
  "JA Africa": { color: "#1971c2", type: "NGO", region: "Africa", verified: true },
};

export const CATS = {
  scholarship: { label: "Scholarships", singular: "Scholarship", icon: "bi-mortarboard-board", page: "scholarships.html", image: MEDIA.catScholarship, blurb: "Fully and partially funded degrees, exchanges and research awards for African students at home and abroad." },
  job: { label: "Jobs", singular: "Job", icon: "bi-briefcase", page: "jobs.html", image: MEDIA.catJob, blurb: "Full-time and graduate roles with vetted employers across Africa and global teams hiring African talent." },
  grant: { label: "Grants", singular: "Grant", icon: "bi-cash-coin", page: "grants.html", image: MEDIA.catGrant, blurb: "Non-repayable funding for startups, researchers, NGOs and community builders." },
  internship: { label: "Internships", singular: "Internship", icon: "bi-laptop", page: "internships.html", image: MEDIA.catInternship, blurb: "Hands-on placements that turn study into experience — paid, stipended and sponsored tracks." },
  fellowship: { label: "Fellowships", singular: "Fellowship", icon: "bi-award", page: "fellowships.html", image: MEDIA.catFellowship, blurb: "Leadership and research fellowships that fund your ideas while building your network." },
  competition: { label: "Competitions", singular: "Competition", icon: "bi-trophy", page: "competitions.html", image: MEDIA.catCompetition, blurb: "Hackathons, prize challenges and pitch competitions with real funding behind them." },
  remote: { label: "Remote Work", singular: "Remote role", icon: "bi-globe2", page: "remote-work.html", image: MEDIA.catRemote, blurb: "Work-from-anywhere roles from international companies that hire across African time zones." },
  volunteer: { label: "Volunteer", singular: "Volunteer role", icon: "bi-heart", page: "volunteer.html", image: MEDIA.catVolunteer, blurb: "Service, mentoring and online volunteering that builds your track record and your community." },
  accelerator: { label: "Accelerators", singular: "Accelerator", icon: "bi-rocket-takeoff", page: "explore.html?cat=accelerator", image: MEDIA.catGrant, blurb: "Structured programs that pair capital with mentorship for early-stage founders." },
  training: { label: "Training", singular: "Training program", icon: "bi-easel", page: "explore.html?cat=training", image: MEDIA.catRemote, blurb: "Sponsored tech and professional training with certificates employers recognise." },
  conference: { label: "Conferences", singular: "Conference", icon: "bi-mic", page: "explore.html?cat=conference", image: MEDIA.catCompetition, blurb: "Fully funded delegate seats and summits where policy and opportunity meet." },
  youth: { label: "Youth Programs", singular: "Youth program", icon: "bi-people", page: "explore.html?cat=youth", image: MEDIA.catInternship, blurb: "Programmes designed for secondary-school students and young leaders under 30." },
};

export const COUNTRIES = ["Nigeria", "Kenya", "Ghana", "South Africa", "Rwanda", "Uganda", "Ethiopia", "Egypt", "Morocco", "Tanzania", "Senegal", "Cameroon", "Zimbabwe", "Zambia", "United Kingdom", "United States", "Germany", "France", "Netherlands", "Canada", "Global / Remote"];
export const FIELDS = ["Computer Science", "Data Science", "Engineering", "Business & Management", "Public Health", "Public Policy", "Agriculture", "Climate & Environment", "Education", "Design & Media", "Finance", "Social Sciences"];
export const LEVELS = ["Secondary", "Undergraduate", "Postgraduate", "Doctoral", "Any level"];
export const WORK_MODES = ["remote", "hybrid", "onsite"];

/* ---------- Category-aware defaults so records stay lean ---------- */
const DEFAULTS = {
  scholarship: {
    benefits: ["Tuition and registration fees covered", "Monthly living stipend and accommodation", "Return travel and visa support", "Mentorship and alumni community"],
    docs: ["Certified academic transcripts", "Degree certificate or admission letter", "Two reference letters", "Personal motivation statement", "Passport bio-page copy"],
    process: ["Create an account on the provider portal", "Submit the online application with documents", "Shortlisting and written assessment", "Panel interview", "Award letter and onboarding"],
    faqs: [["Can I apply before I have an admission letter?", "Most providers accept conditional applications — upload the admission letter as soon as it arrives."], ["Is there an application fee?", "No. Legitimate scholarships never charge application fees."]],
  },
  job: {
    benefits: ["Competitive salary with annual review", "Health insurance for you and dependants", "Hybrid work and learning budget", "Equity or completion bonus where applicable"],
    docs: ["Updated CV (2 pages max)", "Cover letter tailored to the role", "Portfolio or GitHub where relevant", "Contact details of two referees"],
    process: ["Online application", "Recruiter screening call", "Technical or case assessment", "Team interviews", "Offer and onboarding"],
    faqs: [["Is the salary range fixed?", "Ranges are indicative; final offers reflect experience and location."], ["Can I apply from another country?", "Roles marked remote or hybrid accept regional applicants unless stated."]],
  },
  grant: {
    benefits: ["Non-repayable capital", "Business or research mentorship", "Access to partner networks and markets", "Public showcase for winners"],
    docs: ["Concept note or proposal (5–10 pages)", "Budget breakdown", "Proof of registration or ID", "Reference or endorsement letter"],
    process: ["Submit expression of interest", "Full proposal invitation", "Due-diligence call", "Grant agreement and disbursement"],
    faqs: [["Do I need a registered entity?", "Some tracks accept individuals; others require registration — check the eligibility panel."], ["When are funds released?", "Typically in two tranches: 60% at signing, 40% after a progress report."]],
  },
  internship: {
    benefits: ["Monthly stipend", "Structured mentorship and reviews", "Certificate and return-offer pathway", "Laptop or tooling where required"],
    docs: ["CV and one-page cover letter", "Enrolment proof or recent certificate", "Academic transcript", "Work sample or assignment"],
    process: ["Application", "Screening task", "Manager interview", "Offer"],
    faqs: [["Is the internship paid?", "Yes — every Oppora-listed internship is paid or stipended unless clearly marked otherwise."], ["Can interns be hired full-time?", "Most partners convert strong interns; conversion rates are shared during onboarding."]],
  },
  fellowship: {
    benefits: ["Full program funding and travel", "Executive mentorship circle", "Stipend during residency", "Lifetime alumni network"],
    docs: ["Leadership CV", "Project or venture summary", "Two recommendation letters", "Short video introduction"],
    process: ["Written application", "Regional interview", "Assessment centre or residency", "Cohort announcement"],
    faqs: [["How much time does the fellowship take?", "Most fellowships blend residencies (2–6 weeks) with virtual sessions across 9–12 months."], ["Can I keep my job during it?", "Yes — schedules are designed for working professionals."]],
  },
  competition: {
    benefits: ["Prize pool for winning teams", "Mentorship and bootcamps", "Investor and partner exposure", "Travel support for finals"],
    docs: ["Team registration form", "Pitch deck (10 slides)", "Proof of enrolment or ID", "Prototype link where applicable"],
    process: ["Team registration", "Qualifier submission", "Regional pitch round", "Global finals"],
    faqs: [["What team size is allowed?", "Usually 2–5 members; solo entries are accepted in some tracks."], ["Who owns our idea?", "You do. Organisers only request a licence to showcase finalists."]],
  },
  remote: {
    benefits: ["Fully remote across African time zones", "Paid in USD or local currency", "Home-office stipend", "Async-first culture with annual offsite"],
    docs: ["CV with remote work highlights", "Role-specific assessment", "Two professional references", "Tax/residency declaration"],
    process: ["Application", "Async screening task", "Two video interviews", "Reference check and offer"],
    faqs: [["Which time zones are supported?", "Teams overlap 4 hours with EAT/WAT; check the role notes."], ["How am I paid?", "Via Deel, Wise or local payroll depending on your country."]],
  },
  volunteer: {
    benefits: ["Certificate of service", "Training and capacity building", "Networking with sector professionals", "Reference letter on completion"],
    docs: ["Short application form", "CV or bio", "Motivation note (300 words)"],
    process: ["Application", "Fit conversation", "Onboarding and training", "Placement"],
    faqs: [["Are expenses covered?", "Onsite roles cover local transport; online roles are unpaid by nature."], ["How many hours per week?", "Typically 4–8 hours, flexible around work or study."]],
  },
  accelerator: {
    benefits: ["Equity-free or equity-light capital", "12-week structured program", "Mentor and investor matching", "Demo day with regional funds"],
    docs: ["Founder CVs", "Deck (12 slides)", "Traction summary", "Incorporation documents"],
    process: ["Application", "Founder interview", "Programme offer", "Demo day"],
    faqs: [["How much equity is taken?", "Terms vary by programme and are shown before you accept."], ["Do I need revenue?", "Pre-seed tracks accept pre-revenue ventures with proof of pilot."]],
  },
  training: {
    benefits: ["Fully sponsored tuition", "Laptop or data support where needed", "Job-placement partnership", "Industry certificate"],
    docs: ["ID or passport", "Proof of highest education", "Commitment statement", "Basic assessment result"],
    process: ["Application", "Assessment", "Cohort selection", "Programme start"],
    faqs: [["Is it really free?", "Sponsored tracks are free; providers recover costs through employer partnerships."], ["How many hours per week?", "Expect 15–25 hours including self-study."]],
  },
  conference: {
    benefits: ["Fully funded delegate seat", "Travel and accommodation", "Speaking and workshop access", "Youth declaration drafting room"],
    docs: ["Application form", "Motivation letter", "Proof of age or enrolment"],
    process: ["Application", "Selection", "Visa and travel support", "Summit"],
    faqs: [["Who pays for flights?", "Funded seats include return economy flights and hotel."], ["Can I attend virtually?", "Hybrid seats exist but funded seats are in-person."]],
  },
  youth: {
    benefits: ["Stipend or seed funding", "Mentorship from sector leaders", "Certificate and alumni network", "Showcase at national summit"],
    docs: ["Application form", "School or ID proof", "Recommendation from teacher or community leader"],
    process: ["Application", "Interview", "Programme onboarding"],
    faqs: [["What age range qualifies?", "Check the eligibility panel — most youth tracks run 15–29."], ["Is it school-friendly?", "Sessions run weekends and holidays."]],
  },
};

function opp(rec) {
  const d = DEFAULTS[rec.cat] || DEFAULTS.job;
  const org = ORGS[rec.org] || { color: "#1d6ff2", type: "Organisation", region: "International", verified: false };
  return Object.assign({
    tags: [], workMode: "onsite", level: "Any level", fields: [], skills: [],
    experience: "Any experience", age: "", countries: "All countries",
    benefits: d.benefits, docs: d.docs, process: d.process, faqs: d.faqs,
    featured: false, verified: org.verified, source: "Oppora partner feed",
    lastChecked: days(-2), applicants: 120 + ((rec.id || "").charCodeAt(4) || 3) * 37,
    about: `${rec.org} is a ${org.type.toLowerCase()} operating across ${org.region.toLowerCase() === "international" ? "global programmes" : org.region}. Oppora lists this organisation in its demo dataset; verification status shown here is illustrative.`,
  }, rec);
}

/* ---------- The dataset (44 demo records) ---------- */
export const OPPS = [
  // ——— Scholarships
  opp({ id: "sch-01", cat: "scholarship", title: "Mastercard Foundation Scholars Program — University of Cape Town", org: "Mastercard Foundation", country: "South Africa", city: "Cape Town", workMode: "onsite", funding: { kind: "fully", label: "Fully funded", amountNum: 42000 }, deadline: days(96), posted: days(-12), level: "Postgraduate", fields: ["Engineering", "Computer Science", "Business & Management"], skills: ["Leadership", "Community service", "Research"], countries: "African countries", age: "18–35", featured: true, desc: "Full-fee master's scholarships with leadership development for academically strong African students committed to giving back to their communities.", applicants: 4820 }),
  opp({ id: "sch-02", cat: "scholarship", title: "Chevening Scholarship for African Leaders (UK Master's)", org: "Chevening / UK FCDO", country: "United Kingdom", city: "London", workMode: "onsite", funding: { kind: "fully", label: "Fully funded", amountNum: 55000 }, deadline: days(45), posted: days(-30), level: "Postgraduate", fields: ["Public Policy", "Business & Management", "Public Health"], skills: ["Leadership", "Networking", "Policy analysis"], countries: "All countries", experience: "2+ years", featured: true, desc: "The UK government's international awards for future leaders: one-year master's degrees at any UK university with full financial support.", applicants: 9310 }),
  opp({ id: "sch-03", cat: "scholarship", title: "DAAD In-Region Master's in Data Science (Africa Centre of Excellence)", org: "DAAD", country: "Rwanda", city: "Kigali", workMode: "hybrid", funding: { kind: "fully", label: "Fully funded", amountNum: 24000 }, deadline: days(21), posted: days(-18), level: "Postgraduate", fields: ["Data Science", "Computer Science"], skills: ["Python", "Statistics", "SQL"], countries: "African countries", desc: "Funded master's study at an African Centre of Excellence, designed for STEM graduates who want to apply data science to development problems." }),
  opp({ id: "sch-04", cat: "scholarship", title: "Mandela Rhodes Scholarship", org: "Mandela Rhodes Foundation", country: "South Africa", city: "Stellenbosch", workMode: "onsite", funding: { kind: "fully", label: "Fully funded", amountNum: 30000 }, deadline: days(60), posted: days(-9), level: "Postgraduate", fields: FIELDS.slice(0, 12), skills: ["Leadership", "Reconciliation", "Entrepreneurship"], countries: "African countries", age: "19–30", desc: "Honours and master's funding paired with a year-long leadership development programme for young Africans with character and vision." }),
  opp({ id: "sch-05", cat: "scholarship", title: "ALU Global Leadership Scholarship (50% Tuition)", org: "African Leadership University", country: "Rwanda", city: "Kigali", workMode: "onsite", funding: { kind: "partial", label: "50% tuition", amountNum: 6500 }, deadline: days(12), posted: days(-25), level: "Undergraduate", fields: ["Business & Management", "Computer Science"], skills: ["Problem solving", "Communication"], countries: "African countries", desc: "Half-tuition awards for mission-driven undergraduates who want a mission-first, project-based degree in Kigali or Mauritius." }),
  opp({ id: "sch-06", cat: "scholarship", title: "Women in Tech Africa Scholarship", org: "Google.org", country: "Global / Remote", city: "Remote", workMode: "remote", funding: { kind: "partial", label: "Tuition + stipend", amountNum: 10000 }, deadline: days(3), posted: days(-40), level: "Undergraduate", fields: ["Computer Science", "Data Science"], skills: ["Programming", "Mathematics"], countries: "African countries", desc: "Tuition support and a conference pass for women studying computing across Africa, with a mentor from Google's engineering teams.", featured: true }),
  opp({ id: "sch-07", cat: "scholarship", title: "Erasmus Mundus Joint Masters — Africa Window", org: "Erasmus+ / EU", country: "France", city: "Multiple EU cities", workMode: "onsite", funding: { kind: "fully", label: "Fully funded", amountNum: 48000 }, deadline: days(75), posted: days(-6), level: "Postgraduate", fields: ["Climate & Environment", "Engineering", "Social Sciences"], skills: ["Research", "Languages"], countries: "All countries", desc: "Study in two or more European countries on a joint degree with full EU funding reserved for high-achieving African applicants." }),

  // ——— Jobs
  opp({ id: "job-01", cat: "job", title: "Software Engineer, Payments Platform", org: "Flutterwave", country: "Nigeria", city: "Lagos", workMode: "hybrid", funding: { kind: "salary", label: "₦45M – ₦62M / yr", amountNum: 45000 }, deadline: days(30), posted: days(-4), level: "Any level", fields: ["Computer Science"], skills: ["JavaScript", "Node.js", "APIs", "SQL"], experience: "2–5 years", featured: true, desc: "Build and scale payment rails used by 400,000+ businesses across Africa. Own services end-to-end from design to on-call." }),
  opp({ id: "job-02", cat: "job", title: "Data Analyst, Risk & Fraud", org: "Paystack", country: "Nigeria", city: "Lagos / Remote", workMode: "hybrid", funding: { kind: "salary", label: "$28k – $38k / yr", amountNum: 28000 }, deadline: days(18), posted: days(-11), level: "Any level", fields: ["Data Science", "Finance"], skills: ["SQL", "Python", "Dashboards"], experience: "1–3 years", desc: "Turn transaction data into fraud-detection signals. You'll partner with engineering and ops to ship models that protect merchants." }),
  opp({ id: "job-03", cat: "job", title: "Programme Manager, Education East Africa", org: "British Council", country: "Kenya", city: "Nairobi", workMode: "onsite", funding: { kind: "salary", label: "$46k – $52k / yr", amountNum: 46000 }, deadline: days(25), posted: days(-7), level: "Any level", fields: ["Education", "Public Policy"], skills: ["Stakeholder management", "M&E", "Grant management"], experience: "5+ years", desc: "Lead bilingual education partnerships across Kenya, Uganda and Tanzania, managing grants and government relationships." }),
  opp({ id: "job-04", cat: "job", title: "Solar Field Engineer", org: "M-KOPA", country: "Uganda", city: "Kampala", workMode: "onsite", funding: { kind: "salary", label: "$24k – $30k / yr", amountNum: 24000 }, deadline: days(9), posted: days(-15), level: "Any level", fields: ["Engineering", "Climate & Environment"], skills: ["Electrical systems", "Field diagnostics", "Safety"], experience: "1–4 years", desc: "Deploy and maintain pay-as-you-go solar systems for 40,000 households, leading a field team of technicians." }),
  opp({ id: "job-05", cat: "job", title: "Community Health Research Officer", org: "Wellcome Trust", country: "Ghana", city: "Accra", workMode: "hybrid", funding: { kind: "salary", label: "$36k – $41k / yr", amountNum: 36000 }, deadline: days(40), posted: days(-3), level: "Postgraduate", fields: ["Public Health"], skills: ["Field research", "Data collection", "Report writing"], experience: "2+ years", desc: "Coordinate community trials and qualitative studies on urban health outcomes with West African research partners." }),
  opp({ id: "job-06", cat: "job", title: "Graduate Trainee, Cloud Support Engineering", org: "Microsoft Africa", country: "South Africa", city: "Johannesburg", workMode: "hybrid", funding: { kind: "salary", label: "$30k – $35k / yr", amountNum: 30000 }, deadline: days(6), posted: days(-20), level: "Undergraduate", fields: ["Computer Science", "Engineering"], skills: ["Linux", "Networking", "PowerShell"], experience: "0–2 years", desc: "18-month rotational programme for recent graduates: certifications, mentorship and a permanent placement at the end." }),

  // ——— Grants
  opp({ id: "gr-01", cat: "grant", title: "Tony Elumelu Foundation Entrepreneurship Grant", org: "Tony Elumelu Foundation", country: "Nigeria", city: "Pan-African", workMode: "remote", funding: { kind: "prize", label: "$5,000 seed capital", amountNum: 5000 }, deadline: days(33), posted: days(-14), level: "Any level", fields: ["Business & Management"], skills: ["Business planning", "Pitching"], countries: "African countries", featured: true, desc: "Training, mentoring and $5,000 in non-repayable seed capital for 5,000 African entrepreneurs every year.", tags: ["Startup funding", "Entrepreneurship"] }),
  opp({ id: "gr-02", cat: "grant", title: "African Women Innovation Fund", org: "African Development Bank", country: "Rwanda", city: "Pan-African", workMode: "remote", funding: { kind: "prize", label: "Up to $25,000", amountNum: 25000 }, deadline: days(52), posted: days(-8), level: "Any level", fields: ["Business & Management", "Finance"], skills: ["Financial modelling", "Impact measurement"], countries: "African countries", desc: "Growth grants plus technical assistance for women-led SMEs in agribusiness, fintech and clean energy.", tags: ["Women-focused", "Startup funding"] }),
  opp({ id: "gr-03", cat: "grant", title: "Youth Agri-Business Seed Grant", org: "AGRA", country: "Kenya", city: "Nairobi", workMode: "onsite", funding: { kind: "prize", label: "$10,000", amountNum: 10000 }, deadline: days(14), posted: days(-22), level: "Any level", fields: ["Agriculture", "Business & Management"], skills: ["Value chains", "Farm management"], countries: "African countries", age: "18–35", desc: "Seed capital and agronomy support for youth-led ventures improving seed, storage or market access for smallholders.", tags: ["Youth funding", "Social impact"] }),
  opp({ id: "gr-04", cat: "grant", title: "Digital Societies Research Grant", org: "Rockefeller Foundation", country: "Global / Remote", city: "Remote", workMode: "remote", funding: { kind: "prize", label: "Up to $50,000", amountNum: 50000 }, deadline: days(66), posted: days(-5), level: "Doctoral", fields: ["Social Sciences", "Data Science"], skills: ["Research design", "Academic writing"], countries: "All countries", desc: "Funds interdisciplinary research on how digital platforms shape livelihoods in the Global South.", tags: ["Research"] }),
  opp({ id: "gr-05", cat: "grant", title: "Community Impact Micro-Grant", org: "Mastercard Foundation", country: "Canada", city: "Pan-African", workMode: "remote", funding: { kind: "prize", label: "$7,500", amountNum: 7500 }, deadline: days(5), posted: days(-35), level: "Any level", fields: ["Education", "Social Sciences"], skills: ["Community organising"], countries: "African countries", desc: "Fast-cycle micro-grants for community organisations running youth employment and digital literacy projects.", tags: ["NGO / community", "Youth funding"] }),
  opp({ id: "gr-06", cat: "grant", title: "Seedstars International Growth Grant", org: "Seedstars", country: "Global / Remote", city: "Remote", workMode: "remote", funding: { kind: "prize", label: "Up to $25,000", amountNum: 25000 }, deadline: days(80), posted: days(-2), level: "Any level", fields: ["Business & Management", "Computer Science"], skills: ["Traction metrics", "Pitching"], countries: "All countries", desc: "Equity-free grants and investor introductions for impact startups emerging from Seedstars local competitions.", tags: ["Startup funding", "Innovation"] }),

  // ——— Internships
  opp({ id: "int-01", cat: "internship", title: "Google Africa Developer Internship", org: "Google", country: "Kenya", city: "Nairobi", workMode: "hybrid", funding: { kind: "stipend", label: "Paid stipend", amountNum: 3200 }, deadline: days(26), posted: days(-6), level: "Undergraduate", fields: ["Computer Science"], skills: ["Python", "Git", "Problem solving"], experience: "Students & new grads", featured: true, desc: "12-week engineering internship at the Nairobi hub: ship real features with a host manager and a cohort of interns across Africa." }),
  opp({ id: "int-02", cat: "internship", title: "Policy Research Internship, Agenda 2063 Unit", org: "African Union", country: "Ethiopia", city: "Addis Ababa", workMode: "onsite", funding: { kind: "stipend", label: "Monthly stipend", amountNum: 1500 }, deadline: days(17), posted: days(-13), level: "Postgraduate", fields: ["Public Policy", "Social Sciences"], skills: ["Policy briefs", "Data analysis"], desc: "Support continental policy research and member-state reporting inside the AU Commission's strategic planning unit." }),
  opp({ id: "int-03", cat: "internship", title: "Fintech Engineering Intern (Remote Africa)", org: "Andela", country: "Global / Remote", city: "Remote", workMode: "remote", funding: { kind: "stipend", label: "$800 / month", amountNum: 800 }, deadline: days(11), posted: days(-9), level: "Undergraduate", fields: ["Computer Science"], skills: ["React", "JavaScript", "REST APIs"], desc: "Remote six-month internship embedded with client fintech teams; top performers join Andela's talent network." }),
  opp({ id: "int-04", cat: "internship", title: "Climate Data Internship, Development Economics Group", org: "World Bank Group", country: "United States", city: "Washington DC / Remote", workMode: "hybrid", funding: { kind: "stipend", label: "Paid stipend", amountNum: 4000 }, deadline: days(38), posted: days(-4), level: "Postgraduate", fields: ["Climate & Environment", "Data Science", "Finance"], skills: ["Stata or R", "Data visualisation"], desc: "Analyse climate-resilience investment data for Sub-Saharan portfolios alongside senior economists." }),
  opp({ id: "int-05", cat: "internship", title: "Marketing & Storytelling Intern", org: "Twiga Foods", country: "Kenya", city: "Nairobi", workMode: "onsite", funding: { kind: "stipend", label: "Stipend + meals", amountNum: 600 }, deadline: days(6), posted: days(-28), level: "Undergraduate", fields: ["Design & Media", "Business & Management"], skills: ["Content writing", "Social media", "Photography"], desc: "Tell the story of Africa's food-supply revolution: vendor profiles, campaign assets and field content across Nairobi." }),

  // ——— Fellowships
  opp({ id: "fel-01", cat: "fellowship", title: "Mandela Washington Fellowship (YALI)", org: "U.S. Department of State", country: "United States", city: "Multiple US campuses", workMode: "onsite", funding: { kind: "fully", label: "Fully funded", amountNum: 18000 }, deadline: days(28), posted: days(-16), level: "Any level", fields: ["Business & Management", "Public Policy", "Climate & Environment"], skills: ["Leadership", "Community impact"], countries: "African countries", age: "25–35", featured: true, desc: "Six-week academic and leadership institutes in the US for outstanding young African leaders, followed by a Washington summit." }),
  opp({ id: "fel-02", cat: "fellowship", title: "Acumen East Africa Fellowship", org: "Acumen", country: "Kenya", city: "Nairobi", workMode: "hybrid", funding: { kind: "fully", label: "Fully funded", amountNum: 12000 }, deadline: days(49), posted: days(-10), level: "Any level", fields: ["Business & Management", "Social Sciences"], skills: ["Systems thinking", "Public narrative"], experience: "3+ years", desc: "A year-long moral-leadership fellowship for professionals driving change in East Africa, with stipend-supported residencies." }),
  opp({ id: "fel-03", cat: "fellowship", title: "Schmidt Scholars Fellowship", org: "Schmidt Futures", country: "United States", city: "New York", workMode: "onsite", funding: { kind: "fully", label: "Full scholarship + stipend", amountNum: 70000 }, deadline: days(70), posted: days(-7), level: "Undergraduate", fields: FIELDS.slice(0, 12), skills: ["Research", "Service leadership"], age: "17–21", desc: "Four-year undergraduate fellowship covering tuition, housing and stipend for students committed to science and service." }),
  opp({ id: "fel-04", cat: "fellowship", title: "Obama Foundation Scholars Program", org: "Obama Foundation", country: "United States", city: "New York", workMode: "onsite", funding: { kind: "fully", label: "Fully funded", amountNum: 65000 }, deadline: days(55), posted: days(-19), level: "Postgraduate", fields: ["Public Policy", "Social Sciences", "Education"], skills: ["Leadership", "Programme design"], experience: "5+ years", desc: "A year at Columbia University for leaders scaling civic impact, with stipend, housing and project funding." }),

  // ——— Competitions
  opp({ id: "com-01", cat: "competition", title: "Hult Prize Africa Regional Summit", org: "Hult Prize", country: "Global / Remote", city: "Regional hubs", workMode: "hybrid", funding: { kind: "prize", label: "$1,000,000 seed", amountNum: 1000000 }, deadline: days(19), posted: days(-21), level: "Any level", fields: ["Business & Management", "Climate & Environment", "Public Health"], skills: ["Social enterprise", "Pitching"], age: "18+", featured: true, desc: "The world's biggest student social-entrepreneurship competition: build a venture tackling this year's food-systems challenge." }),
  opp({ id: "com-02", cat: "competition", title: "Africa Code Week Hackathon", org: "SAP Africa", country: "Global / Remote", city: "Online", workMode: "remote", funding: { kind: "prize", label: "$15,000 pool", amountNum: 15000 }, deadline: days(8), posted: days(-17), level: "Any level", fields: ["Computer Science", "Data Science"], skills: ["JavaScript", "Python", "Teamwork"], age: "16–28", desc: "48-hour virtual hackathon building learning tools for African classrooms; mentors from SAP engineering join every team room." }),
  opp({ id: "com-03", cat: "competition", title: "Anzisha Prize for Young Entrepreneurs", org: "African Leadership Academy", country: "South Africa", city: "Johannesburg", workMode: "onsite", funding: { kind: "prize", label: "$300,000 pool", amountNum: 300000 }, deadline: days(42), posted: days(-11), level: "Any level", fields: ["Business & Management"], skills: ["Entrepreneurship", "Resilience"], age: "15–22", desc: "Africa's largest award for youth-led businesses: cash prizes, fellowship training and a continent-wide founder network." }),
  opp({ id: "com-04", cat: "competition", title: "Climate Launchpad Africa Finals", org: "Climate-KIC", country: "Netherlands", city: "Amsterdam (finals)", workMode: "hybrid", funding: { kind: "prize", label: "€10,000 + incubation", amountNum: 10000 }, deadline: days(61), posted: days(-3), level: "Any level", fields: ["Climate & Environment", "Engineering"], skills: ["Cleantech", "Prototyping"], desc: "Green-business idea competition with national bootcamps in 12 African countries and a European grand final." }),

  // ——— Remote work
  opp({ id: "rem-01", cat: "remote", title: "Full-Stack Developer (EMEA, Remote)", org: "Deel", country: "Global / Remote", city: "Remote", workMode: "remote", funding: { kind: "salary", label: "$55k – $75k / yr", amountNum: 55000 }, deadline: days(22), posted: days(-5), level: "Any level", fields: ["Computer Science"], skills: ["React", "Node.js", "PostgreSQL"], experience: "3+ years", featured: true, desc: "Build payroll and compliance tooling used in 150 countries. Fully remote, async-first, USD compensation." }),
  opp({ id: "rem-02", cat: "remote", title: "Customer Success Specialist, Africa Accounts", org: "Canonical", country: "Global / Remote", city: "Remote", workMode: "remote", funding: { kind: "salary", label: "$38k – $46k / yr", amountNum: 38000 }, deadline: days(13), posted: days(-8), level: "Any level", fields: ["Computer Science", "Business & Management"], skills: ["Linux", "Communication", "Ubuntu"], experience: "1+ years", desc: "Support enterprise Ubuntu customers across African time zones; home-based with twice-yearly team sprints." }),
  opp({ id: "rem-03", cat: "remote", title: "UX Researcher, Emerging Markets", org: "Meta", country: "Global / Remote", city: "Remote", workMode: "remote", funding: { kind: "salary", label: "$50k – $68k / yr", amountNum: 50000 }, deadline: days(35), posted: days(-12), level: "Any level", fields: ["Design & Media", "Social Sciences"], skills: ["User interviews", "Figma", "Research ops"], experience: "3+ years", desc: "Lead mixed-methods research on low-bandwidth product experiences for Africa and South Asia." }),
  opp({ id: "rem-04", cat: "remote", title: "Technical Writer, Developer Platform", org: "Cloudflare", country: "Global / Remote", city: "Remote", workMode: "remote", funding: { kind: "salary", label: "$44k – $52k / yr", amountNum: 44000 }, deadline: days(2), posted: days(-26), level: "Any level", fields: ["Computer Science", "Design & Media"], skills: ["Technical writing", "Markdown", "APIs"], experience: "2+ years", desc: "Own documentation for Workers and R2: tutorials, API references and developer guides read by millions." }),
  opp({ id: "rem-05", cat: "remote", title: "Growth Marketing Associate (EMEA)", org: "HubSpot", country: "Global / Remote", city: "Remote", workMode: "remote", funding: { kind: "salary", label: "$36k – $44k / yr", amountNum: 36000 }, deadline: days(44), posted: days(-6), level: "Any level", fields: ["Business & Management", "Design & Media"], skills: ["SEO", "Lifecycle marketing", "Analytics"], experience: "1–3 years", desc: "Run acquisition experiments for EMEA markets with a remote-first growth pod and a generous learning budget." }),

  // ——— Volunteering
  opp({ id: "vol-01", cat: "volunteer", title: "UN Online Volunteering — Translation & Data for Development", org: "UN Volunteers", country: "Global / Remote", city: "Online", workMode: "remote", funding: { kind: "unpaid", label: "Unpaid · certified", amountNum: 0 }, deadline: days(120), posted: days(-2), level: "Any level", fields: ["Social Sciences", "Data Science", "Design & Media"], skills: ["Translation", "Data entry", "Writing"], featured: true, desc: "Flexible online assignments with UN agencies: translate health content, clean datasets, design outreach — 5–8 hrs/week." }),
  opp({ id: "vol-02", cat: "volunteer", title: "Community Teaching Volunteer (STEM Clubs)", org: "Teach For All", country: "Nigeria", city: "Lagos & Abuja", workMode: "onsite", funding: { kind: "unpaid", label: "Unpaid · transport covered", amountNum: 0 }, deadline: days(16), posted: days(-14), level: "Any level", fields: ["Education", "Computer Science"], skills: ["Teaching", "Patience", "Lesson planning"], desc: "Lead after-school STEM clubs in public schools: two sessions a week, training and curriculum provided." }),
  opp({ id: "vol-03", cat: "volunteer", title: "Coastal Cleanup Crew Lead", org: "UN Environment Programme", country: "Kenya", city: "Mombasa", workMode: "onsite", funding: { kind: "unpaid", label: "Unpaid · certified", amountNum: 0 }, deadline: days(27), posted: days(-9), level: "Any level", fields: ["Climate & Environment"], skills: ["Organising", "Safety briefing"], desc: "Coordinate monthly cleanup crews and waste audits along the Mombasa coastline with county government support." }),
  opp({ id: "vol-04", cat: "volunteer", title: "Digital Skills Mentor (Remote, 4 hrs/week)", org: "British Council", country: "Global / Remote", city: "Online", workMode: "remote", funding: { kind: "unpaid", label: "Unpaid · certified", amountNum: 0 }, deadline: days(58), posted: days(-5), level: "Any level", fields: ["Computer Science", "Education"], skills: ["Mentoring", "Digital literacy"], desc: "Mentor three young job-seekers through the digital-skills curriculum with weekly video check-ins." }),

  // ——— Accelerators / training / conference / youth
  opp({ id: "acc-01", cat: "accelerator", title: "CcHUB Pre-Seed Accelerator (Co-Creation Hub)", org: "Co-Creation Hub", country: "Nigeria", city: "Lagos", workMode: "hybrid", funding: { kind: "prize", label: "$10k equity-free", amountNum: 10000 }, deadline: days(31), posted: days(-10), level: "Any level", fields: ["Business & Management", "Computer Science", "Public Health"], skills: ["Product discovery", "Fundraising"], countries: "African countries", desc: "12-week programme for pre-seed Nigerian startups: $10k equity-free, operator mentorship and demo day with local angels.", tags: ["Startup funding"] }),
  opp({ id: "acc-02", cat: "accelerator", title: "Villgro Africa Health Incubation", org: "Villgro Africa", country: "Kenya", city: "Nairobi", workMode: "hybrid", funding: { kind: "stipend", label: "Up to $45k milestone funding", amountNum: 45000 }, deadline: days(47), posted: days(-13), level: "Any level", fields: ["Public Health", "Engineering"], skills: ["Clinical validation", "Regulatory basics"], countries: "African countries", desc: "Incubation for health innovators: milestone grants, clinical-advisory support and hospital pilot placements.", tags: ["Innovation"] }),
  opp({ id: "trn-01", cat: "training", title: "ALX Software Engineering Program (Sponsored Cohort)", org: "ALX Africa", country: "Global / Remote", city: "Remote + hubs", workMode: "hybrid", funding: { kind: "fully", label: "Fully sponsored", amountNum: 9000 }, deadline: days(20), posted: days(-8), level: "Any level", fields: ["Computer Science"], skills: ["Commitment", "Basic logic"], countries: "African countries", featured: true, desc: "Free, intensive 12-month software engineering training with peer learning, hubs in 6 countries and employer placements." }),
  opp({ id: "trn-02", cat: "training", title: "AWS re/Start Cloud Foundations (South Africa)", org: "Amazon Web Services", country: "South Africa", city: "Cape Town / Online", workMode: "hybrid", funding: { kind: "fully", label: "Free training + cert voucher", amountNum: 3000 }, deadline: days(36), posted: days(-6), level: "Any level", fields: ["Computer Science"], skills: ["No experience needed"], desc: "12-week cloud-skills training for unemployed and underemployed talent, ending with the Cloud Practitioner certification." }),
  opp({ id: "con-01", cat: "conference", title: "AU Youth Summit — Fully Funded Delegate Seats", org: "African Union", country: "Ethiopia", city: "Addis Ababa", workMode: "onsite", funding: { kind: "fully", label: "Travel + accommodation", amountNum: 4500 }, deadline: days(24), posted: days(-4), level: "Any level", fields: ["Public Policy", "Social Sciences"], skills: ["Advocacy"], age: "18–35", countries: "African countries", desc: "100 funded seats for young Africans to draft the continental youth declaration alongside ministers and AU commissioners." }),
  opp({ id: "you-01", cat: "youth", title: "One Young World Summit — Africa Delegation", org: "One Young World", country: "Global / Remote", city: "Rotating host city", workMode: "onsite", funding: { kind: "fully", label: "Fully funded seats", amountNum: 6000 }, deadline: days(50), posted: days(-7), level: "Any level", fields: FIELDS.slice(0, 12), skills: ["Leadership", "Public speaking"], age: "18–30", desc: "Join 2,000 young leaders worldwide: funded delegate seats for Africans running social-impact projects at home." }),
  opp({ id: "you-02", cat: "youth", title: "JA Africa Company Program (Secondary Schools)", org: "JA Africa", country: "Ghana", city: "Accra & Kumasi", workMode: "onsite", funding: { kind: "unpaid", label: "Seed kits + mentorship", amountNum: 500 }, deadline: days(68), posted: days(-15), level: "Secondary", fields: ["Business & Management"], skills: ["Teamwork"], age: "14–19", desc: "Students form and run real micro-companies over one academic year with volunteer business mentors." }),
];

export const DEMO_STATS = { opportunities: "10,000+", partners: "500+", countries: "50+", users: "100K+" };

export function orgOf(name) { return ORGS[name] || { color: "#1d6ff2", type: "Organisation", region: "International", verified: false }; }
export function catOf(key) { return CATS[key] || CATS.job; }
export function getOpp(id) { return OPPS.find((o) => o.id === id) || null; }
export function countFor(cat) { return OPPS.filter((o) => o.cat === cat).length; }
export const ALL_OPPS = OPPS;
