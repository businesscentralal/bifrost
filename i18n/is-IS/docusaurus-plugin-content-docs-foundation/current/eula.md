---
id: eula
slug: /eula
title: "Notkunarskilmálar"
sidebar_label: "Notkunarskilmálar"
sidebar_position: 90
description: "Notkunarskilmálar fyrir Origo BC Bifröst og tengdan Origo BC Agentic Platform."
---

# Notkunarskilmálar — Origo BC Bifröst

:::info Þýðing

Þetta er íslensk þýðing á enskum notkunarskilmálum Origo BC Bifröst. Komi upp ósamræmi milli íslensku og ensku útgáfunnar gildir enska útgáfan.

:::

Notkunarskilmálar þessir („Skilmálarnir“) gilda um aðgang að og notkun á Origo BC Bifröst og tengdum Origo BC Agentic Platform (saman nefnt „Þjónustan“), sem Origo ehf., kt. 450723-1690, Dalvegi 30a, 201 Kópavogi („Origo“), veitir viðskiptavinum í atvinnurekstri.

Með því að fá aðgang að eða nota Þjónustuna, virkja hana fyrir Business Central umhverfi eða smella á samþykkja, samþykkir viðskiptavinurinn („Viðskiptavinur“) Skilmálana. Ef sá sem samþykkir gerir það fyrir hönd lögaðila lýsir hann því yfir að hann hafi umboð til að skuldbinda lögaðilann, og merkir „Viðskiptavinur“ þá þann lögaðila.

Þjónustan er eingöngu ætluð til notkunar í atvinnurekstri og er ekki boðin neytendum.

Í Skilmálunum eru Origo og Viðskiptavinur nefndir „Aðilar“, eftir því sem við á.

## 1. Skilgreiningar

„Business Central“ merkir Microsoft Dynamics 365 Business Central umhverfi sem Viðskiptavinur notar, hvort sem það er rekið af Viðskiptavini, Origo eða þriðja aðila.

„Bifröst“ merkir kvikt þjónustulag Origo sem veitir aðgang að gögnum og aðgerðum Business Central í gegnum eitt forritaskil (API) og Model Context Protocol (MCP) viðmót.

„Tengiforrit“ (e. Consumer Application) merkir hvert það forrit eða fulltrúa (þ.m.t. gervigreindarfulltrúa (e. AI Agent) sem nýtir stór mállíkön eða aðra skapandi gervigreindartækni), samþættingu, skriftu eða kerfi sem Viðskiptavinur tengir, lætur tengja eða heimilar að tengt sé við Þjónustuna til að sækja gögn úr henni eða framkvæma aðgerðir í gegnum hana (til dæmis mállíkansfulltrúa, vefverslun, gátt eða tengingu við gagnavöruhús).

„Heimilaður notandi“ merkir einstakling eða þjónustuauðkenni sem Viðskiptavinur heimilar aðgang að Þjónustunni undir aðgangsupplýsingum eða auðkenni Viðskiptavinar.

„Gögn Viðskiptavinar“ merkir gögn sem tilheyra Viðskiptavini eða hann leggur til og sem aðgangur er veittur að, eru send eða unnin í gegnum Þjónustuna, þ.m.t. gögn sem geymd eru í Business Central.

„Þjónustugögn“ merkir rekstrar- og tæknigögn sem Origo vinnur til að veita, tryggja öryggi og annast umsýslu Þjónustunnar, þ.m.t. auðkenningar- og leyfis-/réttindagögn og tætt (e. hashed) auðkenni sem leitt er af Business Central leigjanda (e. tenant) Viðskiptavinar.

„Bifröst-færslur“ (e. Bifröst Transactions) merkir þá einingu sem notkunarheimild Viðskiptavinar að Þjónustunni er mæld og úthlutað í, og sem Viðskiptavinur kaupir samkvæmt gildandi Viðskiptaskilmálum.

„Viðskiptaskilmálar“ merkir sérstaka pöntun, verðskrá eða viðskiptasamning sem Viðskiptavinur kaupir Bifröst-færslur og tengda þjónustu samkvæmt, af Origo eða endursöluaðila Origo.

„Færni og afurðir“ (e. Skills and Artifacts) merkir reglur, fyrirmæli, stillingar, mælaborð og aðrar afurðir sem búnar eru til af Viðskiptavini eða fyrir hann með notkun Þjónustunnar.

