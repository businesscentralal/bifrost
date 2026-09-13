---
id: extensibility
title: "Extending Bragi with a chat provider"
sidebar_label: "Extending Bragi"
sidebar_position: 3
description: "The public extension point of Bifröst Language Models: registering an additional language model provider."
---

This skjal describes the **public extension point** of the Bifrost Language Models extension: adding a language model provider.

Anything not listed here er **internal** og may change between releases án notice. The package marks internal kóðiunits með `Access = Internal` og locks down the rest via the publisher's standard release policy.

---

## How to depend on Bifrost Language Models

Add both Bragi og the Bifrost Foundation it sits on to your extension's `app.json`. Bragi gerir ekki propagate its own dependency, so Foundation verður að vera listed explicitly:

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

All objects in this guide live in the heitispace `Origo.Bifrost.Bragi`.

---

## Extensibility surface at a glance

| Category | Items | Stability |
|---|---|---|
| Interfaces | `Bifrost LangModel Provider ori` | Stable samningur — the single `Execute` signature never changes |
| Extensible enums | `Bifrost LangModel Prov. ori`, `Bifrost Chat Proc. Type ori` | Add new `value(...)` entries úr your extension |
| Public tables | `Bifrost Language Model ori`, `Bifrost Chat Argument ori` | Extend `Bifrost Language Model ori` með a `tableextension`; the argument færsla er the interface parameter |
| Public kóðiunits | `Bifrost Chat Mgt ori`, `Bifrost Chat Transfer ori`, `MCP Tool Server ori` | Entry points fyrir chat hosts og provider implementations |
| Control add-ins | `Bifrost Chat ori` | Hosted by the Bifrost Chat FactBox og the Chat Focus page |

---

## The provider samningur

A language model provider er one kóðiunit implementing one interface:

```al
interface "Bifrost LangModel Provider ori"
{
    procedure Execute(var Argument: Record "Bifrost Chat Argument ori" temporary)
}
```

The signature never changes. The **operation** er carried in the `Procedure Type` field on the argument færsla, og new operations arrive as new gildi on the `Bifrost Chat Proc. Type ori` enum. A provider written against today's enum keeps compiling þegar operations eru added — it simply gerir ekki answer the ones it gerir ekki know.

Kallandinn resolves the implementation through the `Bifrost LangModel Prov. ori` enum, which er stored in the **Chat Provider** field on hver `Bifrost Language Model ori` færsla. Its `DefaultImplementation` er `Bifrost LangModel None ori`, the disabled provider that reports "not stillt" fyrir everything.

### Registering the provider

```al
namespace Acme.Bifrost.Ollama;

using Origo.Bifrost.Bragi;

enumextension 50100 "Acme LangModel Prov." extends "Bifrost LangModel Prov. ori"
{
    value(50100; Ollama)
    {
        Caption = 'Ollama';
        Implementation = "Bifrost LangModel Provider ori" = "Acme Ollama Provider";
    }
}
```

That er the whole registration. The gildi appears in the **Chat Provider** field on the Bifrost Language Model card, og every call the base app makes fyrir a language model með that provider lands in your kóðiunit.

---

## Operations to handle

`Bifrost Chat Proc. Type ori` (10035338) er grouped í config-dependent operations (10–17), provider metadata (100–116) og provider sjálfgefiðs (120–126).

Before hver call the facade resets `Result Boolean` to `false`, `Result Integer` to `0`, og clears the niðurstaða text og the villa message. An operation your `case` gerir ekki cover therefore reads back as "not supported" — never as a stale gildi úr a previous call. That er what makes partial implementations safe.

### Config-dependent operations

| Operation | Kallaðu áed by | Lestus | Writes | Needed |
|---|---|---|---|---|
| `IsConfigured` (10) | Chat visibility gate; `LLM.Prompt.Complete` áður en it sends anything | Config fields, `GetApiKey` | `Result Boolean` | Alltaf |
| `BuildConfigJson` (11) | Chat control add-in on start-up | Config fields | `SetResultText` (JSON) | For the chat UI |
| `SendChatMessage` (12) | `Bifrost Chat Mgt.SendChatMessage` | `GetPayload`, `GetSkill`, `GetUserPrompt`, `GetApiKey`, config | `SetResultText` (JSON) | For the chat UI |
| `ContinueWithToolResults` (13) | Chat control, eftir it has run the tool calls | `GetConversationState`, `GetToolResults`, `GetApiKey` | `SetResultText` (JSON) | Only þegar `SupportsSplitToolExecution` er true |
| `GetAvailableModels` (14) | **Get Models** on the language model card | Config, `GetApiKey` | `SetModels`, `Result Boolean` | Only þegar `SupportsModelSelection` er true |
| `TestConnection` (15) | **Test Connection** on the language model card | Config, `GetApiKey` | `Result Boolean`, `SetErrorMessage` | Recommended |
| `GetTokenUsage` (16) | Reserved — not called by the base app today | — | `Input Tokens`, `Output Tokens` | Valfrjálst |
| `CompletePrompt` (17) | The `LLM.Prompt.Complete` message tegund | `GetPayload`, config, `GetApiKey` | `SetResultText` (JSON) | For the message tegund |

