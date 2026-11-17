// Engelska för kapitel traning. Nycklarna är den svenska originaltexten: ändra dem aldrig.
I18N.add("traning", {
  "units": {
    "KAPITEL 7": "CHAPTER 7",
    "Från internet till assistent: fyra steg": "From the internet to an assistant: four steps",
    "En chatbot föds inte färdig. Den läser först enorma mängder text, lär sig sedan vara hjälpsam, och får till sist feedback från människor. Klicka igenom stegen.": "A chatbot isn't born ready. First it reads enormous amounts of text, then it learns to be helpful, and finally it gets feedback from people. Click through the steps.",
    "7 · Så tränas en LLM": "7 · How an LLM is trained"
  },
  "strings": {
    "Förträning": "Pre-training",
    "Finjustering": "Fine-tuning",
    "Mänsklig feedback": "Human feedback",
    "Användning": "Use",
    "Modellen läser en enorm mängd text: webbsidor, böcker, artiklar och kod. Uppgiften är hela tiden densamma: <b class='k'>gissa nästa ord</b>. Varje fel justerar miljarder små rattar (<span class='en'>parameters</span>). Det tar månader, tusentals GPU:er och kan kosta miljarder kronor.": "The model reads an enormous amount of text: web pages, books, articles and code. The task is always the same: <b class='k'>guess the next word</b>. Every mistake adjusts billions of tiny dials (<span class='en'>parameters</span>). It takes months and thousands of GPUs, and can cost billions of SEK.",
    "Resultat: en modell som kan språk, men som bara fortsätter text.": "Result: a model that knows language, but only continues text.",
    "Nu tränas modellen på tusentals exempel på bra frågor och svar, skrivna av människor. Den lär sig att vara en <b class='k'>hjälpsam assistent</b> i stället för att bara fortsätta texten.": "Now the model is trained on thousands of examples of good questions and answers, written by people. It learns to be a <b class='k'>helpful assistant</b> instead of just continuing the text.",
    "Resultat: den svarar på frågor i stället för att fylla på dem.": "Result: it answers questions instead of adding more of them.",
    "Människor jämför olika svar och väljer det bästa. Modellen belönas för svar som är <b class='k'>hjälpsamma, ärliga och säkra</b>. <span class='en'>Reinforcement Learning from Human Feedback</span>.": "People compare different answers and choose the best one. The model is rewarded for answers that are <b class='k'>helpful, honest and safe</b>. <span class='en'>Reinforcement Learning from Human Feedback</span>.",
    "Resultat: bättre ton, färre farliga eller dumma svar.": "Result: a better tone, fewer dangerous or silly answers.",
    "När du chattar <b class='k'>lär sig modellen ingenting nytt</b>. Rattarna är låsta. Den använder bara det den redan kan, och skriver svaret en token i taget.": "When you chat, <b class='k'>the model learns nothing new</b>. The dials are locked. It only uses what it already knows, and writes the answer one token at a time.",
    "Därför vet den inget om det som hänt efter träningen (knowledge cutoff).": "That's why it knows nothing about what happened after training (knowledge cutoff).",
    "AI · 🔒 VIKTERNA ÄR LÅSTA": "AI · 🔒 THE WEIGHTS ARE LOCKED",
    "Självklart! Här kommer ett förslag på en kort och trevlig inbjudan till fredagsfikan …": "Of course! Here's a suggestion for a short, friendly invitation to Friday fika …"
  },
  "talk": {
    "title": "How an LLM is trained",
    "time": "34–38 min",
    "goal": "Four steps: pre-training, fine-tuning, RLHF, inference. And: it doesn't learn while you chat.",
    "say": [
      "<b>Step 1, pre-training</b>: the model reads an unimaginable amount of text and guesses the next word, billions of times. The dials, the <b>parameters</b>, are adjusted all the time. It takes months and costs enormous sums.",
      "After step 1 it knows language, but it's like a parrot that just carries on with your sentence.",
      "<b>Step 2, fine-tuning</b>: it's trained on examples of good questions and answers. Now it becomes an assistant.",
      "<b>Step 3, RLHF</b>: people compare answers and say which one is best. The model learns to be helpful, honest and safe.",
      "<b>Step 4, inference</b>: that's when you use it. And here's something many people miss: <b>it learns nothing from you chatting with it</b>. The dials are locked.",
      "That's also why it has a <b>knowledge cutoff</b>. It knows nothing about what has happened since training, unless it's allowed to search."
    ],
    "show": [
      "Click through the four steps.",
      "Step 1: the dials are turning. Step 4: the dials stand still, locked."
    ],
    "ask": [
      [
        "But do they use my data to train the next model?",
        "It depends on the service and the settings. Many free services may do so; business versions usually don't. Check the terms, and use your company's approved tools."
      ]
    ],
    "next": "So which models are out there, and what's the difference?"
  }
});
