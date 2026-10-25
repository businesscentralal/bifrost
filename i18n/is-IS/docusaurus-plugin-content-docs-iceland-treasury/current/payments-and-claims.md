---
id: payments-and-claims
title: "Greiðslur og kröfur"
sidebar_label: "Greiðslur og kröfur"
sidebar_position: 2
description: "Hvernig Bifröst Ísland Fjárstýring skráir greiðslubunka til samþykktar í bankanum, staðfestir greiðslur út frá bankayfirliti, og stofnar kröfur og fylgir þeim og greiðslum þeirra eftir."
---

# Greiðslur og kröfur

Þessi síða er fyrir fjármálasviðið sem greiðir lánardrottnum og innheimtir hjá viðskiptamönnum í gegnum
Bifröst Ísland Fjárstýringu. Hún útskýrir hvað gerist frá því að greiðslubunki eða krafa er send til
bankans þar til hún er greidd, og hvar þú sérð hvert skref í Business Central.

## Greiðslubunki frá upphafi til enda {#a-payment-batch-start-to-finish}

1. **Skráðu bunkann.** Aðstoðarmaður, samþætting eða tímasett keyrsla skráir bunkann í bankanum:
   reikninginn sem greitt er af og hverja greiðslu með viðtakanda, upphæð og tilvísun. Innlendir bunkar
   (ISK) fara til Arion banka, Kviku banka, Landsbankans eða sparisjóðs, bunkar erlendra greiðslna til Arion banka,
   Íslandsbanka eða Landsbankans.
   Bifröst fer yfir bunkann áður en kallað er á bankann: bunka með *STP* í heitinu er hafnað, og
   sömuleiðis framvirkri greiðsludagsetningu sem er liðin. Ef engin dagsetning er gefin er bunkinn fyrir
   daginn í dag.
2. **Samþykktu og greiddu hann í bankanum.** Hjá Arion banka og Landsbankanum bíður bunkinn nú í
   netbanka bankans. Starfsmaður fyrirtækisins sem má samþykkja greiðslur þar samþykkir hann og bankinn
   greiðir. Hjá Kviku banka og sparisjóðunum fer það eftir heimildunum sem bankinn veitir vefþjónustunotandanum þínum
   hvort hann bíður. Bifröst hvorki samþykkir né undirritar bunka. Byrjaðu heiti bunkans á `*` svo sá starfsmaður sjái hann: án
   þess sýnir netbankinn bunkann aðeins vefþjónustunotandanum sem skráði hann.
3. **Fylgstu með niðurstöðunni.** Þegar niðurstaða bunkans er lesin í bankanum uppfærist staða hans í
   Business Central: bíður samþykktar, í vinnslu, lokið, lokið með villum, eytt. Greiðsla sem bankinn
   hafnaði sýnir villuna, og hægt er að skrá hafnaðar greiðslur aftur sem nýjan bunka.
4. **Sjáðu að hún er greidd.** Greiðsla er greidd þegar yfirlit reikningsins sem greitt er af sýnir
   hana. Hvert yfirlit sem Bifröst les, og hver innflutningur í bankaafstemmingu, er borið saman við
   opnar greiðslur þess reiknings: samsvarandi úttekt merkir greiðsluna **Greidd**, með tilvísun
   yfirlitsins, svo sama færsla er aldrei pöruð tvisvar. Innlögn sömu upphæðar á reikning viðtakanda
   staðfestir greiðslu líka.

### Valkostir bunka {#choices-on-a-batch}

- **Ein úttekt fyrir bunkann.** Bankinn getur tekið heildarupphæð bunkans af greiðslureikningnum í einni
  úttekt (ein lína á yfirliti), eða eina úttekt fyrir hverja greiðslu (ein lína hver, sjálfgefið).
- **Fyrir hvað greiðslan er.** Greiðsla getur tilgreint hvað hún greiðir í Business Central: bókaðan
  innkaupareikning, lánardrottna- eða viðskiptamannafærslu, lánardrottin, línu í greiðslubók,
  fjárhagsreikning eða bankareikning. Bifröst athugar að færslan sé til áður en kallað er á bankann og
  geymir hana með greiðslunni. Hún er aldrei send til bankans.
- **Erlendar greiðslur þurfa flokkunarlykil Seðlabankans** fyrir hverja greiðslu, sem segir Seðlabanka
  Íslands til hvers greiðslan er. Landsbankinn tekur þriggja stafa bókstafalykla, til dæmis `VAR` fyrir
  vörur, `THJ` fyrir þjónustu, `INN` fyrir millifærslu á reikning í eigin nafni og `LAU` fyrir laun.
  Arion banki og Íslandsbanki taka eldri tölulyklana, til dæmis `099` fyrir önnur vöruviðskipti, `350`
  fyrir ýmsa viðskiptaþjónustu, `305` fyrir tölvu- og upplýsingaþjónustu og `421` fyrir vinnulaun.
  Lykli sem bankinn tekur ekki við er hafnað áður en kallað er á bankann.

