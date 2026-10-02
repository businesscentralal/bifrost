---
id: extensibility
title: "Ný spjallveita í Bifrost Language Models"
sidebar_label: "Ný spjallveita"
sidebar_position: 3
description: "The public extension point of Bifröst Language Models: registering an additional language model provider."
---

Þetta skjal lýsir **opinbera viðbótarpunktinum** í Bifrost Language Models: hvernig bæta má við nýrri mállíkansveitu.

Allt sem ekki er talið upp hér er **innra** og getur breyst milli útgáfa án fyrirvara. Innri kóðaeiningar eru merktar `Access = Internal` í pakkanum og afgangurinn er læstur samkvæmt hefðbundinni útgáfustefnu útgefandans.

---

## Að byggja á Bifrost Language Models

Bættu bæði Bifrost Language Models og Bifrost Foundation, sem það byggir á, við `app.json` viðbótarinnar þinnar. Bifrost Language Models flytur ekki eigin forsendu áfram, svo Foundation þarf að vera talið upp sérstaklega:

```json
"dependencies": [
    {
        "id": "f1722684-0c24-4022-a2e0-0f63154aca76",
        "name": "Bifrost Language Models",
        "publisher": "Origo",
        "version": "28.0.0.0"
    },
    {
        "id": "7505e808-6e52-4b96-a328-82573391297a",
        "name": "Bifrost Foundation",
        "publisher": "Origo",
        "version": "28.0.0.0"
    }
]
```

Allir hlutir í þessum leiðbeiningum eru í nafnasvæðinu `Origo.Bifrost.LanguageModels`.

---

## Viðbótarflöturinn í hnotskurn

| Flokkur | Atriði | Stöðugleiki |
|---|---|---|
| Viðmót | `Bifrost LangModel Provider ori` | Stöðugur samningur — eina `Execute`-undirskriftin breytist aldrei |
| Útvíkkanlegar upptalningar | `Bifrost LangModel Prov. ori`, `Bifrost Chat Proc. Type ori` | Bættu við nýjum `value(...)`-færslum úr þinni viðbót |
| Opinberar töflur | `Bifrost Language Model ori`, `Bifrost Chat Argument ori` | Útvíkkaðu `Bifrost Language Model ori` með `tableextension`; færibreytufærslan er færibreyta viðmótsins |
| Opinberar kóðaeiningar | `Bifrost Chat Mgt ori`, `Bifrost Chat Transfer ori`, `MCP Tool Server ori` | Inngangspunktar fyrir spjallhýsla og útfærslur veitna |
| Stýriviðbætur | `Bifrost Chat ori` | Hýst í Bifrost Chat-upplýsingareitnum og á síðunni Chat Focus |

---

## Samningur veitunnar

Mállíkansveita er ein kóðaeining sem útfærir eitt viðmót:

```al
interface "Bifrost LangModel Provider ori"
{
    procedure Execute(var Argument: Record "Bifrost Chat Argument ori" temporary)
}
```

Undirskriftin breytist aldrei. **Aðgerðin** kemur í reitnum `Procedure Type` á færibreytufærslunni, og nýjar aðgerðir bætast við sem ný gildi í upptalningunni `Bifrost Chat Proc. Type ori`. Veita sem er skrifuð fyrir upptalninguna eins og hún er í dag þýðist áfram þegar aðgerðum er bætt við — hún svarar einfaldlega ekki þeim sem hún þekkir ekki.

Kallandinn finnur útfærsluna í gegnum upptalninguna `Bifrost LangModel Prov. ori`, sem er geymd í reitnum **Chat Provider** á hverri `Bifrost Language Model ori`-færslu. Sjálfgefna útfærslan er óvirka veitan, sem segir „ekki uppsett“ um allt.

### Skráning veitunnar

```al
namespace Acme.Ollama;

using Origo.Bifrost.LanguageModels;

enumextension 50100 "Acme LangModel Prov." extends "Bifrost LangModel Prov. ori"
{
    value(50100; Ollama)
    {
        Caption = 'Ollama';
        Implementation = "Bifrost LangModel Provider ori" = "Acme Ollama Provider";
    }
}
```

Það er öll skráningin. Gildið birtist í reitnum **Chat Provider** á Bifrost Language Model-spjaldinu, og hvert kall sem appið gerir fyrir mállíkan með þessa veitu lendir í kóðaeiningunni þinni.

---

## Aðgerðir sem þarf að svara

`Bifrost Chat Proc. Type ori` skiptist í aðgerðir sem byggja á stillingum (10–17), lýsigögn veitunnar (100–116) og sjálfgefin gildi veitunnar (120–126).

Fyrir hvert kall setur framhliðin `Result Boolean` á `false`, `Result Integer` á `0` og hreinsar niðurstöðutextann og villuboðin. Aðgerð sem `case`-setningin þín nær ekki yfir les því sem „ekki stutt“ — aldrei sem gamalt gildi úr fyrra kalli. Það gerir hlutaútfærslur öruggar.

