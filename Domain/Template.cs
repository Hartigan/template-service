using System.Runtime.Serialization;

namespace Domain
{
    [DataContract]
    public class Template : IDocumentKey
    {
        [DataMember(Name = "id")]
        public string Id { get; set; }

        [DataMember(Name = "language")]
        public string Language { get; set; }

        [DataMember(Name = "content")]
        public string Content { get; set; }

        public string Key => $"{Type}::{Id}";

        [DataMember(Name = "type")]
        public string Type { get; } = "template";
    }
}