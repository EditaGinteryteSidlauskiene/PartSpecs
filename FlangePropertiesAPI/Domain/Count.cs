namespace FlangePropertiesAPI.Domain;

public class Count
{
    public int Value { get; }

    public Count(ulong value)
    {
        if (value <= 0)
        {
            throw new ArgumentException("Count value must be positive.");
        }
        Value = value;
    }
}