„Skjölun“ merkir lýsingar á aðgerðum, skilgreiningar á færibreytum og notkunarleiðbeiningar sem Origo birtir fyrir Þjónustuna.

## 2. Þjónustan

Origo gerir Þjónustuna aðgengilega Viðskiptavini svo að Heimilaðir notendur og Tengiforrit geti lesið gögn úr Business Central og framkvæmt aðgerðir í Business Central í gegnum staðlað viðmót. Þjónustan byggir á sóknarlíkani (e. consumer-pull): Tengiforritið sækir þau gögn og aðgerðir sem það þarfnast, á þeim hraða og í því magni sem það kýs.

Þjónustan er tæknileg miðlunarleið. Origo á ekki frumkvæði að, stýrir ekki og sannreynir ekki efni þeirra beiðna sem sendar eru um Þjónustuna, fyrirmæli Heimilaðra notenda eða Tengiforrita, né þær breytingar sem af þeim leiða í Business Central. Slíkar beiðnir og fyrirmæli eru á vegum og á ábyrgð Viðskiptavinar.

Þjónustan er veitt í því ástandi sem hún er („as is“) og eftir því sem hún er tiltæk („as available“). Skilmálarnir fela ekki sjálfir í sér neinar skuldbindingar um þjónustustig, tryggingu fyrir uppitíma, skyldu til stuðnings, verð eða greiðsluskilmála; um kaup á Bifröst-færslum og tengd gjöld fer samkvæmt sérstökum Viðskiptaskilmálum.

## 3. Aðgangur, auðkenning og heimildir — ábyrgð Viðskiptavinar

Aðgangur að Þjónustunni er auðkenndur gagnvart auðkennisveitu Viðskiptavinar (Microsoft Entra ID). Þjónustan starfar undir auðkenni og heimildum þeirra Heimiluðu notenda eða þess þjónustuauðkennis sem kallar á hana. Þjónustan erfir þær aðgangsheimildir sem viðkomandi auðkenni hefur þegar í Business Central og veitir engar heimildir umfram þær.

Viðskiptavinur ber einn ábyrgð á hönnun, uppsetningu, veitingu, endurskoðun og afturköllun aðgangsheimilda, hlutverka og heimilda í Business Central, Entra ID og hverju Tengiforriti, og á því að beita meginreglunni um lágmarksheimildir. Origo hvorki setur, víkkar út, sannreynir né hefur eftirlit með heimildastillingum Viðskiptavinar.

Viðskiptavinur viðurkennir og samþykkir að:

- sérhver aðgerð sem Heimilaður notandi eða Tengiforrit (þ.m.t. gervigreindarfulltrúi) sem starfar undir aðgangsupplýsingum Viðskiptavinar getur framkvæmt í gegnum Þjónustuna er aðgerð sem heimildastillingar Viðskiptavinar sjálfs heimiluðu;
- Origo ber hvorki ábyrgð né skaðabótaskyldu á neinum afleiðingum aðgangsheimilda sem eru of víðtækar, rangt stilltar, ófullnægjandi takmarkaðar eða ekki afturkallaðar í tæka tíð, þ.m.t. hvers kyns birtingu gagna, breytingu gagna, eyðingu eða færslu sem leiðir af slíkum stillingum; þ.m.t. þegar óviðkomandi þriðji aðili, sem komist hefur yfir aðgangsupplýsingar eða auðkenni Viðskiptavinar, nýtir slíkar aðgangsheimildir; og
- Viðskiptavinur ber ábyrgð á að tryggja öryggi aðgangsupplýsinga sinna, auðkenna og Tengiforrita, og á allri virkni sem fram fer undir þeim.

Þar sem aðgerð getur haft veruleg eða óafturkræf áhrif ber Viðskiptavinur ábyrgð á að ákveða hvort krefjast skuli staðfestingar eða samþykktarferlis áður en aðgerðin er framkvæmd, og á uppsetningu slíkra stýringa.

## 4. Gervigreind og sjálfvirkar aðgerðir

Þjónustuna má nota með stórum mállíkönum og öðrum gervigreindarkerfum. Viðskiptavinur gerir sér grein fyrir að niðurstöður slíkra kerfa geta verið rangar, ófullnægjandi eða óhentugar í tilteknum tilgangi, og að gervigreindarkerfi geta brugðist við fyrirmælum á annan hátt en Viðskiptavinur ætlaði.

