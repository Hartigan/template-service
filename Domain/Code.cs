﻿using System.Runtime.Serialization;

namespace Domain
{
    [DataContract]
    public class Code
    {
        [DataMember(Name = "id")]
        public string Id { get; set; }

        [DataMember(Name = "content")]
        public string Content { get; set; }
    }
}
