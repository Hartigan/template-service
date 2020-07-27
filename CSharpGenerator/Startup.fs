namespace CSharpGenerator

open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Hosting
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open System.Text.Json.Serialization
open Microsoft.Extensions.Caching.Memory
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

        services
        |> fun x -> x.AddSingleton<Processor>()
        |> fun x -> x.AddSingleton<CSharpGenerator>()
        |> fun x -> x.AddSingleton<IMemoryCache, MemoryCache>()
        |> fun x -> x.AddSingleton<ISimpleValidator<IntValidatorOptions>, IntValidator>()
        |> fun x -> x.AddSingleton<ISimpleValidator<FloatValidatorOptions>, FloatValidator>()
        |> fun x -> x.AddSingleton<ISimpleValidator<StringValidatorOptions>, StringValidator>()
        |> ignore

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    member this.Configure(app: IApplicationBuilder, env: IWebHostEnvironment) =
        if (env.IsDevelopment()) then
            app.UseDeveloperExceptionPage() |> ignore

        app.UseHttpsRedirection() |> ignore
        app.UseRouting() |> ignore
        app.UseHttpMetrics() |> ignore

        app.UseAuthorization() |> ignore

        app.UseEndpoints(fun endpoints ->
            endpoints.MapControllers() |> ignore
            endpoints.MapMetrics() |> ignore
            endpoints.MapHealthChecks("/health") |> ignore
            ) |> ignore

    member val Configuration : IConfiguration = null with get, set
