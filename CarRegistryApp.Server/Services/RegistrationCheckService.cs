using CarRegistryApp.Server.Data;
using CarRegistryApp.Server.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace CarRegistryApp.Server.Services
{
    public class RegistrationCheckService : BackgroundService
    {
        private readonly JsonCarRepository _repo;
        private readonly IHubContext<CarHub> _hubContext;

        public RegistrationCheckService(JsonCarRepository repo, IHubContext<CarHub> hubContext)
        {
            _repo = repo;
            _hubContext = hubContext;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var cars = await _repo.GetCarsAsync();

                // Update expired status
                foreach (var car in cars)
                {
                    car.Expired = car.ExpiryDate < DateOnly.FromDateTime(DateTime.Now);
                }

                // Broadcast to all connected clients
                await _hubContext.Clients.All.SendAsync("ReceiveCarUpdates", cars, cancellationToken: stoppingToken);

                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken); // every 10s for dev testing
            }
        }
    }
}