Allar aðgerðir sem framkvæmdar eru í gegnum Þjónustuna, þ.m.t. þær sem gervigreindarkerfi hefur frumkvæði að eða leggur til, eru framkvæmdar að fyrirmælum og á áhættu Viðskiptavinar. Viðskiptavinur ber ábyrgð á að yfirfara, sannreyna og hafa eftirlit með niðurstöðum og aðgerðum hvers Tengiforrits eða gervigreindarkerfis sem hann notar með Þjónustunni. Origo ábyrgist ekki nákvæmni, réttmæti eða hæfi niðurstaðna sem gervigreind býr til eða sjálfvirkra aðgerða.

Ef notkun Viðskiptavinar á gervigreindarfulltrúa eða öðru gervigreindarkerfi í tengslum við Þjónustuna felur í sér setningu á markað, töku í notkun eða notkun „gervigreindarkerfis“ í skilningi reglugerðar (ESB) 2024/1689 („gervigreindarreglugerðin“, e. AI Act), ber Viðskiptavinur einn ábyrgð á að flokka það gervigreindarkerfi rétt (þ.m.t. áhættuflokk þess) og á að uppfylla allar skyldur sem af gervigreindarreglugerðinni leiða. Þjónustan sjálf telst ekki gervigreindarkerfi í skilningi gervigreindarreglugerðarinnar.

## 5. Leyfileg notkun

Viðskiptavinur skal einungis nota Þjónustuna í lögmætum innri tilgangi í rekstri sínum og í samræmi við Skilmálana og Skjölunina. Viðskiptavinur skal ekki, og skal ekki heimila Heimiluðum notanda eða Tengiforriti að:

- nota Þjónustuna í bága við gildandi lög eða réttindi þriðja aðila;
- reyna að fá aðgang að gögnum eða aðgerðum umfram þær heimildir sem auðkennið sem kallar á Þjónustuna hefur, eða fara fram hjá eða hafa áhrif á auðkenningu, aðgreiningu leigjenda, skráningu eða öryggisráðstafanir;
- leggja óhóflegt eða ósanngjarnt álag á Þjónustuna, fara fram úr eða reyna að sniðganga notkunarheimildina, eða nota hana á þann hátt að það skerði heilleika, öryggi eða afköst hennar fyrir Origo eða aðra viðskiptavini;
- bakþýða, afþýða eða reyna að leiða út frumkóða, uppbyggingu eða undirliggjandi líkön Þjónustunnar, nema að því marki sem ófrávíkjanleg lög banna slíka takmörkun;
- afrita, endurselja, framselja undirleyfi að eða gera Þjónustuna aðgengilega þriðju aðilum nema það sé sérstaklega heimilað; eða
- koma fyrir spillikóða eða nota Þjónustuna til að þróa samkeppnisþjónustu.

## 6. Ábyrgð Viðskiptavinar

Viðskiptavinur ber ábyrgð á: (a) að hafa, greiða fyrir og viðhalda gildum leyfum fyrir Microsoft Dynamics 365 Business Central og öðrum leyfum þriðju aðila (þ.m.t. Microsoft Azure og hverrar þeirrar gervigreindar- eða mállíkansveitu þriðja aðila sem notuð er með Þjónustunni) sem nauðsynleg eru vegna notkunar hans á Þjónustunni, og á afleiðingum þess ef slík leyfi falla niður, eru felld tímabundið úr gildi eða takmörkuð; (b) lögmæti, nákvæmni og gæðum Gagna Viðskiptavinar og þeirra fyrirmæla sem gefin eru í gegnum Þjónustuna; (c) umsýslu Heimilaðra notenda sinna, Tengiforrita og stillinga þeirra; og (d) efni og áhrifum þeirrar Færni og afurða sem hann býr til eða tekur í notkun.

## 7. Þjónusta þriðju aðila og ytri tengsl

