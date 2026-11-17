# AI for beginners · AI för nybörjare

An interactive presentation about AI for people with no prior knowledge, in **English and Swedish**: the history, how machines learn, language models and tokens, prompt engineering, hallucinations, embeddings, RAG, agents and MCP, automation, risks and the EU AI Act, energy and the AI race. Every chapter has an interactive demo, and a separate talk track (speaker script) follows along.

**▶ Open the presentation:** https://lunderbye.github.io/AI-for-beginners/ · [in English](https://lunderbye.github.io/AI-for-beginners/?lang=en) · [på svenska](https://lunderbye.github.io/AI-for-beginners/?lang=sv)
**🎙 Talk track:** https://lunderbye.github.io/AI-for-beginners/talk.html

## How to use it

- Scroll, or use `←` `→` to move between chapters. The menu at the top slides away and comes back when you move the mouse to the top edge.
- **🇸🇪 SV | 🇬🇧 EN** in the menu, or the `L` key, switches language.
- Open the talk track in a second window (for example on your laptop screen while the deck is on the projector). With **Drive deck** (`D`) on, the deck follows the talk track; with **Follow deck** (`F`) on, the talk track follows the deck. The language follows too. Both windows must be open in the same browser.
- `N` shows speaker notes in the deck, `M` turns animations off, `H` pins the menu. The theme button switches between System, Light and Dark.

## Run it locally

```bash
./serve.sh            # http://localhost:8790  (talk track: http://localhost:8790/talk.html)
```

It is plain HTML, CSS and JavaScript with no build step. Any static web server works.

## Contents

| # | Chapter | Interactive |
|---|---|---|
| 1 | What is AI? | AI ⊃ ML ⊃ deep learning ⊃ generative AI |
| 2 | The history, 1943–2026 | hype curve with 21 events and historical photos |
| 3 | Why now? | data + GPUs + the Transformer |
| 4 | How does a machine learn? | a cat/dog classifier you train live |
| 5 | Neural networks | switch features on and watch the signal flow |
| 6 | Language models | tokenizer and next-token guesser with temperature |
| 7 | How an LLM is trained | pre-training → fine-tuning → RLHF → inference |
| 8 | Models | model families, context window, reasoning |
| 9 | Prompt engineering | prompt builder with a quality meter |
| 10 | Hallucinations | true or made up? quiz |
| 11 | Embeddings | a map of meaning with analogies |
| 12 | RAG | retrieval over a staff handbook, with vs without RAG |
| 13 | Agents + MCP | three missions with approve/cancel |
| 14 | Automation | the automation ladder, five levels |
| 15 | Risks | EU AI Act risk pyramid |
| 16 | Energy + environment | electricity calculator |
| 17 | The AI race | supply chain, investments, what is being built in Sweden |
| 18 | Buzzword bingo | 34 terms with search and flip cards |
| 19 | Get started | five tips |

Facts and figures in chapters 16–17 are dated (late 2026); sources are listed in the talk track. The historical photos in chapter 2 come from Wikimedia Commons, see [historia/KÄLLOR.md](historia/KÄLLOR.md) for each photo's author and license.

## På svenska

En interaktiv presentation om AI för personer utan förkunskaper, på svenska och engelska, med en interaktiv demo i varje kapitel och en separat talk track. Öppna [presentationen](https://lunderbye.github.io/AI-for-beginners/?lang=sv) och byt språk med **🇸🇪 SV | 🇬🇧 EN** i menyn eller tangenten `L`.

## License

© 2026 Peter Lunderbye. Licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/): you may share and adapt the material for any purpose, as long as you give credit. The historical photos keep their own licenses (see historia/KÄLLOR.md).
