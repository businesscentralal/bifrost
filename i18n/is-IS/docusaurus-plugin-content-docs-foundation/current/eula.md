---
id: eula
title: "Notkunarskilmálar"
sidebar_label: "EULA"
sidebar_position: 90
description: "Notkunarskilmálar fyrir Origo BC Bifröst og tengdan Origo BC Agentic Platform."
---

# Notkunarskilmálar — Origo BC Bifröst

Þessir notkunarskilmálar (hér eftir „Skilmálarnir“) stýra aðgengi að og notkun á Origo BC Bifröst og tengdum Origo BC Agentic Platform (samtakið, „Þjónustan“), sem veitt er af Origo ehf., fyrirtækisnúmer 450723-1690, Dalvegur 30a, 201 Kópavogur, Ísland („Origo“), til fyrirtækja viðskiptavina.

Með því að fá aðgang að eða nota Þjónustuna, virkja hana fyrir Business Central umhverfi, eða smella til að samþykkja, samþykkir viðskiptavinurinn (hér eftir „Viðskiptavinur“) þessum Skilmálum. Ef þeir sem samþykkja gera það fyrir hönd stofnunar, staðfæra þeir að þeir séu heimilaðir að binda stofnunina, og „Viðskiptavinur“ þýðir þá stofnunina.

Þjónustan er ætluð eingöngu til atvinnurekstrar og er ekki boðin upp á neytendum.

Í þessum Skilmálum er vísað til Origo og Viðskiptavins sem „Aðilum“, þar sem við á.

## 1. Skilgreiningar

„Business Central“ þýðir Microsoft Dynamics 365 Business Central umhverfið sem Viðskiptavinur notar, hvort sem það er rekið af Viðskiptavini, Origo eða þriðja aðila.

„Bifröst“ þýðir hreyfanlegan þjónustulag Origo sem opnar gagnagrunn og aðgerðir Business Central í gegnum eina API og Model Context Protocol (MCP) viðmót.

„Neytenduaðgerð“ (Consumer Application) þýðir hvaða forrit eða byrði (agent) (innifalið hvaða AI Agent, sem notar stórt málavél (large language model) eða aðra generative AI tækni), samþætting, skrifta eða kerfi sem Viðskiptavinur tengir eða veldur eða leyfir að tengist Þjónustunni til að sækja gögn frá eða framkvæma aðgerðir í gegnum Þjónustuna (t.d. LLM byrði, vefverslun, vefsíðu eða gagnagrunnstenging).

„Leyfður notandi“ (Authorised User) þýðir einstakling eða þjónustueiningu (service identity) sem Viðskiptavinur leyfir að fá aðgang að Þjónustunni undir skilgreiningum eða auðkenni Viðskiptavins.

„Gögn Viðskiptavins“ (Customer Data) þýðir gögn sem tilheyra eða eru veitt af Viðskiptavini og sem eru aðgengileg, send eða vinnulögð í gegnum Þjónustuna, innifalið gögn sem geymd eru í Business Central.

„Þjónustugögn“ (Service Data) þýðir rekstrar- og tæknigögn sem Origo vinnur til að veita, örugga og stjórna Þjónustunni, innifalið auðkenningu og leyfi/heimildagögn og hashað auðkenni sem leitt er úr Business Central leigu (tenant) Viðskiptavins.

„Bifröst viðskipti“ (Bifröst Transactions) þýðir eininguna sem notkunarmörk Viðskiptavins fyrir Þjónustuna er mæld og úthlögð í, og sem Viðskiptavinur kaupir samkvæmt viðeigandi Kaupskilmálum.

„Kaupskilmálar“ (Commercial Terms) þýðir sérstakan pöntunarskjala, verðlist eða viðskiptasamning sem Viðskiptavinur kaupir Bifröst viðskipti og tengda þjónustu frá Origo eða söluaðila Origo í samræmi við.

„Færleikar og hlutir“ (Skills and Artifacts) þýðir reglur, leiðbeiningar, stillingar, mælaborð og aðra hluti sem eru búin til af eða fyrir Viðskiptavini með notkun Þjónustunnar.

