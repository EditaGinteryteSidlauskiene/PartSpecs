using FlangePropertiesAPI.Contracts;
using FlangePropertiesAPI.Data.Tables;
using FlangePropertiesAPI.Domain;
using FlangePropertiesAPI.Domain.Dimensions;
using FlangePropertiesAPI.Tables;

namespace FlangePropertiesAPI.Data;

public class FlangePropertiesProvider
{
    private Dictionary<Pn, Table> _tables = new Dictionary<Pn, Table>();
    public FlangePropertiesProvider()
    {
        _tables.Add(Pn.Pn002_5, new Pn_2_5());
        _tables.Add(Pn.Pn006, new Pn_6());
    }

    public FlangeLookupResponse GetMeasures(Pn pn,
        Dn dn,
        FlangeType flangeType)
    {
        // Get the correct table for the given PN
        Table? table = GetTableForPn(pn);
        if (table == null)
            throw new ArgumentException($"No table found for PN {pn}");

        FlangeLookupResponse response = new FlangeLookupResponse
        {
            count = table.GetBoltCount(dn, flangeType), // Count is not used in this context
            boltSize = table.GetBoltSize(dn, flangeType), // BoltSize is not used in this context
            measures = new Dictionary<Column, Measure>()

        };

        foreach (Column column in Enum.GetValues(typeof(Column)))
        {
            Measure? measure = table.GetColumnValue(column, dn, flangeType);
            if (measure.HasValue)
            {
                response.measures.Add(column, measure.Value);
            }
        }

        // If no measure is found, return an empty dictionary
        return response;
    }

    private Table? GetTableForPn(Pn pn)
    {
        if (_tables.TryGetValue(pn, out Table? table))
        {
            return table;
        }
        return null;
    }
}