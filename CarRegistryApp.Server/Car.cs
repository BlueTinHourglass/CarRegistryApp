namespace CarRegistryApp.Server
{
    public class Car
    {
        public DateOnly ExpiryDate { get; set; }

        public string Make { get; set; }

        public string Colour { get; set; }

        public string Model { get; set; }

        //public bool ExpiryStatus => ExpiryDate >= DateOnly.FromDateTime(DateTime.Now);

        public bool Expired { get; set; }

        public string Registration { get; set; }
    }
}
