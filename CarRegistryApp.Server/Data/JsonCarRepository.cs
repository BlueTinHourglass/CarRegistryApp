using System.Text.Json;

namespace CarRegistryApp.Server.Data
{
    public class JsonCarRepository
    {
        private readonly string _filePath;

        public JsonCarRepository(IWebHostEnvironment env)
        {
            _filePath = Path.Combine(env.ContentRootPath, "Data", "cars.json");
        }

        public async Task<List<Car>> GetCarsAsync()
        {
            var json = await File.ReadAllTextAsync(_filePath);

            return JsonSerializer.Deserialize<List<Car>>(json,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                   ?? new List<Car>();
        }

        public async Task SaveCarsAsync(List<Car> cars)
        {
            var json = JsonSerializer.Serialize(cars, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            await File.WriteAllTextAsync(_filePath, json);
        }
    }
}
