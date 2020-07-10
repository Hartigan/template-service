using System.Threading.Tasks;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Stores;
using Microsoft.Extensions.Options;

namespace IdentityServer
{
    public class ClientStore : IClientStore
    {
        private readonly Client _client;

        public ClientStore(IOptions<ClientConfig> config)
        {
            _client = new Client
            {
                ClientId = config.Value.Id,
                ClientName = config.Value.Name,
                AllowedGrantTypes = GrantTypes.Implicit,
                RedirectUris = { config.Value.BaseUrl + "/signin-callback.html" },
                PostLogoutRedirectUris = { config.Value.BaseUrl + "/signout-callback.html" },
                AccessTokenLifetime = 60 * 60 * 24,
                AllowedScopes =
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    JwtClaimTypes.Role,
                    "web_api"
                },
                AllowAccessTokensViaBrowser = true,
                AllowedCorsOrigins = { config.Value.BaseUrl },
            };
        }

        public Task<Client> FindClientByIdAsync(string clientId)
        {
            return Task.FromResult(clientId == _client.ClientId ? _client : null);
        }
    }
}