using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Stores;

namespace IdentityServer
{
    public class ClientStore : IClientStore
    {
        public static IEnumerable<Client> AllClients { get; } = new[]
        {
            new Client
            {
                ClientId = "template-service-ui-debug",
                ClientName = "Template service UI Debug",
                AllowedGrantTypes = GrantTypes.Implicit,
                RedirectUris = { "http://localhost:3000/signin-callback.html" },
                PostLogoutRedirectUris = { "http://localhost:3000/signout-callback.html" },
                AccessTokenLifetime = 60 * 60 * 24,
                AllowedScopes = 
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    JwtClaimTypes.Role,
                    "web_api"
                },
                AllowAccessTokensViaBrowser = true,
                AllowedCorsOrigins = { "http://localhost:3000" },
            },
            new Client
            {
                ClientId = "template-service-ui",
                ClientName = "Template service UI",
                AllowedGrantTypes = GrantTypes.Implicit,
                RedirectUris = { "https://quiz-gen.org/signin-callback.html" },
                PostLogoutRedirectUris = { "https://quiz-gen.org/signout-callback.html" },
                AccessTokenLifetime = 60 * 60 * 24,
                AllowedScopes = 
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    JwtClaimTypes.Role,
                    "web_api"
                },
                AllowAccessTokensViaBrowser = true,
                AllowedCorsOrigins = { "https://quiz-gen.org" },
            }
        };

        public Task<Client> FindClientByIdAsync(string clientId)
        {
            return Task.FromResult(AllClients.FirstOrDefault(c => c.ClientId == clientId));
        }
    }
}