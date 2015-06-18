'use strict';

describe('env', function () {
 it('should have REDIS_PORT_6379_TCP_PORT equal to 6379', function (done) {
     var port = process.env.REDIS_PORT_6379_TCP_PORT;
     port.should.equal("6379");
     done();
 });
});
