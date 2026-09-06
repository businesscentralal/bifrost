---
id: iceland-umsja-registry
title: "Einingar þjóðskrár"
sidebar_label: "Einingar þjóðskrár"
sidebar_position: 4
---

Síðan **Einingar þjóðskrár** (`Umsja Registry List ori`) sýnir staðbundið afrit af þjóðskrárgögnum sem sótt eru til Þjóðskrár Íslands gegnum Umsjár-þjónustuna. Hún er opnuð úr flokknum **Ísland** á [uppsetningarsíðu Bifrastar](/help/iceland/iceland-setup/).

## Hvað síðan sýnir

Ein lína á hvern einstakling eða lögaðila, auðkennd með kennitölu. Auk nafns og tegundar færslu ber hver lína skráð heimilisfang (sveitarfélag, götu, húsnúmer, póstnúmer), fjölskyldunúmer, fæðingardag og fæðingarstað, kyn, hjúskaparstöðu og maka, ríkisfang, síðasta þekkta heimilisfang, umboðsmann, brottfellingarmerki með dagsetningu og bannmerkingu þjóðskrár. Fyrri kennitala er geymd í reitnum **Old Social ID**.

## Hvernig gögnin berast

Síðan er skyndiminni, ekki innsláttarsíða — hverja línu skrifar skilaboðategund sem hefur spurt Umsjá. Uppfærðu hana með:

| Skilaboðategund | Tilgangur |
| --- | --- |
| `Iceland.NationalRegistry.Sync` | Heildarsamstilling þjóðskrárafritsins. |
| `Iceland.DeltaMonthly.Sync` | Mánaðarleg uppfærsla á breyttum færslum. |
| `Iceland.NationalRegistryCheck.Get` | Flettir upp einni kennitölu í þjóðskrá. |
| `Iceland.Search.Get`, `Iceland.SearchByName.Get`, `Iceland.SearchBySocialID.Get` | Leit í þjóðskrá eftir kennitölu eða nafni. |
| `Iceland.Address.Get`, `Iceland.AddressInfo.Get` | Uppflettingar heimilisfanga. |

**Eyða öllu** hreinsar skyndiminnið. Það eyðir aðeins staðbundna afritinu; ekkert er sent til Þjóðskrár. Næsta samstilling fyllir síðuna aftur.

## Heimildir og uppsetning

Lestur síðunnar og uppflettingar í þjóðskrá falla undir **BIFROST Umsja ori**, sem fylgir **BIFROST ISFull ori**; samstillingartegundirnar krefjast auk þess hins úthlutanlega **BIFROST NatReg ori**. Leyfisnúmer, notandanafn og lykilorð Umsjár þurfa að vera skráð fyrst — sjá [Uppsetning Íslands](/help/iceland/iceland-setup/).

Þjóðskrárgögn eru persónuupplýsingar. Haltu heimildasettunum þröngum og hreinsaðu skyndiminnið þegar fyrirtækið hefur ekki lengur heimild til að geyma gögnin.
