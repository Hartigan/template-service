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

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "normalized_name")]
        public string NormalizedName { get; set; }

        [DataMember(Name = "email")]
        public string Email { get; set; }

        [DataMember(Name = "email_confirmed")]
        public string EmailConfirmed { get; set; }

        [DataMember(Name = "password_hash")]
        public string PasswordHash { get; set; }

        [DataMember(Name = "is_authenticated")]
        public bool IsAuthenticated { get; set; }

        [DataMember(Name = "authentication_type")]
        public string AuthenticationType { get; set; }

        public string Key => $"{Type}::{Id}";

        [DataMember(Name = "type")]
        public string Type { get; } = "user";
    }
}