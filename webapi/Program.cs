using webapi.Contexts;
using Microsoft.EntityFrameworkCore;
using webapi.Hubs;
using Microsoft.Extensions.Configuration;
using webapi.SignalR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAutoMapper(typeof(JobMappingProfile));

var trustedOrigins = "trustedOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: trustedOrigins,
                      policy =>
                      {
                          policy.AllowAnyHeader().AllowAnyMethod().SetIsOriginAllowed((host) => true).AllowCredentials();
                      });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

var configuration = builder.Configuration;

builder.Services.AddDbContextPool<JobDBContext>(
    o => o.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.Configure<ConcurrencySettings>(builder.Configuration.GetSection("ConcurrencySettings"));

// signalr wrap
builder.Services.AddSingleton<JobsBroadcastService>();

// hosted job worker
builder.Services.AddHostedService<JobWorkerService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseAuthorization();
app.UseCors(trustedOrigins);

// SignalR
app.MapHub<ProgressHub>("api/progressHub");

app.MapControllers();
app.Run();