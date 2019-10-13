using System;
using System.Runtime.Serialization;

namespace Domain
{
    [DataContract]
    public class VersionItem : IDocumentKey
    {
        [DataMember(Name = "id")]
        public string Id { get; set; }

        [DataMember(Name = "author_id")]
        public string AuthorId { get; set; }

        [DataMember(Name = "target_id")]
        public int TargetId { get; set; }

        [DataMember(Name = "target_type")]
        public string TargetType { get; set; }

        [DataMember(Name = "timestamp")]
        public DateTimeOffset Timestamp { get; set; }

        [DataMember(Name = "parent_id")]
        public string ParentId { get; set; }

        public string Key => $"{Type}::{Id}";

        [DataMember(Name = "type")]
        public string Type { get; } = "version_item";
    }
}