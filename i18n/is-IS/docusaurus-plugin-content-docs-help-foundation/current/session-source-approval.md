---
id: session-source-approval
title: "Samþykkja uppruna setu"
---

**Samþykkja uppruna setu** biður þig um að samþykkja uppruna skilaboða - til dæmis
gervigreindaraðstoðarmann eða samþættingu - áður en hann má senda Bifröst-skilaboð sem notandinn þinn.
Þegar notandauppsetningin þín krefst samþykkis er skilaboðum frá uppruna sem þú hefur ekki samþykkt
hafnað; uppruninn biður þá um samþykki og fær tengil á þessa síðu sem þú opnar.

Beiðnin tilgreinir einnig **kallarann** - gervigreindarforritið sem setan kemur frá, til dæmis Claude
eða ChatGPT. Fyrirtækið heldur lista, **Bifrastarkallarar**, yfir þá kallara sem mega fá samþykkt
uppruna setu hér. Opnaðu listann með **Kallarar** á [Uppsetning Bifröst](/help/foundation/bifrost-setup/).
Listinn birtist ekki í Leit.

| Reitur | Lýsing |
| --- | --- |
| **Uppruni setu** | Uppruninn sem biður um samþykki. |
| **Kallari** | Gervigreindarforritið sem óskaði eftir þessum uppruna. Birtist þegar beiðnin inniheldur kallara. |
| **Lýsing** | Hvers vegna upprunanum er treyst. |
| **Ég samþykki þennan uppruna setu** | Staðfestir að þú treystir upprunanum. |
| **Leyfa þennan kallara** | Birtist þegar kallarinn er ekki leyfður í þessu fyrirtæki. Kveiktu á þessu til að leyfa kallarann hér og samþykktu síðan upprunann. Aðeins notandi sem má breyta Bifrastarkallurum getur stillt þetta. |

Ef kallarinn er ekki leyfður sýnir síðan þessa viðvörun: *Þetta er nýr kallari sem er ekki leyfður í þessu fyrirtæki. Notandi sem má breyta Bifrastarkallurum getur leyft hann hér; án þeirrar heimildar er ekki hægt að samþykkja þessa setu.*

Veldu **Samþykkja** til að leyfa upprunann, eða **Hætta við** til að loka síðunni án þess að
samþykkja hann. Þar til þú samþykkir hann er skilaboðum frá upprunanum hafnað. Ef kallarinn er ekki
leyfður er **Samþykkja** hafnað þar til kallarinn er leyfður — annaðhvort með **Leyfa þennan kallara**
ef þú hefur heimild, eða af stjórnanda á **Bifrastarkallarar**. Notandi án þeirrar heimildar sér
viðvörunina og getur ekki samþykkt setuna.

Ef slökkt er á **Leyft** fyrir kallara á **Bifrastarkallarar** fara allir uppruna setu sem samþykktir
voru undir þeim kallara í þessu fyrirtæki aftur í bið. Ef kveikt er aftur á **Leyft** eru þeir ekki
samþykktir sjálfkrafa; hver notandi þarf að samþykkja aftur.

Listinn stjórnar því hvaða forrit ná til Business Central í gegnum MCP. Hann er ekki öryggismörk
gagnvart biðlara sem kallar beint á Cloud Events; sá biðlari þarf áfram auðkennt Entra-auðkenni,
samþykkt Bifröst-forrit og samþykki uppruna setu fyrir hvern notanda.
