// Engelska för kapitel rag. Nycklarna är den svenska originaltexten: ändra dem aldrig.
I18N.add("rag", {
  "units": {
    "KAPITEL 12": "CHAPTER 12",
    "<span class=\"en\" style=\"font-style:normal;color:inherit\">RAG</span>: ge AI:n en fusklapp": "<span class=\"en\" style=\"font-style:normal;color:inherit\">RAG</span>: give the AI a cheat sheet",
    "<span class=\"en\">Retrieval-Augmented Generation</span>: innan modellen svarar letar vi upp de mest relevanta styckena i <b class=\"k\">dina</b> dokument och klistrar in dem i prompten. Exempel: personalhandboken för det påhittade företaget <b class=\"k\">Nordljus AB</b>.": "<span class=\"en\">Retrieval-Augmented Generation</span>: before the model answers, we look up the most relevant passages in <b class=\"k\">your</b> documents and paste them into the prompt. Example: the staff handbook for the fictional company <b class=\"k\">Nordljus AB</b>.",
    "Fråga": "Ask",
    "användaren frågar": "the user asks",
    "Embedding": "Embedding",
    "frågan blir siffror": "the question becomes numbers",
    "Sök": "Search",
    "i en <i>vector database</i>": "in a <i>vector database</i>",
    "Berika": "Augment",
    "stycken läggs i prompten": "passages go into the prompt",
    "Svara": "Answer",
    "med källhänvisning": "with sources",
    "Personalhandboken, uppdelad i stycken (<span class=\"en\">chunks</span>)": "The staff handbook, split into passages (<span class=\"en\">chunks</span>)",
    "12 · RAG": "12 · RAG"
  },
  "strings": {
    "Välj en fråga till vänster. Vi jämför ett svar <b>utan</b> RAG med ett svar <b>med</b> RAG.": "Pick a question on the left. We'll compare an answer <b>without</b> RAG with an answer <b>with</b> RAG.",
    "MEDARBETARE": "EMPLOYEE",
    "🔢 [ 0.12, −0.48, 0.91, 0.03, −0.27, … 1 536 siffror ]": "🔢 [ 0.12, −0.48, 0.91, 0.03, −0.27, … 1,536 numbers ]",
    "❌ UTAN RAG": "❌ WITHOUT RAG",
    "✅ MED RAG": "✅ WITH RAG"
  },
  "talk": {
    "title": "RAG",
    "time": "57–62 min",
    "goal": "RAG = search your documents first, then answer. Compare without and with.",
    "say": [
      "<b>RAG</b> stands for Retrieval-Augmented Generation. Sounds complicated, but it simply means: <b>give the AI a cheat sheet</b>.",
      "Here's the staff handbook for the fictional company Nordljus AB, split into passages, so-called <b>chunks</b>.",
      "I ask: “How many days of holiday do I get?” The question becomes an embedding, numbers. We search for the passages that sit closest on the map of meaning.",
      "Look at the bars: the holiday passage is the best match. It gets pasted into the prompt, together with the instruction “answer based on this”.",
      "Compare the answers. <b>Without RAG</b>: “25 days under Swedish law”. Sounds right, but <b>it doesn't apply at Nordljus</b>. <b>With RAG</b>: 30 days, with a source.",
      "This is the foundation of almost every company chatbot: customer service, intranets, policy questions. The model doesn't need retraining; you just keep the documents up to date."
    ],
    "show": [
      "Click the questions one at a time.",
      "Follow the steps at the top: Ask → Embedding → Search → Augment → Answer.",
      "The Friday question finds two passages: remote work and fika."
    ],
    "ask": [
      [
        "Is RAG the same as training the model on our documents?",
        "No, and that's the point. No training, no expensive GPUs. The documents are fetched on the spot, and you can show the source."
      ],
      [
        "Can it see documents I don't have access to?",
        "It shouldn't. A good RAG solution filters by permissions before it searches. That's an important question to put to your supplier."
      ]
    ],
    "value": "AI that answers from your own, up-to-date documents, with a source, instead of guessing.",
    "next": "So far the AI has only answered. Next step: AI that does things."
  }
});
