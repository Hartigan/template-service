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

type Int32Converter<'T>(toInt32: 'T -> int32, fromInt32: int32 -> 'T) =
    inherit JsonConverter<'T>()
        override this.Write(writer: Utf8JsonWriter, value: 'T, options: JsonSerializerOptions) =
            writer.WriteNumberValue(toInt32(value))

        override this.Read(reader: byref<Utf8JsonReader>, typeToConvert: Type, options: JsonSerializerOptions) =
            fromInt32(reader.GetInt32())

type UInt32Converter<'T>(toUInt32: 'T -> uint32, fromUInt32: uint32 -> 'T) =
    inherit JsonConverter<'T>()
        override this.Write(writer: Utf8JsonWriter, value: 'T, options: JsonSerializerOptions) =
            writer.WriteNumberValue(toUInt32(value))

        override this.Read(reader: byref<Utf8JsonReader>, typeToConvert: Type, options: JsonSerializerOptions) =
            fromUInt32(reader.GetUInt32())
