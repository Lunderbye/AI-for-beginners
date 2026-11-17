// Engelska för kapitel lara. Nycklarna är den svenska originaltexten: ändra dem aldrig.
I18N.add("lara", {
  "units": {
    "KAPITEL 4": "CHAPTER 4",
    "Hur lär sig en maskin?": "How does a machine learn?",
    "Testa själv. Varje prick är ett djur: hur tungt det är och hur gärna det apporterar. Tryck <b class=\"k\">Träna</b> och se hur modellen gissar, mäter felet och justerar sig, om och om igen. Det kallas <span class=\"en\">training</span>.": "Try it yourself. Each dot is an animal: how heavy it is and how much it loves fetching. Press <b class=\"k\">Train</b> and watch the model guess, measure its error and adjust itself, over and over again. That is called <span class=\"en\">training</span>.",
    "Klicka i rutan för att lägga till:": "Click in the box to add:",
    "🐱 Katt": "🐱 Cat",
    "🐶 Hund": "🐶 Dog",
    "▶ Träna": "▶ Train",
    "↺ Nollställ": "↺ Reset",
    "Så lär sig modellen": "How the model learns",
    "Gissa en linje (slumpmässigt)": "Guess a line (at random)",
    "Räkna hur fel den har (<span class=\"en\">loss</span>)": "Work out how wrong it is (<span class=\"en\">loss</span>)",
    "Justera lite åt rätt håll": "Adjust a little in the right direction",
    "Upprepa tusentals gånger": "Repeat thousands of times",
    "Varv (<i>epochs</i>)": "Rounds (<i>epochs</i>)",
    "Träffsäkerhet": "Accuracy",
    "Fel (<i>loss</i>)": "Error (<i>loss</i>)",
    "Håll musen över rutan när modellen är tränad.": "Hover over the box once the model is trained.",
    "Det här är exakt samma princip som i ChatGPT, bara med <b class=\"k\">två</b> rattar i stället för <b class=\"k\">hundratals miljarder</b>.": "This is exactly the same principle as in ChatGPT, just with <b class=\"k\">two</b> dials instead of <b class=\"k\">hundreds of billions</b>.",
    "Inuti ett neuralt nätverk": "Inside a neural network",
    "Vår modell har två rattar. Ett riktigt nätverk har lager på lager av dem, och vid <b class=\"k\">varje varv</b> tänds kopplingarna: först <span style=\"color:var(--accent)\">framåt</span> (gissa), sedan <span style=\"color:var(--orange)\">bakåt</span> (justera).": "Our model has two dials. A real network has layer upon layer of them, and on <b class=\"k\">every round</b> the connections light up: first <span style=\"color:var(--accent)\">forwards</span> (guess), then <span style=\"color:var(--orange)\">backwards</span> (adjust).",
    "4 · Hur lär sig en maskin?": "4 · How does a machine learn?",
    "Neuralt nätverk där kopplingarna lyser upp lager för lager under träningen": "Neural network whose connections light up layer by layer during training"
  },
  "strings": {
    "Vikt →": "Weight →",
    "Apporterar gärna →": "Loves fetching →",
    "Vikt": "Weight",
    "Apport": "Fetching",
    "INDATA": "INPUT",
    "DOLDA LAGER": "HIDDEN LAYERS",
    "UTDATA": "OUTPUT",
    "Tryck ▶ Träna och se nätverket arbeta.": "Press ▶ Train and watch the network at work.",
    "<span style=\"color:var(--accent)\">→ Framåt:</span> nätverket gissar": "<span style=\"color:var(--accent)\">→ Forwards:</span> the network guesses",
    "<span style=\"color:var(--orange)\">← Bakåt:</span> felet justerar vikterna (<i>backpropagation</i>)": "<span style=\"color:var(--orange)\">← Backwards:</span> the error adjusts the weights (<i>backpropagation</i>)",
    "Håll musen över rutan när modellen är tränad.": "Hover over the box once the model is trained."
  },
  "talk": {
    "title": "How does a machine learn?",
    "time": "19–24 min",
    "goal": "Demystify training: guess, measure the error, adjust, repeat.",
    "say": [
      "Here we've got cats and dogs. Each animal has two features: <b>how heavy it is</b> and <b>how much it loves fetching</b>.",
      "The dashed line is the model's <b>first guess</b>. Completely random. It has no idea.",
      "When I press <b>Train</b>, four things happen over and over again: the model guesses, works out how wrong it is, nudges the line a little, and does it all again.",
      "The error is called the <b>loss</b>. Watch it go down. Each round is called an <b>epoch</b>.",
      "Look at the network on the right: every round the connections light up <b>forwards</b> as the model guesses, and <b>backwards</b> as the error adjusts the weights. That's called <b>backpropagation</b>, and it's what goes on for billions of rounds when the big models are trained.",
      "Now I can hover anywhere, and the model guesses whether it's a cat or a dog, even for animals it has never seen.",
      "This is <b>exactly the same principle</b> as in ChatGPT. The difference is that our model has two dials. ChatGPT has hundreds of billions."
    ],
    "show": [
      "Press ▶ Train.",
      "Hover over the box and show the guess.",
      "Add a cat among the dogs and train again: the model has a harder time.",
      "Red ring = an animal the model gets wrong.",
      "During training: point at the network on the right. Violet = the signal travels forwards (the guess), orange = the error is sent backwards and adjusts the weights."
    ],
    "ask": [
      [
        "Who decides what the right answer is?",
        "In this case, we humans do: we've labelled every animal. That's called <b>supervised learning</b>. Language models instead learn by guessing the next word in text."
      ]
    ],
    "next": "But what does it look like inside a model? That's where neural networks come in."
  }
});
