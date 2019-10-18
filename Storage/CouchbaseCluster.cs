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
            var options = new ClusterOptions()
                .WithServers(config.Value.Domain)
                .WithCredentials(config.Value.Username, config.Value.Password)
                .WithBucket("default");
            _cluster = new Cluster(config.Value.Domain, options);
        }

        public Cluster Cluster => _cluster;
    }
}