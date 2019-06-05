namespace Domain
{
    public struct User
    {
        public UserId Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Nickname { get; set; }
    }
}