A provider that answers aðeins `IsConfigured`, `BuildConfigJson`, `SendChatMessage` og `CompletePrompt` er already usable: chat works, the message tegund works, og the card degrades gracefully because everything else reports "not supported".

### Provider metadata

| Operation | Kallaðu áed by | Writes |
|---|---|---|
| `GetProviderName` (100) | Diagnostics og the chat config | `SetResultText` |
| `RequiresApiKey` (101) | Chat config og the card's key dialog | `Result Boolean` |
| `GetApiKeyLabel` (102), `GetApiKeyInstruction` (103), `GetApiKeyPlaceholder` (104), `GetApiKeyDocsUrl` (105), `GetApiKeyDocsLinkText` (106), `GetServiceKeyDescription` (107) | Chat config og the card's key dialog | `SetResultText` |
| `HasServiceKeyPermission` (108) | Chat config — whether the notandi may save a shared key | `Result Boolean` |
| `GetMaxToolCount` (110) | Reserved — not called by the base app today | `Result Integer` |
| `SupportsSplitToolExecution` (111) | Chat config, as `supportsToolLoop` | `Result Boolean` |
| `SupportsModelSelection` (112) | **Get Models** on the card | `Result Boolean` |
| `SupportsToolCalling` (113) | Reserved — not called by the base app today | `Result Boolean` |
| `HasExternalEndpoint` (114) | Card field visibility og sjálfgefið seeding | `Result Boolean` |
| `RequiresChatPath` (115), `RequiresModelsPath` (116) | Card field visibility | `Result Boolean` |

`HasExternalEndpoint` er the switch that turns the endpoint half of the card on. Answer `false` fyrir a provider that talks to Microsoft-managed resources — the Base URL, Model, Chat Path og Models Path fields then stay hidden og unvalidagsetningd.

### Provider sjálfgefiðs

| Operation | Kallaðu áed by | Writes |
|---|---|---|
| `GetDefaultBaseUrl` (120), `GetDefaultModel` (121) | Seeded í the language model þegar the provider er selected, og used to decide whether the field er mandatory | `SetResultText` |
| `GetDefaultTimeoutSeconds` (122), `GetDefaultMaxTokens` (123) | Seeded í the language model þegar the provider er selected | `Result Integer` |
| `GetContextWindowChars` (124) | Reserved — not called by the base app today | `Result Integer` |
| `GetDefaultSkillUrl` (125), `GetDefaultSkillText` (126) | **Load sjálfgefið skill** on the card | `SetResultText` |

---

## The argument færsla

`Bifrost Chat Argument ori` (10035337) er a `TableType = Temporary` færsla. Short gildi travel as fields; anything that getur exceed a field length travels through accessor procedures backed by kóðiunit-scoped variables, so nothing large er ever written to the database.

### Fields the caller fills in

| Field | Type | Meaning |
|---|---|---|
| `Language Model SystemId` | Guid | Primary key — the `SystemId` of the resolved `Bifrost Language Model ori` færsla. |
| `Procedure Type` | Enum | The operation to perform. |
| `Base URL` | Text[250] | Endpoint root úr the language model. |
| `Model` | Text[100] | Model heiti úr the language model. |
| `Timeout Ms` | Integer | **Timeout Seconds** úr the language model, already converted to milliseconds. |
| `Max Tokens` | Integer | Token ceiling úr the language model. |
| `Chat Path` | Text[250] | Path appended to `Base URL` fyrir completions. |
| `Models Path` | Text[250] | Path appended to `Base URL` fyrir model discovery. |
| `Debug Mode` | Boolean | **Beiðni Debug Mode** úr the Bifrost setup — log full payloads þegar set. |

### Fields the provider writes

