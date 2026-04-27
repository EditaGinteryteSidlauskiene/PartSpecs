namespace FlangePropertiesAPI.Domain.Dimensions;

/// <summary>
/// Semantic value for physical measurements in flange tables.
/// Represents one of three meanings:
/// - Value: numeric measurement (e.g., 10.5 mm)
/// - Instruction: reference/note (e.g., "See Annex A")
/// - UserDefined: value must be supplied by application/project context
/// Stored in column arrays and returned via table queries.
/// </summary>
public record struct Measure
{
    public enum MeasureType
    {
        Value,
        Instruction,
        UserDefined
    }

    private MeasureType _type;
    private double? _value;
    private string? _instruction;
    private bool? _userDefined;

    public Measure(double value)
    {
        _type = MeasureType.Value;
        _value = value;
        _instruction = null;
        _userDefined = null;
    }

    public Measure(string instruction)
    {
        _type = MeasureType.Instruction;
        _value = null;
        _instruction = instruction;
        _userDefined = null;
    }

    public Measure(bool userDefined)
    {
        _type = MeasureType.UserDefined;
        _value = null;
        _instruction = null;
        _userDefined = userDefined;
    }

    public MeasureType Type
    {
        get { return _type; }
    }

    public double? Value
    {
        get { return _value; }
    }

    public string? Instruction
    {
        get { return _instruction; }
    }
    public bool? UserDefined
    {
        get { return _userDefined; }
    }
}