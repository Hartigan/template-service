import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authReducer, IAuthContentState } from '../components/auth/AuthContentSlice';
import { createFolderDialogReducer, ICreateFolderDialogState } from '../components/files/folders/CreateFolderDialogSlice';
import { IHeadSearchState } from '../components/files/heads/BaseHeadSearchSlice';
import { editorTabHeadSearchReducer } from '../components/files/heads/EditorTabHeadSearchSlice';
import { permissionsTabHeadSearchReducer } from '../components/files/heads/PermissionsTabHeadSearchSlice';
import { editorFilePreviewReducer, IEditorFilePreviewState } from '../components/files/preview/EditorFilePreviewSlice';
import { IReportSearchState, reportSearchReducer } from '../components/files/reports/ReportSearchSlice';
import { filesToolbarReducer, IFilesToolbarState } from '../components/files/toolbar/FilesToolbarSlice';
import { IFilesTreeState } from '../components/files/tree/BaseFilesTreeSlice';
import { editorTabFilesTreeReducer } from '../components/files/tree/EditorTabFilesTreeSlice';
import { permissionsTabFilesTreeReducer } from '../components/files/tree/PermissionsTabFilesTreeSlice';
import { problemSetCreatorFilesTreeReducer } from '../components/files/tree/ProblemSetCreatorFilesTreeSlice';
import { problemSetEditorFilesTreeReducer } from '../components/files/tree/ProblemSetEditorFilesTreeSlice';
import { createGroupDialogReducer, ICreateGroupDialogState } from '../components/groups/list/CreateGroupDialogSlice';
import { groupsListViewReducer, IGroupsListViewState } from '../components/groups/list/GroupsListViewSlice';
import { groupViewReducer, IGroupViewState } from '../components/groups/view/GroupViewSlice';
import { IPermissionsViewState, permissionsViewReducer } from '../components/groups/view/PermissionsViewSlice';
import { createProblemDialogReducer, ICreateProblemDialogState } from '../components/problems/dialog/CreateProblemDialogSlice';
import { ITestProblemDialogState, testProblemDialogReducer } from '../components/problems/dialog/TestProblemDialogSlice';
import { IProblemEditorState, problemEditorReducer } from '../components/problems/editor/ProblemEditorSlice';
import { createProblemSetDialogReducer, ICreateProblemSetDialogState } from '../components/problem_sets/dialogs/CreateProblemSetDialogSlice';
import { editProblemSetDialogReducer, IEditProblemSetDialogState } from '../components/problem_sets/dialogs/EditProblemSetDialogSlice';
import { IProblemSetEditorState } from '../components/problem_sets/editor/BaseProblemSetEditorSlice';
import { problemSetCreatorReducer } from '../components/problem_sets/editor/ProblemSetCreatorSlice';
import { problemSetEditorReducer } from '../components/problem_sets/editor/ProblemSetEditorSlice';
import { IProblemSetPreviewState, problemSetPreviewReducer } from '../components/problem_sets/preview/ProblemSetPreviewSlice';
import { editorTabReducer, IEditorTabState } from '../components/tabs/editor/EditorTabSlice';
import { groupsTabReducer, IGroupsTabState } from '../components/tabs/groups/GroupsTabSlice';
import { IPermissionsTabState, permissionsTabReducer } from '../components/tabs/permissions/PermissionsTabSlice';
import { IReportsTabState, reportsTabReducer } from '../components/tabs/reports/ReportsTabSlice';
import { ITrainTabState, trainTabReducer } from '../components/tabs/train/TrainTabSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        reports: reportsTabReducer,
        train: trainTabReducer,
        groups: combineReducers({
            root: groupsTabReducer,
            list: groupsListViewReducer,
            view: groupViewReducer,
            createGroup: createGroupDialogReducer,
        }),
        editor: combineReducers({
            root: editorTabReducer,
            filesToolbar: filesToolbarReducer,
            createFolder: combineReducers({
                dialog: createFolderDialogReducer,
            }),
            createProblem: combineReducers({
                dialog: createProblemDialogReducer,
            }),
            createProblemSet: combineReducers({
                dialog: createProblemSetDialogReducer,
                creator: problemSetCreatorReducer,
                filesTree: problemSetCreatorFilesTreeReducer,
            }),
            filesTree: editorTabFilesTreeReducer,
            heads: editorTabHeadSearchReducer,
            preview: combineReducers({
                preview: editorFilePreviewReducer,
                problemSet: problemSetPreviewReducer,
                problem: problemEditorReducer,
                testDialog: testProblemDialogReducer,
            }),
            editProblemSet: combineReducers({
                dialog: editProblemSetDialogReducer,
                editor: problemSetEditorReducer,
                filesTree: problemSetEditorFilesTreeReducer
            }),
        }),
        permissions: combineReducers({
            root: permissionsTabReducer,
            filesTree: permissionsTabFilesTreeReducer,
            reports: reportSearchReducer,
            heads: permissionsTabHeadSearchReducer,
            view: permissionsViewReducer,
        })
    }
});

