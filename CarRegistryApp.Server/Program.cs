using CarRegistryApp.Server.Data;
using CarRegistryApp.Server.Hubs;
using CarRegistryApp.Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSingleton<JsonCarRepository>();
builder.Services.AddHostedService<RegistrationCheckService>();
builder.Services.AddSignalR();

// Allow Angular dev server to connect
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins("https://localhost:4200")
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
app.UseCors();

app.UseAuthorization();

app.MapHub<CarHub>("/carHub");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();