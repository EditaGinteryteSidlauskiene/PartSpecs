using FlangePropertiesAPI.Domain;
using FlangePropertiesAPI.Domain.Dimensions;

namespace FlangePropertiesAPI.Contracts;

public class FlangeLookupResponse
{
    public Count? count { get; set; }
    public BoltSize? boltSize { get; set; }
    public Dictionary<Column, Measure> measures { get; set; } = new();
}