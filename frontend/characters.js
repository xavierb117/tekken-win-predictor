const CHARACTERS = [
  {
    name: "Paul Phoenix",
    tags: ["rushdown", "power", "intermediate", "male", "no-weapon"],
    difficulty: "Intermediate",
    description: "No-nonsense brawler with one of the highest damage outputs in the game. Relies on reading what your opponent is going to do and deleting them with a single punch."
  },
  {
    name: "Lars Alexandersson",
    tags: ["rushdown", "balanced", "beginner", "mobile", "male", "no-weapon"],
    difficulty: "Beginner",
    description: "Fast and beginner-friendly with strong rushdown tools. Easy to start, stays effective at higher levels."
  },
  {
    name: "Claudio Serafino",
    tags: ["balanced", "beginner", "power", "male", "no-weapon"],
    difficulty: "Beginner",
    description: "Clean offensive game with a simple toolkit. Great for learning fundamentals without overwhelming execution."
  },
  {
    name: "Leroy Smith",
    tags: ["balanced", "beginner", "fundamentals", "keepaway", "male", "weapon"],
    difficulty: "Beginner",
    description: "Strong pokes and a forgiving kit. Leroy controls space and punishes with reliable, easy-to-land moves."
  },
  {
    name: "Clive",
    tags: ["power", "beginner", "gimmicky", "keepaway", "unique", "male", "weapon"],
    difficulty: "Beginner",
    description: "DLC character that has a Big ass sword that kills people. Have fun! (You have to pay extra to play him though)"
  },
  {
    name: "Jack-8",
    tags: ["power", "beginner", "keepaway", "machine", "weapon"],
    difficulty: "Beginner",
    description: "Slow but absolutely destructive. Every hit hurts, and his range keeps opponents at bay."
  },
  {
    name: "Kuma/Panda",
    tags: ["gimmicky", "unique", "power", "beginner", "animal", "no-weapon"],
    difficulty: "Beginner",
    description: "A giant bear with surprisingly powerful tools for some reason. Gimmicky, Mickey Mouse, and genuinely confusing to fight. *Note panda is a separate character but has similar mechanics*"
  },
  {
    name: "Jin Kazama",
    tags: ["balanced", "advanced", "fundamentals", "male", "no-weapon"],
    difficulty: "Advanced",
    description: "The Main Character of the series. Jin has answers for every situation and rewards solid fundamentals."
  },
  {
    name: "King",
    tags: ["grappler", "power", "mixup", "beginner", "male", "no-weapon"],
    difficulty: "Beginner",
    description: "Wrestling powerhouse who dominates up close with throws and chain grabs. Opponents never know what's coming. One of the most frustrating characters to go against"
  },
  {
    name: "Feng Wei",
    tags: ["rushdown", "mixup", "beginner", "power", "male", "no-weapon"],
    difficulty: "Beginner",
    description: "Aggressive with built-in evasion and hard-hitting mixups. Strong combos and overwhelming pressure the closer he is to opponents."
  },
  {
    name: "Dragunov",
    tags: ["rushdown", "pressure", "intermediate", "combos", "male", "no-weapon"],
    difficulty: "Intermediate",
    description: "Relentless pressure with powerful combo routes. Dragunov smothers opponents and never lets them reset."
  },
  {
    name: "Bryan Fury",
    tags: ["counter", "power", "advanced", "combos", "male", "no-weapon"],
    difficulty: "Intermediate",
    description: "Brutish and terrifying under pressure. Bryan dishes out massive damage and punishes reckless play."
  },
  {
    name: "Hwoarang",
    tags: ["rushdown", "pressure", "advanced", "combos", "male", "no-weapon"],
    difficulty: "Advanced",
    description: "Kick-heavy rushdown from multiple stances. Hwoarang overwhelms opponents who can't block his mix. He has over 200 moves in the game have fun!"
  },
  {
    name: "Marshall Law",
    tags: ["rushdown", "mixup", "beginner", "combos", "male", "weapon"],
    difficulty: "Beginner",
    description: "Fast, stylish, and full of high-low mixups. Well rounded character with strong defensive capabilities and offensive potential."
  },
  {
    name: "Reina",
    tags: ["rushdown", "power", "advanced", "combos", "female", "no-weapon"],
    difficulty: "Advanced",
    description: "Mishima-style aggression with strong combo routes and high damage. Great for players who want to commit."
  },
  {
    name: "Lili",
    tags: ["tricky", "stylish", "intermediate", "combos", "mobile", "female", "no-weapon"],
    difficulty: "Intermediate",
    description: "Acrobatic and stylish with evasion built into her moves. Lili punishes whiffs with elegant aerial combos."
  },
  {
    name: "Victor Chevalier",
    tags: ["mixup", "balanced", "beginner", "stylish", "male", "weapon"],
    difficulty: "Intermediate",
    description: "A stylish spy with a versatile arsenal. Victor mixes opponents up while looking effortlessly cool."
  },
  {
    name: "Jun Kazama",
    tags: ["tricky", "rushdown", "zoner", "beginner", "female", "no-weapon"],
    difficulty: "Beginner",
    description: "High damage output. A lot of stances and has projectiles (for some reason)."
  },
  {
    name: "Shaheen",
    tags: ["balanced", "fundamentals", "intermediate", "male", "no-weapon"],
    difficulty: "Intermediate",
    description: "Solid all-around fighter with no major weaknesses. The fundamentals character — clean and reliable."
  },
  {
    name: "Azucena",
    tags: ["rushdown", "mobile", "intermediate", "female", "no-weapon"],
    difficulty: "Intermediate",
    description: "Hyper-mobile with a unique coffin stance. Azucena gets in fast and pressures from unpredictable angles."
  },
  {
    name: "Leo Kliesen",
    tags: ["balanced", "mixup", "intermediate", "no-weapon"],
    difficulty: "Intermediate",
    description: "Adaptable mid-range fighter with solid mixup potential. Leo is a reliable all-rounder.*Warning your blood pressure will increase playing against this character*"
  },
  {
    name: "Eddy Gordo",
    tags: ["tricky", "beginner", "gimmicky", "mobile", "male", "no-weapon"],
    difficulty: "Intermediate",
    description: "Capoeira evasion that makes opponents swing at air. Eddy's flowchart pressure frustrates everyone."
  },
  {
    name: "Raven",
    tags: ["rushdown", "tricky", "intermediate", "mobile", "male", "weapon"],
    difficulty: "Intermediate",
    description: "Fast with teleport pressure tools. Raven rushes in and keeps opponents guessing with quick movement."
  },
  {
    name: "Kazuya Mishima",
    tags: ["mixup", "power", "advanced", "fundamentals", "male", "no-weapon"],
    difficulty: "Advanced",
    description: "The gold standard of Tekken execution. Kazuya devastates anyone who steps into his Electric Wind God Fist range."
  },
  {
    name: "Steve Fox",
    tags: ["punisher", "counter", "advanced", "male", "no-weapon"],
    difficulty: "Advanced",
    description: "A boxer who punishes mistakes with precise counter-hits. Steve's weave system rewards disciplined, reactive play."
  },
  {
    name: "Nina Williams",
    tags: ["pressure", "mixup", "intermediate", "tricky", "female", "weapon"],
    difficulty: "Advanced",
    description: "Technical assassin with devastating pressure and deep mixup routes. High skill ceiling, extremely high reward."
  },
  {
    name: "Lee Chaolan",
    tags: ["combos", "stylish", "advanced", "male", "no-weapon"],
    difficulty: "Advanced",
    description: "The most stylish character in Tekken. Lee's combo routes are among the flashiest in the game."
  },
  {
    name: "Devil Jin",
    tags: ["power", "advanced", "keepaway", "zoner", "combos", "male", "no-weapon"],
    difficulty: "Advanced",
    description: "Combines Mishima power with laser zoning tools. Devil Jin controls space and crushes anyone who steps in."
  },
  {
    name: "Ling Xiaoyu",
    tags: ["tricky", "mixup", "advanced", "mobile", "female", "no-weapon"],
    difficulty: "Advanced",
    description: "Masters confusing opponents with evasion and stance cancels. Xiaoyu terrifies anyone who faces her."
  },
  {
    name: "Alisa Bosconovitch",
    tags: ["tricky", "keepaway", "beginner", "unique", "machine", "female", "weapon"],
    difficulty: "Beginner",
    description: "She has chainsaws and she kills people with them (I'm not kidding). Alisa controls space in ways no one else can. She can also fly for some reason"
  },
  {
    name: "Zafina",
    tags: ["tricky", "advanced", "gimmicky", "mixup", "female", "weapon"],
    difficulty: "Advanced",
    description: "Three unique stances with evasive, unorthodox attacks. Zafina is one of the most unusual fighters in the game."
  },
  {
    name: "Yoshimitsu",
    tags: ["gimmicky", "tricky", "unique", "advanced", "male", "weapon"],
    difficulty: "Advanced",
    description: "Completely unpredictable — self-harm moves, teleports, and sword tricks. Yoshimitsu confuses everyone, including himself."
  },
  {
    name: "Anna Williams",
    tags: ["pressure", "mixup", "intermediate", "tricky", "female", "weapon"],
    difficulty: "Advanced",
    description: "Technical character with devastating pressure and seductive high-low mix. Anna requires dedication but delivers."
  },
  {
    name: "Heihachi Mishima",
    tags: ["punisher", "power", "advanced", "fundamentals", "male", "no-weapon"],
    difficulty: "Advanced",
    description: "The iconic Mishima patriarch. Heihachi rewards mastery with devastating punishment and trademark power."
  },
  {
    name: "Asuka Kazama",
    tags: ["punisher", "power", "beginner", "female", "no-weapon"],
    difficulty: "Beginner",
    description: "Asuka is notoriously infamous for her defensive and turn stealing tools. She is a great character for beginners to learn the game with."
  },
];
