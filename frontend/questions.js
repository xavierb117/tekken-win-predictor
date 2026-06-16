const QUESTIONS = [
  // ── Original 5 ───────────────────────────────────────────────────────────────
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
      { text: "As little as possible",             tags: ["beginner"] },
      { text: "A fair amount — I want to improve", tags: ["intermediate"] },
      { text: "All of it — I want to master them", tags: ["advanced"] },
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
      { text: "Yes — unique and unpredictable all the way", tags: ["gimmicky", "unique", "tricky"] },
      { text: "No — clean fundamentals only",              tags: ["balanced", "fundamentals"] },
      { text: "A little bit of both",                      tags: ["mixup", "balanced"] },
    ]
  },

  // ── New 10 ───────────────────────────────────────────────────────────────────
  {
    question: "How important is speed and mobility to you?",
    answers: [
      { text: "Very — I need to move faster than my opponent",   tags: ["mobile", "rushdown"] },
      { text: "Somewhat — a few movement options are nice",      tags: ["balanced", "mobile"] },
      { text: "Not a priority — I win on reads and power",       tags: ["power", "fundamentals"] },
    ]
  },
  {
    question: "When your opponent attacks, what's your preferred response?",
    answers: [
      { text: "Evade and make them whiff",              tags: ["tricky", "mobile"] },
      { text: "Block and punish their mistake",         tags: ["punisher", "counter"] },
      { text: "Keep them out before they even get in",  tags: ["keepaway", "zoner"] },
      { text: "Interrupt them with my own attack",      tags: ["rushdown", "pressure"] },
    ]
  },
  {
    question: "How do you feel about throws and command grabs?",
    answers: [
      { text: "I want them as a core part of my game",  tags: ["grappler", "mixup"] },
      { text: "Nice to have, but not the main focus",   tags: ["balanced"] },
      { text: "I'd rather stick to striking only",      tags: ["rushdown", "fundamentals"] },
    ]
  },
  {
    question: "How do you feel about managing multiple stances?",
    answers: [
      { text: "Love it — more stances means more tools",     tags: ["tricky", "mixup", "advanced"] },
      { text: "One or two is fine",                          tags: ["intermediate", "balanced"] },
      { text: "Keep it simple — one stance is enough",       tags: ["beginner", "fundamentals"] },
    ]
  },
  {
    question: "What would make you feel most satisfied after a win?",
    answers: [
      { text: "Ending it with one massive damage hit",          tags: ["power"] },
      { text: "Landing a long, flashy combo",                   tags: ["combos", "stylish"] },
      { text: "Landing a grab they had no answer for",          tags: ["grappler"] },
      { text: "Confusing them so badly they didn't know what hit them", tags: ["tricky", "gimmicky", "mixup"] },
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
      { text: "Go for a grab or throw as they get up",     tags: ["grappler", "tricky"] },
      { text: "Stay back and punish whatever they do",     tags: ["keepaway", "counter", "punisher"] },
      { text: "Go for the most damage possible",           tags: ["power", "combos"] },
    ]
  },
  {
    question: "Do you want a character that stands out as unique on the roster?",
    answers: [
      { text: "Yes — I want to play someone no one else plays", tags: ["unique", "gimmicky"] },
      { text: "Somewhat — a few unique tools would be cool",    tags: ["tricky", "stylish"] },
      { text: "No — I want something reliable and proven",      tags: ["balanced", "fundamentals"] },
    ]
  },
  {
    question: "How do you feel about characters with long, technical combo routes?",
    answers: [
      { text: "Love them — I want to maximize every opening",   tags: ["combos", "advanced"] },
      { text: "They're fine as long as they're not too hard",   tags: ["intermediate", "combos"] },
      { text: "I'd rather keep combos short and move on",       tags: ["power", "beginner"] },
    ]
  },
  {
    question: "Last one — pick the word that best describes how you want to win:",
    answers: [
      { text: "Overwhelming",  tags: ["rushdown", "pressure"] },
      { text: "Decisive",      tags: ["punisher", "counter", "power"] },
      { text: "Unpredictable", tags: ["mixup", "tricky", "gimmicky"] },
      { text: "Dominant",      tags: ["fundamentals", "balanced", "combos"] },
    ]
  },
];
