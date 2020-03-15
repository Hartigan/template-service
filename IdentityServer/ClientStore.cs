using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
                ClientId = "react-ui",
                ClientName = "React UI",
                AllowedGrantTypes = GrantTypes.Implicit,
                RedirectUris = { "http://localhost:3000/signin-callback.html" },
                AccessTokenLifetime = 60 * 60 * 24,
                AllowedScopes = 
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    "web_api"
                },
                AllowAccessTokensViaBrowser = true,
                AllowedCorsOrigins = { "http://localhost:3000"},
            }
        };

        public Task<Client> FindClientByIdAsync(string clientId)
        {
            return Task.FromResult(AllClients.FirstOrDefault(c => c.ClientId == clientId));
        }
    }
}