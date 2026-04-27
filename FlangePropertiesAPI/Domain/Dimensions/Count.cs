namespace FlangePropertiesAPI.Domain.Dimensions;

/// <summary>
/// Semantic value for bolt counts.
/// Represents one of two meanings:
/// - Fixed: one specific bolt count (e.g., 4 holes)
/// - Instruction: reference/note (e.g., "See standard table")
/// Stored in column arrays and returned via table queries.
/// </summary>
public record struct Count
{
    public enum CountType
    {
        Fixed,
        Instruction
    }

    private CountType _type;
    private int? _value;
    private string? _instruction;

    public CountType Type
    {
        get { return _type; }
    }

    public Count(int value)
    {
        _type = CountType.Fixed;
        _value = value;
        _instruction = null;
    }

    public Count(string instruction)
    {
        _type = CountType.Instruction;
        _value = null;
        _instruction = instruction;
    }


    public int? Value
    {
        get { return _value; }
    }

    public string? Instruction
    {
        get { return _instruction; }
    }
}