using System.Collections.Generic;
using IdentityModel;
using IdentityServer4.Models;

namespace IdentityServer
{
    public static class Config
    {
        public static IEnumerable<ApiResource> ApiResources { get; } = new[]
            {
                new ApiResource(
                    "web_api",
                    "My API Set #1",
                    new[] { JwtClaimTypes.Subject }
                )
            };

        public static IEnumerable<IdentityResource> IdentityResources { get; } = new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile()
            };
    }
}