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
open DatabaseTypes
open Storage
open Contexts
open System.IdentityModel.Tokens.Jwt
open Microsoft.AspNetCore.Authentication.JwtBearer
open Services.Folders
open Services.Permissions
open Services.VersionControl
open Services.Examination
open Services.Problems
open Services.Admin
open System.Text.Json.Serialization
open Prometheus

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

        services.AddHealthChecks()
        |> fun x -> x.ForwardToPrometheus()
        |> ignore

        let authConfig = this.Configuration.GetSection("Authentication").Get<AuthenticationSettings>()

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        |> fun x -> x.AddJwtBearer(fun options ->
            options.Authority <- authConfig.Authority
            options.Audience <- authConfig.Audience
            options.RequireHttpsMetadata <- authConfig.UseHttps
        )
        |> ignore

        services.Configure<CouchbaseConfig>(this.Configuration.GetSection("Couchbase"))
        |> fun x -> x.Configure<GeneratorsOptions>(this.Configuration.GetSection("Generators"))
        |> fun x -> x.AddHttpClient()
        |> fun x -> x.AddSingleton<CouchbaseCluster>()
        |> fun x -> x.AddSingleton<CouchbaseBuckets>()
        |> fun x -> x.AddSingleton<IContext<Folder>, FolderContext>()
        |> fun x -> x.AddSingleton<IHeadContext, HeadContext>()
        |> fun x -> x.AddSingleton<IUserContext, UserContext>()
        |> fun x -> x.AddSingleton<IUserRoleContext, UserRoleContext>()
        |> fun x -> x.AddSingleton<IReportContext, ReportContext>()
        |> fun x -> x.AddSingleton<IContext<Submission>, SubmissionContext>()
        |> fun x -> x.AddSingleton<IContext<Commit>, CommitContext>()
        |> fun x -> x.AddSingleton<IContext<Problem>, ProblemContext>()
        |> fun x -> x.AddSingleton<IContext<ProblemSet>, ProblemSetContext>()
        |> fun x -> x.AddSingleton<IContext<GeneratedProblem>, GeneratedProblemContext>()
        |> fun x -> x.AddSingleton<IContext<GeneratedProblemSet>, GeneratedProblemSetContext>()
        |> fun x -> x.AddSingleton<IContext<UserGroups>, UserGroupsContext>()
        |> fun x -> x.AddSingleton<IContext<UserItems>, UserItemsContext>()
        |> fun x -> x.AddSingleton<IContext<GroupItems>, GroupItemsContext>()
        |> fun x -> x.AddSingleton<IContext<Trash>, TrashContext>()
        |> fun x -> x.AddSingleton<IGroupContext, GroupContext>()
        |> fun x -> x.AddSingleton<IPermissionsContext, PermissionsContext>()
        |> fun x -> x.AddSingleton<IUserService, UserService>()
        |> fun x -> x.AddSingleton<IFoldersService, FoldersService>()
        |> fun x -> x.AddSingleton<IPermissionsService, PermissionsService>()
        |> fun x -> x.AddSingleton<IVersionControlService, VersionControlService>()
        |> fun x -> x.AddSingleton<IExaminationService, ExaminationService>()
        |> fun x -> x.AddSingleton<IGeneratorService, GeneratorService>()
        |> fun x -> x.AddSingleton<IViewFormatter, ViewFormatter>()
        |> fun x -> x.AddSingleton<IProblemsService, ProblemsService>()
        |> fun x -> x.AddSingleton<IGroupService, GroupService>()
        |> fun x -> x.AddSingleton<IReportSearch, ReportSearch>()
        |> fun x -> x.AddSingleton<IHeadSearch, HeadSearch>()
        |> fun x -> x.AddSingleton<IAdminService, AdminService>()
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
        app.UseHttpMetrics() |> ignore
        app.UseCors("_allowAll") |> ignore

        app.UseAuthentication() |> ignore
        app.UseAuthorization() |> ignore

        app.UseEndpoints(fun endpoints ->
            endpoints.MapControllers()
            |> fun x -> x.RequireAuthorization()
            |> ignore
            endpoints.MapMetrics() |> ignore
            endpoints.MapHealthChecks("/health") |> ignore
            )
        |> ignore

    member val Configuration : IConfiguration = null with get, set
