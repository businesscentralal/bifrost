---
id: secrets
title: "Secrets"
sidebar_position: 6
---

## Yfirlit

Bifröst grunnurinn á eina leyndarmálageymslu fyrir öll forrit sem byggja á honum. Forrit skráir þau
leyndarmál sem það þarf, kerfisstjóri slær gildin inn í einn sameiginlegan huldan glugga og forritið
les þau aftur með einu kalli.

Áður skilaði hvert forrit eigin `<X> Secret Mgt ori` einingu og eigin `<X> Set Secret Dialog ori`
síðu. Þess þarf ekki lengur.

**Nafnrými:** `Origo.Bifrost`

| Hlutur | Númer | Tilgangur |
|---|---|---|
| Eining `Secret Store ori` | 10078305 | Opinbera viðmótið — það eina sem forrit þarf |
| Tafla `App Secret ori` | 10078304 | Skráin: hvaða leyndarmál eru til, ekki gildi þeirra |
| Enum `Secret Scope ori` | 10078303 | `Company` / `Company And User` |
| Síða `Set Secret Dialog ori` | 10078306 | Sameiginlegi huldi innsláttarglugginn |
| Síða `App Secrets ori` | 10078307 | Listi kerfisstjórans yfir skráð leyndarmál |

---

## Hvar gildið liggur

Gildin eru skrifuð í **IsolatedStorage undir Bifröst grunninum**, aldrei í töflu, aldrei í fjarmælingar
og aldrei í villuboð. Geymslulykillinn er:

```
<App Id>/<Secret Code>
```

þar sem `<App Id>` er auðkenni forritsins sniðið án sviga (`Format(AppId, 0, 4)`).

Umfang IsolatedStorage fylgir skráðu umfangi:

| Umfang | Gagnaumfang | Merking |
|---|---|---|
| `Company` | `DataScope::Company` | Eitt gildi sameiginlegt öllum í fyrirtækinu |
| `Company And User` | `DataScope::CompanyAndUser` | Hver notandi skráir eigið gildi |

Þar sem geymslan notar `SecretText` frá enda til enda getur viðbót sem er þýdd fyrir `Cloud` sent
gildið í `HttpClient`-haus, í `IsolatedStorage` eða í dulkóðunarviðmót, en aldrei prentað það,
skráð það eða breytt því aftur í `Text`. Það er með ráðum gert.

---

## Viðmótið

Allar aðgerðir eru á `codeunit "Secret Store ori"`, `Access = Public`.

### Register

```al
procedure Register(AppId: Guid; SecretCode: Code[50]; Description: Text[100]; Scope: Enum "Secret Scope ori")
```

Býr til eða uppfærir skráningarfærsluna. **Sjálfsamkvæm** — kallaðu á hana úr uppsetningareiningunni,
uppfærslueiningunni og `OnOpenPage` uppsetningarsíðunnar; hún býr aldrei til tvítök.

Ef skráð leyndarmál er skráð aftur með **öðru umfangi fellur geymda gildið niður**, því annars væri
það óaðgengilegt í nýja gagnaumfanginu. Kerfisstjóri þarf að slá það inn einu sinni enn.

### Set

```al
procedure Set(AppId: Guid; SecretCode: Code[50]; Value: SecretText)
```

Geymir gildið og stimplar skráningarfærsluna (`Is Set`, `Set On`, `Set By`). Bregst ef leyndarmálið
er óskráð eða gildið autt.

### TryGet

```al
procedure TryGet(AppId: Guid; SecretCode: Code[50]; var Value: SecretText): Boolean
```

Skilar `true` og gildinu ef gildi er geymt fyrir núverandi umfang, annars `false`. Hún kastar aldrei
villu, svo forrit getur notað hana til að ákveða hvort sýna eigi ábendingu um að leyndarmál vanti.

### IsSet

```al
procedure IsSet(AppId: Guid; SecretCode: Code[50]): Boolean
```

Svarar hvort gildi sé til **án þess að lesa það**. Notaðu þetta á uppsetningarsíður og stöðureiti.

### MarkUsed

```al
procedure MarkUsed(AppId: Guid; SecretCode: Code[50])
```

Stimplar `Last Used On` á skráningarfærsluna, í mesta lagi einu sinni á dag. `TryGet` kallar **ekki**
á hana með ráðum, svo lestur leyndarmáls skrifar aldrei — annars myndi lesbeiðni í API bregðast.
Kallaðu á hana sjálf/ur úr samhengi sem má skrifa.

### Clear / ClearAll

```al
procedure Clear(AppId: Guid; SecretCode: Code[50])
procedure ClearAll(AppId: Guid)
```

Fjarlægja geymdu gildin. Skráningarnar lifa af, svo kerfisstjóri sér áfram hvaða leyndarmál forritið
væntir.

### SetFromDialog

