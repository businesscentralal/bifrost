---
id: bifrost-chat
title: "Spjalla með Bifröst"
---

**Spjalla með Bifröst** er gervigreindaraðstoðarmaður í upplýsingareitasvæði síðunnar sem þú ert á.
Spurðu á venjulegu máli; aðstoðarmaðurinn les lifandi gögn úr Business Central til að svara og vinnur
sem þú, innan þinna heimilda. Þessi hjálp opnast af síðunum sem sýna spjallið. Um síðuna sjálfa, sjá
skjölun Microsoft um Business Central.

## Hvar þú finnur það {#where-you-find-it}

| Svið | Síður |
| --- | --- |
| **Viðskiptamenn og lánardrottnar** | Spjald og listi viðskiptamanna, spjald og listi lánardrottna |
| **Vörur** | Vöruspjald og vörulisti |
| **Sala** | Sölutilboð, sölupöntun, sölureikningur, sölukreditreikningur og söluvöruskilapöntun, og listar þeirra |
| **Innkaup** | Innkaupatilboð, innkaupapöntun, innkaupareikningur, innkaupakreditreikningur og innkaupavöruskilapöntun, og listar þeirra |
| **Færslur** | Fjárhagsfærslur, viðskiptamannafærslur og sundurliðaðar viðskiptamannafærslur, lánardrottnafærslur, birgðafærslur, virðisfærslur, VSK-færslur og bankareikningsfærslur |
| **Innkomin skjöl** | Innkomið skjal og listi innkominna skjala |
| **Bifröst** | Notandauppsetning Bifröst, til að prófa spjallið um leið og mállíkan hefur verið valið |

## Færslan sem þú ert á {#the-record-you-are-on}

Spjallið veit hvaða færslu þú ert með opna og sýnir heiti hennar fyrir ofan samtalið. Spurðu *„taktu
saman opnar færslur þessa viðskiptamanns“* eða *„vantar eitthvað á lager fyrir þessa pöntun?“* án þess að
slá inn númerið. Þegar þú ferð í aðra færslu fylgir spjallið henni.

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Fókus** | Opnar samtalið á heilli síðu, með sömu færslu. Lokaðu síðunni til að fara til baka; samtalið fylgir þér. |
| **Notandauppsetning** | Opnar [notandauppsetningu Bifröst](/help/foundation/bifrost-user-setup-editor/) fyrir þig, þar sem þú velur mállíkanið þitt og skrifar eigin leiðbeiningar til aðstoðarmannsins. |

## Áður en þú getur spjallað {#prerequisites}

Spjallið birtist aðeins þegar allt þetta er til staðar. Ef eitthvað vantar birtist það ekki og engin
villuboð koma.

| Skilyrði | Hver sér um það |
| --- | --- |
| Heimildasamstæðan `BIFROST Chat ori`, ásamt `BIFROST LLM Rd ori`, og `BIFROST LLM Chat ori` fyrir aðra veitu en Copilot | Kerfisstjórinn þinn |
| Mállíkan valið í **Kóði mállíkans** í notandauppsetningu Bifröst hjá þér | Kerfisstjórinn þinn, eða þú |
| Líkan sem getur svarað: API-lykill fyrir veitu þess (sameiginlegur eða þinn eigin), eða kveikt á Copilot | Kerfisstjórinn þinn, eða þú |

## Hvernig hann svarar {#how-it-answers}

Aðstoðarmaðurinn notar aðgerðir Bifröst sem verkfæri: hann kannar hvað er uppsett, les færslur, telur
þær og leggur saman, rekur skjal til færslna þess og, með þínu samþykki, stofnar eða breytir færslum.
Hann getur líka gefið þér tengil sem opnar síðu eða færslu, unnið með viðhengi og vistað skrá í tækinu
þínu. Spjallið sýnir hvaða verkfæri hann kallar á meðan hann vinnur, og ein spurning getur tekið nokkur
skref.

- **Tölur koma úr gögnunum þínum.** Aðstoðarmanninum er sagt að nefna aldrei viðskiptatölu sem hann hefur
  ekki lesið. Ef svar inniheldur tölur sem hann hefur ekki lesið í þeirri umferð biður Bifröst hann einu
  sinni að sannreyna þær í Business Central eða segja að hann geti það ekki.
- **Hann vinnur sem þú.** Hann getur aðeins lesið og breytt því sem þú gætir sjálf(ur), innan varna
  Bifröst. Hvert kall er skráð á **Bifröst skilaboð**.
- **Hann svarar á þínu tungumáli**, tungumáli Business Central-setunnar þinnar.
- **Það sem hann man.** Biddu hann að muna eitthvað og hann geymir það fyrir næstu samtöl. Hann les líka
  það sem hefur verið geymt fyrir allt fyrirtækið.

## Algeng verk {#common-tasks}

- **Spyrja um færsluna sem er opin:** opnaðu skjalið og skrifaðu spurninguna.
- **Vinna í stærri glugga:** veldu **Fókus**, haltu áfram og lokaðu síðunni til að fara til baka.
- **Skipta um aðstoðarmann:** veldu **Notandauppsetning**, veldu annan **Kóða mállíkans** og opnaðu
  síðuna aftur.
- **Gefa aðstoðarmanninum föst fyrirmæli:** skrifaðu þau í kerfisleiðbeiningarnar í notandauppsetningu
  Bifröst. Fyrir heilt teymi skrifar kerfisstjóri þau í hæfni mállíkans teymisins.

## Ábendingar {#tips}

- Samtalið er ekki vistað. Þegar síðunni er lokað lýkur því, svo afritaðu það sem þú vilt halda í.
- Í löngu samtali er ekki víst að elstu skilaboðin séu send líkaninu lengur; núverandi spurning er alltaf
  send. Byrjaðu nýtt samtal fyrir nýtt verk.
- Ef svörin virðast skrýtin skaltu spyrja aðstoðarmanninn hvaða verkfæri hann kallaði á, og athuga hæfni
  mállíkansins þíns.

## Sjá einnig {#see-also}

- [Bifröst mállíkan](/help/language-models/bifrost-lang-model-card/): veita, líkan, lykill og hæfni
- [Bifröst mállíkön](/language-models/): hvað forritið gerir og hvernig það er sett upp
