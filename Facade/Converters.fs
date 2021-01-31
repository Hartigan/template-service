namespace Facade

open Domain
open System
open DatabaseTypes.Identificators

type BackConverter private () =
    static member Convert(o: DateInterval) : Contexts.SearchInterval<DateTimeOffset> =
        {
            From = DateTimeOffset(o.Start, TimeSpan())
            To = DateTimeOffset(o.End, TimeSpan())
        }

    static member Convert(o: UInt32Interval) : Contexts.SearchInterval<uint32> =
        {
            From = o.Start
            To = o.End
        }

    static member Convert(o: Int32Interval) : Contexts.SearchInterval<int32> =
        {
            From = o.Start
            To = o.End
        }

    static member Convert(o: Access) : Models.Permissions.AccessModel =
        {
            Generate = o.Generate
            Read = o.Read
            Write = o.Write
            Admin = o.Admin
        }

    static member Convert(o: ProtectedItem) : option<Models.Permissions.ProtectedId> =
        match o with
        | null -> None
        | item ->
            match o.Type with
            | ProtectedItem.Types.ProtectedType.Folder -> Some(Models.Permissions.ProtectedId.Folder(FolderId(item.Id)))
            | ProtectedItem.Types.ProtectedType.Head -> Some(Models.Permissions.ProtectedId.Head(HeadId(item.Id)))
            | ProtectedItem.Types.ProtectedType.Submission -> Some(Models.Permissions.ProtectedId.Submission(SubmissionId(item.Id)))
            | ProtectedItem.Types.ProtectedType.Report -> Some(Models.Permissions.ProtectedId.Report(ReportId(item.Id)))
            | _ -> None

    static member Convert(o: ProblemSet) : option<Models.Problems.ProblemSetModel> =
        match o with
        | null -> None
        | problemSet ->
            Some({
                Models.Problems.ProblemSetModel.Id = ProblemSetId(problemSet.Id)
                Title = Models.Problems.ProblemSetTitle(problemSet.Title)
                Duration = Models.Problems.DurationModel(TimeSpan.FromSeconds(float problemSet.DurationS))
                Slots =
                    problemSet.Slots
                    |> Seq.map(fun slot -> {
                        Models.Problems.ProblemSlotModel.Heads =
                            slot.HeadIds
                            |> Seq.map(fun headId -> HeadId(headId))
                            |> List.ofSeq
                    })
                    |> List.ofSeq
            })

    static member Convert(o: Problem) : option<Models.Problems.ProblemModel> =
        match o with
        | null -> None
        | p ->
            match (BackConverter.Convert(p.View), BackConverter.Convert(p.Controller), BackConverter.Convert(p.Validator)) with
            | (Some(view), Some(controller), Some(validator)) ->
                Some({
                    Models.Problems.ProblemModel.Id = ProblemId(p.Id)
                    Title = Models.Problems.ProblemTitle(p.Title)
                    View = view
                    Controller = controller
                    Validator = validator
                })
            | _ -> None

    static member Convert(o: View) : option<Models.Problems.ViewModel> =
        match o with
        | null -> None
        | p ->
            let content = Models.Code.ContentModel(o.Content)
            match o.Language with
            | View.Types.Language.Markdown ->
                Some({
                    Language = Models.Problems.ViewLanguageModel.Create(Models.Problems.ViewLanguage.Markdown)
                    Content = content
                })
            | View.Types.Language.PlainText ->
                Some({
                    Language = Models.Problems.ViewLanguageModel.Create(Models.Problems.ViewLanguage.PlainText)
                    Content = content
                })
            | View.Types.Language.Tex ->
                Some({
                    Language = Models.Problems.ViewLanguageModel.Create(Models.Problems.ViewLanguage.Tex)
                    Content = content
                })
            | _ -> None

    static member Convert(o: Controller) : option<Models.Problems.ControllerModel> =
        match o with
        | null -> None
        | p ->
            let content = Models.Code.ContentModel(o.Content)
            match o.Language with
            | Controller.Types.Language.CSharp ->
                Some({
                    Language = Models.Problems.ControllerLanguageModel.Create(Models.Problems.ControllerLanguage.CSharp)
                    Content = content
                })
            | _ -> None

    static member Convert(o: Validator) : option<Models.Problems.ValidatorModel> =
        match o with
        | null -> None
        | p ->
            let content = Models.Code.ContentModel(o.Content)
            match o.Language with
            | Validator.Types.Language.CSharp ->
                Some({
                    Language = Models.Problems.ValidatorLanguageModel.Create(Models.Problems.ValidatorLanguage.CSharp)
                    Content = content
                })
            | Validator.Types.Language.IntegerValidator ->
                Some({
                    Language = Models.Problems.ValidatorLanguageModel.Create(Models.Problems.ValidatorLanguage.IntegerValidator)
                    Content = content
                })
            | Validator.Types.Language.FloatValidator ->
                Some({
                    Language = Models.Problems.ValidatorLanguageModel.Create(Models.Problems.ValidatorLanguage.FloatValidator)
                    Content = content
                })
            | Validator.Types.Language.StringValidator ->
                Some({
                    Language = Models.Problems.ValidatorLanguageModel.Create(Models.Problems.ValidatorLanguage.StringValidator)
                    Content = content
                })
            | _ -> None