„Skjöl“ (Documentation) þýðir lýsingar á aðgerðum, skilgreiningar á breytum og notkunargagnrýni sem Origo gefur út fyrir Þjónustuna.

## 2. Þjónustan

Origo gerir Þjónustuna aðgengilega Viðskiptavini til að leyfa Leyfðum notendum og Neytenduaðgerðum að lesa Business Central gögn og framkvæma aðgerðir í Business Central í gegnum staðlað viðmót. Þjónustan virkar á neytenda-toga (consumer-pull) grunni: Neytenduaðgerðin biður um gögnin og aðgerðirnar sem hún þarf, á sínum eigin hraða og magni.

Þjónustan er tæknileg leið. Origo upprunar, stýrir eða staðfestir ekki innihald beiðna sem gerðar eru í gegnum Þjónustuna, leiðbeininga gefinna af Leyfðum notendum eða Neytenduaðgerðum, eða leiðandi breytingar sem gerðar eru innan Business Central. Slíkar beiðar og leiðbeiningar eru gerðar af, og undir ábyrgð, Viðskiptavins.

Þjónustan er veitt á „eins og hún er“ (as is) og „eins og hún er aðgengileg“ (as available) grunni. Þessir Skilmálar setja ekki sjálfir fram neina þjónustustöðu skuldbindingu, aðgengisábyrgð, stuðningsþörf, verð eða greiðsluskilmála; kaup á Bifröst viðskiptum og tengdir gjöld eru stýrð af sérstökum Kaupskilmálum.

## 3. Aðgangur, auðkenning og heimildir — Ábyrgð Viðskiptavins

Aðgangur að Þjónustunni er auðkenndur gegn auðkenningaraðila Viðskiptavins (Microsoft Entra ID). Þjónustan virkar undir auðkenni og heimildum Leyfðra notenda eða þjónustueiningar sem kallar hana. Þjónustan arftekur aðgengisréttindi sem auðkennið hefur þegar í Business Central og veitir engin réttindi yfir þau.

Viðskiptavinur er eingöngu ábyrgur fyrir hönnun, stillingu, veitingu, yfirferð og afturköllun aðgengisréttinda, hlutverkum og heimildum innan Business Central, Entra ID og hvaða Neytenduaðgerð sem er, og fyrir að beita reglunni um lágmarksheimild (principle of least privilege). Origo setur ekki, stækkar, staðfestir eða eftirlítur heimildastillingu Viðskiptavins.

Viðskiptavinur viðurkennir og samþykkir að:

- hver aðgerð sem Leyfður notandi, Neytenduaðgerð (innifalið hvaða AI Agent) sem virkar undir skilgreiningum Viðskiptavins getur framkvæmt í gegnum Þjónustuna er aðgerð sem heimildastilling Viðskiptavins leyfði;
- Origo er ekki ábyrgur eða skuldbundinn fyrir neina afleiðingu sem verður úr of breiðum, rangstilltum, ónægilega takmörkuðum eða óafturkölluðum aðgengisréttindum, innifalið gögnaleiðangur, gögnabreyting, eyðingu eða viðskipti sem verða úr slíkri stillingu; innifalið þar sem slík aðgengisréttindi eru notuð af óheimildum þriðja aðila sem hefur fengið skilgreiningar eða auðkenni Viðskiptavins, og
- Viðskiptavinur er ábyrgur fyrir öryggi skilgreininga, auðkenninga og Neytenduaðgerða sinna, og fyrir alla starfsemi sem framkvæmd er undir þeim.

Þar sem aðgerð getur haft veruleg eða óafturkræf áhrif, er Viðskiptavinur ábyrgur fyrir því að ákvarða hvort krafist skuli staðfestingar eða samþykktarþrepi áður en aðgerðin er framkvæmd, og fyrir að stilla slíkar stjórnunaraðgerðir.

## 4. Gervigreind og sjálfvirkar aðgerðir

