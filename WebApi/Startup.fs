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
open Microsoft.AspNetCore.Authentication.JwtBearer
open Services.Folders
open Services.Permissions
open Services.VersionControl
open Services.Examination
open Services.Problems
open System.Text.Json.Serialization

type Startup private () =
    new (configuration: IConfiguration) as this =
        Startup() then
        this.Configuration <- configuration

    // This method gets called by the runtime. Use this method to add services to the container.
    member this.ConfigureServices(services: IServiceCollection) =
        // Add framework services.
        services.AddControllers()
        |> fun x -> x.AddJsonOptions(fun options ->
                options.JsonSerializerOptions.Converters.Add(JsonFSharpConverter()))
        |> ignore

        let authConfig = this.Configuration.GetSection("Authentication").Get<AuthenticationSettings>()

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        |> fun x -> x.AddJwtBearer(fun options ->
            options.Authority <- authConfig.Authority
            options.Audience <- authConfig.Audience
            options.RequireHttpsMetadata <- false
        )
        |> ignore

        services.Configure<CouchbaseConfig>(this.Configuration.GetSection("Couchbase"))
        |> fun x -> x.AddSingleton<CouchbaseCluster>()
        |> fun x -> x.AddSingleton<CouchbaseBuckets>()
        |> fun x -> x.AddSingleton<FolderContext>()
        |> fun x -> x.AddSingleton<HeadContext>()
        |> fun x -> x.AddSingleton<UserContext>()
        |> fun x -> x.AddSingleton<UserRoleContext>()
        |> fun x -> x.AddSingleton<ReportContext>()
        |> fun x -> x.AddSingleton<SubmissionContext>()
        |> fun x -> x.AddSingleton<CommitContext>()
        |> fun x -> x.AddSingleton<ProblemContext>()
        |> fun x -> x.AddSingleton<ProblemSetContext>()
        |> fun x -> x.AddSingleton<GeneratedProblemContext>()
        |> fun x -> x.AddSingleton<GeneratedProblemSetContext>()
        |> fun x -> x.AddSingleton<IFoldersService, FoldersService>()
        |> fun x -> x.AddSingleton<IPermissionsService, PermissionsService>()
        |> fun x -> x.AddSingleton<IVersionControlService, VersionControlService>()
        |> fun x -> x.AddSingleton<IExaminationService, ExaminationService>()
        |> fun x -> x.AddSingleton<IGeneratorService, GeneratorService>()
        |> fun x -> x.AddSingleton<IViewFormatter, ViewFormatter>()
        |> fun x -> x.AddSingleton<IProblemsService, ProblemsService>()
        |> fun x -> x.AddCors(fun options -> 
                options.AddPolicy("_allowAll", fun builder ->
                        builder.WithOrigins("*")
                        |> fun x -> x.AllowAnyHeader()
                        |> ignore
                    )
            )
        |> ignore

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    member this.Configure(app: IApplicationBuilder, env: IWebHostEnvironment) =
        app.UseHttpsRedirection() |> ignore
        app.UseRouting() |> ignore
        app.UseCors("_allowAll") |> ignore

        app.UseAuthentication() |> ignore
        app.UseAuthorization() |> ignore

        app.UseEndpoints(fun endpoints ->
            endpoints.MapControllers()
            |> fun x -> x.RequireAuthorization()
            |> ignore
            )
        |> ignore

    member val Configuration : IConfiguration = null with get, set
