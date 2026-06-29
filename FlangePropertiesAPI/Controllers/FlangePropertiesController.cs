using Microsoft.AspNetCore.Mvc;
using FlangePropertiesAPI.Data;
using FlangePropertiesAPI.Domain;
using FlangePropertiesAPI.Domain.Dimensions;
using FlangePropertiesAPI.Contracts;
namespace FlangePropertiesAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlangePropertiesController : ControllerBase
{
    private readonly FlangePropertiesProvider _flangePropertiesProvider;
    public FlangePropertiesController(FlangePropertiesProvider flangePropertiesProvider)
    {
        _flangePropertiesProvider = flangePropertiesProvider;
    }

    [HttpGet("measures")]
    public IActionResult GetMeasures(Pn pn, Dn dn, FlangeType flangeType)
    {
        FlangeLookupResponse response = _flangePropertiesProvider.GetMeasures(pn, dn, flangeType);
        return Ok(response);
    }

    [HttpGet("flangeTypes")]
    public IActionResult GetFlangeTypes()
    {
        return Ok(Enum.GetValues(typeof(FlangeType)).Cast<FlangeType>().ToList());
    }

    [HttpGet("pnValues")]
    public IActionResult GetPnValues()
    {
        return Ok(Enum.GetValues(typeof(Pn)).Cast<Pn>().ToList());
    }

    [HttpGet("dnValues")]
    public IActionResult GetDnValues()
    {
        return Ok(Enum.GetValues(typeof(Dn)).Cast<Dn>().ToList());
    }

    [HttpGet("validCombinations")]
    public IActionResult GetValidCombinations()
    {
        var combinations = _flangePropertiesProvider.GetValidCombinations()
            .Select(c => new ValidCombinationResponse
            {
                Pn = c.pn.ToString(),
                Dn = c.dn.ToString(),
                FlangeType = c.flangeType.ToString(),
            });

        return Ok(combinations);
    }
}