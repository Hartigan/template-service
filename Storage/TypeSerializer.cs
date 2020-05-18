

using System;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using Couchbase.Core.IO.Serializers;
using System.Collections.Concurrent;

namespace Storage
{
    internal static class CachedTypes
    {
        private static ConcurrentDictionary<Type, bool> _types = new ConcurrentDictionary<Type, bool>();

        public static bool CheckType(Type type)
        {
            return type.Assembly.FullName.StartsWith("Couchbase") && type.Name != "QueryResultData";
        }

        public static bool IsCouchbaseInternalType(this Type type)
        {
            bool result;
            if (_types.TryGetValue(type, out result))
            {
                return result;
            }
            
            result = CheckType(type);
            _types.TryAdd(type, result);

            return result;
        }
    }

    internal static class TypeOf<T>
    {
        public static readonly Type Raw = typeof(T);
        public static readonly bool IsCouchbaseInternalType = CachedTypes.CheckType(Raw);
    }

    public class TypeSerializer : ITypeSerializer
    {
        private readonly ITypeSerializer _defaultSerializer = new DefaultSerializer(); 
        private readonly JsonSerializerOptions _options = new JsonSerializerOptions();

        public TypeSerializer()
        {
            _options.Converters.Add(new JsonFSharpConverter());
        }

        public T Deserialize<T>(ReadOnlyMemory<byte> buffer)
        {
            return TypeOf<T>.IsCouchbaseInternalType
                ? _defaultSerializer.Deserialize<T>(buffer)
                : JsonSerializer.Deserialize<T>(buffer.Span, _options);
        }

        public T Deserialize<T>(Stream stream)
        {
            if (TypeOf<T>.IsCouchbaseInternalType)
            {
                return _defaultSerializer.Deserialize<T>(stream);
            }
            Span<byte> buffer = stackalloc byte[(int)stream.Length];
            stream.Read(buffer);
            return JsonSerializer.Deserialize<T>(buffer, _options);
        }

        public ValueTask<T> DeserializeAsync<T>(Stream stream, CancellationToken cancellationToken = default)
        {
            if (TypeOf<T>.IsCouchbaseInternalType)
            {
                return _defaultSerializer.DeserializeAsync<T>(stream, cancellationToken);
            }

            return JsonSerializer.DeserializeAsync<T>(stream, _options, cancellationToken: cancellationToken);
        }

        public void Serialize(Stream stream, object obj)
        {
            if (obj.GetType().IsCouchbaseInternalType())
            {
                _defaultSerializer.Serialize(stream, obj);
                return;
            }

            using(var writer = new Utf8JsonWriter(stream))
            {
                JsonSerializer.Serialize(writer, obj, _options);
            }
        }

        public async ValueTask SerializeAsync(Stream stream, object obj, CancellationToken cancellationToken = default)
        {
            if (obj.GetType().IsCouchbaseInternalType())
            {
                await _defaultSerializer.SerializeAsync(stream, obj, cancellationToken);
                return;
            }

            await JsonSerializer.SerializeAsync(stream, obj, _options, cancellationToken: cancellationToken);
        }
    }
}
