import { connect } from 'react-redux';
import { HeadId, ReportId, SubmissionId, UserId } from '../../../models/Identificators';
import { SearchInterval } from '../../../models/SearchInterval';
import { IAppState, trainTabSelector } from '../../../store/Store';
import TrainTab, { ITrainTabActions, ITrainTabParameters } from './TrainTab';
import { closeSubmission, fetchProblemSets, fetchSubmissions, openSubmission, startSubmission, updateAdvanced, updateAuthor, updateIsPublic, updateLimit, updatePage, updatePattern, updateProblemsCount, updateDuration, updateTags, openReport, closeReport } from "./TrainTabSlice";

const mapStateToProps = (state: IAppState) : ITrainTabParameters => {
    const localState = trainTabSelector(state); 
    return {
        ...localState
    };
};

const mapDispatchToProps = (dispatch): ITrainTabActions => {
    return {
        fetchSubmissions: () => dispatch(fetchSubmissions()),
        openSubmission: (id: SubmissionId) => dispatch(openSubmission(id)),
        startSubmission: (headId: HeadId) => dispatch(startSubmission(headId)),
        fetchProblemSets: (params: {
            isPublic: boolean,
            pattern: string | null,
            tags: Array<string> | null,
            authorId: UserId | null,
            problemsCount: SearchInterval<number> | null,
            duration: SearchInterval<number> | null,
            offset: number,
            limit: number 
        }) => dispatch(fetchProblemSets({...params})),
        updatePattern: (pattern: string) => dispatch(updatePattern(pattern)),
        updateAuthor: (userId: UserId | null) => dispatch(updateAuthor(userId)),
        updateIsPublic: (isPublic: boolean) => dispatch(updateIsPublic(isPublic)),
        updateTags: (tags: Array<string>) => dispatch(updateTags(tags)),
        updateAdvanced: (isAdvanced: boolean) => dispatch(updateAdvanced(isAdvanced)),
        updateProblemsCount: (countInterval: SearchInterval<number> | null) => dispatch(updateProblemsCount(countInterval)),
        updateDuration: (durationInterval: SearchInterval<number> | null) => dispatch(updateDuration(durationInterval)),
        updatePage: (index: number) => dispatch(updatePage(index)),
        updateLimit: (limit: number) => dispatch(updateLimit(limit)),
        closeSubmission: () => dispatch(closeSubmission()),
        openReport: (id: ReportId) => dispatch(openReport(id)),
        closeReport: () => dispatch(closeReport()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainTab);