namespace FlangePropertiesAPI.Domain;

public class Measure
{
    public double Value { get; }

    public Measure(double value)
    {
        if (value <= 0)
        {
            throw new ArgumentException("Measure value must be positive.");
        }
        Value = value;
    }
}