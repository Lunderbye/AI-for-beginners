// Engelska för kapitel agenter. Nycklarna är den svenska originaltexten: ändra dem aldrig.
I18N.add("agenter", {
  "units": {
    "KAPITEL 13": "CHAPTER 13",
    "<span class=\"en\" style=\"font-style:normal;color:inherit\">AI agents</span>: från att svara till att <span class=\"act-word\">göra</span>": "<span class=\"en\" style=\"font-style:normal;color:inherit\">AI agents</span>: from answering to <span class=\"act-word\">doing</span>",
    "En chatbot svarar. En <span class=\"en\">agent</span> får ett mål, planerar, använder verktyg (<span class=\"en\">tools</span>), tittar på resultatet och fortsätter tills uppgiften är klar. Ge agenten ett uppdrag.": "A chatbot answers. An <span class=\"en\">agent</span> is given a goal, makes a plan, uses <span class=\"en\">tools</span>, looks at the result and keeps going until the task is done. Give the agent a mission.",
    "Välj ett uppdrag ovan för att starta agenten.": "Choose a mission above to start the agent.",
    "📅 Kalender<i class=\"pkt\"></i>": "📅 Calendar<i class=\"pkt\"></i>",
    "✉️ Mejl<i class=\"pkt\"></i>": "✉️ Email<i class=\"pkt\"></i>",
    "📄 Dokument<i class=\"pkt\"></i>": "📄 Documents<i class=\"pkt\"></i>",
    "MCP": "MCP",
    "Model Context Protocol<br>\"USB-C för AI\"": "Model Context Protocol<br>\"USB-C for AI\"",
    "🌐 Webbsök<i class=\"pkt\"></i>": "🌐 Web search<i class=\"pkt\"></i>",
    "🎟️ Bokning<i class=\"pkt\"></i>": "🎟️ Booking<i class=\"pkt\"></i>",
    "🌦️ Väder<i class=\"pkt\"></i>": "🌦️ Weather<i class=\"pkt\"></i>",
    "MCP väntar på att agenten ska använda ett verktyg …": "MCP is waiting for the agent to use a tool …",
    "<span class=\"en\">MCP</span> är en öppen standard (från 2024) för hur AI-modeller kopplas till verktyg och data. Ett gränssnitt, många verktyg.": "<span class=\"en\">MCP</span> is an open standard (from 2024) for connecting AI models to tools and data. One interface, many tools.",
    "13 · Agenter": "13 · Agents",
    "Agentloopen: tänk, agera, observera": "The agent loop: think, act, observe"
  },
  "strings": {
    "Tänk": "Think",
    "Agera": "Act",
    "Observera": "Observe",
    "LLM + MÅL": "LLM + GOAL",
    "📅 Kalender": "📅 Calendar",
    "✉️ Mejl": "✉️ Email",
    "🌐 Webbsök": "🌐 Web search",
    "🎟️ Bokning": "🎟️ Booking",
    "📄 Dokument": "📄 Documents",
    "🌦️ Väder": "🌦️ Weather",
    "🤔 TÄNKER": "🤔 THINKING",
    "🛠️ AGERAR": "🛠️ ACTING",
    "👀 SER": "👀 OBSERVING",
    "🙋 FRÅGAR DIG": "🙋 ASKING YOU",
    "🏁 KLART": "🏁 DONE",
    "← resultat": "← result",
    "MCP väntar på att agenten ska använda ett verktyg …": "MCP is waiting for the agent to use a tool …",
    "🎯 MÅL": "🎯 GOAL",
    "✔ Godkänn": "✔ Approve",
    "✖ Avbryt": "✖ Cancel",
    "✔ Godkänt av dig": "✔ Approved by you",
    "✖ Avbrutet": "✖ Cancelled",
    "Uppdraget stoppades av en människa. Inget skickades eller bokades. Det är <b>human in the loop</b>.": "The mission was stopped by a human. Nothing was sent or booked. That is <b>human in the loop</b>."
  },
  "talk": {
    "title": "Agents",
    "time": "62–68 min",
    "goal": "Agent = goal + loop (think, act, observe) + tools + a human in the loop. MCP as the standard connector.",
    "say": [
      "A chatbot answers questions. An <b>agent</b> is given a <b>goal</b> and works on it until it's done.",
      "It does that in a loop: <b>think</b> about the next step, <b>act</b> using a tool, <b>observe</b> the result. And round again.",
      "Let's give it a mission: book a team lunch on Friday. Watch how it checks the calendar, looks for a restaurant, and makes the booking.",
      "And here it stops and <b>asks me</b> before it sends any email. That's called <b>human in the loop</b>. You decide where the line goes.",
      "Would someone like to try pressing <b>Cancel</b>? Then nothing happens. And that's exactly how it should be.",
      "The tools are often plugged in through <b>MCP</b>, the Model Context Protocol. Think of it as <b>USB-C for AI</b>: one standard connector, so the same AI can use your calendar, email, files and business systems.",
      "Look at the bottom: every time the agent uses a tool, the call goes <b>out through MCP</b> to the tool, and the answer comes <b>back the same way</b>. The agent doesn't need to know how the calendar or the booking system works on the inside.",
      "Agents are powerful, but they need some thought: <b>what permissions</b> does it get, and <b>what must a human approve</b>?"
    ],
    "show": [
      "Start “Book a team lunch”, let it run to the approval step, press Approve.",
      "Start “Plan a trip” and press Cancel.",
      "Point to the MCP box below the loop: every tool call goes out from the hub (violet, <i>tools/call</i>) and the answer comes back (green) when the agent observes."
    ],
    "backstage": [
      "MCP was launched by Anthropic in November 2024 and has since been widely adopted, including by OpenAI, Google and Microsoft."
    ],
    "ask": [
      [
        "Can an agent do something dangerous?",
        "It can make mistakes, and it can be tricked (prompt injection). So: give it only the permissions it needs, and require approval for anything that costs money or gets sent out."
      ]
    ],
    "next": "You don't have to start with agents. Let's look at how to automate step by step."
  }
});
