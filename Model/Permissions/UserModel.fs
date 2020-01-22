namespace Models.Permissions

open DatabaseTypes
open Models.Identificators
open Models.Converters
open System.Text.Json.Serialization

[<JsonConverter(typeof<FirstNameConverter>)>]
type FirstName(firstName: string) =
    member val Value = firstName with get

and FirstNameConverter() =
    inherit StringConverter<FirstName>((fun m -> m.Value),
                                       (fun s -> FirstName(s)))

[<JsonConverter(typeof<LastNameConverter>)>]
type LastName(lastName: string) =
    member val Value = lastName with get

and LastNameConverter() =
    inherit StringConverter<LastName>((fun m -> m.Value),
                                      (fun s -> LastName(s)))

[<JsonConverter(typeof<UsernameConverter>)>]
type Username(username: string) =
    member val Value = username with get

and UsernameConverter() =
    inherit StringConverter<Username>((fun m -> m.Value),
                                      (fun s -> Username(s)))

type UserModel =
    {
        [<JsonPropertyName("id")>]
        Id: UserId
        [<JsonPropertyName("first_name")>]
        FirstName: FirstName
        [<JsonPropertyName("last_name")>]
        LastName: LastName
        [<JsonPropertyName("username")>]
        Username: Username
    }

    static member Create(user: User) : Result<UserModel, unit> =
        Ok({
            UserModel.Id    = UserId(user.Id)
            FirstName       = FirstName(user.FirstName)
            LastName        = LastName(user.LastName)
            Username        = Username(user.Name)
        })
