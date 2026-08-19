/**
 * MBTI-style Personality Quiz — English question and result data
 * Copyright (c) 2025 braindetox.kr
 * All rights reserved.
 *
 * Loaded BEFORE mbti_test.js. Overrides the Korean defaults.
 * The question count, option count, dimension keys (E/I, S/N, T/F, J/P)
 * and the 16 type keys must stay identical to the Korean data, or scoring breaks.
 * Wording stays in the register of tendencies, not verdicts: this is a
 * for-fun self-assessment quiz, not the official MBTI® instrument.
 */

window.MBTI_QUESTIONS = [
    {
        id: 1,
        question: "At a party or a group gathering, you mostly...",
        answers: [
            { text: "Feel energised by talking with lots of people", type: "E", score: 2 },
            { text: "Have deeper conversations with a few close friends", type: "I", score: 2 }
        ]
    },
    {
        id: 2,
        question: "When you take in new information, you...",
        answers: [
            { text: "Focus on concrete facts and details", type: "S", score: 2 },
            { text: "Think about the overall meaning and the possibilities", type: "N", score: 2 }
        ]
    },
    {
        id: 3,
        question: "When making an important decision, what matters more is...",
        answers: [
            { text: "Logical analysis and objective facts", type: "T", score: 2 },
            { text: "People's feelings and values", type: "F", score: 2 }
        ]
    },
    {
        id: 4,
        question: "In everyday life, you tend to...",
        answers: [
            { text: "Make a plan and work through it methodically", type: "J", score: 2 },
            { text: "Stay flexible and adapt as things come up", type: "P", score: 2 }
        ]
    },
    {
        id: 5,
        question: "When you meet someone new, you...",
        answers: [
            { text: "Walk over and start the conversation yourself", type: "E", score: 2 },
            { text: "Wait for the other person to speak first", type: "I", score: 2 }
        ]
    },
    {
        id: 6,
        question: "When solving a problem, you...",
        answers: [
            { text: "Draw on past experience and proven methods", type: "S", score: 2 },
            { text: "Try new ideas and creative approaches", type: "N", score: 2 }
        ]
    },
    {
        id: 7,
        question: "In a conflict, you...",
        answers: [
            { text: "Work it out logically, based on the facts", type: "T", score: 2 },
            { text: "Try to understand how each side feels", type: "F", score: 2 }
        ]
    },
    {
        id: 8,
        question: "When planning a holiday, you...",
        answers: [
            { text: "Map out a detailed itinerary in advance", type: "J", score: 2 },
            { text: "Keep it rough and improvise once you are there", type: "P", score: 2 }
        ]
    },
    {
        id: 9,
        question: "The way you recharge is to...",
        answers: [
            { text: "Spend active time together with other people", type: "E", score: 2 },
            { text: "Take quiet time on your own", type: "I", score: 2 }
        ]
    },
    {
        id: 10,
        question: "When learning something, you prefer to...",
        answers: [
            { text: "Work through it step by step", type: "S", score: 2 },
            { text: "Grasp the big picture first", type: "N", score: 2 }
        ]
    },
    {
        id: 11,
        question: "When you are criticised, you...",
        answers: [
            { text: "Analyse it objectively and look for what to improve", type: "T", score: 2 },
            { text: "Feel hurt, but try to understand what they meant", type: "F", score: 2 }
        ]
    },
    {
        id: 12,
        question: "When running a project, you...",
        answers: [
            { text: "Set deadlines and stick to the plan", type: "J", score: 2 },
            { text: "Adjust flexibly as the situation changes", type: "P", score: 2 }
        ]
    },
    {
        id: 13,
        question: "In a discussion, you...",
        answers: [
            { text: "Speak up and put your view forward readily", type: "E", score: 2 },
            { text: "Think it through carefully before you speak", type: "I", score: 2 }
        ]
    },
    {
        id: 14,
        question: "When you read, you...",
        answers: [
            { text: "Prefer practical, concrete material", type: "S", score: 2 },
            { text: "Prefer philosophical, abstract material", type: "N", score: 2 }
        ]
    },
    {
        id: 15,
        question: "On a team project, you focus on...",
        answers: [
            { text: "Efficiency and results", type: "T", score: 2 },
            { text: "Harmony and cooperation among the team", type: "F", score: 2 }
        ]
    },
    {
        id: 16,
        question: "When you go shopping, you...",
        answers: [
            { text: "Buy only what you planned to buy", type: "J", score: 2 },
            { text: "Browse and pick up whatever catches your eye", type: "P", score: 2 }
        ]
    },
    {
        id: 17,
        question: "When you are stressed, you...",
        answers: [
            { text: "Meet up with friends and talk it out", type: "E", score: 2 },
            { text: "Stay by yourself and sort out your thoughts", type: "I", score: 2 }
        ]
    },
    {
        id: 18,
        question: "The travel style you prefer is to...",
        answers: [
            { text: "Work through the famous sights and restaurants systematically", type: "S", score: 2 },
            { text: "Soak up the local culture and discover something new", type: "N", score: 2 }
        ]
    },
    {
        id: 19,
        question: "When an important call has to be made, you...",
        answers: [
            { text: "Judge on the basis of data and logic", type: "T", score: 2 },
            { text: "Judge on the basis of instinct and values", type: "F", score: 2 }
        ]
    },
    {
        id: 20,
        question: "The work environment you prefer is...",
        answers: [
            { text: "One with clear rules and structure", type: "J", score: 2 },
            { text: "One that is free and flexible", type: "P", score: 2 }
        ]
    }
];

