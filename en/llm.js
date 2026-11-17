// Engelska för kapitel llm. Nycklarna är den svenska originaltexten: ändra dem aldrig.
I18N.add("llm", {
  "units": {
    "KAPITEL 6": "CHAPTER 6",
    "Språkmodeller: världens bästa ordgissare": "Language models: the world's best word guessers",
    "En <span class=\"en\">Large Language Model (LLM)</span> gör i grunden en sak: den gissar <b class=\"k\">nästa ordbit</b>, om och om igen. Först delas texten upp i <span class=\"en\">tokens</span>.": "At heart, a <span class=\"en\">Large Language Model (LLM)</span> does one thing: it guesses <b class=\"k\">the next piece of a word</b>, over and over again. First the text is split into <span class=\"en\">tokens</span>.",
    "1 · Text blir tokens": "1 · Text becomes tokens",
    "Hej! Jag heter Anna och jag tycker om kanelbullar.": "Hi! My name is Anna and I love cinnamon buns.",
    "<b id=\"tokN\">0</b> tokens": "<b id=\"tokN\">0</b> tokens",
    "<b id=\"tokC\">0</b> tecken": "<b id=\"tokC\">0</b> characters",
    "<b id=\"tokR\">0</b> tecken/token": "<b id=\"tokR\">0</b> characters/token",
    "Förenklad illustration. Svenska ord delas ofta i fler bitar än engelska, eftersom modellerna mest tränats på engelska.": "Simplified illustration. Long or unusual words are split into several pieces. Swedish and many other languages often need more tokens than English, because the models were mostly trained on English.",
    "2 · Gissa nästa token": "2 · Guess the next token",
    "Temperature": "Temperature",
    "✨ Låt AI:n välja": "✨ Let the AI choose",
    "↺ Börja om": "↺ Start over",
    "6 · Språkmodeller": "6 · Language models"
  },
  "strings": {
    "Låg temperatur: förutsägbar, väljer nästan alltid det vanligaste ordet.": "Low temperature: predictable, almost always picks the most common word.",
    "Mellan: balanserat. Det här är standardläget i de flesta chattar.": "Medium: balanced. This is the default in most chat apps.",
    "Hög temperatur: kreativ, överraskande, och ibland konstig.": "High temperature: creative, surprising, and sometimes weird."
  },
  "talk": {
    "title": "Language models",
    "time": "28–34 min",
    "goal": "The core idea: an LLM guesses the next token. Explain tokens and temperature.",
    "say": [
      "Here comes the most important insight of the whole talk: at heart, a language model does <b>just one thing</b>. It guesses <b>the next piece of a word</b>. Then the next. Then the next.",
      "First the text is split into <b>tokens</b>, pieces of words. Feel free to type something yourselves. Common words become one token, unusual words get split up.",
      "Swedish and many other languages often turn into more tokens than English, because the models were mostly trained on English. That affects both the price and how much fits in.",
      "On the right: the model sees “Sweden is known for its …” and works out a <b>probability</b> for every possible next word. Nature, forests, design …",
      "I can choose myself, or let the AI choose. It doesn't always pick the most likely one; there's a bit of randomness.",
      "That randomness is controlled by <b>temperature</b>. Low temperature: boring but reliable. High: creative, and eventually nonsense. Drag the slider.",
      "So when ChatGPT writes a long answer, it's <b>thousands of these guesses in a row</b>. That's why it appears word by word on the screen."
    ],
    "show": [
      "Type a word of your own in the token box, ideally a long Swedish compound word (“kanelbullebageri”, cinnamon bun bakery) and compare it with the English.",
      "Press ✨ Let the AI choose a few times.",
      "Drag the temperature to 0.1, then to 2.0, and compare."
    ],
    "backstage": [
      "The tokenisation is a simplified illustration, not a real BPE tokeniser. Real tokenisers (e.g. tiktoken) split text differently.",
      "The probabilities in the word guesser are made up for teaching purposes."
    ],
    "ask": [
      [
        "Does it understand what it's saying?",
        "That's a philosophical question researchers don't agree on. In practice: it has learnt an incredible amount about how language and the world fit together, but it can still be wrong with complete confidence."
      ]
    ],
    "next": "But how does a word guesser become a helpful assistant?"
  }
});
