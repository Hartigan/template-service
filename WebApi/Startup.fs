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
open Microsoft.AspNetCore.Authentication
open Models.Authentication
open Storage
open Contexts
open System.IdentityModel.Tokens.Jwt

type Startup private () =
    new (configuration: IConfiguration) as this =
        Startup() then
        this.Configuration <- configuration

    // This method gets called by the runtime. Use this method to add services to the container.
    member this.ConfigureServices(services: IServiceCollection) =
        // Add framework services.
        services.AddControllers() |> ignore

        JwtSecurityTokenHandler.DefaultMapInboundClaims <- false

        services.AddAuthentication(fun options ->
                options.DefaultScheme <- "Cookies"
                options.DefaultChallengeScheme <- "oidc"
            )
        |> fun x -> x.AddCookie("Cookies")
        |> fun x -> x.AddOpenIdConnect("oidc", fun options ->
                options.Authority <- "http://identity"
                options.RequireHttpsMetadata <- false;
                options.ClientId <- "WebApi";
                options.ClientSecret <- "secret";
                options.ResponseType <- "code";
                options.SaveTokens <- true;
            )
        |> ignore

        services.Configure<CouchbaseConfig>(this.Configuration.GetSection("Couchbase"))
        |> fun x -> x.AddSingleton<CouchbaseCluster>()
        |> fun x -> x.AddSingleton<CouchbaseBuckets>()
        |> fun x -> x.AddSingleton<UserContext>()
        |> fun x -> x.AddSingleton<UserRoleContext>()
        |> ignore

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    member this.Configure(app: IApplicationBuilder, env: IWebHostEnvironment) =
        app.UseHttpsRedirection() |> ignore
        app.UseRouting() |> ignore

        app.UseAuthentication() |> ignore
        app.UseAuthorization() |> ignore

        app.UseEndpoints(fun endpoints ->
            endpoints.MapControllers()
            |> fun x -> x.RequireAuthorization()
            |> ignore
            )
        |> ignore

    member val Configuration : IConfiguration = null with get, set