window.MBTI_RESULTS = {
    "ENFP": {
        title: "The Free-spirited Enthusiast",
        nickname: "Campaigner",
        description: "This pattern is often described as warm, imaginative and sociable, with a knack for finding something to laugh about and something to hope for.",
        strengths: ["Easy, expressive communication", "Enthusiasm that spreads to others", "Creative and original thinking", "Curious and open to new things"],
        weaknesses: ["Attention that scatters easily", "Difficulty making or sticking to plans", "Sensitivity when under pressure", "Boredom with routine tasks"],
        careers: ["Marketing specialist", "Counsellor", "Reporter", "Writer", "Performer", "Teacher"],
        compatibility: ["INFJ (Advocate)", "INTJ (Architect)"]
    },
    "ENFJ": {
        title: "The Inspiring Idealist",
        nickname: "Protagonist",
        description: "This pattern is often described as a natural leader whose warmth and conviction tend to draw people in and give them something to aim for.",
        strengths: ["Natural leadership", "Deep empathy for others", "Persuasive communication", "Warmth and personal presence"],
        weaknesses: ["Putting others ahead of yourself", "Taking criticism to heart", "Perfectionist leanings", "Overlooking your own feelings"],
        careers: ["Teacher", "Counsellor", "Public official", "HR manager", "Coach", "Social worker"],
        compatibility: ["INFP (Mediator)", "ISFP (Adventurer)"]
    },
    "ENTP": {
        title: "The Quick-witted Debater",
        nickname: "Debater",
        description: "This pattern is often described as an innovator who enjoys an intellectual challenge and likes turning new ideas and possibilities over.",
        strengths: ["Innovative and inventive thinking", "Strong debating skills", "Quick thinking and ready wit", "Picks things up fast"],
        weaknesses: ["Boredom with routine tasks", "Details slipping past unnoticed", "Logic taking priority over feelings", "Preferring the start over the finish"],
        careers: ["Inventor", "Lawyer", "Consultant", "Entrepreneur", "Scientist", "Journalist"],
        compatibility: ["INFJ (Advocate)", "INTJ (Architect)"]
    },
    "ENTJ": {
        title: "The Bold Leader",
        nickname: "Commander",
        description: "This pattern is often described as goal-driven and decisive, moving towards an objective and bringing other people along on the way.",
        strengths: ["Decisive leadership", "Strategic thinking", "Strong focus on goals", "A drive for efficiency"],
        weaknesses: ["Overlooking how others feel", "Coming across as overly critical", "Running short on patience", "Sometimes reading as high-handed"],
        careers: ["Executive", "Manager", "Lawyer", "Investor", "Consultant", "Public official"],
        compatibility: ["INFP (Mediator)", "INTP (Logician)"]
    },
    "INFP": {
        title: "The Devoted Idealist",
        nickname: "Mediator",
        description: "This pattern is often described as idealistic and loyal, holding personal values and beliefs as something worth protecting.",
        strengths: ["Firm values and convictions", "Creative and richly imaginative", "Deep empathy for others", "Independent and self-directed"],
        weaknesses: ["Expectations that outrun reality", "Being hard on yourself", "Sensitivity to stress", "Avoiding open conflict"],
        careers: ["Writer", "Counsellor", "Artist", "Social worker", "Psychologist", "Editor"],
        compatibility: ["ENFJ (Protagonist)", "ENTJ (Commander)"]
    },
    "INFJ": {
        title: "The Insightful Advocate",
        nickname: "Advocate",
        description: "This pattern is often described as idealistic and principled, with a settled sense of what matters and why.",
        strengths: ["Sharp insight into people", "Strong intuition", "Genuine care for others", "Creative and original thinking"],
        weaknesses: ["Perfectionist leanings", "Sensitivity that can wear you down", "Expectations that outrun reality", "Digging in once you have decided"],
        careers: ["Counsellor", "Writer", "Teacher", "Researcher", "Artist", "Psychologist"],
        compatibility: ["ENFP (Campaigner)", "ENTP (Debater)"]
    },
    "INTP": {
        title: "The Curious Thinker",
        nickname: "Logician",
        description: "This pattern is often described as intellectually curious, at home with theory and drawn to problems that take some untangling.",
        strengths: ["Strong logical reasoning", "Creative problem solving", "Independent and objective", "Picks things up fast"],
        weaknesses: ["Difficulty putting feelings into words", "Ideas outpacing execution", "Awkwardness in social settings", "Little interest in routine admin"],
        careers: ["Researcher", "Scientist", "Programmer", "Professor", "Analyst", "Philosopher"],
        compatibility: ["ENTJ (Commander)", "ESTJ (Executive)"]
    },
    "INTJ": {
        title: "The Far-sighted Strategist",
        nickname: "Architect",
        description: "This pattern is often described as independent and strategic, working towards a vision of its own with unusual persistence.",
        strengths: ["Strategic thinking", "Independent and self-directed", "Decisiveness once a call is made", "Systematic and efficient"],
        weaknesses: ["Awkwardness in social settings", "Coming across as overly critical", "Holding feelings back", "Stress from perfectionism"],
        careers: ["Strategic planner", "Researcher", "Architect", "Investor", "Executive", "Consultant"],
        compatibility: ["ENFP (Campaigner)", "ENTP (Debater)"]
    },
    "ESFP": {
        title: "The Spontaneous Performer",
        nickname: "Entertainer",
        description: "This pattern is often described as lively and free-spirited, happiest when there are people around and something going on.",
        strengths: ["Easy sociability", "Positive and optimistic outlook", "Flexible and quick to adapt", "Practical and down to earth"],
        weaknesses: ["Finding planning a chore", "Concentration that drifts", "Avoiding open conflict", "Sensitivity to stress"],
        careers: ["Performer", "Salesperson", "Event planner", "Designer", "Chef", "Athlete"],
        compatibility: ["ISFJ (Defender)", "ISTJ (Logistician)"]
    },
    "ESFJ": {
        title: "The Caring Host",
        nickname: "Consul",
        description: "This pattern is often described as friendly and outgoing, inclined to look after people and keep the peace around them.",
        strengths: ["Easy sociability", "Considerate and cooperative", "A strong sense of responsibility", "Organised and methodical"],
        weaknesses: ["Taking criticism to heart", "Avoiding open conflict", "Resistance to change", "Putting your own needs last"],
        careers: ["Nurse", "Teacher", "HR manager", "Social worker", "Office manager", "Salesperson"],
        compatibility: ["ISFP (Adventurer)", "ISTP (Virtuoso)"]
    },
    "ESTP": {
        title: "The Adventurous Doer",
        nickname: "Entrepreneur",
        description: "This pattern is often described as practical and action-oriented, at its best solving problems on the spot.",
        strengths: ["Getting things done", "Keeping a level head in a crisis", "Sociable and active", "A sharp read on the situation"],
        weaknesses: ["Thin long-term planning", "Acting on impulse", "Overlooking the emotional side", "Boredom with routine work"],
        careers: ["Sales representative", "Athlete", "Entrepreneur", "Police officer", "Firefighter", "Paramedic"],
        compatibility: ["ISFJ (Defender)", "ISTJ (Logistician)"]
    },
    "ESTJ": {
        title: "The Orderly Manager",
        nickname: "Executive",
        description: "This pattern is often described as systematic and practical, valuing order and tradition and organising things so they run.",
        strengths: ["Decisive leadership", "Systematic and organised", "A strong sense of responsibility", "Realistic and practical"],
        weaknesses: ["Limited flexibility", "Overlooking the emotional side", "Resistance to change", "Keeping too tight a grip"],
        careers: ["Manager", "Civil servant", "Accountant", "Banker", "Military officer", "Judge"],
        compatibility: ["ISFP (Adventurer)", "INTP (Logician)"]
    },
    "ISFP": {
        title: "The Gentle Artist",
        nickname: "Adventurer",
        description: "This pattern is often described as mild and approachable, with an artistic streak and a quiet attachment to personal values.",
        strengths: ["A fine aesthetic sense", "Deep empathy for others", "Flexible and open-minded", "Modest and gentle in manner"],
        weaknesses: ["Not asserting yourself enough", "Finding planning a chore", "Sensitivity to stress", "A tendency to retreat from reality"],
        careers: ["Artist", "Designer", "Counsellor", "Musician", "Writer", "Photographer"],
        compatibility: ["ENFJ (Protagonist)", "ESFJ (Consul)"]
    },
    "ISFJ": {
        title: "The Warm Protector",
        nickname: "Defender",
        description: "This pattern is often described as warm and dependable, with a strong pull towards protecting and helping the people nearby.",
        strengths: ["A strong sense of responsibility", "Genuine care for others", "Steady loyalty", "Practical and down to earth"],
        weaknesses: ["Not asserting yourself enough", "Resistance to change", "Keeping stress bottled up", "Giving more than you can spare"],
        careers: ["Nurse", "Teacher", "Counsellor", "Social worker", "Office manager", "Librarian"],
        compatibility: ["ESFP (Entertainer)", "ESTP (Entrepreneur)"]
    },
    "ISTP": {
        title: "The Practical Problem-solver",
        nickname: "Virtuoso",
        description: "This pattern is often described as quiet and understated, yet notably resourceful once something actually needs fixing.",
        strengths: ["Strong practical problem solving", "Practical and down to earth", "Flexible and quick to adapt", "Independent and unconstrained"],
        weaknesses: ["Holding feelings back", "Difficulty with long-term plans", "Awkwardness in social settings", "Seeming detached from others"],
        careers: ["Technician", "Mechanic", "Engineer", "Pilot", "Surgeon", "Architect"],
        compatibility: ["ESFJ (Consul)", "ESTJ (Executive)"]
    },
    "ISTJ": {
        title: "The Dependable Realist",
        nickname: "Logistician",
        description: "This pattern is often described as careful and methodical, with a realist's respect for order and for things done properly.",
        strengths: ["A strong sense of responsibility", "Reliability others can count on", "Systematic and organised", "A sharp read on the situation"],
        weaknesses: ["Limited flexibility", "Resistance to change", "Holding feelings back", "Perfectionist leanings"],
        careers: ["Accountant", "Civil servant", "Banker", "Legal officer", "Doctor", "Manager"],
        compatibility: ["ESFP (Entertainer)", "ESTP (Entrepreneur)"]
    }
};
