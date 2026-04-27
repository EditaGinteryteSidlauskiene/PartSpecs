using System.ComponentModel;
using FlangePropertiesAPI.Domain;

namespace FlangePropertiesAPI.Tables;

public class DimensionTableColumn<T> where T : struct
{
    private Dictionary<Dn, T> Data = [];
    private HashSet<FlangeType> Applicability = [];
    private Dictionary<FlangeType, Dn> SizeLimits = [];

    // column_K
    //   .AddData(DN100; 16)
    //   .AddData(DN150;18)
    //   .AddData(...);

    public DimensionTableColumn<T> AddData(Dn dn, T value)
    {
        Data[dn] = value;
        return this;
    }

    public DimensionTableColumn<T> AddApplicability(FlangeType flangeType)
    {
        Applicability.Add(flangeType);
        return this;
    }

    public DimensionTableColumn<T> AddSizeLimit(FlangeType flangeType, Dn dn)
    {
        SizeLimits[flangeType] = dn;
        return this;
    }


    public T? GetValue(Dn dn, FlangeType flangeType)
    {
        if (!Applicability.Contains(flangeType))
            return null;
        if (SizeLimits.ContainsKey(flangeType) && dn > SizeLimits[flangeType])
            return null;
        if (Data.ContainsKey(dn))
            return Data[dn];
        return null;
    }
}