Þjónustan byggir á og vinnur með vörum og þjónustu þriðju aðila, þ.m.t. Microsoft Dynamics 365 Business Central, Microsoft Azure og gervigreindar- eða mállíkansveitum þriðju aðila. Um notkun þeirra vara fara skilmálar viðkomandi þriðja aðila og ber Viðskiptavinur ábyrgð á að fylgja þeim. Origo ber hvorki ábyrgð né skaðabótaskyldu á tiltækileika, afköstum, athöfnum eða athafnaleysi vöru eða þjónustu þriðja aðila, á gjöldum sem þriðji aðili innheimtir, né á breytingum sem þriðji aðili gerir á henni.

## 8. Persónuvernd

Hvor Aðili skal fara að gildandi persónuverndarlöggjöf, þ.m.t. lögum nr. 90/2018 um persónuvernd og vinnslu persónuupplýsinga og reglugerð (ESB) 2016/679 (almennu persónuverndarreglugerðinni, GDPR). Að því marki sem Origo vinnur persónuupplýsingar fyrir hönd Viðskiptavinar í gegnum Þjónustuna er Origo vinnsluaðili og Viðskiptavinur ábyrgðaraðili. Um vinnslu Origo á gögnum fyrir hönd Viðskiptavinar gilda skilmálar Origo um vinnslu persónuupplýsinga og meðfylgjandi vinnslulýsingar, sem Origo birtir eða afhendir. Með því að samþykkja Skilmálana samþykkir Viðskiptavinur jafnframt skilmála Origo um vinnslu persónuupplýsinga.

Origo notar ekki Gögn Viðskiptavinar til að þjálfa eigin gervigreindarlíkön eða líkön þriðju aðila. Gögn Viðskiptavinar eru send í þeim tilgangi að svara beiðnum Viðskiptavinar, ekki til þjálfunar líkana. Origo getur fengið undirvinnsluaðila til verka (þ.m.t. veitendur skýja- og gervigreindarþjónustu) eins og fram kemur í framangreindum vinnsluskilmálum.

## 9. Þjónustugögn og notkunarheimild

Auk vinnslu Gagna Viðskiptavinar eins og lýst er í 8. gr. vinnur Origo takmörkuð Þjónustugögn til að veita, tryggja öryggi og annast umsýslu Þjónustunnar. Nánar tiltekið vinnur Origo: (a) leyfis- og réttindagögn til að auðkenna og staðfesta aðgang og rétt Viðskiptavinar að Þjónustunni; og (b) tætt auðkenni sem leitt er af Business Central leigjanda Viðskiptavinar og notað er til að úthluta og fylgjast með notkunarheimild Viðskiptavinar. Origo er ábyrgðaraðili Þjónustugagna í þessum tilgangi, og auðkenni leigjandans er geymt tætt þannig að ekki er hægt að lesa undirliggjandi leigjanda beint úr því.

Notkun Þjónustunnar krefst notkunarheimildar sem mæld er í Bifröst-færslum, sem Viðskiptavinur kaupir samkvæmt sérstökum Viðskiptaskilmálum. Bifröst-færslur nýtast við hverja beiðni sem Þjónustunni berst undir auðkenni Heimilaðs notanda eða Tengiforrits, óháð því hvort Viðskiptavinur hafi í raun heimilað þá tilteknu beiðni. Origo ber hvorki ábyrgð né skaðabótaskyldu á Bifröst-færslum sem nýtast vegna þess að aðgangsupplýsingar eða auðkenni Viðskiptavinar hafa komist í hendur annarra, verið notuð í heimildarleysi eða misnotuð á annan hátt af þriðja aðila, og kemur ekki til endurgreiðslu eða endurnýjunar slíkra færslna. Origo getur fylgst með og framfylgt notkunarheimildinni og getur takmarkað hraða, sett í biðröð eða hafnað beiðnum sem fara fram úr henni, eða þegar heimildin er uppurin, til að vernda heilleika, öryggi og sanngjarna notkun Þjónustunnar. Um verð, magn, gildistíma, fyrningu og endurgreiðslu Bifröst-færslna fer samkvæmt Viðskiptaskilmálum en ekki Skilmálum þessum.

## 10. Hugverkaréttindi

Í samskiptum Aðila á Origo og heldur öllum hugverkaréttindum að Þjónustunni, þ.m.t. Bifröst, Origo BC Agentic Platform, MCP-laginu, Skjöluninni og öllum hugbúnaði, líkönum, uppbyggingu, verkþekkingu og endurbótum sem þeim tengjast. Viðskiptavini eru engin réttindi veitt önnur en þau takmörkuðu afnot sem lýst er hér að neðan.

