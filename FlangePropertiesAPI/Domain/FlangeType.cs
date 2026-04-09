namespace FlangePropertiesAPI.Domain;

[Flags]
public enum FlangeType : ushort
{
    None = 0,
    Type01 = 1,
    Type02 = 2,
    Type04 = 4,
    Type05 = 8,
    Type11 = 16,
    Type12 = 32,
    Type13 = 64,
    Type21 = 128,
    Type32 = 256,
    Type33 = 512,
    Type34 = 1024,
    Type35 = 2048,
    Type36 = 4096,
    Type37 = 8192
}