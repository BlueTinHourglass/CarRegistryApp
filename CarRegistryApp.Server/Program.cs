using CarRegistryApp.Server.Data;
using CarRegistryApp.Server.Hubs;
using CarRegistryApp.Server.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSingleton<JsonCarRepository>();
builder.Services.AddHostedService<RegistrationCheckService>();
builder.Services.AddSignalR();

// Allow Angular dev server to connect
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.WithOrigins("https://localhost:50099") // your SPA origin
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseHttpsRedirection();

app.UseDefaultFiles();
app.MapStaticAssets();

app.UseRouting();
app.UseCors("DevCors");

app.UseAuthorization();

// IMPORTANT: UseCors must run before MapHub so negotiation responses include CORS headers
app.MapHub<CarRegistryApp.Server.Hubs.CarHub>("/carHub");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();