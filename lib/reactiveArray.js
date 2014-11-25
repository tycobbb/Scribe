ReactiveArray = function() {
  this._dep = new Deps.Dependency(),
  this.array = [];
}

ReactiveArray.prototype.push = function(item) {
  this.array.push(item);
  this._dep.changed();
}

ReactiveArray.prototype.remove = function(item) {
  var index = this.array.indexOf(item);
  
  if(index > -1) {
    this.array.splice(index, 1);
    this._dep.changed()
  }
}

ReactiveArray.prototype.pop = function() {
	var poppedItem = this.array.pop();
	this._dep.changed();
	this._dep.depend();
	return poppedItem;
}

ReactiveArray.prototype.getArray = function() {
  this._dep.depend();
  return this.array;
}