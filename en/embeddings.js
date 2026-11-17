// Engelska för kapitel embeddings. Nycklarna är den svenska originaltexten: ändra dem aldrig.
I18N.add("embeddings", {
  "units": {
    "KAPITEL 11": "CHAPTER 11",
    "<span class=\"en\" style=\"font-style:normal;color:inherit\">Embeddings</span>: betydelse som koordinater": "<span class=\"en\" style=\"font-style:normal;color:inherit\">Embeddings</span>: meaning as coordinates",
    "Datorer räknar med siffror, inte ord. En <span class=\"en\">embedding</span> gör om ett ord eller en text till en lång lista med siffror, en punkt på en \"karta över betydelse\". Ord som betyder liknande saker hamnar nära varandra. Klicka på ett ord.": "Computers work with numbers, not words. An <span class=\"en\">embedding</span> turns a word or a text into a long list of numbers: a point on a \"map of meaning\". Words that mean similar things end up close to each other. Click a word.",
    "Valt ord": "Selected word",
    "Närmaste grannar · och vad som skiljer": "Nearest neighbours · and what sets them apart",
    "Klicka på ett ord på kartan.": "Click a word on the map.",
    "Samband": "Relationships",
    "Klicka på ett ord så visas dess analogi, som kung − man + kvinna.": "Click a word to see its analogy, like king − man + woman.",
    "👑 kung − man + kvinna = ?": "👑 king − man + woman = ?",
    "Riktiga embeddings har hundratals eller tusentals dimensioner. Här visar vi två.": "Real embeddings have hundreds or thousands of dimensions. Here we show two.",
    "11 · Embeddings": "11 · Embeddings",
    "Karta över ord där liknande ord ligger nära varandra": "Map of words where similar words sit close together"
  },
  "strings": {
    "MÄNNISKOR": "PEOPLE",
    "DJUR": "ANIMALS",
    "FORDON": "VEHICLES",
    "FRUKT": "FRUIT",
    "kön": "gender",
    "ålder": "age",
    "kunglig": "royal",
    "djurart": "species",
    "motor": "engine",
    "kollektivt": "public transport",
    "räls": "rails",
    "sort": "variety",
    "Här finns ingen enkel analogi på vår lilla karta, men grannarna visar vad orden har gemensamt: de hamnar nära varandra för att de används på liknande sätt.": "There's no simple analogy for this one on our little map, but the neighbours show what the words have in common: they end up close together because they're used in similar ways.",
    "Analogi kommer …": "Analogy coming …"
  },
  "talk": {
    "title": "Embeddings",
    "time": "54–57 min",
    "goal": "Intuition: meaning becomes coordinates. Similar things end up close together.",
    "say": [
      "Computers work with numbers. An <b>embedding</b> turns a word, or a whole text, into a list of numbers: a <b>place on a map of meaning</b>.",
      "Click “puppy”. Its neighbours are dog, cat and kitten, and the lines show <b>what sets them apart</b>: a dog is the same animal but older, a kitten is just as young but a different species. Nobody told the model that; it learned it from how the words are used.",
      "After a moment the word's <b>analogy</b> plays: kitten − cat + dog = puppy. The step from cat to dog only changes the species, so the same step from kitten lands on puppy.",
      "And the coolest part: <b>king minus man plus woman gives queen</b>. The model has learned “gender” as a direction on the map.",
      "Real embeddings don't have two dimensions, but <b>hundreds or thousands</b>. The principle is the same, though.",
      "Why do we care? Because this lets a computer <b>search by meaning</b> instead of exact words. “Time off” finds “annual leave”."
    ],
    "show": [
      "Click puppy and wait for the analogy.",
      "Click woman (gender and age on the lines) and bus (no analogies, but the neighbours explain).",
      "Finish with the 👑 button."
    ],
    "backstage": [
      "The coordinates are placed by hand so the analogies work exactly; in real embeddings they only work approximately. King − man + woman ≈ queen is a classic result from word2vec (2013).",
      "The similarity scores are calculated from the distance on the map, not from a real model."
    ],
    "next": "Now we have everything we need to understand RAG."
  }
});
