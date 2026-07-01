export const DAYS = [
  {
    number: 1,
    title: 'Set Up Your AI Workspace',
    task: 'Set up your AI workspace using the step-by-step checklist below.',
    type: 'checklist',
    checklist: [
      'Create a free account at claude.ai or ChatGPT (chat.openai.com) — pick one, use it for all 5 days',
      'Open your AI tool and start a new conversation',
      'Type your name and your general area of expertise into the chat (example: "My name is [name]. I have experience in [topic].")',
      'Save the link or bookmark the page so you can return to it tomorrow',
      'Set a 20-minute timer — that is all Day 1 requires',
    ],
    prompt: `My name is [YOUR NAME]. I have experience in [YOUR AREA OF EXPERTISE OR WORK]. I am going to use you to help me build a simple digital product over the next few days. For now, just confirm you understand and tell me one thing you can help me with related to [YOUR AREA OF EXPERTISE].`,
    result: 'A configured AI workspace — one tool, one active conversation, your name and expertise on file. Ready to use in 20 minutes.',
    completionCopy: "Day 1 done. That's the part most people skip.",
  },
  {
    number: 2,
    title: 'Write Your First AI-Assisted Content',
    task: 'Use the Day 2 prompt to write one piece of content about your area of expertise. Do not edit it. Do not perfect it. Just run the prompt and read what comes back.',
    type: 'prompt',
    prompt: `Write a short piece of content (200–250 words) that I could post on social media or share with someone I know. The topic is [ONE THING YOU KNOW WELL OR DO WELL IN YOUR WORK OR LIFE]. Write it in a warm, direct tone — like someone explaining something useful to a friend. Use simple sentences. No jargon. Start with a problem or observation, not with "In today's world" or "Are you ready to."`,
    result: 'One complete, usable piece of content in your voice — written by AI, shaped by what you know. This is yours. You can post it, save it, or use it as a starting point for something bigger.',
    completionCopy: "That's content. You made it. AI helped. That distinction matters.",
  },
  {
    number: 3,
    title: 'Identify Your Best Skill to Package',
    task: 'Answer the 5 questions below. Then run the AI prompt. Your result is one clearly named skill with a one-line description of who it helps and how.',
    type: 'questions',
    questions: [
      'What do people ask you for help with most often — at work, at home, in any area of your life?',
      'What have you figured out that most people around you haven\'t?',
      'What could you explain clearly to a complete beginner in 10 minutes or less?',
      'What task or skill do you do faster or better than most people you know?',
      'What would you teach someone if you had one hour and a whiteboard?',
    ],
    fallback: 'Not sure what to write? Start with Question 1. You don\'t need a business skill. You need something you actually know. That could be organizing a household, navigating a workplace, managing a health condition, cooking a specific cuisine, or anything else you\'ve done long enough to know what most people get wrong.',
    promptTemplate: `Based on my answers below, identify the one skill most worth packaging into a simple digital product. Name the skill in 4 words or fewer. Write one sentence describing who it helps and how.

My answers:
1. [Q1]
2. [Q2]
3. [Q3]
4. [Q4]
5. [Q5]

Format your response as:
Skill name: [4 words or fewer]
Who it helps and how: [One sentence]`,
    result: "One named skill. One sentence. That's it. Write it down somewhere you'll see it tomorrow.",
    completionCopy: "Day 3 is the one people come back to. You'll see why.",
  },
  {
    number: 4,
    title: 'Name and Price a Simple Offer',
    task: 'Use your Day 3 skill name and description to complete the naming formula and pricing framework below. Then run the AI prompt to get your offer named and priced.',
    type: 'pricing',
    namingFormula: `[WHO IT'S FOR] + [WHAT THEY GET] + [HOW LONG IT TAKES OR HOW EASY IT IS]

Examples:
— "The 5-Day Social Media Starter for Busy Moms"
— "The 30-Minute Meal Prep Guide for People Who Hate Cooking"
— "The Beginner's Home Organization Checklist"`,
    pricingTiers: [
      { range: '$7–$17', condition: 'Someone could complete or use this in under an hour' },
      { range: '$17–$37', condition: 'It saves someone 2–5 hours of figuring it out alone' },
      { range: '$37–$97', condition: 'It gives someone a result they\'ve been trying to get for months' },
    ],
    pricingNote: 'When in doubt, start at $17. You can always raise it. You cannot un-launch.',
    prompt: `My skill is: [PASTE DAY 3 SKILL NAME]
Who it helps: [PASTE DAY 3 ONE-SENTENCE DESCRIPTION]

Using the information above:
1. Write 3 possible names for a simple digital product based on this skill. Each name should follow this format: [who it's for] + [what they get] + [how long or how easy]. Keep each name under 10 words.
2. Recommend one price point between $7 and $97 and give one sentence explaining why.`,
    result: "A named offer. A price. One sentence describing it. You now have a real product — named, priced, and defined. It didn't exist four days ago. It does now.",
    completionCopy: "Most people spend months here. You just did it in 30 minutes.",
  },
  {
    number: 5,
    title: 'Put Your Product Into One Sentence',
    task: 'You built a product yesterday. Today you put it into words. Combine your Day 3 skill and your Day 4 offer into one sentence using the formula below. Run the AI prompt. Then write your final sentence in the space provided.',
    type: 'sentence',
    formula: `"I help [WHO] [DO WHAT] using [HOW]."

Examples:
— "I help busy moms get dinner on the table in 30 minutes using simple meal prep systems."
— "I help new managers have hard conversations using a 3-step script that actually works."
— "I help women who are done collecting AI tools build their first digital product using a 5-day system."`,
    prompt: `Using the information below, write 3 versions of a one-sentence product description in this format: "I help [WHO] [DO WHAT] using [HOW]."

My skill: [PASTE DAY 3 SKILL NAME]
Who I help: [PASTE DAY 3 DESCRIPTION OF WHO IT HELPS]
My offer: [PASTE DAY 4 OFFER NAME]

Make each sentence specific, simple, and direct. No jargon. No vague outcomes. The sentence should be something I could say out loud to a stranger at a coffee shop and have them immediately understand what I do.`,
    result: '"I help [who] [do what] using [how]." — a sentence you can use immediately. On your social profile. In your email signature. As the first line of anything you write about the product you built.',
    completionCopy: "That sentence took five days to earn. Most people never write it.",
    isFinalDay: true,
  },
];

export const LAUNCH_CHECKLIST = [
  'Screenshot your Day 5 sentence and save it somewhere you\'ll see it',
  'Update your social media bio with your sentence (or a version of it)',
  'Tell one person what you\'re building — say your sentence out loud',
  'Open your AI workspace and start a new conversation with your sentence as the context',
  'Decide: do you want to build this offer yourself, or do you want a complete system that walks you through every step? (The AI Business Blueprint™ is that system — see below)',
];

export const SHARE_CAPTION = `I just finished the 5-Day Product Proof Kit™ and here's my sentence:

"I help [YOUR SENTENCE HERE]."

Five days. One task per day. This is what I have to show for it.

If you've been circling this question — what do I build, where do I start — this Kit is $17 and it's the most useful thing I've bought this year.

theaitoolstack.com/product-proof-kit`;
