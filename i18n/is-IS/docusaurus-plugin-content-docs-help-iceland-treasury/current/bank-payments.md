---
id: bank-payments
title: "Greiðslur í banka"
---

**Greiðslur í banka** sýnir stakar greiðslur sem Bifröst skráði í banka, hverja með stöðu sinni og því sem
hún greiðir. Síðan er fyrir bókarann sem flettir upp greiðslu út frá bókuðu fylgiskjali.

**Finna færslur** opnar hana: þegar þú velur **Finna færslur** á fylgiskjali leitar Business Central líka
að greiðslum í banka með sama fylgiskjalsnúmer og bókunardagsetningu og sýnir þær hér. Síðan er aðeins til lestrar og Bifröst
skrifar hana.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Banki** | Bankinn sem greiðslan var skráð í. |
| **Færslunúmer bunka**, **Línunúmer** | Bunkinn sem greiðslan tilheyrir á síðunni [Greiðslubunkar í banka](/help/iceland-treasury/bank-payment-batches/), og lína hennar í bunkanum. |
| **Reikningur viðtakanda**, **Nafn viðtakanda** | Hverjum greiðslan fer til. |
| **Upphæð**, **Gjaldmiðill** | Upphæðin sem var skráð. |
| **Staða** | **Óframkvæmd**, **Greidd**, **Villa**, **Eytt** eða **Fjarlægð í banka**. |
| **Tegund uppruna**, **Upprunanúmer**, **Upprunaskjal**, **Upprunafærsla**, **Sniðmát upprunabókar**, **Keyrsla upprunabókar**, **Línunúmer upprunabókar** | Hvað greiðslan greiðir, þegar skráningin tilgreindi það. |
| **Fylgiskjalsnúmer**, **Bókunardagsetning**, **Bókað**, **Bókað þann**, **Heiti færslubókarsniðmáts**, **Heiti færslubókarkeyrslu**, **Línunúmer færslubókar** | Fyrir bókun í Business Central. Bifröst bókar ekki, svo þessir reitir eru auðir. |
| **Tilvísun** | Tilvísun greiðslunnar. |
| **Greidd** | Hvenær greiðslan var staðfest greidd. |
| **Færslunúmer** | Númer greiðslunnar í rakningu Bifrastar. |

## Gott að vita {#good-to-know}

- Greiðsla er **Greidd** þegar yfirlit reikningsins sem greitt er af sýnir hana.
- Allur bunkinn, ásamt kostnaði, er á síðunni [Greiðslubunkar í banka](/help/iceland-treasury/bank-payment-batches/).
- Þegar forritið [Bifröst mállíkön](/language-models/) er sett upp svarar upplýsingareiturinn **Spjalla
  með Bifröst** til hægri spurningum um valda greiðslu.
