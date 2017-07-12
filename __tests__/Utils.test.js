const Utils = require('../src/components/Utils/Utils');


test('do rotate returns true', () => {
    expect(Utils.doRotate(120)).toBe(false);
});

test('centroid height is constant', () => {
   expect(Utils.getCentroidHeight()).toBe(Math.sqrt(3) / 6 * 150);
});

test('cartesian to screen is accurate', () => {
    expect(Utils.cartesianToScreen(100, 100, 1000, 1000)).toContain(600);
    expect(Utils.cartesianToScreen(100, 100, 1000, 1000)).toContain(400);
});

test('top point is accurate', () => {
   expect(Utils.getTopFromCentroid(100, 100, 1000, 1000)).toContain(600);
   expect(Utils.getTopFromCentroid(100, 100, 1000, 1000)).toContain(357);
});

test('left point is accurate', () => {
    expect(Utils.getLeftFromCentroid(100, 100, 1000, 1000)).toContain(557);
    expect(Utils.getLeftFromCentroid(100, 100, 1000, 1000)).toContain(443);
});

test('right point is accurate', () => {
    expect(Utils.getRightFromCentroid(100, 100, 1000, 1000)).toContain(643);
    expect(Utils.getRightFromCentroid(100, 100, 1000, 1000)).toContain(443);
});

test('top rotated point is accurate', () => {
    expect(Utils.rotateTopFromCentroid(100, 100, 1000, 1000)).toContain(600);
    expect(Utils.rotateTopFromCentroid(100, 100, 1000, 1000)).toContain(473);
});

test('right rotated point is accurate', () => {
    expect(Utils.rotateRightFromCentroid(100, 100, 1000, 1000)).toContain(643);
    expect(Utils.rotateRightFromCentroid(100, 100, 1000, 1000)).toContain(387);
});

test('left rotated point is accurate', () => {
    expect(Utils.rotateLeftFromCentroid(100, 100, 1000, 1000)).toContain(557);
    expect(Utils.rotateLeftFromCentroid(100, 100, 1000, 1000)).toContain(387);
});