---
id: data-setup
sidebar_position: 4
slug: /data-setup
title: "Skref 4: Settu upp gögnin þín"
sidebar_label: "4. Settu upp gögnin þín"
description: "Veldu hvaða reiti fulltrúar eiga ekki að fá, farðu yfir uppsetningarsíðuna, og ákveddu hve lengi annálar eru geymdir."
---

# Skref 4: Settu upp gögnin þín

**Hvern þarf:** Kerfisstjóra Business Central, ásamt þeim sem á gögnin.

Hverri stillingu hér að neðan er breytt á mínútu. Hvað á að vega áður en þú velur er í
[Leiðbeiningum fyrir kerfisstjóra](/documentation/end-customers/administrators/).

## Takmarkaðu reiti sem fulltrúar eiga ekki að fá {#restrict-fields-agents-should-not-get}

Á **Uppsetningu Bifröst** velurðu **Uppsetning › Reitaaðgangur**. **Nýtt fyrir notanda...** bætir við línum fyrir notanda
eða Entra forrit: töfluna, reitinn, og **Bæði**, **Lesa** eða **Skrifa**. Takmarkanir taka gildi strax.
Nánar: [Reitaaðgangar Bifröst](/help/foundation/bifrost-field-accesses/). Áður en þú velur:
[Stjórnaðu því hvað fulltrúar lesa og breyta](/documentation/end-customers/data-access/#field-access).

![Yfirlit reitaaðgangs Bifröst](/img/guides/is-is/field-access-overview.png)

## Farðu yfir uppsetningarsíðuna {#go-through-the-setup-page}

Hverjum reit á **Uppsetningu Bifröst** er lýst í [Uppsetning Bifröst](/help/foundation/bifrost-setup/).
Ákveddu **Breytingaskrárvernd** af yfirvegun: **Lokað** (sjálfgefið) leyfir fulltrúum aðeins að breyta reitum sem
breytingaskráin nær til, svo kveiktu á breytingaskránni, á **Uppsetning › Uppsetning breytingaskrár**, fyrir reitina sem
þú vilt að fulltrúar breyti. Sjá [Breytingaskrárverndin](/documentation/end-customers/data-access/#the-changelog-write-guard).

![Hlutinn Almennt á Uppsetningu Bifröst](/img/guides/is-is/setup-general.png)

## Ákveddu hve lengi annálar eru geymdir {#set-how-long-logs-are-kept}

Á **Uppsetningu Bifröst** opnarðu **Uppsetning › Varðveislureglur** og setur tímabil fyrir annála Bifröst, og byrjar á
**Bifröst skilaboðum**. Áður en þú velur:
[Annálar og varðveisla](/documentation/end-customers/administrators/#logs-and-retention).

![Varðveislureglur](/img/guides/is-is/retention-policies.png)

**Næst:** [Skref 5: Prófaðu og bjóddu notendunum](/setup/first-call/)
