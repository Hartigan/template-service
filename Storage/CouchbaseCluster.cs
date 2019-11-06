using System;
using System.Collections.Generic;
using Couchbase;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Storage
{
    public class CouchbaseCluster
    {
        private readonly ICluster _cluster;

        public CouchbaseCluster(IOptions<CouchbaseConfig> config, ILoggerProvider loggerProvider)
        {
            var options = new ClusterOptions()
                .WithServers(config.Value.Domain)
                .WithCredentials(config.Value.Username, config.Value.Password)
                .WithLogging(loggerProvider)
                .WithBucket("main");
            _cluster = Couchbase.Cluster.Connect(config.Value.Domain, options);
        }

        public ICluster Cluster => _cluster;
    }
}