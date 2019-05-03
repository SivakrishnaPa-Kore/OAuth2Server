const  Redis = require('ioredis');
const db = new Redis();
db.multi()
  .hmset('users:gsk', {
    id: '1',
    username: 'gsk',
    password: 'g$k'
  })
  .hmset('clients:avis', {
    clientId: 'avis',
    clientSecret: 'c#eeku'
  })
  .exec(function (errs) {
    if (errs) {
      console.error(errs[0].message);

      return process.exit(1);
    }

    console.log('Client and user added successfully');
    process.exit();
});