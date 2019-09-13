using System;
using System.Threading.Tasks;
using Couchbase;

namespace Storage
{
    public class CouchbaseBuckets
    {
        private readonly CouchbaseCluster _cluster;
        private readonly IBucketInitializer _userBucket;
        private readonly IBucketInitializer _codeBucket;
        private readonly IBucketInitializer _templateBucket;
        private readonly IBucketInitializer _versionBucket;
        private readonly IBucketInitializer _headBucket;
        private readonly IBucketInitializer _groupBucket;

        public CouchbaseBuckets(
            CouchbaseCluster cluster
        )
        {
            _cluster = cluster;
            _userBucket = new DefaultBucketInitializer(cluster, "user");
            _codeBucket = new DefaultBucketInitializer(cluster, "code");
            _templateBucket = new DefaultBucketInitializer(cluster, "template");
            _versionBucket = new DefaultBucketInitializer(cluster, "version");
            _headBucket = new DefaultBucketInitializer(cluster, "head");
            _groupBucket = new DefaultBucketInitializer(cluster, "group");
        }

        public Task<IBucket> GetUserBucket() => _userBucket.GetOrCreate();

        public Task<IBucket> GetCodeBucket() => _codeBucket.GetOrCreate();

        public Task<IBucket> GetTemplateBucket() => _templateBucket.GetOrCreate();

        public Task<IBucket> GetVersionBucket() => _versionBucket.GetOrCreate();

        public Task<IBucket> GetHeadBucket() => _headBucket.GetOrCreate();

        public Task<IBucket> GetGroupBucket() => _groupBucket.GetOrCreate();
    }
}