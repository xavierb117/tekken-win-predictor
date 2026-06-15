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
    question: "How much time are you willing to spend in training mode?",
    answers: [
      { text: "As little as possible",              tags: ["beginner"] },
      { text: "A fair amount — I want to improve",  tags: ["intermediate"] },
      { text: "All of it — I want to master them",  tags: ["advanced"] },
    ]
  },
  {
    question: "What kind of damage do you want to deal?",
    answers: [
      { text: "One massive hit that ends it",             tags: ["power"] },
      { text: "Long stylish combo strings",               tags: ["combos", "stylish"] },
      { text: "Throws and grabs",                         tags: ["grappler"] },
      { text: "Constant pressure that chips away",        tags: ["pressure"] },
    ]
  },
  {
    question: "What matters most to you in a character?",
    answers: [
      { text: "Raw power",                    tags: ["power"] },
      { text: "Speed and mobility",           tags: ["rushdown", "mobile"] },
      { text: "Mind games and confusion",     tags: ["tricky", "mixup"] },
      { text: "Looking stylish",              tags: ["stylish", "combos"] },
    ]
  },
  {
    question: "Do you want a weird or gimmicky character?",
    answers: [
      { text: "Yes — unique and unpredictable all the way", tags: ["gimmicky", "unique", "tricky"] },
      { text: "No — clean fundamentals only",              tags: ["balanced", "fundamentals"] },
      { text: "A little bit of both",                      tags: ["mixup", "balanced"] },
    ]
  },
];
