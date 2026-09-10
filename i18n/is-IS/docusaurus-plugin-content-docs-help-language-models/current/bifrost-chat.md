---
id: bifrost-chat
title: "Spjalla við Bifröst"
sidebar_label: "Spjalla við Bifröst"
sidebar_position: 2
---

**Spjalla við Bifröst** er gervigreindaraðstoð sem birtist sem upplýsingareitur hægra megin á þeim síðum sem þú vinnur á hvort eð er. Þú spyrð á venjulegu máli og aðstoðin svarar með rauntímagögnum úr Business Central, því hún getur kallað á Bifröst skilaboðategundir sem verkfæri á meðan hún vinnur.

Upplýsingareiturinn veit alltaf hvaða færslu þú ert að skoða. Ef þú opnar hann á sölupöntun hefur aðstoðin þá pöntun þegar í samhengi sínu og þú getur spurt um _þessa_ pöntun án þess að slá inn skjalanúmerið. Sama spjall er aðgengilegt á heilsíðu með aðgerðinni **Fókus** þegar upplýsingareiturinn verður of þröngur.

## Hvar upplýsingareiturinn birtist

Spjallreitnum er bætt við eftirfarandi staðalsíður:

| Svið | Síður |
| --- | --- |
| **Viðskiptamenn og lánardrottnar** | Spjald viðskiptamanns, listi viðskiptamanna, spjald lánardrottins, listi lánardrottna. |
| **Vörur** | Vöruspjald, vörulisti. |
| **Sölupappírar** | Sölutilboð, sölupöntun, sölureikningur, sölukreditnóta, söluskilapöntun og listasíður þeirra. |
| **Innkaupapappírar** | Innkaupatilboð, innkaupapöntun, innkaupareikningur, innkaupakreditnóta, innkaupaskilapöntun og listasíður þeirra. |
| **Færslur** | Fjárhagsfærslur, viðskiptamannafærslur, sundurliðaðar viðskiptamannafærslur, lánardrottnafærslur, vöruskiptafærslur, verðmætafærslur, VSK-færslur og bankareikningsfærslur. |
| **Skjöl á innleið** | Skjal á innleið, skjöl á innleið. |
| **Uppsetning Bifröst** | Ritill notandauppsetningar, þar sem þú getur prófað spjallið strax eftir að mállíkan hefur verið tengt notanda. |

