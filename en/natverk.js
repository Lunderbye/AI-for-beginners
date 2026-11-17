// Engelska för kapitel natverk. Nycklarna är den svenska originaltexten: ändra dem aldrig.
I18N.add("natverk", {
  "units": {
    "KAPITEL 5": "CHAPTER 5",
    "Neurala nätverk: inspirerade av hjärnan": "Neural networks: inspired by the brain",
    "Ett <span class=\"en\">neural network</span> är lager av enkla \"neuroner\" som skickar signaler vidare. Varje koppling har en vikt (<span class=\"en\">weight</span>), som en volymratt. Slå på egenskaper till vänster och se signalen flöda.": "A <span class=\"en\">neural network</span> is layers of simple \"neurons\" that pass signals along. Every connection has a <span class=\"en\">weight</span>, like a volume knob. Switch on features on the left and watch the signal flow.",
    "🐱 Katt": "🐱 Cat",
    "🐶 Hund": "🐶 Dog",
    "Utdata = sannolikheter, inte säkerhet.": "Output = probabilities, not certainty.",
    "<span class=\"e\">🖼️</span>Pixlar": "<span class=\"e\">🖼️</span>Pixels",
    "<span class=\"e\">〰️</span>Kanter": "<span class=\"e\">〰️</span>Edges",
    "<span class=\"e\">🔺</span>Former": "<span class=\"e\">🔺</span>Shapes",
    "<span class=\"e\">👂</span>Öron, ögon": "<span class=\"e\">👂</span>Ears, eyes",
    "<span class=\"e\">🐱</span>\"Katt!\"": "<span class=\"e\">🐱</span>\"Cat!\"",
    "<span class=\"en\">Deep Learning</span> = många lager. Varje lager hittar lite mer abstrakta mönster än det förra.": "<span class=\"en\">Deep Learning</span> = many layers. Each layer finds slightly more abstract patterns than the one before.",
    "5 · Neurala nätverk": "5 · Neural networks",
    "Neuralt nätverk med indata, dolt lager och utdata": "Neural network with input, hidden layer and output"
  },
  "strings": {
    "Spetsiga öron": "Pointy ears",
    "Morrhår": "Whiskers",
    "Skäller": "Barks",
    "Apporterar": "Fetches",
    "Klättrar i träd": "Climbs trees",
    "INDATA": "INPUT",
    "DOLT LAGER": "HIDDEN LAYER",
    "UTDATA": "OUTPUT",
    "↺ Nollställ": "↺ Reset"
  },
  "talk": {
    "title": "Neural networks",
    "time": "24–28 min",
    "goal": "Show the intuition: layers of neurons, connections with weights, probabilities out.",
    "say": [
      "A neural network is loosely inspired by the brain. Small units, <b>neurons</b>, arranged in layers, passing signals along.",
      "Every connection has a <b>weight</b>, like a volume knob: how much should this signal count?",
      "Switch on “pointy ears”, “whiskers” and “climbs trees”. Watch the signal flow, and see the cat probability climb.",
      "Now switch on “barks”. There, it flipped. Red lines are signals that <b>pull down</b>, green ones <b>pull up</b>.",
      "Notice that the answer is a <b>probability</b>, not a certain yes or no. That's important to remember when we get to language models.",
      "<b>Deep learning</b> just means you have <b>lots</b> of layers. The first layer finds edges, the next shapes, the next ears and eyes, and finally: “cat”."
    ],
    "show": [
      "Click ears, whiskers and climbs.",
      "Click barks and fetches.",
      "Point at the strip at the bottom: pixels → cat."
    ],
    "backstage": [
      "The weights in the demo are set by hand to give a clear result; a real network learns them through training, as in chapter 4."
    ],
    "next": "Now let's take the step to what everyone's talking about: language models."
  }
});