### Hvar þú sérð það {#where-you-see-it}

- [Greiðslubunkar í banka](/help/iceland-treasury/bank-payment-batches/): hver bunki sem Bifröst skráði,
  staða hans í bankanum, greiðslur hans og kostnaður þeirra.
- [Greiðslur í banka](/help/iceland-treasury/bank-payments/): stakar greiðslur, opnaðar úr **Finna færslur**.
- [Ferilskrá bankaaðgerða](/help/iceland-treasury/bank-tracking-log/): hver aðgerð í banka, með stöðunni
  eftir hana.

## Krafa frá upphafi til enda {#a-claim-start-to-finish}

1. **Settu upp innheimtusamninginn.** Hver innheimtusamningur við banka eða innheimtufyrirtæki er
   greiðslumáti á síðunni **Greiðsluhættir** með kröfuauðkenni hans og síðasta kröfunúmeri sem var notað. Sjá
   [Greiðsluhættir](/help/iceland-treasury/payment-methods/).
2. **Stofnaðu kröfuna.** Aðstoðarmaður, samþætting eða tímasett keyrsla stofnar kröfuna í bankanum:
   greiðanda, upphæð, kröfudag og eindaga, og ef vill viðskiptamanninn, viðskiptamannafærslurnar sem hún
   innheimtir og greiðslumátann. Bifröst athugar viðskiptamanninn, færslurnar og greiðslumátann áður en
   kallað er á bankann. Hjá Arion banka, Íslandsbanka, Kviku banka og sparisjóðunum, og hjá
   innheimtufyrirtækjunum Gjaldskilum og InKasso, eru kröfur stofnaðar, þeim breytt og þær felldar niður í
   bunkum: bankinn eða innheimtufyrirtækið tekur fyrst við bunkanum og tilkynnir svo niðurstöðu hverrar
   kröfu. Hjá
   Landsbankanum er krafa stofnuð undir einu af kröfusniðmátum þínum og staðfest strax.
3. **Fylgstu með henni.** Krafan og færslur hennar eru geymdar í Business Central, og viðskiptamannafærslan
   sýnir kröfureikning, kröfudag og stöðu kröfunnar í upplýsingareit sínum. Þegar kröfunni er breytt eða
   hún felld niður í bankanum uppfærist hún.
4. **Skráðu greiðslurnar.** Þegar greiðslur krafna eru lesnar í bankanum er hver greiðsla skráð einu
   sinni, á kröfuna sína. Krafa verður **Greidd að hluta** eða **Greidd** aðeins út frá greiðslunum sem
   eru skráðar á hana, og **Útrunnin** þegar niðurfellingardagur bankans er liðinn. Þegar bankinn gefur
   niðurfellda kröfu aftur upp sem opna, til dæmis af því að hún var endurvakin í netbankanum, opnast
   krafan aftur.

Innheimtufyrirtæki fer eins með kröfur og banki, og kröfur þess birtast á sömu síðum, með
innheimtufyrirtækið sem banka.

### Hvar þú sérð það {#where-you-see-it-1}

- [Kröfur í banka](/help/iceland-treasury/bank-claims/): hver krafa, með færslum hennar og greiðslum.
- [Kröfubunkar í banka](/help/iceland-treasury/bank-claim-batches/): hver bunki krafna sem sendur var til banka.
- [Greiðslur krafna í banka](/help/iceland-treasury/bank-claim-payments/): hver greiðsla sem bankarnir og innheimtufyrirtækin tilkynntu.
- Upplýsingareiturinn [Upplýsingar um viðskiptamannafærslu](/help/iceland-treasury/customer-ledger-factbox/).

## Bókun {#posting}

Rakningarsíðurnar hafa reiti fyrir bókun í Business Central: fylgiskjalsnúmer, bókunardagsetningu,
sniðmát, keyrslu og línu færslubókar, og **Bókað**. Bifröst Ísland Fjárstýring bókar ekki greiðslur eða
greiðslur krafna, svo þessir reitir eru auðir. Bókaðu greiðslur og greiðslur krafna í Business Central
eins og þú gerir í dag. Bankareikningurinn sem hver bunki er greiddur af, og sem hver krafa er greidd inn
á, er sýndur svo auðvelt sé að finna þær.

## Næstu skref {#next-steps}

- Síður bankanna: [Arion banki](/iceland-treasury/banks/arion/) · [Íslandsbanki](/iceland-treasury/banks/islandsbanki/) ·
  [Kvika banki](/iceland-treasury/banks/kvika/) · [Landsbankinn](/iceland-treasury/banks/landsbankinn/) ·
  [Sparisjóðir](/iceland-treasury/banks/sparisjodir/)
- Innheimtufyrirtækin: [Gjaldskil](/iceland-treasury/agencies/gjaldskil/) · [InKasso](/iceland-treasury/agencies/inkasso/)
- [Heimildasamstæður](/iceland-treasury/#permissions) fyrir greiðslur og kröfur
