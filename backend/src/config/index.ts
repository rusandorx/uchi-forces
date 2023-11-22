import merge from 'lodash.merge';

enum Stages {
    Production = 'production',
    Testing = 'testing',
    Local = 'local'
}

process.env.NODE_ENV ||= 'development';
process.env.PORT ||= '3001';
const stage = process.env.STAGE || Stages.Local;

let envConfig;

if (stage === Stages.Production) envConfig = require('./prod').default;
else if (stage === Stages.Testing) envConfig = require('./testing').default;
else envConfig = require('./local').default;

export default merge({
    stage,
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    secrets: {
        jwt: process.env.JWT_SECRET,
        dbUrl: process.env.DATABASE_URL,
    },
    logging: true,
}, envConfig);
