namespace Domain.Common
{
    public struct TemplateId
    {
        public int Value { get; private set; }

        public TemplateId(int id)
        {
            Value = id;
        }
    }
}