var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO this is now VERY similar to the identity/internal-model map
//  so we should probably generalize
export var TypeCache = function () {
  function TypeCache() {
    _classCallCheck(this, TypeCache);

    this.types = Object.create(null);
  }

  TypeCache.prototype.get = function get(modelName, id) {
    var types = this.types;


    if (types[modelName] !== undefined) {
      return types[modelName][id];
    }
  };

  TypeCache.prototype.set = function set(modelName, id, payload) {
    var types = this.types;

    var typeMap = types[modelName];

    if (typeMap === undefined) {
      typeMap = types[modelName] = Object.create(null);
    }

    typeMap[id] = payload;
  };

  TypeCache.prototype.delete = function _delete(modelName, id) {
    var types = this.types;


    if (types[modelName] !== undefined) {
      delete types[modelName][id];
    }
  };

  return TypeCache;
}();

/**
 Manages the payloads for both sides of a single relationship, across all model
 instances.

 For example, with

 const User = DS.Model.extend({
      hobbies: DS.hasMany('hobby')
    });

 const Hobby = DS.Model.extend({
      user: DS.belongsTo('user')
    });

 let relationshipPayloads = new RelationshipPayloads('user', 'hobbies', 'hobby', 'user');

 let userPayload = {
      data: {
        id: 1,
        type: 'user',
        relationships: {
          hobbies: {
            data: [{
              id: 2,
              type: 'hobby',
            }]
          }
        }
      }
    };

 // here we expect the payload of the individual relationship
 relationshipPayloads.push('user', 1, 'hobbies', userPayload.data.relationships.hobbies);

 relationshipPayloads.get('user', 1, 'hobbies');
 relationshipPayloads.get('hobby', 2, 'user');

 @class RelationshipPayloads
 @private
 */