| Field | Type | Meaning |
|---|---|---|
| `Result Boolean` | Boolean | Answer to every boolean operation. |
| `Result Integer` | Integer | Answer to every numeric operation. |
| `Input Tokens`, `Output Tokens` | Integer | Answer to `GetTokenUsage`. |

### Text accessors

| Direction | Accessor | Carries |
|---|---|---|
| In | `GetApiKey()` | The resolved key — the caller's personal key, else the company service key. The setter er `[NonDebuggable]`; keep your own key handling `[NonDebuggable]` too. |
| In | `GetSkill()` | Skill text úr the language model, fyrir `SendChatMessage`. |
| In | `GetUserPrompt()` | Kallandinn's own system prompt úr Bifrost Notaður Stilltuup, fyrir `SendChatMessage`. |
| In | `GetPayload()` | Beiðnin payload fyrir `SendChatMessage` og `CompletePrompt`. |
| In | `GetConversationState()`, `GetToolResults()` | Split tool execution state fyrir `ContinueWithToolResults`. |
| Out | `SetResultText()` | Every text og JSON answer. |
| Out | `SetErrorMessage()` | Human-readable failure fyrir `TestConnection`. |
| Out | `SetModels()` | `Name/Value Buffer` of model ids og display heitis fyrir `GetAvailableModels`. |

---

## Payload samningar

### `CompletePrompt`

Input, úr `GetPayload()`:

```json
{
  "systemPrompt": "Extract structured data from text. Return valid JSON.",
  "messages": [{ "role": "user", "content": "Invoice #4521, total 1250.00" }],
  "files": [{ "data": "JVBERi0...", "mimeType": "application/pdf", "fileName": "Invoice.pdf" }]
}
```

`systemPrompt` og `files` eru present aðeins þegar the caller supplied them. Output, through `SetResultText()`, er a JSON object með either `reply` (or `text`) on success eða `error` on failure. A provider that geturnot process skjöl verður return an `error` þegar `files` er present rather than silently dropping the attachment.

### `SendChatMessage`

Input carries `messages` (the full conversation, hver entry `role` plus `content`), optionally `model`, `recordContext` (the `tableId` og `recordSystemId` of the page the FactBox er docked to) og `contextSkill`. The skill og the notandi's system prompt arrive separately through `GetSkill()` og `GetUserPrompt()`.

Output er one of three shapes:

```json
{ "type": "reply", "reply": "...", "toolTrace": [] }
{ "type": "tool_calls", "toolCalls": [{ "id": "...", "name": "get_records", "arguments": "{}" }], "conversationState": "..." }
{ "error": "..." }
```

`tool_calls` er aðeins valid þegar `SupportsSplitToolExecution` reports `true`; the control add-in then runs hver tool og calls back í `ContinueWithToolResults` með the state og the niðurstöður. A provider that resolves its tool loop in-process returns `type: reply` directly og puts the calls it made í `toolTrace`.

### `BuildConfigJson`

A JSON object read by the chat control add-in. `provider`, `authMode`, `requiresApiKey` og a `labels` object of UI strings eru the fields the control uses; the facade then overlays `canManageServiceKey`, `apiKeyLabel`, `apiKeyInstruction`, `apiKeyPlaceholder`, `apiKeyDocsUrl`, `apiKeyDocsLinkText`, `serviceKeyDescription` og `supportsToolLoop` úr the metadata operations.

---

## The MCP tool server

`MCP Tool Server ori` (10035387) er `Access = Public` og `SingleInstance`. A provider uses it to give the model access to Business Central:

| Member | Purpose |
|---|---|
| `Bootstrap(RecordContext: Text): Text` | Builds the session system prompt — identity, company, memory og tool usage rules. Kallaðu á once per chat turn. Sendu the `recordContext` object úr the payload, eða an empty string. |
| `ListTools(var Tools: JsonArray)` | The tool registry in MCP shape: `name`, `description`, `inputSchema`. Convert to your provider's dialect. |
| `CallTool(ToolName: Text; Arguments: JsonObject; var ResultText: Text; var IsError: Boolean): Boolean` | Keyrir one tool inside its own `Codeunit.Run` scope. Skilar `false` fyrir an unknown tool; `IsError` reports a tool that ran og failed. |
| `GetToolCount(): Integer` | Number of registered tools. |
| `ClearSession()` | Drops the cached system prompt og the blob store. Kallaðu á þegar a conversation er reset. |
| `BuildDynamicToolDefs(...)`, `SanitizeToolName(...)` | Build per-message-tegund tool definitions og turn a message tegund heiti í a valid tool heiti. |