Þjónustan getur verið notuð ásamt stórum málavélum (large language models) og öðrum AI kerfum. Viðskiptavinur skilur að úttak sem framleitt er af slíkum kerfum getur verið ónákvæmt, ófullnægjandi eða óhæft fyrir ákveðinn tilgang, og að AI kerfi geti virkað á leiðbeiningum á hátt sem Viðskiptavinur átti ekki fyrir.

Allar aðgerðir framkvæmdar í gegnum Þjónustuna, innifalið þær sem eru ræstar eða tilráðnar af AI kerfi, eru framkvæmdar á boðum og á áhættu Viðskiptavins. Viðskiptavinur er ábyrgur fyrir yfirferð, staðfestingu og eftirliti úttaks og aðgerða hvaða Neytenduaðgerðar eða AI kerfis sem hann notar með Þjónustunni. Origo ábyrgist ekki nákvæmni, réttmæti eða hentugleika hvaða AI framleidds úttaks eða sjálfvirkar aðgerðar.

Þar sem notkun Viðskiptavins á AI Agent eða öðru AI kerfi í tengslum við Þjónustuna telst vera sett á markað, sett í notkun, eða notkun „AI kerfis“ eins og skilgreint er í Reglugerð (ESB) 2024/1689 („AI Lög“), er Viðskiptavinur eingöngu ábyrgur fyrir réttri flokkun þess AI kerfis (innifalið áhættuflokk) og fyrir að uppfylla allar viðeigandi skyldur samkvæmt AI Lögum. Þjónustan sjálf, telst ekki vera AI kerfi fyrir tilgangi AI Laga.

## 5. Viðeigandi notkun

Viðskiptavinur skal nota Þjónustuna eingöngu fyrir löglegar innri atvinnuafgerðir sínar og í samræmi við þessa Skilmála og Skjöl. Viðskiptavinur skal ekki, og skal ekki leyfa neinum Leyfðum notendum eða Neytenduaðgerðum að:

- nota Þjónustuna í broti gegn gildandi lögum eða réttindum þriðja aðila;
- reyna að fá aðgang að gögnum eða aðgerðum yfir heimildirnar sem kallandi auðkennið hefur, eða umganga eða hafa áhrif á auðkenningu, leigu aðskilnað (tenant isolation), skráningu eða hvaða öryggisráðstafanir sem er;
- leggja óhófleg eða óhlutfallsleg álag á Þjónustuna, fara yfir eða reyna að umganga notkunarmörk, eða nota hana á hátt sem minnkar heildstæðni, öryggi eða afköst hennar fyrir Origo eða aðra viðskiptavini;
- afturvinna (reverse engineer), afkóða (decompile) eða reyna að leiða út uppskriftarkóða, uppbyggingu eða undirliggjandi líkön Þjónustunnar, nema þar sem þessi takmörkun er bönnuð af skyldu lögum;
- afrita, endursala, undirleiga eða gera Þjónustuna aðgengilega þriðja aðila nema þar sem það er sérstaklega leyft; eða
- koma inn illgerningskóða, eða nota Þjónustuna til að þróa samkeppnisþjónustu.

## 6. Ábyrgð Viðskiptavins

Viðskiptavinur er ábyrgur fyrir: (a) að eiga, greiða fyrir og viðhalda gildum Microsoft Dynamics 365 Business Central leyfum og öðrum þriðja aðila leyfum (innifalið Microsoft Azure og hvaða þriðja aðila AI eða málavél (language-model) veitanda sem er notaður með Þjónustunni) sem nauðsynleg eru fyrir notkun hans á Þjónustunni, og fyrir afleiðingar af hvarf, stöðvun eða takmörkun slíkra leyfa; (b) löglegri, nákvæmni og gæði Gagna Viðskiptavins og leiðbeininga gefinna í gegnum Þjónustuna; (c) stjórnun Leyfðra notenda, Neytenduaðgerða og stillinga þeirra; og (d) innihald og áhrif Færleika og hluta sem hann býr til eða setur í framkvæmd.

## 7. Þjónusta þriðja aðila og háðir þættir

