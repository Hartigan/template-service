
namespace Utils

open System
open System.Text.Json.Serialization
open System.Text.Json

type OptionValueConverter<'T>() =
    inherit JsonConverter<'T option>()

    override this.Read (reader: byref<Utf8JsonReader>, _typ: Type, options: JsonSerializerOptions) =
        match reader.TokenType with
        | JsonTokenType.Null -> None
        | _ -> Some <| JsonSerializer.Deserialize<'T>(&reader, options)

    override this.Write (writer: Utf8JsonWriter, value: 'T option, options: JsonSerializerOptions) =
        match value with
        | None -> writer.WriteNullValue ()
        | Some value -> JsonSerializer.Serialize(writer, value, options)