Origo veitir Viðskiptavini almennan, óframseljanlegan og afturkallanlegan rétt, án heimildar til að veita undirleyfi, til aðgangs að og notkunar á Þjónustunni í innri tilgangi í rekstri sínum á meðan Skilmálarnir eru í gildi og Viðskiptavinur fer að þeim, þ.m.t. með því að greiða gjöld fyrir Þjónustuna á réttum tíma. Öll réttindi sem ekki eru sérstaklega veitt eru áskilin Origo.

Í samskiptum Aðila heldur Viðskiptavinur eignarrétti að Gögnum Viðskiptavinar og að tilteknu efni þeirrar Færni og afurða sem hann býr til. Viðskiptavinur veitir Origo almenna heimild til að hýsa, vinna og senda Gögn Viðskiptavinar og slíkt efni að því marki sem nauðsynlegt er til að veita, tryggja öryggi og bæta Þjónustuna. Ekkert í þessari grein færir Viðskiptavini réttindi að undirliggjandi Þjónustu, umgjörð eða kerfi sem notað er til að búa til eða keyra Færni og afurðir.

Ef Viðskiptavinur veitir endurgjöf eða tillögur um Þjónustuna er Origo heimilt að nýta þær án takmarkana eða skuldbindinga.

## 11. Trúnaður

Hvor Aðili skal gæta trúnaðar um upplýsingar hins Aðilans sem ekki eru opinberar og veittar eru í tengslum við Þjónustuna, nota þær einungis í tilgangi Skilmálanna og vernda þær af hæfilegri aðgát. Skyldan á ekki við um upplýsingar sem eru eða verða opinberar án brots, sem fengnar eru með lögmætum hætti frá öðrum, eða sem skylt er að veita samkvæmt lögum eða fyrirmælum stjórnvalda.

## 12. Öryggi og aðgerðaskráning

Origo beitir tæknilegum og skipulagslegum öryggisráðstöfunum við Þjónustuna, þ.m.t. auðkenningu, skráningu les- og skrifaðgerða og aðgreiningu þannig að gögn eins viðskiptavinar séu ekki aðgengileg öðrum. Viðskiptavinur viðurkennir að ábyrgð á öryggi er sameiginleg: Origo tryggir öryggi Þjónustunnar, en Viðskiptavinur ber ábyrgð á öryggi auðkenna sinna, aðgangsupplýsinga, heimildastillinga og Tengiforrita eins og fram kemur í Skilmálunum.

Þar sem Þjónustan er notuð í tengslum við bókhaldsvirkni í BC ber Viðskiptavinur, sem bókhaldsskyldur aðili samkvæmt gildandi bókhaldslöggjöf, einn ábyrgð á því að notkun hans á Þjónustunni og á gervigreindarfulltrúum uppfylli kröfur þeirrar löggjafar um rekjanleika, auðkenningu, afritun og varðveislu.

Skráning Origo samkvæmt þessari 12. gr. varðar rekstur Þjónustunnar og felur hvorki í sér né kemur í stað bókhaldsgagna, afrita eða varðveislu Viðskiptavinar sem gildandi bókhaldslöggjöf krefst, sem eru áfram á einni ábyrgð Viðskiptavinar í BC og eigin kerfum hans. Origo ber ekki ábyrgð á að veita eftirlitsaðilum með bókhaldi eða endurskoðendum aðgang að Þjónustunni.

## 13. Tiltækileiki, breytingar og uppfærslur

Origo getur hvenær sem er breytt, bætt við, gefið út nýjar útgáfur af, takmarkað eða hætt með eiginleika Þjónustunnar og sinnt viðhaldi. Þar sem Þjónustan endurspeglar með kvikum hætti þær aðgerðir sem tiltækar eru í Business Central getur framboð aðgerða breyst þegar Business Central breytist. Origo mun leitast við að forðast verulega truflun en ábyrgist ekki samfelldan tiltækileika.