### Aðgerðir sem byggja á stillingum

| Aðgerð | Kölluð af | Les | Skrifar | Þörf |
|---|---|---|---|---|
| `IsConfigured` (10) | Sýnileikahlið spjallsins; stakri útfyllingu áður en hún sendir nokkuð | Stillingareiti, `GetApiKey` | `Result Boolean` | Alltaf |
| `BuildConfigJson` (11) | Stýriviðbót spjallsins við ræsingu | Stillingareiti | `SetResultText` (JSON) | Fyrir spjallviðmótið |
| `SendChatMessage` (12) | `Bifrost Chat Mgt.SendChatMessage` | `GetPayload`, `GetSkill`, `GetUserPrompt`, `GetApiKey`, stillingar | `SetResultText` (JSON) | Fyrir spjallviðmótið |
| `ContinueWithToolResults` (13) | Spjallstýringunni, eftir að hún hefur keyrt verkfærakallanir | `GetConversationState`, `GetToolResults`, `GetApiKey` | `SetResultText` (JSON) | Aðeins þegar `SupportsSplitToolExecution` er true |
| `GetAvailableModels` (14) | **Get Models** á mállíkansspjaldinu | Stillingar, `GetApiKey` | `SetModels`, `Result Boolean` | Aðeins þegar `SupportsModelSelection` er true |
| `TestConnection` (15) | **Test Connection** á mállíkansspjaldinu | Stillingar, `GetApiKey` | `Result Boolean`, `SetErrorMessage` | Mælt með |
| `GetTokenUsage` (16) | Frátekið — appið kallar ekki á hana í dag | — | `Input Tokens`, `Output Tokens` | Valkvætt |
| `CompletePrompt` (17) | Stakri útfyllingu sem verkferlar og tímasett verk nota | `GetPayload`, stillingar, `GetApiKey` | `SetResultText` (JSON) | Fyrir stakar útfyllingar |

Veita sem svarar aðeins `IsConfigured`, `BuildConfigJson`, `SendChatMessage` og `CompletePrompt` er þegar nothæf: spjallið virkar, stakar útfyllingar virka og spjaldið bregst skynsamlega við því allt annað segir „ekki stutt“.

### Lýsigögn veitunnar

| Aðgerð | Kölluð af | Skrifar |
|---|---|---|
| `GetProviderName` (100) | Greiningu og stillingum spjallsins | `SetResultText` |
| `RequiresApiKey` (101) | Stillingum spjallsins og lyklaglugga spjaldsins | `Result Boolean` |
| `GetApiKeyLabel` (102), `GetApiKeyInstruction` (103), `GetApiKeyPlaceholder` (104), `GetApiKeyDocsUrl` (105), `GetApiKeyDocsLinkText` (106), `GetServiceKeyDescription` (107) | Stillingum spjallsins og lyklaglugga spjaldsins | `SetResultText` |
| `HasServiceKeyPermission` (108) | Stillingum spjallsins — hvort notandinn megi vista sameiginlegan lykil | `Result Boolean` |
| `GetMaxToolCount` (110) | Frátekið — appið kallar ekki á hana í dag | `Result Integer` |
| `SupportsSplitToolExecution` (111) | Stillingum spjallsins, sem `supportsToolLoop` | `Result Boolean` |
| `SupportsModelSelection` (112) | **Get Models** á spjaldinu | `Result Boolean` |
| `SupportsToolCalling` (113) | Frátekið — appið kallar ekki á hana í dag | `Result Boolean` |
| `HasExternalEndpoint` (114) | Sýnileika reita á spjaldinu og upphafsgildum | `Result Boolean` |
| `RequiresChatPath` (115), `RequiresModelsPath` (116) | Sýnileika reita á spjaldinu | `Result Boolean` |

`HasExternalEndpoint` er rofinn sem kveikir á endapunktshluta spjaldsins. Svaraðu `false` fyrir veitu sem talar við auðlindir sem Microsoft rekur — reitirnir Base URL, Model, Chat Path og Models Path eru þá faldir og ekki sannreyndir.

### Sjálfgefin gildi veitunnar

| Aðgerð | Kölluð af | Skrifar |
|---|---|---|
| `GetDefaultBaseUrl` (120), `GetDefaultModel` (121) | Sett í mállíkanið þegar veitan er valin, og notað til að ákveða hvort reiturinn sé skyldureitur | `SetResultText` |
| `GetDefaultTimeoutSeconds` (122), `GetDefaultMaxTokens` (123) | Sett í mállíkanið þegar veitan er valin | `Result Integer` |
| `GetContextWindowChars` (124) | Frátekið — appið kallar ekki á hana í dag | `Result Integer` |
| `GetDefaultSkillUrl` (125), `GetDefaultSkillText` (126) | **Load default skill** á spjaldinu | `SetResultText` |

