namespace FlangePropertiesAPI.Domain;

public class FlangeSelection
{
    public Pn Pn { get; }
    public Dn Dn { get; }
    public FlangeType FlangeType { get; }

    public FlangeSelection(Pn pn, Dn dn, FlangeType flangeType)
    {
        Pn = pn;
        Dn = dn;
        FlangeType = flangeType;
    }
}