Origo getur uppfært Skilmálana öðru hverju og mun tilkynna Viðskiptavini með hæfilegum fyrirvara um breytingar sem eru verulegar og honum í óhag. Uppfærðir Skilmálar taka gildi þegar þeir eru birtir eða tilkynntir með öðrum hætti, og áframhaldandi notkun Þjónustunnar eftir það telst samþykki á þeim. Samþykki Viðskiptavinur ekki uppfærslu er eina úrræði hans að hætta notkun Þjónustunnar.

## 14. Ábyrgðir og fyrirvarar

Að því marki sem lög frekast leyfa er Þjónustan veitt í því ástandi sem hún er („as is“) og eftir því sem hún er tiltæk („as available“), og Origo hafnar hvers kyns ábyrgðum, skilyrðum og yfirlýsingum, hvort sem þær eru berum orðum eða leiða af eðli máls, þ.m.t. hvers kyns óbeinni ábyrgð á söluhæfi, hæfi til tiltekinna nota, nákvæmni, að ekki sé brotið gegn réttindum annarra, samfelldum eða villulausum rekstri, eða að Þjónustan uppfylli kröfur Viðskiptavinar. Viðskiptavinur ber ábyrgð á að meta hvort Þjónustan henti fyrirhugaðri notkun hans.

## 15. Takmörkun ábyrgðar

Að því marki sem lög frekast leyfa ber Origo ekki ábyrgð á óbeinu tjóni, tilfallandi tjóni, sérstöku tjóni eða afleiddu tjóni, eða á missi hagnaðar, tekna, viðskiptavildar, gagna eða viðskipta, eða á tjóni sem rekja má til: heimildastillinga eða aðgangsstýringar Viðskiptavinar; fyrirmæla eða aðgerða Heimilaðs notanda, Tengiforrits eða gervigreindarkerfis; rangra eða óviljandi niðurstaðna gervigreindar eða sjálfvirkra aðgerða; vanrækslu Viðskiptavinar á að yfirfara, sannreyna eða hafa eftirlit með notkun Þjónustunnar; eða athafna, athafnaleysis eða vara þriðja aðila.

Með fyrirvara um framangreint, og að því marki sem Origo ber að öðru leyti ábyrgð, skal heildarábyrgð Origo sem leiðir af eða tengist Þjónustunni og Skilmálunum ekki nema hærri fjárhæð en þeirri sem hærri er af (a) 200.000 kr. og (b) heildarfjárhæð sem Viðskiptavinur hefur greitt fyrir Bifröst-færslur samkvæmt gildandi Viðskiptaskilmálum á þeim tólf (12) mánuðum sem voru á undan þeim atburði sem ábyrgðin byggir á.

Að öðru leyti fer um takmörkun ábyrgðar Origo samkvæmt almennum skilmálum Origo.

## 16. Skaðleysi

Viðskiptavinur skal verja Origo, bæta því og halda því skaðlausu vegna hvers kyns krafna þriðja aðila, og hvers kyns tjóns, skaða, kostnaðar eða útgjalda sem af þeim leiða, sem rekja má til notkunar Viðskiptavinar á Þjónustunni í bága við Skilmálana eða gildandi lög, heimildastillinga eða aðgangsstýringar Viðskiptavinar, fyrirmæla eða aðgerða sem framkvæmdar eru í gegnum Þjónustuna undir auðkennum Viðskiptavinar, eða Gagna Viðskiptavinar, Færni og afurða.

## 17. Tímabundin lokun og uppsögn

Origo getur lokað tímabundið fyrir eða sagt upp aðgangi að Þjónustunni, í heild eða að hluta, með tafarlausum áhrifum ef Viðskiptavinur brýtur gegn Skilmálunum, þ.m.t. ef Viðskiptavinur greiðir ekki gjald sem gjaldfallið er samkvæmt Viðskiptaskilmálum og gjaldið er enn ógreitt 10 dögum eftir tilkynningu, ef hætta steðjar að öryggi eða heilleika, ef lög krefjast þess, eða ef Viðskiptavinur hefur ekki lengur þann aðgang eða þau leyfi að Business Central sem Þjónustan byggir á.

Falli Viðskiptavinur undir gildissvið reglugerðar (ESB) 2022/2554 (DORA) gilda sérstakir DORA-skilmálar Origo, sem varða áhættustýringu vegna þriðju aðila sem veita upplýsinga- og fjarskiptatækniþjónustu, til viðbótar við Skilmálana. Um rétt Viðskiptavinar til að segja Skilmálunum upp fer jafnframt samkvæmt þeim skilmálum og með fyrirvara um þá.

