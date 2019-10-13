
using System.Runtime.Serialization;

[DataContract]
public class Head<T> : IDocumentKey where T : IDocumentKey
{
    [DataMember(Name = "id")]
    public string Id { get; set; }

    [DataMember(Name = "content")]
    public T Content { get; set; }

    [DataMember(Name = "version_item_id")]
    public string VersionItemId { get; set; }

    public string Key => $"{Type}::{Id}";

    [DataMember(Name = "type")]
    public string Type { get; } = "head";
}