namespace FlangePropertiesAPI.Domain;

/// <summary>
/// Nominal diameter (DN) values per EN 1092-1.
/// Enum order defines storage index order: Dn10=ordinal 0, Dn15=ordinal 1, etc.
/// Used as array index in column data storage.
/// </summary>
public enum Dn
{
    Dn10,
    Dn15,
    Dn20,
    Dn25,
    Dn32,
    Dn40,
    Dn50,
    Dn65,
    Dn80,
    Dn100,
    Dn125,
    Dn150,
    Dn200,
    Dn250,
    Dn300,
    Dn350,
    Dn400,
    Dn450,
    Dn500,
    Dn600,
    Dn700,
    Dn800,
    Dn900,
    Dn1000,
    Dn1200,
    Dn1400,
    Dn1600,
    Dn1800,
    Dn2000,
    Dn2200,
    Dn2400,
    Dn2600,
    Dn2800,
    Dn3000,
    Dn3200,
    Dn3400,
    Dn3600,
    Dn3800,
    Dn4000
}