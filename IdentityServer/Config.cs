using System.Collections.Generic;
using IdentityModel;
using IdentityServer4.Models;

namespace IdentityServer
{
    public static class Config
    {
        public static IEnumerable<ApiResource> ApiResources => new[]
            {
                new ApiResource(
                    "myAPIs",
                    "My API Set #1",
                    new[] { JwtClaimTypes.Name, JwtClaimTypes.Role }
                )
            };
    }
}