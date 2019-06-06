FROM microsoft/dotnet:2.2-sdk AS build-env
WORKDIR /Api

# Copy everything else and build
COPY ./Api/ ./
RUN dotnet restore
RUN dotnet publish -c Debug -o out

# Build runtime image
FROM microsoft/dotnet:2.2-aspnetcore-runtime as runtime
WORKDIR /app

COPY --from=build-env /Api/out .
ENTRYPOINT ["dotnet", "Api.dll"]
