
using System.Runtime.Serialization;

[DataContract]
public class Head<T>
{
    [DataMember(Name = "id")]
    public string Id { get; set; }

    [DataMember(Name = "content")]
    public T Content { get; set; }

    [DataMember(Name = "version_item_id")]
    public string VersionItemId { get; set; }
}