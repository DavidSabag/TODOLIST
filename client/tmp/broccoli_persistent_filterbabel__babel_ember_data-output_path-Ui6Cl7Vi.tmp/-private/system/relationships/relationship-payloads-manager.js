function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
// import { DEBUG } from '@glimmer/env';


import { default as RelationshipPayloads, TypeCache } from './relationship-payloads';

/**
  Manages relationship payloads for a given store, for uninitialized
  relationships.  Acts as a single source of truth (of payloads) for both sides
  of an uninitialized relationship so they can agree on the most up-to-date
  payload received without needing too much eager processing when those payloads
  are pushed into the store.

  This minimizes the work spent on relationships that are never initialized.

  Once relationships are initialized, their state is managed in a relationship
  state object (eg BelongsToRelationship or ManyRelationship).


  @example

    let relationshipPayloadsManager = new RelationshipPayloadsManager(store);

    const User = DS.Model.extend({
      hobbies: DS.hasMany('hobby')
    });

    const Hobby = DS.Model.extend({
      user: DS.belongsTo('user')
    });

    let userPayload = {
      data: {
        id: 1,
        type: 'user',
        relationships: {
          hobbies: {
            data: [{
              id: 2,
              type: 'hobby'
            }]
          }
        }
      },
    };
    relationshipPayloadsManager.push('user', 1, userPayload.data.relationships);

    relationshipPayloadsManager.get('hobby', 2, 'user') === {
      {
        data: {
          id: 1,
          type: 'user'
        }
      }
    }

  @private
  @class RelationshipPayloadsManager
*/

