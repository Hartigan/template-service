using System.Threading.Tasks;
using Couchbase;

namespace Storage
{
    internal interface IBucketInitializer
    {
        Task<IBucket> GetOrCreate();
    }
}