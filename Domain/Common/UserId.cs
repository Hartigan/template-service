namespace Domain.Common
{
    public struct UserId
    {
        public int Value { get; private set; }

        public UserId(int id)
        {
            Value = id;
        }
    }
}