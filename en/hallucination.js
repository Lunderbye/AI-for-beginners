// Engelska för kapitel hallucination. Nycklarna är den svenska originaltexten: ändra dem aldrig.
I18N.add("hallucination", {
  "units": {
    "KAPITEL 10": "CHAPTER 10",
    "När AI:n hittar på: <span class=\"en\" style=\"font-style:normal\">hallucinations</span>": "When the AI makes things up: <span class=\"en\" style=\"font-style:normal\">hallucinations</span>",
    "En språkmodell är byggd för att låta <b class=\"k\">trovärdig</b>, inte för att vara <b class=\"k\">sann</b>. Den kan svara självsäkert på saker den inte vet. Gissa: vilka av de här AI-svaren är sanna? Klicka för att vända korten.": "A language model is built to sound <b class=\"k\">plausible</b>, not to be <b class=\"k\">true</b>. It can answer confidently about things it doesn't know. Guess: which of these AI answers are true? Click to flip the cards.",
    "Tänk \"en extremt beläst papegoja\"": "Think \"an extremely well-read parrot\"",
    "Den har läst nästan allt, kan kombinera det briljant, men vet inte alltid vad som är sant.": "It has read almost everything and can combine it brilliantly, but it doesn't always know what's true.",
    "Andra begränsningar": "Other limitations",
    "Knowledge cutoff": "Knowledge cutoff",
    "Modellen vet bara det som fanns i träningsdatan, fram till ett visst datum.": "The model only knows what was in its training data, up to a certain date.",
    "<span class=\"en\">Bias</span> · snedvridning": "<span class=\"en\">Bias</span> · skewed views",
    "Fördomar i datan kan bli fördomar i svaren.": "Prejudice in the data can become prejudice in the answers.",
    "Känner inte din organisation": "Doesn't know your organisation",
    "Den har aldrig sett era interna dokument, rutiner eller kunder.": "It has never seen your internal documents, procedures or customers.",
    "Ojämn på exakthet": "Patchy on precision",
    "Räkning, citat och källor kan bli fel. Be om källor och kontrollera.": "Calculations, quotes and sources can go wrong. Ask for sources and check them.",
    "<b>Lösningen?</b> Ge modellen rätt fakta i stunden. Det är precis vad <span class=\"en\">RAG</span> gör, två kapitel bort.": "<b>The fix?</b> Give the model the right facts at the moment it answers. That's exactly what <span class=\"en\">RAG</span> does, two chapters from now.",
    "10 · Hallucinationer": "10 · Hallucinations"
  },
  "strings": {},
  "talk": {
    "title": "Hallucinations",
    "time": "50–54 min",
    "goal": "Make the audience consciously critical: AI sounds convincing, even when it's wrong.",
    "say": [
      "Remember: the model guesses the most <b>plausible</b> next word. Not the most <b>true</b> one. Usually that's the same thing. Sometimes it isn't.",
      "When it makes things up, we call it a <b>hallucination</b>. Let's test it: which of these four AI answers are true? Hands up.",
      "Notice the one with the source, “Lindqvist et al. 2019”. It looks really convincing, but <b>the study doesn't exist</b>. Invented sources are a classic problem.",
      "Think of AI as an <b>extremely well-read parrot</b>: it has read everything, but it doesn't always know what's true.",
      "Other limitations: the <b>knowledge cutoff</b>, <b>bias</b> from the training data, and it <b>doesn't know your organisation</b>.",
      "That last one matters most for you. And the solution is called RAG. But first we need one more idea."
    ],
    "show": [
      "Read a card aloud, let the audience guess, then flip it.",
      "Do all four."
    ],
    "ask": [
      [
        "Is it getting better over time?",
        "Yes, newer models hallucinate much less, especially when they can search or are given sources. But it never gets to zero. You always own the end result."
      ]
    ],
    "next": "How does a computer find the right document? It needs to understand meaning. That's done with embeddings."
  }
});
