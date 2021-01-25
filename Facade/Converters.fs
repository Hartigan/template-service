namespace Facade

open Domain
open System

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

type Converter private () =

    static member Convert(o: DateTimeOffset) =
        o.Ticks

    static member Convert<'IN, 'OUT>(input: List<'IN>, output: Google.Protobuf.Collections.RepeatedField<'OUT>, converter: 'IN -> 'OUT) =
        input |> List.iter(fun item -> output.Add(converter(item)))

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
        | Models.Problems.ViewLanguage.PlainText -> View.Types.Language.Plaintext
        | Models.Problems.ViewLanguage.Tex -> View.Types.Language.Tex

    static member Convert(o: Models.Permissions.UserModel) =
        let result = User()
        result.Id <- o.Id.Value
        result.FirstName <- o.FirstName.Value
        result.LastName <- o.LastName.Value
        result.Username <- o.Username.Value
        result