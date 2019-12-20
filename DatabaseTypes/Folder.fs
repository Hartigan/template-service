namespace DatabaseTypes

open System.Collections.Generic
open System.Runtime.Serialization


[<DataContract>]
type FolderLink = {
    [<field: DataMember(Name = "id")>]
    Id : string
    [<field: DataMember(Name = "name")>]
    Name : string
}

[<DataContract>]
type HeadLink = {
    [<field: DataMember(Name = "id")>]
    Id : string
    [<field: DataMember(Name = "name")>]
    Name : string
}

[<DataContract>]
type Folder =
    {
        [<field: DataMember(Name = "id")>]
        Id : string
        [<field: DataMember(Name = "name")>]
        Name : string
        [<field: DataMember(Name = "permissions")>]
        Permissions : Permissions
        [<field: DataMember(Name = "folders")>]
        Folders : List<FolderLink>
        [<field: DataMember(Name = "heads")>]
        Heads : List<HeadLink>
    }

    static member TypeName = "folder"
    static member CreateDocumentKey(id: string): DocumentKey =
        DocumentKey.Create(id, Folder.TypeName)
    member private this.DocKey = Folder.CreateDocumentKey(this.Id)

    [<DataMember(Name = "type")>]
    member private this.Type
        with get() = this.DocKey.Type
        and set(value: string) = ()

    interface IDocumentKey with
        member this.Type
            with get() = this.DocKey.Type
        member this.Key
            with get() = this.DocKey.Key

