using System.Threading.Tasks;
using IdentityServer4.Services;

namespace IdentityServer
{
    public class CorsPolicyService : ICorsPolicyService
    {
        public Task<bool> IsOriginAllowedAsync(string origin)
        {
            return Task.FromResult(true);
        }
    }
}