function uniqueIdFactory() {
  var ids = {};
  var idCounter = 1;
  
  function getId(id) {
    if (!ids[id]) {
      ids[id] = idCounter++;
    }
  
    return ids[id];
  }
  
  function setId(id, value) {
    if (ids.hasOwnProperty(id) && ids[id] !== value) {
      throw new Error("Id '" + id + "' already exists!");
    }
  
    ids[id] = value;
  }
  
  return {
    getId: getId,
    setId: setId
  };
}

module.exports = uniqueIdFactory();
module.exports.create = uniqueIdFactory;
