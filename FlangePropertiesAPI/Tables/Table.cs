using FlangePropertiesAPI.Domain;
using FlangePropertiesAPI.Domain.Dimensions;

namespace FlangePropertiesAPI.Tables;

public class Table
{
    private DimensionTableColumn<BoltSize> _boltSizes = new();
    private DimensionTableColumn<Count> _boltCounts = new();
    private Dictionary<Column, DimensionTableColumn<Measure>> _columns = [];
    public Measure? GetColumnValue(Column column, Dn dn, FlangeType flangeType)
    {
        if (!_columns.ContainsKey(column)) return null;
        return _columns[column].GetValue(dn, flangeType);
    }

    public Count? GetBoltCount(Dn dn, FlangeType flangeType) =>
    _boltCounts.GetValue(dn, flangeType);

    public BoltSize? GetBoltSize(Dn dn, FlangeType flangeType) =>
        _boltSizes.GetValue(dn, flangeType);

    public void AddBoltSizeColumn(DimensionTableColumn<BoltSize> column)
    {
        _boltSizes = column;
    }

    public void AddBoltCountColumn(DimensionTableColumn<Count> column)
    {
        _boltCounts = column;
    }

    public void AddMeasureColumn(Column columnName, DimensionTableColumn<Measure> column)
    {
        _columns.Add(columnName, column);
    }

    public bool HasData(Dn dn, FlangeType flangeType)
    {
        return _columns.Values.Any(col => col.GetValue(dn, flangeType).HasValue);
    }
}