import { StringValue } from "google-protobuf/google/protobuf/wrappers_pb";
import { AccessModel, ProtectedItemModel } from "../../models/domain";
import { Access, ProtectedItem } from "../../protobuf/domain_pb";

export function tryMap<TIn, TOut>(o: TIn | null | undefined, mapper: (obj: TIn) => TOut) {
    if (!o) {
        return undefined;
    }
    return mapper(o);
}

export function toStringValue(x: string | null | undefined) {
    if (!x) {
        return undefined;
    }

    const result = new StringValue();
    result.setValue(x);
    return result;
}

export function tryCreateAccess(x: AccessModel | null | undefined) {
    if (!x) {
        return undefined;
    }

    return tryMap(x, y => {
        const access = new Access();
        access.setAdmin(y.admin);
        access.setRead(y.read);
        access.setWrite(y.write);
        access.setGenerate(y.generate);
        return access;
    })
}

export function tryCreateProtectedItem(x: ProtectedItemModel | null) {
    return tryMap(x, y => {
        const result = new ProtectedItem();
        result.setId(y.id);
        result.setType(y.type);
        return result;
    })
}