export interface IAppState {
    auth: IAuthContentState;
    reports: IReportsTabState;
    train: ITrainTabState;
    groups: {
        root: IGroupsTabState;
        list: IGroupsListViewState;
        createGroup: ICreateGroupDialogState;
        view: IGroupViewState;
    },
    editor: {
        root: IEditorTabState;
        filesToolbar: IFilesToolbarState;
        filesTree: IFilesTreeState;
        heads: IHeadSearchState;
        createFolder: {
            dialog: ICreateFolderDialogState;
        },
        createProblem: {
            dialog: ICreateProblemDialogState;
        };
        createProblemSet: {
            dialog: ICreateProblemSetDialogState,
            creator: IProblemSetEditorState,
            filesTree: IFilesTreeState,
        };
        preview: {
            preview: IEditorFilePreviewState;
            problemSet: IProblemSetPreviewState;
            problem: IProblemEditorState;
            testDialog: ITestProblemDialogState;
        };
        editProblemSet: {
            dialog: IEditProblemSetDialogState;
            editor: IProblemSetEditorState;
            filesTree: IFilesTreeState;
        };
    },
    permissions: {
        root: IPermissionsTabState;
        filesTree: IFilesTreeState;
        reports: IReportSearchState;
        heads: IHeadSearchState;
        view: IPermissionsViewState;
    }
}

export const authSelector = (state: IAppState) : IAuthContentState => state.auth;
export const reportsTabSelector = (state: IAppState) : IReportsTabState => state.reports;
export const trainTabSelector = (state: IAppState) : ITrainTabState => state.train;
export const editorTabSelector = (state: IAppState) : IEditorTabState => state.editor.root;
export const filesToolbarSelector = (state: IAppState) : IFilesToolbarState => state.editor.filesToolbar;
export const editorTabFilesTreeSelector = (state: IAppState) : IFilesTreeState => state.editor.filesTree;
export const editorTabHeadSearchSelector = (state: IAppState) : IHeadSearchState => state.editor.heads;
export const editorFilePreviewSelector = (state: IAppState) : IEditorFilePreviewState => state.editor.preview.preview;
export const createFolderDialogSelector = (state: IAppState) : ICreateFolderDialogState => state.editor.createFolder.dialog;
export const permissionsTabFilesTreeSelector = (state: IAppState) : IFilesTreeState => state.permissions.filesTree;
export const permissionsReportsSelector = (state: IAppState) : IReportSearchState => state.permissions.reports;
export const permissionsTabHeadSearchSelector = (state: IAppState) : IHeadSearchState => state.permissions.heads;
export const permissionsTabSelector = (state: IAppState) : IPermissionsTabState => state.permissions.root;
export const permissionsViewSelector = (state: IAppState) : IPermissionsViewState => state.permissions.view;
export const problemSetCreateDialogSelector = (state: IAppState) : ICreateProblemSetDialogState => state.editor.createProblemSet.dialog;
export const problemCreateDialogSelector = (state: IAppState) : ICreateProblemDialogState => state.editor.createProblem.dialog;
export const problemSetCreatorFilesTreeSelector = (state: IAppState) : IFilesTreeState => state.editor.createProblemSet.filesTree;
export const problemSetCreatorSelector = (state: IAppState) : IProblemSetEditorState => state.editor.createProblemSet.creator;
export const problemSetEditDialogSelector = (state: IAppState) : IEditProblemSetDialogState => state.editor.editProblemSet.dialog;
export const problemSetEditorFilesTreeSelector = (state: IAppState) : IFilesTreeState => state.editor.editProblemSet.filesTree;
export const problemSetEditorSelector = (state: IAppState) : IProblemSetEditorState => state.editor.editProblemSet.editor;
export const problemSetPreviewSelector = (state: IAppState) : IProblemSetPreviewState => state.editor.preview.problemSet; 
export const groupsTabSelector = (state: IAppState) : IGroupsTabState => state.groups.root;
export const groupsListSelector = (state: IAppState) : IGroupsListViewState => state.groups.list;
export const createGroupDialogSelector = (state: IAppState) : ICreateGroupDialogState => state.groups.createGroup;
export const groupViewSelector = (state: IAppState) : IGroupViewState => state.groups.view;
export const problemEditorSelector = (state: IAppState) : IProblemEditorState => state.editor.preview.problem;
export const testProblemDialogSelector = (state: IAppState) : ITestProblemDialogState => state.editor.preview.testDialog;