Upplýsingareiturinn er falinn þegar núverandi notandi hefur ekki heimild til að spjalla eða þegar ekkert mállíkan er tiltækt. Sjá [Áður en hægt er að spjalla](#forkrofur) hér að neðan.

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Fókus** | Opnar samtalið á heilsíðunni **Spjalla við Bifröst**. Núverandi samtal, færslusamhengið og hæfni mállíkansins fylgja með, og allt sem þú bætir við á heilsíðunni skilar sér til baka þegar þú lokar henni. |
| **Notandauppsetning** | Opnar **ritil notandauppsetningar** Bifröst fyrir innskráðan notanda, þar sem tenging við mállíkan og persónuleg kerfisleiðbeining eru viðhaldin. |

## Færslusamhengi

Í hvert sinn sem þú færir þig á aðra færslu sendir síðan töflunúmerið, SystemId færslunnar og lýsingartexta til spjallsins. Lýsingartextinn birtist fyrir ofan spjallsvæðið svo þú sjáir hvaða færslu aðstoðin er að vinna með.

-   Spyrðu _„taktu saman opnar færslur þessa viðskiptamanns“_ og aðstoðin leysir „þessi viðskiptamaður“ úr samhenginu.
-   Þegar þú færð þig á aðra færslu er verkfæralotan hreinsuð svo aðstoðin blandi ekki saman gögnum frá fyrri færslu.
-   Sumar síður bæta við samhengishæfni – aukaleiðbeiningum sem eiga aðeins við á þeirri síðu – ofan á hæfnina úr mállíkaninu þínu.

## Áður en hægt er að spjalla {#forkrofur}

Tvennt þarf að vera uppfyllt til að upplýsingareiturinn birtist:

| Forkrafa | Hvernig hún er uppfyllt |
| --- | --- |
| **Spjallheimild** | Notandinn þarf að hafa heimildasettið `BIFROST Chat ori` (heiti _Spjallhlið_). Það fylgir vísvitandi hvorki Bifröst lesheimildum né fullum Bifröst heimildum – kerfisstjóri þarf að úthluta því til hvers notanda sem má nota gervigreindarspjallið. |
| **Mállíkan** | Að minnsta kosti eitt mállíkan á síðunni [Bifröst mállíkön](/help/language-models/bifrost-lang-model-list/) þarf að vera uppsett og nothæft, annað hvort merkt **Sjálfgefið** eða tengt notandanum í notandauppsetningu. |

Ef annað hvort vantar birtist upplýsingareiturinn einfaldlega ekki á síðunni – engin villuskilaboð koma. Byrjaðu úrræðaleitina á heimildasettinu og athugaðu því næst mállíkanið.

## Uppsetning mállíkans

1.  Opnaðu **Bifröst uppsetningu** og veldu aðgerðina **Bifröst mállíkön**.
2.  Búðu til mállíkan og gefðu því **Kóða** og **Lýsingu**.
3.  Veldu **Spjallveitanda**. _Copilot_ leiðir samtalið um Copilot-umgjörð Business Central; _Enginn_ slekkur á spjalli fyrir það mállíkan.
4.  Fylltu út líkanstillingarnar – **Líkan**, **Grunnslóð**, **Hámarksfjöldi tókena**, **Tímamörk (sekúndur)** – eða notaðu sjálfgefin gildi veitandans.
5.  Skrifaðu **Hæfni** á Markdown-sniði, eða notaðu **Flytja inn sjálfgefið** til að sækja staðlaðan hæfnitexta veitandans. Hæfnin segir aðstoðinni í hverju hún er sterk og hvernig hún á að svara.
6.  Merktu eitt mállíkan sem **Sjálfgefið**. Aðeins eitt mállíkan getur verið sjálfgefið og það er notað fyrir alla sem hafa enga persónulega tengingu.

Ef valinn veitandi krefst API-lykils biður spjallið um hann í fyrsta skipti sem það er notað og geymir hann á öruggan hátt í einangraðri geymslu. Kerfisstjórar með tilskildar heimildir geta þess í stað vistað þjónustulykil fyrir allt fyrirtækið svo einstakir notendur séu aldrei beðnir um lykil.

## Tenging mállíkans við notanda

Notandauppsetning Bifröst geymir reitinn **Kóði mállíkans** fyrir hvern notanda. Honum er breytt á síðunni **Ritill notandauppsetningar**, sem er aðgengileg með aðgerðinni **Notandauppsetning** í spjallreitnum eða úr Bifröst uppsetningu.

| Gildi | Áhrif |
| --- | --- |
| **Útfyllt** | Spjallið notar það mállíkan – veitanda þess, líkanstillingar og hæfni – aðeins fyrir þennan notanda. |
| **Tómt** | Spjallið fellur aftur á mállíkanið sem merkt er **Sjálfgefið**. Ef ekkert sjálfgefið mállíkan er til birtist spjallið ekki. |

Þannig getur eitt fyrirtæki keyrt fleiri en eina aðstoð samhliða: sölulíkan með söluleiðbeiningum, fjármálalíkan með bókunarleiðbeiningum og svo framvegis. Persónuleg kerfisleiðbeining notandans í notandauppsetningu bætist ofan á hæfni mállíkansins.

## Hvað aðstoðin getur gert

Bifrost Language Models inniheldur innbyggðan MCP verkfæraþjón. Hann birtir Bifröst skilaboðategundir sem verkfæri fyrir mállíkanið, svo aðstoðin geti flett gögnum upp og framkvæmt aðgerðir í stað þess að giska. Allt keyrir í þinni eigin lotu og undir þínum eigin Business Central heimildum – aðstoðin getur aldrei lesið eða skrifað neitt sem þú gætir ekki lesið eða skrifað sjálf/ur.

| Verkfæraflokkur | Til hvers aðstoðin notar hann |
| --- | --- |
| **Uppgötvun** | `list_message_types`, `get_message_type_help`, `search_tables`, `get_fields`, `who_am_i` – að finna hvaða aðgerðir, töflur og reitir eru til og hver er innskráður. |
| **Lestur gagna** | `get_records`, `get_record_ids`, `get_record_count`, `get_totals`, `find_entries` – að lesa færslur, telja þær, leggja saman upphæðir og fara úr skjali yfir í tengdar færslur. |
| **Breyting gagna** | `set_records`, `get_next_line_no` – að stofna og uppfæra færslur, til dæmis að bæta línu við sölupöntun. Aðstoðin les áður en hún skrifar og biður þig um staðfestingu fyrst. |
| **Skrár** | `get_blob`, `set_blob`, `list_blobs`, `delete_blobs`, `download_blob` – að meðhöndla viðhengi, PDF-skjöl og annað tvíundarefni og vista skrá á tækið þitt. |
| **Minni** | `get_user_memory`, `set_user_memory` – að muna óskir þínar milli samtala. Fyrirtækjaminni er lesið í upphafi hverrar lotu. |
| **Flakk** | `get_page_url` – að búa til smellanlegan tengil á síðu eða færsluspjald svo þú komist beint þangað. |
| **Annað** | `invoke_message_type` – að kalla á hvaða virka Bifröst skilaboðategund sem er, þar með taldar skilaboðategundir úr öðrum Bifröst viðbótum sem settar eru upp í umhverfinu. |

Þegar verkfæri er í gangi sýnir spjallið hvaða verkfæri er kallað. Niðurstöður verkfæra eru sendar aftur til líkansins, sem getur þá kallað á annað verkfæri áður en það svarar – ein spurning getur því orðið að nokkrum uppflettingum.

## Algeng verkefni

-   **Spyrja um núverandi færslu:** opnaðu skjalið, sláðu inn spurninguna og láttu aðstoðina leysa samhengið.
-   **Vinna í stærri glugga:** veldu **Fókus**, haltu samtalinu áfram og lokaðu síðunni til að snúa aftur í upplýsingareitinn með samtalið óskert.
-   **Skipta um aðstoð:** veldu **Notandauppsetning**, settu annan **Kóða mállíkans** og opnaðu síðuna aftur.
-   **Fá tengil:** biddu um tengil á færslu og aðstoðin skilar djúptengli sem þú getur smellt á eða deilt.
-   **Gefa aðstoðinni fastar leiðbeiningar:** settu þær í hæfni mállíkansins (fyrir hóp notenda) eða í persónulegu kerfisleiðbeininguna í notandauppsetningu (fyrir sjálfa/n þig).

## Ábendingar

-   Samtalið er ekki geymt í gagnagrunninum. Þegar síðunni er lokað lýkur samtalinu, svo afritaðu það sem þú vilt halda.
-   Notaðu minni fyrir staðreyndir sem eiga að lifa milli samtala – biddu aðstoðina að muna þær.
-   Aðstoðin svarar á því tungumáli sem er skráð á notandann, svo íslenskur notandi fær íslensk svör úr sama mállíkani.
-   Ef svörin virðast röng eða of almenn skaltu fyrst skoða **Hæfni** mállíkansins – sá texti mótar hegðun aðstoðarinnar.
-   Biddu aðstoðina að útskýra hvað hún gerði. Hún getur talið upp verkfærin sem hún kallaði á, sem er fljótlegasta leiðin til að sjá hvers vegna svarið er eins og það er.

## Sjá einnig

-   [Bifröst mállíkön](/help/language-models/bifrost-lang-model-list/) – Listi yfir öll skilgreind mállíkön
-   [Mállíkansspjald](/help/language-models/bifrost-lang-model-card/) – Veitandi, líkanstillingar og hæfni
-   [Hjálp fyrir Bifrost Language Models](/help/language-models/) – Yfirlit yfir viðbótina
