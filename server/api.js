import debug from 'debug'
import url from 'url'
import route from 'koa-route'
import https from 'https'
import fs from 'fs'

const settings = {
  apiUrl: 'https://api.instagram.com/v1/users/search',
  requiredKeys: ['ebuilder'],
  clientId: 'afd15cca7d664a1c964d54bac0488b93'
};

export default route.get(
  '/user',
  function *() {
    const prv = this;
    const _toClientResponse = {
      err: [],
    };
    let _query = url.parse(prv.request.url, true).query;

    // construct url, and first see if all required params passed in
    const _missingParams = [];

    let isMissingParam = () => {
      settings.requiredKeys.forEach((key)=> {
        debug('dev')('iterating: ',key, ' and result would be ', hasOwnProperty.call(_query, key));
        if (!hasOwnProperty.call(_query, key)) {
          _missingParams.push(key);
        }
      });
      return ( _missingParams.length ) ? true : false;
    };

    // if we have all required params, send the request
    if ( _missingParams.length === 0 ) {
      _toClientResponse.response = yield (callback) => {
        let _requestUrl = settings.apiUrl+'?q='+_query.ebuilder+'&client_id='+settings.clientId;
        let str = '';

        _toClientResponse.debug = {
          url: _requestUrl
        };

        https.get(_requestUrl, function(res) {
          res.on('data', function (chunk) {
            str += chunk;
          });
          res.on('end', function () {
            let _finalResponse = JSON.parse(str);
            let _rawFilename = /[^/]*$/.exec(_finalResponse.data[0].profile_picture)[0];
            let _filename = './app/img/parsed/'+_rawFilename;

            let userObj = {
              pic: _rawFilename,
              data: _finalResponse.data[0]
            };

            if ( !fs.existsSync(_filename) ) {
              let file = fs.createWriteStream(_filename);
              debug('dev')('i will write file soon!', _rawFilename);
              https.get(_finalResponse.data[0].profile_picture, function(__response) {
                __response.pipe(file);
              });
              callback(null, userObj);
            }
            // if file already there just show it
            else {
              callback(null, userObj);
            }

          });
          res.on('error', function(err) {
            debug('dev')('------2.err');
            debug('dev')('httpserrot occured', err);
          });
        });
      };
    } else {
      _toClientResponse.err.push('Didnt have _dir created or missing params occured', _missingParams);
    }

    this.body = JSON.stringify(_toClientResponse);
  }
);
