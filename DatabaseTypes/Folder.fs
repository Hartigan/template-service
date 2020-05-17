namespace DatabaseTypes

open System.Text.Json.Serialization


type FolderLink = {
    [<JsonPropertyName("id")>]
    Id : string
    [<JsonPropertyName("name")>]
    Name : string
}

type HeadLink = {
    [<JsonPropertyName("id")>]
    Id : string
    [<JsonPropertyName("name")>]
    Name : string
    [<JsonPropertyName("type")>]
    Type: string
}

type Folder =
    {
        [<JsonPropertyName("id")>]
        Id : string
        [<JsonPropertyName("name")>]
        Name : string
        [<JsonPropertyName("permissions")>]
        Permissions : Permissions
        [<JsonPropertyName("folders")>]
        Folders : List<FolderLink>
        [<JsonPropertyName("heads")>]
        Heads : List<HeadLink>
    }

    static member TypeName = "folder"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Folder.TypeName)
    member private this.DocKey = Folder.CreateDocumentKey(this.Id)

    [<JsonPropertyName("type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key