Tool calls eru written to the Bifrost request log. Register your own `Request Log Type ori` gildi með a `Request Log Masker ori` implementation ef your provider logs requests that carry secrets.

---

## Complete example

A provider fyrir a self-hosted Ollama endpoint that speaks the OpenAI chat-completions dialect, resolves its tool loop in-process against the Bifrost MCP tool server, og needs no API key.

**AcmeLangModelProv.EnumExt.al**

```al
namespace Acme.Bifrost.Ollama;

using Origo.Bifrost.Bragi;

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
namespace Acme.Bifrost.Ollama;

using Origo.Bifrost.Bragi;

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
        ResponseMessage.Content.ReadAs(ResponseText);
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

### Sending an API key

The example above needs no key, so it reports `RequiresApiKey = false` og never touches `GetApiKey()`. A provider that authenticates með a bearer token reads the resolved key úr the argument færsla og builds the header as a `SecretText`, so the gildi never appears in a debugger eða a request log:

```al
[NonDebuggable]
local procedure AddAuthorization(var Argument: Record "Bifrost Chat Argument ori" temporary; var Client: HttpClient)
var
    ApiKeySecret: SecretText;
begin
    if Argument.GetApiKey() = '' then
        exit;
    ApiKeySecret := Argument.GetApiKey();
    Client.DefaultRequestHeaders.Add('Authorization', SecretStrSubstNo('Bearer %1', ApiKeySecret));
end;
```

Mark every procedure that handles the key `[NonDebuggable]`, og answer `RequiresApiKey` með `true` so the chat control shows the key dialog. The base app stores what the notandi tegunds — personal keys under `Bifrost_Chat_Usr_<SystemId>_<user security id>` og shared keys under `Bifrost_Chat_Svc_<SystemId>`, both in Isolated Storage með company scope — og hands the resolved gildi back through `GetApiKey()`.

---

## Extending the language model færsla

Provider-specific settings belong on a `tableextension` over `Bifrost Language Model ori` in your own ID range:

```al
namespace Acme.Bifrost.Ollama;

using Origo.Bifrost.Bragi;

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

Lestu the field inside `Execute` með `BifrostLanguageModel.GetBySystemId(Argument."Language Model SystemId")` — that er what the `Language Model SystemId` field on the argument færsla er for.

---

## Checklist

1. Implement `Bifrost LangModel Provider ori` in one kóðiunit, með a `case` on `Argument."Procedure Type"`.
2. Answer `IsConfigured` honestly — it er the gate fyrir both the chat UI og `LLM.Prompt.Complete`.
3. Handle `CompletePrompt` ef you want the message tegund to work með your provider, og `SendChatMessage` ef you want the chat UI to work.
4. Return `error` in your JSON rather than raising an AL villa; the callers turn that í a clean `status: Error` response.
5. Register the gildi on `Bifrost LangModel Prov. ori` með an `enumextension` in your own ID range.
6. Mark every procedure that touches the API key `[NonDebuggable]`.
7. Put provider-specific settings on a `tableextension` over `Bifrost Language Model ori`, never on new field numbers inside Bragi's range.

---

## Stability commitments

- **The interface**: `Execute(var Argument: Record "Bifrost Chat Argument ori" temporary)` er the permanent signature. New capability arrives as new `Bifrost Chat Proc. Type ori` gildi, never as a new procedure.
- **The argument færsla**: new fields og new accessor procedures may be added; existing field numbers, field tegunds og accessor signatures eru preserved across minor versions.
- **The provider enum**: Bragi owns its allocated ordinals only. Add your gildi úr your own ID range.
- **`MCP Tool Server ori`**: the members listed above eru part of the surface. The tool registry itself er data — tool heitis og schemas change as message tegunds eru added.
- **Internal kóðiunits**: `Copilot LangModel Prov. ori`, `Copilot Chat Proxy ori`, `MCP Tool Executor ori` og the message-tegund implementations eru internal. Ekki call them og do not subscribe to their events.

Ef you need an extensibility hook that er not listed here, open an issue in the Bifrost Language Models repository describing the use case rather than depending on internal members.

---

## Related Documentation

- [Chat Skilaboð Types](/language-models/message-types/) — the `LLM.Prompt.Complete` samningur
- Bifrost Foundation, *Extensibility Reference* — the `Message Type ori` enum, the `Msg Interface ori` samningur og the `Request Log Type ori` enum
- Bifrost Foundation, *Stilltuup Reference* — Bifrost Notaður Stilltuup og the per-notandi system prompt