---

## Færibreytufærslan

`Bifrost Chat Argument ori` er færsla með `TableType = Temporary`. Stutt gildi ferðast sem reitir; allt sem getur farið yfir lengd reits ferðast í gegnum aðgangsföll sem byggja á breytum kóðaeiningarinnar, svo ekkert stórt er nokkurn tíma skrifað í gagnagrunninn.

### Reitir sem kallandinn fyllir út

| Reitur | Tegund | Merking |
|---|---|---|
| `Language Model SystemId` | Guid | Aðallykill — `SystemId` mállíkansfærslunnar `Bifrost Language Model ori` sem varð fyrir valinu. |
| `Procedure Type` | Enum | Aðgerðin sem á að framkvæma. |
| `Base URL` | Text[250] | Rót endapunktsins úr mállíkaninu. |
| `Model` | Text[100] | Heiti líkansins úr mállíkaninu. |
| `Timeout Ms` | Integer | **Timeout Seconds** úr mállíkaninu, þegar umreiknað í millisekúndur. |
| `Max Tokens` | Integer | Hámarksfjöldi tóka úr mállíkaninu. |
| `Chat Path` | Text[250] | Slóð sem bætt er aftan við `Base URL` fyrir útfyllingar. |
| `Models Path` | Text[250] | Slóð sem bætt er aftan við `Base URL` til að finna líkön. |
| `Debug Mode` | Boolean | **Request Debug Mode** úr uppsetningu Bifrost — skrá allt innihald beiðna þegar kveikt er á því. |

### Reitir sem veitan skrifar

| Reitur | Tegund | Merking |
|---|---|---|
| `Result Boolean` | Boolean | Svar við öllum já/nei-aðgerðum. |
| `Result Integer` | Integer | Svar við öllum tölulegum aðgerðum. |
| `Input Tokens`, `Output Tokens` | Integer | Svar við `GetTokenUsage`. |

### Aðgangsföll fyrir texta

| Stefna | Aðgangsfall | Ber |
|---|---|---|
| Inn | `GetApiKey()` | Lykilinn sem varð fyrir valinu — persónulegan lykil kallandans, annars sameiginlegan þjónustulykil fyrirtækisins. Setjarinn er `[NonDebuggable]`; hafðu þína eigin lyklameðhöndlun líka `[NonDebuggable]`. |
| Inn | `GetSkill()` | Hæfnitexta úr mállíkaninu, fyrir `SendChatMessage`. |
| Inn | `GetUserPrompt()` | Eigin kerfisfyrirmæli kallandans úr Bifrost User Setup, fyrir `SendChatMessage`. |
| Inn | `GetPayload()` | Innihald beiðninnar fyrir `SendChatMessage` og `CompletePrompt`. |
| Inn | `GetConversationState()`, `GetToolResults()` | Stöðu skiptrar verkfærakeyrslu fyrir `ContinueWithToolResults`. |
| Út | `SetResultText()` | Öll texta- og JSON-svör. |
| Út | `SetErrorMessage()` | Læsileg villuboð fyrir `TestConnection`. |
| Út | `SetModels()` | `Name/Value Buffer` með auðkennum og birtingarheitum líkana fyrir `GetAvailableModels`. |

---

## Samningar um innihald

### `CompletePrompt`

Inntak, úr `GetPayload()`:

```json
{
  "systemPrompt": "Extract structured data from text. Return valid JSON.",
  "messages": [{ "role": "user", "content": "Invoice #4521, total 1250.00" }],
  "files": [{ "data": "JVBERi0...", "mimeType": "application/pdf", "fileName": "Invoice.pdf" }]
}
```

`systemPrompt` og `files` eru aðeins með þegar kallandinn sendi þau. Úttakið, í gegnum `SetResultText()`, er JSON-hlutur með annaðhvort `reply` (eða `text`) þegar vel gengur eða `error` þegar það mistekst. Veita sem getur ekki unnið með skjöl verður að skila `error` þegar `files` er með, frekar en að sleppa viðhenginu í hljóði.

### `SendChatMessage`

Inntakið ber `messages` (allt samtalið, hver færsla með `role` og `content`), og valkvætt `model`, `recordContext` (`tableId` og `recordSystemId` síðunnar sem upplýsingareiturinn er festur við) og `contextSkill`. Hæfnin og kerfisfyrirmæli notandans koma sér í gegnum `GetSkill()` og `GetUserPrompt()`.

Úttakið hefur eina af þremur gerðum:

```json
{ "type": "reply", "reply": "...", "toolTrace": [] }
{ "type": "tool_calls", "toolCalls": [{ "id": "...", "name": "get_records", "arguments": "{}" }], "conversationState": "..." }
{ "error": "..." }
```

