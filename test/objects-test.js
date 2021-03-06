var expect = require("expect.js"),
    sift = require(".."),
    assert = require("assert");
describe("objects", function () {
  
    var topic = [{
            name: 'craig',
            age: 90001,
            tags: ['coder', 'programmer', 'traveler', 'photographer'],
            address: {
                city: 'Minneapolis',
                state: 'MN',
                phone: '9999999999'
            },
            tags: ['photos', 'cook'],
            hobbies: [{
                    name: 'programming',
                    description: 'some desc'
                }, {
                    name: 'cooking'
                }, {
                    name: 'photography',
                    places: ['haiti', 'brazil', 'costa rica']
                }, {
                    name: 'backpacking'
                }
            ]
        }, {
            name: 'tim',
            age: 90001,
            tags: ['traveler', 'photographer'],
            address: {
                city: 'St. Paul',
                state: 'MN',
                phone: '765765756765'
            },
            tags: ['dj'],
            hobbies: [{
                    name: 'biking',
                    description: 'some desc'
                }, {
                    name: 'DJ'
                }, {
                    name: 'photography',
                    places: ['costa rica']
                }
            ]
        }
    ];
    it("throws error if $not is incorrect", function () {
        assert.throws(function () {
            sift({
                $not: ['abc']
            }, topic);
        }, Error);
    });
    it("has sifted through photography in brazil count of 1", function () {
        var sifted = sift({
            hobbies: {
                name: 'photography',
                places: {
                    $in: ['brazil']
                }
            }
        }, topic);
        assert.equal(sifted.length, 1);
    });
    it("has sifted through photography in brazil, haiti, and costa rica count of 1", function () {
        var sifted = sift({
            hobbies: {
                name: 'photography',
                places: {
                    $all: ['brazil', 'haiti', 'costa rica']
                }
            }
        }, topic);
        assert.equal(sifted.length, 1);
        assert.equal(sifted[0], topic[0]);
    });
    it("has a sifted hobbies of photography, cooking, or biking count of 2", function () {
        var sifted = sift({
            hobbies: {
                name: {
                    $in: ['photography', 'cooking', 'biking']
                }
            }
        }, topic);
        assert.equal(sifted.length, 2);
    });
    it("has sifted to complex count of 2", function () {
        var sifted = sift({
            hobbies: {
                name: 'photography',
                places: {
                    $in: ['costa rica']
                }
            },
            address: {
                state: 'MN',
                phone: {
                    $exists: true
                }
            }
        }, topic);
        assert.equal(sifted.length, 2);
    });
    it("has sifted to complex count of 0", function () {
        var sifted = sift({
            hobbies: {
                name: 'photos',
                places: {
                    $in: ['costa rica']
                }
            }
        }, topic);
        assert.equal(sifted.length, 0);
    });
    it("has sifted subobject hobbies count of 3", function () {
        var sifted = sift({
            "hobbies.name": "photography"
        }, topic);
        assert.equal(sifted.length, 2);
    });
    it('has sifted dot-notation hobbies of photography, cooking, and biking count of 3', function () {
        var sifted = sift({
            "hobbies.name": {
                $in: ['photography', 'cooking', 'biking']
            }
        }, topic);
        assert.equal(sifted.length, 2);
    });
    it("has sifted to complex dot-search count of 2", function () {
        var sifted = sift({
            "hobbies.name": "photography",
            "hobbies.places": {
                $in: ['costa rica']
            },
            "address.state": "MN",
            "address.phone": {
                $exists: true
            }
        }, topic);
        assert.equal(sifted.length, 2);
    });
    it("has sifted with selector function count of 2", function () {
        var sifted = sift({
            "name": "photography",
            "places": {
                $in: ['costa rica']
            }
        }, topic, function (item) {
            return item.hobbies;
        });
        assert.equal(sifted.length, 2);
    })
});