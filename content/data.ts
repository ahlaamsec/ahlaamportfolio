// EDIT HERE. Everything on the site reads from this file. "TODO" = not yet provided; nothing below is invented.
export const site = {
  name: 'Ahlaam Abdallah',
  email: 'ahlaamwumpini@gmail.com',
  phone: '+233 50 653 6453',
  github: 'https://github.com/Ahlaamsec',
  linkedin: 'https://www.linkedin.com/in/ahlaam-abdallah-a3085b23b/',
  cv: '/Ahlaam_Abdallah_CV.pdf', // drop your PDF in /public with this name
};

export const research = [
  { id: 'Q1', title: 'Human-centred security', qs: ['Why do people ignore warnings that are technically correct?', 'How does documentation change security behaviour?', 'What makes phishing awareness stick?'] },
  { id: 'Q2', title: 'HCI and technical communication', qs: ['How do interfaces communicate risk?', 'What does a non-specialist need from a vulnerability report?', 'Where does AI-assisted writing help or distort?'] },
  { id: 'Q3', title: 'Secure and trustworthy AI', qs: ['What does human oversight of an AI security tool actually look like?', 'How do LLM systems fail under adversarial input?', 'What should an AI analyst be trusted with?'] },
];

export type Lab = {
  slug: string; title: string; platform: string; status: string; tools: string[]; objective: string; findings: string;
  full?: { target?: string; methodology?: string[]; recon?: string; enumeration?: string; exploitation?: string; privesc?: string;
    table?: { title: string; desc: string; severity: string; impact: string }[]; remediation?: string[]; conclusion?: string; evidence?: { file: string; caption: string }[] };
};
const todo = 'TODO: add your write-up. No findings are shown until you supply them.';
export const labs: Lab[] = [
  {
    slug: 'apache-cve-2021-41773', title: 'Apache Instance Compromise', platform: 'BCTF (apache.bctf.africa)', status: 'Full write-up',
    tools: ['Nmap', 'searchsploit', 'GTFOBins', 'SSH'],
    objective: 'Assess a target Apache instance for exploitable vulnerabilities and determine how far an attacker could escalate from initial access.',
    findings: 'Path Traversal / RCE (CVE-2021-41773) in Apache 2.4.49 led to SSH-key disclosure, and a NOPASSWD sudo rule on /bin/cpio allowed full escalation to root.',
    full: {
      target: '10.0.160.144 (apache.bctf.africa) — in scope for this engagement only',
      methodology: ['Intelligence gathering: service discovery and version identification', 'Vulnerability analysis: mapping identified services to known exploits', 'Exploitation: gaining initial access via the web service', 'Post-exploitation: lateral movement and privilege escalation'],
      recon: 'An Nmap scan (nmap -p- -vv -T4 -sV) identified open ports 22 (SSH) and 80 (HTTP). A follow-up curl request against port 80 fingerprinted the web server as Apache 2.4.49.',
      enumeration: 'searchsploit against "Apache 2.4.49" surfaced CVE-2021-41773, a path traversal and remote code execution vulnerability specific to that build, with a ready exploit script (50383.sh).',
      exploitation: 'The exploit script was made executable and pointed at the target to traverse the filesystem and read /home/ETSCTF/.ssh/id_rsa. The recovered private key was saved locally, chmod 600 was applied, and an SSH session was opened as user ETSCTF — yielding the user flag.',
      privesc: 'sudo -l showed ETSCTF could run /bin/cpio as root with NOPASSWD. Cross-referencing GTFOBins confirmed cpio\'s --rsh-command flag can spawn a shell. Running sudo cpio -o --rsh-command /bin/sh -F localhost: returned a root shell (whoami: root), yielding the root flag.',
      table: [
        { title: 'CVE-2021-41773', desc: 'Apache 2.4.49 path traversal / RCE', severity: 'Critical', impact: 'Remote code execution and sensitive file disclosure' },
        { title: 'Sudo misconfiguration', desc: 'Insecure NOPASSWD /bin/cpio sudo rule', severity: 'High', impact: 'Allows a low-privileged user to gain full root access' },
      ],
      remediation: ['Upgrade Apache HTTP Server to 2.4.51 or later immediately.', 'Review /etc/sudoers and remove the NOPASSWD entry for cpio; use restricted alternatives if archiving is genuinely needed.'],
      conclusion: 'The host was fully compromised through a well-known, critical, unpatched web-server vulnerability combined with an overly permissive sudo rule. A regular patch cycle and periodic sudoers auditing would have prevented the entire chain.',
      evidence: [
        { file: 'image1.png', caption: 'Nmap scan showing open ports 22 (SSH) and 80 (HTTP)' },
        { file: 'image2.png', caption: 'curl fingerprinting the web server and version' },
        { file: 'image3.png', caption: 'searchsploit identifying the CVE-2021-41773 exploit' },
        { file: 'image4.png', caption: 'Copying the searchsploit exploit script' },
        { file: 'image5.png', caption: 'Successful extraction of the SSH private key via path traversal' },
        { file: 'image6.png', caption: 'SSH login as user ETSCTF using the recovered key' },
        { file: 'image7.png', caption: 'User flag retrieved' },
      ],
    },
  },
  { slug: 'sqlpad-cve-2022-0944', title: 'SQLPad v6.9.0', platform: 'EchoCTF', status: 'Write-up pending', tools: ['Kali Linux', 'Nmap', 'Burp Suite'], objective: 'Investigate CVE-2022-0944 in SQLPad v6.9.0.', findings: todo },
  { slug: 'kioptrix', title: 'Kioptrix', platform: 'Boot-to-root lab', status: 'Write-up pending', tools: ['Nmap', 'netcat', 'Metasploit'], objective: 'Enumeration and exploitation methodology on a Linux target.', findings: todo },
  { slug: 'secureshop', title: 'SecureShop', platform: 'Independent practice lab', status: 'Write-up pending', tools: ['Burp Suite', 'SQL injection testing'], objective: 'Web application vulnerability assessment and security reporting.', findings: todo },
  { slug: 'tryhackme', title: 'TryHackMe rooms', platform: 'TryHackMe', status: 'Index pending', tools: ['Linux', 'Nmap'], objective: 'Web security, network reconnaissance, CTF methodology.', findings: todo },
];

export type Piece = { title: string; date: string; category: string; type: string; tags: string[]; mins: number; status: string };

// True placeholders — nothing written yet. Replace when ready (see README).
export const placeholderWriting: Piece[] = [];

// Certifications/training as named on the CV, with issuer.
export const certs: { name: string; issuer: string }[] = [
  { name: 'Google Cybersecurity Professional Certificate', issuer: 'Google' },
  { name: 'Google AI Fundamentals', issuer: 'Google' },
  { name: 'IBM AI Fundamentals', issuer: 'IBM' },
  { name: 'Introduction to Cybersecurity', issuer: 'Cisco' },
  { name: 'Networking Basics', issuer: 'Cisco' },
  { name: 'Certified Phishing Prevention Specialist', issuer: 'Hack and Fix' },
  { name: 'Certified Cybersecurity Education Professional', issuer: 'Redteamleaders' },
  { name: 'Leadership & Public Speaking', issuer: 'International Leadership Foundation' },
];

export const experience = [
  { org: 'KNUST', role: 'Teaching Assistant', when: 'Nov 2025 – Oct 2026', bullets: ['Supported undergraduate CS instruction for students with varied technical backgrounds.', 'Mentored students through coursework, problem-solving and academic challenges.', 'Contributed to final-year project supervision.'] },
  { org: 'KTechHub', role: 'Web Development Intern', when: 'Oct – Dec 2023', bullets: ['Built and maintained responsive web applications with HTML, CSS and JavaScript.', 'Collaborated with senior developers to implement and refine functionality.'] },
  { org: 'AdRoit Bureau Limited', role: 'Software Intern', when: 'Sep – Nov 2022', bullets: ['Tested a software application for performance, usability and user experience.', 'Developed a structured book template and gave user-oriented feedback.'] },
];

export const leadership = [
  { org: 'Mobile Qur\u2019an Institute (MQI), KNUST', role: 'Secretary', when: '2021 – 2025', note: 'Coordinated organisational communication, meeting minutes and member records for a student-led educational institution.' },
  { org: 'GMSA-KNUST', role: 'Most Influential Ladies\u2019 Wing Leader; Secretary, Imaamate Council; Debate Competition Participant', when: '' , note: ''},
  { org: 'HerDream Foundation, Bimbilla', role: 'Community Outreach Volunteer', when: '2022', note: 'Community outreach and education activities involving young people, including reusable sanitary pad training for female orphans.' },
  { org: 'KNUST Writers Association', role: 'Member', when: '', note: '' },
];

export const education = {
  school: 'Kwame Nkrumah University of Science and Technology (KNUST), Kumasi, Ghana',
  degree: 'B.Sc. Computer Science, 2022 – 2025',
  standing: 'Second Class Upper Division',
  coursework: 'Artificial Intelligence, Machine Learning, Human-Computer Interaction, Computer Networks, Databases, Software Development',
};

export const languages = ['English', 'Arabic', 'Dagbani', 'Hausa'];

