namespace WebApi

open System
open System.Collections.Generic
open System.Linq
open System.Threading.Tasks
open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Hosting
open Microsoft.AspNetCore.HttpsPolicy;
open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Microsoft.AspNetCore.Identity
open Microsoft.Extensions.Configuration
open Models.Authentication
open Storage

type Startup private () =
    new (configuration: IConfiguration) as this =
        Startup() then
        this.Configuration <- configuration

    // This method gets called by the runtime. Use this method to add services to the container.
    member this.ConfigureServices(services: IServiceCollection) =
        // Add framework services.
        services.AddControllers() |> ignore

        services.AddIdentity<UserIdentity, RoleIdentity>()
        |> fun x -> x.AddDefaultTokenProviders()
        |> ignore

        services.AddTransient<IUserStore<UserIdentity>, UserStore>()
        |> ignore
        
        services.AddTransient<IRoleStore<RoleIdentity>, RoleStore>()
        |> ignore

        services.Configure<CouchbaseConfig>(this.Configuration.GetSection("Couchbase"))
        |> ignore

        services.AddSingleton<CouchbaseCluster>()
        |> ignore

        services.AddSingleton<CouchbaseBuckets>()
        |> ignore

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    member this.Configure(app: IApplicationBuilder, env: IWebHostEnvironment) =
        if (env.IsDevelopment()) then
            app.UseDeveloperExceptionPage() |> ignore

        app.UseHttpsRedirection() |> ignore
        app.UseRouting() |> ignore

        app.UseAuthorization() |> ignore

        app.UseEndpoints(fun endpoints ->
            endpoints.MapControllers() |> ignore
            ) |> ignore

    member val Configuration : IConfiguration = null with get, set
