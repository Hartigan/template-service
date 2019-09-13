FROM microsoft/dotnet:2.2-sdk AS build-env
WORKDIR /build

# Copy everything else and build
COPY ./ ./
RUN dotnet restore
RUN dotnet publish ./Api/Api.csproj -c Debug -o out /property:GenerateFullPaths=true

# Build runtime image
FROM microsoft/dotnet:2.2-aspnetcore-runtime as runtime
WORKDIR /app

RUN apt update && \
    apt install -y procps unzip && \
    curl -sSL https://aka.ms/getvsdbgsh | /bin/sh /dev/stdin -v latest -l /vsdbg

COPY --from=build-env /build/Api/out .

ENTRYPOINT ["dotnet", "Api.dll"]
