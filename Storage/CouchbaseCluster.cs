using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Couchbase;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Storage
{
    public class CouchbaseCluster
    {
        private ICluster _cluster;
        private readonly IOptions<CouchbaseConfig> _config;
        private readonly ILoggerFactory _loggerFactory;

        public CouchbaseCluster(IOptions<CouchbaseConfig> config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _loggerFactory = loggerFactory;
        }

        public async Task<ICluster> GetClusterAsync()
        {
            if (_cluster == null)
            {
                var options = new ClusterOptions()
                    .Credentials(_config.Value.Username, _config.Value.Password)
                    .Logging(_loggerFactory)
                    .Bucket("main");
                _cluster = await Couchbase.Cluster.ConnectAsync(_config.Value.Domain, options);
            }
            return _cluster;
        }
        
    }
}