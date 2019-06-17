using System.Collections.Generic;
using System.Runtime.Serialization;

[DataContract]
public class Group
{
    [DataMember(Name = "id")]
    public string Id;

    [DataMember(Name = "items_type")]
    public string ItemsType { get; set; }

    [DataMember(Name = "items")]
    public IList<string> Items { get; set; };
}