var RelationshipPayloads = function () {
  function RelationshipPayloads(relInfo) {
    _classCallCheck(this, RelationshipPayloads);

    this._relInfo = relInfo;

    // a map of id -> payloads for the left hand side of the relationship.
    this.lhs_payloads = new TypeCache();
    this.rhs_payloads = relInfo.isReflexive ? this.lhs_payloads : new TypeCache();

    // When we push relationship payloads, just stash them in a queue until
    // somebody actually asks for one of them.
    //
    // This is a queue of the relationship payloads that have been pushed for
    // either side of this relationship
    this._pendingPayloads = [];
  }

  /**
   Get the payload for the relationship of an individual record.
    This might return the raw payload as pushed into the store, or one computed
   from the payload of the inverse relationship.
    @method
   */


  RelationshipPayloads.prototype.get = function get(modelName, id, relationshipName) {
    this._flushPending();

    if (this._isLHS(modelName, relationshipName)) {
      return this.lhs_payloads.get(modelName, id);
    } else {
      (true && !(this._isRHS(modelName, relationshipName)) && Ember.assert(modelName + ':' + relationshipName + ' is not either side of this relationship, ' + this._relInfo.lhs_key + '<->' + this._relInfo.rhs_key, this._isRHS(modelName, relationshipName)));

      return this.rhs_payloads.get(modelName, id);
    }
  };

  /**
   Push a relationship payload for an individual record.
    This will make the payload available later for both this relationship and its inverse.
    @method
   */


  RelationshipPayloads.prototype.push = function push(modelName, id, relationshipName, relationshipData) {
    this._pendingPayloads.push([modelName, id, relationshipName, relationshipData]);
  };

  /**
   Unload the relationship payload for an individual record.
    This does not unload the inverse relationship payload.
    @method
   */


  RelationshipPayloads.prototype.unload = function unload(modelName, id, relationshipName) {
    this._flushPending();

    if (this._isLHS(modelName, relationshipName)) {
      delete this.lhs_payloads.delete(modelName, id);
    } else {
      (true && !(this._isRHS(modelName, relationshipName)) && Ember.assert(modelName + ':' + relationshipName + ' is not either side of this relationship, ' + this._relInfo.lhs_baseModelName + ':' + this._relInfo.lhs_relationshipName + '<->' + this._relInfo.rhs_baseModelName + ':' + this._relInfo.rhs_relationshipName, this._isRHS(modelName, relationshipName)));

      delete this.rhs_payloads.delete(modelName, id);
    }
  };

  /**
   @return {boolean} true iff `modelName` and `relationshipName` refer to the
   left hand side of this relationship, as opposed to the right hand side.
    @method
   */


  RelationshipPayloads.prototype._isLHS = function _isLHS(modelName, relationshipName) {
    var relInfo = this._relInfo;
    var isSelfReferential = relInfo.isSelfReferential;
    var isRelationship = relationshipName === relInfo.lhs_relationshipName;

    if (isRelationship === true) {
      return isSelfReferential === true || // itself
      modelName === relInfo.lhs_baseModelName || // base or non-polymorphic
      relInfo.lhs_modelNames.indexOf(modelName) !== -1; // polymorphic
    }

    return false;
  };

  /**
   @return {boolean} true iff `modelName` and `relationshipName` refer to the
   right hand side of this relationship, as opposed to the left hand side.
    @method
   */


  RelationshipPayloads.prototype._isRHS = function _isRHS(modelName, relationshipName) {
    var relInfo = this._relInfo;
    var isSelfReferential = relInfo.isSelfReferential;
    var isRelationship = relationshipName === relInfo.rhs_relationshipName;

    if (isRelationship === true) {
      return isSelfReferential === true || // itself
      modelName === relInfo.rhs_baseModelName || // base or non-polymorphic
      relInfo.rhs_modelNames.indexOf(modelName) !== -1; // polymorphic
    }

    return false;
  };

  RelationshipPayloads.prototype._flushPending = function _flushPending() {
    if (this._pendingPayloads.length === 0) {
      return;
    }

    var payloadsToBeProcessed = this._pendingPayloads.splice(0, this._pendingPayloads.length);
    for (var i = 0; i < payloadsToBeProcessed.length; ++i) {
      var modelName = payloadsToBeProcessed[i][0];
      var id = payloadsToBeProcessed[i][1];
      var relationshipName = payloadsToBeProcessed[i][2];
      var relationshipData = payloadsToBeProcessed[i][3];

      // TODO: maybe delay this allocation slightly?
      var inverseRelationshipData = {
        data: {
          id: id,
          type: modelName
        }
      };

      // start flushing this individual payload.  The logic is the same whether
      // it's for the left hand side of the relationship or the right hand side,
      // except the role of primary and inverse idToPayloads is reversed
      //
      var previousPayload = void 0;
      var payloadMap = void 0;
      var inversePayloadMap = void 0;
      var inverseIsMany = void 0;

      if (this._isLHS(modelName, relationshipName)) {
        previousPayload = this.lhs_payloads.get(modelName, id);
        payloadMap = this.lhs_payloads;
        inversePayloadMap = this.rhs_payloads;
        inverseIsMany = this._rhsRelationshipIsMany;
      } else {
        (true && !(this._isRHS(modelName, relationshipName)) && Ember.assert(modelName + ':' + relationshipName + ' is not either side of this relationship, ' + this._relInfo.lhs_key + '<->' + this._relInfo.rhs_key, this._isRHS(modelName, relationshipName)));

        previousPayload = this.rhs_payloads.get(modelName, id);
        payloadMap = this.rhs_payloads;
        inversePayloadMap = this.lhs_payloads;
        inverseIsMany = this._lhsRelationshipIsMany;
      }

      // actually flush this individual payload
      //
      // We remove the previous inverse before populating our current one
      // because we may have multiple payloads for the same relationship, in
      // which case the last one wins.
      //
      // eg if user hasMany helicopters, and helicopter belongsTo user and we see
      //
      //  [{
      //    data: {
      //      id: 1,
      //      type: 'helicopter',
      //      relationships: {
      //        user: {
      //          id: 2,
      //          type: 'user'
      //        }
      //      }
      //    }
      //  }, {
      //    data: {
      //      id: 1,
      //      type: 'helicopter',
      //      relationships: {
      //        user: {
      //          id: 4,
      //          type: 'user'
      //        }
      //      }
      //    }
      //  }]
      //
      // Then we will initially have set user:2 as having helicopter:1, which we
      // need to remove before adding helicopter:1 to user:4
      //
      // only remove relationship information before adding if there is relationshipData.data
      // * null is considered new information "empty", and it should win
      // * undefined is NOT considered new information, we should keep original state
      // * anything else is considered new information, and it should win
      if (relationshipData.data !== undefined) {
        this._removeInverse(id, previousPayload, inversePayloadMap);
      }
      payloadMap.set(modelName, id, relationshipData);
      this._populateInverse(relationshipData, inverseRelationshipData, inversePayloadMap, inverseIsMany);
    }
  };

  /**
   Populate the inverse relationship for `relationshipData`.
    If `relationshipData` is an array (eg because the relationship is hasMany)
   this means populate each inverse, otherwise populate only the single
   inverse.
    @private
   @method
   */


  RelationshipPayloads.prototype._populateInverse = function _populateInverse(relationshipData, inversePayload, inversePayloadMap, inverseIsMany) {
    if (!relationshipData.data) {
      // This id doesn't have an inverse, eg a belongsTo with a payload
      // { data: null }, so there's nothing to populate
      return;
    }

    if (Array.isArray(relationshipData.data)) {
      for (var i = 0; i < relationshipData.data.length; ++i) {
        var resourceIdentifier = relationshipData.data[i];
        this._addToInverse(inversePayload, resourceIdentifier, inversePayloadMap, inverseIsMany);
      }
    } else {
      var _resourceIdentifier = relationshipData.data;
      this._addToInverse(inversePayload, _resourceIdentifier, inversePayloadMap, inverseIsMany);
    }
  };

  /**
   Actually add `inversePayload` to `inverseIdToPayloads`.  This is part of
   `_populateInverse` after we've normalized the case of `relationshipData`
   being either an array or a pojo.
    We still have to handle the case that the *inverse* relationship payload may
   be an array or pojo.
    @private
   @method
   */


  RelationshipPayloads.prototype._addToInverse = function _addToInverse(inversePayload, resourceIdentifier, inversePayloadMap, inverseIsMany) {
    var relInfo = this._relInfo;

    if (relInfo.isReflexive && inversePayload.data.id === resourceIdentifier.id) {
      // eg <user:1>.friends = [{ id: 1, type: 'user' }]
      return;
    }

    var existingPayload = inversePayloadMap.get(resourceIdentifier.type, resourceIdentifier.id);
    var existingData = existingPayload && existingPayload.data;

    if (existingData) {
      // There already is an inverse, either add or overwrite depehnding on
      // whether the inverse is a many relationship or not
      //
      if (Array.isArray(existingData)) {
        existingData.push(inversePayload.data);
      } else {
        inversePayloadMap.set(resourceIdentifier.type, resourceIdentifier.id, inversePayload);
      }
    } else {
      // first time we're populating the inverse side
      //
      if (inverseIsMany) {
        inversePayloadMap.set(resourceIdentifier.type, resourceIdentifier.id, {
          data: [inversePayload.data]
        });
      } else {
        inversePayloadMap.set(resourceIdentifier.type, resourceIdentifier.id, inversePayload);
      }
    }
  };

  /**
   Remove the relationship in `previousPayload` from its inverse(s), because
   this relationship payload has just been updated (eg because the same
   relationship had multiple payloads pushed before the relationship was
   initialized).
    @method
   */
  RelationshipPayloads.prototype._removeInverse = function _removeInverse(id, previousPayload, inversePayloadMap) {
    var data = previousPayload && previousPayload.data;
    if (!data) {
      // either this is the first time we've seen a payload for this id, or its
      // previous payload indicated that it had no inverse, eg a belongsTo
      // relationship with payload { data: null }
      //
      // In either case there's nothing that needs to be removed from the
      // inverse map of payloads
      return;
    }

    if (Array.isArray(data)) {
      // TODO: diff rather than removeall addall?
      for (var i = 0; i < data.length; ++i) {
        var resourceIdentifier = data[i];
        this._removeFromInverse(id, resourceIdentifier, inversePayloadMap);
      }
    } else {
      this._removeFromInverse(id, data, inversePayloadMap);
    }
  };

  /**
   Remove `id` from its inverse record with id `inverseId`.  If the inverse
   relationship is a belongsTo, this means just setting it to null, if the
   inverse relationship is a hasMany, then remove that id from its array of ids.
    @method
   */


  RelationshipPayloads.prototype._removeFromInverse = function _removeFromInverse(id, resourceIdentifier, inversePayloads) {
    var inversePayload = inversePayloads.get(resourceIdentifier.type, resourceIdentifier.id);
    var data = inversePayload && inversePayload.data;

    if (!data) {
      return;
    }

    if (Array.isArray(data)) {
      inversePayload.data = data.filter(function (x) {
        return x.id !== id;
      });
    } else {
      inversePayloads.set(resourceIdentifier.type, resourceIdentifier.id, {
        data: null
      });
    }
  };

  _createClass(RelationshipPayloads, [{
    key: '_lhsRelationshipIsMany',
    get: function get() {
      var meta = this._relInfo.lhs_relationshipMeta;
      return meta !== null && meta.kind === 'hasMany';
    }
  }, {
    key: '_rhsRelationshipIsMany',
    get: function get() {
      var meta = this._relInfo.rhs_relationshipMeta;
      return meta !== null && meta.kind === 'hasMany';
    }
  }]);

  return RelationshipPayloads;
}();

export default RelationshipPayloads;