Þjónustan byggir á og virkar saman við vörur og þjónustu þriðja aðila, innifalið Microsoft Dynamics 365 Business Central, Microsoft Azure og þriðja aðila AI eða málavél veitendur. Notkun þeirra vara er háð eigin skilmálum viðeigandi þriðja aðila, og Viðskiptavinur er ábyrgur fyrir að uppfylla þá. Origo er ekki ábyrgur eða skuldbundinn fyrir aðgengi, afköst, aðgerðir eða ógerningar hvaða vöru eða þjónustu þriðja aðila sem er, fyrir gjöld sem þriðji aðili tekur, eða fyrir breytingar sem þriðji aðili gerir á henni.

## 8. Gagnavernd

Hver aðili skal uppfylla gildandi lög um gagnavernd, innifalið íslenskan lög um persónuvernd nr. 90/2018 og Reglugerð (ESB) 2016/679 (GDPR). Þar sem Origo vinnur persónuupplýsingar fyrir hönd Viðskiptavins í gegnum Þjónustuna, virkar Origo sem vinnandi og Viðskiptavinur sem stjórnandi. Skilmálar Origo um vinnslu persónuupplýsinga og fylgandi lýsingar á gagnavinnslu, gefnar út eða veittar af Origo, stýra vinnslu Origo á gögnum fyrir hönd Viðskiptavins. Með því að samþykkja þessa Skilmála samþykkir Viðskiptavinur einnig Skilmála Origo um vinnslu persónuupplýsinga.

Origo notar ekki Gögn Viðskiptavins til að þjálfa eigin eða AI líkön þriðja aðila. Gögn Viðskiptavins eru send til þess að svara beiðum Viðskiptavins, ekki til líknaþjálfunar. Origo getur ráðist í undirvinnendur (innifalið ský og AI þjónustu veitendur) eins og fram kemur í vinnsluskilmálum sem vísað er til hér að ofan.

## 9. Þjónustugögn og notkunarmörk

Auk vinnslu Gagna Viðskiptavins eins og lýst er í grein 8, vinnur Origo takmörkuð Þjónustugögn til að veita, örugga og stjórna Þjónustunni. Í sérstökum tilfellum vinnur Origo: (a) leyfi og heimildagögn til að auðkenna og staðfesta aðgang og heimild Viðskiptavins að Þjónustunni; og (b) hashað auðkenni leitt úr Business Central leigu (tenant) Viðskiptavins, notað til að úthluta og fylgjast með notkunarmörkum Viðskiptavins. Origo virkar sem stjórnandi Þjónustugagna fyrir þessa tilgangi, og leigu auðkennið er geymt í hashuðu formi svo að undirliggjandi leiga sé ekki beint lesanleg úr því.

Notkun Þjónustunnar krefst notkunarmarka mældra í Bifröst viðskiptum, sem Viðskiptavinur kaupir samkvæmt sérstökum Kaupskilmálum. Bifröst viðskipti eru notuð af hverri beiðni sem Þjónustan tekur við undir auðkenni Leyfðs notanda eða Neytenduaðgerðar, óháð því hvort sú tiltekna beiðni var í raun heimiluð af Viðskiptavini. Origo er ekki ábyrgur eða skuldbundinn fyrir Bifröst viðskipti sem eru notuð vegna þess að skilgreiningar eða auðkenningar Viðskiptavins eru komnar í vana, notaðar án heimildar, eða annars misnotaðar af þriðja aðila, og engin endurgreiðsla eða skipti á slíkum viðskiptum skal vera skyld. Origo getur fylgst með og gert gild þau mörk og getur hægð á, raðað eða hafnað beiðnum sem fara yfir þau, eða þar sem mörkin eru uppgögn, til að vernda heildstæðni, öryggi og jafnræðisnotkun Þjónustunnar. Verð, magn, gildistími, útrunni og endurgreiðsla Bifröst viðskipta er stýrt af Kaupskilmálum og ekki af þessum Skilmálum.

## 10. Hugverndarréttindi

Milli Aðila eiga og halda Origo öll hugverndarréttindi í og til Þjónustunnar, innifalið Bifröst, Origo BC Agentic Platform, MCP lagið, Skjöl, og allan hugbúnað, líkön, uppbyggingu, þekkingu og bætingar tengdar þeim. Engin réttindi eru veitt Viðskiptavini nema takmörkuð leyfi sem fram kemur hér að neðan.

