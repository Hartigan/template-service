namespace Contexts

open DatabaseTypes
open System
open DatabaseTypes.Identificators

type Interval<'T> =
    {
        From : 'T
        To : 'T
    }

type IContext<'T> =
    abstract member Get : IDocumentKey -> Async<Result<'T, Exception>>
    abstract member Insert : IDocumentKey * 'T -> Async<Result<unit, Exception>>
    abstract member Update : IDocumentKey * ('T -> Result<'T, Exception>) -> Async<Result<unit, Exception>>
    abstract member Update : IDocumentKey * ('T -> 'T) -> Async<Result<unit, Exception>>
    abstract member Remove : IDocumentKey -> Async<Result<unit, Exception>>
    abstract member Exists : IDocumentKey -> Async<Result<bool, Exception>>

type IPermissionsContext =
    abstract member Get : IDocumentKey -> Async<Result<Permissions, Exception>>
    abstract member Update : IDocumentKey * (Permissions -> Result<Permissions, Exception>) -> Async<Result<unit, Exception>>
    abstract member Update : IDocumentKey * (Permissions -> Permissions) -> Async<Result<unit, Exception>>
    abstract member Exists : IDocumentKey -> Async<Result<bool, Exception>>

type IGroupContext =
    inherit IContext<UserGroup>
    abstract member Search : string option * offset:UInt32 * limit:UInt32 -> Async<Result<List<UserGroup>, Exception>>

type IHeadContext =
    inherit IContext<Head>
    abstract member SearchPublicProblemSets : string option * List<string> * UserId option * problemsCount:Interval<uint32> option * duration:Interval<int32> option * offset:UInt32 * limit:UInt32 -> Async<Result<List<Head>, Exception>>

type IReportContext =
    inherit IContext<Report>
