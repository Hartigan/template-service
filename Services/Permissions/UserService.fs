namespace Services.Permissions

open Models.Permissions
open DatabaseTypes.Identificators
open Services.Permissions
open Contexts
open DatabaseTypes
open System
open Utils.ResultHelper
open System.Net.Http
open IdentityModel.Client
open Utils.AsyncHelper
open System.Net.Http.Headers
open System.Text.Json.Serialization
open System.Text.Json
open Microsoft.Extensions.Options
open Microsoft.Extensions.Logging

type KeycloakUser() =
    [<JsonPropertyName("id")>]
    member val Id = "" with get, set
    [<JsonPropertyName("username")>]
    member val Username = "" with get, set
    [<JsonPropertyName("firstName")>]
    member val FirstName = "" with get, set
    [<JsonPropertyName("lastName")>]
    member val LastName = "" with get, set

type KeycloakOptions() =
    member val Address = "" with get, set
    member val ClientId = "" with get, set
    member val ClientSecret = "" with get, set

type UserService(userGroupsContext: IContext<UserGroups>,
                 userItemsContext: IContext<UserItems>,
                 trashContext: IContext<Trash>,
                 keycloakOptions: IOptions<KeycloakOptions>,
                 clientFactory: IHttpClientFactory,
                 logger: ILogger<UserService>) =

    let httpClient = clientFactory.CreateClient("UserService_")

    let mutable accessToken = ""
    let mutable accessTokenUpdateTime = DateTimeOffset.UtcNow

    let jsonOptions = JsonSerializerOptions()

    member this.CreateTokenClient() =
        let tokenClientOptions = TokenClientOptions()
        tokenClientOptions.Address <- (keycloakOptions.Value.Address + "/auth/realms/quiz-gen/protocol/openid-connect/token")
        tokenClientOptions.ClientId <- keycloakOptions.Value.ClientId
        tokenClientOptions.ClientSecret <- keycloakOptions.Value.ClientSecret
        TokenClient(httpClient, tokenClientOptions)

    member this.GetAccessToken() =
        async {
            let now = DateTimeOffset.UtcNow
            if accessTokenUpdateTime > now then
                return accessToken
            else 
                let client = this.CreateTokenClient()
                let! (tokenResponse : TokenResponse) = client.RequestClientCredentialsTokenAsync()
                accessToken <- tokenResponse.AccessToken
                accessTokenUpdateTime <- DateTimeOffset.UtcNow.AddSeconds(float tokenResponse.ExpiresIn)
                return accessToken
        }

    interface IUserService with
        member this.Search(pattern, offset, limit) =
            async {
                let! accessToken = this.GetAccessToken()
                let uri =
                    match pattern with
                    | Some(p) ->
                        Uri(sprintf "%s/auth/admin/realms/quiz-gen/users?search=%s&max=%d&first=%d" keycloakOptions.Value.Address (Uri.EscapeDataString(p)) limit offset)
                    | None ->
                        Uri(sprintf "%s/auth/admin/realms/quiz-gen/users?max=%d&first=%d" keycloakOptions.Value.Address limit offset)

                use request = new HttpRequestMessage(HttpMethod.Get, uri)
                request.Headers.Authorization <- AuthenticationHeaderValue("Bearer", accessToken)

                try
                    let! (response: HttpResponseMessage) = httpClient.SendAsync(request)
                    let! (body: string) = response.Content.ReadAsStringAsync()
                    logger.LogWarning(body);
                    let users = JsonSerializer.Deserialize<System.Collections.Generic.List<KeycloakUser>>(body, jsonOptions)
                    return
                        users
                        |> Seq.map(fun user ->
                            UserModel.Create(
                                UserId(user.Id),
                                FirstName(user.FirstName),
                                LastName(user.LastName),
                                Username(user.Username)
                            )
                        )
                        |> List.ofSeq
                        |> fun models -> Ok(models)
                with ex -> return Result.Error(ex)
            }

        member this.Get(id: UserId) =
            async {
                let! accessToken = this.GetAccessToken()
                let uri = Uri(sprintf "%s/auth/admin/realms/quiz-gen/users/%s" keycloakOptions.Value.Address id.Value)

                use request = new HttpRequestMessage(HttpMethod.Get, uri)
                request.Headers.Authorization <- AuthenticationHeaderValue("Bearer", accessToken)

                try
                    let! (response: HttpResponseMessage) = httpClient.SendAsync(request)
                    let! (body: string) = response.Content.ReadAsStringAsync()
                    let user = JsonSerializer.Deserialize<KeycloakUser>(body, jsonOptions)
                    return Ok(
                        UserModel.Create(
                            id,
                            FirstName(user.FirstName),
                            LastName(user.LastName),
                            Username(user.Username)
                        )
                    )
                with ex -> return Result.Error(ex)
            }

        member this.Init(id) =
            userGroupsContext.Exists(UserGroups.CreateDocumentKey(id))
            |> Async.BindResult(fun exists ->
                if exists then
                    async.Return(Ok())
                else
                    let userGroups =
                        {
                            UserGroups.UserId = id
                            Type = UserGroupsType.Instance
                            Allowed = []
                            Owned = []
                        }
                    userGroupsContext.Insert(userGroups, userGroups)
            )
            |> Async.BindResult(fun _ ->
                userItemsContext.Exists(UserItems.CreateDocumentKey(id))
            )
            |> Async.BindResult(fun exists ->
                if exists then
                    async.Return(Ok())
                else
                    let userItems =
                        {
                            UserItems.UserId = id
                            Type = UserItemsType.Instance
                            Allowed = {
                                Heads = []
                                Folders = []
                                Reports = []
                                Submissions = []
                            }
                            Owned = {
                                Heads = []
                                Folders = []
                                Reports = []
                                Submissions = []
                            }
                        }
                    userItemsContext.Insert(userItems, userItems)
            )
            |> Async.BindResult(fun _ ->
                trashContext.Exists(Trash.CreateDocumentKey(id))
            )
            |> Async.BindResult(fun exists ->
                if exists then
                    async.Return(Ok())
                else
                    let trash =
                        {
                            Trash.OwnerId = id
                            Heads = []
                            Folders = []
                            Type = TrashType.Instance
                        }
                    trashContext.Insert(trash, trash)
            )


