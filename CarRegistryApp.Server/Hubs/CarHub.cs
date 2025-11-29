using CarRegistryApp.Server.Data;
using Microsoft.AspNetCore.SignalR;

namespace CarRegistryApp.Server.Hubs
{
    public class CarHub : Hub
    {
        private readonly JsonCarRepository _repo;

        public CarHub(JsonCarRepository repo)
        {
            _repo = repo;
        }

        public override async Task OnConnectedAsync()
        {
            var cars = await _repo.GetCarsAsync(); // fetch current data
            await Clients.Caller.SendAsync("ReceiveCarUpdates", cars);
            await base.OnConnectedAsync();
        }
    }
}
