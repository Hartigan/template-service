using System.Threading.Tasks;
using Couchbase;
using Couchbase.Management;

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
            var options = new BucketManagerOptions();

            if (!_inited)
            {
                await _couchbaseCluster.Cluster.Buckets.Upsert(_bucketName, options);
                _inited = true;
            }
            
            return await _couchbaseCluster.Cluster.Bucket(_bucketName);
        }
    }
}