```al
procedure SetFromDialog(AppId: Guid; SecretCode: Code[50]): Boolean
procedure SetFromDialog(AppId: Guid; SecretCode: Code[50]; RequireConfirmation: Boolean; MultiLine: Boolean): Boolean
```

Opnar sameiginlega hulda gluggann og geymir það sem notandinn slær inn. Skilar `true` þegar gildi var
geymt.

- `RequireConfirmation` sýnir annan huldan reit; báðir verða að stemma. Notaðu fyrir lykilorð.
- `MultiLine` sýnir fjöllínureit í stað hulda reitsins. Notaðu fyrir löng Base64-gildi, til dæmis
  skírteini, sem enginn slær inn í höndunum og ekki er hægt að yfirfara í huldum reit.

### GetStorageKey

```al
procedure GetStorageKey(AppId: Guid; SecretCode: Code[50]): Text
```

Skilar lykli IsolatedStorage. Gagnlegt í prófunum og þjónustu; afhjúpar aldrei gildið.

---

## Notkun í forriti

```al
namespace Origo.Bifrost.IcelandTreasury;

using Origo.Bifrost;

codeunit 10036020 "Treasury Secrets ori"
{
    var
        ClientSecretTok: Label 'CLIENT-SECRET', Locked = true;

    /// <summary>
    /// Skráir þau leyndarmál sem forritið þarf. Óhætt að kalla við hverja uppsetningu og uppfærslu.
    /// </summary>
    internal procedure RegisterSecrets()
    var
        SecretStore: Codeunit "Secret Store ori";
    begin
        SecretStore.Register(AppId(), ClientSecretTok, 'Client secret of the bank API registration', "Secret Scope ori"::Company);
    end;

    /// <summary>
    /// Skilar leyndarmáli biðlarans, eða bregst með skilaboðum sem vísa á uppsetningarsíðuna.
    /// </summary>
    [NonDebuggable]
    internal procedure GetClientSecret() Value: SecretText
    var
        SecretStore: Codeunit "Secret Store ori";
        SecretMissingErr: Label 'The client secret is not set. Enter it on the Bifröst App Secrets page.', Comment = 'is-IS=Leyndarmál biðlarans er ekki skráð. Skráðu það á síðunni Leyndarmál forrita Bifröst.';
    begin
        if not SecretStore.TryGet(AppId(), ClientSecretTok, Value) then
            Error(SecretMissingErr);
    end;

    local procedure AppId(): Guid
    var
        ModuleInfo: ModuleInfo;
    begin
        NavApp.GetCurrentModuleInfo(ModuleInfo);
        exit(ModuleInfo.Id());
    end;
}
```

Til að sýna öll leyndarmál forritsins í einum lista er `App Secrets ori` opnuð síuð:

```al
var
    AppSecrets: Page "App Secrets ori";
begin
    AppSecrets.SetAppFilter(AppId());
    AppSecrets.Run();
end;
```

---

## Sýn kerfisstjórans

**Uppsetning Bifröst → Uppsetning → Leyndarmál** opnar `App Secrets ori` fyrir öll uppsett forrit.
Listinn sýnir forritið, kóða leyndarmálsins, lýsingu þess, umfang, hvort gildi sé geymt (`Is Set`,
grænt þegar skráð, rautt þegar vantar), hvenær það var skráð og af hverjum. Hann sýnir aldrei gildið.

Aðgerðir: **Skrá...** opnar sameiginlega gluggann, **Hreinsa** fjarlægir gildið og heldur skráningunni.

---

## Heimildir

| Heimildasett | Aðgangur |
|---|---|
| `BIFROST Read ori` | lestur á `App Secret ori`, keyrsla á geymslunni og síðunum |
| `BIFROST Full ori` | RIMD á `App Secret ori`, keyrsla á geymslunni og síðunum |

Lestur gildis með `TryGet` þarf einungis lesheimild á skráningartöfluna; gildið kemur úr
IsolatedStorage, sem viðbótin stýrir, ekki tölfluheimildir.

---

## Fjarmælingar

| Atburðategund | Merki | Skráð |
|---|---|---|
| `Secret Set` | ORI-BIF-0160 | auðkenni forrits, kóði leyndarmáls |
| `Secret Cleared` | ORI-BIF-0161 | auðkenni forrits, kóði leyndarmáls |

Gildið er aldrei hluti af fjarmælingavídd.

---

## Ekki rugla saman við

`Secret Mgt ori` (eining 10077907) er **innri** eining grunnsins og þjónar leyfisbakendanum: App Key
Vault í skýinu, IsolatedStorage með einingaumfangi í eigin umhverfi. Hún tengist ekki
leyndarmálageymslu forrita sem lýst er hér og er ekki hluti af opinbera viðmótinu.

---

## Tengt efni

- **[Að víkka út uppsetningu Bifrastar](/extensibility/setup-and-secrets/)** — útvíkkunarpunkturinn Apps
- **[Uppsetning — tilvísun](/foundation/reference/setup/)** — uppsetningartafla Bifrastar
