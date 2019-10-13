using System.Runtime.Serialization;

namespace Domain
{
    [DataContract]
    public class User : IDocumentKey
    {
        [DataMember(Name = "id")]
        public string Id { get; set; }

        [DataMember(Name = "first_name")]
        public string FirstName { get; set; }

        [DataMember(Name = "last_name")]
        public string LastName { get; set; }

        [DataMember(Name = "nickname")]
        public string Nickname { get; set; }

        public string Key => $"{Type}::{Id}";

        [DataMember(Name = "type")]
        public string Type { get; } = "user";
    }
}