const QUESTIONS = [
  {
    question: "How do you want to approach your opponent?",
    answers: [
      { text: "Rush in and never let them breathe",          tags: ["rushdown", "pressure"] },
      { text: "Control space and poke from a distance",      tags: ["keepaway", "zoner"] },
      { text: "Wait for their mistakes, then punish hard",   tags: ["punisher", "counter"] },
      { text: "Keep them guessing with unpredictable moves", tags: ["mixup", "tricky"] },
    ]
  },
  {
    //keep
    question: "How much time are you willing to spend in training mode?",
    answers: [
      { text: "I have to train...? LMFAO I have a life unfortunately",             tags: ["beginner"] },
      { text: "A decent amount I'm a casual", tags: ["intermediate"] },
      { text: "All of it and I will devote my life to this game", tags: ["advanced"] },
    ]
  },
  {
    question: "What kind of damage do you want to deal?",
    answers: [
      { text: "One massive hit that ends it",          tags: ["power"] },
      { text: "Long stylish combo strings",            tags: ["combos", "stylish"] },
      { text: "Throws and grabs",                      tags: ["grappler"] },
      { text: "Constant pressure that chips away",     tags: ["pressure"] },
    ]
  },
  {
    question: "What matters most to you in a character?",
    answers: [
      { text: "Raw power",               tags: ["power"] },
      { text: "Speed and mobility",      tags: ["rushdown", "mobile"] },
      { text: "Mind games and confusion", tags: ["tricky", "mixup"] },
      { text: "Looking stylish",         tags: ["stylish", "combos"] },
    ]
  },
  {
    question: "Do you want a weird or gimmicky character?",
    answers: [
      { text: "Yes — Give me the most disney mickey mouse club house character in the game!", tags: ["gimmicky", "unique", "tricky"] },
      { text: "No — I'm not a bum!",              tags: ["balanced", "fundamentals"] },
      { text: "Both! I want to be an honest player but the voices are getting louder...",                      tags: ["mixup", "balanced", "fundamentals"] },
    ]
  },

  // ── New 10 ───────────────────────────────────────────────────────────────────
  {
    question: "When your opponent attacks, what's your preferred response?",
    answers: [
      { text: "Evade and make them whiff",              tags: ["tricky", "mobile"] },
      { text: "Block and punish their mistake",         tags: ["punisher", "counter"] },
      { text: "Keep them out before they even get in ",  tags: ["keepaway", "zoner"] },
      { text: "I'm a masher I'll turn off my brain and let my fingers do the work (pause)",      tags: ["rushdown", "pressure"] },
    ]
  },
  {
    //keep
    question: "How do you feel about throws and command grabs?",
    answers: [
      { text: "I'm a weirdo that loves grabbing people (in game)",  tags: ["grappler", "mixup"] },
      { text: "It's alright I guess. Sometimes you have to grab people but not all the time!",   tags: ["balanced"] },
      { text: "I'm not a dorky, lame, boring, grab abuser. I want straight hands!",      tags: ["rushdown", "fundamentals"] },
    ]
  },
  {
    //keep
    question: "How do you feel about managing multiple stances?",
    answers: [
      { text: "Love it — more stances means more tools",     tags: ["tricky", "mixup", "advanced"] },
      { text: "One or two is fine I think",                          tags: ["intermediate", "balanced"] },
      { text: "Wtf is a stance?",       tags: ["beginner", "fundamentals"] },
    ]
  },
  {
    question: "How do you want to control space in a match?",
    answers: [
      { text: "Get in close and never leave",             tags: ["rushdown", "pressure"] },
      { text: "Poke and zone from mid to long range",     tags: ["keepaway", "zoner"] },
      { text: "Stay flexible and adapt to any range",     tags: ["balanced", "mobile"] },
    ]
  },
  {
    question: "When you knock an opponent down, what do you want to do?",
    answers: [
      { text: "Chase and mix them up on wake-up",          tags: ["rushdown", "mixup"] },
      { text: "Grab Them!!!",     tags: ["grappler", "tricky"] },
      { text: "Stay back and punish whatever they do",     tags: ["keepaway", "counter", "punisher"] },
      { text: "Go for the most damage possible",           tags: ["power", "combos"] },
    ]
  },
  {
    question: "Do you want a character that stands out as unique on the roster?",
    answers: [
      { text: "Yes — I want to be quirky", tags: ["unique", "gimmicky"] },
      { text: "Somewhat — just give me both I guess",    tags: ["tricky", "stylish"] },
      { text: "No — I want to be average",      tags: ["balanced", "fundamentals"] },
    ]
  },
  {
    question: "How do you feel about characters with long, technical combo routes?",
    answers: [
      { text: "Love them — I want to maximize every opening I'm not doing anything tomorrow!",   tags: ["combos", "advanced"] },
      { text: "They're fine as long as they're not too hard I have to wake up early",   tags: ["intermediate", "combos"] },
      { text: "I'd rather keep combos short and move on I don't want to think",       tags: ["power", "beginner"] },
    ]
  },
  {
    question: "What kind of fighter do you want to play as?",
    answers: [
      { text: "A male fighter",          tags: ["male"] },
      { text: "A female fighter",        tags: ["female"] },
      { text: "A robot or machine",      tags: ["machine"] },
      { text: "An animal",               tags: ["animal"] },
    ]
  },
  {
    question: "Do you want a character that uses a weapon?",
    answers: [
      { text: "Yes — Give me all the weapons!", tags: ["weapon"] },
      { text: "No — Straight hands",             tags: ["no-weapon"] },
      { text: "REF! THEY HAVE GUNS, SWORDS, AND A CHAINSAW!!!!! WTF",                    tags: [] },
    ]
  },
];
