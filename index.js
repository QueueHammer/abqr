var _ = require('lodash');
var _eval = require('eval');
var shell = require('shelljs');
var Promise = require("bluebird");
var glob = Promise.promisify(require("glob"));

var scope = {};
var binder = propertyBinder(scope, '_');
binder(shell);
binder(_);
binder({_:_})

_eval('module.exports = ' + getCommand(), 'script', scope);

function getCommand () {
  var [prog, filePath, ...args] = process.argv;
  return args.join(' ');
}

function propertyBinder(target, defaultPrefix) {
  return function bind(obj, prefix = defaultPrefix) {
    return Object.keys(obj).reduce((memo, key) => {
      var name = getName(key);

      Object.defineProperty(memo, name, {
        get: () => obj[key],
        enumerable: true
      });

      return memo;

      function getName(key) {
        return target[key] ? getName(prefix + key) : key;
      }
    }, target);
  };
}

/*
tests:
pwd().split('/').map(x => echo(x))
pwd().split('/').map(x => touch(x))
*/