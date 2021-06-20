FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build-env
WORKDIR /build

# Copy everything else and build
COPY ./ ./
RUN dotnet restore
RUN dotnet publish ./WebApi/WebApi.fsproj -c Release --no-restore -o out /property:GenerateFullPaths=true

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:5.0 as runtime
WORKDIR /app

COPY --from=build-env /build/out .

ENTRYPOINT ["dotnet", "WebApi.dll"]
