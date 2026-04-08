namespace FlangePropertiesAPI.Domain.Tables;

public class FlangeRow
{
    public Measure? D { get; }
    public Measure? K { get; }
    public Measure? L { get; }
    public Count? BoltingNumber { get; }
    public BoltingSize? BoltingSize { get; }
    public Measure? A { get; }
    public Measure? B1 { get; }
    public Measure? B2 { get; }
    public Measure? C1 { get; }
    public Measure? C2 { get; }
    public Measure? C3 { get; }
    public Measure? C4 { get; }
    public Measure? F { get; }
    public Measure? GMax { get; }
    public Measure? H2 { get; }
    public Measure? H3 { get; }
    public Measure? H4 { get; }
    public Measure? H5 { get; }
    public Measure? N1 { get; }
    public Measure? N3 { get; }
    public Measure? R1 { get; }
    public string? S { get; }

    public FlangeRow(
        Measure? d,
        Measure? k,
        Measure? l,
        Count? boltingNumber,
        BoltingSize? boltingSize,
        Measure? a,
        Measure? b1,
        Measure? b2,
        Measure? c1,
        Measure? c2,
        Measure? c3,
        Measure? c4,
        Measure? f,
        Measure? gMax,
        Measure? h2,
        Measure? h3,
        Measure? h4,
        Measure? h5,
        Measure? n1,
        Measure? n3,
        Measure? r1,
        string s)
    {
        if (!(d != null && k != null && l != null && boltingNumber != null && boltingSize != null))
        {
            throw new ArgumentException("D, K, L, BoltingNumber and BoltingSize are required fields and cannot be null.");
        }
        D = d;
        K = k;
        L = l;
        BoltingNumber = boltingNumber;
        BoltingSize = boltingSize;
        A = a;
        B1 = b1;
        B2 = b2;
        C1 = c1;
        C2 = c2;
        C3 = c3;
        C4 = c4;
        F = f;
        GMax = gMax;
        H2 = h2;
        H3 = h3;
        H4 = h4;
        H5 = h5;
        N1 = n1;
        N3 = n3;
        R1 = r1;
        S = s;
    }
}