Origo veitir Viðskiptavini óeinkaleyfi, ófærslanlegt, óundirleigt og afturkallanlegt réttindi til að fá aðgang að og nota Þjónustuna fyrir innri atvinnuafgerðir sínar í þann tíma sem þessir Skilmálar eru í gildi og Viðskiptavinur uppfyllir þá, innifalið tímanlega greiðslu viðeigandi gjalda fyrir Þjónustuna. Öll réttindi sem ekki eru sérstaklega veitt eru varðveitt fyrir Origo.

Milli Aðila varðveitir Viðskiptavinur eiguðarrétt á Gögnum Viðskiptavins og á tilteknu innihaldi Færleika og hluta sem hann býr til. Viðskiptavinur veitir Origo óeinkaleyfi til að geyma, vinna og senda Gögn Viðskiptavins og slíkt innihald þar sem það er nauðsynlegt til að veita, örugga og bæta Þjónustuna. Ekkert í þessari grein flytur Viðskiptavini réttindi í undirliggjandi Þjónustu, rammanum eða vettvangnum sem notaður er til að búa til eða keyra Færleika og hluti.

Ef Viðskiptavinur veitir athugasemdir eða tillögur um Þjónustuna, getur Origo notað þær án takmarkana eða skyldu.

## 11. Leyndarskylda

Hver aðili skal halda leynd um óopinberar upplýsingar hins aðila sem eru birtar í tengslum við Þjónustuna, nota þær eingöngu fyrir tilgangi þessara Skilmála, og vernda þær með sanngjörnum umhirðu. Þessi skylda gildir ekki um upplýsingar sem eru eða verða opinberar án brots, eru löglega fengnar frá öðrum heimildum, eða sem krafist er að birta af lögum eða yfirvöldum.

## 12. Öryggi og skráning

Origo beitar tæknilegum og skipulaglegum öryggisráðstöfunum á Þjónustuna, innifalið auðkenningu, skráningu á les- og ritunaraðgerðum, og aðskilnað svo að gögn einnar viðskiptavins sé ekki birt öðrum. Viðskiptavinur viðurkennir að öryggi er sameiginlegt: Origo öruggar Þjónustuna, en Viðskiptavinur er ábyrgur fyrir öryggi auðkenninga, skilgreininga, heimildastillingar og Neytenduaðgerða sinna eins og fram kemur í þessum Skilmálum.

Þar sem Þjónustan er notuð í tengslum við bókhaldsfall í BC, er Viðskiptavinur eingöngu ábyrgur sem bókhaldsskyldur aðili samkvæmt gildandi bókhaldslögum, fyrir að tryggja að notkun hans á Þjónustunni og notkun hans á AI byrðum uppfylli kröfur um skýrleika, auðkenningu, öryggisafrit og geymslu í þeim lögum.

Skráning Origo samkvæmt þessari grein 12 varðar rekstur Þjónustunnar og telur ekki til eða staðar í stað bókhaldsskrá Viðskiptavins, öryggisafrita eða geymslu sem krafist er af gildandi bókhaldslögum, sem eru eingöngu ábyrgð Viðskiptavins innan BC og eigin kerfa hans. Origo er ekki ábyrgur fyrir að veita bókhalds eftirlitsyfirvöldum eða endurskoðendum aðgang að Þjónustunni.

## 13. Aðgengi, breytingar og uppfærslur

Origo getur breytt, bætt við, útgáfuð, takmarkað eða hætt að veita eiginleika Þjónustunnar, og getur framkvæmt viðhald, hvenær sem er. Þar sem Þjónustan endurspeglar hreyfandi aðgerðirnar sem eru aðgengilegar í Business Central, getur settið af aðgengilegum aðgerðum breyst þegar Business Central breytist. Origo mun beita sanngjörnum áhættu til að forðast verulega óhagkvæma truflun en ábyrgist ekki óafbrutandi aðgengi.

