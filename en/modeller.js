// Engelska för kapitel modeller. Nycklarna är den svenska originaltexten: ändra dem aldrig.
I18N.add("modeller", {
  "units": {
    "KAPITEL 8": "CHAPTER 8",
    "Modellerna: vem är vem?": "The models: who's who?",
    "Det finns många modeller, från jättar i datacenter till små modeller som körs på din dator. Några är stängda (<span class=\"en\">closed</span>), andra har öppna vikter (<span class=\"en\">open weights</span>) som vem som helst kan ladda ner.": "There are lots of models, from giants in data centres to small models that run on your own computer. Some are <span class=\"en\">closed</span>, others have <span class=\"en\">open weights</span> that anyone can download.",
    "Modellen": "The model",
    "motorn · t.ex. GPT, Claude, Gemini": "the engine · e.g. GPT, Claude, Gemini",
    "Appen / produkten": "The app / product",
    "bilen · t.ex. ChatGPT, Copilot, Claude.ai": "the car · e.g. ChatGPT, Copilot, Claude.ai",
    "<span class=\"en\">Context window</span> · arbetsminne": "<span class=\"en\">Context window</span> · working memory",
    "Hur mycket text modellen kan \"ha framför sig\" samtidigt.": "How much text the model can \"have in front of it\" at once.",
    "<span class=\"en\">Multimodal</span> · fler sinnen": "<span class=\"en\">Multimodal</span> · more senses",
    "Moderna modeller tar emot och skapar mer än text.": "Modern models take in and create more than text.",
    "AI": "AI",
    "<span class=\"en\">Reasoning models</span> · tänker först": "<span class=\"en\">Reasoning models</span> · think first",
    "Nyare modeller \"tänker högt\" innan de svarar. Långsammare, men bättre på svåra problem.": "Newer models \"think out loud\" before they answer. Slower, but better at hard problems.",
    "🤔 Hur många \"r\" finns i \"jordgubbsträd\"?": "🤔 How many \"r\"s are there in \"strawberry\"?",
    "8 · Modeller": "8 · Models"
  },
  "strings": {
    "Känd för skrivande, kodning och säkerhetstänk. Finns i Claude.ai, i appar och via API.": "Known for writing, coding and a focus on safety. Available in Claude.ai, in apps and via API.",
    "Modellerna bakom ChatGPT. Används också i Microsoft Copilot.": "The models behind ChatGPT. Also used in Microsoft Copilot.",
    "Inbyggd i Googles tjänster: Sök, Gmail, Docs och Android.": "Built into Google's services: Search, Gmail, Docs and Android.",
    "Öppna vikter: kan laddas ner och köras på egna servrar.": "Open weights: can be downloaded and run on your own servers.",
    "Europeiskt alternativ, med både öppna och kommersiella modeller.": "A European alternative, with both open and commercial models.",
    "Skakade marknaden 2025 med en öppen reasoning-modell som tränats till låg kostnad.": "Shook the market in 2025 with an open reasoning model trained at low cost.",
    "Stor familj öppna modeller i många storlekar.": "A large family of open models in many sizes.",
    "Svensk språkmodell, tränad på de nordiska språken.": "A Swedish language model, trained on the Nordic languages.",
    "Skapar bilder från en textbeskrivning. Populär bland designers.": "Creates images from a text description. Popular with designers.",
    "Öppna bildmodeller som kan köras på en egen dator.": "Open image models that can run on your own computer.",
    "Skapar korta filmer från text.": "Creates short videos from text.",
    "Körs på din egen dator, utan internet. Bra när datan inte får lämna huset.": "Runs on your own computer, without the internet. Good when data mustn't leave the building.",
    "Mistral AI · Frankrike": "Mistral AI · France",
    "DeepSeek · Kina": "DeepSeek · China",
    "Alibaba · Kina": "Alibaba · China",
    "AI Sweden · Sverige": "AI Sweden · Sweden",
    "Lokala småmodeller": "Small local models",
    "t.ex. via Ollama eller LM Studio": "e.g. via Ollama or LM Studio",
    "öppna vikter": "open weights",
    "stängd": "closed",
    "text": "text",
    "bild": "image",
    "ljud": "audio",
    "kod": "code",
    "video": "video",
    "Alla": "All",
    "Stängda": "Closed",
    "Öppna vikter": "Open weights",
    "Text": "Text",
    "Bild": "Image",
    "Ljud": "Audio",
    "Video": "Video",
    "ett långt mejl": "a long e-mail",
    "en rapport": "a report",
    "en tjock roman": "a thick novel",
    "en roman och lite till": "a novel and a bit more",
    "en hel bokhylla": "a whole bookshelf"
  },
  "talk": {
    "title": "Models",
    "time": "38–43 min",
    "goal": "Give a map of the landscape. The difference between a model and an app. Context window, multimodal, reasoning.",
    "say": [
      "First, an important distinction: <b>the model is the engine</b>, the app is the car. GPT is a model, ChatGPT is the app. Copilot is Microsoft's app, which among other things uses OpenAI's models.",
      "The big closed models: <b>Claude</b> from Anthropic, <b>GPT</b> from OpenAI, <b>Gemini</b> from Google.",
      "Then there are models with <b>open weights</b>: Llama from Meta, Mistral from France, DeepSeek and Qwen from China. You can download those and run them on your own servers, which is handy when data isn't allowed to leave the building.",
      "There's even a Swedish one: <b>GPT-SW3</b> from AI Sweden.",
      "Three ideas worth knowing. <b>Context window</b>: how much the model can have in front of it at once, anything from one e-mail to a whole bookshelf.",
      "<b>Multimodal</b>: modern models can see images, hear sound and talk.",
      "<b>Reasoning models</b>: models that think out loud before they answer. Try the strawberry question: questions like that used to go wrong a lot, because the model sees tokens, not letters."
    ],
    "show": [
      "Click the filters: Open weights, then Image.",
      "Drag the context window slider.",
      "Click the 🤔 button."
    ],
    "backstage": [
      "Model names and versions change quickly; the cards deliberately mention families, not version numbers.",
      "Page counts for the context window: roughly 600 tokens per page, rounded generously."
    ],
    "ask": [
      [
        "Which model is best?",
        "There isn't a single best one; it depends on the task. The big ones are very evenly matched. Choose based on what your organisation has approved, what it needs to do, and where the data is allowed to live."
      ]
    ],
    "next": "Whichever model you use, one thing matters most for quality: how you ask."
  }
});