`tool_calls` er aðeins gilt þegar `SupportsSplitToolExecution` skilar `true`; stýriviðbótin keyrir þá hvert verkfæri og kallar aftur í `ContinueWithToolResults` með stöðunni og niðurstöðunum. Veita sem leysir verkfærahringinn innan ferlisins skilar `type: reply` beint og setur köllin sem hún gerði í `toolTrace`.

### `BuildConfigJson`

JSON-hlutur sem stýriviðbót spjallsins les. `provider`, `authMode`, `requiresApiKey` og `labels`-hlutur með texta viðmótsins eru reitirnir sem stýringin notar; framhliðin bætir síðan `canManageServiceKey`, `apiKeyLabel`, `apiKeyInstruction`, `apiKeyPlaceholder`, `apiKeyDocsUrl`, `apiKeyDocsLinkText`, `serviceKeyDescription` og `supportsToolLoop` ofan á úr lýsigagnaaðgerðunum.

---

## MCP-verkfæraþjónninn

`MCP Tool Server ori` er `Access = Public` og `SingleInstance`. Veita notar hann til að gefa líkaninu aðgang að Business Central:

| Meðlimur | Tilgangur |
|---|---|
| `Bootstrap(RecordContext: Text): Text` | Smíðar kerfisfyrirmæli lotunnar — auðkenni, fyrirtæki, minni og reglur um notkun verkfæra. Kallað einu sinni í hverri umferð spjallsins. Sendu `recordContext`-hlutinn úr innihaldinu, eða tóman streng. |
| `ListTools(var Tools: JsonArray)` | Verkfæraskráin á MCP-formi: `name`, `description`, `inputSchema`. Umbreyttu yfir á mállýsku veitunnar þinnar. |
| `CallTool(ToolName: Text; Arguments: JsonObject; var ResultText: Text; var IsError: Boolean): Boolean` | Keyrir eitt verkfæri í eigin `Codeunit.Run`-umfangi. Skilar `false` fyrir óþekkt verkfæri; `IsError` segir frá verkfæri sem keyrði og mistókst. |
| `GetToolCount(): Integer` | Fjöldi skráðra verkfæra. |
| `ClearSession()` | Fleygir vistuðum kerfisfyrirmælum og gagnageymslu lotunnar. Kallaðu á það þegar samtal er endurræst. |
| `BuildDynamicToolDefs(...)`, `SanitizeToolName(...)` | Smíða verkfæraskilgreiningar fyrir hverja skilaboðategund og breyta heiti skilaboðategundar í gilt heiti verkfæris. |

Verkfærakallanir eru skráðar í beiðnaskrá Bifrost. Skráðu þitt eigið `Request Log Type ori`-gildi með `Request Log Masker ori`-útfærslu ef veitan þín skráir beiðnir sem bera leyndarmál.

---

## Fullbúið dæmi

Veita fyrir Ollama-endapunkt sem keyrir hjá þér og talar mállýsku OpenAI chat-completions, leysir verkfærahringinn innan ferlisins á móti MCP-verkfæraþjóni Bifrost og þarf engan API-lykil.

**AcmeLangModelProv.EnumExt.al**

```al
namespace Acme.Ollama;

using Origo.Bifrost.LanguageModels;

/// <summary>
/// Registers the Ollama provider on the Bifrost language model provider enum.
/// </summary>
enumextension 50100 "Acme LangModel Prov." extends "Bifrost LangModel Prov. ori"
{
    value(50100; Ollama)
    {
        Caption = 'Ollama';
        Implementation = "Bifrost LangModel Provider ori" = "Acme Ollama Provider";
    }
}
```

**AcmeOllamaProvider.Codeunit.al**