Viðskiptavinur getur hætt notkun Þjónustunnar hvenær sem er án fyrirvara. Slík uppsögn veitir Viðskiptavini ekki rétt til endurgreiðslu á færslum sem hann hefur áður keypt.

Origo áskilur sér rétt til að hætta að veita Þjónustuna, í heild eða að hluta, hvenær sem er og af hvaða ástæðu sem er, að eigin mati. Ákveði Origo að hætta að veita Þjónustuna fellur hún sjálfkrafa niður að liðnum sex (6) mánuðum frá skriflegri tilkynningu Origo til Viðskiptavinar.

Við uppsögn fellur réttur Viðskiptavinar til að nota Þjónustuna niður og skal Viðskiptavinur hætta öllum aðgangi. Ákvæði sem eðli sínu samkvæmt eiga að gilda áfram eftir uppsögn (þ.m.t. um hugverkaréttindi, trúnað, fyrirvara, takmörkun ábyrgðar, skaðleysi og lagaval) halda gildi sínu.

## 18. Lagaval og úrlausn ágreinings

Um Skilmálana, og hvers kyns ágreining eða kröfu sem af þeim leiðir eða tengist þeim eða efni þeirra, fer samkvæmt íslenskum lögum, án tillits til lagaskilareglna.

Hvers kyns ágreiningur, deila eða krafa sem leiðir af eða tengist Skilmálunum, þ.m.t. um tilvist þeirra, gildi eða uppsögn, skal endanlega útkljáður í gerðardómi á vegum Norrænu gerðardómsmiðstöðvarinnar (e. Nordic Arbitration Centre) samkvæmt reglum hennar sem í gildi eru þegar gerðarmeðferð hefst. Gerðardómurinn skal hafa aðsetur í Reykjavík, gerðarmeðferð skal fara fram á ensku fyrir einum gerðarmanni, og gerðardómurinn skal vera endanlegur og bindandi fyrir Aðila. Leita má fullnustu gerðardómsins hjá hverjum þeim dómstóli sem til þess er bær.

Þrátt fyrir framangreint getur hvor Aðili leitað til bærs dómstóls um bráðabirgðaúrræði eða lögbann, einkum til að vernda trúnaðarupplýsingar sínar eða hugverkaréttindi.

## 19. Almenn ákvæði

Skilmálarnir (ásamt almennum skilmálum Origo, skilmálum Origo um vinnslu persónuupplýsinga, DORA-skilmálum (þar sem við á), Viðskiptaskilmálum og hvers kyns sérstökum undirrituðum samningi) fela í sér heildarsamning Aðila um Þjónustuna og koma í stað fyrri samkomulags um það efni.

Komi upp ósamræmi milli þessara skjala gildir eftirfarandi: (a) sérstakir DORA-skilmálar um áhættustýringu ganga framar um málefni sem varða áhættustýringu vegna þriðju aðila sem veita upplýsinga- og fjarskiptatækniþjónustu; (b) skilmálar Origo um vinnslu persónuupplýsinga ganga framar um málefni sem varða vinnslu persónuupplýsinga; (c) Viðskiptaskilmálar ganga framar um málefni sem varða verð, gjöld og Bifröst-færslur; og (d) Skilmálar þessir ganga framar almennum skilmálum Origo; í öllum tilvikum þó aðeins að því marki sem ósamræmið nær.

Teljist ákvæði óframfylgjanlegt heldur afgangurinn gildi sínu og skal ákvæðinu skipt út fyrir framfylgjanlegt ákvæði sem endurspeglar upphaflegan tilgang eins nákvæmlega og kostur er.

Origo getur framselt Skilmálana til tengds félags eða í tengslum við endurskipulagningu eða framsal rekstrar; Viðskiptavini er óheimilt að framselja þá án fyrirfram skriflegs samþykkis Origo.

Þótt ákvæði sé ekki framfylgt felur það ekki í sér afsal réttar samkvæmt því. Hvorugur Aðili ber ábyrgð á vanefnd eða töf sem stafar af atvikum sem honum eru ekki viðráðanleg.

Tilkynningar skulu vera skriflegar og sendar á þær samskiptaupplýsingar sem Aðilar tilgreina.
