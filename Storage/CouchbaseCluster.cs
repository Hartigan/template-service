using System;
using System.Collections.Generic;
using Couchbase;
using Microsoft.Extensions.Options;

namespace Storage
{
    public class CouchbaseCluster
    {
        private readonly Cluster _cluster;

        public CouchbaseCluster(IOptions<CouchbaseConfig> config)
        {
            _cluster = new Cluster
            (
                new Configuration()
                    .WithServers(config.Value.Domain)
                    .WithCredentials(config.Value.Username, config.Value.Password)
            );
        }

        public Cluster Cluster => _cluster;
    }
}