```al
namespace Acme.Ollama;

using Origo.Bifrost.LanguageModels;

/// <summary>
/// Bifrost language model provider for a self-hosted Ollama endpoint that speaks the
/// OpenAI chat-completions dialect. Tool calls are resolved in-process against the
/// Bifrost MCP tool server, so the provider always returns a finished reply.
/// </summary>
codeunit 50100 "Acme Ollama Provider" implements "Bifrost LangModel Provider ori"
{
    var
        ToolServer: Codeunit "MCP Tool Server ori";
        NoBaseUrlErr: Label 'The Ollama base URL is not set on the language model.';
        InvalidPayloadErr: Label 'The chat payload was not valid JSON.';
        RequestFailedErr: Label 'The Ollama endpoint could not be reached.';
        NoReplyErr: Label 'The Ollama endpoint returned no message content.';
        FilesNotSupportedErr: Label 'This provider does not accept file attachments.';
        SplitToolLoopErr: Label 'This provider resolves tool calls in a single round trip.';
        ToolLimitErr: Label 'The model did not finish within the allowed number of tool rounds.';
        UnknownToolErr: Label 'Unknown tool: %1', Comment = '%1 = tool name';
        ThinkingLbl: Label 'Thinking...';
        InputPlaceholderLbl: Label 'Ask about your Business Central data...';
        SendBtnLbl: Label 'Send';
        ProviderNameTok: Label 'Ollama', Locked = true;
        DefaultBaseUrlTok: Label 'http://localhost:11434', Locked = true;
        DefaultModelTok: Label 'llama3.1', Locked = true;
        DefaultChatPathTok: Label '/v1/chat/completions', Locked = true;
        ModelsPathTok: Label '/api/tags', Locked = true;

    procedure Execute(var Argument: Record "Bifrost Chat Argument ori" temporary)
    var
        ProcType: Enum "Bifrost Chat Proc. Type ori";
    begin
        ProcType := Argument."Procedure Type";
        case ProcType of
            ProcType::IsConfigured:
                Argument."Result Boolean" := Argument."Base URL" <> '';
            ProcType::BuildConfigJson:
                Argument.SetResultText(BuildConfigJson());
            ProcType::SendChatMessage:
                Argument.SetResultText(RunChat(Argument, true));
            ProcType::CompletePrompt:
                Argument.SetResultText(RunChat(Argument, false));
            ProcType::ContinueWithToolResults:
                Argument.SetResultText(BuildErrorJson(SplitToolLoopErr));
            ProcType::TestConnection:
                RunTestConnection(Argument);
            ProcType::HasExternalEndpoint,
            ProcType::RequiresChatPath,
            ProcType::SupportsToolCalling:
                Argument."Result Boolean" := true;
            ProcType::GetAvailableModels,
            ProcType::RequiresApiKey,
            ProcType::RequiresModelsPath,
            ProcType::HasServiceKeyPermission,
            ProcType::SupportsModelSelection,
            ProcType::SupportsSplitToolExecution:
                Argument."Result Boolean" := false;
            ProcType::GetTokenUsage:
                begin
                    Argument."Input Tokens" := 0;
                    Argument."Output Tokens" := 0;
                end;
            ProcType::GetProviderName:
                Argument.SetResultText(ProviderNameTok);
            ProcType::GetDefaultBaseUrl:
                Argument.SetResultText(DefaultBaseUrlTok);
            ProcType::GetDefaultModel:
                Argument.SetResultText(DefaultModelTok);
            ProcType::GetDefaultTimeoutSeconds:
                Argument."Result Integer" := 120;
            ProcType::GetDefaultMaxTokens:
                Argument."Result Integer" := 4096;
            ProcType::GetContextWindowChars:
                Argument."Result Integer" := 32000;
            ProcType::GetMaxToolCount:
                Argument."Result Integer" := 20;
            ProcType::GetApiKeyLabel,
            ProcType::GetApiKeyInstruction,
            ProcType::GetApiKeyPlaceholder,
            ProcType::GetApiKeyDocsUrl,
            ProcType::GetApiKeyDocsLinkText,
            ProcType::GetServiceKeyDescription,
            ProcType::GetDefaultSkillUrl,
            ProcType::GetDefaultSkillText:
                Argument.SetResultText('');
        end;
    end;

    local procedure RunChat(var Argument: Record "Bifrost Chat Argument ori" temporary; WithTools: Boolean): Text
    var
        PayloadObject: JsonObject;
        ChoiceMessage: JsonObject;
        MessagesArray: JsonArray;
        ToolCalls: JsonArray;
        Iteration: Integer;
        ReplyText: Text;
    begin
        if Argument."Base URL" = '' then
            exit(BuildErrorJson(NoBaseUrlErr));
        if not PayloadObject.ReadFrom(Argument.GetPayload()) then
            exit(BuildErrorJson(InvalidPayloadErr));
        if HasFiles(PayloadObject) then
            exit(BuildErrorJson(FilesNotSupportedErr));

        MessagesArray := BuildMessages(Argument, PayloadObject, WithTools);

        for Iteration := 1 to 10 do begin
            Clear(ChoiceMessage);
            if not PostCompletion(Argument, MessagesArray, WithTools, ChoiceMessage) then
                exit(BuildErrorJson(RequestFailedErr));

            Clear(ToolCalls);
            if not HasToolCalls(ChoiceMessage, ToolCalls) then begin
                ReplyText := GetTextValue(ChoiceMessage, 'content');
                if ReplyText = '' then
                    exit(BuildErrorJson(NoReplyErr));
                exit(BuildReplyJson(ReplyText));
            end;

            MessagesArray.Add(ChoiceMessage);
            AppendToolResults(ToolCalls, MessagesArray);
        end;

        exit(BuildErrorJson(ToolLimitErr));
    end;

    local procedure PostCompletion(var Argument: Record "Bifrost Chat Argument ori" temporary; MessagesArray: JsonArray; WithTools: Boolean; var ChoiceMessage: JsonObject): Boolean
    var
        Client: HttpClient;
        RequestContent: HttpContent;
        ContentHeaders: HttpHeaders;
        ResponseMessage: HttpResponseMessage;
        RequestObject: JsonObject;
        ResponseObject: JsonObject;
        Tools: JsonArray;
        ChoicesToken: JsonToken;
        ChoiceToken: JsonToken;
        MessageToken: JsonToken;
        RequestText: Text;
        ResponseText: Text;
    begin
        RequestObject.Add('model', GetModel(Argument));
        RequestObject.Add('stream', false);
        RequestObject.Add('messages', MessagesArray);
        if Argument."Max Tokens" > 0 then
            RequestObject.Add('max_tokens', Argument."Max Tokens");
        if WithTools then begin
            Tools := BuildToolDefinitions();
            if Tools.Count() > 0 then
                RequestObject.Add('tools', Tools);
        end;
        RequestObject.WriteTo(RequestText);

        RequestContent.WriteFrom(RequestText);
        RequestContent.GetHeaders(ContentHeaders);
        ContentHeaders.Clear();
        ContentHeaders.Add('Content-Type', 'application/json');

        if Argument."Timeout Ms" > 0 then
            Client.Timeout := Argument."Timeout Ms";

        if not Client.Post(GetEndpoint(Argument), RequestContent, ResponseMessage) then
            exit(false);
        ResponseMessage.Content().ReadAs(ResponseText);
        if not ResponseMessage.IsSuccessStatusCode then
            exit(false);
        if not ResponseObject.ReadFrom(ResponseText) then
            exit(false);
        if not ResponseObject.Get('choices', ChoicesToken) then
            exit(false);
        if not ChoicesToken.IsArray() then
            exit(false);
        if not ChoicesToken.AsArray().Get(0, ChoiceToken) then
            exit(false);
        if not ChoiceToken.AsObject().Get('message', MessageToken) then
            exit(false);
        ChoiceMessage := MessageToken.AsObject();
        exit(true);
    end;

    local procedure BuildMessages(var Argument: Record "Bifrost Chat Argument ori" temporary; PayloadObject: JsonObject; WithTools: Boolean) MessagesArray: JsonArray
    var
        SystemMessage: JsonObject;
        MessagesToken: JsonToken;
        MessageToken: JsonToken;
    begin
        SystemMessage.Add('role', 'system');
        SystemMessage.Add('content', BuildSystemPrompt(Argument, PayloadObject, WithTools));
        MessagesArray.Add(SystemMessage);

        if PayloadObject.Get('messages', MessagesToken) then
            if MessagesToken.IsArray() then
                foreach MessageToken in MessagesToken.AsArray() do
                    MessagesArray.Add(MessageToken);
    end;

    local procedure BuildSystemPrompt(var Argument: Record "Bifrost Chat Argument ori" temporary; PayloadObject: JsonObject; WithTools: Boolean): Text
    var
        PromptBuilder: TextBuilder;
        RecordContextToken: JsonToken;
        RecordContext: Text;
    begin
        if not WithTools then
            exit(GetTextValue(PayloadObject, 'systemPrompt'));

        if PayloadObject.Get('recordContext', RecordContextToken) then
            RecordContextToken.WriteTo(RecordContext);

        PromptBuilder.Append(ToolServer.Bootstrap(RecordContext));
        if Argument.GetSkill() <> '' then begin
            PromptBuilder.AppendLine();
            PromptBuilder.AppendLine(Argument.GetSkill());
        end;
        if Argument.GetUserPrompt() <> '' then begin
            PromptBuilder.AppendLine();
            PromptBuilder.AppendLine(Argument.GetUserPrompt());
        end;
        exit(PromptBuilder.ToText());
    end;

    local procedure BuildToolDefinitions() Tools: JsonArray
    var
        ServerTools: JsonArray;
        ToolToken: JsonToken;
        SchemaToken: JsonToken;
        ToolObject: JsonObject;
        FunctionObject: JsonObject;
        WrapperObject: JsonObject;
        EmptySchema: JsonObject;
    begin
        ToolServer.ListTools(ServerTools);
        foreach ToolToken in ServerTools do begin
            ToolObject := ToolToken.AsObject();
            Clear(FunctionObject);
            Clear(WrapperObject);
            FunctionObject.Add('name', GetTextValue(ToolObject, 'name'));
            FunctionObject.Add('description', GetTextValue(ToolObject, 'description'));
            if ToolObject.Get('inputSchema', SchemaToken) then
                FunctionObject.Add('parameters', SchemaToken.AsObject())
            else begin
                Clear(EmptySchema);
                EmptySchema.Add('type', 'object');
                FunctionObject.Add('parameters', EmptySchema);
            end;
            WrapperObject.Add('type', 'function');
            WrapperObject.Add('function', FunctionObject);
            Tools.Add(WrapperObject);
        end;
    end;

    local procedure HasToolCalls(ChoiceMessage: JsonObject; var ToolCalls: JsonArray): Boolean
    var
        ToolCallsToken: JsonToken;
    begin
        if not ChoiceMessage.Get('tool_calls', ToolCallsToken) then
            exit(false);
        if not ToolCallsToken.IsArray() then
            exit(false);
        ToolCalls := ToolCallsToken.AsArray();
        exit(ToolCalls.Count() > 0);
    end;

    local procedure AppendToolResults(ToolCalls: JsonArray; var MessagesArray: JsonArray)
    var
        ToolCallToken: JsonToken;
        FunctionToken: JsonToken;
        ToolCallObject: JsonObject;
        FunctionObject: JsonObject;
        ArgumentsObject: JsonObject;
        ResultMessage: JsonObject;
        ToolName: Text;
        ArgumentsText: Text;
        ResultText: Text;
        IsError: Boolean;
    begin
        foreach ToolCallToken in ToolCalls do begin
            ToolCallObject := ToolCallToken.AsObject();
            if ToolCallObject.Get('function', FunctionToken) then begin
                FunctionObject := FunctionToken.AsObject();
                ToolName := GetTextValue(FunctionObject, 'name');
                ArgumentsText := GetTextValue(FunctionObject, 'arguments');
                Clear(ArgumentsObject);
                if ArgumentsText <> '' then
                    if not ArgumentsObject.ReadFrom(ArgumentsText) then
                        Clear(ArgumentsObject);
                if not ToolServer.CallTool(ToolName, ArgumentsObject, ResultText, IsError) then
                    ResultText := StrSubstNo(UnknownToolErr, ToolName);
                Clear(ResultMessage);
                ResultMessage.Add('role', 'tool');
                ResultMessage.Add('tool_call_id', GetTextValue(ToolCallObject, 'id'));
                ResultMessage.Add('content', ResultText);
                MessagesArray.Add(ResultMessage);
            end;
        end;
    end;

    local procedure RunTestConnection(var Argument: Record "Bifrost Chat Argument ori" temporary)
    var
        Client: HttpClient;
        ResponseMessage: HttpResponseMessage;
    begin
        if Argument."Base URL" = '' then begin
            Argument."Result Boolean" := false;
            Argument.SetErrorMessage(NoBaseUrlErr);
            exit;
        end;
        if Argument."Timeout Ms" > 0 then
            Client.Timeout := Argument."Timeout Ms";
        if not Client.Get(Argument."Base URL" + ModelsPathTok, ResponseMessage) then begin
            Argument."Result Boolean" := false;
            Argument.SetErrorMessage(RequestFailedErr);
            exit;
        end;
        Argument."Result Boolean" := ResponseMessage.IsSuccessStatusCode;
        if not Argument."Result Boolean" then
            Argument.SetErrorMessage(RequestFailedErr);
    end;

    local procedure BuildConfigJson() ConfigText: Text
    var
        Config: JsonObject;
        Labels: JsonObject;
    begin
        Labels.Add('thinking', ThinkingLbl);
        Labels.Add('inputPlaceholder', InputPlaceholderLbl);
        Labels.Add('sendBtn', SendBtnLbl);

        Config.Add('provider', ProviderNameTok);
        Config.Add('authMode', 'none');
        Config.Add('requiresApiKey', false);
        Config.Add('labels', Labels);
        Config.WriteTo(ConfigText);
    end;

    local procedure BuildReplyJson(ReplyText: Text) ResponseText: Text
    var
        Response: JsonObject;
    begin
        Response.Add('type', 'reply');
        Response.Add('reply', ReplyText);
        Response.WriteTo(ResponseText);
    end;

    local procedure BuildErrorJson(ErrorMessage: Text) ResponseText: Text
    var
        Response: JsonObject;
    begin
        Response.Add('error', ErrorMessage);
        Response.WriteTo(ResponseText);
    end;

    local procedure HasFiles(PayloadObject: JsonObject): Boolean
    var
        FilesToken: JsonToken;
    begin
        if not PayloadObject.Get('files', FilesToken) then
            exit(false);
        exit(FilesToken.IsArray() and (FilesToken.AsArray().Count() > 0));
    end;

    local procedure GetEndpoint(var Argument: Record "Bifrost Chat Argument ori" temporary): Text
    var
        Path: Text;
    begin
        Path := Argument."Chat Path";
        if Path = '' then
            Path := DefaultChatPathTok;
        exit(Argument."Base URL" + Path);
    end;

    local procedure GetModel(var Argument: Record "Bifrost Chat Argument ori" temporary): Text
    begin
        if Argument.Model <> '' then
            exit(Argument.Model);
        exit(DefaultModelTok);
    end;

    local procedure GetTextValue(Source: JsonObject; PropertyName: Text): Text
    var
        Token: JsonToken;
    begin
        if Source.Get(PropertyName, Token) then
            if Token.IsValue() then
                exit(Token.AsValue().AsText());
        exit('');
    end;
}
```