Origo getur uppfært þessa Skilmála af og til, og mun veita Viðskiptavini sanngjarnt fyrirvaran af hverri breytingu sem er veruleg og óhagkvæm fyrir Viðskiptavini. Uppfærðir Skilmálar taka gildi þegar þeir eru gefnir út eða annars tilkynntir, og framhald notkunar Þjónustunnar eftir það telst vera samþykkt. Ef Viðskiptavinur samþykkir ekki uppfærslu, er leið hans að hætta að nota Þjónustuna.

## 14. Ábyrgðir og fyrirvarar

Í hámarki leyfilegs mæls, er Þjónustan veitt „eins og hún er“ og „eins og hún er aðgengileg“, og Origo fravar sig allra ábyrgðar, skilyrða og yfirlýsinga af hvaða tagi sem er, hvort sem þær eru tölulegar eða ótölulegar, innifalið ótölulega ábyrgð fyrir sölufærni, hentugleika fyrir tiltekinn tilgang, nákvæmni, óbrotsréttindi, óafbrutandi eða villulausan rekstur, eða að Þjónustan muni uppfylla kröfur Viðskiptavins. Viðskiptavinur er ábyrgur fyrir að ákvarða hvort Þjónustan sé hentug fyrir áætlaða notkun hans.

## 15. Takmörkun ábyrgðar

Í hámarki leyfilegs mæls, skal Origo ekki vera ábyrgur fyrir óbeinu, tilfallandi, sérstökum eða afleiðandi tap, eða fyrir tap á vinnslu, tekjum, góðs nafni, gögnum, eða atvinnu, eða fyrir tap sem verður úr: heimildastillingu eða aðgangsstjórnun Viðskiptavins; leiðbeiningum eða aðgerðum hvaða Leyfðs notanda, Neytenduaðgerðar eða AI kerfis sem er; ónákvæmu eða óáætluðu AI úttaki eða sjálfvirkum aðgerðum; ógæslu Viðskiptavins til að skoða, staðfesta eða hafa eftirlit með notkun Þjónustunnar; eða aðgerðum, ógerningum eða vörum hvaða þriðja aðila sem er.

Undir forsendu framangreinds, og þar sem Origo er annars ábyrgur, skal heildar ábyrgð Origo sem verður úr eða í tengslum við Þjónustuna og þessa Skilmála ekki fara yfir hið meira af (a) ISK 200.000 og (b) heildarupphæð sem Viðskiptavinur greiddi fyrir Bifröst viðskipti samkvæmt viðeigandi Kaupskilmálum í tólf (12) mánuðum fyrir atburðinn sem veldur ábyrgðinni.

Takmörkun ábyrgðar Origo skal annars stýrð af Almennum skilmálum og skilyrðum Origo.

## 16. Skaðleysi

Viðskiptavinur skal verja, bæta og halda Origo óskadduðum gegn hvaða kröfu þriðja aðila sem er, og hvaða tap, skaða, kostnað eða úrgang sem verður úr notkun Viðskiptavins á Þjónustunni í broti gegn þessum Skilmálum eða gildandi lögum, heimildastillingu eða aðgangsstjórnun Viðskiptavins, leiðbeiningum eða aðgerðum framkvæmdum í gegnum Þjónustuna undir auðkenningum Viðskiptavins, eða Gögnum Viðskiptavins, Færleikum og hlutum.

## 17. Stöðvun og uppsögn

Origo getur stöðvað eða lokað aðgengi að Þjónustunni, í heild eða hluta, strax, ef Viðskiptavinur brýtur gegn þessum Skilmálum, innifalið þar sem Viðskiptavinur greiðir ekki gjald sem skyld er samkvæmt Kaupskilmálum og slíkt gjald er ógreitt í 10 daga eftir tilkynningu, ef öryggis- eða heildstæðniáhætta er til staðar, ef krafist er af lögum, eða ef Viðskiptavinur hættir að eiga undirliggjandi Business Central aðgang eða leyfi.

