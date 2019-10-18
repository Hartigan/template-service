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

        private bool _inited = false;

        public DefaultBucketInitializer(
            CouchbaseCluster couchbaseCluster,
            string bucketName
        )
        {
            _couchbaseCluster = couchbaseCluster;
            _bucketName = bucketName;
        }

        public async Task<IBucket> GetOrCreate()
        {
            var options = new UpsertBucketOptions();
            var settings = new BucketSettings()
            {
                Name = _bucketName
            };

            if (!_inited)
            {
                await _couchbaseCluster.Cluster.Buckets.UpsertBucketAsync(settings, options);
                _inited = true;
            }

            return await _couchbaseCluster.Cluster.BucketAsync(_bucketName);
        }
    }
}