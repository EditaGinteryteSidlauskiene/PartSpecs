namespace FlangePropertiesAPI.Domain;

public static class DnExtensions
{
    // Cached once so all helpers use the same DN ordering.
    private static readonly Dn[] DnValues = Enum.GetValues<Dn>();

    // Total number of DN values used for array sizing.
    public static int GetDnCount() => DnValues.Length;

    // Maps a DN enum value to its position in the ordered DN array.
    public static int GetDnIndex(this Dn dn) => (int)dn;

    // Maps an array index back to the corresponding DN value.
    public static Dn GetDnByIndex(int index)
    {
        if (index < 0 || index >= DnValues.Length)
            throw new ArgumentOutOfRangeException(nameof(index), $"Index of DN must be between 0 and {DnValues.Length - 1}.");
        return DnValues[index];
    }
}