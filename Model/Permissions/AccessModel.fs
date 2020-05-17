namespace Models.Permissions

open DatabaseTypes
open DatabaseTypes.Identificators
open System.Text.Json.Serialization

type AccessModel =
    {
        [<JsonPropertyName("generate")>]
        Generate : bool
        [<JsonPropertyName("read")>]
        Read : bool
        [<JsonPropertyName("write")>]
        Write : bool
        [<JsonPropertyName("admin")>]
        Admin : bool
    }

    static member CanGenerate = {
            AccessModel.Generate = true
            Read = false
            Write = false
            Admin = false
        }

    static member CanRead = {
            AccessModel.Generate = false
            Read = true
            Write = false
            Admin = false
        }

    static member CanWrite = {
            AccessModel.Generate = false
            Read = false
            Write = true
            Admin = false
        }

    static member CanAdministrate = {
            AccessModel.Generate = false
            Read = false
            Write = false
            Admin = true
        }

    static member Create(access: uint64) : AccessModel =
        {
            AccessModel.Generate    = (access &&& (1UL <<< 0)) <> 0UL
            Read                    = (access &&& (1UL <<< 1)) <> 0UL
            Write                   = (access &&& (1UL <<< 2)) <> 0UL
            Admin                   = (access &&& (1UL <<< 3)) <> 0UL
        }

    member this.IsAllowed(access: AccessModel) =
        let thisFlags = this.ToFlags()
        let reqFlags = access.ToFlags()
        reqFlags &&& thisFlags = reqFlags

    member this.ToFlags() : uint64 =
        [
            this.Generate
            this.Read
            this.Write
            this.Admin
        ]
        |> Seq.mapi(fun i p -> if p then (1UL <<< i) else 0UL)
        |> Seq.reduce(|||)
