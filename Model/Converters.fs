namespace Models.Converters

open System
open System.Text.Json.Serialization
open System.Text.Json

type StringConverter<'T>(toString: 'T -> string, fromString: string -> 'T) =
    inherit JsonConverter<'T>()
        override this.Write(writer: Utf8JsonWriter, value: 'T, options: JsonSerializerOptions) =
            writer.WriteStringValue(toString(value))

        override this.Read(reader: byref<Utf8JsonReader>, typeToConvert: Type, options: JsonSerializerOptions) =
            fromString(reader.GetString())
