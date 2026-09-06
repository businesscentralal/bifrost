---
id: metering-interface
title: "Metering interface"
sidebar_position: 8
---

`Msg Metering ori` er samningurinn sem skilaboðategund útfærir til að stýra því hvað eitt
árangursríkt kall kostar. Það er annað viðmótið á `Message Type ori`: `Msg Interface ori` segir hvað
tegund **gerir**, `Msg Metering ori` segir hvað hún **kostar**.

Nafnrými `Origo.Bifrost`. Valenum `Message Type ori` (10077894).

```al
enum 10077894 "Message Type ori" implements "Msg Interface ori", "Msg Metering ori"
{
    Extensible = true;
    DefaultImplementation = "Msg Metering ori" = "Default Metering ori";
    // …
}
```

Mæling er **valfrjáls fyrir hvert gildi**. Hvert gildi sem nefnir ekki `Msg Metering ori` útfærslu —
þar með talin enum-viðbótargildi háðra forrita — leysist í `Default Metering ori`.

## Aðferðir

| Undirskrift | Skilar |
|---|---|
| `procedure GetChargeWeight(var Argument: Record "Message Argument ori"): Integer` | Leyfiseiningunum sem eitt árangursríkt kall nýtir. |
| `procedure IsExempt(var Argument: Record "Message Argument ori"): Boolean` | `true` þegar tegundin er aldrei gjaldfærð og aldrei stöðvuð. |
| `procedure GetMeterName(): Text[50]` | Valfrjálsa mælinum sem notkunin er tilkynnt undir. |

### `GetChargeWeight`

| | |
|---|---|
| Viðfang | `Argument` — `Message Argument ori` kallsins sem verið er að mæla. Ber skilaboðategund, efni og beiðnigögn. |
| Skilar | Einingunum sem gjaldfæra á fyrir eitt **árangursríkt** kall. |
| `0` | Kallið er ókeypis: það keyrir, er ekki talið og birtist ekki undir mæli. |
| Neikvætt | Meðhöndlað sem `0`. |
| Metið | **Áður en** verkið keyrir, svo beiðnigögnin eru tiltæk og vægi má ráðast af því hversu mikla vinnu kallandinn bað um. |

Vægið er aðeins beitt þegar kallið heppnast. Svar með `status` annað en `Success` er ekki gjaldfært,
hvert sem vægið er.

### `IsExempt`

| | |
|---|---|
| Viðfang | `Argument` — `Message Argument ori` kallsins sem verið er að mæla. |
| Skilar | `true` þegar tegundin er undanþegin leyfisgjaldi. |
| Áhrif | Undanþegið kall er aldrei talið **og** aldrei stöðvað af kvótaathugun. Það keyrir jafnvel þegar pottur kallandans er tómur. |

Undanþága gengur framar væginu.

### `GetMeterName`

| | |
|---|---|
| Viðföng | Engin — mælir nefnir fjölskyldu skilaboðategunda, ekki stakt kall. |
| Skilar | Mælisheiti, mest 50 stafir, eða tómum streng. |
| Autt | Notkun er aðeins tilkynnt í heildartölu pottsins. |
| Geymsla | Bifröst hástafar heitið áður en það er skrifað í `Meter` reitinn, þannig að `Playbook` og `PLAYBOOK` eru einn og sami mælirinn. |

Mælir kemur aldrei í stað heildartölu pottsins; hann er viðbótarsundurliðun við hliðina á henni.

## Hegðunartafla

| `IsExempt` | `GetChargeWeight` | Kvóti athugaður fyrir kall | Gjaldfært við árangur | Tilkynnt undir mæli |
|---|---|---|---|---|
| `true` | hvað sem er | Nei | Nei | Nei |
| `false` | `0` eða neikvætt | Já | Nei | Nei |
| `false` | `N` (1 eða meira) | Já, fyrir `N` einingar | `N` einingar | Já, þegar `GetMeterName` er ekki autt |

## Útfærslur í Foundation

| Eining | Notuð af | Hegðun |
|---|---|---|
| `Default Metering ori` (10078308) | Hverju gildi sem nefnir ekki útfærslu | Vægi `1`; `Help.*` og `Webhook.*` undanþegnar eftir nafnforskeyti; enginn mælir. |
| `Help MsgTypes Metering ori` (10078309) | `Help.MessageTypes.Get` | Vægi `0`, alltaf undanþegin, enginn mælir. |

`Help MsgTypes Metering ori` er dæmið sem unnið er út frá: efnisskrá vefþjónustunnar lýsir yfir
undanþágu sinni í gegnum viðmótið í stað þess að reiða sig á `Help.*` nafnforskeytið, þannig að
uppgötvun helst ókeypis jafnvel þótt tegundin verði einhvern tímann færð út úr `Help.*` hópnum.

## Hvað er skráð

Hver unnin skilaboð skrá niðurstöðu mælingarinnar á `Message ori` færsluna:

| Reitur | Tegund | Merking |
|---|---|---|
| `Charge Type` | Enum `Charge Type ori` | Potturinn sem skilaboðin voru gjaldfærð á, eða `None` þegar skilaboðin eru undanþegin eða þegar tilkynnt. |
| `Charge Weight` | Heiltala, sjálfgefið `1` | Einingarnar sem skilaboðin nýttu. |
| `Meter` | Code[50] | Mælirinn sem skilaboðin voru tilkynnt undir. Autt þýðir eingöngu heildartala pottsins. |

Báðir nýju reitirnir eru `Access = Internal`. Sjá [Licensing](/foundation/reference/licensing/) um
hvernig þeir rata í daglegu notkunarsamstillinguna.

## Uppgötvun

- `Help.MessageTypes.Get` skilar `exempt`, `chargeWeight` og `meter` fyrir hverja skilaboðategund,
  svo kallandi getur verðlagt kall áður en hann gerir það.
- `Help.License.Get` skilar valfrjálsum `pendingMeters` hlut með einingum á hvern mæli sem hafa
  verið gjaldfærðar staðbundið en ekki enn tilkynntar.

## Tengt efni

- [Licensing](/foundation/reference/licensing/) — pottarnir, framfylgdin og notkunarsamstillingin.
- [Mæling skilaboðategundar](/extensibility/metering) — hvernig háð forrit tekur mælingu upp.
- [Foundation public surface](/extensibility/public-surface) — allir opinberir viðbótarpunktar.
