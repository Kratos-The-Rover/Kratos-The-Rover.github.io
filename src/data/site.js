// Site copy ported from the original site on `main`.
// Edit this file (and team.js / gallery.js) to update content; main.js only handles layout.

export const about = [
  `Team Kratos is a multidisciplinary team from BITS Pilani, K. K. Birla Goa Campus, started in 2018,
  aspiring to develop rovers equipped with advanced subsystems suitable for interplanetary deep space
  missions — studying the application of engineering research to rover robotics, autonomous traversal,
  and the detection of extraterrestrial life.`,
  `We're a team of 30 students from diverse backgrounds with one vision: to create groundbreaking
  innovations in the field of space exploration.`,
];

export const stats = [
  { value: '2018', label: 'Founded', countFrom: 2026 }, // counts down to the founding year
  { value: '5', label: 'Technical subsystems', countFrom: 1 },
  { value: '40+', label: 'Student engineers', countFrom: 20 },
  { value: '2', label: 'Autonomous all-terrain rovers', countFrom: 0 },
];

// `code` is set in giant letters; `side` is which edge it rises in from.
export const competitions = [
  {
    code: 'IRC',
    side: 'left',
    name: 'International Rover Challenge',
    body: [
      `SPROS IRC is a space robotics engineering competition that challenges university students to
      conceptualise, design, develop and operate an astronaut-assistive next-generation space rover and
      perform missions in Mars-simulated conditions — combining practical engineering with business
      planning and project management.`,
      `In our maiden year we stood 10th out of 35 teams, first amongst all newly participating rovers.
      In 2023 we placed 4th globally and won the "Excellence Award – Overall". We have qualified for the
      finals of IRC 2026 at Manipal Institute of Technology, Udupi (28 Jan – 2 Feb 2026).`,
    ],
    achievements: [
      { value: '10th', label: 'Of 35 teams · maiden year' },
      { value: '4th', label: 'Globally · IRC 2023' },
      { value: 'Overall', label: 'Excellence Award · IRC 2023' },
      { value: 'IRC 26', label: 'Finalists · MIT Udupi', countFrom: 22 }, // counts 22 → 26
    ],
  },
  {
    code: 'URC',
    side: 'right',
    name: 'University Rover Challenge',
    body: [
      `The University Rover Challenge is an annual competition held by the Mars Society in the desert of
      southern Utah, USA. URC challenges student teams to design and build the next generation of Mars
      rovers that will one day work alongside astronauts exploring the Red Planet.`,
      `In 2022 we qualified for the finals of the University Rover Challenge, placing us among the top 36
      teams from top universities around the world.`,
    ],
    achievements: [
      { value: 'Finals', label: 'URC 2022' },
      { value: '2nd', label: 'In Asia' },
      { value: 'Top 36', label: 'Teams worldwide' },
    ],
  },
];

export const videos = [
  { id: 'IVZa6zv74PM', title: 'System Design & Development Review', event: 'IRC 2026' },
  { id: 'ioGzhbUQDJ0', title: 'Video Presentation Review', event: 'ARC 2025' },
  { id: 'XeAp0NykUMQ', title: 'Video Presentation Review', event: 'ARC 2024' },
  { id: '3rKJc1q7uPE', title: 'System Acceptance Review', event: 'URC 2023' },
  { id: 'O5x6_6F597g', title: 'Video Presentation Report', event: 'ARC 2022' },
  { id: 'Ok03ddqfSL4', title: 'System Acceptance Review', event: 'URC 2022' },
  { id: '7ka3s3takjY', title: 'A peek into our world', event: 'Kratos' },
];

export const contact = {
  email: 'kratosbitsgoa@gmail.com',
  phones: [
    { name: 'Harman Kishnadwala', role: 'Team Lead', tel: '+919987000346', display: '+91 99870 00346' },
    { name: 'Aditya Malviya', role: 'Vice Lead', tel: '+919510362158', display: '+91 95103 62158' },
    { name: 'Isha Joshi', role: 'Operations Head', tel: '+919389975499', display: '+91 93899 75499' },
  ],
  socials: [
    { name: 'Instagram', url: 'https://www.instagram.com/kratosbitsgoa/' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/kratosbitsgoa/' },
    { name: 'Facebook', url: 'https://www.facebook.com/KratosBITSGoa/' },
  ],
};
