using System.Net.NetworkInformation;
using webapi.Models;

public class Step
{
    public int Id { get; set; }
    public int Index { get; set; }
    public StepState State { get; set; }

    public int JobId { get; set; }
    public Job Job { get; set; }

    public ICollection<StepAction> Actions { get; set; }
}