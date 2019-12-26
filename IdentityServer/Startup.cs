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
using Models.Authentication;
using Microsoft.AspNetCore.Authentication;
using IdentityServer4.Stores;
using IdentityServer4.Services;

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

            services.Configure<CouchbaseConfig>(this.Configuration.GetSection("Couchbase"))
                    .AddSingleton<CouchbaseCluster>()
                    .AddSingleton<CouchbaseBuckets>()
                    .AddSingleton<UserContext>()
                    .AddSingleton<UserRoleContext>();

            services.AddOidcStateDataFormatterCache();

            services.AddIdentity<UserIdentity, RoleIdentity>()
                .AddRoleStore<RoleStore>()
                .AddUserStore<UserStore>();

            services.AddSingleton<IClientStore, ClientStore>();

            services.AddSingleton<ICorsPolicyService, CorsPolicyService>();

            services.AddIdentityServer(options => { 
                        options.IssuerUri = "https://issuer";
                    })
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
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseIdentityServer();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
            });
        }
    }
}
