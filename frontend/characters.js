const CHARACTERS = [
  {
    name: "Paul Phoenix",
    tags: ["rushdown", "power", "beginner", "male", "no-weapon"],
    difficulty: "Beginner",
    description: "No-nonsense brawler with one of the highest damage outputs in the game. Relies on reading what your opponent is going to do and deleting them with a single punch."
  },
  {
    name: "Lars Alexandersson",
    tags: ["rushdown", "balanced", "intermediate", "mobile", "male", "no-weapon"],
    difficulty: "Intermediate",
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
    description: "Goffy ass character. Huge hit box and no one ever plays him but he's funny."
  },
  {
    name: "Kuma/Panda",
    tags: ["gimmicky", "unique", "power", "beginner", "animal", "no-weapon"],
    difficulty: "Beginner",
    description: "A giant bear that does a lot of damage. The least played characters in the game and they're kinda corny. *Note panda is a separate character but has similar mechanics*"
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
    description: "Wrestling furry powerhouse from Mexico who dominates up close by grabbing you. One of the most hated characters in the game. *Note: You will be hated for playing this character* **Extra note: I already hate you for considering this character"
  },
  {
    name: "Feng Wei",
    tags: ["rushdown", "mixup", "beginner", "power", "male", "no-weapon"],
    difficulty: "Beginner",
    description: "Aggressive with built-in evasion and hard-hitting mixups. Strong combos and overwhelming pressure the closer he is to opponents."
  },
  {
    name: "Dragunov",
    tags: ["rushdown", "pressure", "beginner", "combos", "male", "no-weapon"],
    difficulty: "Beginner",
    description: "Relentless pressure with powerful combo routes. Dragunov smothers opponents and never lets them reset."
  },
  {
    name: "Bryan Fury",
    tags: ["counter", "power", "advanced", "combos", "male", "no-weapon"],
    difficulty: "Advanced",
    description: "This Character relies on waiting for the right moment to strike and deleting opponents. One of the coolest characters in the game and has high execution."
  },
  {
    name: "Hwoarang",
    tags: ["rushdown", "pressure", "advanced", "combos", "male", "no-weapon"],
    difficulty: "Advanced",
    description: "Kick-heavy rushdown from multiple stances. Hwoarang overwhelms opponents who can't block his mix. He has over 200 moves in the game have fun!"
  },
  {
    name: "Marshall Law",
    tags: ["rushdown", "mixup", "beginner", "male", "weapon"],
    difficulty: "Beginner",
    description: "Fast, stylish, and full of high-low mixups. Well rounded character with strong defensive capabilities and offensive potential."
  },
  {
    name: "Reina",
    tags: ["rushdown", "power", "advanced", "combos", "female", "no-weapon"],
    difficulty: "Advanced",
    description: "Mishima-style aggression with strong combo routes and high damage. Great for players who want to commit. RJ's main btw"
  },
  {
    name: "Lili",
    tags: ["tricky", "intermediate", "combos", "mobile", "female", "no-weapon"],
    difficulty: "Intermediate",
    description: "Acrobatic and stylish with evasion built into her moves. Lili punishes whiffs with elegant aerial combos."
  },
  {
    name: "Victor Chevalier",
    tags: ["mixup", "balanced", "beginner", "stylish", "male", "weapon"],
    difficulty: "Beginner",
    description: "A french super spy with a versatile arsenal. He's pretty much an older John wick from France and can teleport."
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
    description: "Solid all-around fighter with no major weaknesses he's just kinda boring. The fundamentals character — clean and reliable."
  },
  {
    name: "Azucena",
    tags: ["rushdown", "mobile", "intermediate", "female", "no-weapon","stylish"],
    difficulty: "Intermediate",
    description: "Azucena gets in fast and pressures from unpredictable angles. She also dances while fighting for some reason. "
  },
  {
    name: "Leo Kliesen",
    tags: ["balanced", "mixup", "intermediate", "no-weapon"],
    difficulty: "Intermediate",
    description: "Leo is a reliable all-rounder. He has a passive that effects your oppenent in real life. It increases their blood pressure and makes them more likely to throw hands with you in real life at a moment's notice. Be careful when playing this character."
  },
  {
    name: "Eddy Gordo",
    tags: ["tricky", "beginner", "gimmicky", "mobile", "male", "no-weapon"],
    difficulty: "Intermediate",
    description: "Brazilian Capoeira conosuer that makes opponents swing at air. Eddy's flowchart pressure frustrates everyone. You are a freak if you pick this character no offense."
  },
  {
    name: "Raven",
    tags: ["rushdown", "tricky", "intermediate", "mobile", "male", "weapon"],
    difficulty: "Intermediate",
    description: "A ninja with fast with teleport pressure tools. Raven rushes in and keeps opponents guessing with quick movement."
  },
  {
    name: "Kazuya Mishima",
    tags: ["mixup", "power", "advanced", "fundamentals", "male", "no-weapon"],
    difficulty: "Advanced",
    description: "The gold standard of Tekken execution. All Kazuya mains are respectable upstanding hard working citizens."
  },
  {
    name: "Steve Fox",
    tags: ["punisher", "counter", "intermediate", "male", "no-weapon"],
    difficulty: "Intermediate",
    description: "A boxer who punishes mistakes with precise counter-hits. Steve's weave system rewards disciplined, reactive play."
  },
  {
    name: "Nina Williams",
    tags: ["pressure", "mixup", "intermediate", "tricky", "female", "weapon"],
    difficulty: "Intermediate",
    description: "She's an assassin with a lot of pressure and fast attacks. Very strong character. She also brought guns for some reason."
  },
  {
    name: "Lee Chaolan",
    tags: ["combos", "stylish", "advanced", "male", "no-weapon"],
    difficulty: "Advanced",
    description: "Lee's combo routes are among the flashiest in the game. He also has some funny voice lines."
  },
  {
    name: "Devil Jin",
    tags: ["power", "advanced", "keepaway", "zoner", "combos", "male", "no-weapon"],
    difficulty: "Advanced",
    description: "Edgiest character in the game. A devil version of the main character but one of the hardest characters to pick up though."
  },
  {
    name: "Ling Xiaoyu",
    tags: ["tricky", "mixup", "intermediate", "mobile", "female", "no-weapon"],
    difficulty: "Intermediate",
    description: "Masters confusing opponents with evasion and stance cancels. Xiaoyu hugs and kisses the ground when fighting which makes her borderline impossible to hit."
  },
  {
    name: "Alisa Bosconovitch",
    tags: ["tricky", "keepaway", "beginner", "unique", "machine", "female", "weapon"],
    difficulty: "Beginner",
    description: "One of the easiest characters to pick up. She has chainsaws and she kills people with them (I'm not kidding). Alisa controls space in ways no one else can. She can also fly for some reason"
  },
  {
    name: "Zafina",
    tags: ["tricky", "advanced", "gimmicky", "mixup", "female", "weapon"],
    difficulty: "Advanced",
    description: "For some ungodly reason, Zafina is a character that defies all logic and common sense. She crawls on the floor while fighting you so good luck trying to hit this freak"
  },
  {
    name: "Yoshimitsu",
    tags: ["gimmicky", "tricky", "unique", "advanced", "male", "weapon"],
    difficulty: "Advanced",
    description: "I assume the developers were on Methamphetamine when creating this character. This is a samurai cyborg undead ninja that can fly, teleport, heal himself, kill himself, and the weirdest character in the game. When you play him you will understand what I mean."
  },
  {
    name: "Anna Williams",
    tags: ["pressure", "mixup", "intermediate", "tricky", "female", "weapon"],
    difficulty: "Intermediate",
    description: "Technical character with devastating pressure and seductive high-low mix. She has a bazooka for some reason, must've slipped by the ref I guess"
  },
  {
    name: "Heihachi Mishima",
    tags: ["punisher", "power", "advanced", "fundamentals", "male", "no-weapon"],
    difficulty: "Advanced",
    description: "The iconic Mishima patriarch. Heihachi rewards mastery with devastating punishment and trademark power. He costs extra money to play him though"
  },
  {
    name: "Asuka Kazama",
    tags: ["punisher", "power", "beginner", "female", "no-weapon"],
    difficulty: "Beginner",
    description: "Asuka is notoriously infamous for her defensive and turn stealing tools. She is a great character for beginners to learn the game with."
  },
];
