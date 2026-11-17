// Engelska för kapitel prompt. Nycklarna är den svenska originaltexten: ändra dem aldrig.
I18N.add("prompt", {
  "units": {
    "KAPITEL 9": "CHAPTER 9",
    "<span class=\"en\" style=\"font-style:normal;color:inherit\">Prompt engineering</span>: konsten att fråga": "<span class=\"en\" style=\"font-style:normal;color:inherit\">Prompt engineering</span>: the art of asking",
    "En <span class=\"en\">prompt</span> är det du skriver till AI:n. Kvaliteten på svaret beror mycket på kvaliteten på frågan. Bygg en bättre prompt genom att slå på delarna.": "A <span class=\"en\">prompt</span> is what you write to the AI. The quality of the answer depends a lot on the quality of the question. Build a better prompt by switching on the parts.",
    "Din prompt": "Your prompt",
    "KVALITET": "QUALITY",
    "Var specifik": "Be specific",
    "\"Skriv ett mejl\" → \"Skriv ett vänligt mejl på 5 meningar till…\"": "\"Write an e-mail\" → \"Write a friendly five-sentence e-mail to…\"",
    "Ge exempel": "Give examples",
    "Visa ett par exempel på vad du vill ha (<i>few-shot</i>).": "Show a couple of examples of what you want (<i>few-shot</i>).",
    "Steg för steg": "Step by step",
    "Be den tänka igenom problemet i steg (<i>chain of thought</i>).": "Ask it to think the problem through in steps (<i>chain of thought</i>).",
    "Iterera": "Iterate",
    "Första svaret är ett utkast. Säg vad som ska bli bättre.": "The first answer is a draft. Say what should be improved.",
    "Tänk på datan": "Mind the data",
    "Klistra inte in personuppgifter eller hemligheter i publika tjänster.": "Don't paste personal data or secrets into public services.",
    "9 · Prompt engineering": "9 · Prompt engineering"
  },
  "strings": {
    "Roll": "Role",
    "Vem ska AI:n vara?": "Who should the AI be?",
    "Du är en erfaren kommunikatör på ett svenskt IT-företag.": "You are an experienced communications officer at a Swedish IT company.",
    "Kontext": "Context",
    "Fakta den behöver": "Facts it needs",
    "Kontoret är stängt 23 december–1 januari. Supporten är öppen 27–30 december kl. 9–15 på 08-123 45 67.": "The office is closed 23 December–1 January. Support is open 27–30 December, 9 am–3 pm, on 08-123 45 67.",
    "Målgrupp och ton": "Audience and tone",
    "Till vem, och hur?": "Who for, and how?",
    "Mejlet går till våra kunder. Tonen ska vara varm och personlig, inte formell.": "The e-mail goes to our customers. The tone should be warm and personal, not formal.",
    "Format": "Format",
    "Längd och struktur": "Length and structure",
    "Max 100 ord. Ämnesrad, två korta stycken och en hälsning.": "Max 100 words. A subject line, two short paragraphs and a sign-off.",
    "Exempel": "Example",
    "Visa hur det ska låta": "Show how it should sound",
    "Förra årets mejl började så här: ”Nu laddar vi batterierna inför ett nytt år …”": "Last year's e-mail started like this: “Time to recharge our batteries for a new year …”",
    "Begränsningar": "Constraints",
    "Vad den inte får göra": "What it mustn't do",
    "Hitta inte på information som inte står här. Använd inga emojis.": "Don't make up any information that isn't given here. Don't use emojis.",
    "Skriv ett mejl om att vi har julstängt.": "Write an e-mail saying we're closed over Christmas.",
    "Uppgift": "Task",
    "ALLTID": "ALWAYS",
    "Ämne: God jul – så når du oss under helgerna": "Subject: Merry Christmas – how to reach us over the holidays",
    "Hej!": "Hi there!",
    "Bästa kund,": "Dear Customer,",
    "Vårt kontor är stängt från den 23 december till och med den 1 januari. Behöver du hjälp når du supporten 27–30 december kl. 9–15 på 08-123 45 67.": "Our office is closed from 23 December up to and including 1 January. If you need help, you can reach our support team on 27–30 December, 9 am–3 pm, on 08-123 45 67.",
    "Vårt kontor kommer att hålla stängt under en period i samband med jul- och nyårshelgerna. [ANGE DATUM]": "Our office will be closed for a period over the Christmas and New Year holidays. [INSERT DATES]",
    "[ANGE DATUM]": "[INSERT DATES]",
    "Kontakta oss gärna efter helgerna.": "Feel free to get in touch after the holidays.",
    "Vid akuta ärenden når du oss dygnet runt på support@företaget.se. ⚠️": "For urgent matters, you can reach us around the clock at support@thecompany.com. ⚠️",
    "Under det gångna året har vi genomfört många spännande projekt tillsammans med våra kunder och vi ser verkligen fram emot att fortsätta utveckla vårt samarbete under det kommande året, som vi tror kommer att bli ännu bättre.": "Over the past year we have carried out many exciting projects together with our customers, and we are really looking forward to continuing to develop our partnership over the coming year, which we believe will be even better.",
    "Tack för att du har varit med oss i år, det betyder mycket! Vi hoppas att du får en riktigt skön ledighet.": "Thank you for being with us this year – it means a lot! We hope you have a really relaxing break.",
    "Vi tackar för det gångna året och ser fram emot fortsatt samarbete.": "We would like to thank you for the past year and look forward to our continued cooperation.",
    "Nu laddar vi batterierna inför ett nytt år.": "Time to recharge our batteries for a new year.",
    "Varma hälsningar,": "Warm wishes,",
    "Kundteamet på Nordljus AB": "The customer team at Nordljus AB",
    "Med vänliga hälsningar": "Kind regards,",
    "[Ditt namn]": "[Your name]",
    "Vagt 😕": "Vague 😕",
    "Okej 🙂": "OK 🙂",
    "Bra 😀": "Good 😀",
    "Utmärkt 🤩": "Excellent 🤩"
  },
  "talk": {
    "title": "Prompt engineering",
    "time": "43–50 min",
    "goal": "Concrete and immediately useful: better prompt = better answer. Show the difference live.",
    "say": [
      "A <b>prompt</b> is what you write to the AI. And this is the most important practical skill today.",
      "Let's start with what most people write: “Write an e-mail saying we're closed over Christmas.” Look at the answer: vague, long, and it has <b>made up</b> an e-mail address. The highlighted line doesn't exist.",
      "Add <b>context</b>: the dates and support hours. Now the facts are right.",
      "<b>Audience and tone</b>: warm and personal. <b>Format</b>: short, with a subject line. Watch the answer shrink and get better.",
      "<b>Example</b>: show how it should sound. And <b>constraints</b>: don't make things up, no emojis.",
      "Think of the AI as a <b>super-smart new colleague who knows nothing about you</b>. Everything you'd tell a new colleague belongs in the prompt.",
      "And finally: <b>iterate</b>. The first answer is a draft. Say “shorter”, “more formal”, “add a bullet list”."
    ],
    "show": [
      "Start with all the parts switched off and read the answer.",
      "Switch on Context first, then the rest one at a time.",
      "Point at the quality meter."
    ],
    "ask": [
      [
        "Do I have to write such long prompts every time?",
        "No. Save your best prompts as templates. Many tools also have “custom instructions” or projects where you write the background once."
      ]
    ],
    "value": "A good prompt takes you from “AI is useless” to “that just saved me half an hour”.",
    "next": "But even with a perfect prompt, the AI can be wrong. Let's talk about that."
  }
});
