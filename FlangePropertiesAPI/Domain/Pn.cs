namespace FlangePropertiesAPI.Domain;

/// <summary>
/// Pressure Nominal (PN) values per EN 1092-1.
/// Selects which dimension table to use for flange lookup.
/// </summary>
public enum Pn
{
    Pn002_5,
    Pn006,
    Pn010,
    Pn016,
    Pn025,
    Pn040,
    Pn063,
}