import test from "node:test";
import assert from "node:assert/strict";
import { buildFlangeSvgFilename } from "./engine/flangeSvgExport.ts";

test("buildFlangeSvgFilename includes flange type, DN, PN, and face", () => {
    assert.equal(
        buildFlangeSvgFilename({
            flangeType: "11",
            dn: "100",
            pn: "16",
            face: "B",
        }),
        "flange-type-11-dn-100-pn-16-face-b.svg",
    );
    assert.equal(
        buildFlangeSvgFilename({
            flangeType: "05",
            dn: "80",
            pn: "10",
            face: null,
        }),
        "flange-type-05-dn-80-pn-10-no-face.svg",
    );
});
