---
id: treasury-secrets
title: "Leyndarmál banka"
sidebar_label: "Leyndarmál banka"
sidebar_position: 4
---

Sérhver íslensk bankatenging þarf auðkenni: lykilorð, yfirleitt skírteini biðlara og fyrir Landsbankann API-lykil. Þessi síða útskýrir hvar gildin eru geymd, hverjir sjá þau og hvað skal gera þegar eitthvað vantar.

## Hvað er geymt

| Leyndarmál | Umfang | Notað af |
|---|---|---|
| **Lykilorð fyrirtækis** | Eitt gildi á fyrirtæki | Öllum bönkunum fimm |
| **Lykilorð notanda** | Eitt gildi á notanda | Öllum bönkunum fimm, þegar notandi hefur eigið notandanafn hjá banka |
| **Skírteini** | Eitt gildi á fyrirtæki | Landsbankanum, Arion banka, Kvika banka, Sparisjóðum |
| **Lykilorð skírteinis** | Eitt gildi á fyrirtæki | Sömu fjórum bönkum |
| **API-lykill** | Eitt gildi á fyrirtæki | Landsbankanum |
| **API-lykill notanda** | Eitt gildi á notanda | Landsbankanum |
| **Skírteini banka** | Eitt gildi á fyrirtæki | Íslandsbanka |

Íslandsbanki er undantekningin varðandi skírteini: hann auðkennir með notandanafni og lykilorði yfir TLS og undirritar ekkert, svo hann notar aldrei skírteini biðlara. Hann geymir hins vegar opinbert skírteini bankans sjálfs, sem er notað til að dulrita beiðnir til hans.

## Hvar gildin eru geymd

Gildin eru skrifuð í dulkóðaða geymslu viðbótarinnar sjálfrar. Þau eru aldrei skrifuð í töflu, aldrei send með fjarmælingum og aldrei skilað til síðu — uppsetningarsíðan segir aðeins hvort gildi sé til staðar, ekki hvert það er.

Geymslan tilheyrir þeirri viðbót sem skrifaði í hana. Það hefur eina hagnýta afleiðingu sem vert er að skipuleggja fyrir: **leyndarmál flytjast ekki**. Þegar Bifröst Ísland Fjárstýring er sett upp við hlið eldra Cloud Events- eða PTE-bankaforrits eru notandanafn bankans og aðrar stillingar afritaðar, en hvert lykilorð, skírteini og API-lykil þarf að skrá einu sinni á síðunni [Uppsetning Bifröst Ísland Fjárstýringar](./treasury-setup.md).

## Auðkenni fyrirtækis og einstaklinga

Flest fyrirtæki nota eitt sett af bankaauðkennum sem allir deila. Notandi sem hefur eigin innskráningu hjá banka getur í staðinn skráð persónulegt notandanafn í **notandastillingum Bifrastar** og persónulegt lykilorð með því.

Þetta tvennt er alltaf notað saman. Þegar notandi hefur eigið notandanafn hjá banka notar tengingin lykilorð þess notanda; annars notar hún notandanafn fyrirtækisins með lykilorði fyrirtækisins. Hún blandar þeim aldrei saman, svo lykilorð sem skráð er fyrir eitt auðkenni er aldrei sent undir öðru. Sé persónulegt notandanafn skráð en ekkert persónulegt lykilorð vistað segir tengingin frá því í stað þess að falla hljóðlega aftur á lykilorð fyrirtækisins.

## Að lesa stöðuna

Á síðunni [Uppsetning Bifröst Ísland Fjárstýringar](./treasury-setup.md) sýnir dálkurinn **Leyndarmál** stöðuna **Fullskráð** eða **Vantar** fyrir hvern banka. Vantar þýðir að minnst eitt leyndarmál sem tengingin þarf hefur ekkert gildi — athugaðu fyrst lykilorð fyrirtækisins, svo skírteinið hjá bönkunum fjórum sem nota það, og loks API-lykilinn hjá Landsbankanum.

Á meðan banki sýnir **Vantar** tilkynna skilaboð hans sig sem óaðgengileg og neita að keyra, í stað þess að hringja í bankann og mistakast þar.

## Leyndarmálaskrá Bifrastar

**Leyndarmál forrita Bifröst**, aðgengileg af uppsetningarsíðu fjárstýringarinnar, sýnir þau leyndarmál sem hvert uppsett Bifröst-forrit lýsir yfir að það þurfi, með lýsingu, hvort gildi hafi verið vistað og hvenær og af hverjum. Þangað skal líta þegar farið er yfir hvaða auðkenni leigjandi geymir.

Bifröst Ísland Fjárstýring geymir sín eigin gildi fremur en í þessari sameiginlegu skrá, því auðkennin þurfa að vera læsileg sem texti til að byggja undirritað SOAP-umslag fyrir bankana, og sameiginlega skráin skilar gildum vísvitandi ekki á því formi. Stöðudálkur hennar er því ekki heimildin fyrir þetta forrit — [Uppsetning Bifröst Ísland Fjárstýringar](./treasury-setup.md) er það.

## Að fjarlægja leyndarmál

**Hreinsa leyndarmál fyrirtækis** á uppsetningarsíðunni fjarlægir öll vistuð leyndarmál fyrirtækisins fyrir valinn banka eftir staðfestingu. Notandi getur hreinsað sín persónulegu leyndarmál í **notandastillingum Bifrastar**. Hreinsun gerir tenginguna ekki óvirka; til að stöðva banka alveg skaltu slökkva á **Virkt** í línu hans.
