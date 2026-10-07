---
id: permissions
sidebar_position: 2
slug: /end-customers/permissions
title: "Heimildasamstæður og hlið"
sidebar_label: "Heimildasamstæður og hlið"
description: "Fyrir kerfisstjóra: heimildasamstæður Bifröst, og hvernig hliðin meðal þeirra virka ofan á eigin heimildir hvers notanda í Business Central."
---

# Heimildasamstæður og hlið

Þessi síða er fyrir kerfisstjórann sem veitir fólki og samþættingum aðgang að Bifröst. Hún lýsir heimildasamstæðum Bifröst
og því hvernig **hliðin** meðal þeirra virka ofan á eigin heimildir hvers notanda í Business Central. Hvaða töflur og reiti
fulltrúi má lesa og breyta er í [Stjórnaðu því hvað fulltrúar lesa og breyta](/documentation/end-customers/data-access/).
Stutta útgáfan er í [Veittu fólki og forritum heimildir](/setup/business-central/#give-people-and-apps-permission).

Heimildasamstæðum er úthlutað í Business Central, á **Notendur** og **Microsoft Entra forrit**, af notanda sem má úthluta
heimildum.

## Tvö lög heimilda {#two-layers-of-permission}

Fulltrúi starfar sem notandinn í Business Central sem hann vinnur fyrir, og samþætting sem Microsoft Entra forritið sitt.
Hver beiðni keyrir með heimildum þess auðkennis, svo fulltrúi getur aldrei gert meira en notandinn getur gert í
biðlaranum. Tvö lög ráða því hvað hann má:

1. **Heimildir Business Central**, eins og í biðlaranum: venjulegar heimildasamstæður notandans ráða hvaða gögn hann má
   lesa, breyta og bóka. Bifröst bætir engu við þær.
2. **Heimildasamstæður Bifröst**: `BIFROST API ori` leyfir auðkenninu að kalla í Bifröst yfirleitt, og **hlið** opnar
   hverja aðgerð sem Bifröst heldur lokaðri jafnvel fyrir notanda sem gæti framkvæmt hana í biðlaranum, til dæmis bókun.

Bæði lögin verða að leyfa aðgerð. Notandi sem má bóka sölureikninga í biðlaranum getur ekki bókað þá í gegnum Bifröst án
bókunarhliðsins, og hliðið eitt bókar ekkert fyrir notanda sem má ekki bóka í biðlaranum.

## Heimildasamstæður Bifröst {#the-bifröst-permission-sets}

Á **Heimildasamstæður** leitarðu að *BIFROST* til að sjá þær allar.

![Heimildasamstæður Bifröst](/img/guides/is-is/permission-sets.png)

**Grunnsamstæður**: ein þeirra fyrir hvert auðkenni sem notar Bifröst.

| Samstæða | Fyrir | Hvað hún veitir |
|---|---|---|
| `BIFROST API ori` | Hvern þann einstakling eða samþættingu sem kallar í Bifröst | Að kalla í Bifröst, eigin skilaboð notandans, minni og athugasemdir, og uppsetninguna sem Bifröst les til að svara (gjaldmiðlar, verð, VSK-bókunargrunnur). Engin viðskiptagögn umfram það |
| `BIFROST Read ori` | Þjónustufólk | Að skoða síður og annála Bifröst, og eigin skilaboð notandans. Hún breytir engum stillingum |
| `BIFROST Full ori` | Umsjónarmenn Bifröst | Öll eigin gögn og síður Bifröst, þar á meðal skilaboð allra notenda. Ekki bókunar-, samþykktar-, leyfis-, þvingunar-, spjall- eða upprunahliðin: umsjónarmaður úthlutar þeim sérstaklega, líka sjálfum sér. Hún inniheldur þó hliðið fyrir innkomna vefkróka |

**Hlið**: hvert opnar eina tegund aðgerða. Þau geyma engin gögn.

| Samstæða | Opnar |
|---|---|
| `BIFROST GL Post ori` | Bókun sem endar í fjárhag: færslubækur fjárhags, sölu- og innkaupaskjöl, leiðrétting og ógilding bókaðra reikninga, bankaafstemmingar, leiðrétting gengis, jöfnun og afturköllun jöfnunar viðskiptamanna- og lánardrottnafærslna, og bakfærsla bókunarfærslna og færslna |
| `BIFROST ItemPost ori` | Bókun birgðabóka |
| `BIFROST FA Post ori` | Bókun eignabóka |
| `BIFROST Job Post ori` | Bókun verkbóka og reikningsgerð úr verkfærslum |
| `BIFROST Res Post ori` | Bókun forðabóka |
| `BIFROST ApprAdm ori` | Að senda skjöl til samþykktar og hætta við samþykktarbeiðnir |
| `BIFROST LicAdm ori` | Leyfisaðgerðirnar á Uppsetningu Bifröst, og notkun |
| `BIFROST Force ori` | Að þvinga breytingu framhjá breytingaskrárvernd þegar hún er stillt á **Með þvingunarheimild**, og, í öllum stillingum verndarinnar, að breyta [grunnstillingarreitum fyrirtækisins](/documentation/end-customers/data-access/#company-configuration-fields) meðan það er sett upp. Aðeins fyrir þá sem setja upp fyrirtæki |
| `BIFROST Webhook ori` | Að taka á móti vefkrókum: fyrir auðkennið sem framsendir þá inn í Business Central |
| `BIFROST Chat ori` | Að opna spjall Bifröst |
| `BIFROST SrcApOwn ori` | Að samþykkja verkfæri (uppruna setu) fyrir sjálfan sig |
| `BIFROST SrcApAdm ori` | Að samþykkja verkfæri fyrir hvaða notanda sem er |
| `BIFROST SrcApCfg ori` | Sýnir **Tegund samþykktar** notanda þeim sem hafa ekki `BIFROST Full ori`. Sá sem hefur `BIFROST Full ori` getur breytt henni án þessarar samstæðu |
| `BIFROST ReqLgAdm ori` | Að kveikja og slökkva á **Villuleitarstilling beiðna** |

**Gagnasamstæður**: aukinn aðgangur að einu svæði gagna Bifröst.

| Samstæða | Veitir |
|---|---|
| `BIFROST CoMem ori` | Að breyta fyrirtækisminni og þýðingum |
| `BIFROST Transl. ori` | Að breyta þýðingum |
| `BIFROST Integr. ori` | Að stjórna útleiðandi samþættingarslóðum |
| `BIFROST ApprLog ori` | Að lesa samþykktaannálinn |

## Hvernig hlið virkar {#how-a-gate-works}

Hvert hlið er heimildasamstæða sem veitir eitt: heimild til að breyta töflu sem geymir engar færslur. Áður en Bifröst
framkvæmir aðgerð á bak við hlið spyr það Business Central hvort notandinn megi breyta þeirri töflu. Ef ekki, er engu
lesið, breytt eða bókað, og svarið nefnir heimildasamstæðuna sem vantar.

![BIFROST GL POST ORI inniheldur aðeins hlið sitt](/img/guides/is-is/posting-gate-set.png)

Af þessu leiðir:

- **Lesheimild á hlið opnar ekkert.** `BIFROST Read ori` getur lesið sum hlið til að sýna stillingar; það dugar ekki til
  að komast í gegnum þau.
- **SUPER kemst í gegnum öll hlið.** Haltu SUPER frá notendum og samþættingum sem vinna í gegnum Bifröst.
- **Hlið bætir engri gagnaheimild við.** Til að bóka sölureikning í gegnum Bifröst þarf notandinn heimild Business Central
  til að bóka söluskjöl *og* `BIFROST GL Post ori`. Forskoðun bókunar þarf líka hliðið.
- **Hlið virka í gegnum öryggishópa** eins og hver önnur heimildasamstæða: úthlutaðu hliðinu á hópinn. Nema
  `BIFROST ReqLgAdm ori`: úthlutaðu henni beint á notandann.
- **`BIFROST Full ori` opnar ekkert bókunarhlið** (aðeins hliðið fyrir innkomna vefkróka). Umsjónarmaður sem bókar í
  gegnum Bifröst þarf líka bókunarhliðin.

## Hvaða hlið opnar hvað {#which-gate-opens-what}

Þegar fulltrúi reynir eitthvað sem hlið notandans opna ekki, hafnar Bifröst með skilaboðum á borð við *Bókun hafnað: vantar
'BIFROST GL Post ori' heimildasamstæðu*, og biður notandann að fá kerfisstjóra til að úthluta henni.

| Notandinn vill að fulltrúinn | Heimild Business Central til að | Og hliðið |
|---|---|---|
| Lesi viðskiptamenn, vörur, skjöl, færslur | lesa þau | - (`BIFROST API ori`) |
| Stofni eða breyti sölupöntun | stofna og breyta söluskjölum | - |
| Bóki sölu- eða innkaupaskjal, færslubók fjárhags, bankaafstemmingu | bóka þau | `BIFROST GL Post ori` |
| Bóki birgðabók | bóka birgðabækur | `BIFROST ItemPost ori` |
| Sendi innkaupapöntun til samþykktar | nota samþykktir | `BIFROST ApprAdm ori` |
| Lesi notkun eða leyfi | - | `BIFROST LicAdm ori` |

## Algengar samsetningar {#typical-combinations}

| Hver | Heimildasamstæður Bifröst |
|---|---|
| Sá sem spyr og undirbýr skjöl | `BIFROST API ori` |
| Bókari sem bókar líka í gegnum Bifröst | `BIFROST API ori`, `BIFROST GL Post ori` |
| Lagerstarfsmaður sem bókar birgðabækur | `BIFROST API ori`, `BIFROST ItemPost ori` |
| Innkaupafulltrúi sem sendir pantanir til samþykktar | `BIFROST API ori`, `BIFROST ApprAdm ori` |
| Samþætting (Entra forrit) | `BIFROST API ori`, og aðeins hlið þess sem hún gerir. Aldrei SUPER |
| Auðkennið sem framsendir vefkróka | `BIFROST API ori`, `BIFROST Webhook ori` |
| Þjónustufólk | `BIFROST Read ori` |
| Umsjónarmaður Bifröst | `BIFROST Full ori`, `BIFROST LicAdm ori`; `BIFROST ReqLgAdm ori` aðeins meðan villuleitað er |

Bættu við venjulegum heimildasamstæðum Business Central hvers notanda fyrir gögnin sem hann vinnur með, eins og fyrir
biðlarann.

## Úthluta og athuga {#assign-and-check}

**Úthluta.** Opnaðu **Notendur**, opnaðu notandann og bættu samstæðunum við undir **Heimildasamstæður notanda**. Fyrir
samþættingu opnarðu **Microsoft Entra forrit** og forritið, og bætir þeim við þar. Breytingar gilda um beiðnir sem eru
gerðar eftir á.

**Athuga hlið.** Á notandaspjaldinu velurðu **Virkar heimildir** og finnur hliðið: það heitir eftir samstæðu sinni (til
dæmis **BIFROST GL Post ori**). Þegar **Breyta heimild** er *Já* er hliðið opið fyrir notandann.

## Úrræðaleit {#troubleshooting}

| Fulltrúinn segir | Af hverju | Hvað á að gera |
|---|---|---|
| *Bókun hafnað: vantar '...' heimildasamstæðu* | Notandann vantar bókunarhliðið | Úthlutaðu samstæðunni sem er nefnd |
| Að hann hafi ekki heimildir á tiltekinni töflu | Notandann vantar sjálfa heimild Business Central | Úthlutaðu venjulegri heimildasamstæðu Business Central |
| Að hann geti alls ekki kallað í Bifröst | Ekkert `BIFROST API ori` | Úthlutaðu henni |
| Að ekki sé hægt að senda samþykktarbeiðnir | Ekkert `BIFROST ApprAdm ori` | Úthlutaðu henni |
| Að reit vanti eða ekki sé hægt að breyta honum | Ekki heimildasamstæða: reitaaðgangur eða innbyggð vernd | [Stjórnaðu því hvað fulltrúar lesa og breyta](/documentation/end-customers/data-access/) |

**Næst:** [Stjórnaðu því hvað fulltrúar lesa og breyta](/documentation/end-customers/data-access/)
