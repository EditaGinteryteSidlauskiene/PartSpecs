namespace FlangePropertiesAPI.Domain;

public static class DnExtensions
{
    /// <summary>
    /// Cached DN values in enum declaration order.
    /// Ensures consistent index mapping across the entire application.
    /// </summary>
    private static readonly Dn[] DnValues = Enum.GetValues<Dn>();

    /// <summary>
    /// Returns the total count of DN values.
    /// Used for array sizing in column data structures.
    /// </summary>
    /// <returns>Number of DN enum members.</returns>
    public static int GetDnCount() => DnValues.Length;

    /// <summary>
    /// Converts a DN enum value to its index position in the DN array.
    /// Index position is used as the key to access column data arrays.
    /// Example: Dn10 → 0, Dn15 → 1, Dn20 → 2.
    /// </summary>
    /// <param name="dn">The DN value to map.</param>
    /// <returns>The zero-based index position of this DN.</returns>
    public static int GetDnIndex(this Dn dn) => (int)dn;

    /// <summary>
    /// Converts an array index back to the corresponding DN value.
    /// Inverse of GetDnIndex. Used when iterating through column indexes.
    /// Validates that index is within valid range.
    /// </summary>
    /// <param name="index">The array index to convert.</param>
    /// <returns>The DN value at this index.</returns>
    /// <exception cref="ArgumentOutOfRangeException">Thrown if index is negative or exceeds array bounds.</exception>
    public static Dn GetDnByIndex(int index)
    {
        if (index < 0 || index >= DnValues.Length)
            throw new ArgumentOutOfRangeException(nameof(index), $"Index of DN must be between 0 and {DnValues.Length - 1}.");
        return DnValues[index];
    }
}