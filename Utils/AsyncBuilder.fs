namespace Utils

module AsyncHelper =
    open Microsoft.FSharp.Control
    open System.Threading.Tasks
    type AsyncBuilder with

        member x.Bind(t, f) = x.Bind(Async.AwaitTask t, f)
        member x.Bind(t: Task, f) = x.Bind(Async.AwaitTask t, f)