### API-lykill sendur

Dæmið hér að ofan þarf engan lykil, svo það svarar `RequiresApiKey = false` og snertir aldrei `GetApiKey()`. Veita sem auðkennir sig með bearer-teikni les lykilinn sem varð fyrir valinu úr færibreytufærslunni og smíðar hausinn sem `SecretText`, svo gildið birtist aldrei í villuleitara eða beiðnaskrá:

```al
[NonDebuggable]
local procedure AddAuthorization(var Argument: Record "Bifrost Chat Argument ori" temporary; var Client: HttpClient)
var
    ApiKeySecret: SecretText;
begin
    if Argument.GetApiKey() = '' then
        exit;
    ApiKeySecret := Argument.GetApiKey();
    Client.DefaultRequestHeaders().Add('Authorization', SecretStrSubstNo('Bearer %1', ApiKeySecret));
end;
```

Merktu hvert fall sem meðhöndlar lykilinn `[NonDebuggable]`, og svaraðu `RequiresApiKey` með `true` svo spjallstýringin sýni lyklagluggann. Appið geymir það sem notandinn slær inn á öruggan hátt í Business Central — persónulegan lykil fyrir hvern notanda, eða einn sameiginlegan lykil fyrir hvert mállíkan — og skilar gildinu sem varð fyrir valinu í gegnum `GetApiKey()`.

