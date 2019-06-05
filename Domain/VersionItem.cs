namespace Domain
{
    public struct VersionItem<T>
    {
        public VersionItemId Id { get; set; }

        public UserId AuthorId { get; set; }

        public T TargetId { get; set; }

        public DateTimeOffset Timestamp { get; set; }

        public VersionItemId ParentId { get; set; }
    }
}