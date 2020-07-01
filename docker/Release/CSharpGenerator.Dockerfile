FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /build

# Copy everything else and build
COPY ./ ./
RUN dotnet restore
RUN dotnet publish ./CSharpGenerator/CSharpGenerator.fsproj -c Release --no-restore -o out /property:GenerateFullPaths=true

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 as runtime
WORKDIR /app

COPY --from=build-env /build/out .

ENTRYPOINT ["dotnet", "CSharpGenerator.dll"]
