using System;
using System.Threading.Tasks;
using Couchbase;
using Couchbase.Management;
using Couchbase.Management.Buckets;

namespace Storage
{
    internal class DefaultBucketInitializer : IBucketInitializer
    {
        private readonly CouchbaseCluster _couchbaseCluster;
        private readonly string _bucketName;

        public DefaultBucketInitializer(
            CouchbaseCluster couchbaseCluster,
            string bucketName
        )
        {
            _couchbaseCluster = couchbaseCluster;
            _bucketName = bucketName;
        }

        public async Task<IBucket> Get()
        {
            var cluster = await _couchbaseCluster.GetClusterAsync();
            return await cluster.BucketAsync(_bucketName);
        }
    }
}