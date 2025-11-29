using CarRegistryApp.Server.Data;
using Microsoft.AspNetCore.Mvc;

namespace CarRegistryApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CarController : ControllerBase
    {
        private readonly JsonCarRepository _repo;

        public CarController(JsonCarRepository repo)
        {
            _repo = repo;
        }

        [HttpGet(Name = "GetCar")]
        public async Task<IEnumerable<Car>> Get([FromQuery] string? make)
        {
            var cars = await _repo.GetCarsAsync();

            return string.IsNullOrWhiteSpace(make)
                ? cars
                : cars.Where(c => c.Make.Equals(make, StringComparison.OrdinalIgnoreCase));
        }
    }
}