---

## Útvíkkun mállíkansfærslunnar

Stillingar sem eiga aðeins við eina veitu eiga heima í `tableextension` á `Bifrost Language Model ori`, í þínu eigin auðkennisbili:

```al
namespace Acme.Ollama;

using Origo.Bifrost.LanguageModels;

/// <summary>
/// Adds the Ollama keep-alive window to the Bifrost language model record.
/// </summary>
tableextension 50100 "Acme Ollama Language Model" extends "Bifrost Language Model ori"
{
    fields
    {
        field(50100; "Ollama Keep Alive Minutes"; Integer)
        {
            Caption = 'Ollama Keep Alive Minutes';
            DataClassification = CustomerContent;
            MinValue = 0;
        }
    }
}
```

Lestu reitinn inni í `Execute` með `BifrostLanguageModel.GetBySystemId(Argument."Language Model SystemId")` — til þess er reiturinn `Language Model SystemId` á færibreytufærslunni.

---

## Gátlisti

1. Útfærðu `Bifrost LangModel Provider ori` í einni kóðaeiningu, með `case` á `Argument."Procedure Type"`.
2. Svaraðu `IsConfigured` heiðarlega — það er hliðið bæði fyrir spjallviðmótið og stakar útfyllingar.
3. Svaraðu `CompletePrompt` ef stakar útfyllingar eiga að virka með veitunni þinni, og `SendChatMessage` ef spjallviðmótið á að virka.
4. Skilaðu `error` í JSON-svarinu frekar en að kasta AL-villu; kallendurnir breyta því í hreint svar með `status: Error`.
5. Skráðu gildið á `Bifrost LangModel Prov. ori` með `enumextension` í þínu eigin auðkennisbili.
6. Merktu hvert fall sem snertir API-lykilinn `[NonDebuggable]`.
7. Settu stillingar sem eiga aðeins við eina veitu í `tableextension` á `Bifrost Language Model ori`, aldrei í ný reitanúmer innan bils appsins sjálfs.

