namespace Domain.Common
{
    public struct CodeId
    {
        public int Value { get; private set; }

        public CodeId(int id)
        {
            Value = id;
        }
    }
}