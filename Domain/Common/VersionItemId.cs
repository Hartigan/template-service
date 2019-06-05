namespace Domain.Common
{
    public struct VersionItemId
    {
        public int Value { get; private set; }
        public VersionItemId(int id)
        {
            Value = id;
        }
    }
}