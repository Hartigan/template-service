using System;
using System.Threading.Tasks;
using Couchbase;

namespace Storage
{
    public class CouchbaseBuckets
    {
        private readonly CouchbaseCluster _cluster;

        private readonly IBucketInitializer _mainBucket;

        public CouchbaseBuckets(
            CouchbaseCluster cluster
        )
        {
            _cluster = cluster;
            _mainBucket = new DefaultBucketInitializer(cluster, "main");
        }

        public Task<IBucket> GetMainBucketAsync() => _mainBucket.GetOrCreate();
    }
}