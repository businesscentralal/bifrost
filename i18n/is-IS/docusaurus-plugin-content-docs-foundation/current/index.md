---
id: index
title: "Bifröst Foundation"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Skilaboðadrifið API fyrir Business Central: biðröð, verk og svar, sjálflýsandi skilaboðagerðir og grunnurinn sem öll önnur Bifrastar-forrit byggja á."
---

Bifröst Foundation breytir viðskiptarökum Business Central í API sem hægt er að kalla á og lýsir sér sjálft. Ytra kerfi sendir CloudEvents-umslag á biðraðar-API-ið (`origo/bifrost/v1.0`), Business Central keyrir viðeigandi **skilaboðagerð** — `Customer.CreditLimit.Get`, `Sales.Document.Post`, `Data.Records.Set` — og niðurstaðan kemur til baka í gegnum svar-API-ið, ýmist samstillt eða úr bakgrunnskeyrslu.

Allt annað í Bifrastar-fjölskyldunni er forrit sem byggir ofan á þessu og bætir sínum eigin skilaboðagerðum í safnið. Foundation sér um flutninginn, biðröðina, leyfin, leyndarmálageymsluna, beiðnaskrána, tungumálaskiptin og uppgötvunina; forritið ofan á skrifar viðskiptarökin og hjálparskjalið.

## Hvað það gerir

- **Eitt API fyrir allar aðgerðir** — þrír endapunktar (biðröð, verk, svar) bera allar skilaboðagerðir, svo kallandinn lærir flutninginn einu sinni.
- **Staðlaðar ERP-skilaboðagerðir strax** — gagnaaðgangur, lýsigögn, sala, innkaup, fjármál, birgðir, verk, tilföng, samþykktir, móttekin skjöl, breytingaskrá, minni og tilkynningar til notenda.
- **Sjálflýsandi** — `Help.MessageTypes.Get` skilar safninu og `Help.Implementation.Get` skilar fullum beiðni- og svarsamningi einnar gerðar sem Markdown, þannig að gervigreindarumboð getur fundið og kallað á gerð sem það hefur aldrei séð.
- **Stækkanlegt frá grunni** — forrit ofan á bætir við gildi í `enumextension` og einni kóðaeiningu sem útfærir `Msg Interface ori`; ekkert breytist í Foundation.
- **Öryggi á svæðastigi** — lestur og skrif á einstök svæði má takmarka eftir notanda eða Entra-forriti, ofan á venjulegar heimildir Business Central.
- **Vörn breytingaskrár við skrif** — `Data.Records.Set` má takmarka við svæði sem breytingaskrá Business Central nær yfir, svo hver skrif í gegnum API skilja eftir sig slóð.
- **Ein leyndarmálageymsla** — öll forrit fjölskyldunnar skrá aðgangsupplýsingar sínar hjá Foundation og sækja þær með einu kalli; gildin liggja í Isolated Storage og eru hulin í beiðnaskránni.
- **Atburðir og vefkrókar** — ytri viðskiptaatburðir kvikna þegar skilaboð klárast eða mistakast, svo kallendur fá að vita í stað þess að þurfa að spyrja.

## Hvernig það virkar

1. Kallandi sendir CloudEvents 1.0 umslag sem nefnir skilaboðagerð á `.../tasks`.
2. Foundation staðfestir kallandann, finnur útfærslukóðaeininguna og keyrir hana strax eða setur hana í biðröð fyrir bakgrunnskeyrslu.
3. Útfærslan vinnur verkið í Business Central og skrifar JSON-svar.
4. Kallandinn les niðurstöðuna af svar-endapunktinum, eða fær vefkrók þegar skilaboðin klárast.

## Hvert skal halda næst

- [Leiðbeiningar um skilaboðagerðir](./message-types/) — hvað hvert viðskiptasvið staðlaða safnsins getur gert
- [API-viðmiðun](./reference/api/) — endapunktar, umslagið, auðkenning og form svara
- [Uppsetningarviðmiðun](./reference/setup/) — Bifröst uppsetningarsíðan og útfærsluaðferðirnar að baki henni
- [Viðmiðun skilaboðagerða](./reference/message-types/) — beiðni- og svarsamningur hverrar gerðar, myndaður úr forritinu sjálfu
- [Hjálp í kerfinu](/help/foundation/) — ein síða fyrir hverja Business Central síðu í forritinu
- [Byggðu á Bifröst](/extensibility/) — hvernig forrit ofan á er skrifað
- [Kunnátta fyrir gervigreindarumboð](/skills/) — hvernig umboð á að keyra API-ið

## Kröfur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrra, Essentials eða Premium.
- Útgangandi HTTP-beiðnir virkjaðar fyrir viðbótina þar sem forrit ofan á kallar á ytri þjónustu.
