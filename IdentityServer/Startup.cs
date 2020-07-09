using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Storage;
using Contexts;
using DatabaseTypes;
using Models.Authentication;
using Microsoft.AspNetCore.Authentication;
using IdentityServer4.Stores;
using IdentityServer4.Services;
using Microsoft.AspNetCore.HttpOverrides;
using Prometheus;
using System.Net;

namespace IdentityServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRazorPages();
            services.AddMvc();

            services.AddHealthChecks()
                .ForwardToPrometheus();

            services.Configure<CouchbaseConfig>(this.Configuration.GetSection("Couchbase"))
                    .AddSingleton<CouchbaseCluster>()
                    .AddSingleton<CouchbaseBuckets>()
                    .AddSingleton<IUserContext, UserContext>()
                    .AddSingleton<IContext<UserGroups>, UserGroupsContext>()
                    .AddSingleton<IContext<UserItems>, UserItemsContext>()
                    .AddSingleton<IContext<Trash>, TrashContext>()
                    .AddSingleton<IUserRoleContext, UserRoleContext>();

            services.AddOidcStateDataFormatterCache();

            services.AddIdentity<UserIdentity, RoleIdentity>()
                .AddRoleStore<RoleStore>()
                .AddUserStore<UserStore>();

            services.AddSingleton<IClientStore, ClientStore>();

            services.AddSingleton<ICorsPolicyService, CorsPolicyService>();

            services.AddIdentityServer()
                    .AddDeveloperSigningCredential()
                    .AddInMemoryApiResources(Config.ApiResources)
                    .AddInMemoryIdentityResources(Config.IdentityResources)
                    .AddAspNetIdentity<UserIdentity>();
            services.AddAuthentication()
                    .AddIdentityServerJwt();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();

                ForwardedHeadersOptions forwardedHeadersOptions = new ForwardedHeadersOptions
                {
                    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
                    KnownProxies = { IPAddress.Parse("10.5.0.7") }
                };

                app.UseForwardedHeaders(forwardedHeadersOptions);
            }

            app.UseHttpsRedirection();

            app.UseStaticFiles();
            app.UseRouting();
            app.UseHttpMetrics();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseIdentityServer();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
                endpoints.MapMetrics();
                endpoints.MapHealthChecks("/health");
            });
        }
    }
}