---

## Skuldbindingar um stöðugleika

- **Viðmótið**: `Execute(var Argument: Record "Bifrost Chat Argument ori" temporary)` er varanleg undirskrift. Ný geta kemur sem ný gildi í `Bifrost Chat Proc. Type ori`, aldrei sem nýtt fall.
- **Færibreytufærslan**: nýjum reitum og nýjum aðgangsföllum má bæta við; núverandi reitanúmer, reitategundir og undirskriftir aðgangsfalla haldast milli minni útgáfa.
- **Upptalning veitna**: Bifrost Language Models á aðeins sín eigin úthlutuðu raðgildi. Bættu þínum gildum við úr þínu eigin auðkennisbili.
- **`MCP Tool Server ori`**: meðlimirnir sem taldir eru upp hér að ofan tilheyra fletinum. Verkfæraskráin sjálf eru gögn — heiti verkfæra og skemu breytast eftir því sem skilaboðategundum er bætt við.
- **Allt annað er innra**: innbyggðu veiturnar, Copilot-milliliðurinn, verkfærakeyrslan og útfærslur skilaboðategunda. Kallaðu ekki á þær og gerstu ekki áskrifandi að atburðum þeirra.

Ef þú þarft viðbótarkrók sem ekki er talinn upp hér skaltu stofna mál í hugbúnaðarsafni Bifrost Language Models sem lýsir notkuninni, frekar en að byggja á innri meðlimum.

---

## Tengd skjöl

- [Opinber flötur Foundation](/extensibility/public-surface/) — upptalningin `Message Type ori`, samningurinn `Msg Interface ori` og upptalningin `Request Log Type ori`
- [Uppsetningartilvísun](/foundation/reference/setup/) — Bifrost User Setup og kerfisfyrirmæli hvers notanda
