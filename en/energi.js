// Engelska för kapitel energi. Nycklarna är den svenska originaltexten: ändra dem aldrig.
I18N.add("energi", {
  "units": {
    "KAPITEL 16": "CHAPTER 16",
    "Varje svar kostar el. <span class=\"grad\">Och svaren blir många.</span>": "Every answer costs electricity. <span class=\"grad\">And there are a lot of answers.</span>",
    "En enskild fråga drar lite ström. Problemet är skalan: miljarder frågor om dagen, allt tyngre uppgifter som bild och video, och chip som blir varmare för varje generation.": "A single question uses very little power. The problem is the scale: billions of questions a day, ever heavier tasks like images and video, and chips that run hotter with every generation.",
    "Vad kostar det i el?": "How much electricity does it take?",
    "<input type=\"checkbox\" id=\"enScale\"> × 2,5 miljarder frågor om dagen <span class=\"dim\">(ChatGPT, 2025)</span>": "<input type=\"checkbox\" id=\"enScale\"> × 2.5 billion questions a day <span class=\"dim\">(ChatGPT, 2025)</span>",
    "Ett serverrack: förr och nu": "A server rack: then and now",
    "Ett AI-rack drar lika mycket som ungefär 15 vanliga och måste kylas med vätska direkt på chippen. Ett enda AI-chip (H100) drar ≈ 700 W, som en mikrovågsugn.": "An AI rack draws as much power as about 15 ordinary ones and has to be cooled with liquid piped straight onto the chips. A single AI chip (H100) draws ≈ 700 W, about the same as a microwave.",
    "Datacentrens elanvändning i världen": "Data centres' electricity use worldwide",
    "Vatten": "Water",
    "Kylning kan kräva mycket vatten. Lite per fråga, men mycket lokalt i torra regioner.": "Cooling can use a lot of water. Not much per question, but a lot locally in dry regions.",
    "Elnätet": "The power grid",
    "Ett stort AI-datacenter kan behöva lika mycket effekt som en stad. Elnäten hinner inte byggas ut i samma takt.": "A large AI data centre can need as much power as a whole city. Power grids can't be expanded at the same pace.",
    "Chip och skrot": "Chips and e-waste",
    "Tillverkningen släpper ut mycket, och hårdvaran byts ofta efter några år.": "Making the chips causes a lot of emissions, and the hardware is often replaced after just a few years.",
    "Effektivare = mer": "More efficient = more use",
    "Varje fråga blir billigare, så vi frågar mer. Totalen växer ändå (<span class=\"en\">Jevons paradox</span>).": "Each question gets cheaper, so we ask more. The total keeps growing anyway (<span class=\"en\">Jevons paradox</span>).",
    "Vad kan jag göra?": "What can I do?",
    "Välj lagom stor modell, undvik onödig bild och video, och ställ tydliga frågor så att du slipper fråga om.": "Pick a model that's the right size for the job, skip images and video you don't need, and ask clear questions so you don't have to ask again.",
    "16 · Energi + miljö": "16 · Energy + environment",
    "Effekt per serverrack: vanligt rack jämfört med AI-rack": "Power per server rack: ordinary rack compared with an AI rack",
    "Datacentrens elanvändning 2024 och 2030 jämfört med Sveriges": "Data centres' electricity use in 2024 and 2030 compared with Sweden's"
  },
  "strings": {
    "💬 En chattfråga": "💬 One chat question",
    "🖼️ En AI-bild": "🖼️ One AI image",
    "🎬 5 sekunder AI-video": "🎬 5 seconds of AI video",
    "🏋️ Träna GPT-4": "🏋️ Training GPT-4",
    "Google mätte 0,24 Wh för en typisk Gemini-fråga (2025); OpenAI har uppgett ~0,34 Wh för ChatGPT.": "Google measured 0.24 Wh for a typical Gemini question (2025); OpenAI has stated ~0.34 Wh for ChatGPT.",
    "Snitt för bildmodeller i en forskningsstudie (Luccioni m.fl., 2023).": "Average for image models in a research study (Luccioni et al., 2023).",
    "Uppskattning för en öppen videomodell (MIT Technology Review, 2025).": "Estimate for an open video model (MIT Technology Review, 2025).",
    "Uppskattning: cirka 50 GWh (MIT Technology Review, 2025).": "Estimate: around 50 GWh (MIT Technology Review, 2025).",
    "LED-lampa (8 W) lyser": "an LED bulb (8 W) left on",
    "mobilladdning (≈ 15 Wh)": "phone charges (≈ 15 Wh)",
    "köra elbil (≈ 0,2 kWh/km)": "driving an electric car (≈ 0.2 kWh/km)",
    "el till en svensk lägenhet (≈ 2 000 kWh/år)": "electricity for a Swedish flat (≈ 2,000 kWh/year)",
    "sek": "sec",
    "min": "min",
    "år": "years",
    "dygn": "days",
    "tim": "hours",
    "dagar": "days",
    "lägenheter": "flats",
    "lägenheter i ett år": "flats for a year",
    "varv runt jorden": "trips round the Earth",
    "meter": "metres",
    "% av en": "% of one",
    "laddningar": "charges",
    "km": "km",
    "Vanligt serverrack": "Ordinary server rack",
    "luftkylt": "air-cooled",
    "AI-rack (NVIDIA GB200 NVL72)": "AI rack (NVIDIA GB200 NVL72)",
    "vätskekylt": "liquid-cooled",
    "Sveriges hela elanvändning": "All of Sweden's electricity use",
    "≈ 135 TWh/år": "≈ 135 TWh/year",
    "Datacenter i världen 2024": "Data centres worldwide, 2024",
    "≈ 415 TWh (1,5 % av världens el)": "≈ 415 TWh (1.5% of the world's electricity)",
    "Datacenter 2030 (prognos)": "Data centres 2030 (forecast)",
    "≈ 945 TWh, som Japans elanvändning": "≈ 945 TWh, as much as Japan uses"
  },
  "talk": {
    "title": "Energy + environment",
    "time": "77–81 min",
    "goal": "Give an honest picture: one question uses very little, but the scale, heavy tasks and ever hotter chips make AI a big consumer of electricity.",
    "say": [
      "Every time we ask an AI something, electricity is being used in a data centre somewhere. How much? <b>Less than you'd think, per question.</b>",
      "An ordinary chat question comes to about <b>0.3 watt-hours</b>, roughly an LED bulb left on for two minutes. But switch on <b>× 2.5 billion questions a day</b>, and that's the electricity for more than a hundred thousand Swedish flats.",
      "And the tasks are getting heavier: an <b>AI image</b> uses ten times as much, a few seconds of <b>AI video</b> thousands of times as much. <b>Training</b> a big model can take as much electricity as tens of thousands of flats use in a year.",
      "The chips are getting hotter, too. An ordinary server rack draws maybe 8 kilowatts. An <b>AI rack</b> draws around 120, and it has to be cooled with liquid.",
      "Worldwide, data centres already use about <b>three times as much electricity as the whole of Sweden</b>, and that's expected to more than double by 2030.",
      "On top of that there's <b>water</b> for cooling, <b>power grids</b> that can't keep up, and chips that have to be made and later scrapped. And as AI gets more efficient, we use it more, so the total keeps growing anyway.",
      "So what can you do yourself? <b>Pick a model that's the right size</b>, don't create images and video for no reason, and write clear questions so you don't have to ask again."
    ],
    "show": [
      "Click “One chat question” and switch on × 2.5 billion. Then “AI video” and “Training GPT-4”.",
      "Point to the racks and to the world bars.",
      "Read out one or two of the cards at the bottom, no more."
    ],
    "backstage": [
      "Chat question: Google 0.24 Wh per typical Gemini text prompt (Aug 2025, its own measurement, not independently reviewed); OpenAI/Altman ~0.34 Wh (2025). Long reasoning questions and agents use considerably more.",
      "Image 2.9 Wh: average for image generation in Luccioni et al. 2023 (“Power Hungry Processing”). Video ≈ 944 Wh (3.4 MJ) for 5 s with an open model, and GPT-4 training ≈ 50 GWh: estimates from MIT Technology Review, May 2025.",
      "2.5 billion questions a day: OpenAI to Axios, July 2025; the figure is probably higher now. Flat ≈ 2,000 kWh/year, electric car ≈ 0.2 kWh/km, boiling 1 litre ≈ 0.11 kWh: rounded rules of thumb.",
      "Racks: industry average ≈ 8 kW (Uptime Institute); NVIDIA GB200 NVL72 ≈ 120–132 kW, liquid-cooled only. H100 ≈ 700 W.",
      "IEA, Energy and AI (April 2025): data centres ≈ 415 TWh in 2024 (≈ 1.5% of the world's electricity), ≈ 945 TWh in 2030 in the base case. Sweden's electricity use ≈ 130–140 TWh/year."
    ],
    "ask": [
      [
        "Should I stop using AI for the climate's sake?",
        "No, an ordinary question is tiny compared with, say, a car journey. But use it sensibly: a model of the right size, no video for the sake of it. The big footprint depends on how the companies build and where their electricity comes from."
      ],
      [
        "Isn't it a good thing that data centres are being built in Sweden with fossil-free electricity?",
        "Partly, yes: clean electricity and a cold climate. But the electricity that goes to data centres is also needed for industry and for electrifying everything else, and the grid in southern Sweden is already under strain. It's a trade-off."
      ]
    ],
    "next": "The electricity is only part of it. Next: the race for chips, and what's being built in Sweden."
  }
});
