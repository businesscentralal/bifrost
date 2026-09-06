---
id: index
title: "Bifröst Nornir"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Tímasetning, eftirlit og endurræsing vinnsluraða í Business Central, ásamt keðjum sem tengja saman skilaboðategundir Bifrastar."
---

Bifröst Nornir sér um tímasetta vinnslu í Business Central. Hún hefur eftirlit með vinnsluraðafærslum, endurræsir þær og stýrir þeim, og hún keyrir **keðjur** — leiðbeinandi runur af skilaboðategundum þar sem svar eins skrefs stýrir beiðni þess næsta. Hún byggir á Bifröst Foundation, svo allt sem viðbótin gerir er líka aðgengilegt sem skilaboðategund gegnum biðraðarviðmót Bifrastar; ytra kerfi eða gervigreindaraðstoð getur keyrt keðju á nákvæmlega sama hátt og tímasett vinnsluraðafærsla gerir.

## Hvað hún gerir

- **Tímasetning og eftirlit vinnsluraða** — fylgist með vinnsluraðafærslum, endurræsir þær og stýrir þeim, með stillanlegri endurprófanarstefnu, endurtekningarsniðmátum, áætlunum og sjálfvirkri endurræsingu þegar verk bregst.
- **Tilkynningar með Telegram og tölvupósti** — boð þegar verk bregst eða er endurræst. Telegram-skeyti fara á spjallauðkenni notandans, tölvupóstur notar innbyggt póstkerfi Business Central.
- **Keðjur skilaboða** — leiðbeinandi fjölskrefa vinnuferli sem tengja saman skilaboðategundir Bifrastar, þar sem gögn flæða um sameiginlegt vinnusvæði með `@path`-tilvísunum.
- **Stýring skrefa** — forEach-ítrun yfir fylki úr fyrri skrefum, aðskilin næstu skref eftir því hvort skref tekst eða bregst, sleppa-ef-brást, upphafsskilyrði á hverju skrefi og blaðsíðuskipt keyrsla gegnum stór gagnasöfn.
- **Tímasettar keðjur** — keyrðu keðju reglulega gegnum vinnsluröðina, eða settu hana einu sinni í biðröð með eigin viðföngum.
- **Skýrslur eftir þörfum** — listaðu, skoðaðu, myndaðu (PDF, Excel, Word, XML) og keyrðu skýrslur án útprentunar, með endurnýtanlegum forsendum beiðnisíðu.
- **Keyrsluskrá** — hver keyrsla keðju er skráð sem keyrslufærsla með skrá fyrir hvert skref sem geymir beiðnina, svarið og mynd af vinnusvæðinu.
- **Uppsetningarleiðsögn** — leidd uppsetning á HTTP-biðlarabeiðnum, uppsetningu vinnsluraðar og Telegram-lyklinum.

## Hvernig hún virkar

1. Skráðu vinnsluraðafærslur sem **vinnsluraðarafærslur**; Nornir fylgist með þeim og endurræsir þær sjálfkrafa.
2. Stilltu **tilkynningartegund** (engin, tölvupóstur, Telegram) á hverri færslu til að fá boð þegar verk bregst.
3. Byggðu **keðjur** með því að búa til skref sem kalla á skilaboðategundir Bifrastar í röð, þar sem beiðnisniðmát nota `@`-tilvísanir í vinnusvæðið til að flytja gögn milli skrefa.
4. Keyrðu keðjur handvirkt, á áætlun, eða settu þær í biðröð til síðari keyrslu.

## Skilaboðategundir

| Flokkur | Tegundir |
| --- | --- |
| Vinnsluraðarafærslur | `Orchestrator.Entry.Register`, `Orchestrator.Entry.Run`, `Orchestrator.Entry.Restart`, `Orchestrator.Entry.Schedule` |
| Staða | `Orchestrator.Status.Get`, `Orchestrator.Status.Restart`, `Orchestrator.Status.RestartIfNeeded` |
| Vinnsluröð | `Orchestrator.JobQueueEntry.Restart`, `Orchestrator.JobQueueEntry.RestartIfNeeded` |
| Keðjur | `Orchestrator.Playbook.Run`, `Orchestrator.Playbook.Schedule`, `Orchestrator.Playbook.Enqueue`, `Orchestrator.Workspace.Preview` |
| Skýrslur | `Orchestrator.Report.List`, `Orchestrator.Report.Get`, `Orchestrator.Report.Run`, `Orchestrator.Report.SaveAs` |
| Afhending | `Orchestrator.Email.Send`, `Orchestrator.Telegram.Message` |
| Hjálp | `Help.Orchestrator.Get` |

`Help.Orchestrator.Get` er efnisyfirlit viðmótsins: hún skilar Markdown-lýsingu á öllum tegundunum hér að ofan.

## Kröfur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrri, Essentials eða Premium.
- Bifröst Foundation, fáanleg sér á AppSource.
- Fyrir Telegram-tilkynningar: Telegram-vélmennislykill búinn til gegnum `@BotFather`, og Telegram-spjallauðkenni á hvern notanda í Bifrost User Setup.
- Fyrir tölvupósttilkynningar: póstreikningur í Business Central með uppsettri póstsviðsmynd.

## Hvert skal halda næst

- [Hjálp í kerfinu](/help/nornir/)
- [Uppflettirit skilaboðategunda](./reference/message-types/) — beiðni og svar fyrir hverja tegund, búið til beint úr forritinu
- [Notendasviðsmyndir fyrir AppSource](./user-scenarios)
- [Skráning í Partner Center](./listing)
- [Byggja á Bifröst](/extensibility/)
