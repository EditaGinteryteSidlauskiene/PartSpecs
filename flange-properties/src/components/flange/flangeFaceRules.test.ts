import test from "node:test";
import assert from "node:assert/strict";
import { getFlangeFaceState } from "./flangeFaceRules.ts";

test("empty face input resolves to no-face state", () => {
    const state = getFlangeFaceState(null);

    assert.equal(state.isNoFace, true);
    assert.equal(state.isFaceA, false);
    assert.equal(state.isValidFaceLetter, false);
    assert.equal(state.renderingMode, "noFace");
    assert.deepEqual(state.dimensionGroups, []);
    assert.equal(state.showsF1, false);
    assert.equal(state.showsD1, false);
    assert.equal(state.showsF2, false);
});

test("face A stays separate from no face", () => {
    const noFace = getFlangeFaceState("");
    const faceA = getFlangeFaceState("A");

    assert.equal(noFace.isNoFace, true);
    assert.equal(faceA.isNoFace, false);
    assert.equal(faceA.isFaceA, true);
    assert.equal(faceA.renderingMode, "flatFace");
    assert.deepEqual(faceA.dimensionGroups, ["face"]);
    assert.equal(faceA.showsF1, false);
    assert.equal(faceA.showsD1, false);
    assert.equal(faceA.showsF2, false);
});

test("faces B through H resolve the expected face metadata", () => {
    const expectations = {
        B: { renderingMode: "raisedFace", showsF1: true, showsD1: true, showsF2: false },
        C: { renderingMode: "grooveFace", showsF1: false, showsD1: false, showsF2: true },
        D: { renderingMode: "steppedFace", showsF1: true, showsD1: false, showsF2: false },
        E: { renderingMode: "raisedFace", showsF1: false, showsD1: false, showsF2: true },
        F: { renderingMode: "grooveFace", showsF1: true, showsD1: false, showsF2: false },
        G: { renderingMode: "grooveFace", showsF1: true, showsD1: true, showsF2: true },
        H: { renderingMode: "ringJointFace", showsF1: false, showsD1: false, showsF2: false },
    } as const;

    for (const [face, expected] of Object.entries(expectations)) {
        const state = getFlangeFaceState(face);

        assert.equal(state.isNoFace, false, face);
        assert.equal(state.isValidFaceLetter, true, face);
        assert.equal(state.isFaceA, false, face);
        assert.equal(state.renderingMode, expected.renderingMode, face);
        assert.deepEqual(state.dimensionGroups, ["face"], face);
        assert.equal(state.showsF1, expected.showsF1, face);
        assert.equal(state.showsD1, expected.showsD1, face);
        assert.equal(state.showsF2, expected.showsF2, face);
    }
});