export type FullPiece = Piece & { slug: string; content: string[] };
export const fullWriting: FullPiece[] = [
  { slug: 'diary-day101-my-kids', title: 'Day 101 — My Kids', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['teaching'], mins: 3, status: 'Published',
    content: [
      `Today I had to handle two classes, which is not necessarily my Favourite thing. I love to handle my class.. my people (sort of a green thing but whatever)`,
      `I asked them if they had missed me and they said they did… in a beautiful beautiful way. They all raised their hands and shouted "meeee" when I asked, "so who missed me?"`,
      `I did not have enough time and energy today, so we revised the duas (supplications) based on our activities. For example I would ask them. "Who said the dua for waking up today?" and some people would raise their hands and respond with the respective dua.`,
      `We went on and on, I asked them which of them had fasted, and a bunch of them raised their hands… mostly kids from the other class.
We talked about where they prayed their Eid… etc etc`,
      `I shouted so much, and perhaps that took a toll on my voice… to the point where a kid was literally standing in front of me and he told me he could not hear me.`,
      `I also punished several students in my class. Some students went out of the madrasah without permission… and even more painfully, right under my nose. Some kid had squished banana peels on a stone that would be used to support the board. Some kid was also eating in class, and some guy just wouldn't sit still and listen.`,
      `There was a kid who came to me with a stomachache (I presume he ate too much or whatever) and then I took him through the dua (supplication) for when you are sick.`,
      `I loved to entertain the thought that I would not miss them, and that they just caused me to shout non-stop, but today when I saw their faces, I realized I loved being around them… and maybe I love the shouting too… without the croaking of my voice😂`,
      `Byeee`
    ] },
  { slug: 'diary-day102-my-kids', title: 'Day 102 — My Kids', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['teaching'], mins: 2, status: 'Published',
    content: [
      `Sundays are assembly days in our madrasah, and I got to the madrasah early too, so that meant that I could chill in the ladies prayer area for a second, but I couldn't, because well…`,
      `During class today, I did the same thing. We used scenarios to revise our duas, and the other class still joined my class. I said to them, "If they take the lights, and the room is dark, and I have to go inside and take the torch light in the room, and the room looks (proceeds with a creepy voice) scary and spooky and creepy…"`,
      `The kids started shouting, jokingly I presume, because they were sort of imagining it.`,
      `Then we said the other duas etc etc.`,
      `As usual, the shouting was inevitable, and getting close to the end of the class, I asked them if they wanted a story. Of course they did, but we were soon interrupted by a fight between three people I still do not understand. I thought a fight is between two people?`,
      `I punished quite a few people today as well. One insulted another kid, another was eating in class, and some other two people had gone to lie down by a different class altogether.`,
      `There were two girls I had punished yesterday. Those girls who "went out without my permission, and even more painfully, right under my nose".`,
      `When I asked them, "Why did you go out?" The first girl said, "She said we should go"`,
      `I then asked her, "If she says you should put your hand in fire, would you?"`,
      `My Favourite part of the madrasah might be sharing my tissue and hijab pins (one pin actually, today) with the kids.
And oh, how could I forget? The quiet composed kid in my class I was trying to make friends with got chosen to lead the prayer (salah).`,
      `My friend and colleague made a huge deal out of it and called him the "chief imam"😂`,
      `Byeee`
    ] },
  { slug: 'diary-day103-my-kids', title: 'Day 103 — My Kids', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['teaching'], mins: 3, status: 'Published',
    content: [
      `Madrasah was interesting today. Whatever "interesting" means… we will find out.`,
      `I arrived late today, unfortunately. I was literally hopping to the madrasah on the way.`,
      `My kids had already settled in and the principal was taking them through some general stuff. When that happens, you know you are cooked… for the day maybe, but it is not a very good feeling.`,
      `The other class still joined me, and I had company today. We started with "Who said the dua for sleeping yesterday?" but I soon realized they had grown used to this line of questioning and there was so much noise and disorder and chaotic environment vibe today. I tasked them about the dua for rain and if it rained in anybody's vicinity. I got mixed up answers and confusion amidst shouting and laughing etc.`,
      `I began getting agitated so we quickly revised the Hadiths we had learnt, and I asked them to break into the Qur'an groups.`,
      `My colleague (who was with me in class today) helped a lot with the Qur'an session. There was still chaos and I had to let people kneel down and warn some kids several times. At some point, my voice was tired, and I was tired too.`,
      `When we finished the Arabic session, I asked them if they wanted a story… and … I mean… you know their response already.`,
      `They were almost on my skin, they came up so close and were fighting for space just so they could hear me well.`,
      `We discussed the story of prophet Yusuf (Joseph) peace be upon him. When I would get to a part where I could conveniently make into a teachable moment, I gladly did.`,
      `I also used it to sort of revise some of the words they knew (and some they didn't) when we got to the well, I would use the Arabic name for a well. If we got to the dessert and I was explaining the "sand" and dust, we would use the respective terms… and just like last week, we were interrupted by a weird fight today.`,
      `I punished some kids… kinda goes without saying right?
Two of them insulted another person, some were distracting their friends etc etc`,
      `Byeee`
    ] },
  { slug: 'diary-day104-my-kids', title: 'Day 104 — My Kids', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['teaching'], mins: 3, status: 'Published',
    content: [
      `Madrasah was interesting today, interesting in a good way. I arrived at a time that was "okay" I suppose… not too late and not too early either. I quickly settled in and called my kids for assembly.`,
      `I said to them, "Come for assembly" and this little boy asked me, "mu'allimah, assemBLY?" I immediately realized what he was doing. I asked him, "What class are you in at school?" and he said basic 2 or something of the sort. I then asked him (I don't know what I was thinking😂)
"Have you guys done nouns and verbs?"
I continued, "Assembly is a noun, and Assemble is a verb" I am pretty sure he did not understand a thing from what I said, and he just smiled and went to join his class.`,
      `We revised our duas and Hadiths, and we did a little bit of "Do you know why we say the dua for wearing your dress?"`,
      `They quickly broke into their Quran groups afterwards, and they would come group by group to recite to me. As always, I would hear endless "Mu'allimah after them we will recite" but today, that little kid that didn't want to smile at me, came to me and said a version of that… and I was so happy to see him and his expressions.`,
      `During break, I noticed a little boy who bought two bottles of Burkina (the burkina lady came by today). Shortly after that, he ran so fast towards the "football pitch" (which is basically a mowed area around yhe mosque the boys have hijacked) mentioning some guy who appeared to be his brother. When he came out of the pitch, he quickly gave a bottle of the snack to him. I was smiling at the whole act and incident… and I did not know that I was in for a treat.`,
      `After the little boy left, his elder brother had started with his snack, and this little boy went ahead to a place not very far away from the pitch where another little kid who appeared to be his friend was standing. Before my eyes was a beautiful beautiful sight to behold. This kid was sharing the other bottle with his friend. They would literally take turns to drink from the bottle.`,
      `I dont know why he did that… and I do not know the full story, but that kid has planted something within me in terms of admiration and awe for him. He also reminded me of a saying of our prophet peace be upon him which translates to "Exchange of gifts… increases your love for one another"`,
      `Later on, I would find out after asking him that his name is Muhammad and the older boy was actually his elder brother.`,
      `Some kids came to ask for permission to use the washroom, and as usual, they would have had to say the dua for using the washroom so they decided to skip the request altogether and just say the dua.`,
      `One of the main things I am learning from interacting with these kids is the ability to multitask. Someone is reciting in front of me, there is another group removing the threads from the mats to make wristbands from it, and there is another group reporting to me how someone (who is neither of them) was hit at the back of his head by another person.`,
      `I left soon after closing today, and on my way, I saw two of the boys from my class. I mentioned their names and said "Bye bye" to them.`,
      `They were siblings, and I had punished the older one who is very stubborn yet very smart. I could see him hiding his smile… and it just made me laugh.`,
      `These kids…..`,
      `Byee`
    ] },
  { slug: 'diary-day91-jobs-109', title: 'Day 91 — Jobs and Whatever 109', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['entrepreneurship'], mins: 2, status: 'Published',
    content: [
      `Maybe you are so desperate for change. So you become part of the "even if na 3am, wake me up. I will deliver" But maybe you shouldn't be awake at 3am, and if you are, maybe you should not be responding at 3am.`,
      `What I am trying to get at is that you should have working hours. What time is it guaranteed and assured that we could get you if we wanted to reach you? That is what we would want;Assurance. The idea that at a particular time you are working, just like the normal corporate people. All other times, nerh.. You would automate a response message for your clients and prospective clients. That adds to your credibility.`,
      `Also, you do not want to say you are available every time, only to not be found when needed someday. If it every time, it might as well be "anytime I am free". We would not want that. Would we?`,
      `Do not post your goods and services or place them in your catalogue without context or price. You want them to be asking you, "How much?"? A ah.
Imagine replying to 100 questions that are the same. That is not efficient and you know it🌚`,
      `Speak into your business. Say great things about it. Do not say "I am doing some small thing at the side."`,
      `Say, "I am building a structured micro-enterprise"`,
      `Do you remember what we said about affirmations? It is you. *You are THAT girl.*`,
      `You will have blessed money; you will see.`,
      `Byeee`
    ] },
  { slug: 'diary-day92-jobs-110', title: 'Day 92 — Jobs and Whatever 110', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['entrepreneurship'], mins: 3, status: 'Published',
    content: [
      `Wow😂 10 pieces for a single suggestion. Who knew that could happen?`,
      `Know that as you are trying so hard to build your brand and to make something for yourself, you would encounter people who would not believe in what you do.
You would meet people who would make you feel small, and tell you how you are wasting your time… it is what they call *PhD*, pull him/her down. "Ei after spending 4 years in school this is what you are doing?"`,
      `Do not let that get to you. It is *projection*(which is a coping mechanism. Should we write about that?).
Some people do it to feel better about doing nothing… but that would not be your problem to carry. You know your vision, and you see where you are going. Focus.`,
      `Do not go about *announcing* big dreams publicly. Build in silence… then show the results. Show the completed work. What people know, they could destroy. What they do not, they might talk about.. which is nothing you can't handle 🌚
Unless you absolutely need to do that, as in cases where you would need a grant, or some sort of help achieving it, do not.`,
      `Leverage *referral* culture: I mentioned previously that my people from Righteous and rich once mentioned, "If you had one customer, and the only way you would get a customer is through the first customer, how would you treat them?"`,
      `When you treat people well (we would talk about soft skills in detail), you are indirectly hiring people to scale your business for you for free. People mostly do not buy the product just for the sake of it, they buy it because of the people who referred them.`,
      `Your first customer is basically your influencer if you want them to be. They are your most powerful asset, and they could help you and refer you in ways you would never have imagined.`,
      `When people send in reviews, make sure to ask for *PERMISSION* before sharing them… and make sure to share them after gaining permission.`,
      `Lastly, family and friends discount is not such a bad thing in my opinion, but it should be done reasonably… when
- the family member is a continuous customer
- ⁠You can afford the discount
- ⁠they are not always asking for it`,
      `The very last one😂, *Carry your business on your head.* Do whatever you do with all your heart. Give your all in… so that whether it does work out or not, you will have minimal regrets. Do not forget that Allaah(God) helps those who help themselves. Post 100 times a day, 5 billion reviews, another 10 million products, on all platforms. Shame (as in being shy) is a luxury rich people and rich kids can afford.`,
      `Byeee`
    ] },
  { slug: 'diary-day93-walk-left-side', title: 'Day 93 — Walk on the Left Side of the Road', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['random'], mins: 2, status: 'Published',
    content: [
      `Anyone ever told you that? For me yes. In primary school I suppose.`,
      `We were being taught road safety.`,
      `When the man said, "Always walk on the left side of the road", it did not sit well with me. My mom (I was very little) had always told me to do things the "right" way. See what I did there😂?`,
      `Anyways, today I was walking back home from work, and I was on the right side of the road…. then I crossed over to the left side to check out something from a shop.
I eventually ended up walking along the left side.`,
      `Apparently the streets are designed such that when you are walking with your left, you see the cars coming towards you.. so it is relatively safer. When you are walking on the right side of the road rather, the cars come from behind you. So basically you cannot see if a car is approaching so you could adjust accordingly.`,
      `Also, I had heard this before. I just forgot about it… and maybe someone here does not know🌚`,
      `Byeee`
    ] },
  { slug: 'diary-day93-jobs-111', title: 'Day 93 — Jobs and Whatever 111', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['entrepreneurship'], mins: 3, status: 'Published',
    content: [
      `You are working in an already biased system. Why do I say that?
People have received products that were nowhere near what they saw in the pictures. My own *friends and family* have been *deceived* before. It is true and real… which means you've got twice as much work on your plate now.`,
      `How can we know that you would do the actual job for sure? Show people how credible you are.`,
      `- Consistency: Deliver every product or service on time, and show up for your business, consistently. People will be happy to pay even more for a vendor or consultant they know would show up every single time.`,
      `Do not be doing that "Ghanaian time" fa. In the land of Ghanaian time, punctuality is a high-end commodity.`,
      `- Be crystal clear about what is included in your package. Do not sandpaper some parts, or sideline some information. Make sure no part of your ads or content makes vague statements. Smart people might recognize it and not venture at all. Others might not notice, and they would eventually get dissatisfied by your product/service. We don't want that. Would we?`,
      `- Update culture: Do not let your client wait for hours and hours — and finally decide to text you to ask, "is the dress ready?" "Is the app ready?" If you are running late, you might wanna let them know. Respect your client's schedules and their time.
- ⁠Be respectful with the kind of language you use with clients. I know a girl I laugh with and all… but when I go to order something, she quickly switches to formal mode. Once I said to her, "I have paid and you are still not laughing, or in business we don't laugh" She said (you know already) "Yes😂`,
      `Yes the laughing emoji was part.`,
      `Byee`
    ] },
  { slug: 'diary-day94-jobs-112', title: 'Day 94 — Jobs and Whatever 112', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['entrepreneurship', 'conflict'], mins: 2, status: 'Published',
    content: [
      `How do you resolve conflict in your business?`,
      `Earlier we talked about how we could establish our boundaries in a calm manner, in our very early write-ups. Remember?`,
      `I will give you the three step process, *LEA*`,
      `*L- listen.* If the client is frustrated, you might wanna let them vent. Perhaps you took longer than expected, and they were not happy about it. Your phone was off too so you couldn't reach them and they eventually missed the wedding.`,
      `Let them talk and vent (if they are not insulting you).`,
      `*E - explain the situation,* not give excuses. Genuinely explain what had happened and not blame stuff like the weather etc.`,
      `*A - amend the situation.* You might not be able to fix the situation, but there are things you could do.`,
      `Eg. You could give them a discount on the product/service. Get them a little gift. Kind words maybe… and make them feel you are genuinely sorry.`,
      `Treat that business like the high-end company that it is (or at least will be). What would you expect *McDonald's* to do if they missed your order? Or *KFC?* Something like that would be your footprint. It's what they call "branding".`,
      `"I am a small scale business, people should understand, these things happen"`,
      `*Nerh, wrong answer*`,
      `"I am the *COO* for my COMPANY and I am responsible for my *brand* (which definitely includes reliability and punctuality)"`,
      `See you in a minute`
    ] },
  { slug: 'diary-day95-analogy', title: 'Day 95 — Analogy Thingy', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['skills'], mins: 2, status: 'Published',
    content: [
      `Do you know *Lawrence Darmani*? He was my favourite author in JHS. He wrote *Grief child* and a ton of other books.`,
      `He has a poem, *"Scribbler".* In it he says,
*"(To) tell you the truth
The gold adorning the neck
Was once lost in rocky soils
They dig deep who find it"*`,
      `Gold is hard to find. I mean… that's so obvious😂.`,
      `When gold is mined, it looks more like a metal (it is actually a metal, Au); a bit rough maybe, coated with greasy sand maybe… and it has an ugly irregular shape.`,
      `That gold would be somewhat like the skills you have. The *technical skill(s)* you have is the raw gold.`,
      `They take the gold to the refinery, they make the pieces into very beautiful cubes.. and then they further make the cubes into jewelry or ornaments of any sort.`,
      `The refinement is your soft skills.
If I gave you raw gold today, what would be your best course of action? Probably to sell it?
Yeah, I would do that too…`,
      `Eventually the person would send it to be refined. See that?`,
      `Byee`,
      `Are you really British? Because why would you say "picture" instead of "photo"🌚?`
    ] },
  { slug: 'diary-day96-random-random-3', title: 'Day 96 — Random Random', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['Ghana', 'reflection'], mins: 2, status: 'Published',
    content: [
      `I was crossing the road yesterday to wherever, after I closed myself from work yesterday. I had just left the mosque with my unusually heavy bag yesterday (how many yesterdays😭😂) and there were so much cars.`,
      `I stood there for a bit, trying to find a way to get to the other side, when a man riding a bike came to pass and motioned for me to cross over.`,
      `It was such a relief, and it is not the first time someone had helped me like that… and not just me. I see that being done to a lot of people. Maybe it's not that big of a deal, but I think it is such a good thing for people to go out of their way to help in these (relatively small… some would say) ways.`,
      `I thought about the whole thing later and I recalled a conversation I had with my sisters. One of them said something along the lines of "Ghana we are all a big family, and Nana addo (our president at the time, but really just any person who is the president at any given time) is our father.`,
      `She recalled an incident with a troski driver where some school kids went into the troski, only to reach their destination and tell the driver they had no money on them.
The driver just looked at them and told them to go.`,
      `I used to wonder a lot why people would say Ghana was peaceful. Peaceful? I have literally seen a news headline where a high school kid was bullied to death. How's that peaceful?`,
      `Here's what they actually mean when they that. They mean "Ghana is a relatively peaceful country"
There was a country captured on tv where bullets literally were flying around, and people just walked without flinching. Ei`,
      `Byeeee`
    ] },
  { slug: 'diary-day97-random-random-4', title: 'Day 97 — Random Random', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['communication', 'listening'], mins: 3, status: 'Published',
    content: [
      `What would you do if someone was about to tell you a story you had heard before? Or explain a concept you know already to you?`,
      `You would tell them you knew it after they have suffered to explain it? Or maybe cut them midway?`,
      `Maybe you do not.. and maybe just few people have this huge problem.`,
      `I was like that too. I would jump at every opportunity to cut a person off if I knew something.`,
      `My mother sat me down once and said to me, "When someone is explaining something you know already. Keep quiet and listen"`,
      `She would say to me, "They might say it in a different way, or add something you didn't know. Maybe you didn't even hear it properly the first time."`,
      `I wanted to make this a part of me, and it was not easy… like ripping off a bandaid. It was not🌚`,
      `I would have to really control myself and look dumb in most situations, sometimes I would not hear anything new or be wrong necessarily. Others times I would learn I was absolutely wrong and I was headed for ruin (not ruin per se) Some other times I would realize I missed some teeny weeny detail.`,
      `Now that I think of it, that is not the only reason we should give people audience when they are explaining a concept we know already.`,
      `Even the fact that you allow someone show you how they could be of help to you is a great way to build a bond. I remember listening to a "psychologist" or the sort, explaining that if a person wants to be friends with another person in school or at work or wherever, they should consider asking them to teach them anything… and it doesn't matter if you know it or not.`,
      `As we mentioned in the "show you are listening" post, show the shock when they explain a concept that they think is extraordinary or impressive.`,
      `Yh, and do not cut people off when they explain something you already know.`,
      `I know it's all over the place, but yeah😂`,
      `Byee`
    ] },
  { slug: 'diary-day98-pareto', title: 'Day 98 — Pareto Principle', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['productivity'], mins: 3, status: 'Published',
    content: [
      `In the early 90s, there was an Italian economist, *Vilfredo Pareto* who observed that about 80% of wealth and property belonged to about 20% of the population in his country… then he noticed a similar trend in other countries and historical periods… wealth wise.`,
      `Pareto eventually normalised… sorry formalized 😂 the *power law distribution*`,
      `In the statistics almost everyone here knows, the data is distributed around the mean, and most entities are not very far from the average. In power law distribution, the entities are scattered and clustered away from the average.`,
      `Take a look at
- Wealth
- ⁠Best seller books
- ⁠Startup returns
- ⁠Software bugs
It takes a single (or a few set of) metric or parameter(s) to make or break the whole thing.`,
      `When you find the "hacks" like these entrepreneurs say, you seem to be above a huge demographic of people.
The "hacks" are the *high-leverage* tasks. They increase (just like in maths, literally) exponentially.`,
      `You know a *snowball*? If you throw it in snow, you see the way it becomes bigger and bigger and just increases in size from the snow on the ground? Yeahh… a little something like that.`,
      `The Pareto principle is not necessarily strictly by force by fire 80/20. It just shows the disproportion of efforts to results when one understands leverage.
It could be 90/10, 70/30, 95/5 etc..`,
      `Our friends quoted "Eat that frog" and "Goals", so I did an itsy bitsy digging.`,
      `From goals:
How to apply the Pareto principle to your goals
- You write down your goals
- ⁠You would check to see which one would have the greatest positive impact on you and your life in the long run (or short run, but on the overall)
- ⁠Focus disproportionately on it`,
      `See you in a bit, when I bring part two🌚`
    ] },
  { slug: 'diary-day99-pareto-2', title: 'Day 99 — Pareto Principle', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['productivity'], mins: 2, status: 'Published',
    content: [
      `From eat that frog:`,
      `When you set out for the day, (after your salah and adhkaar and Qur'an, if you are Muslim) and you have written your goals for the day, you would realize there are high end tasks and ones that are not so important.`,
      `You want to make the most out of the day, and so you don't wanna spend time doing the trivial tasks… and mostly you do, because you like the feeling of completion.
You know… ticking the boxes and seeing that it's left with small.. and avoiding the boring (which is mostly the high leverage task) task.`,
      `You also measure productivity by outcome. Even if you did not reach your goals for some reason, what did you learn trying to reach it? Did you really do anything or you just pretended to be doing something?`,
      `Attention is a scarce resource… which means we cannot spread it thin. Imagine your brain as a living thing. After working for some time, it would get tired🌚`,
      `- When embarking upon your "high- leverage task", you want to establish very disciplined focus. "Let's get this over with" sort of energy. In a cooler term, you have got to Lock in 🔒`,
      `- It also means the screen times, and the unnecessary peripheral stuff you do, you must reduce them to the bare minimum or abandon it if possible.
- ⁠You would also need to design your environment such that it reduces distractions, this could be by using white noise on headphones etc..`,
      `Yeahhh……`
    ] },
  { slug: 'diary-day100-pareto-3', title: 'Day 100 — Pareto Principle (It Is Not Day 100)', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['productivity', 'career'], mins: 3, status: 'Published',
    content: [
      `It is not Day 100🌚`,
      `"Yh that's cool and all… but how does Pareto principle help me?"`,
      `Sit tight… and let me spill all the teaaaaaa.`,
      `In Career, you would look out for the skills that matter the most in the industry.
- What certifications do they need? (Cybersecurity Ahlaam speaking)
- ⁠What skills are most relevant to get you hired and thriving?
- ⁠What are the most important and most leverage relationships and "self put put"s and strategic "Oversabis" you would need to build and nurture for your career to start and / thrive?
- ⁠What projects would give you more visibility for that promotion.`,
      `We said on *Day 4 (the good old daysss)* that you do not have to fight every battle to win the war.
You do not have to do everything to thrive in your career.`,
      `In school, you do not have to read (it's unrealistic anyway) the whole reference book they have given you for a course you would learn for just a semester.`,
      `I had a study group which later became a family.
One day, one of us said something amidst the heat of cramming last minute😂 "Learn the semester in one minute"`,
      `Our "Lecturer", Mohammed Hanan, would simplify the whole semester for you to go and write the exams.
He was leveraging the Pareto principle. "Which topics are more important?" "Which concepts will appear more?" etc. It worked btw😂`,
      `In entrepreneurship, you would want to focus on:
- The most profitable customer segment. Someone replied earlier to my question saying that "For example, 80% of sales would be generated from 20% of your customers".`,
      `Where are those customers? Find them and focus solely on them. Now your ads, your discounts, your promotions, your designs and everything in between would focus more on them.`,
      `- What is your primary distribution channel? Before you branch out and "expand", think it through. Is this really going to increase revenue or not. It helps you make what these big people call *Calculated risks*`,
      `Lastly, Manage your time.
It is such a hard thing to do, and people go on and on about it… but maybe you would want to try this.`,
      `- List all activities needed to be done
- ⁠Rank them by their importance (and or impact on long term goals).
- ⁠Eliminate or delegate or automate (in order) the bottom 50%
- ⁠Allocate peak energy to the top 10%, (which is usually one task😂 for you and I).`,
      `*Brain Tracy* gives a beautiful analogy of this. He mentions that after writing all your goals. Look at them all, and imagine if you had a magic wand (you would not. This is just symbolism😂) with only one wish, which one would you wish for?`,
      `Now you pick that one task (or goal or whatever) and you write it on a new sheet of paper… and then you write all the steps that would make it happen.. then you follow it by the book`,
      `Byeee`
    ] },
  { slug: 'diary-day82-jobs-101', title: 'Day 82 — Jobs and Whatever 101', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['entrepreneurship', 'career'], mins: 3, status: 'Published',
    content: [
      `We have come a long way as African people. Not long ago, we were being forced to attend school. If you attended school, you would have abandoned your culture and tradition and you would have been a "snitch".
Ever read "Things fall apart"?`,
      `Now, look at us, bagging our degrees one by one.`,
      `That is good, great… and we need knowledge. We also need money😂`,
      `There are very limited jobs as we recalled previously. There is IMF, then there is the population… and there is a bunch of several other factors that contribute to that.`,
      `There is a concept, "Locus of control". What is it with you? What is your game? Does your environment control you… or do you control it?`,
      `We have external and internal Locus of control, and you wanna be that girl with an internal locus of control.`,
      `It is very valid to wait on an employment, and safe too. Not everyone can be an entrepreneur or creative; not everyone is a yellow (or a red who forces their way through everything)
It's just… sometimes it never comes, and what do you do?`,
      `Now whoever you would be waiting on, has complete control of the trajectory of your life. You know why they call them "vacancies"? It is a spot you fill when someone leaves, and thousands of other "special" people like you want to fill that same spot.`,
      `When you decide to become an "entrepreneur", you are solving a problem. You know what that does? It makes you the center. People now come to you for a solution.`,
      `If you are a character at a bus station, would you rather be a passenger or the owner of the troski? The passenger must wait on the troski owner to come move the vehicle. If you have your little bike or car, would you wait?`,
      `This is a little all over the place, but maybe 102, 103 and all the other 100s on the way might be a bit more organized… I suppose?`,
      `Tomorrow, we will discuss what business idea you probably should embark upon, and why it would bring you "milliens"`,
      `Wanna find that out?`,
      `See ya.`
    ] },
  { slug: 'diary-day83-jobs-102', title: 'Day 83 — Jobs and Whatever 102', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['entrepreneurship'], mins: 3, status: 'Published',
    content: [
      `In physics, friction is the force that opposes motion. So if something is sliding across a slope, the force that does not want it to slide down, or at least slows down the slide, is known as friction. This could be a rocky slope, or a sticky slope… or a thousand other types of slopes.`,
      `In behavioral economics, (they basically borrowed the physics term I suppose) friction is anything that makes normal human life harder. If I want to get to a certain place, and there is no direct car to go there, I could say that is friction. If I want to cook rice, and there are just too many stones in the rice, that is friction.`,
      `Entrepreneurs love this term and everything around it. Know why? Because as we discussed previously, every problem is an opportunity to receive a Momo alert. Not that easily of course; one thing leads to another thing which leads to another thing which might lead to a series of other things… but you would eventually receive the alert.`,
      `Let us take our beloved country on the abstract level. We have a lot of market women who are not necessarily literate, or technology-aware. Some of them have very big shops and beautiful products, but they have never ever run an ad in their lives. That is a business opportunity`,
      `Another one is fresh vegetables. Everyone loves to eat fresh vegetables, but some people hate the hustle-bustle of the market… or farm(worse😭😂). Yet they want to eat fresh vegetables. That is another opportunity.`,
      `We discussed friction literally and in light of economics just a while ago. What you want to do as an entrepreneur is to create a "lubricant". A lubricant, in literal terms makes the environment more slippery. So if you have a sticky slope… or a rocky one, as in our example, you want to pour a lubricant over it. It makes it slippery (which as you may know, is sort of the opposite of friction).`,
      `How do you make a lubricant then?`,
      `Ping ping ping…. Suspense😂`,
      `Meet me tonight let us break it.`
    ] },
  { slug: 'diary-day84-jobs-103', title: 'Day 84 — Jobs and Whatever 103', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['entrepreneurship'], mins: 3, status: 'Published',
    content: [
      `You might be thinking bank loan? If it didnt have enough repercussions , I would still not be able to take it because I am Muslim, I do not give or receive interest, but hold that thought.`,
      `You do not need a loan before you hop on your entrepreneurial adventure. Here is what you need;`,
      `1. Who you are and what you know: Who are you? What do people know you with? For instance, people know me with writing, and speaking, and anything editorial.. like secretarial work.`,
      `People also know me with teaching, my computer science stuff, and most importantly, I am attached mostly to our holy book. If I were to start any adventure (which I suppose I have already with the 100 day challenge whether I realized or not), I would consider any of these. What about you? Is it cooking? Is it riding? Is it canva? Figma? Rules of reciting the Qur'an? What?`,
      `2. ⁠Who you know: You have friends, and we talked about friends and why we should make the right ones. You most probably attract people of your kind, which means that is a target market right there.`,
      `You also know people whose leverage you could use. Does your uncle have a shop across from the street? Does your auntie bake? Or your father has an abandoned kiosk? Or you have a friend with gifted hands? (I do, one of them is called Angel).`,
      `You have none of these? You at least have people who view your status…. I suppose?`,
      `Byeee`
    ] },
  { slug: 'diary-day85-jobs-104', title: 'Day 85 — Jobs and Whatever 104', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['entrepreneurship'], mins: 3, status: 'Published',
    content: [
      `Now you have identified a problem, and you have identified your leverage with respect to the problem. What do you use to filter the said idea. Do we just hop on it with all our savings and hope it works?`,
      `There is a saying "Start small. Dream big. Act fast". This is the reason a lot of speakers and writers have modified the "risk" they said we should take with "calculated" making it "calculated risk". It is no longer, "take risks". It is "take calculated risks".`,
      `Here is a filter to pass your idea through before you hop on it.`,
      `1. Is there an existing solution for the problem you have identified? Maybe not? Why? Are you ahead of your time? Or is it simply one of those things we have to handle just because we live on this earth and there is actually no technology to help you achieve that? Or maybe you could actually do it… against all odds?`,
      `If there is a solution, can you improve upon it (we say optimize in computer science language) by even 10%?`,
      `2. If you were to solve the problem for them, would they be willing to pay? You could find this out by simply asking the people whose problems you are meant to solve. If. You want to look more serious (and spend more money also), you print detailed questionnaires and send them out. The most important thing is to find out if they are willing to pay for the service!
"If I do this for you, would you pay me Ghc20 right now for it via Momo?"`,
      `Also, it is not every time you would have "savings" as they call it. Maybe when you save money this week, next week the money saves you😂`,
      `It means when you solve enough problems, you get money you could now call "retained earnings"`,
      `Most times, especially now more than ever, all we need is a smartphone and internet connection. That is about 90% of the overhead.`,
      `Byee`,
      `Remember:`,
      `When you start small, you fail fast, learn fast and then you can move on fast. Do you remember our conversation regarding decisions that are like haircuts? Yeahhh something like that.`,
      `More business ideas:`,
      `If you know basic excel, which you could learn easily online, you could organize the data and expenses for small businesses, at a fee.`,
      `If you know how to cook so well, you could start a food delivery thingy for professionals who are busy and cannot leave from and back to work for food… and their job does not provide free food too.`,
      `If something is surprising, we say, "Holy moly".`
    ] },
  { slug: 'diary-day86-jobs-105', title: 'Day 86 — Jobs and Whatever 105', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['entrepreneurship', 'skills'], mins: 3, status: 'Published',
    content: [
      `What is the best way to make money?
It is to learn a *valuable skill* and then be paid for the service you provide with that skill. I know people say "high income skill". That is right and all. it's just… it is too common to hear that now.`,
      `When you learn the skill, how do people find you and request for your services? That is where sales and marketing comes in. You must market the skills you have. There's *LinkedIn,* and there is a bunch of several platforms where you could share your journey. What random design have you made today? Which data did you voluntarily organize? You took a stunning picture of a product for a small company? Where is it?`,
      `What skills can you learn with your smartphone and internet?
- Copywriting: This is where you write front pages, product descriptions and everything in between for tech startups and real estate businesses. There are tons of tutorials on the world's biggest school, *YouTube.*
- ⁠Data analysis: You learn to use excel (you might need a laptop for this one) to analyze data for businesses. You form statistics, trends, foresights etc.
- ⁠UI/UX: This is where you design (very similar to the graphic design you know) web and mobile applications, and how they feel to navigate and operate by users, before they are built.`,
      `There are several other skills to learn, potentially for free by being an apprentice.`,
      `- Solar panel installations, or things that have to do with farming or reuse ♻️
- ⁠Dress-making, catering etc`,
      `Try greeting a professional nicely and requesting to help them.`,
      `"What if they insult me?"
Well, what if they don't?`,
      `You might be thinking, "How much bundle to learn all of this?"
Well, there is *midnight bundle,* remember? You could sleep early, wake up and download those YouTube courses…then you could use them during the day.
See? Easy peasy, lemon squeezy.`,
      `If you want a course too, *Coursera* and friends would be happy to host you. They have financial aid options you could apply for. There is also an organization, *ITexperience* that pays for most of those courses for students. You should check it out.`,
      `See you in a minute.`
    ] },
  { slug: 'diary-day87-jobs-106', title: 'Day 87 — Jobs and Whatever 106', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['entrepreneurship', 'portfolio'], mins: 3, status: 'Published',
    content: [
      `Write-up's getting too long.. so now we have got two days in a day. But hey, what's the harm?`,
      `You have finished the course; you have learnt the skill.`,
      `"Where is the money?"
"A ah, wait na"`,
      `Do you have a portfolio? Do you even know what that is?`,
      `A portfolio is a formal compilation of your professional work. It is very organized and mostly detailed. It details the process.`,
      `If you are a product photographer, you might have the pictures.. but also perhaps (see how I used perhaps instead of maybe? Yh, very British) lightning (or how do they say it?) and positioning etc.`,
      `If it is UI/UX, you could have your product research, user research, wireframes etc (including your messy notes) in addition to the design itself.`,
      `You mostly need at least three projects. This is what you show to the people who would request for your service(s). I mean… how else would they know you could actually do it?`,
      `You could also do the good Oversabi and request to work for businesses for free. You could use information online to create content for a small business.`,
      `"Ma, good morning. My name is cdnxbdhd. I am a UI/UX designer. I noticed your business does not have a website so I designed one for you. I also took very nice pictures of your products. I would love to do a free social media presence project for you if you do not mind."`,
      `Something like that.`,
      `Remember: You will be terrible for your first attempt at anything. But you cannot get to your 100th without your first. Scroll up the channel, and see my early write-ups. You would see clearly, what I mean. Also, according to I don't know who, you must push through your first terrible 100 hours. Most people do not, which brings us to discipline.`,
      `Let's make that another post. This is getting long.`,
      `Sit tight.`
    ] },
  { slug: 'diary-day88-jobs-107', title: 'Day 88 — Jobs and Whatever 107', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['entrepreneurship', 'discipline'], mins: 3, status: 'Published',
    content: [
      `You are making a conscious decision to change your life, and that is without structure. By structure, I mean without the typical university system of grading and class and attendance and reprimand that keeps you in check. You will need two things. (Apart from your phone and internet).`,
      `1. Discipline: There is nothing binding you except your peculiar reason and passion. That is one of the hardest things to do in life.. especially if you are a yellow.
You could write your reason boldly and legibly on a paper and paste in it your room or study area or wherever. Make it your screensaver or something.
Get a timetable if you must. I don't know if those work😭😂.`,
      `Eventually, motivation runs out.. because it is a limited resource. Rings a bell? You would need the passion and your ability to tear away from that bed…which is very hard by the way.`,
      `2. You would also need a mentor/coach. A mentor is someone who is where you are (in terms of a particular thing), and one whom you ask for advice from, every now and then.`,
      `A coach is on the other hand, sort of your shadow. They are actively present in your journey. They might be the ones recommending courses etc. They are also the ones you would go to if you have setbacks in your normal daily learning.`,
      `Side note: I heard this explanation from *Vusi Thembekwayo*`,
      `Remember: watching someone bake, does not make you a baker.`,
      `Byeeee`,
      `If something is easy to do, we say it is "easy peasy, lemon squeezy".`
    ] },
  { slug: 'diary-day89-jobs-108', title: 'Day 89 — Jobs and Whatever 108', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['entrepreneurship', 'branding'], mins: 3, status: 'Published',
    content: [
      `It is all about your *aura* and "brand" as a business person today.`,
      `Professionalism is a big thing in our work markets. People would love to know that they are dealing with someone they could trust. You know… someone who knows what they are about.`,
      `First things first; the most common way of transferring e-money is through *Mtn Mobile Money*`,
      `You probably have that service already. Do *not* use your personal phone number to receive payments for your goods/services. That is a like volunteering to cook yourself. What you want to do is to get a *merchant ID* Why? It does two things.`,
      `- It shows professionalism. People would feel that they are paying momey to a business and not some person. When you go to the supermarket to buy stuff and you want to pay through Momo, You would notice that they do not read out a number to you. They have the merchant ID or better.
- ⁠You have a very organized audit trail. The merchant ID organizes your expenses more efficiently than the normal mobile money. This would come in handy if you ever need proof of your spendings and investments for a grant, an investment.. or whatever it is.`,
      `Pay yourself a salary. You are trying to build up an important thing, and that cannot happen if you do not put in checks and balances. You must make sure you do not overspend and squander momey just because it is your business.`,
      `Utilize WhatsApp business. One of the biggest free CRM (Customer relationship management) tool is the WhatsApp business. It has a *catalog* feature where you could list up your items *with their respective* labels.`,
      `It has a quick reply feature where you could automate routine questions and concerns.`,
      `Some common requests like *merchant ID, Account details* and *Frequently asked questions (FAQ)s* do not have to be responded to, repeatedly by you.`,
      `Byee`
    ] },
  { slug: 'diary-day90-not-day-90', title: 'Day 90 — (Not Day 90)', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['teaching'], mins: 2, status: 'Published',
    content: [
      `MQI has reopened, which means I would not be late to madrasah anymore. When we close from the big boys and girls section, we just climb right down to the kids section.`,
      `We have finished all our exams… except for a few students who were absent because they were sick or something. It took me the maximum pitch of sound I could make for these kids to keep quiet, so that their friends would write the exams in peace.`,
      `Later on, I asked the girl I perceive to be the oldest to facilitate a quiz session.
It was between the girls and boys. Early on, the boys were leading, and of course I was supporting the boys; the girls in my class are cocky😂`,
      `I don't know what happened, but the girls won. Meanwhile the girls were way way behind.`,
      `The girls would say to me later on that day, "Maalama you are a girl and you are supporting boys"`,
      `You don't wanna know what I said to them😂 I said "I cannot support whoever I want?"`,
      `This was Saturday…`,
      `Sunday in transit.`
    ] },
  { slug: 'diary-day90-my-kids', title: 'Day 90 — My Kids', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['teaching'], mins: 3, status: 'Published',
    content: [
      `Sunday was not very different. I climbed down after MQI. My kids had started coming around. Some of the facilitators were running late so the kids had to join my class.`,
      `I wanted to talk to them about something fun, so I asked them what we should do. Most of the kids shouted "Maalama story" into my ears.`,
      `I had started the story of our holy prophet the day before so I kinda had to continue that. But we talked about several different stuff, eventually.`,
      `For instance, my colleague brought the robes of some kids from the previous day. As you may imagine, they were very dirty. So I decided to explain the first verses of a certain chapter, "mudaththir" where Allaah(God) is telling the prophet, among other things, to keep his *garments neat and clean.*`,
      `I made it very dramatic and lively, as I should, because they are kids. I had a wedding to attend so I had white in my dress. I said to them, "You see my dress?
White🥼🤍 I don't want anything to touch it."`,
      `If I heard anyone insulting another person too, I would explain to them why they shouldn't… and probably follow it up with a story.`,
      `I recall saying to them, "Have you ever heard me say 'Stupid' or 'foolish' in this class before?"`,
      `I then added, "Me I don't talk like that o, I have class. I can not say that. Ei, why would I say that?"`,
      `I tried my hardest to be attentive towards everyone of the kids… until I realized I would not be able to finish anything if I kept listening to the gibberish. Some of the older kids got more and more furious anytime I paused to listen to the younger ones say things that mostly made no sense.`,
      `Pretty much what happened`,
      `Byee`
    ] },
  { slug: 'diary-day71-boundaries-2-raw', title: 'Day 71 — Boundaries Part 2', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['boundaries'], mins: 3, status: 'Published',
    content: [
      `Boundaries and learning to choose yourself or something like that.. as per your request.`,
      `I have written previously on boundaries and how they are set.
What we must take note of though is "Who is asking?"`,
      `Is it a "nice" innocent person who has had to see the world through the lenses of "we cannot annoy people" and "we need to fit in" ?
Or is it some manipulative person who wants to justify their irresponsibility?
Or maybe it is someone somewhere within the spectrum.
There is a range.. there is almost always a range.`,
      `What we assume when we speak of these things is that the person is that girl or guy who finds it so hard to establish boundaries.
Let's start with you.`,
      `First of all, do not make your boundary or self care or your decline of a request about the person, make it about you.
For example, you do not say, "You are always doing this" you could say "I want to prioritize myself this time" or if you do not want Africans to come at you, you say
"I am sorry, I have to decline this, I have to rest"`,
      `Also, when you say "no", resist the urge to explain yourself. Be comfortable with the silence that comes with it.`,
      `When you establish a boundary, You must follow through with it, consistently. If you do not, you are giving people a "go-ahead" to push as much as they can — until they break the limits.`,
      `When manipulative people want to get the best of you by riling you up or in genZ term, rage-baiting you to feel bad about your decisions — try as hard as you can not to give an emotional response… Maintain composure.`,
      `Do not forget to be polite with stuff like that. Say "Thank you for considering me. Unfortunately…."`,
      `Avoid using "but" as much as you can. It has a way of cancelling all good things said before it. Replace with "and" where applicable.`,
      `I saw something on LinkedIn that cracked me up.
"Yes I have no schedule then but I am going to use that time to rest"😭😂`,
      `The second category of people are irresponsible and they want to use "i am taking care of myself" to cover up manipulation.`,
      `Maybe one day we could write about it. How about that?`,
      `See ya.`
    ] },
  { slug: 'diary-day72-random', title: 'Day 72 — Random', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['journaling'], mins: 2, status: 'Published',
    content: [
      `Nothing particularly interesting happened today, and I didn't get to reflect on any quote so I might sound lame.. or I might sound surprisingly interesting.`,
      `I saw a post some time ago.
It said, "I am into writing short fiction, mainly to do lists"
It is just funny how audacious we are, and we feel so energetic.. and then we write these bunch of stuff.. only to end up doing about half of it.`,
      `Do you journal?
Because you should.`,
      `The pen is one of the best things we have been privileged with. As a Muslim, I believe so much in the power of the pen. In fact a whole chapter of our holy book was named 'The pen' literally. That is just mind blowing.`,
      `As a girlie who has her girlies' back, I am advising you to go to the shop first thing tomorrow and get yourself a pink book, then you can pour glitter all over it and let's get going🥰`,
      `Write all the things you need to do the next day.
Then you can write any other thing.
Gather your thoughts, and make them clear — and then clear your mind.`,
      `Maybe you could come and thank me later, or maybe not.`,
      `I truly do not have much to say but it is enough to hold up.`,
      `"The one who taught man with pen.
He taught man what he knew not"`,
      `Byee`
    ] },
  { slug: 'diary-day73-random-random', title: 'Day 73 — Random Random', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['reflection', 'humor'], mins: 2, status: 'Published',
    content: [
      `Yhyh a lot happened today.
I was with my sister at the mosque for zuhr (midday) prayers.`,
      `Afterwards we went to get a snack at the cafeteria.`,
      `That is where we met with a lady doing her assignment at the cafeteria and we were shocked. We said hi to her and relayed to her how shocked we were that she was there in all that eating and shouting and drinking and walking, and still able to do her work. We teased her a little bit with "brilla" and then we were off.`,
      `As we were walking back from the mosque — me back to work and her (my sister) back to the college library, there was literally a car speeding off the road and this lady said, "Let us go, I do not have enough time to waste. We could have passed."`,
      `I was looking at her until I just burst out laughing
She had told me all about her time-consciousness resolutions… but I did not know it would be this serious. She was literally trying to "jam" a car.`,
      `Even as I type this, it is still so funny😭😂`,
      `Later on, I closed from work, came to the masjid (mosque) to pray, and met a lady, Sakeenah who happens to be part of this community (we are a community right?)`,
      `I am so tired… so bye`
    ] },
  { slug: 'diary-day74-random-random-2', title: 'Day 74 — Random Random', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['teaching'], mins: 2, status: 'Published',
    content: [
      `Tomorrow my kids would be writing their exams, and that sounds kinda fun.. maybe.`,
      `I spent the whole of Thursday setting up their questions.
I am confident in their ability to answer the questions well.`,
      `Nothing particularly interesting happened today. I went to work, and shuttles work now so it's a lot easier to move around.`,
      `Tomorrow I will bring you a story from madrasah, in sha Allaah.
In sha Allah means if God wills.`,
      `In the meantime, remember to mind your business, drink a lot of water.. and journal!`,
      `I have been giving a new podcast suggestion.. and I would be there. Tomorrow I might tell you how that goes.`,
      `Yh
Bye..`
    ] },
  { slug: 'diary-day75-networking', title: 'Day 75 — Networking 101', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['friendship'], mins: 3, status: 'Published',
    content: [
      `When I was little, there was a quote my headmaster loved so much. He would always say to us, "Show me your friend and I will tell you who you are"
Sometime later he changed it to "Show me your friend and I will tell you your character"`,
      `I think it is a renowned quote or something, but every now and then, I hear different versions of it from different people.
The actual quote may not matter too much… perhaps.`,
      `I am very proud of my friends, and they know…not pride in the sense of "Yes, I pulled that off" but I take joy in the kind of friends I have.`,
      `I did not just get them out of the blue. Some of them were from me doing "self put put".`,
      `I did not necessarily try to shove myself down their throat, well… maybe a few times I tried that. It was mostly just getting myself in environments that would facilitate such friendships.`,
      `For instance, I would always try and sit by one lady in Arabic class because I saw she was very attentive and smart, and she was not a show off… and she was calm and collected etc.. by force by fire, she eventually became my friend.`,
      `My point is sometimes friendships are organic and that is how you get just any friend. You might be lucky, and you might also be unlucky. These things just like any other thing in your life MUST be intentional. If you see a person you wish to be like, or would love to sort of… have that kind of energy around, go for it.. and do not look back.
Of course sometimes it might work, sometimes it might not work. Sometimes you would be so hurt… but this is your life we are talking about.`,
      `Your friends are literally, without exaggerating, a mirror of who you are. You probably know this, but a little reminder does not hurt now, does it?`,
      `"A good friend is like a perfume seller, whenever you are in his company, his perfume causes you to smell nice. A bad friend is like a blacksmith (with all due respect to blacksmiths), whenever you are in his company, you smell of metal and smoke, and you might even have holes in your dress when you leave his presence"`,
      `See you tomorrow?`
    ] },
  { slug: 'diary-day76-absence', title: 'Day 76 — "Absence Makes the Heart Grow Fonder"', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['psychology'], mins: 4, status: 'Published',
    content: [
      `Absence makes the heart grow fonder. How's that?`,
      `Ever heard of that statement?`,
      `I once overheard a man whose name I will not mention because I want peace to reign say "Scarcity and value are the same thing"`,
      `He said it so fast and casually while he was blabbering a lot of things that it made me think "So this man doesn't even think that this is not common knowledge?"`,
      `Why is that the case?
Since man was brought on earth, "resources" have been scarce, food, shelter, safety etc… All these things are not available in abundance. Other things slowly became scarce; for example finding a suitable mate, or even very common things like land for farming etc. whoever prioritized these scarce resources survived… more times, thrived.
Man has since then, attributed scarcity with valuable things.`,
      `From a contemporary angle, people love the "forbidden" or "unreachable". This is why people love and die for clothes or foods or general products that are "limited edition".
If for example, I try so hard to gatekeep a certain piece of information on my laptop and I put passwords on it and the text itself is encrypted and whatnot, you would naturally be so curious to find out what it is… and when you do, you would be inclined to the idea that it is the true… and valuable. It is also why people grow more obsession over people they are pursuing when they say no.`,
      `Scarcity also seems to come off as impending loss. People love to "avoid loss" first before they think of gaining. "That shirt is limited, I need to get it before any other person does" Meanwhile the shirt is as normal as any shirt; suddenly it has value.. because you stand a chance of "losing" it.`,
      `This is why time and money and even gold, partly, are valuable. They are scarce. Imagine if we had infinite time, we wouldn't have to actually do anything… just sit. There would always be time, and the concept of choice might just fade into thin air. "Why do I have to choose a career when I can do all?
Okay I can choose which career to pursue now. I do not need to get married or finish college or even learn any skill. I can always do that anytime." "Time" as a name and concept probably would not even exist.`,
      `In humans, we see this in people who want to add "value" to themselves… sometimes wrongly.
They are mostly quiet; which makes their words have more meaning and weight. They are not always everywhere… which makes their presence tangible.`,
      `When people do this, they induce *idealization* in the brains of the individuals around them. Idealization would be to fill the void with imagination.
"I wonder what he is thinking being quiet like that" "I wonder where she is right now"`,
      `People fill their minds with all sorts of imaginations… and as you might guess, only increases the value of the former… they basically become mysterious. Who doesn't want that?`,
      `Over avoidance causes resentment and hate towards the avoidant person. According to I don't-know-who there must be a balance.`,
      `Also, familiarity does not always mean less value. Sometimes it builds safety, trust..and depth.`,
      `Byeee`
    ] },
  { slug: 'diary-day77-first-impressions-raw', title: 'Day 77 — "First Impressions Last"', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['cognitive bias', 'communication'], mins: 3, status: 'Published',
    content: [
      `Another one… yes. You guys voted for more quotes so..😂`,
      `Now before we jump right in, there is a concept called "anchor heuristics" and in simple terms it is the brain registering the first piece of information it receives as its truth. From then, every other information or "fact" is relative to that first information.`,
      `As usual I would give an example, if I came to you and said that I am selling a product for say.. 10 dollars, then I knock it down to maybe 5 dollars. What would you think? Good deal right? Yhyh. It may have been that the actual value of the product is 3 dollars, but because I mentioned a ridiculously high price and knocked it down, it is cheap… to you.`,
      `Then there is confirmation bias, that is what happens after we encounter a person or a situation for a first time. If the first time I met you, you were very rude to me… every time I see you, my brain automatically notices and highlights anything rude you would do to me. Unless you flip and become so unhealthily nice towards me, my brain sees you as that same person. That is confirmation bias.`,
      `Often times, perceptions shift with time, but they rarely, if ever, reach objectivity.`,
      `When we meet a person for a first time, the "first impressions" are often formed with alarming speed — in milliseconds.`,
      `When you encounter an individual, your amygdala and prefrontal cortex (I feel very smart saying this) collaborate to assess threat, trustworthiness, competence and dominance, which includes your physical apprearance… and as you might guess, this supposedly has roots… when the earliest people would encounter new faces, they did not have time to be objective and meticulous and "take their time". They needed to find a way as fast as possible to asssess the individual. Would they be a friend? Foe? Enemy? Potential partner?`,
      `Most of the time, confirmation bias sets in and people eventually just validate their initial ideas of you. If you want to change a first impression… well good luck😂😭`,
      `Also, a lot of people believe "it is safer to wrongly mistrust someone than to wrongly trust them"`,
      `Byeee`
    ] },
  { slug: 'diary-day78-my-kids-2', title: 'Day 78 — My Kids', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['teaching'], mins: 3, status: 'Published',
    content: [
      `Hey, How is everyone?`,
      `It has been a while…`,
      `Today my kids wrote their last paper at madrasah.
It was Arabic language. It basically had names of living and non-living things around us that start with some letters (which we have covered in class) of the Arabic language.`,
      `Yesterday, I also had a beautiful bonding hour seasion as a guest, at our Islamic center where I met Mariam, a sweet first year Computer science student who happens to be family… our family right here❤️`,
      `There was a bunch of continuing students all over the place (which is not particularly my Favourite setting) and then I had to arrange my kids and prepare them for the exams.`,
      `Somewhere within everything, I had to monitor three classes — my class included, we were running short. Now I assigned some of the "big" boys who had finished writing to look after those still writing.`,
      `I received a complaint from a male "invigilator" that a girl had called him "stupid boy" after he reported her to me for talking. She had been made to stand at that point.
It is a known rule for all the kids in my class that no one, including the teacher, insults anyone. If you were to be brought before me (I feel so powerful saying this😂) you would be caned. Everything else we could settle with smiles and "do you want to forgive him?" and "Do you remember Hadith number 8" etc. When you insult someone, nerh.`,
      `I would cane this girl… I actually did cane her because she admitted to calling him stupid.
Later on, I found her still crying, only to call her forth and realize she had a whole history with that boy.`,
      `This girl's elder sister and her friend had beaten the said boy, who in turn.. vowed to make sure she gets a beating at madrasah today. The whole thing was a setup…and the poor girl from my class walked right into it.`,
      `I said to her, "I am sorry okay? I will never let him watch over you guys again. As for you, you walked right into it. If it was me, he would never get me"`,
      `That is how we should roll in reality. Do the right thing every single time… and people want to see you down? Do not give them that joy!`,
      `Later on, there was a little boy who wanted to ask me where to place the mat for their midday prayer, and when his friend relayed it to me… he covered his face with his cloak (He was shy if you didn't understand my boring story😭😂)`,
      `Byeee`
    ] },
  { slug: 'diary-day79-hats-haircuts-tattoos', title: 'Day 79 — Hats, Haircuts, and Tattoos', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['decision-making'], mins: 3, status: 'Published',
    content: [
      `Weird title huh? Someone would see ChatGPT written all over the title. Just sit tight..and I will tell you all about it.`,
      `It is from James clear… rings a bell?`,
      `Yh, he is the author of the hyped book (and rightly so), "Atomic habits".`,
      `He mentions this with regards to our choices. His host went on an on about how people would take a very long time to reach a decision. He made an example with a CEO and his son who was supposedly a CEO also, but in lieu of his father.`,
      `The father would take months literally, to reach a decision (reminds you of which colors?) but his son would pause a speaker midway through their idea and order his team to embark upon it.`,
      `Now, James clear obviously is the GOAT when it comes to these things. He mentioned that *choices* in life may take three forms. The hat form, the haircut form and the tattoo form.`,
      `Some decisions are just like hats… in terms of the speed with which you could make and reverse them. Just like putting on a hat; you just drape it on. If it doesn't fit, you put it back real fast and change another one.`,
      `The second kind of choice or decision you would need to make is like a haircut. When you get a haircut, you would not necessarily be able to reverse that as fast. You might have to wait a month or two… but a month or two comes eventually. He mentions that this is the type of choice dilemma most humans encounter; the kind you cannot immediately reverse… the kind that might take a minute to reverse. We tend to hesitate to make decisions that are in the end, haircuts.`,
      `The last type of choice or decisions you would make, might be a tattoo kind of decision. As you may know, unless you love pain and you take joy in your body being cut and probed, you cannot reverse a tattoo. These are the decisions that live as long as you, sometimes longer.`,
      `Make this your scale or your filter for decisions you want to make. Is it a haircut? I will let you in on it, it almost always is. Just do not be overly optimistic and force a "tattoo" into a haircut. As for a hat, I guess you could spot that miles away.`,
      `Good night?`
    ] },
  { slug: 'diary-day80-opportunity', title: 'Day 80 — "Opportunity Is Always There"', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['career'], mins: 2, status: 'Published',
    content: [
      `If I came to you with a free pass for entry into the top football league in the world, the English premier league and I said to you,"This is all yours. It is a rare opportunity and you get to join the league as a west african kid."
Would you be able to join it?`,
      `Probably not? Is it not an opportunity? Is that not what we all lament about everyday?`,
      `Exactly, the point I am trying to bring back home is… opportunity is always there, available and waiting to be claimed, but you have to be prepared for it.`,
      `The quote "Opportunity is always there, you have to be prepared for it" is not my genius thinking, sadly😂
I heard it from a yet another conversation I had with my engineer friend.`,
      `What do you want? What is your dream profession? If a person came to you with an opportunity, would you be able to at least hold your ground?`,
      `We know about the unending gripe regarding "there are no jobs". Maybe there really aren't… and maybe we do not get the chance to even show that we could hold our ground. Maybe also, we just do not meet the requirements to be given the opportunity in the first place.`,
      `This same lady would tell me sometime back that "you must be competent and be confident"`,
      `They say "Be so good you cannot be ignored"`,
      `Have a great day`,
      `Byeeee`
    ] },
  { slug: 'diary-day81-story-time', title: 'Day 81 — Story Time', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['business', 'loyalty'], mins: 2, status: 'Published',
    content: [
      `There is this woman I buy porridge from with my sister. It just happened that now it had to be more and more frequent. The first time we went, we were speaking our local dialect… only to find out that she was from our place as well.`,
      `This woman treated us so well, she even gave us more than we bought. She then said to us in our local dialect, something along the lines of "Let us meet tomorrow"`,
      `Now, we felt obliged to go back. First because she was generous and second, she was very courteous.`,
      `I cannot remember if we went back or not, the next day. I am just like most people, we wouldn't want to have the same thing every morning… but we went back eventually. Every time we went back, she would say the same thing, and be generous to us.`,
      `I would think this has no particular effect on me. I like to think I go there to buy the porridge when it is convinient.`,
      `Today, I was late for work, and I was hungry too. Long story you do not want to hear. Anyway, I saw several porridge stands on my way to work. As you might guess, I walked right up until I got to the woman — our woman, and I bought from her.`,
      `What am I saying? I do not know too, but what I was trying to get at is a quote I heard from my people, "If you had one customer, and the only way you were to get another customer was through the first person's review or perhaps referral, how would you treat that customer?"`,
      `Byee`
    ] },
  { slug: 'diary-day51-girly-stuff', title: 'Day 51 — The Girly Stuff I Do Not Write', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['self-improvement'], mins: 4, status: 'Published',
    content: [
      `Since you said I do not write girly stuff, here's one for you — actually for us.`,
      `I found some plenty writings on TikTok on how to be "That girl" and imma share them with you.`,
      `We are almost ending the year… and you might be well tempted to believe or internalize "Next year, I'd be a changed person" Here's what someone said to me, "Do not waiti for 2026, let 2026 wait for you"`,
      `The whole point of this exercise is to get us grounded and confident — and capable of thinking we could do anything — with sincere efforts and supplications.`,
      `Try it with me, because I would also be starting it before the new year.`,
      `Get a fresh piece of journal, not your phone!!!. Make it more flashy if you must, like a pink book with a pink highlighter with a pink pen.. or quill😭😂.`,
      `First you study yourself:
- learn your patterns
- Track your moods
- ⁠Study what triggers you
- ⁠Journal your thoughts daily
- ⁠Define your core values
- ⁠Observe how you handle silence
- ⁠Build awareness before change
- ⁠Discover yourself: what do you look good in, what do you not look good in, what color combinations work, which ones do not, your skin tone etc..
- ⁠what are your Favourites: food drink, reciter, activity etc
- ⁠what are your turn offs in people, and what are your green lights in people.`,
      `Second you study yourself emotions:
- feel before you react
- ⁠name your emotions clearly, were you angry or ashamed?
- ⁠respond, do not perform
- ⁠practice patience and delayed gratification
- ⁠accept it when you're wrong
- ⁠Release control and the desire to control
- ⁠apologize without strings or ego
- ⁠Read, read a lot of books on the subject`,
      `Then you build discipline, my Favourite (sniffs from distance….)`,
      `- Create daily systems
- ⁠Set time blocks
- ⁠Stick to routines
- ⁠Do hard things calmly
- ⁠Prioritize consistency
- ⁠Rest without guilt (oh you bet)
- ⁠Keep promises to yourself`,
      `Then you proceed to
- move with intention
- ⁠Speak less‼️, mean more
- ⁠Keep your environment neat❤️
- ⁠Maintain self care rituals
- ⁠Dress thoughtfully
- ⁠Carry quiet and soft confidence (No Oversabi or shouting or over explaining or forcing big English)
Then you define your "why"
- ⁠Write your personal mission
- ⁠Build habits that point to your purpose
- ⁠Pursue meaningful goals
- ⁠Be a student of wisdom and wise people
- ⁠Align your choices with your values`,
      `Let's do this guys….
We can`,
      `Byee….`
    ] },
  { slug: 'diary-day52-dots', title: 'Day 52 — ......', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['teaching', 'work'], mins: 2, status: 'Published',
    content: [
      `I will tell you what happened at madrasah today.`,
      `I didn't get enough sleep for whatever reason, the previous day — and when I got to madrasah today, my class had already been arranged for me — and when that happens, it means mostly that you might be cooked😂`,
      `Anyway I was sleepy the whole time, everyone kept asking me, "Are you sick?" To some, I'd say no , to others, I'd explain how I didn't get enough sleep.`,
      `After we had led the kids for prayer and whatnot, I went upstairs — like most of the teachers, to pray. I had just finished my prayer and was about to exit the premises when my boss called me. After a conversation about a whole different thing together, she said to me, "I see that you do not look very active today. Is there a problem?"`,
      `"No, maalama, I just did not get enough sleep."`,
      `"Why did you not get enough sleep?"`,
      `"I was catching up some computer science stuff on my laptop"`,
      `"Why not do that at a more convenient time?"`,
      `"We have started National Service, and I didn't get time the whole week during the day so I had to do in the night"`,
      `"Okay, this is life, unfortunately. You work yourself up now to rest later. Else there'd be too much later. Look at me, I have worked but even now, I still am. Just brace yourself, and you'd be fine."`,
      `"Thank you maalama"`,
      `Yhyh that was it…`,
      `Byeee`
    ] },
  { slug: 'diary-day53-do-not-tell-anyone', title: 'Day 53 — "Do Not Tell Anyone"', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['reflection'], mins: 2, status: 'Published',
    content: [
      `"Do not tell anyone". Do you say this? Or you hear people say this?`,
      `Well.. this is what a lot of folks say when they tell someone what they believe is a secret. People say this all the time and I just laugh in my head…lots and lots of experiences have taught me to know better.`,
      `I am just here to tell you the blunt truth, and I wish I could be smug about it, or sound so self aware… but you might have been a victim.. or I might have been a victim… or none of us ever, was a victim — you just need to know that unless you can, and you must — do yourself a favour and keep that little secret to yourself.`,
      `Whoever you are telling might do you a favour and keep it, but before then — they would tell their friend and relay it to them, "Do not tell anyone" 😂`,
      `"Your best friend has another best friend"`,
      `There's another one, "If you do not want anyone knowing about it, do not let anyone know about it"`,
      `You know what someone told me that made me think long and hard?`,
      `"Before you go and type anything, imagine how it would look like in a screenshot"`,
      `Do not get me wrong, Seek help if you need it — and from the right source — and learn to trust some people. You cannot go through life trusting "no one" as they say in certain literature — but just be careful, it doesn't hurt to know that there is a creepy squeaky spooky cringey side to being a human — and that is what I just showed you.`,
      `Byee`
    ] },
  { slug: 'diary-day54-commitment-raw', title: 'Day 54 — Commitment', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['persuasion', 'communication'], mins: 2, status: 'Published',
    content: [
      `It's just interesting what I heard… or should I say read about today and since I want to be a good communicator, I would start with a story/analogy.`,
      `If in the unlikely case,😂 I came to you holding a petition for… whatever and I asked you to sign for it (is there supposed to be a "for" before the it or we just remove it?) and you did, how comfortable I would be, asking you to come with me for a related meeting would be increased. How willing you would also be — to come with me to the meeting would also be high.`,
      `It's not rocket science or some genius thing. It is apparently one of man's "natural nature" — and apparently, (again) people use it to persuade others in business, social settings etc. They would bring you a much lesser offer and one you'd be more likely to agree to, and then they could use that as a door.`,
      `But let's look deeper as I always like to. Forget about persuasion and people bringing you petitions to sign. How we carry ourselves apparently (third time) including what we say or wear or watch or hear has an impact on how people see us and what they think we might accommodate. You ever hear someone say, "How insulting!" or any of its variants when someone suggests something to them? That was what was in play there.`,
      `Not much but enough to hold up…`,
      `Byeee`
    ] },
  { slug: 'diary-day55-hmm', title: 'Day 55 — Hmm', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['reflection', 'humor'], mins: 2, status: 'Published',
    content: [
      `I know we can get a little serious in here, and some of my audience love the seriousness and whatnot but you know… Let's talk about a serious thing in a relaxed way.`,
      `"Well that'd be a first, because you are always so serious Ahlaam"`,
      `Seriously people — learn sarcasm and wit, it's so fun in this side of the world…`,
      `Anyway, as you may know, the Righteous and rich podcast guys — whom I happen to not visit in a long while — rubbed off their seriousness on me and I decided to be serious… It didn't take long until NSS came to spoil all the fun.
So as "wise" as I was, I decided to "push" most of my "work" for during the end of year break.`,
      `Which would be great except for the fact that my PC would get spoilt. Tell me why since last week this PC I have been using since … switched up and started glitching and freezing. You will be seriously looking at your screen and it would just freeze. I now decided that I would take matters into my hands to see what was wrong.😭 I had two OSes now I am lucky to use a complicated method to access my windows — which could grace me for a few minutes and go off again.`,
      `Instead of "binge-learning" as I called it, I am here o, turning my pc on and off would be like half of my experience with this PC at this moment.`,
      `So the lesson probably would be to not leave things last minute? But thats cliche and I mean… who doesn't know that?`,
      `"Remove this mic let me cry first😭"`,
      `See you tomorrow`
    ] },
  { slug: 'diary-day56-comparison', title: 'Day 56 — Comparison Is the Thief of Joy', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['reflection'], mins: 3, status: 'Published',
    content: [
      `"Comparison is the thief of joy", thats how they say it huh?`,
      `It's one of the most important principles of life, it is even well included in most "self help" books, therapy sessions, healthy lifestyle coaching techniques etc.`,
      `It essentially means that a person should not be distracted by how "far" another person is or has come to the point where they forget their own progress or blessings or effort and become mostly unproductive. (Does that make sense😭😂?)`,
      `Which is great, good good lesson it was…. for me to memorize and not know how exactly it came to play in real life — I knew a little something about not comparing my life to other people's — which is a very hard thing to not do, considering our natural disposition as social animals… (animals? ) but yeah well.`,
      `There was this one time I was trying to "advise" (surprise surprise) a girl I really admire. After saying the thing in the least hurtful way possible (for me) guess what I added, "You know.. be like kskdjcxjsjdf"`,
      `She thanked me, nice and smiley, hihihi and I went like "that went well" in my head and went on with life…..`,
      `Sometime later, I noticed she had heeded to my "advice" and I naturally went to compliment her and tell her to keep it up, only to be met with a lesson of my own.`,
      `She told me she was really grateful for my advice — she must have thought long and hard about it — She said it was good advice, only I did not have to compare her to another person, which I was taken aback with. You could imagine, I barely could remember even saying it, I must have blabbered it during the long twisted long talk I was doing — and even forgot, but she didn't forget — and it was in her memory.`,
      `I tried putting myself in her shoes (it didn't fit)… which didn't really work. I apologized to her repeatedly because I would happen to know how comparison, and sometimes rightly so hurts…`,
      `Later in life, (feels like I am a 100 year old saying this) this same thing would happen to me — as in I would be at the receiving end of comparison — and it was not at all funny.`,
      `"the truth is hurtful as it is, do not make it more hurtful with your poor choice of words"`,
      `Byee`
    ] },
  { slug: 'diary-day57-i-am-sorry', title: 'Day 57 — I Am Sorry...', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['reflection'], mins: 2, status: 'Published',
    content: [
      `Hey guys, it's been a while… I had a lot of technical issues, and by technical issues I mean…. I did not know what to write — actually, something happened…`,
      `I had to "lock-in" or how do you guys say it? I got into cyber-battles.. which were fun. You know what was more fun? My laptop got spoilt and I could only do sooo much without it.`,
      `It's been almost a week and if there is anything this whole experience has taught me, it is how yellow I am.`,
      `Enough about me… How have you all been? Not that you could answer.. such a pity😂`,
      `Talk about consistency… I am still a solid you know.. or I like to think I am, because I took notes. Despite trying to break into people's machines or making their apps dysfunctional, I took notes of stuff happening around, daily — but you know… you just say, "I will finish this today" and then tomorrow becomes another today .. and then the next and then the next — and then a bunch of people text you asking you why they have not seen your beautiful write-ups in the channel yet (I made up the "beautiful" but a part of you believed it)`,
      `"Take each day at a time" what other choice do I have?`,
      `And here I am… at your mercy 😂😂😂 that's dramatic but who cares?`,
      `Thank you all for reaching out guys, I truly appreciate it.`,
      `See you soon? I mean like tomorrow?`
    ] },
  { slug: 'diary-day58-keep-on', title: 'Day 58 — Keep On', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['reflection', 'grief'], mins: 2, status: 'Published',
    content: [
      `This life that we are living… is just hard. It's true… and things happen. Relatives die, loved ones die, we lose our positions, our jobs, things that matter to us, we need to work so hard to be able to live on earth etc… and sometimes we could be caught up in webs… several of them.`,
      `Sometimes one thing happens, and it feels like the whole world comes crumbling before us. I have had very close friends lose their family members, and it was a terrifying sight to behold. You see them cry and cry and cry and it feels like they would never stop crying — but they eventually do stop crying.`,
      `Point is, you might be reading this with a heavy heart — or holding onto some mistakes you committed in your past, or things you could have done differently that would have made a huge leap for you in your life or career or anything. Maybe you made a little sway in choice, or some opportunity just slipped past you without you looking enough… or you wasted so much time doing nothing and just being mediocre and careless, or you just did nothing…. Yes! All these things are horrible, and you should feel horrible about them. But here's the thing; Sadly, you cannot feel horrible about them for long — because unfortunately— unlike us, the clock on our walls have no emotions, and just tick and tick and tick… and you might want to get up and catch up after sulking. It's hard — but yeah well… (Distant sobbing😭)`,
      `Somewhere I saw "The best time to start is now"`,
      `When people say, "Life goes on" E get why, and as a yellow — I can tell you that is the hardest thing on earth.`,
      `See you next year?`
    ] },
  { slug: 'diary-day59-random-random', title: 'Day 59 — Random Random', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['reflection', 'faith'], mins: 2, status: 'Published',
    content: [
      `I have been sleeping most of the day today — and I took a swing by my Favourite podcast… and they were rambling about plenty CEO stuff…. buying a £400 apple headset…. (God Abeg o) just to listen to white noise and doing "deep work" (Na dis people sabi o)…. He went like, "When I put those headphones on, Akhi(which means brother in Arabic) I wanna cry"😂😂😂😂`,
      `One of them made an example about how we overburden ourselves and end up always tired and anxious and annoyed by using an analogy. "If I come here everyday and I try to fill this 500ml cup some 700ml water, I would always fail.. and everyday I would be angry. When you take on too much responsibility, you are setting yourself up for failure."`,
      `Then they kept mentioning some strange terms like the Ultradian and Circadian rhythm…`,
      `Then they talked about how they gamify their work by doing some imaginary marathon etc…`,
      `One of them said something which made me think through and through , he said, "I do not read a book without Istikharah"`,
      `Let me mansplain… or womansplain….🤣 Istikharah is an Islamic ritual executed by performing two units of prayer to ask for God's counsel… and I think thats about it.`,
      `The deep work whatever was boring tbh but I had a good laugh… which is good.`,
      `Byeee`
    ] },
  { slug: 'diary-day60-more-randomness', title: 'Day 60 — More Randomness', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['gratitude', 'faith'], mins: 2, status: 'Published',
    content: [
      `Hey… How are you?`,
      `Our lights went off so I kinda had no choice but to write this now… Also, I was super tired from doing barely anything yesterday.`,
      `I realized we have hit a 1000 people in our community, which is good… great. Thank you for sharing my write-ups to reach more people❤️.`,
      `I have got madrasah today — and maybe I'll bring you an interesting story from there😂`,
      `In the meantime, this is a statement I came across from the prophet Muhammad peace be upon him, "Look at those below you (in terms of abundance) and not those above you."`,
      `There is always always something to be grateful for, and sometimes as cliche as this may sound, we are living in our answered prayers and we do not even realize it…`,
      `When you look at it that way, all your worries should fade…. You are doing great, your efforts are not in vain.. and you have so much better than a lot of people on earth`,
      `Think deeply about all the good things you have, all the times you begged God for a certain favour you have now — and find something to hold onto and be grateful for…. and quit the complaining and nagging because guess what? Nagging never solved anyone's problems…`,
      `Keep a journal maybe… I know people who do that … and have a log of the things you are grateful for… and your answered prayers… It helps a lot.`,
      `It's not that deep… take it slow, and we will be fine.`,
      `Byeee`
    ] },
  { slug: 'diary-day61-delay-not-denial', title: 'Day 61 — Delay Is Not Denial', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['teaching'], mins: 2, status: 'Published',
    content: [
      `Is that how they say it?`,
      `"Delay is not denial"…. Whatever.`,
      `I have a story for you… of course I do😂.`,
      `The boy I told y'all about… the one I made to form friends? He was at madrasah today, and guess what?`,
      `Today for the first time as far as I remember… I received a complaint about him. A younger boy he plays with more often now… came to me saying, "Maalama, skccksk has taken my cap and thrown it behind the madrasah". I was a little bit happy… which is terrible for a teacher but scratch that… it's a free world.`,
      `I called him and asked if it was true… to which he affirmed, then I asked him to go and get the hat for his friend…. which he did.`,
      `I also kinda made some students teach other students. My boy was definitely part… I called him in after a younger "teacher" was bullied by his "student." Tell me why the "student" will be shouting at the one I sent to help him, "Sit down well…"`,
      `During break today, I was supposed to watch the kids so they do not leave the premises… because it's not safe… bikes, cars, strange people etc…
That is how I heard one boy in the pitch telling his friend, "Pass the ball to me, I will give you some of the Fanta"`,
      `Drama never ends…`,
      `Byeee`
    ] },
  { slug: 'diary-day62-timee', title: 'Day 62 — Timee...', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['reflection', 'faith'], mins: 2, status: 'Published',
    content: [
      `"Oh son of Adam, you are but a number of days. Whenever each day passes, then a part of you has gone"`,
      `-Hasan Al Basri`,
      `I have known about this quote for a long time… but yesterday my brother mentioned it in our conversation… with reference to how we have so very limited time with so much to do.`,
      `It's true, we are on limited time, and even with that… we procrastinate😭😂 and sometimes rule out very important moments in our lives… making time even further less and less. When you look at your days as being subtracted from the number of days on earth… you might want to take a lot of things seriously and live more intentionally.`,
      `It also means we have limited time with our loved ones.. and we should make it count. Make the moments with your father, your mother, your sisters… cousins in laws etc count…. the time is ticking tick tick tick.`,
      `You are, in the end — made up of a number of days… not bones, not flesh, not a soul, not the experiences maybe, not anything… just a number of days you were assigned. You might wanna make them count`,
      `Byeee`
    ] },
  { slug: 'diary-day63-source-of-pain', title: 'Day 63 — "Do Not Be a Source of Pain for Someone"', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['reflection'], mins: 2, status: 'Published',
    content: [
      `A sister was reading someone's post to me from her phone about something I can't remember… but she got to a part where the person said something like, "Do not be a cause of pain to someone"`,
      `It occurred to me that I had never actually _deeped_ that. "Deeped" is a British slang… which you will not understand because you are simply not British.`,
      `I had never thought about it deeply. I mean.. we see memes of how we are the "villain" in some people's story and how "everyone thinks they are a good person" but it seems everything gets to be a joke for GenZ.`,
      `Every serious issue has a corresponding meme to make it bearable sometimes…. but to also make it look like it's not a big deal when it actually really and truly is.`,
      `That aside, maybe we could start a commentary on memes😂.`,
      `"That's not creepy at all"`,
      `Yh, what I am trying to relay is that "pain" comes in different ways, shapes or forms… and it is relative.`,
      `Pain could be betrayal, not keeping a secret, physically harming someone, saying hurtful words during arguments, discouraging your friends…. and all that heavy stuff. Pain could also be very subtle like coiling out of plans last minute… not hugging them, mansplaining — and sometimes pain is literally not keeping quiet and just talking too much.`,
      `Byeee`
    ] },
  { slug: 'diary-day64-random', title: 'Day 64 — Random', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['reflection'], mins: 2, status: 'Published',
    content: [
      `When I was a student, (aww… I get to say that😂), my group members and I would always look for suitable places to meet as a group…. The library, the learning commons, the "learning area" or just anywhere else that would be suitable. Sometimes it would be exams week or …like late during the day and in my head I am like.. so convinced that there is no way we are getting space… in there. It's unspoken… but at a certain time, people just give up the library because there simply would not be space.`,
      `I would always follow their lead, and someway somehow… they would find a seat for us, and it was shocking. It rubbed off on me too… if I went to the college late, or during exams… I would still go and give it a shot… who knows? I might find a seat…`,
      `I listen to these entrepreneurs about their stories and whatever, it is mostly — like 99 or even 100% audacity. They needed to speak to someone… all odds were probably against them, but they did it anyway.`,
      `There is a guy who called help desk… and managed to use that channel to speak to the CEO of a high level company…. just with trial.`,
      `Maybe it is time to take that bold step…`,
      `"If you want to do it, you find a way. If you do not want to do it, you find an excuse"`,
      `Byee`
    ] },
  { slug: 'diary-day65-future', title: 'Day 65 — "You Do Not Know the Future"', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['faith', 'reflection'], mins: 3, status: 'Published',
    content: [
      `When people advise us… and this is… like even sometimes when the elderly advise us, they say some version of "Help them, you do not know tomorrow o"`,
      `Almost everybody here has had someone say that to them.`,
      `I am muslim, and that's one part of it… but let's hold that thought for a second. Being helpful to people is actually helping yourself… in the end. Whatever you act upon or project… is a reflection of what is going on within you. For instance, if a person is always vindictive and malicious and gossips a lot etc… they are probably insecure… or they hate themselves… they definitely hate themselves… that is a no-brainer.`,
      `So when you help people, you reflect goodness.. and purity… and peace within yourself.. and a love for a thriving humanity. When you do it because of an imaginary situation in the future where the person would be of help to you… or stands to be of help to you… that would not be sincere… it might just be a transaction.`,
      `I remember seeing a post where a guy said a version of those lines… then this lady came by and commented under, "Help people because it is good, Do not harm people because it is good.. Why does everything have to be because they could help you on the future?"`,
      `I mean… I know I kept her statement in quotes but those are not really her exact words… it has been a while since I saw it.`,
      `Now back to me being Muslim, it is a part of my faith to be kind to people… and not for free though… but also not for them to pay me. It's more of the fact that I expect my reward from God…. and that extends.. even if they do not say "thank you" or they eventually "violate" me (another British slang you do not know because you are simply not British), it would not (more like should not) deter me.`,
      `"We only feed you to attain God's pleasure, we do not need from you rewards… or gratitude"`,
      `Okay wait… so what if you never meet that person again? Or it is clear that this person would never stand a chance of helping you… you will not help them then? C'mon`,
      `Byee..`
    ] },
  { slug: 'diary-day66-random-random-2', title: 'Day 66 — Random Random', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['reflection'], mins: 2, status: 'Published',
    content: [
      `A little something you should know about me… When I learn a word, I use it in my daily life… no wait… let us talk about how I learn it in the first place — not in a book… maybe sometimes in a book… and sometimes I hear people use too much to the point where I can extrapolate meaning from all the contexts.`,
      `I then use the word… and overuse it.. and then I force my conversations to go in a way that allows me to use it… until a new word comes by. This is not just me… and to be fair, I learnt this from people around me😂`,
      `Today at work, I went to get a snack. I was eating until I got to the last parts… and then I started to imagine some perfect scenario in my head… You know… perfect questions and perfect responses. I usually get a corner or something to eat… for privacy, so that might have been practically not possible…😂 but I have a WhatsApp channel remember?`,
      `I would have loved to answer a little something like, "why do you eat it to the crumbs?"`,
      `"Because I bought it?" No scratch that… "because it is good."`,
      `"Why would we throw food away in the can? There are people in hunger all over the world, even in this Ghana we are in. They can not afford food… we can, and look how graceful we are with that privilege."`,
      `"It just shows how grateful we are for the food… and how far I am from being a waste."`,
      `As my sister always says, (extrapolated from a statement of our prophet) "The barakah(blessing) of food is in its last bits…"`,
      `"Try dey finish that food Abeg"`,
      `Byeee`
    ] },
  { slug: 'diary-day67-motivation', title: 'Day 67 — "Motivation Is a Limited Resource"', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['discipline', 'faith'], mins: 3, status: 'Published',
    content: [
      `My friend said to me, "…… Motivation is a limited resource"`,
      `"When did she say that and why?"`,
      `"A ah, wait na…"`,
      `I caught up with my friend after a "long" time… not really long but longer than usual.. and we were…. you know… just catching up.`,
      `I was telling her about the cybersecurity adventures I have been up to… and she was thrilled.`,
      `Later on, she said to me, "That is all good. What you feel now might be motivation… and it would not last you a lifetime, you know… when things get tough.`,
      `When things get tough, you would need passion. Motivation is a limited resource."`,
      `I saw somewhere something similar which I tried to recall during the call… and failed to. I could not quote it. It was something like, "Motivation gets you started. Discipline keeps you moving"`,
      `Quite honestly, where I am right now… I think that whether motivation or discipline or money or whatever… just know how to pray.`,
      `When next you pray.._could be right now_ pray for everything… for guidance first.. but particularly discipline.. and discipline😂`,
      `E get why.`,
      `We also talked about friendships and relationships in general… and how we could be considerate towards each other.. we went on and on until we recalled a statement from our holy book, "Do not forget the good between you"`,
      `We discussed how people could hold onto the good other people do to them, and use that to give as many excuses as possible to these people they have any sort of relationship with… everything is just becoming so abstract and I have used "people" a bit more than I should😂`,
      `It's really not that bad when you look at it… truly. We live to hurt each other, and then we apologize and hurt each other even more… and then we learn to live around all of that.`,
      `"If you want to find a friend without a flaw, you might as well be by yourself"`,
      `Bye.`
    ] },
  { slug: 'diary-day68-my-kids', title: 'Day 68 — My Kids', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['teaching'], mins: 2, status: 'Published',
    content: [
      `Hey there, How are you?`,
      `I do not know what to write today😂 so I am just going tell you some random madrasah story from last week.`,
      `I was at madrasah today, and not much happened. School has resumed so there were a lot of familiar faces (of university students) all over the mosque.`,
      `This kid came to me to recite, and whenever he comes, he is very reserved and quiet and recites very calmly and not-so-audibly. I know him too, he plays a lot with his friends and I am always spotting him and warning him to stay put.`,
      `He came to me last week to recite — and I wanted to try something… I really do not know why I did that.`,
      `When he finished reciting his portion, I said to him something along the lines of "ejsbcsj why are you not smiling?"`,
      `He was just looking at me with that blank face.. expressionless.`,
      `I then said, "Smile, do this 😊 and then I smiled myself.
I was trying so hard to move heaven and earth to get this boy to smile at me.`,
      `Long story short.. actually who came up with that phrase, "long story short" ?`,
      `"You mean 'to cut the long story short' "`,
      `Yeah whatever… so to cut the long story short, I ended up terrifying this young boy — and I eventually felt bad. I let him recite and then I think I 'high-five'd him and told him to go and sit down.`,
      `I mean.. why would this boy not want to smile at me?`,
      `Byee`
    ] },
  { slug: 'diary-day69-more-story', title: 'Day 69 — More Story', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['teaching'], mins: 2, status: 'Published',
    content: [
      `Before anything, I am so happy today. That boy I told you about, smiled at me today, and I am so happy… of course I am.`,
      `Today was revision weekend day two, and everyone was very energetic and to my advantage, very happy to compliant.`,
      `We started the day like every other Sunday. My colleague taught them a song they would use to march back to their classes after assembly, we did a little announcement and advice session, and then they marched to class.`,
      `The kids would revise from the surahs (chapters of the Qur'an) they had learnt up to, until they reached suratu nnas. Suratu nnas is the last chapter of the Qur'an. It is also by default, the chapter with which we start when learning how to recite.`,
      `We needed time to revise the other courses as well, so it was practically impossible to listen to every single one of them revise.`,
      `I decided to attend to each group briefly.`,
      `Me: What surah have you guys reached?`,
      `Group, sometimes just one person: Gcjgjc`,
      `Me: Okay, gegxerc you would be the group leader. Revise from your surah to nas and if I catch anyone making noise or not reciting, it is you I would reprimand. If anyone is making noise, come and tell me. Have you heard?`,
      `Group, or individual: Nods..`,
      `I did that for all the groups, and then I brought the very little kids whom this method would not work with, and I revised with them.`,
      `The kids I made group leaders were all high and mighty at some point, and I had to manage them every now and then, and it eventually worked.`,
      `Later on, we revised some letters in Arabic and some words that start with them.`,
      `That's about it for today's piece.
See you tomorrow?`
    ] },
  { slug: 'diary-day37-never-win-argument-raw', title: 'Day 37 — Never Win an Argument', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['communication', 'conflict'], mins: 2, status: 'Published',
    content: [
      `I had an extremely annoying attitude of saying "okay" mid argument. I just love doing it because it pisses people off sometimes.... like my friends who really wanted to argue or prove a point. I remember someone saying "not okay, I want you to argue" after I said "okay". I went like, "the nerve!" I still have that attitude, but now I do not say "okay" midway. I say, "I am not having this argument" way earlier.....`,
      `Well, "The only way to get the best part of an argument is to avoid it" is what Darl Carnegie mentions in his "How to win friends and influence people"`,
      `He recalls an incident with an oversabi lawyer and his client. This lawyer tried explaining to his client how he had misinterpreted a certain clause or whatever from a contract. The lawyer won the debate.... but as you might have guessed, the client hated him after that. Probably fired him. Hihii`,
      `Also, for the record, arguments barely change anyone's mind. Rather, it builds resentment -- because everyone involved tries so hard to feed their ego, to say whatever they can, to win the argument, and in the end, they regret most of the things they say.`,
      `Just be like me... be the bigger person, and you could be sarcastic about it too. "I am not having this argument". Ohh that look on their face...`,
      `Also, Darl might be big on winning people. I am also big on avoid drama.`,
      `"You can't win an argument. You can't because if you lose it, you lose it; and if you win it, you lose it."`,
      `A bit all over the place... but might be fun to read`,
      `Byee guys`
    ] },
  { slug: 'diary-day38-asleep-already', title: 'Day 38 — Hey, Asleep Already?', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['communication', 'listening'], mins: 2, status: 'Published',
    content: [
      `Keeping up's hard. Isn't it?`,
      `I don't know what I will be writing but let's see.`,
      `Ahh yeah, found it. *"Be a good listener. Encourage others to talk about themselves."*`,
      `I remember like 7 years ago when I had just "entered" high school, we had a camp at the university I just graduated from, and this woman -- whom I was barely listening to by the way, said something that went through my ear, luckily. She said, 'Listen, and show you are listening' as part of some principles to some stuff i do not remember.`,
      `I remember laughing about it with my friends later on, but it did make sense.`,
      `Now I just subconsciously do it, I am sure several other people do it too. If I am in class, or a meeting, or chatting with a friend, or just anything that has another person speaking to me, you would -- most of the time find me very attentive. Sometimes I am genuinely interested, other times I am genuinely interested in making the person believe that I am genuinely interested.`,
      `'Why?' right?`,
      `Because I know how crappy it feels when a person is ignored -- and I whine about it every time I notice. Darl Carnegie says to win friends, you must _in simple terms_ show that you are listening.`,
      `Just nod your head, look at the other person with all your attention, laugh when they think it is funny, and _you know_ ...just be present. You can thank them afterwards for the 'good time' if you were genuinely interested.`,
      `Else..... ughh..... I don't know.. hihi`,
      `That is it for today`,
      `I shall be off then, mate`
    ] },
  { slug: 'diary-day39-reds-1', title: 'Day 39 — Reds (Part One)', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['HCI', 'human behavior'], mins: 3, status: 'Published',
    content: [
      `Are you awake? How about this?`,
      `*"Reds don't try to take charge, they just naturally end up doing it."* is from Thomas Erikson's 'Surrounded by idiots' which groups people into four colors. Changed a book huh? well.. yeah, I did.`,
      `Before this, I had never known some people were what they were because they were 'Reds'. I just thought they were… too loud, or too bold, or extremely annoying and impatient.`,
      `But now that I know what "Red" means, I can't unsee them.`,
      `According to our big guy, a Red is that person who talks like life is a race and they're already late. They interrupt you, because your story has too many sentences. They want bullet points, headlines, conclusions, 'In short...' everything fast fast.`,
      `You know that person who asks, "Okay, so what are we doing?" when you've barely started discussing what needs to be done in the group meeting?
Yeah… that's a Red.`,
      `They walk fast, decide fast, argue fast, forgive fast, and get irritated fast. Everything about them is fast — except their tolerance for slow people, which is… nonexistent.`,
      `A Red will turn your entire three-paragraph explanation into:
"Alright, so you need help. Why didn't you just say that?"`,
      `But that can't be bad, they're the ones who actually do things.
While we are still planning or thinking or overthinking, they've already acted. Sometimes wrongly, but yeah well.`,
      `How do you spot a Red?
Look for the person everyone unconsciously looks toward when things get chaotic.
The one who hates long stories.
The one whose presence is energy.
The one who does not make the slightest effort to conceal his identity or to be nice.
That guy or girl in the group that everybody kinda hates but can't get rid of.`,
      `They do not hate you, they are just like that.`,
      `''It is all about understanding people'' as they say....Actually nobody says that.`,
      `Next time they get under your skin, just say it loudly, 'You are a Red'....`,
      `Anyway, that's all for today.
I shall be off then, mate.`
    ] },
  { slug: 'diary-day40-reds-2', title: 'Day 40 — Reds (Part Two)', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['HCI', 'human behavior'], mins: 3, status: 'Published',
    content: [
      `Today, let's talk about how to deal with them, you know… without sobbing in the baths after a group presentation.`,
      `Reds aren't complicated.
They're just… direct-to-the-point types of humans.`,
      `As our big guy says,
*"A Red doesn't mean to dominate you. They just think everyone should move as fast as they do."*`,
      `Meaning, They're not angry, they just think we are slow. It is not you they hate. It is not personal.`,
      `What you don't wanna do is bring your whole novel, bring the trailer.
They do not need details, they need the "In short…." part.`,
      `If you talk to a Red for too long, their soul physically leaves their body and goes to do something more productive.`,
      `If they ask "So what happened?", they don't actually want what happened.
They want what is relevant in "what happened"`,
      `Vinh Giang does a beautiful illustration of a conversation between a blue and a Red.
Blues are detailed oriented but that's for another day.`,
      `Blue: I heard you went to the zoo, how was it?`,
      `Red: It was fun.`,
      `Blue: How was the experience, how would you describe the animals and how did it feel?`,
      `Red: It felt done, like this conversation!`,
      `😂😂`,
      `Another thing you don't wanna do is beat around the bush or "feel like", because if you start with, "I feel like…"
They already feel like leaving.`,
      `It's fun learning to understand people right?`,
      `When you understand people, it's easier dealing with them.`,
      `that your "bossy" friend becomes "efficient."
That "rude" classmate becomes decisive.`,
      `That "impatient" sibling becomes… well, still impatient, but now it makes sense.`,
      `We actually need Reds, I wonder why the author chose to name them Red — because if the world were full of only Blues or Greens — we would still be planning the first wheel.`,
      `Next time we might learn about blues… or maybe something else.`,
      `I shall be off then, mate.`
    ] },
  { slug: 'diary-day41-sniffs', title: 'Day 41 — Sniffs...', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['teaching'], mins: 3, status: 'Published',
    content: [
      `"This girls is so dramatic"
I mean… what's the fun in life without drama. Drama is the spice of life.`,
      `Speaking of drama, today I had yet another not-so-ordinary experience with my kids at Arabic school.
There is this brilla kid in my Class. He knows all the answers and he has memorized all the Hadiths (sayings of the prophet peace be upon him) with their numbers and duas (supplications) etc…`,
      `Every time the class gets noisy, you find him still quiet. He has a brilla sister who is not-so- troublesome too but I catch her a few times talking.`,
      `I noticed this boy unconciously because I always look for those making noise and never — not even once — do I remember warning him.`,
      `Today, it dawned on me and I said "you know what? Imma find out why"`,
      `I caught him with something in his mouth and I called him. He naturally thought I was going to reprimand him because it's not allowed to eat in class. I mean…. goes without saying right?`,
      `When he sat down, our dialogue began.`,
      `"I have never seen you talk in class. Why?"`,
      `"(Shrugs a little bit)"`,
      `"Do you have a friend in this class"`,
      `"(Shakes head)"`,
      `Turn your back and look through the boys and choose one person you want to be your friend"`,
      `"(Turns around for a while…. and then turns back) I don't know"`,
      `"Do you have friends at school"
"Yes"
"How many?"`,
      `"Two"`,
      `"Only two in the whole school?" ( mind you this is a kid who probably doesn't know the difference between someone being your friend, classmate, or acquaintance.`,
      `"Yes"`,
      `Then I started my monologue,
"You need to have friends okay? Do not always come and sit by yourself. At least one friend. When fmsndjwjcha comes tomorrow I will let him be your friend. You should have a friend, you see your sister — she also has a friend. "`,
      `The last part might have been where I went wrong because tell me why this boy started crying.`,
      `I consoled him and gave him a wipe to clean his face.`,
      `Then I kept telling him, "Do not worry, it's okay. I didn't mean to make you cry"`,
      `Then I thought about it later on and I realized — there is absolutely no way I would know what was going through the kid's mind`,
      `But here is what was going through my mind. I have friends… I mean everybody does right? And I tell them everyday how grateful I am — but in that moment, I realized that I had gravely belittled my friendships.`,
      `It looks like nothing — having friends, just hanging out. It is a lot my brother and my sister! Those good friends that you have? Make sure no matter what they remain your friend — or you remain theirs!`,
      `E get why`,
      `Anyway wish me luck… I will be establishing a van der waal's bond between two of my kids tomorrow.`,
      `You don't understand van der waal's? Just pick your kov's series. Oh right, you didnt do chemistry.`,
      `Oopsie….`
    ] },
  { slug: 'diary-day42-challenging-buddyless', title: 'Day 42 — Challenging My "Buddy"less Kid', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['teaching'], mins: 3, status: 'Published',
    content: [
      `Nobody's asking — but madrasa was fun today…. well depends what "fun" is.`,
      `The kid I was going to find a friend for, and kid I wanted him to be friends with were both present today.`,
      `When we finished all the arrangements and assembly, I summoned both of them.`,
      `I called yesterday's kid over, and when he came, I asked, "How are you?"
"I am fine," he responded, trying to hide a smile… or maybe I am a bit ahead of myself.`,
      `I then signaled for the second kid to come. "Why didn't you come to madrasa yesterday?" I asked.
"djxnshejan kdjwbdjxhwxjabdiw"`,
      `"Okay," I continued. "You know this boy?"
"Yes," he replied.`,
      `"I want you to be his friend. Can you do that?"
He smiled and said yes.`,
      `"You guys play ball during break right?" (I never thought I'd be interested in their football ever…)
"Yes," he said.
"Good. I want you to add him to your football team. You bench, right? And it's 11–11?"
"Yes."
"Then go with him during break and see if he could play with you guys. If he can't, you could bench him."
"Okay," he answered, still smiling.`,
      `We continued with our normal class stuff. When it was break, I saw this boy hanging his bag around anywhere but their "pitch"— which is just a mowed area around the mosque.`,
      `I then led him to where the kids played their football. They were happy to include him into their team. "(Name) is going to play with us, (Name) come."`,
      `After break, when I asked him if he had played, he was still trying to hide the smile, whilst saying "yes" and nodding his head.`,
      `I saw him playing with a kid in class today, and I tried not to look too hard so he gets uncomfortable.`,
      `I enjoyed every bit of the little adventure I had with this kid.`,
      `"That was an incredible story, very interesting." 🌚`,
      `Pass it on…`,
      `And Yhyh I formed the van der waal's force….`,
      `Byeee`
    ] },
  { slug: 'diary-day43-blues-1', title: 'Day 43 — Blues', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['HCI', 'human behavior'], mins: 3, status: 'Published',
    content: [
      `In his book Surrounded by Idiots, Thomas Erikson defines Blues as thinkers: quiet... and those who hate chaos or as I like to call it, "drama". They like the calm. He writes: *"The Blue person wants facts, information, logic and accuracy. They do not guess, they calculate."*`,
      `Blues see everything. They will see that small thread sticking out of your dress long before you do... they will spot the typo in the middle of your paragraph and the .01 that you forgot to add to the gross value that has literally no impact on anything... as if their eyes and their minds are always on zoom.`,
      `Erikson explains that Blues feel at home where precision is needed. They'd be happy to take a job that notices every little bitty mistake. That uncle who will code for hours because one icon appeared 0.001metres from its required position(this is actually valid), or that annoying artist friend who will redraw the same line over and over until..... until what? or your craftswoman sister who can sew, build, knit, design and do literally anything with her hands... all of these people are probably blues.
They'll calculate to the minute that "we should leave by 8: 12, not 8:15." And if you say "it's fine", a Blue will look at you like you just said "let's go into fire".`,
      `Socially, they may come off as 'selectively social'.(This is joke right?) They pick their people the way they pick everything else, with discretion and logic. Also, a blue usually needs a bit less noise.`,
      `As you are sitting in the group meeting yapping away, that "blue" friend is seriously analyzing everyone and trying to decode what exactly is going on. And while everyone is celebrating "it's done", a Blue is the killjoy that would point out how, in the second step we missed the 15th substep.`,
      `As usual, that can't be bad, Blues often spot problems when others have not even noticed a crack. Imagine getting on a plane in which the architects 'rounded' off the decimals...😭😂`,
      `Without blues, half our buildings, apps, artworks and instructions would fall down in the first two weeks.`,
      `Do you know a blue? Cos I know a ton of 'hem...`,
      `That's all for today.`
    ] },
  { slug: 'diary-day44-blues-2', title: 'Day 44 — Blues Part Two', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['HCI', 'human behavior'], mins: 3, status: 'Published',
    content: [
      `How do you deal with blues?`,
      `Well, before anything.. let's take off from what we know.`,
      `Those guys in the "technical" team, they are probably all blues. If they're not, they are probably the ones making all the faulty engines or "unclean" code etc.`,
      `Let's assume you attend a meeting with a blue. Unlike a red, a blue would look at you as if you are speaking Chinese if you came in there talking about "the vision" and "goals by 2030".`,
      `They do not care about any of that . In fact, that is the complete opposite of what they would want.`,
      `"For blues, the trip is more important than the destination"`,
      `They want to see charts, numbers, figures, excel sheets of expenses and an hourly break down… actually a minute by minute breakdown of the whole project.`,
      `A blue is also the kind of person that would know the answer to a problem or a puzzle you have been solving a very long time in sales and just not say anything until you ask for their opinion. If you confront them, they'd simply say, "You didn't ask me"`,
      `You don't wanna make a big deal out of some genius thing a blue did because they'd look at you confused. Like, "really, is this necessary?" Kind of confused. They hate being spotted, and they sure hate chit chat. Do not try to have "small talk" with them.`,
      `A blue is also the kind that you don't want on your decisions team. You want him on your technical team, or accounts team… but never decisions team, because you might never come to a conclusion.`,
      `"Meeting's over"`,
      `"But we forgot section ddisbcnejfj, have we considered smdjsifjekjc?"`,
      `"Oh my God you are such a killjoy"`,
      `They could sleep on decisions for dayssss…`,
      `And they end up still… you guessed right.. "conflicted between" the two only options`,
      `Blues are introverts…. Kinda goes without saying…`,
      `Byee`
    ] },
  { slug: 'diary-day45-yellows-1', title: 'Day 45 — Yellows', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['HCI', 'human behavior'], mins: 3, status: 'Published',
    content: [
      `We are finally here today, to sunshine, sunflowers, smiles, laughter, "I cannot come and go and die", "Oh my God thats so cute"…..`,
      `Yellows are the typical "sight for sore eyes." They are always laughing, entertaining or motivating people. A yellow is the typical "Sounds fun, let's do it"`,
      `In every action, a yellow is most likely to do the one that sounds fun. Even if a yellow makes a decision, it is based on the present, and how "cool" it was.`,
      `"Why did you buy the watch?"
"It only cost money…. money we will get back. Look how cool the arms of the watch is…. It's so pretty"`,
      `Like reds, they are quick to make decisions, only.. the decisions were because "it just felt right"`,
      `They are also the ones who know half the people in the city and their contact list is a phone book. They also think everyone is their friend… "friends" they made through others friends…because at least they don't hate them….`,
      `That can't be a bad thing, yellows have the natural ability to connect with, and convince people. People barely hate yellows, even reds need yellows to get "the right people" to do their "tasks" for them…(since thats all they care about)`,
      `A yellow is that person who always sees the glass half full… they are looking for a way to be happy anyway… and naturally, it makes them full of ideas. It also makes them great sales people…. and smooth talkers.`,
      `Thomas says that a lady he knows could pull off "Guys, let's jump off the window. We can do it" so well with her companions even though they are on the fifth floor because of the ridiculous amount of rizz (charisma if you didn't know) she has.`,
      `A yellow is the kind of friend you call when you feel like there is no hope in life anymore, only to end up laughing at how stupid you were…`,
      `Also, "Let's be real" (i.e realistic) sounds like gibberish to a yellow. Why be real when you could be happy?`,
      `Do not be real…. be a yellow`,
      `Are you a yellow?`,
      `Byee`
    ] },
  { slug: 'diary-day46-yellows-2', title: 'Day 46 — Yellows', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['HCI', 'human behavior'], mins: 3, status: 'Published',
    content: [
      `How do we deal with those bubbly people who cannot seem to stop laughing or shut up?`,
      `First of all, yellows believe freedom is free. Sorry I mean like … life is freedom. Anything that has to do with too much structure, or deadline or "seriousness" is not even on the list of a yellow's wants.`,
      `Earlier we talked about ideas — yellows do not want you with a book saying, "this is so great, meet me at the office let us write it down". That's creepy to them, they would either forget it or pretend they did.`,
      `Yellows are also big talkatives…. always talking — because they talk well— they know all the right words to use whenever, wherever— and barely listen.`,
      `Thomas watched a "yellow" (with a timer, man's creepy right?) talk 69% of the time in the board room meeting whilst seven other members of the board, including the CEO, shared the rest of the 31%.`,
      `You want to be very careful to double-check and think thoroughly of what a yellow says before decking to "embark" upon it — because when a yellow sells you an idea, it feels divinely decreed for you, particularly.`,
      `When they do listen, they only remember the "interesting" parts of the conversations and throw away all the details😂😂.`,
      `When you mentioned you were starting college did you mention also that there would be skydiving every weekend? No.. that is probably why they do not remember… 
Who needs that boring stuff right? Do not take it personal… they care about you, they just do not remember.`,
      `If they have to, yellows need a way to make everything they do an adventure. They typically make dinosaurs their roommates. They decorate their study area to look like it's made for a princess to decipher a certain hash to find her prince — they will create fun in anything they believe is worth doing — what you wanna do is enable it. Do not get in the way of that.`,
      `You do not want to place a yellow anywhere around time-sensitive and critical tasks in your department. You want a yellow to be at the creative section, or customer service (perfect) or just where you do not need to "lock in" and "finish projects", else you would be in for a treat.`,
      `You would receive reports with enormous amounts of typos, or a shirt "ready for sale" with strings literally hanging all around it.. but hey, it's done right?`,
      `Are you yellow?`,
      `Byee`
    ] },
  { slug: 'diary-day47-greens-1', title: 'Day 47 — Greens', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['HCI', 'human behavior'], mins: 3, status: 'Published',
    content: [
      `Our final color…. today is for the peace, calm and quiet…. for vegetables, for great listeners and not-so-pleasantly, the set of humans Hippocrates (You know that guy?) described as "phlegmatic".`,
      `Greens are somewhat the reason all the colors exist. Who would be led if everyone was fire? Who would be entertained if every one was an entertainer or cared about details or was just too serious (like reds)… and who would calm the room down when a blue was being "too much"?`,
      `Greens love peace, they sure hate chaos and conflict. A very good example are the kind of kids they call "angels". The kind that would eat when they have to, sleep when they should, endure and take their meds when asked etc..`,
      `Hating conflict makes greens very good team players most of the time.. but just like blues, they might take a long time to reach a decision because they have to consider everyone.`,
      `A green would not hesitate to put you above themselves. Helping people is like the oxygen they breathe. They would love to help with the renovation they didn't know about when they thought long and hard about whether to ask for your help and leave without actually asking for it in the end. They are the kind of people that need "Knights in shining armor"`,
      `By virtue of greens loving peace, they do not take abrupt decisions or change very greatly. "Why would they suddenly change the company policy?" "Why do we have to do it this way now?"`,
      `Greens also love their space. They are introverted and may have a very few set of friends..`,
      `I know you didn't ask me, but if you were to, "Not very fun"…`,
      `Are you a green?`,
      `Byee`
    ] },
  { slug: 'diary-day48-greens-2', title: 'Day 48 — Greens', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['HCI', 'human behavior'], mins: 3, status: 'Published',
    content: [
      `How do you deal with a green?`,
      `Like blues, you do not want to place a green on your decisions team, simply because they would want to consider everyone's views and opinions, they also do not want to tell if what you said was the lamest thing they have ever heard in their life..... you know, because of peace. If you have some routine tasks or tasks that do not need people talking to people, you have got to give that to a green. A green would always always have your back. They would not forget your birthday, or your graduation etc..`,
      `You want to be very careful what you say around greens, because they barely, if ever, change their opinions. Once they trust someone, everything the person says is the law, because they barely change their views anyway, it is a lot of mental gymnastics to unlearn and relearn, even when every single thing on earth points out that their views are wrong. They just love their peace.`,
      `If you ask a Green, "are you okay?", or the sort, you almost always would hear 'yes', not because they want to be dramatic but because they want peace to reign. They would sweep things under the rug, only to start acting up out of nowhere.`,
      `Most greens might be slugs, or at the very least, uninterested in most things. They would love to just crash on the couch and do nothing. A beautiful illustration Thomas gave from the book would be: If a man is green, his wife could make amazing plans and be so happy to tell him all about it, but she sure would be met with a very indifferent reaction. She might think her plans are not big enough, but when she brings bigger plans, she would be met with even more indifference.`,
      `Whatever plans you are making for them, just know you would have to go through a lot to get them to do it. If it is urgent, Thomas said you should forget about it.`,
      `Byeee`
    ] },
  { slug: 'diary-day49-done', title: 'Day 49 — Done...', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['HCI', 'human behavior'], mins: 2, status: 'Published',
    content: [
      `These are the four colors we have covered, summarized.
What you should know by the way, is that no individual is absolutely all the colors — as in no person is absolutely Red, or absolutely green, etc. I asked my good friend and roommate very recently what color she thought I was and she said, "All of them, you are like a chameleon" and I went like, "Yh well, that was incredibly helpful"`,
      `Also, the characteristics I mentioned are not absolute nor discrete, they are continuous and within a range. Do you know the integral sign and the summation sign? A little something like that.`,
      `You know how you have different shades and saturation of yellow? (Yh whatever, yellows are my favorite), same thing with humans, with respect to the colors.`,
      `Most humans have two main colors, like blue and green, or red and yellow etc. and then the rest are negligible — or actually absent.`,
      `Have fun — and while at it, do not forget that tomorrow…. we are *50 whooping days* in.`,
      `That counts for a little something right? Yes, we would have an anonymous session — and I am telling you beforehand, bring your all in.`,
      `Byeee`
    ] },
  { slug: 'diary-day21-blind-man', title: 'Day 21 — The Blind Man', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['integrity', 'faith'], mins: 2, status: 'Published',
    content: [
      `Might not be the best but you know what? It still counts😂`,
      `Before this, let's talk about the fact that I cannot use this "—" anymore?`,
      `Because well, we both know.`,
      `Anyway, you know how our parents tell us stories?`,
      `There is a story I heard from my mom — about a blind man.`,
      `So the whole story is about a driver, or a car service that offered a free ride to people who couldn't see — as in blind people.`,
      `Then there came a "blind man" — like a man that was not actually blind but wanted a free ride.`,
      `He had the whole act together. He closed his eyes till they got to their destination or whatever, and as you'd probably guess, when he got t the destination and wanted to open his eyes …… he couldn't.`,
      `My mom mentioned that he said, "Allaah ba Ka San waasa ba?". Which translates into, "Allaah (God) do you not know play?"`,
      `I don't know how many morals we could find in this story, but here is mine:`,
      `Integrity: No one would have known — and till now probably. I don't know how it ended but they wouldn't know if he lied or he didn't.`,
      `People talk a big talk — and rightly so, about integrity as "Doing the right thing when nobody is watching" but in reality, it is doing the right thing when only Allaah(God) is watching.`,
      `That's it for today. Messed up thoughts but you know, a girl's gotta do what a girl's gotta do….`,
      `Byeee`
    ] },
  { slug: 'diary-day22-appreciation', title: 'Day 22 — Appreciation', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['communication'], mins: 2, status: 'Published',
    content: [
      `"Give honest and sincere appreciation"`,
      `That is the 2/30 principle from Darl Carnegie's "How to win friends and influence people"`,
      `You might think, "that's easy", right?`,
      `But it is not as simple as it sounds.`,
      `Because there is a very thin line between appreciation and flattery.`,
      `Most people do not know there even is a difference between the two.`,
      `Appreciation is when you try to genuinely motivate an individual and fuel up their spirits, and flattery is — well, flattery.`,
      `If you were to cook an exceptional dish today, and I said to you, "Even Gordon Ramsay cannot cook such a meal" You might be happy, but of course you know that it is not true. It might be true — but for the most part, it isn't.`,
      `If I was to say though, that "I love eating a well baked cake from a good cook like you" that would look and sound genuine, like it is actually possible that you mean this from the heart.`,
      `The point is the perceived honesty.
You want your audience to perceive that you are being honest. It's easier to flatter, and everyone does it. If that was the key to building relationships, everybody would be an expert in human influence, but everyone isn't.`,
      `If a person did a really good job, say clean the walkway or whatever, and nobody said anything — they wouldn't say, "Oh, nobody flattered me" they would say, "Nobody appreciated me"`,
      `Sends us to rule 3 but that's a whole different story.`,
      `Byeee`
    ] },
  { slug: 'diary-day23-eager-want', title: 'Day 23 — Arouse in the Other Person an Eager Want', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['communication', 'persuasion'], mins: 3, status: 'Published',
    content: [
      `When you closely examine the best salespeople, you realize they all have a single thing in common, that is — they seem to care so much about you.`,
      `They go on and on about how a certain product will help you, and how good it would be for your being. I remember being on a panel once with an aspiring entrepreneur and she said, "If I want to sell a laptop stand to you today, I would make a deal for you such that when you turn to walk away, you would feel incomplete without a laptop stand".`,
      `We are all salespeople, the least salesperson sells at least themselves.`,
      `Darl Carnegie gives a beautiful illustration of this in his "How to win friends and influence people" .`,
      `He recounts how he loves chips or whatever white food he mentioned. When he went fishing, he noticed that for whatever reason, the fishes didnt share in his fondness — they didn't like chips, so he had to *bait* them with fish food.`,
      `People are selfish, and that is not necessarily a bad thing — but that is a whole conversation on its own.`,
      `Point is, people love to hear about them and what helps them and why they should do it — as in how it helps them.`,
      `That is why when you tell a person for example to not smoke, you do not say, "Smoking is bad because you are harming more people and forcing them to be passive smokers". You say, "Smoking is bad for your health. Your lungs are screaminnggg right now for help"`,
      `If you want your son to do their homework, you do not say, "Do your homework so that I could sleep" or "Do your homework so that the teacher doesn't cane you"`,
      `Tell them what there is within the exercise for them. Like, "You will be praised in class for a good work done" or whatever. I have very horrible examples today😂`,
      `Anyway this is the same thing all the best influencers use.`,
      `"What is in it for me?" That is definitely what everyone asks.
Be different — ask yourself "What is in it for the other person?"`,
      `Byeee`
    ] },
  { slug: 'diary-day24-british-slang', title: 'Day 24 — British Slang', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['humor', 'language'], mins: 3, status: 'Published',
    content: [
      `Is it normal or is there cause for alarm? There is most certainly cause for alarm because how, in good heavens, does my own natural accent suddenly feel rather strange to me?`,
      `I adore the British accent, and I dare say, I am not alone. Many people pretend they don't, but between us, that is *rubbish* , *old sport* .`,
      `Long story short, I've decided to teach you my dear friends some posh British slang today. I know this is going to be *jolly good* fun for some and, perhaps, not quite your cup of tea for others. But do not worry mate, that is alright.`,
      `Do come along, then. Let's get into it:`,
      `1. "awfully kind of you":
in plain english it means you didn't have to do that, but I appreciate it deeply.
like you would say: "you brought me breakfast? awfully kind of you, old chap."`,
      `2. "a spot of bother":
in plain english it means a tiny little problem, nothing too dramatic
like you would say: wifi vanished during my presentation, just a spot of bother. (not a good example for a ghanaian😂😂)`,
      `3. "rather unpleasant":
in plain (and lame) english it means their attitude is stinking but we're being civil.
like you would say: he spoke to the waiter like that? rather unpleasant.`,
      `4. "quite impossible to deal with":
in plain english it means a nightmare human, avoid at all costs.
like you would say: group project with her again? quite impossible to deal with.`,
      `5. "not entirely convinced":
in plain english it means I do not believe a single word you just said.
like you would say: you studied all night? not entirely convinced.`,
      `6. "how… interesting":
in plain english it means that is strange, confusing, and I'd like to unsubscribe.
like you would say: you put ketchup in tea? how… interesting.`,
      `7. "they mean well… I suppose":
in plain english it means their intentions are questionable, let's be for real.
like you would say: he advised me to cut my hair with kitchen scissors. They mean well, I suppose.`,
      `8. "bless your heart":
in plain english it means you tried, but the result is giving tragedy.
like you would say: you spelt 'queue' as 'q'? bless your heart.`,
      `Right mate, I shall be off then`
    ] },
  { slug: 'diary-day25-smile', title: 'Day 25 — Smile', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['communication'], mins: 2, status: 'Published',
    content: [
      `I am amazed at this principle from Dale Carnegie. He mentions that one of biggest things to "win" people's hearts is to smile.`,
      `I remember watching a video where the man narrates an experiment. The experiment was set up to realize the relevance of smiling and how it shapes people's interactions.`,
      `They picked up a woman who was average in looks, and they set her up at an eatery.
She was supposed to stand at the entrance or whatever.`,
      `For the first part of the experiment, she smiled at every person who came to the restaurant. For the second part, she maintained a straight face.`,
      `As you may guess, more people — there was a percentage which I forgot — approached her for a conversation when she smiled than they did when she was not smiling.`,
      `Dale Carnegie goes on to mention that even on phone calls, you should smile — it shows in the flattening of your voice.`,
      `Lastly, he mentions that smiling literally translates to "I am happy to see you — You make me happy. I want to listen to you."`,
      `It would burst your brain to know that in Chinese, there is a saying which translates to "A man without a smiling face must not open a shop"
You didn't think I was gonna speak Chinese, did you?😂`,
      `"و تبسمك في وجه أخيك صدقة "
"And your smiling at the sight of your brother is charity"`,
      `Hayyabina, let us do some smiling this week.`,
      `I shall be off then, mate`
    ] },
  { slug: 'diary-day26-if-you-do-good', title: 'Day 26 — "If You Do Good..."', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['faith', 'reflection'], mins: 3, status: 'Published',
    content: [
      `As always, I recounted an exciting story I have kept in my head from my mom's chronicles. I always smile when I hear her tell it to my little brother and other kids now.`,
      `There was this beggar who would always chant "If you do good, you do good for yourself" across the street from a family of two kids and their "evil" mother.`,
      `All the kids in the neighborhood would play and laugh with the man — and even chant his quote, "If you do good, you do for yourself"`,
      `On a fateful day, this woman decided to poison the beggar to test his quote, she said to herself "I will do bad — not good, and it will not come back to me"
She served the man with poisoned bread, and waited for him to find his fate — only, it was not his fate.`,
      `Later on in the afternoon, two kids came home to their mother with a stomachache, only for this woman to find out that her kids went to say hi to "if you do good, you do for yourself", and he wanted to do good to the hungry kids, and sacrificed all of his bread for them.`,
      `I assume that almost everyone has read the book "The Alchemist" by Paul Coehlo. It is a great book by most standards — I mean except for the fact that he represented Islam *wrongly* in terms of sorcery or whatever. He does a great explaining the "universe" and how it works.`,
      `One of the things he mentions is the fact that the universe listens, observes and eventually gives you what you want. The universe also has a way of mirroring everything you do.`,
      `Amongst many things I wanted — everyone wants alot of things, I needed a mentor. Unknowingly, I would kind of coil back when someone else needed mentorship — not because I did not want to, but it felt overwhelming.`,
      `"Mentor?" It sounded so big in my ears. I would almost always find a way out of it, but more of them kept coming, strangely.
Until I sat back very recently and examined the whole situation. I needed mentors, just like those girls who need me as a mentor. I was in their shoes and my solution was right in front of me. If I wanted a mentor, I must be willing to be one too.`,
      `Yes the universe requires you to have audacity, empathy, faith, consideration to give you what you want.`,
      `Also, remove the "universe" and put "Allaah(God)" there. I mean ….. Universe? Pfftt`,
      `I shall be off then, mate`
    ] },
  { slug: 'diary-day27-random-thoughts', title: 'Day 27 — Random Thoughts', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['reflection'], mins: 2, status: 'Published',
    content: [
      `How about we just write off of vibes? cos I don't really know what to write today…..`,
      `I would love to talk about how I used my life savings to buy an iPhone only for android to create an "airdrop" feature…. today.`,
      `Like…… but let's leave it there like that.`,
      `Anyway, I saw a certain photo that intrigued me; it was several professionals like teachers, doctors, nurses and parents who had stretched out their hands across two parallel logs to basically form a ladder …. and a kid was climbing the "ladder."`,
      `I mean…. great art right? But it made me think.`,
      `When you are given birth to, you know nothing… not even how to walk or talk or even cry or breathe properly. It takes the community of people around you to learn very slowly, all of these things`,
      `Then you are sent to a teacher, and to a doctor when you are sick, and then a carpenter makes your crib and it goes on and on.`,
      `It's like a web… not "like" — it actually is a web.`,
      `Web aside, you have your own grind, your locking in, your working with your professor or whatever.`,
      `I am going round circles trying to sound so good but I guess it isnt working today …… haha. I guess all I am trying to say is that your success is not only from you. It is a reflection of all the "hands" you got through the journey…. and your complacency or negligence is a disservice to all the people that have invested whatever they invested in you. Okay now it feels like I am actually talking to myself.`,
      `And maybe …. I would just add that whenever you get the chance, stretch out that hand for another person to climb on.`,
      `My mom would always say to me what her father would say to her.`,
      `"The privileges you are enjoying now is as a result of the toil of your parents. It's up to you too to make your children enjoy from your toil"`,
      `"And Allaah(God) is in the help of man so long as man is in the help of his brother"`,
      `Let's stretch out some hands this week`,
      `Okay mate, I shall be off then.`
    ] },
  { slug: 'diary-day28-resentment', title: 'Day 28 — Resentment', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['relationships', 'conflict'], mins: 2, status: 'Published',
    content: [
      `Okay, I am a graduate — just thought to let you know because……. does a girl need a reason to be proud?`,
      `Anyway, my friend was telling me this story of two ladies who were such good friends to the point where they even decided to share a room together.`,
      `Well, time passed and humans did what they do best; being humans and by being humans I mean they fought😂😂😂`,
      `Long story short, there was so much drama and eventually when one of them was asked what the other did to her, she could not even put down a single thing.`,
      `When she got to that part of the story I went like (in my head) "This is my time to be philosophical "`,
      `I began, "She doesn't know what the girl did to her. If you ask her… she doesn't know. It's because maybe she did one small thing one day and she decided to 'sweep it under the rug' and then it built up and up to the point where even if she coughs, she is disgusted"`,
      `I continued, "Unresolved conflicts, it's not like when they do not address it they forgive you in their hearts and move on o , they do not. That is why I am direct, maybe overly direct"`,
      `I continued, "I do not like being the one addressing issues but you kinda have to, sometimes"`,
      `I thought about it and realized that this is how a lot of relationships became a story`,
      `There is another thing I heard from my favorite podcast, "One thing I have learnt is that having "tough" conversations are not as bad as they seem"`,
      `This is your sign to go and have an honest talk with that friend — and it's okay if they still act up, do not worry. Yes you cannot control anyone. You know what other thing you can't control? Your past actions.`,
      `You are here to build yourself, everyday`,
      `Alright mate, I shall be off then.`
    ] },
  { slug: 'diary-day29-say-my-name-raw', title: 'Day 29 — Say My Name', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['communication'], mins: 2, status: 'Published',
    content: [
      `My name is Ahlaam -- if you didn't know. I would probably 100% pay attention to you if you met me on the way and said, "Hi Ahlaam" rather than "Hi, whats your name again?"`,
      `There is something extraordinarily captivating and commanding about hearing your own name. Dale Carnegie says it is *"the sweetest and most important sound in any language."*`,
      `Names carry identity, history, and belonging.
When someone uses your name, it screams, "You matter enough for me to remember."`,
      `Carnegie even mentions that if you forget everything else, *don't forget the name*.
It's the easiest way of honoring the person in front of you.`,
      `Calling someone by their name with kindness is a form of affection and concern.
In arabic culture, people go as far as mentioning a person's "kunya" which is basically a kind of nickname attributed to a person by virtue of their son -- or future son etc.`,
      `That is why you hear them say, "Ya muadh", "Ya Aba Abdillah" which translate into "Oh Muadh" "Oh father of Abdullah" etc
And interestingly, psychology agrees that hearing your own name activates a distinct part of the brain responsible for self-recognition.`,
      `How about we try it this week?
Say your friend's name when you greet them.
Say the name of that woman you buy waakye from tomorrow
Learn the names of the people who make your life easier.`,
      `Your relationships will grow, your interactions will be more enhanced and you will see how powerful this tiny habit is.
When people start to appreciate you and listen to you more, you could .... perhaps ... I don't know😂`,
      `Also, do not forget to add "ma", "sister" etc when mentioning the names before you hear "She does not respect at all"😂😂`,
      `"Call them (i.e your foster children) with their (real) father's names"`,
      `I shall be off then, mate.`
    ] },
  { slug: 'diary-day30-push-through', title: 'Day 30 — We Push Through Anything We Put Our Minds To', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['affirmations', 'faith'], mins: 2, status: 'Published',
    content: [
      `If names are powerful when said by others, affirmations are powerful when said by you.
Affirmations are your way of calling yourself by its rightful name, not the name your fears gave you, not the name your doubts forced on you, but the name Allah(God) created you with, "Honored".`,
      `Affirmations are small, intentional reminders that drag you back from the noise of "You can't", "You're not enough", "Who do you think you are?"`,
      `You know how Darl Carnegie tells you to use someone's name to honor them?
Affirmations are you honoring you.`,
      `and....... psychology agrees again.
Your brain actually rewires when you repeat the positivity.
It's called *self-directed neuroplasticity* _I feel very smart saying this_.😂`,
      `Now time to try it.
Tell yourself (like right now):
"I will heal."
"I am growing."
"I am becoming better than I was yesterday."
"I deserve peace."
"I deserve kindness and i will spread it."
"I deserve effort, especially my own."
"I will be the best in all I do"
"I will be blessed, and doors will open for me"
and the best one I heard "I am a person who loves doing deep work" from of course..... my favourite podcast.`,
      `Say it from your heart
And do not fret, you have a Lord to fund all your dreams.`,
      `try this:
Look in the mirror tonight…
call yourself by name…
and tell her, "You will do it, you'll see".
When you finish, do not forget to "high five yourself" and say "I am THAT girl mehnnn......."`,
      `فَاحْفَظْ لِسَانَكَ أَنْ تَقُولَ فَتُبْتَلَىٰ، إِنَّ الْبَلَاءَ مُوَكَّلٌ بِالْمَنْطِقِ
"Guard your tongue from speaking, lest you become tested; for trials are tied to what is uttered."`,
      `I better bounce`
    ] },
  { slug: 'diary-day31-confidence', title: 'Day 31 — Confidence', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['confidence', 'communication'], mins: 2, status: 'Published',
    content: [
      `Imagine this: you wake up at the crack of dawn, all prepped for a 7:30 a.m. meeting with some very important partner of your company. You step out in style at 6:30, aiming to get there thirty minutes early… and then traffic. You finally wander in three minutes late.`,
      `Most people (probably like you.... and I sometimes) would start off with "I'm so sorry I'm late, traffic was awful, I even woke up early, polished my shoes last night…" Blah blah blah. If you have inferiority complex , you might start narrating your life story.`,
      `Or maybe your friend invited you out. You're tired, you've got work, or you just don't feel like it. "I'm so sorry I can't come, last time I was tired, my leg hurt, you didn't notice, but I hope you don't think I don't like hanging out with you…"`,
      `That is very far from what a person with confidence would do.
In the first scenario they would say, "Thanks for waiting."
In the second scenario they would simply say "I can't make it."`,
      `No essays. No excuses. No desperation. Because you see that over-explaining? It screams "Please like me, I beg you."`,
      `Keep it short, keep it classy, keep it confident, keep it full of 'steez'.
Keep it full of "Take it or leave it."`,
      `Remember, "Do not over-explain, it makes you look desperate"`,
      `And yes, mate — that's enough wisdom for one day... maybe not enough.`,
      `I better bounce.`
    ] },
  { slug: 'diary-day32-ripple-effect', title: 'Day 32 — Ripple Effect', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['habits'], mins: 2, status: 'Published',
    content: [
      `This one is extrapolated from a conversation my sister had!`,
      `If you were to start smoking today, that would be one bad act, but really...... is it just one act?
As a university student, if you took the habit of smoking say every evening. You might smell "smoky" after every session. You would then begin to avoid people at night because you are afraid they would judge you. It then slowly becomes an addiction..... which means it is no longer every night, it is every time you are triggered or it "builds up" inside of you and you cannot control it. That means avoiding people anytime it happens, it then extends to skipping class and sleeping during the day and becoming crappy at night with no friends or social life ......... and the list goes on. If we are not careful, the inevitable might happen.`,
      `If you -- on the other hand, decided for example, to start wearing modest clothes, it might seem like just one good act, but when you look deeply, it actually isn't. You naturally attract people of modesty, if you are a muslim, it means you can now pray in your outfits, no need to "pray when you get home", you naturally become more approachable for responsible conversation..... people respect you more.`,
      `This is the same concept of "Ripple effect" James clear talks about in his "Atomic habits". A single act is never a single act. It is the start of a downward spiral into a deep castle with a beast who has tied up a princess that will save the king....... okay I am joking😂 It is a downward spiral basically and you eventually become a whole new person ..... not necessarily bad.`,
      `But there is good news, and the good news is See? This goes to substantiate the claim that "You can be whoever you want to be" of course with Allah(God)'s permission.`,
      `Enough wisdom for a night right.....?`,
      `Byeee`
    ] },
  { slug: 'diary-day33-read-classic', title: 'Day 33 — Read a Classic With Me', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['fiction', 'Count of Monte Cristo'], mins: 2, status: 'Published',
    content: [
      `A bright spring morning slapped the _Pharaon,_ a proud ship gliding into the harbor of Marseilles. On its deck was a young man, Edmund Dantes, tall, modest and full of life. His heart fluttered due to the excitement of coming "Home". He had just returned from a long voyage, and in his heart were three deep treasures: The loyalty he had to his father who was all he had, his loyalty to his captain and his deep love for Mercedes, a beautiful young catalan girl waiting for him.`,
      `But beneath the happy crew of sailors was an invisible smoke of darkness lurking.`,
      `As soon as the ship anchored, Edmund was hailed as a hero for taking command when the captain died at sea. The ship owner, Monsieur Morreal looked at him with admiration and said, "If I were to lose you Edmund, I would lose one of the best men in my company"`,
      `There was Danglars, the ship's supercargo wo envied the respect Edmund received so easily, the affection everyone gave him and what Edmund stood to become: the next captain at a very young age, barely twenty.`,
      `While Edmond reported honestly about the voyage, Danglars listened closely for weaknesses the way a wolf waits for an exposed throat. Then, he slipped in a comment about a "mysterious stop" the _Pharaon_ had made on the Isle of Elba.`,
      `Edmond, innocent and trusting, explained that the dying captain had ordered it, and as a loyal sailor he carried out his captain's last wish. But in the tense political climate of France, visiting Napoleon's exile island and delivering a letter even unknowingly, could sound like treason, and Danglars knew that.`,
      `Edmond didn't notice. His heart was too full. His mind too fixed on his father's embrace and Mercedes. He rushed off the ship like a young man racing toward the life he believed was finally beginning… unaware that jealousy and political fear were already twisting into a trap designed to destroy him.`,
      `Byeee`
    ] },
  { slug: 'diary-day34-read-classic-2', title: 'Day 34 — Read a Classic With Me', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['fiction', 'Count of Monte Cristo'], mins: 2, status: 'Published',
    content: [
      `Edmond Dantès hurried through the winding streets of Marseilles, the sea wind still clinging to his clothes, his heart beating with the joy of a son finally returning home. He climbed the old stairs to his father's modest apartment, imagining a warm embrace and a table set with food.`,
      `But when the door opened, Edmond froze.`,
      `His father stood before him, worn by loneliness. His clothes hung loosely, and his face was pale. Edmond's excitement cracked, and he rushed to him.`,
      `"Father… have you been unwell?"`,
      `The old man shook his head with a trembling smile. "No illness," he said, "only the quiet suffering of a man too proud to ask for help." While Edmund was away, Caderousse, a bitter neighbor, had come demanding the forty francs Edmond owed him long ago. Not wanting to stain Edmund's honor, the father paid it… with everything he had.`,
      `Edmond's heart broke.`,
      `In one instant, all his dreams of success, all his hopes for Mercedes and his future, collided with the harsh truth that life had continued without him.`,
      `But he did not show anger. He gently reassured his father. He filled his father's purse, and promised that this would never happen again. He lifted the old man's spirits with news of his future. He was to be made captain, and he would soon marry Mercedes. For a moment, their small apartment glowed with hope.`,
      `Then came a knock at the door.`,
      `Caderousse stumbled in half-drunk and red-eyed. He congratulated Edmond with a poisoned smile that Edmond's innocent soul could not quite notice yet. He praised him for becoming captain, for winning Mercedes, for earning the owner's trust… but every word tasted like bile to him and pierced into his own heart. (As if dem force am o)`,
      `And in that dimly lit room, while Edmond embraced love and joy, two shadows, Caderousse and Danglars were already stitching together threads of envy, tightening around his future, the incredible future ahead of him that no one knew.`,
      `Edmond didn't see it.
His father didn't sense it.`,
      `But we, as readers, feel the storm gathering.`,
      `Tomorrow, he will go to see Mercedes.
Tonight, the seeds of betrayal quietly take root. Ding ding.....(that's my idea of a dramatic interlude)`,
      `Byeee`
    ] },
  { slug: 'diary-day35-read-classic-3', title: 'Day 35 — Read a Classic With Me', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['fiction', 'Count of Monte Cristo'], mins: 2, status: 'Published',
    content: [
      `The sun was sliding toward the horizon when Edmond left his father's home, his heart was lighter now, full of the warmth of his reunion with his beloved. Ahead of him lay the part of his day he cherished most, Mercedes.`,
      `He walked toward the Catalans, that quiet little fishing village perched like a nest above Marseilles. The sea breeze was soft, and Edmond's steps were confident. Love does that to a person, it gives you this gentle armor, this quiet boldness.`,
      `But down below, leaning on a rock was Fernand.`,
      `Ah, Fernand......
Tall, strong, eyes dark and with dangerous jealousy. He watched Edmond climbing toward Mercedes like a man watching his treasure being taken in broad daylight.`,
      `Mercedes, dressed in simple white, ran to Edmond at the sight of him. Her face, all softness and sunshine, lit up in a way that never, not even once, lit up for Fernand.`,
      `Edmond wrapped Mercedes in his arms and they spoke and spoke. Plans, promises, wedding dreams, a future bright enough to blind a man, at the sight of Fernand He turned away with fury, he tightened his fists tight and his breath was sharp.`,
      `Mercedes, with her sharp intuition, noticed Fernand's silence.
She told him, *"You are my cousin, my brother. I love you… but not the way you want."*`,
      `Fernand accepted with his mouth but it didn't reach his heart.......`,
      `Meanwhile Edmond stood there talking passionately about their wedding next week. His happiness shone so bright it annoyed the shadows around him.`,
      `Behind a cliff nearby, Caderousse lurked drunk, and Danglars lingered quiet as a thief. The three Fernand, Danglars, and Caderousse were like three dark birds perched on a branch, watching the golden boy who had everything they wanted but could never be.`,
      `But Edmond did not see them.... and Mercedes saw only her love.`,
      `And the sea, endless and calm, pretended not to know that soon, all of this would be shattered.`,
      `For now, though, Edmond walked Mercedes home, the moon rising gently behind them, as if blessing their joy.`,
      `But behind them too…
envy sharpened its claws.`,
      `And tomorrow......
the first strike will fall.`,
      `Byeee`
    ] },
  { slug: 'diary-day36-suspense', title: 'Day 36 — I Get It, You Don\'t Like My Suspense', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['fiction', 'Count of Monte Cristo'], mins: 6, status: 'Published',
    content: [
      `Edmond Dantès stepped out of his ship onto Marseille soil as a man still kissed by the ocean. He had salt in his hair and hope in his heart, and that easy grace that makes people covetous. He was a young man at nineteen, but already the pride of the *Pharaon*: brave and hardworking and honest. He was coming home to a song, a capstan ballad of rejoicing. He was to be captain of his own ship, to marry the woman he loved, and place a wreath of joy upon his father's white head. For once, he thought, life is a gift, and it is wrapped just right.`,
      `Oh, but gifts are not the only things that attract ravenous scavengers. In the darkness, three men watched Edmond and the bright curve of his fortune with too-sharp eyes. Danglars, a banker who became sour with envy the instant Edmond was named captain of *Pharaon*. Fernand, a local fisherman in love with Mercédès who turned the blood in his veins to hatred every time her laughter met Edmond's. And Villefort, the district's new prosecutor, whose own ambitions were threatened by the contents of a letter Edmond had been stupid enough to bring home. These men were not all confederates, but they were united in jealousy like devils at midnight, and they decided to form a net and fish Edmond from the sea.`,
      `On the morning of his wedding, Dantès was arrested, accused of Bonapartist treachery, and carted away like a sack of dung while his world was torn from under him. Villefort, only interested in securing his own skin, burned the letter that could have exonerated Dantès and signed away his fortunes to a fortress-prison named Château d'If, (meaning The dungeon or prison of "what if"), a place where the sun is permitted to die and the birds are reborn. Dantès spent months or years (how many years? how many months?) in utter blackness, digging himself in fevered circles through the stone floor until his fingernails were splinters and his mind, a wasteland of anger. Days bled into nights and nights bled into days and the water they brought him each week only made him more alive, so very, very much alive.`,
      `Then one day, in the blackness, the walls whispered..... with scraping, with scratching, with the screech of life against the stone. There was a tunnel in that rock, with dust and ferns in the ceiling, and a man at the end of it -- a priest named Abbé Faria, a man smarter than the cleverest spider, a man locked in the Château for the crime of having read too many books. Abbé Faria became Dantès's tutor, his friend, his father, his prophet. In that place where men go mad, Dantès found his sanity. The Abbé taught him all he had read in the world—languages, and science, and politics, and philosophy, and theology, and all the anatomy of creation and the anatomy of men. And when that was not enough to stave away his ravenous beast of a mind, Abbé Faria gave him one final gift before death came for him: the treasure of Monte Cristo, a secret island where ships disappeared in legend, but riches lived in truth. Mountains and mountains of gold and silver and diamonds and emeralds and rubies. Enough to buy kingdoms.`,
      `When the priest died, he died in Edmond's arms, and so in his grief Edmond put on the dead man's burial sack like a cloak and pitched himself into the Mediterranean to die.(In normal english, Edmond removed the dead body of the priest and kept himself there knowing they were going to throw the sack into the sea) But the cold from the sea did not kill him; instead, it baptized him into a life of consequence. For he swam that day, toward the horizon, toward the sun, toward the world he was going to create with his own hands.`,
      `And create he did. For he found the treasure. He found it all, piled in caverns and vaults like waterfalls of coin, like sunlight spun solid, enough to wash away the stigma of his years and to reshape the world to his liking.`,
      `And so Edmond Dantès died.... In the folds of the earth, the heart of the ocean, the stars above Marseille, Edmond Dantès was buried, far away and quietly. And from the ashes of that man, something else was born, something…other. A man of such flawlessness, such smoothness of movement, such intelligence so piercing it frightened, that all who met him and had known his old life gasped in relief that it was not him. But he returned not with false face or darkened heart, but simply as one changed. To the world, he was the *Count of Monte Cristo* .`,
      `Oh, but what a count. Edmond Dantès, divested of bitterness and pain, was a figure of terrifying potential, a whirlwind and a mist. He drifted back into Paris with a polite aplomb that concealed his brilliance. He arranged the world, with patience and care, like chess pieces on a board. Danglars, already felled by his own pet avarice, fell completely, wrung dry until the fortune he had tried to strip from Edmond was stripped from him and he wandered the world broken and destitute. Fernand, younger in the count's mercy but bearing a burden none could imagine, had his career of military glory poisoned away, his past of jealousy and violence spewed in the faces of his children and his wife, and his family's love siphoned like water through sand. Fernand could not bear the mirror the count held to him, and he died by his own hand. Villefort, magisterial in his own integrity, felt the foundations of his life poisoned by the count's schemes—murders, madness, madness made manifest—and his own shine of power and justice was a coal in the ash.`,
      `The count did not cut a single throat, but he did not need to. Their own sins were larger than their lives, and all the Count of Monte Cristo needed to do was unlock the gates and let their excess run wild.`,
      `But vengeance is a thing so bitter it corrupts when swallowed whole, and in the chaos of overseeing ruin the count found himself drawn back to his old life, back to the woman he had loved. Back to Mercédès, who had aged, who had sorrowed, who had missed the ocean breeze in her hair, but who had not forgotten the scent of him, the flush of him in the noonday sun. And the count, as fierce and sharp as he had become, felt the shudder of his long-dead revenge. His heart had not beat for her, but she had not forgotten, and it seemed she had forgiven. But the years had been cruel on both of them, and the count knew with a clarity that stung his eyes that some lives cannot be saved. Some things, once broken, are better left that way.`,
      `So he let it go, the life he had longed to protect, and instead found new ways to nourish life. He restored the fortunes of the Morrel family, who had nearly collapsed in their defense of his name, and raised up new generations to replace those who had been damaged. And he found healing for himself in the purity of *Haydée,* daughter of a king who had lived and died at the count's hands. Haydée gave to him not only passion, but a sweetness that quieted his mind like gentle rain on thirsty soil.`,
      `So, in the end, when his work was done and the last piece of his heart was scrubbed clean, he left France behind. He sailed into the sunset with a crown of white hair and a golden heart and a girl at his side who loved him more than he had dared to hope. Edmond Dantès, emptied of his suffering, at last, reclaimed his soul.`,
      `Oh, and that, my audience, is the river. The whole river. One river of a story with tributaries coming in from every direction—from a man who has nothing to a man with everything, from a boy to a priest, from a captain to a count, from love to death, from living to dying.`
    ] },
  { slug: 'diary-day12-sudan', title: 'Day 12 — Sudan', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['current events'], mins: 3, status: 'Published',
    content: [
      `I don't think I've ever seen anything as horrific as what's happening in Sudan right now. I saw a man hanged from a tree, his hands tied backward to it. He screamed so loudly, I wonder if he died. I saw a woman hanged the same way, she died. People are being tied to trees, tortured, made to dig their own graves, and then told to bury themselves alive. It's beyond comprehension …… beyond words.`,
      `Honestly, it's even more horrific than what's happening in Gaza. And that's saying a lot because Gaza is already unbearable, bombs raining on people, hostages, destroyed homes, children gone too soon. But this? This is cruelty on a level I can't even wrap my head around. It's inhumane.`,
      `And I just want people to know; *you don't need money to help.* You can do so much more than you think.`,
      `Re-share the fund appeal posts.
Watch the videos at least three times.
Leave a comment, even something random about your pet, your day, summer plans, whatever. It all helps boost engagement, and that visibility saves lives.`,
      `Most of these fund videos are about Palestine, yes …. but suffering has no borders. Sudan, Congo, Yemen, they all need us.`,
      `And let's be clear: this has *never* been a religious war. It's honestly ridiculous that it even has to be said. Anyone who stands against genocide, against the murder of innocent people …… is standing for all shades of humanity. Arab, Black Arab, whoever. I've seen Native Americans and Europeans literally post about families in Gaza asking for help for them. That's what humanity looks like.`,
      `We can do a lot. And after all of that …… when you've shared, when you've watched, when you've raised awareness, *pray.*`,
      `Pray for them. Pray for the journalists who risk everything just so we can see what's really happening.`,
      `Because silence should never be an option.`
    ] },
  { slug: 'diary-day13-more-sudan', title: 'Day 13 — More Sudan', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['current events'], mins: 2, status: 'Published',
    content: [
      `I have been thinking about what to write since morning, and it all just keeps coming back to one thing.`,
      `My mind cannot erase the horror show I saw on instagram the other day.`,
      `I still cannot get over the fact the a woman and her three kids were allegedly hanged. I still cannot understand how I got to the point where Gaza is now "better" or "mild" in my eyes.`,
      `I cannot understand, I really cannot understand. I would love to go on to the next interesting thing to write but presently, my mind is just replaying and making a flashback of Sudan.`,
      `I have a request from you. Please add them to your prayers. Go online and boost engagement. Copy a long comment and paste it under the videos.`,
      `I also have a reminder for you. The only reason it is not you in the picture but another person half across Africa is just pure geographical grace. You must care, because it could be you and how piercing it would be if another person was tired of hearing about your "misfortune". If you are tired of hearing about all these people; Gaza, Congo, Yemen etc., imagine those living those conditions.`,
      `We are seeing coverage from videos and look at how terrified we are. Imagine those on the ground, seeing their mothers, their sisters, their daughters being "g-raped" in front of their eyes. Yes, that is the reality.`,
      `That's it for today.`,
      `It's so sad. Byee`
    ] },
  { slug: 'diary-day14-new-yorker', title: 'Day 14 — I Might as Well Be a New Yorker', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['politics', 'humor'], mins: 3, status: 'Published',
    content: [
      `"Do you live in New York?"
At this point I might as well do`,
      `There is this mayoral race I have been following for ages. Ages? I mean it kinda feels like it. Yesterday I even slept and left the live coverage before it started.
I am a big fan of Zeteo, you could look that up. Again, I do not agree with everything happening there but agreeing with "almost everything " is good enough.`,
      `I do not live in the US, but you know how these things are, US elections are like KNUST SRC elections, every other person on earth is concerned. I mean, at this point with everything the US government is doing, they are the president of not just the US but the whole world.`,
      `Anyway, *Zohran Mamdani* is the name. I would get on Zeteo to watch "We're not kidding", so naturally the channel comes on my FYP. What does that thing even mean, really?`,
      `Then at some point I kept seeing a younger (than mehdi) brown man on the thumbnails. I would just ignore but I kept seeing more and more until I gave in and tried to listen to what he had to say …. as if I was his target audience😂`,
      `I could go on an on about his policies and how down to earth he is and the fact that he is ridiculously younger (a millennial ) than his counterparts, I mean opponents, more outspoken than they are, and the best of all, how well spoken he is, and how always seemingly prepared he is for every debate.`,
      `None of this is juicy. Before my eyes today, and I kid you not, I saw Mehdi Hasan _fanboying_ . This man screamed so hard he has now lost his voice. And this is a sight to behold for anyone who knows the first thing about Mehdi.`,
      `I am happy for the people of New York who anticipate "fast and free" buses, and "frozen rents"`,
      `What a time it is …. to be a New Yorker!`,
      `Byee`
    ] },
  { slug: 'diary-day15-good-sleep', title: 'Day 15 — Good Sleep', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['sleep', 'reflection'], mins: 2, status: 'Published',
    content: [
      `Why am I writing this now?`,
      `Well… I didn't sleep early yesterday. That is lame too because I mean… I could have written it anytime between the morning and now right? But that's the whole point. I slept very late yesterday and I had to wake up early, just like everyone else and I slept back again. Then it went all downhill from there.`,
      `I woke up tired and barely did a useful thing today. I felt sleepy the whole day.`,
      `That is what happens when you do not know your sleep patterns and more importantly, the amount of sleep you need as a human being.`,
      `Now this is for my girlies; Again and again: What a man can do, he will do it.`,
      `Why am I saying this?
6-8 hours of sleep is what is prescribed for adults. And 8 might seem a lot, and maybe it is, but you know… if you sleep for 8 hours in 24 hours and you utilize the rest of the 16 hours of the day, that is fine enough. Is it not better than sleeping for 4 hours and being sleepy the whole day?`,
      `The ideal is that you could sleep as less as possible, and that is unique to you.`,
      `I am just joining a bunch of words that probably are the boring you at this point so tomorrow`,
      `Bye😂`
    ] },
  { slug: 'diary-day16-the-subtle', title: 'Day 16 — The Subtle', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['faith', 'reflection'], mins: 3, status: 'Published',
    content: [
      `You know those times when life is just… lifing? When everything feels upside down, and you're like, "Okay…."
That was me before, mentally, emotionally, spiritually fried. You could've roasted plantain on my anxiety.`,
      `Then, out of nowhere, things started to shift, quietly. Not with fireworks or grand gestures, but in the most random, "blink-and-you'll-miss-it" kind of ways. I didn't see it then, but now I realize that was God doing His thing , working *subtly*`,
      `You see, in Arabic, one of His names is *Al-Latīf*, meaning *The Subtle, The Gentle,* i.e The One who works behind the scenes.`,
      `Think about Prophet Joseph (Yusuf). Which by the way is my favorite story ever.`,
      `His life was one long rollercoaster: thrown into a well by his brothers, sold into slavery, jailed for something he didn't do.
This man barely could catch a break! But every single event, every tear and test, was quietly building up to something divine.`,
      `The well led to Egypt, the palace led to the prison, and the prison led to his ministry, and that led to the reunion and the realization of his dreams. Who would have thought that the Almighty was working behind the scenes for a man in prison to become the next minister of food?`,
      `Every low was just a setup for a higher good.`,
      `And honestly, that's how most of our lives go too. Sometimes you're just there, boiling your eyes and brain at 3 a.m., thinking the world's ending, when in reality, your story is still being written …. with the softest ink.
You don't always notice how God rearranges things for you until one day…. boom ….. it all makes sense.`,
      `The heartbreak (not the one you think) that made you pray harder, the delay that saved you from disaster, the "no" that led to something better.`,
      `He's subtle like that. Never rushing, never loud. Just carefully, tenderly piecing your life together while you're panicking about how it's falling apart.`,
      `So the next time something doesn't go your way, breathe and say,
"Let us enjoy this blindfold until we can see."`,
      `Because trust me, one day you'll look back and say,
"Ah, so this is why that had to happen."`,
      `And it'll all make perfect sense.`,
      `"My lord is subtle with whomever he wills"`,
      `Bye`
    ] },
  { slug: 'diary-day17-cumulative-effect-raw', title: 'Day 17 — Cumulative Effect', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['habits', 'growth'], mins: 2, status: 'Published',
    content: [
      `If you decided today not to brush your teeth, it might not make much difference. Skip it for a week, and maybe you'd start to notice. But do this for a year, and …… you'd probably be screaming in a dentist's chair, begging for mercy. That right there is the power of the cumulative effect.`,
      `When you hear someone speaking so fluently, using all the right words, you wonder, "How?" And when you meet someone cold-hearted, rude, or toxic, you wonder the same thing: "How did this person become like that?"`,
      `Oops, I just said "become." And that's the point.
Everything "becomes" from somewhere.`,
      `Nothing just pops into existence. Your parents had to teach you how to talk, slowly and patiently. You learned to read, to sing, to do everything ….. over time.`,
      `Even food doesn't appear magically; a seed must be planted, watered, and nurtured before you can harvest it.`,
      `So why do we expect to stay in toxic environments, feed on negative thoughts, surround ourselves with the wrong people, and not see the effects immediately?`,
      `You might not notice it the first week or even the first month, but eventually, it all adds up.`,
      `Because growth doesn't only happen in the right things.
It happens in the wrong things too.`,
      `Bye`
    ] },
  { slug: 'diary-day18-perspective', title: 'Day 18 — Perspective', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['habits', 'systems'], mins: 2, status: 'Published',
    content: [
      `Today whilst doing what I love doing: Watching/listening to podcasts instead of reading the self-help books I bought five hundred years ago, this guy on the podcast quoted James Clear in his very famous book Atomic Habits:`,
      `"You do not rise to the level of your potential, you fall to the level of your systems."`,
      `As usual, that sentence hits like a stray bullet for a lot of people. The speaker went on about how he optimizes his day as an entrepreneur. He explained that even tiny things like deciding what to wear or what to eat for breakfast, lunch, or dinner are delegated to his EA. Apparently, she just knows the routine: Mondays and Thursdays he fasts, so by 6 PM a particular food magically appears on his desk.`,
      `He doesn't have to battle the delivery apps or debate what to eat etc.`,
      `Now, I know what you're thinking: Okay fun story, but I don't have an EA..?`,
      `Yes. And you don't need an EA to start building good systems. That's the point. James Clear is right: you fall to the level of your systems. Iron your clothes for the week maybe, plan a meal timetable maybe , automate as many routine tasks as you can , even in small ways, it frees your brain for the things that actually matter.`,
      `if you don't build systems, you'll never really explore your potential. You'll stay stuck falling to the level of randomness and chaos, wondering why everyone else seems to have it together.`,
      `Basically, you don't rise to your potential by willpower alone. You rise because your systems are doing the heavy lifting while you're busy being… well, you.`,
      `Bye.`
    ] },
  { slug: 'diary-day19-define-yourself-yinka', title: 'Day 19 — "Define Yourself, Yinka"', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['identity'], mins: 3, status: 'Published',
    content: [
      `"Define yourself, Yinka, because if you don't, people will help you do it"`,
      `This is a statement I read from the fiction, "Yinka, where is your husband?". I mean… who would have thought there is sense in all those daydreams right? Hard to believe.`,
      `Anyway, let's _deep_ this for a moment. What does it even mean to define yourself?`,
      `I had so much interest in poetry before I got to the university. And I wrote quite a few really bad poems, but they were poems.`,
      `As soon as I got into uni, I established my identity as a poet. I would write random lines that came to mind on my status, I would share other poems, I would memorize and recite poems whenever I got the chance to, I would even suggest ways for writing good poems at poetry meetings/hangouts etc`,
      `That wasn't me at my peak… in fact far from it, that was me "faking it" till I "make it". Every single person in my Muslim community soon got to identify me by two main things, one of which was poetry.`,
      `I would write a poem to my mentor, or someone I forced to be my mentor, and he would go like "wow this line is very deep when you look at it, it reflects jjabrfksnrnxinsndbfelrb " and I'd be mad clueless….`,
      `What was interesting was that at that time, any poem I saw, I'd read it. If they asked me, "What do you do?" I would most definitely add, "I love to write anything, including poems"
If I saw a tutorial on how to write better poems, it would naturally catch my attention….`,
      `Until it became real.
… Until I started to write poems that were actually really standard level.`,
      `Yh, story time over.`,
      `My point is, this is not just my story. I know a ton of people who have literally identified themselves as "smart", "elite", "pretty" etc and they lived off the confidence. Guess what? The shoved it down people's throats so hard that the world had to succumb, and accept it as it were.`,
      `If from today, you start to own a certain identity, you are unconsciously telling your brain, and every other person's, that this is who you are, and all your mannerisms, including how you breathe, literally becomes this person.`,
      `Close your eyes and imagine that person you want to be. What kind of clothes do they wear? How do they speak? How do they smile? Who is their company? And start to live it.`,
      `Discipline is the bridge between goals and accomplishments "
Jim Rohn`,
      `Byeee`,
      `POV: Someone told me she hates my "Byee"s, two people actually`,
      `Tell me in the group if you do too`,
      `Byee😂`
    ] },
  { slug: 'diary-day20-well', title: 'Day 20 — Well...', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['faith', 'reflection'], mins: 2, status: 'Published',
    content: [
      `As you — my friends know, I write on impulse, and today, I was having a natural conversation with my younger brother about the hadith (statement of the prophet Muhammad peace be upon him):`,
      `"مِنْ حُسْنِ إِسْلَامِ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ"
(Min husni islāmil mar'i tarkuhu mā lā ya'nihi)
"Part of the perfection of a person's Islam is to leave that which does not concern him."`,
      `He knows how I have carried that hadith on my head long before I even knew it, because my mom would always say to us:`,
      `"مَنِ انشَغَلَ فِي مَا لَا يَعْنِيهِ يُطَافُ بِهِ مَا يَعْنِيهِ"
(Man inshaghala fī mā lā ya'nihi yutāfu bihi mā ya'nihi)
"Whoever busies himself with what does not concern him will be distracted from what truly concerns him."`,
      `He was agreeing with me on everything until some point. Then he said to me,
"You know......I support you and I understand you, but you know.... apart from you and what makes you happy, people matter too. Your character matters too. And character exists simply because other people exist."
He then continued,
"If it was just you, it would be okay to do what isn't necessarily haram and suits you, but you live with people."`,
      `He went on and on, and we eventually recounted the hadith(statement of the prophet Muhammad peace be upon him) that states that when a person passes on, the angels perambulate the earth, listening to what people say about them, and then they report back to Allah, and whatever the people say, it is established.`,
      `You do not just live for you. You live for every other person on earth. You also owe people a lot of things. Do not fall into that trap of saying, "I do not owe anyone any explanations." Sometimes you don't. But sometimes you do...... and sometimes you think you don't (like a lot of us), but you actually do.`,
      `You also owe people respect, "Thank you," "Please," etc.`,
      `Make of this conversation whatever you deem fit.`,
      `Byeeee (wahala for who hates byeeee😂)`
    ] },
  { slug: 'baba-sulley', title: 'The Man Who Fixed the Server Room', date: '2026', category: 'Fiction', type: 'Short Story', tags: ['fiction'], mins: 7, status: 'Published',
    content: [
      `The server room at the engineering block was not supposed to be occupied after ten pm. There was a laminated sign on the door, curling at the corner, that said so, even though it was ignored by everyone who had a key. I had a key because I was the only work-study student willing to be present during backups. As a result, every Tuesday and Thursday nite, I would sit on an upside-down bucket between two racks that buzzed like a beehive of patience, waiting for a progress bar to complete its crawl across a screen that no one else would see until morning.`,
      `Even though I never spoke to Baba Sulley, I couldn't help but notice him. Little and leisurely, he was the nite cleaner—the type of guy who would stroll through an office as if he had constructed it himself and was still debating whether or not he was happy with the results. While no one else was looking, he swept floors and straightened picture frames. He was absent from the server room at all times. That is, until that fateful nite when the AC stopped working.`,
      `The temperature was July, which is known to frighten mechanical parts. At around midnight, one of Rack 3's units began emitting an unpleasant odour that I couldn't stand It smelled distinctly like warm plastic. The emergency number that was posted for the department went to voicemail when I called it. That was the second time I dialed it. As I stood there aimlessly with my phone in my hand, Baba Sulley strode in, carrying a screwdriver as if he'd been summoned. You called for help?" he asked, as if he was asking whether I'd remembered to eat. "I called I.T. No, I really don't believe you are I.T." "I am not," he agreed, and crouched in front of the unit anyway.`,
      `Someone… mostly me, should have intervened to stop him, but I refrained, in part, because I was at a loss for what to do with my twenty-two years of life and in part, because I was intrigued by the deliberate, sure, and seemingly endless manner in which he opened the casing, as if reading a line in a language he had been familiar with for longer than I had ever even lived.`,
      `Following this, he rapidly identified a malfunctioning capacitor, just like our actual IT contractor, only that he would have took 4 hours and charged us for every minute of it. Without raising an eyebrow, he inquired as to whether the second-floor storage room had "the box of small blue ones, the ones that look like sweets."`,
      `Indeed, it did. For one thing, I was so bored in my first month that I memorized part numbers I had no idea I would need in order to catalogue that storage area on my own. So, I knew. He was so patient as he loosened the old part; my hands felt weak just watching. I dashed up two flights of stairs, retrieved the box, and dashed back down again. 'Tell me, where did you pick this up?' I had to ask, since I just couldn't help myself. He then told me he was in the class of 1979 from Kumasi Technical University.`,
      `In the weeks that followed, I figured out its true form during the downtimes between backups. In the past, when a multimeter and a dogged determination were all that was needed to isolate a malfunctioning component, Baba Sulley had honed his skills as an electronics specialist. He had previous experience working at a radio station, a printing company, and, once the machines that required his services began to vanish, he found himself employed by no particular place. The on-time pay cheque and lack of interest in explaining a forty-year gap on a non-existent resume were the deciding factors in his now eleven-year tenure as a cleaner. He fixed the cooling unit in our server room, then a UPS that kept flickering, and finally a switch that kept dropping packets in a pattern that our hired engineer said was "just old" because it was easier to say that than have to open the thing up.`,
      `I finally got around to asking him why he'd never returned to get the certification documents, and make the forty year gap appear smaller on a form. I was afraid I'd trodden on his toes because he remained silent for a while. 'Forty years cannot be examined,' he stated at last. 'I would be asked to sit down with teenagers and explain the concept of a resistor. When it comes to resistors, I've forgotten more than the test takes into account.' He said it with so much honesty and no shred of resentment whatsoever that my heart felt full again. I did not want to ruin the moment so I tucked in my tears and swallowed hard.`,
      `What I learned from him didn't fit in any of my textbooks, so I began purposefully causing him difficulties after that. It wasn't that he needed companionship; I doubt he even minded. I learned from my teachers how systems should operate, but from Baba Sulley, I learnt not only what showed that there was a problem with them, but also how to make the diagnosis and handling of them.`,
      `Just weeks before I was to graduate, he taught me something completely unrelated to technology. One sluggish Tuesday, I had griped with a professor who had publicly rejected a classmate's solution in front of the entire lab due to the student's clumsy explanation. The student's answer was perfect… just not worded 'formally' which had caused the class to laugh at the student's clumsiness and ignore the fact that it was right. Baba Sulley remained silent for some time. Afterwards, 'The truth does not always come looking like we want it to'`,
      `I kept a note of that stashed away in my phone's notes app, categorized under 'just whatever' alongside unfinished essay drafts and grocery lists, just because I couldn't find a more fitting spot for something so genuine.`,
      `I am unaware of if he is still employed there. I know he'd never stop mopping the floors, even when no one is looking. However, once or twice a semester, you may be summoned to a server room by an inexperienced work-study student who is naive enough to think they know better. In a leisurely 90 seconds, you will resolve an issue that the contractor has spent four billable hours deeming unfixable.`,
      `Whenever someone tries to describe an engineer, I can't help but think of him. I believe he would find the inquiry humorous.`
    ] },
  { slug: 'diary-01', title: 'Diary Entry — Tahajjud', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['faith', 'reflection'], mins: 3, status: 'Published',
    content: [
      `I woke up today for *Tahajjud*, the night prayer before *Fajr*, and no capping, it has become one of the best things that's ever happened to me. I mean, i try to wake up as often as possible but you know how these things are😂. There's this friend of mine who first introduced me to it after I had a terrible mental breakdown. She was the one who helped me hold me together, telling me, *"You know what? You need Tahajjud, because your case isn't easy o."*`,
      `The very next morning after that comment, me, the same person who sometimes slept through *Fajr* (which, by the way, is an awful habit), found myself awake at 4 a.m., praying to Allah. Well, *crying* would probably be a more accurate word. And strangely, it felt… peaceful. There was this calmness that I couldn't explain, and with time, the pain I had been drowning in started to fade. It happened so gradually that I couldn't even point to when exactly it left me.`,
      `My friend also advised me to seek forgiveness from Allah, that maybe my hardship was a result of something I'd done. And she wasn't wrong, in Islam, seeking forgiveness is like a cheat code for everything in life. Around that same time, I began reciting the second chapter of the Qur'an almost every day. It would take me anywhere between three to ten hours, depending on how often I had to pause to wipe my tears. I was desperate,, and I did everything, all at once.`,
      `Eventually, when things calmed a bit, I asked my friend which of these "remedies" had worked best for her. She only replied with stickers . (You know who sends stickers like her life depends on them? Yes you guessed correctly) When I pressed her, she admitted that she didn't even know, she was in the same place I was(well not exactly the same place but .... haha), and she couldn't tell which act enhanced her life.`,
      `Anyway, back to today. I've been trying to reach my Qur'an teacher for a while now, but he's been so busy. This morning, I saw him post something on his status. Naturally, I viewed it, though I recently turned off my read receipts because I just don't like people knowing I've seen their messages. It keeps my peace intact; I don't always want to be called or texted.`,
      `But what I saw broke my heart. It was a picture of a young man I knew from afar, someone familiar, and, as you can probably guess, he had passed away. Just like that. A simple stomach ache, rushed to the hospital, and gone.`,
      `He was so young, with his whole life ahead of him. And though my faith teaches me to take death with acceptance because there's still so much we can do for those who've returned to Allah, I still didn't know how to feel. I thought of his mother, and my heart sank. I remembered my mom once telling me about a woman who nearly lost her mind in a hospital, screaming, *"My son is dead? Am I dreaming?"*`,
      `So, this morning, as I prayed my tahajjud which i still have the chance to pray, I felt sorrow, for him, and maybe even more for myself. Because I see death all the time, I hear about it near and far, and yet.... I still live like someone heedless of the inevitable.`,
      `*Yaa Rabb, yassir wa la tu'assir*`
    ] },
  { slug: 'diary-day3', title: 'Day 3', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['self-knowledge', 'sleep'], mins: 3, status: 'Published',
    content: [
      `I don't exactly dislike myself. I just don't really _know_ myself. Like… people keep talking about finding what motivates you or where you learn best and all that deep, self-aware jazz, but me? I'm just here trying to figure out why I feel like three different people in a single day. _I actually do not, but it felt good writing that_`,
      `Sometimes I feel smart and unstoppable, other times I'm coding and suddenly I'm the dumbest person alive. Sometimes I'm so loud, sometimes I'm convinced I am mute. It's confusing, honestly.`,
      `A perfect example is my sleep pattern. I've always been that girl who could sleep anywhere, anytime. In high school, they called me Gom Ahlaam, I.e "Ahlaam the sleepyhead" in my local dialect. In my defense, high school was so harddddddd….. haii … like very hard.`,
      `In uni, I thought I'd fix it, you know…figure out if I'm one of those night owls or early birds or whatever they call them. But my schedule is wild. Group meetings, classes, random programs……it's chaos. I started studying at night because it was peaceful and nobody was texting me or talking to me or distracting me. But then, of course, I'd sleep through the next morning and miss half my classes….. or all of them`,
      `When I went home after third year, my mum basically became my sleep coach. Lights out at ten, up at four. No arguments. And shockingly, I actually functioned. I'd wake up early, pray, feel like an achiever before sunrise. It was magical.`,
      `Then I came back to school and …. well …. everything shattered. Suddenly, there were meetings at 10:30 p.m. and people pushing the narrative of "sleeping four hours a day" and "sleeping when everything is finished on their to do list." Please. I tried it for sometime and I would always wake up after Fajr (the dawn prayer), and my day would just be smashed, like bad jollof.`,
      `So now… I don't even pretend. If a meeting goes past ten, I'm gone. I know myself a little better now. I'm not a night grinder or a sleep warrior. I'm just a girl who needs rest to function and hates missing Fajr.`,
      `Maybe that's the start of knowing myself, and knowing that I am just a girl. What a man can do, he will do it while I sleep abeg.`,
      `It's 1:15am here by the way and I just decided to violate my sleep early rule again. Let's see what happens tomorrow. Byeeee…….`
    ] },
  { slug: 'diary-day4', title: 'Day 4 — Live by Design', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['discipline', 'faith'], mins: 2, status: 'Published',
    content: [
      `There's this podcast I used to be obsessed with……actually, who am I kidding? I still am. It's called *Righteous and Rich,* and I'm literally listening to it as I type this.`,
      `I've always lived a pretty carefree life. I don't carry things too deeply, which sounds nice until it starts affecting real stuff, like work.`,
      `"Work?" you ask. Well, I am a secretary for my Muslim student community. Somehow in school, I became the go-to person in almost every committee, even in class. I wonder why though, but it just happened.`,
      `The problem was that I took that same carefree attitude into everything. My CVs, my letters, even my assignments, they were all done in a rush, and carelessly.`,
      `I'd literally calculate how many marks I could afford to lose and go, "Eh, it will manage."`,
      `Spoiler alert: it did not manage o. That attitude cost me real opportunities, even spots in programs I really wanted. I didn't realize how much damage "it will manage" was doing to my life.`,
      `Then came Righteous and Rich. It's just a bunch of guys, mostly entrepreneurs, who talk about life, money, purpose and all that heavy stuff. I don't agree with everything they say, but yeah…. But the way they all talk, especially this one man who trains CEOs to "live by design"; He's Intense. It makes me feel useless. Like, not in an "I'm screwed" kind of way, but in an "I need to be serious with my life" kind of way.`,
      `They talk about excellence a lot, about doing things with standards. And one day, one of their guests mentioned that our Prophet Muhammad ﷺ said, "Allah loves that when any of you does a deed, he perfects it."`,
      `I was like, wait… this has been part of my faith all along?
So this is actually a thing?`,
      `Perfection in effort and performance?`,
      `Later at madrasa (Arabic school) , I had to teach this same hadith (saying of the prophet) to some kids, and I remember thinking, "I wish I'd learned this when I was their age."
Maybe I wouldn't have been so casual about life.`,
      `That podcast has rewired me. I still struggle with being too "chill," but now, when I'm working on something, I remind myself: "it's better to be late and good than early and careless."`,
      `Same time tomorrow, bye`
    ] },
  { slug: 'diary-day6-human', title: 'Day 6 — It Is So Hard To Be Human', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['reflection'], mins: 3, status: 'Published',
    content: [
      `When I say it's hard to be human, I mean it. I don't know why people laugh when I say that. I'm being dead serious. It's hard. You're supposed to look good, but not too good. Be confident and speak your mind, but don't be rude. Don't bottle up your feelings, but don't be petty either. It's like there's this invisible human handbook no one ever gave to me.`,
      `My favourite one? "Try not to offend people."`,
      `That rule never works for me. I'll be trying so hard not to offend someone, and somehow, I end up doing it anyway.`,
      `I notice the tiniest forms of disrespect, and I try to give everyone their due respect, not because I cannot be rude…. because I can be very rude, but because I believe people deserve respect.
I hate being a burden or having to ask for help, so I try to handle things myself. But then you're told, "You should have asked for help!" It's like you can't win.`,
      `In this side of the world , asking for favors can easily be thrown back in your face, so I've learned to be careful. And honestly…my instincts have been right more than once.`,
      `Then there's showing up for life; you could be having the worst day, but you still have to smile, work, and not lash out. People go through low periods every time, they lose loved ones, or lose themselves even, but work goes on, life goes on.`,
      `Coding(or more accurately, memorizing code) taught me that life isn't a playground. I'd always wish for "free time" to work on things, until I realized, there's no such thing. You ''create the time'' and by creating the time, I mean sacrificing your sleep, your friends, or your phone. Sometimes all three.`,
      `And don't even get me started on the media. Everyone's opinion sounds so right that you end up confused.
You try to mind your business, and somehow that's offensive too. Like one time I was just walking in my face veil, and this guy said, "Ei, why has she covered everywhere like that?"`,
      `Sir, that is not a productive use of your time.`,
      `It's so hard, man. Learning is hard. Working is hard. Discipline is hard. Regret is hard. Faith is hard. The anxiety of sin is hard. Losing someone to death is hard. Dying, yourself is hard. Poverty is hard. Too much money is also hard. Everything about being human feels like a full-time job sometimes.`,
      `But we have God… yeah… and that's what matters.
He sees.`,
      `Same time tomorrow. Byee`
    ] },
  { slug: 'diary-day6-gaza', title: 'Day 6 — Gaza', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['current events'], mins: 2, status: 'Published',
    content: [
      `My heart breaks for Gaza……deeply, constantly.`,
      `Since everything started, my mind hasn't rested. I've been overthinking, overanalyzing, reading, and watching everything I can. It's overwhelming.`,
      `All this talk about "October 7th, Hamas attacked first, Israel has the right to exist" that might have worked before, when most people didn't know much. But now? People see through it. The propaganda, the half-truths, the "defensive" excuses. It's everywhere, in the news, in government statements, in the way Israel constantly plays the victim card. It's alarming.`,
      `Even words like antisemitism have been twisted until they've lost meaning. They're thrown around carelessly now, often to silence truth or dodge accountability. And that other tired phrase, "It's a complicated issue." No, it isn't. Just read history. In this era, ignorance is a choice.`,
      `While following all this horror, I've grown to respect people who refuse to stay silent, people like Ken O'Keefe, who said he wouldn't join the long line of embarrassments and that he'd resist too if strangers came, stole his land, and killed his family. That honesty made me retain my faith in humanity.`,
      `But nothing hits harder than the children and the journalists. The innocent people who die every day in all kinds of ways, by hunger, by drones, by being deceived that aid is coming, or by sniper bullets.`,
      `Doctors there have said some days all the injuries of babies they treat are headshots, another day it could be shots straight to the heart, imagine… as if they are target practice. Target practice on children? How do you even process that?`,
      `Ana Kasparian said it best, it shocks the conscience that people this evil can exist. And the world just... watches. Watches as it gets worse and worse.`,
      `Names scroll through my mind: Anas Al Sharif, Saleh, Ameer, Sabreen, Khalid, Hind rajab….
So many names. Too many.`,
      `I feel so helpless, so broken. I try to imagine living there….ugh…knowing there's nowhere to hide, that death could fall from the sky or from a gun any minute, and I can't. I just can't.`,
      `May Allah(God) protect them.`
    ] },
  { slug: 'diary-day7', title: 'Day 7 — Choose Your Battles Wisely', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['reflection'], mins: 2, status: 'Published',
    content: [
      `You probably have heard of the term "Choose your battles wisely"`,
      `I had heard it a lot of times in my life, and I didn't think much of it, until one day, at a programme, one of the speakers explained it in a way I had never heard before.`,
      `He explained that in fact, it is not everything you must attend to, it is not every battle you must fight. And as every time they would mention it, I just wondered why?`,
      `I was waiting for more, because I knew this man, and he gave me more.`,
      `He explained that in war, there are several battles, some important, and some…..not really.`,
      `Point is, there are several battles of different value within a war. And to win the war, you have to win at least, most of the important ones.`,
      `In context, we as humans, have limited resources we must use wisely. Our energy, time, life, emotions, intellect, etc., are all resources given to us by the Almighty to use wisely.`,
      `You probably should fight back sometimes, you probably should behave rudely sometimes, you probably should apply to a certain programme or concert or show or whatever. But you don't have to, because you are (or more accurately you should be) an economist.
This reminds me of a saying I heard from a man (who is of course on the righteous and rich podcast) "I always consider myself a professional at life. I live life like I am paid to do it"`,
      `It is hard, but then again…. What isn't?`,
      `Same time tomorrow`,
      `Bye`
    ] },
  { slug: 'diary-day8', title: 'Day 8 — SHS Wahala', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['Ghana', 'humor'], mins: 2, status: 'Published',
    content: [
      `If you've ever attended senior high school in Ghana, even as a girl you've probably had your head shaved at some point. It's one of those traditions that makes absolutely no sense, yet we all go along with it.`,
      `Now, I know I'm treading on dangerous ground here. The topic's all over the media right now, and people have opinions …. strong ones. But hey, a little recklessness never hurt anyone, Yeah? 😂`,
      `So, here's why this came up. I was chatting with a girl currently in senior high school. She and her friends had made an international friend, white, as in American or European white.`,
      `One day, they hopped on a video call with her, talking and laughing as teenage girls do, until a teacher wandered into the frame for whatever reason.`,
      `That's when things got... interesting. The white girl suddenly started, in all seriousness, and said to the teacher, "Please tell them I'm so sorry."`,
      `Sorry? For what?`,
      `Apparently, she thought the girls had *cancer.* 😂`,
      `I mean, what else was she supposed to think? Why else would a group of cheerful teenage girls have their heads shaved clean? Okay not shaved clean but like trimmed.`,
      `There were levels to the shock that day; the teacher's, the girls', and finally mine when the story reached me.`,
      `And that — my friends, is a wrap.`,
      `Until tomorrow,
Byeee.`
    ] },
  { slug: 'diary-day9', title: 'Day 9 — Boundaries', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['boundaries'], mins: 2, status: 'Published',
    content: [
      `This concept has been a very difficult thing for me in my life.
And I am sure for many other people, they are just in my shoes too. We are told boundaries are the kind of red lines you place between you and those around you so that they could respect what makes you comfortable and protects your peace.`,
      `But just like all the other concepts, I got to see this through a different lens one day.`,
      `On my favorite podcast series this thing came up, and one of the men admitted that he really struggled with boundaries and the whole concept of maintaining them and even how they work. Apparently he had started to understand it a lot more.`,
      `He said, "If I tell you, do not do abc to me, that is not a boundary, that is a request." We can clearly see it's a request because the one being addressed is not obliged to do or not do it.`,
      `He continued "if you go ahead and do it, and I walk away or do anything befitting, that is now a boundary I have established. So the boundary is not the statement you make, it is how you stand by it."`,
      `I realized "you must have the self respect to establish your boundary when your "boundary" (or more accurately your request) is violated.`,
      `Otherwise you and your words mean nothing.`,
      `You do not necessarily have to make a big fuss or shout or whatever when establishing your boundary I learnt … from the same podcast.`,
      `But what happens if you failed to mention the requests or someone does something particularly ridiculous?
You could, just as one man from the table on that podcast once said "Look at the person with a blank face and say 'Do not ever do that to me again' "`,
      `Point is, ultimately as a person, do not say these are your red lines and just sit down when someone crosses them because they just make you look like a joke.`,
      `And what is worse is that people do not even know but subconsciously, they respect people who have boundaries. I mean I respect them, and I have seen a ton of other people respect them. But for people whom they get a free pass with, when they suddenly want to establish a "boundary" they are the bad person.`,
      `"You have changed"
"(Passive aggressive behavior)"`,
      `With all of these said, do I do this?
Well…. (Distant sniffing)`,
      `May Allah(God) be our aid.`
    ] },
  { slug: 'diary-day10', title: 'Day 10 — Storytelling', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['communication', 'storytelling'], mins: 2, status: 'Published',
    content: [
      `If I said to you for example "stop betting because it is bad for your mental health", you probably would not think much of it. You could even forget that you heard anything like that after a while.`,
      `But if I said to you, " After high school I drove an uber to save up for college, and I wanted to double up the money faster so I joined soccabet (or whatever the name is) and I stake with a quarter of the money, I was happy because it doubled. Later on, I added the other 3/4 because I thought there was a chance since the first one had worked. It all worked and I kept all the money back, only to get nothing"`,
      `That is a more relatable story and would probably live rent free in your head for the rest of your life. Maybe not the rest of your life but a long time ….. or longer than the short one would, at least.`,
      `This is what it is to be a good communicator. To be a storyteller. And by storytelling I mean a person who tells stories that are relatable and interesting.`,
      `Studies have shown that … well not studies but I guess like people's observations have shown that when a person reads a book that it written in first person for some time, they start to behave like the character. This is just how powerful storytelling can be.`,
      `Even when people say a person is "such a good liar", they essentially mean that the person is a good storyteller when they lie. I am not telling anyone here to lie … just have to clarify these days😂. but that is the whole point.`,
      `"Where have you been?"
"I was at Mariam's when her aunt came in with a cold and asked me to buy her a cold relief from the shop across the street and gskdfvkrxjdjfjsnvdkdnv"`,
      `"Okay it's okay go inside"`,
      `People talk about charisma and all… but it really is laced with empathy, and empathy … has an element of storytelling within it.`,
      `"I understand how you feel because I have ever felt this way before and it was not a good experience "`,
      `"I am so sorry this is happening to you. I would never wish this for anyone"`,
      `Storytelling…..`,
      `The next time you want someone to be captivated by your speech, try being a storyteller, but do not fill the whole place with endless stories to bore them out …. because the last thing an effective communicator would do .. is bore their audience.`,
      `Byee`
    ] },
  { slug: 'diary-day11', title: 'Day 11 — الأرواح جنود مجندة', date: '2026', category: '100 Day Challenge', type: 'Journal Entry', tags: ['human behavior'], mins: 2, status: 'Published',
    content: [
      `You would agree with me that you have met some people and you felt like you have known them for a long time before physically meeting them, or it just takes you very short time to familiarize and bond with them. You just seem to like the same things, find the same things funny, agree on almost everything etc. and some, you just don't like them at first glance.`,
      `The statement "الأرواح جنود مجندة" is a famous arabic statement which translates into "Souls are like gathered soldiers; those that recognize one another unite, and those that differ, differ"`,
      `In essence, before creation, some souls were grouped together, formed connections etc`,
      `I recently stumbled upon a book … I didn't actually stumble upon it, I heard about it from the righteous and rich podcast. It's a book called "Surrounded by idiots" ….. not a fiction book.`,
      `It is a psychology book that explains human behavior and why some humans repel each other and others attract each other.`,
      `The idea of the book "Suurounded by idiots" is that a person thinks they are surrounded by idiots just because they are a different "color"`,
      `The author categorizes individuals into "Red", "Yellow", "Green", and "Blue", each having peculiar characteristics.`,
      `The author goes on to mention that some "colors" just would not be a good match and might just have a lot of disparity between themselves etc.`,
      `It's a good book, but it just goes to affirm the quote I have known for a long time.`,
      `It might be fun to read, but it also explains why you always fight with some people, or at the least, pretend to like their company etc but hey, it is fine; Maybe your souls were not grouped into the same army. Be kind anyway.`,
      `And be balanced, do not jump into coloring people and using it to justify your attitude, and do not keep holding on by a thread.`,
      `Byeeee`
    ] },
  { slug: 'security-warning-nobody-read', title: 'A Security Warning Nobody Read', date: '2026', category: 'Cybersecurity', type: 'Essay', tags: ['usable security', 'warning fatigue'], mins: 4, status: 'Published',
    content: [
      `Right now, there's a warning on your phone that you skipped over, and not because you do not care, but just perhaps due to the fact that you have seen so much of that same boring notification "This connection is not private," "This app wants access to your contacts," "Are you sure you want to continue?" It is the same boring three or four warnings time after time, connected to activities that are almost always "harmless". After a while, you subconsciously ignore it because well… it is the same thing you keep seeing so why use your cognitive abilities on it?`,
      `"Warning weariness" is a fancy term used by the big men in security to describe this phenomenon. It is one of the more unsettling findings in usable security since it indicates that the warning accomplished its "intended purpose" but did not actually do anything. It was spot on… plain to see… and its arrival on your screen was accurate. Yet, a thing could be "technically correct" and not actually useful… unfortunately, technical people largely focus on, and allocate resources`,
      `Whenever I have to explain a security hole to someone who is not into cybersecurity or I see a fellow student hit "allow" without reading the boring paraphrases "terms and conditions", this is the exact same thing that goes through my mind. As if the issue is that individuals aren't afraid enough, the natural tendency in security is to increase the number of warnings, you know… maybe make the red font a little larger, and maybe even use more exclamation points. It is not that the humans are not afraid. For example, the message "This site's certificate is invalid" does not provide any actionable information. A warning could at least make provision explain the situation clearly, without assuming any prior knowledge of certificates, and warns that someone in the middle of you and your bank might be able to decipher your password.`,
      `Uncomfortably, this suggests that many security breaches aren't due to faulty technology or even user error, but rather to communication breakdowns costumed as technical issues. Even if a system is very secure cryptographically, it could still be vulnerable if the person interacting with it is not catered for with a warning that they could understand when multitasking or otherwise somewhat distracted.`,
      `Less warnings or more polite warnings isn't going to cut it, I would say. The warnings could be made more human, and non-technical and catchy, just perfectly for everyday people who use technology. Some "terms and conditions" do not require the level of seriousness and complexity they have. I think this is a good place to put my pen down.`

    ] },
  { slug: 'sql-injection-first-year', title: 'Explaining SQL Injection to a First-Year', date: '2026', category: 'Technical Communication', type: 'Tutorial', tags: ['teaching', 'web security'], mins: 5, status: 'Published',
    content: [
      `To a first-year student who has never heard the term "SQL injection," I think the following is the best approach to describe it.`,
      `Envision a library's front desk managed by an incredibly obedient assistant. If you were to hand a piece of paper to an assistant and write, "find me every book by Chinua Achebe," they would heed your command without inquiry or doubt. So, you've decided to be a little more daring and write, "find me every book by Chinua Achebe," rather than the usual request. Assuming this assistant is even more submissive, they will likely proceed without realizing the scope of your book request, or they may not even give it a second thought. Rest assured, their lack of thought is not malicious; it's simply that you were cunning enough to discreetly complete your request.`,
      `Your application builds a SQL query using your database, that subservient assistant, and the user-entered form data. Most search bars and login fields only accept basic data, like a name, password, or, as we used here, the title of a book. When a hacker inserts harmful code that masquerades as data but is actually sent as new instructions, it's called a SQL injection. Instead of requesting approval, the software just uploads the information to the database without any further processing.`,
      `An very basic and classic example would be a login form that uses the following query: SELECT * FROM users WHERE username = 'INPUT' AND password = 'INPUT'. Failure to implement input validation leaves the username field vulnerable to attacks such as "OR '1'='1" entered by an attacker. With the certainty that comes from knowing that "find a user where the username is blank, or where 1 equals 1" (one is always equal to one), the database joyfully returns the first account it finds. A password is unnecessary because an adversary will never be able to guess it.`,
      `Parameterized queries play a crucial role in this fix since they lock the request structure in advance and treat the user's input just as a value, not part of the command itself. They train our obedient assistant to differentiate between facts and orders. It sounds almost too simple when you consider that it has been found in actual breaches for over twenty years. That is all there is to it… embedded in the idea that a form field is only ever meant to hold the specified information.`,
      `Assuming nothing else changes, remember that you have programmed a docile assistant who will not recognize the difference between a book request and a threat until user input is supplied as an unlabeled value in a command.`

    ] },
  { slug: 'ai-analyst-trust', title: 'What I Would Trust an AI Analyst With', date: '2026', category: 'AI', type: 'Opinion', tags: ['trustworthy AI', 'cybersecurity'], mins: 4, status: 'Published',
    content: [
      `My prediction for the impact of AI on cybersecurity has been the same old "it depends entirely on what we let it decide alone." But people still keep asking. So, to be more precise, what tasks could I delegate to an AI analyst and why would I still want a person involved?`,
      `I would put my faith in it for triage purposes. labour that requires human judgement but is low-stakes per choice and involves sorting 10,000 log entries down to the 40 that appear to be abnormal is the type of labour that human analysts find exhausting. The cost of an AI over-flag is the time lost by a person trying to rule out a possibility. There's no harm in letting a model be aggressive there.`,
      `I would put my faith in it given an initial outline of an explanation. Assuming a human with a deeper understanding of the underlying finding reviews the AI system's work before it reaches a decision-maker, it is a reasonable first pass at translating a technical vulnerability report into language that a non-specialist stakeholder can actually act on. Instead of maliciousness, the risk in writing reports is generally confident error: an AI that hides an important detail because the smoother version looks better.`,
      `Without human oversight, I would not put my faith in it to decide whether to escalate an incident, disable a system, or label something as a false positive. AI is often better at pattern recognition than I am. This isn't because it's bad at it; it's because a wrong call in this area doesn't just mean "someone reads an extra paragraph." Instead, it means "a real incident gets missed" or "a production system goes dark for no reason." That's the perfect imbalance: having a human take the hit so that the question "why did you make that call" can have some weight.`,
      `In addition, I would not put my faith in it for decisions that necessitate information that was not provided to the model, such as office politics, leave status, or the identification of vulnerable systems for reasons that were not documented. Making security choices in isolation is rare, and just because an AI analyst seems confident doesn't mean it knows all the information a human on the team secretly possesses.`,
      `If there is a pattern, it's that I trust AI more with high-volume, low-stakes tasks and less with low-volume, high-stakes tasks. This is the exact opposite of how most automation pitches are put together. "Let AI handle the boring 90% and make humans work harder on the important 10%" doesn't sound like a good thing to say in marketing. After something goes wrong and someone has to explain what happened, I think this is the only type of AI-assisted security that will hold up.`

    ] },
  { slug: 'reading-people', title: 'Reading People: A Field Guide to Four Communication Styles', date: '2026', category: 'Human Behavior', type: 'Essay', tags: ['HCI', 'communication', 'psychology'], mins: 6, status: 'Published',
    content: [
      `There's a book called Surrounded by Idiots that sorts people into four colors: Red, Blue, Yellow, Green. I resisted it at first — reducing a whole person to a color felt cheap. But once I understood what each color actually meant, I couldn't unsee it in my classroom, my group chats, or myself.`,
      `Reds move like life is a race they're already late for. They interrupt because your story has too many sentences. They want the bullet points, not the build-up. "Okay, so what are we doing?" mid-meeting — that's a Red. They're not rude on purpose; they just assume everyone else is moving in slow motion. The upside: while the rest of us are still planning, a Red has already acted. Sometimes wrongly, but acted.`,
      `Blues are the opposite instinct. They want facts, sequence, precision — the trip matters more than the destination. A Blue will spot the typo you missed three drafts ago, or the 0.001-metre gap in a design nobody else noticed. They hate being rushed into a decision and they hate small talk even more. Put them on a technical team, never a decisions team, or nothing will ever get signed off. But without Blues, half of what we build would fall apart in the first two weeks.`,
      `Yellows are the ones who make a room feel warmer just by walking into it. Decisions get made because something "sounds fun," not because it's been mapped out. They talk a lot, remember the exciting 10% of a conversation, and forget the rest — not out of carelessness, but because detail was never really the point for them. Don't hand a Yellow anything time-sensitive. Do let them run the parts of a project that need energy and people skills, because nobody else in the room will sell an idea like they can.`,
      `Greens are the reason the other three colors don't destroy each other. They hate conflict, they keep the peace, and they will quietly put your needs above their own more often than is fair to them. Ask a Green if they're okay and you'll almost always hear "yes" — not because it's true, but because they'd rather absorb it than disrupt the room. They rarely change their minds once they trust someone, which makes them steady, loyal, and occasionally stubborn in ways that are hard to argue with.`,
      `No one is purely one color. Most people carry two, with the rest fading into the background. What the framework actually gave me wasn't a party trick for sorting my friends — it was a working vocabulary for something I already cared about: why two technically capable people can sit in the same meeting and completely fail to understand each other. That's not a personality quirk. That's a design problem. It's the same problem a security warning has when it's technically correct and practically useless, or a piece of documentation has when the writer and the reader are operating on different colors entirely.`,
      `Understanding the four colors didn't make me better at managing people. It made me better at noticing where communication actually breaks — which, it turns out, is most of where interesting problems live.`
    ] },
  { slug: 'story-sticks', title: 'What Makes a Story Stick', date: '2026', category: 'Technical Communication', type: 'Essay', tags: ['storytelling', 'communication'], mins: 4, status: 'Published',
    content: [
      `If I told you "stop betting, it's bad for your mental health," you'd nod and forget it within the hour. But if I told you about a university student who drove an Uber to save up for college, doubled his money once on a betting app, got greedy, staked the rest, and walked away with nothing — that story would sit with you a lot longer. Maybe not forever, but longer than the warning ever would.`,
      `That's the whole difference between information and communication. A fact is easy to state and easy to discard. A story is harder to build and much harder to forget.`,
      `I think about this constantly as someone who wants to explain technical things — a vulnerability, a security warning, a piece of code — to people who didn't ask to become experts in it. "This endpoint doesn't validate user input" is accurate and instantly forgettable. "An attacker could type a single line into this form and read every password in your database" is the same fact wearing a story's clothes, and it's the one people actually remember at 2am when they're deciding whether to patch something.`,
      `There's a reason people who read first-person narratives for long enough start to unconsciously pick up the narrator's habits — storytelling doesn't just inform, it installs itself in how you think. And there's a reason we call a good liar "a good storyteller" rather than "a good fact-fabricator" — because lying and persuading share the same machinery, minus the honesty. I'm not advocating for either one specifically. I'm pointing out that the machinery is real, and if you refuse to use it, you're not being more honest — you're just being less heard.`,
      `Charisma, when you take it apart, is mostly empathy wearing narrative structure: "I understand how you feel, because I've been there, and here's what that looked like." The next time you need someone to actually absorb what you're telling them — a warning, an idea, a piece of feedback — try handing them a story instead of a sentence. Just don't fill the room with so many stories that you bore the very audience you were trying to keep.`
    ] },
  { slug: 'first-impressions', title: 'First Impressions and the Lies Our Brains Tell Us', date: '2026', category: 'Technical Communication', type: 'Essay', tags: ['cognitive bias', 'communication'], mins: 4, status: 'Published',
    content: [
      `Your brain forms a first impression of a stranger in milliseconds — before you've consciously registered anything about them. Somewhere in that gap, your amygdala and prefrontal cortex are running a fast, ancient calculation: friend, foe, threat, opportunity. It's a leftover survival instinct from a time when "take a moment to get to know them" wasn't a luxury anyone could afford.`,
      `Two biases do most of the heavy lifting after that first impression forms. The first is the anchor: whatever piece of information you receive first becomes the baseline everything else is measured against. Tell someone a product costs ten dollars, then drop it to five, and it feels like a bargain — even if the honest value was three dollars all along. The discount is real, but the anchor is doing the persuading, not the price.`,
      `The second is confirmation bias, and it's the quieter, more stubborn one. If the first time we meet you're short with me, my brain will keep noticing every subsequent moment that fits that story and quietly discard the ones that don't — unless you give it an unreasonably large amount of evidence to update on. Perceptions shift with time. They rarely reach anything close to objective.`,
      `I used to think of this as a flaw in how people judge each other. I've come around to seeing it as a design constraint, the same way a security interface has to work around the fact that most users won't read past the first sentence of a warning. If the anchor and the first impression are doing most of the persuading regardless of what's actually true, then the responsible move isn't to wish people thought more rationally — it's to be honest about what you lead with, because that's the part that's going to stick whether you intended it to or not.`,
      `There's an old, unkind-sounding principle that people repeat about trust: it's safer to wrongly distrust someone than to wrongly trust them. I don't know that I fully agree with it. But I understand, now, why the brain is built to default to it — and why changing someone's first impression of you is one of the slowest, most deliberate kinds of work a person can do.`
    ] },
  { slug: 'on-boundaries', title: 'On Boundaries', date: '2026', category: 'Reflections', type: 'Personal essay', tags: ['boundaries', 'self-respect'], mins: 4, status: 'Published',
    content: [
      `Boundaries are one of those concepts everyone nods along to and almost no one practices well, myself included.`,
      `The clearest explanation I've heard came from someone admitting he'd struggled with the concept for years before it clicked: "If I tell you, don't do X to me — that's not a boundary, that's a request. You're not obliged to honor a request. A boundary is what happens after: if you do it anyway, and I walk away, or respond in a way that actually costs you something — that is the boundary. The boundary was never the sentence. It's what you do when the sentence gets ignored."`,
      `That reframing changed how I think about the whole idea. A boundary you don't enforce isn't a boundary — it's a wish. And the discomfort of enforcing one is the actual price of having it; there's no version where you get the protection without ever having to hold the line.`,
      `A few things I've had to relearn on the way to actually doing this:`,
      `Make it about you, not them. "I want to prioritize my rest right now" lands very differently from "you always do this," even when the underlying request is identical. The first is a boundary. The second is the opening move of an argument.`,
      `Resist the urge to explain yourself. "No" is a complete sentence, and over-explaining a decline usually reads as an apology for having needs at all — which trains people to push past the next one too.`,
      `Follow through, consistently, or don't bother stating it. A boundary you enforce once and then quietly drop is worse than no boundary — it tells people the real rule is "push hard enough and it goes away."`,
      `Watch for the difference between someone who genuinely struggles to hear "no," and someone using "I'm just taking care of myself" as cover for irresponsibility toward you. Both will resist the boundary. Only one of them is negotiating in good faith.`,
      `None of this makes boundary-setting comfortable. It just makes it survivable — and it's the only version of "protecting your peace" that actually holds up once someone tests it, which they eventually will.`
    ] },
  { slug: 'cumulative-effect', title: 'The Cumulative Effect', date: '2026', category: 'Reflections', type: 'Essay', tags: ['habits', 'growth'], mins: 3, status: 'Published',
    content: [
      `Skip brushing your teeth for one day and nothing happens. Skip it for a week and you'll start to notice. Skip it for a year and you're in a dentist's chair negotiating for mercy. None of the individual days did the damage. The accumulation did.`,
      `That's the whole idea behind the cumulative effect, and once you see it, it's hard to unsee anywhere else. When you meet someone unusually articulate, you wonder how they got there — as if fluency were a trait rather than a residue of thousands of small repetitions. When you meet someone genuinely unkind, the honest answer to "how did they get like that" is rarely a single event. It's a slow accumulation of small permissions nobody stopped.`,
      `Nothing about a person, a skill, or a habit appears from nowhere. You learned to talk because someone patiently repeated words at you for years before any of it clicked. A seed becomes food only after it's been planted, watered, and left alone long enough to do the boring, invisible work of growing. There's no shortcut version of any of this that skips the accumulation and keeps the result.`,
      `Which raises an uncomfortable question: if we accept that growth only happens through repetition and time, why do we expect to sit in a toxic environment, feed on the same negative inputs, keep the same corrosive company — and be surprised when the effects show up anyway? The absence of an immediate, visible consequence isn't evidence that nothing is happening. It's just evidence that the effect hasn't compounded yet.`,
      `Growth doesn't only happen in the direction we're rooting for. It happens in whatever direction gets repeated, good or bad, whether or not we're paying attention.`
    ] },
  { slug: 'starting-from-a-smartphone', title: 'Notes on Starting Something From a Smartphone', date: '2026', category: 'Career', type: 'Essay', tags: ['entrepreneurship', 'career'], mins: 5, status: 'Published',
    content: [
      `You don't need a bank loan, or even much capital, to start building something. What you actually need fits into three questions.`,
      `Who are you, and what do people already know you for? Before you invent a new identity, look at the one people already associate with you. Writing, teaching, organizing, a particular technical skill — whatever people already come to you for is your starting leverage, not a side note to work around.`,
      `Who do you know, and what can you borrow? You already attract people like you, which means your existing circle is closer to a target market than you think. Does a relative have a shop, a kitchen, a skill, a spare kiosk? You don't need permission to notice your own network.`,
      `Would anyone actually pay for it? This is the question people skip because the honest answer is sometimes no. Ask directly — "if I did this for you, would you pay for it right now?" — before you sink savings into an idea nobody asked for. Solving a problem people won't pay to have solved isn't a business. It's a hobby with extra steps.`,
      `Once there's an idea worth testing, a few things separate the people who follow through from the people who don't:`,
      `Start small enough to fail fast. A small, cheap failure teaches you something useful before you've risked anything that matters. A large, expensive failure just teaches you regret.`,
      `Build a portfolio before you need one. Three real examples of work — even unpaid, even for a friend's business — are worth more than a paragraph describing your potential. Nobody hires potential; they hire evidence.`,
      `Separate the business from your personal number. A dedicated payment ID isn't vanity — it's an audit trail, and it's the difference between looking like a hobby and looking like a business someone can trust with recurring money.`,
      `Set working hours and actually keep them. Being reachable at 3am doesn't read as dedication. It reads as a business with no edges, which eventually means a business with no rest.`,
      `Discipline is the real cost, because there's no lecturer, no attendance sheet, and no automatic consequence for skipping a day. Motivation gets you started, but motivation is a limited resource — it runs out exactly when things get difficult, which is precisely when discipline has to take over. The people who make it past their first hundred hours of doing something badly are the only ones who get to find out if they'd have been good at it.`
    ] },
  { slug: 'never-win-argument', title: 'Never Win an Argument', date: '2026', category: 'Technical Communication', type: 'Essay', tags: ['communication', 'conflict'], mins: 3, status: 'Published',
    content: [
      `Dale Carnegie has a line I think about often: the only way to get the best of an argument is to avoid it. He tells a story about a lawyer who spent an entire conversation proving his client had misread a clause in a contract. He won the argument, point by point, airtight. The client fired him anyway.`,
      `That's the part people miss about arguments — winning the exchange and winning the relationship are almost never the same contest. Most disagreements don't end with someone genuinely updating their mind. They end with both people more entrenched than when they started, having spent the whole conversation defending their ego instead of examining the actual disagreement. You can be right and still lose, because "right" was never really what was being contested.`,
      `I used to have an irritating habit of saying "okay" in the middle of an argument — not because I agreed, but because I'd already decided I wasn't going to fight for the point, and "okay" was the fastest way out. It used to genuinely annoy the people trying to argue with me. Eventually I swapped it for something more honest: "I'm not having this argument." Same exit, less passive-aggression, and it says the true thing out loud instead of pretending to concede.`,
      `You can't lose an argument you never enter, and you can't really win one either — not in any sense that survives the conversation. If you win it, the other person resents you. If you lose it, you resent them. The only actual win available is choosing which battles are worth the cost of entering at all, and most of them aren't.`
    ] },
  { slug: 'say-their-name', title: 'Say Their Name', date: '2026', category: 'Technical Communication', type: 'Essay', tags: ['communication'], mins: 2, status: 'Published',
    content: [
      `Someone once said a person's own name is the sweetest, most important sound in any language. I believe it, mostly because I can feel the difference myself — I'll pay far more attention to someone who greets me with "Hi, Ahlaam" than someone who greets me with "Hi, what was your name again?"`,
      `There's a reason for that beyond politeness. Hearing your own name activates a distinct part of the brain tied to self-recognition — it's not just a pleasant social nicety, it's a small, literal jolt of "you matter enough to remember." In Arabic culture this gets taken even further: people are addressed by their kunya, a name built from their child's name — "Ya Abu Abdillah," O father of Abdullah — layering identity and honor into the way you're greeted before a single sentence is spoken.`,
      `It's a small habit with an outsized return. Learn the name of the woman you buy your breakfast from. Use a colleague's name instead of "hey" when you need something from them. If you forget everything else about someone, don't forget this — it costs nothing and it's the fastest way to tell another person they were worth remembering.`
    ] },
];

// Combined list the archive page shows: published pieces first, then true placeholders.
export const writing: Piece[] = [...fullWriting, ...placeholderWriting];