type Converter private () =

    static member Convert(o: DateTimeOffset) =
        o.Ticks

    static member Convert<'IN, 'OUT>(input: List<'IN>, output: Google.Protobuf.Collections.RepeatedField<'OUT>, converter: 'IN -> 'OUT) =
        input |> List.iter(fun item -> output.Add(converter(item)))

    static member Convert(o: Models.Problems.GeneratedProblemModel) =
        let result = GeneratedProblem()
        result.Id <- o.Id.Value
        result.ProblemId <- o.ProblemId.Value
        result.Seed <- o.Seed.Value
        result.Title <- o.Title.Value
        result.View <- Converter.Convert(o.View)
        result.Answer <- o.Answer.Value
        result

    static member Convert(o: Models.Problems.ProblemModel) =
        let result = Problem()
        result.Id <- o.Id.Value
        result.Title <- o.Title.Value
        result.View <- Converter.Convert(o.View)
        result.Controller <- Converter.Convert(o.Controller)
        result.Validator <- Converter.Convert(o.Validator)
        result

    static member Convert(o: Models.Problems.ViewModel) =
        let result = View()
        result.Language <- Converter.Convert(o.Language.Language)
        result.Content <- o.Content.Value
        result

    static member Convert(o: Models.Problems.ControllerModel) =
        let result = Controller()
        result.Language <- Converter.Convert(o.Language.Language)
        result.Content <- o.Content.Value
        result
        
    static member Convert(o: Models.Problems.ValidatorModel) =
        let result = Validator()
        result.Language <- Converter.Convert(o.Language.Language)
        result.Content <- o.Content.Value
        result

    static member Convert(o: Models.Problems.ProblemSetModel) =
        let result = ProblemSet()
        result.Id <- o.Id.Value
        result.Title <- o.Title.Value
        result.DurationS <- uint32 o.Duration.Value.TotalSeconds
        Converter.Convert(o.Slots, result.Slots, Converter.Convert)
        result

    static member Convert(o: Models.Problems.ProblemSlotModel) =
        let result = ProblemSet.Types.Slot()
        Converter.Convert(o.Heads, result.HeadIds, fun x -> x.Value)
        result

    static member Convert(o: Models.Permissions.PermissionsModel) =
        let result = Permissions()
        result.OwnerId <- o.OwnerId.Value
        result.IsPublic <- o.IsPublic
        Converter.Convert(o.Groups, result.Groups, Converter.Convert)
        Converter.Convert(o.Members, result.Members, Converter.Convert)
        result

    static member Convert(o: Models.Permissions.GroupAccessModel) =
        let result = GroupAccess()
        result.GroupId <- o.GroupId.Value
        result.Name <- o.Name.Value
        result.Access <- Converter.Convert(o.Access)
        result

    static member Convert(o: Models.Permissions.GroupModel) =
        let result = Group()
        result.Id <- o.Id.Value
        result.OwnerId <- o.OwnerId.Value
        result.Name <- o.Name.Value
        result.Description <- o.Description.Value
        Converter.Convert(o.Members, result.Members, Converter.Convert)
        result

    static member Convert(o: Models.Permissions.MemberModel) =
        let result = Member()
        result.UserId <- o.UserId.Value
        result.Name <- o.Name.Value
        result.Access <- Converter.Convert(o.Access)
        result

    static member Convert(o: Models.Permissions.AccessModel) =
        let result = Access()
        result.Generate <- o.Generate
        result.Read <- o.Read
        result.Write <- o.Write
        result.Admin <- o.Admin
        result

    static member Convert(o: Models.Trash.TrashModel) =
        let result = Trash()
        Converter.Convert(o.Folders, result.Folders, Converter.Convert)
        Converter.Convert(o.Heads, result.Heads, Converter.Convert)
        result

    static member Convert(o: Models.Trash.TrashHeadEntryModel) =
        let result = TrashHeadEntry()
        result.HeadId <- o.HeadId.Value
        result.Name <- o.Name.Value
        result.Type <- Converter.Convert(o.Type)
        result

    static member Convert(o: Models.Trash.TrashFolderEntryModel) =
        let result = TrashFolderEntry()
        result.FolderId <- o.FolderId.Value
        result.Name <- o.Name.Value
        result

    static member Convert(o: Models.Folders.FolderModel) =
        let result = Folder()
        result.Id <- o.Id.Value
        result.Name <- o.Name.Value
        Converter.Convert(o.Folders, result.Folders, Converter.Convert)
        Converter.Convert(o.Heads, result.Heads, Converter.Convert)
        result

    static member Convert(o: Models.Folders.FolderLinkModel) =
        let result = FolderLink()
        result.Id <- o.Id.Value
        result.Name <- o.Name.Value
        result

    static member Convert(o: Models.Folders.HeadLinkModel) =
        let result = HeadLink()
        result.Id <- o.Id.Value
        result.Name <- o.Name.Value
        result.Type <- Converter.Convert(o.Type)
        result

    static member Convert(o: Models.Reports.SubmissionPreviewModel) =
        let result = SubmissionPreview()
        result.Id <- o.Id.Value
        result.StartedAt <- Converter.Convert(o.StartedAt)
        result.Deadline <- Converter.Convert(o.Deadline)
        result.Title <- o.Title.Value
        result.Completed <- o.Completed
        result.Author <- Converter.Convert(o.Author)
        result

    static member Convert(o: Models.Problems.ProblemSetPreviewModel) =
        let result = ProblemSetPreview()
        result.Id <- o.Id.Value
        result.Title <- o.Title.Value
        result.ProblemsCount <- o.ProblemsCount
        result.DurationS <- uint32(o.Duration.Value.TotalSeconds)
        result.Author <- Converter.Convert(o.Author)
        result

    static member Convert(o: Models.Heads.HeadModel) =
        let result = Head()
        result.Id <- o.Id.Value
        result.Name <- o.Name.Value
        result.Commit <- Converter.Convert(o.Commit)
        Converter.Convert(o.Tags, result.Tags, fun x -> x.Value)
        result

    static member Convert(o: Models.Heads.ModelType) =
        match o with
        | Models.Heads.ModelType.Problem -> TargetModel.Types.ModelType.Problem
        | Models.Heads.ModelType.ProblemSet -> TargetModel.Types.ModelType.ProblemSet
        | _ -> TargetModel.Types.ModelType.Unknown

    static member Convert(o: Models.Heads.TargetModel) =
        let result = TargetModel()
        result.Id <- o.Id.Value
        result.Type <- Converter.Convert(o.Type)
        result

    static member Convert(o: Models.Heads.CommitModel) =
        let result = Commit()
        result.Id <- o.Id.Value
        result.AuthorId <- o.AuthorId.Value
        result.HeadId <- o.HeadId.Value
        result.Target <- Converter.Convert(o.Target)
        result.Timestamp <- Converter.Convert(o.Timestamp)
        match o.ParentId with
        | Some(id) -> result.ParentId <- id.Value
        | None -> ()
        result.Description <- o.Description.Value
        result

    static member Convert(o: Models.Reports.ReportModel) =
        let result = Report()
        result.Id <- o.Id.Value
        result.ProblemSet <- Converter.Convert(o.ProblemSet)
        result.StartedAt <- Converter.Convert(o.StartedAt)
        result.FinishedAt <- Converter.Convert(o.FinishedAt)
        result.Author <- Converter.Convert(o.Author)
        result

    static member Convert(o: Models.Reports.ProblemSetReportModel) =
        let result = ProblemSetReport()
        result.GeneratedProblemSetId <- o.Id.Value
        result.Title <- o.Title.Value
        Converter.Convert(o.Problems, result.Problems, Converter.Convert)
        result

    static member Convert(o: Models.Reports.ProblemReportModel) =
        let result = ProblemReport()
        result.GeneratedProblemId <- o.Id.Value
        result.Title <- o.Title.Value
        result.View <- Converter.Convert(o.View)
        result.ExpectedAnswer <- o.ExpectedAnswer.Value
        result.IsCorrect <- o.IsCorrect
        match (o.Answer, o.Timespan) with
        | (Some(ans), Some(ts)) ->
            let answer = ProblemReport.Types.Answer()
            answer.Value <- ans.Value
            answer.Timestamp <- Converter.Convert(ts)
            result.UserAnswer <- answer
        | _ -> ()
        result


    static member Convert(o: Models.Reports.SubmissionModel) =
        let result = Submission()
        result.Id <- o.Id.Value
        result.ProblemSet <- (Converter.Convert(o.ProblemSet))
        result.StartedAt <- Converter.Convert(o.StartedAt)
        result.Deadline <- Converter.Convert(o.Deadline)
        result.Completed <- o.Completed
        match o.ReportId with
        | Some(reportId) -> result.ReportId <- reportId.Value
        | None -> ()
        result.Author <- Converter.Convert(o.Author)
        Converter.Convert(o.Answers, result.Answers, Converter.Convert)
        result

    static member Convert(o: Models.Reports.ProblemAnswerModel) =
        let result = ProblemAnswer()
        result.Id <- o.GeneratedProblemId.Value
        result.Answer <- o.Answer.Value
        result.Timestamp <- Converter.Convert(o.Timestamp)
        result

    static member Convert(o: Models.Reports.SubmissionProblemSetModel) =
        let result = SubmissionProblemSet()
        result.Id <- o.Id.Value
        result.Title <- o.Title.Value
        Converter.Convert(o.Problems, result.Problems, Converter.Convert)
        result

    static member Convert(o: Models.Reports.SubmissionProblemModel) =
        let result = SubmissionProblem()
        result.Id <- o.Id.Value
        result.Title <- o.Title.Value
        result.View <- Converter.Convert(o.View)
        result

    static member Convert(o: Models.Problems.GeneratedViewModel) =
        let result = GeneratedView()
        result.Language <- Converter.Convert(o.Language.Language)
        result.Content <- o.Content.Value
        result

    static member Convert(o: Models.Problems.ViewLanguage) =
        match o with
        | Models.Problems.ViewLanguage.Markdown -> View.Types.Language.Markdown
        | Models.Problems.ViewLanguage.PlainText -> View.Types.Language.PlainText
        | Models.Problems.ViewLanguage.Tex -> View.Types.Language.Tex

    static member Convert(o: Models.Problems.ControllerLanguage) =
        match o with
        | Models.Problems.ControllerLanguage.CSharp -> Controller.Types.Language.CSharp

    static member Convert(o: Models.Problems.ValidatorLanguage) =
        match o with
        | Models.Problems.ValidatorLanguage.CSharp -> Validator.Types.Language.CSharp
        | Models.Problems.ValidatorLanguage.IntegerValidator -> Validator.Types.Language.IntegerValidator
        | Models.Problems.ValidatorLanguage.FloatValidator -> Validator.Types.Language.FloatValidator
        | Models.Problems.ValidatorLanguage.StringValidator -> Validator.Types.Language.StringValidator

    static member Convert(o: Models.Permissions.UserModel) =
        let result = User()
        result.Id <- o.Id.Value
        result.FirstName <- o.FirstName.Value
        result.LastName <- o.LastName.Value
        result.Username <- o.Username.Value
        result