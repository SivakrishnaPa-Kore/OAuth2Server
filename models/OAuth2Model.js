
/**
 * Module dependencies.
 */
const debug = require('debug')('OAuth2Model');
var Redis = require('ioredis');
var fmt = require('util').format;
var instance;

/**
 * Constructor 
 */

function OAuth2Model() {
    this.redisClient = new Redis();
}


/**
 * Redis formats.
 */

const formats = {
    client: 'clients:%s',
    token: 'tokens:%s',
    user: 'users:%s'
};

/**
 * Get access token.
 */

OAuth2Model.prototype.getAccessToken = async function (bearerToken) {

    return await this.redisClient.hgetall(fmt(formats.token, bearerToken))
        .then(function (token) {
            if (!token || token.accessToken !== bearerToken) {
                return;
            }
            debug("getAccessToken: sent access token successfully");
            return {
                accessToken: new Date(token.accessToken),
                accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
                refreshToken: token.refreshToken,
                refreshTokenExpiresAt: token.refreshTokenExpiresAt,
                client: {
                    id: token.clientId
                },
                user: {
                    id: token.userId
                }

            };
        });
};

/**
 * Get client.
 */

OAuth2Model.prototype.getClient = async function (clientId, clientSecret) {

    return await this.redisClient.hgetall(fmt(formats.client, clientId))
        .then(function (client) {
            if (!client || client.clientSecret !== clientSecret) {
                return;
            }
            debug("Sent client details successfully");
            return {
                id: client.id,
                clientId: client.clientId,
                clientSecret: client.clientSecret,
                grants: ["password","refresh_token"]
            };
        });
};

/**
 * Get refresh token.
 */

OAuth2Model.prototype.getRefreshToken = async function (bearerToken) {

    return await this.redisClient.hgetall(fmt(formats.token, bearerToken))
        .then(function (token) {
            if (!token || token.accessToken !== bearerToken) {
                return;
            }

            return {
                clientId: token.clientId,
                expires: token.refreshTokenExpiresOn,
                refreshToken: token.accessToken,
                userId: token.userId
            };
        });
};

/**
 * Get user.
 */

OAuth2Model.prototype.getUser = async function (username, password) {

    return await this.redisClient.hgetall(fmt(formats.user, username))
        .then(function (user) {
            if (!user || password !== user.password) {
                return;
            }
            debug("getUser: user details sent succesfully!!");
            return {
                id: user.id,
                username: user.username,
                password: user.password,
                grants:  ["password","refresh_token"]
            };
        });
};

/**
 * Save token.
 */

OAuth2Model.prototype.saveToken = async function (token, client, user) {

    const pipe = this.redisClient.pipeline()    //redis pipeline to execute multiple commands
    token.clientId = client.clientId,
        token.userId = user.id;
    var data = {
        accessToken: token.accessToken,
        accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: new Date(token.refreshTokenExpiresAt),
        client: {
            id: client.id
        },
        user: {
            id: user.id
        }
    };
    await pipe
        .hmset(fmt(formats.token, token.accessToken), token)
        .hmset(fmt(formats.token, token.refreshToken), token)
        .exec()
        .then(function (result) {
            debug("saveToken: token %s saved successfully",token);
        })
    return data;
};

/**
 * Export an Instance
 */
module.exports = {
    getInstance: function () {
        if (!instance) {
            instance = new OAuth2Model();
        }

        return instance;
    }
};