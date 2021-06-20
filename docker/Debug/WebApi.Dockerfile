FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build-env
WORKDIR /build

# Copy everything else and build
COPY ./ ./
RUN dotnet restore
RUN dotnet publish ./WebApi/WebApi.fsproj -c Debug -o out /property:GenerateFullPaths=true

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:5.0 as runtime
WORKDIR /app

RUN apt update && \
    apt install -y procps unzip && \
    curl -sSL https://aka.ms/getvsdbgsh | /bin/sh /dev/stdin -v latest -l /vsdbg

COPY --from=build-env /build/out .

ENTRYPOINT ["dotnet", "WebApi.dll"]