Þar sem Viðskiptavinur fellur undir skilyrði Reglugerðar (ESB) 2022/2554 (DORA), gilda sérstakir DORA skilmálar Origo, sem fjalla um ICT þriðja aðila áhættustjórnun, auk þessara Skilmála. Réttindi Viðskiptavins til að loka þessum Skilmálum eru einnig stýrð af, og háð, slíkum skilmálum.

Viðskiptavinur getur lokað notkun Þjónustunnar án fyrirvara. Slík uppsögn skal ekki gefa Viðskiptavini rétt á endurgreiðslu á viðskiptum sem Viðskiptavinur keypti áður.

Origo varðveitir réttinn til að hætta að veita Þjónustuna, í heild eða hluta, hvenær sem er og fyrir hvaða ástæðu sem er, eftir eigin ákvörðun. Þar sem Origo velur að hætta að veita Þjónustuna, skal Þjónustan falla niður sjálfkrafa við útrunni sex (6) mánaða fyrirvara í rita sem Origo veitir Viðskiptavini.

Við uppsögn enda réttindi Viðskiptavins til að nota Þjónustuna og Viðskiptavinur skal hætta öllum aðgengi. Greinar sem af eigin eðli sínu ættu að lifa af uppsögn (innifalið hugverndarréttindi, leyndarskyldu, fyrirvara, takmörkun ábyrgðar, skaðleysi og gildandi lög) lifa af.

## 18. Gildandi lög og úrlausn deilumála

Þessir Skilmálar, og hver deila eða kröfa sem verður úr eða í tengslum við þá eða efni þeirra, eru stýrð af og túlkuð í samræmi við lög Íslands, án tillits til lagaárekursreglna.

Hver deila, ósátt eða kröfa sem verður úr eða í tengslum við þessa Skilmála, innifalið hver spurning um tilvist, gildi eða uppsögn þeirra, skal endanlega leyst með málflutningi undir stjórn Nordic Arbitration Centre samkvæmt reglum þess sem eru í gildi við upphaf málflutningsins. Setur málflutningsins skal vera Reykjavík, Ísland; málflutningurinn skal framkvæmdur á ensku fyrir einum dóma; og málflutningsúrskurðurinn skal vera endanlegur og bindandi fyrir Aðila. Dómur á úrskurðinum má skrá í, og gert gildur af, hvaða dómstól með heimild sem er.

Óháð framangreindu, getur hver aðili beint til dómstóls með heimild um tímabundna eða gæslu ráðstafanir, sérstaklega til að vernda leyndarupplýsingar eða hugverndarréttindi sína.

## 19. Almennir ákvæðir

Þessir Skilmálar (samtakið með Almennum skilmálum og skilyrðum Origo, Gagnavinnsluskilmálum Origo, DORA Skilmálum (þar sem við á), Kaupskilmálum og hvaða sérstökum undirrituðum samningi sem er) mynda heildarsamninginn milli Aðila um Þjónustuna og yfirganga fyrri samkomulag um það efni.

Í tilviki árekurs milli þessara skjala: (a) sérstakir DORA áhættustjórnunarskilmálar ráða á málum ICT þriðja aðila áhættustjórnunar; (b) Gagnavinnsluskilmálar Origo ráða á málum persónuupplýsingavinnslu; (c) Kaupskilmálar ráða á málum verðs, gjalda og Bifröst viðskipta; og (d) þessir Skilmálar ráða yfir Almennum skilmálum og skilyrðum Origo; í hverju tilviki aðeins í mæli árekursins.

Ef ein ákvæði er talið ógild, verður afgangurinn í gildi og ákvæðið skal skipt út fyrir gild ákvæði sem endurspeglar upprunalega ásetning sem næst mögulegt.

Origo getur fært þessa Skilmála til samstarfsfyrirtækis eða í tengslum við endurskipulag eða yfirtöku atvinnu; Viðskiptavinur getur ekki fært án fyrirfram samþykkis Origo í rita.

Ógæsla til að gera gild ákvæði er ekki frávíkja frá því. Enginn aðili er ábyrgur fyrir ógæslu eða seinkun vegna atburða sem eru utan sanngjarinnar stjórnunar hans.

Tilkynningar skal gefa í rita til tengimáta sem Aðilarnir tilgreina.