var RelationshipPayloadsManager = function () {
  function RelationshipPayloadsManager(store) {
    _classCallCheck(this, RelationshipPayloadsManager);

    this._store = store;
    // cache of `RelationshipPayload`s
    this._cache = Object.create(null);
    this._inverseLookupCache = new TypeCache();
  }

  /**
    Find the payload for the given relationship of the given model.
     Returns the payload for the given relationship, whether raw or computed from
    the payload of the inverse relationship.
     @example
       relationshipPayloadsManager.get('hobby', 2, 'user') === {
        {
          data: {
            id: 1,
            type: 'user'
          }
        }
      }
     @method
  */


  RelationshipPayloadsManager.prototype.get = function get(modelName, id, relationshipName) {
    var relationshipPayloads = this._getRelationshipPayloads(modelName, relationshipName, false);
    return relationshipPayloads && relationshipPayloads.get(modelName, id, relationshipName);
  };

  /**
    Push a model's relationships payload into this cache.
     @example
       let userPayload = {
        data: {
          id: 1,
          type: 'user',
          relationships: {
            hobbies: {
              data: [{
                id: 2,
                type: 'hobby'
              }]
            }
          }
        },
      };
      relationshipPayloadsManager.push('user', 1, userPayload.data.relationships);
     @method
  */


  RelationshipPayloadsManager.prototype.push = function push(modelName, id, relationshipsData) {
    var _this = this;

    if (!relationshipsData) {
      return;
    }

    Object.keys(relationshipsData).forEach(function (key) {
      var relationshipPayloads = _this._getRelationshipPayloads(modelName, key, true);
      if (relationshipPayloads) {
        relationshipPayloads.push(modelName, id, key, relationshipsData[key]);
      }
    });
  };

  /**
    Unload a model's relationships payload.
     @method
  */


  RelationshipPayloadsManager.prototype.unload = function unload(modelName, id) {
    var _this2 = this;

    var modelClass = this._store._modelFor(modelName);
    var relationshipsByName = Ember.get(modelClass, 'relationshipsByName');
    relationshipsByName.forEach(function (_, relationshipName) {
      var relationshipPayloads = _this2._getRelationshipPayloads(modelName, relationshipName, false);
      if (relationshipPayloads) {
        relationshipPayloads.unload(modelName, id, relationshipName);
      }
    });
  };

  /**
    Find the RelationshipPayloads object for the given relationship.  The same
    RelationshipPayloads object is returned for either side of a relationship.
     @example
       const User = DS.Model.extend({
        hobbies: DS.hasMany('hobby')
      });
       const Hobby = DS.Model.extend({
        user: DS.belongsTo('user')
      });
       relationshipPayloads.get('user', 'hobbies') === relationshipPayloads.get('hobby', 'user');
     The signature has a somewhat large arity to avoid extra work, such as
      a)  string manipulation & allocation with `modelName` and
         `relationshipName`
      b)  repeatedly getting `relationshipsByName` via `Ember.get`
      @private
    @method
  */


  RelationshipPayloadsManager.prototype._getRelationshipPayloads = function _getRelationshipPayloads(modelName, relationshipName, init) {
    var relInfo = this.getRelationshipInfo(modelName, relationshipName);

    if (relInfo === null) {
      return;
    }

    var cache = this._cache[relInfo.lhs_key];

    if (!cache && init) {
      return this._initializeRelationshipPayloads(relInfo);
    }

    return cache;
  };

  RelationshipPayloadsManager.prototype.getRelationshipInfo = function getRelationshipInfo(modelName, relationshipName) {
    var inverseCache = this._inverseLookupCache;
    var store = this._store;
    var cached = inverseCache.get(modelName, relationshipName);

    // CASE: We have a cached resolution (null if no relationship exists)
    if (cached !== undefined) {
      return cached;
    }

    var modelClass = store._modelFor(modelName);
    var relationshipsByName = Ember.get(modelClass, 'relationshipsByName');

    // CASE: We don't have a relationship at all
    if (!relationshipsByName.has(relationshipName)) {
      inverseCache.set(modelName, relationshipName, null);
      return null;
    }

    var inverseMeta = modelClass.inverseFor(relationshipName, store);
    var relationshipMeta = relationshipsByName.get(relationshipName);
    var selfIsPolymorphic = relationshipMeta.options !== undefined && relationshipMeta.options.polymorphic === true;
    var inverseBaseModelName = relationshipMeta.type;

    // CASE: We have no inverse
    if (!inverseMeta) {
      var _info = {
        lhs_key: modelName + ':' + relationshipName,
        lhs_modelNames: [modelName],
        lhs_baseModelName: modelName,
        lhs_relationshipName: relationshipName,
        lhs_relationshipMeta: relationshipMeta,
        lhs_isPolymorphic: selfIsPolymorphic,
        rhs_key: '',
        rhs_modelNames: [],
        rhs_baseModelName: inverseBaseModelName,
        rhs_relationshipName: '',
        rhs_relationshipMeta: null,
        rhs_isPolymorphic: false,
        hasInverse: false,
        isSelfReferential: false, // modelName === inverseBaseModelName,
        isReflexive: false
      };

      inverseCache.set(modelName, relationshipName, _info);

      return _info;
    }

    // CASE: We do have an inverse

    var inverseRelationshipName = inverseMeta.name;
    var inverseRelationshipMeta = Ember.get(inverseMeta.type, 'relationshipsByName').get(inverseRelationshipName);
    var baseModelName = inverseRelationshipMeta.type;
    var isSelfReferential = baseModelName === inverseBaseModelName;

    // TODO we want to assert this but this breaks all of our shoddily written tests
    /*
    if (DEBUG) {
      let inverseDoubleCheck = inverseMeta.type.inverseFor(inverseRelationshipName, store);
       assert(`The ${inverseBaseModelName}:${inverseRelationshipName} relationship declares 'inverse: null', but it was resolved as the inverse for ${baseModelName}:${relationshipName}.`, inverseDoubleCheck);
    }
    */

    // CASE: We may have already discovered the inverse for the baseModelName
    // CASE: We have already discovered the inverse
    cached = inverseCache.get(baseModelName, relationshipName) || inverseCache.get(inverseBaseModelName, inverseRelationshipName);
    if (cached) {
      // TODO this assert can be removed if the above assert is enabled
      (true && !(cached.hasInverse !== false) && Ember.assert('The ' + inverseBaseModelName + ':' + inverseRelationshipName + ' relationship declares \'inverse: null\', but it was resolved as the inverse for ' + baseModelName + ':' + relationshipName + '.', cached.hasInverse !== false));


      var isLHS = cached.lhs_baseModelName === baseModelName;
      var modelNames = isLHS ? cached.lhs_modelNames : cached.rhs_modelNames;
      // make this lookup easier in the future by caching the key
      modelNames.push(modelName);
      inverseCache.set(modelName, relationshipName, cached);

      return cached;
    }

    var info = {
      lhs_key: baseModelName + ':' + relationshipName,
      lhs_modelNames: [modelName],
      lhs_baseModelName: baseModelName,
      lhs_relationshipName: relationshipName,
      lhs_relationshipMeta: relationshipMeta,
      lhs_isPolymorphic: selfIsPolymorphic,
      rhs_key: inverseBaseModelName + ':' + inverseRelationshipName,
      rhs_modelNames: [],
      rhs_baseModelName: inverseBaseModelName,
      rhs_relationshipName: inverseRelationshipName,
      rhs_relationshipMeta: inverseRelationshipMeta,
      rhs_isPolymorphic: inverseRelationshipMeta.options !== undefined && inverseRelationshipMeta.options.polymorphic === true,
      hasInverse: true,
      isSelfReferential: isSelfReferential,
      isReflexive: isSelfReferential && relationshipName === inverseRelationshipName
    };

    // Create entries for the baseModelName as well as modelName to speed up
    //  inverse lookups
    inverseCache.set(baseModelName, relationshipName, info);
    inverseCache.set(modelName, relationshipName, info);

    // Greedily populate the inverse
    inverseCache.set(inverseBaseModelName, inverseRelationshipName, info);

    return info;
  };

  /**
    Create the `RelationshipsPayload` for the relationship `modelName`, `relationshipName`, and its inverse.
     @private
    @method
  */


  RelationshipPayloadsManager.prototype._initializeRelationshipPayloads = function _initializeRelationshipPayloads(relInfo) {
    var lhsKey = relInfo.lhs_key;
    var rhsKey = relInfo.rhs_key;
    var existingPayloads = this._cache[lhsKey];

    if (relInfo.hasInverse === true && relInfo.rhs_isPolymorphic === true) {
      existingPayloads = this._cache[rhsKey];

      if (existingPayloads !== undefined) {
        this._cache[lhsKey] = existingPayloads;
        return existingPayloads;
      }
    }

    // populate the cache for both sides of the relationship, as they both use
    // the same `RelationshipPayloads`.
    //
    // This works out better than creating a single common key, because to
    // compute that key we would need to do work to look up the inverse
    //
    var cache = this._cache[lhsKey] = new RelationshipPayloads(relInfo);

    if (relInfo.hasInverse === true) {
      this._cache[rhsKey] = cache;
    }

    return cache;
  };

  return RelationshipPayloadsManager;
}();

export default RelationshipPayloadsManager;