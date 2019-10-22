using System.Runtime.Serialization;

namespace Domain
{
    [DataContract]
    public class UserRole : IDocumentKey
    {
        [DataMember(Name = "id")]
        public string Id { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        public string Key => $"{Type}::{Id}";

        [DataMember(Name = "type")]
        public string Type { get; } = "user_role";
    }
}