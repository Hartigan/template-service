import { StringValue } from "google-protobuf/google/protobuf/wrappers_pb";
import { AccessModel, FolderModel, HeadModel, ProtectedItemModel } from "../../models/domain";
import { FolderId, HeadId } from "../../models/Identificators";
import { Access, ProblemSet, ProtectedItem } from "../../protobuf/domain_pb";
import { GetFoldersRequest } from "../../protobuf/folders_pb";
import { GetHeadsReply, GetHeadsRequest } from "../../protobuf/version_pb";
import Services from "../../Services";
import { FoldersService } from "../../services/FoldersService";
import { VersionService } from "../../services/VersionService";
import { ISlotData } from "../problem_sets/SlotsListView";

export async function getSlotsData(versionService: VersionService, slotsList: Array<ProblemSet.Slot.AsObject>) {
    const headIds = slotsList.flatMap(x => x.headIdsList);
    const request = new GetHeadsRequest();
    request.setHeadIdsList(headIds);
    const reply = await Services.versionService.getHeads(request);

    const fakeHead : HeadModel = {
        id: "",
        name: "No Head",
        tagsList: [],
    };
    const headsMap : Map<HeadId, HeadModel> = new Map<HeadId, HeadModel>();

    reply.getEntriesList()?.flatMap(x => {
        const entry = x.toObject()

        if (entry.status !== GetHeadsReply.Status.OK) {
            Services.logger.error(`Head entry with id = ${entry.headId} returned with status = ${entry.status}`);
        }

        if (entry.head) {
            return [ entry.head ];
        }
        else {
            return [];
        }
    }).forEach(head => {
        headsMap[head.id] = head;
    });

    return slotsList.map(slot => {
        return {
            heads: slot.headIdsList.map(headId => headsMap[headId] ?? fakeHead)
        } as ISlotData;
    });
}

export async function getFolders(foldersService: FoldersService, foldersIds: Array<FolderId>) {
    const request = new GetFoldersRequest();
    request.setFolderIdsList(foldersIds);
    const reply = await foldersService.getFolders(request);
    const entries = reply.getEntriesList().map(x => x.toObject());
    const folders : Array<FolderModel> = [];

    entries.forEach(entry => {
        if (entry.status !== GetHeadsReply.Status.OK) {
            Services.logger.error(`Folder entry with id = ${entry.folderId} returned with status = ${entry.status}`);
            return;
        }
        
        if (entry.folder) {
            folders.push(entry.folder);
        }
    })
    return folders;
}

export async function getHead(versionService: VersionService, headId: HeadId) {
    const request = new GetHeadsRequest();
    request.addHeadIds(headId);
    const reply = await versionService.getHeads(request);
    const entry = reply.getEntriesList().map(x => x.toObject())[0];

    if (!entry) {
        Services.logger.error(`Head entry with id = ${headId} not returned`);
        return null;
    }

    if (entry.status !== GetHeadsReply.Status.OK) {
        Services.logger.error(`Head entry with id = ${entry.headId} returned with status = ${entry.status}`);
        return null
    }

    return entry.head ?? null;
}

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