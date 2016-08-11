// Pyramid of Doom
obj.api1(function(value1){
	obj.api2(value1,function(value2){
		obj.api3(value2,function(value3){
			obj.api4(value3,function(value4){
				callback(value4)
			})
		})
	})
})

// extend the code
var handler1 = function(value1){
	obj.api2(value1,handler2)
}

var handler2 = function(value2){
	obj.api3(value2,handler3)
}

var handler3 = function(value3){
	obj.api4(value3,handler4)
}

var handler4 = function(value4){
	callback(value4)
}

obj.api1(handler1)

//use events
var emitter = new event.Emitter();

emitter.on("step1",function(){
	obj.api1(function(value1){
		emitter.emit("step2",value1)
	})
})

emitter.on("step2",function(value1){
	obj.api2(value1,function(value2){
		emitter.emit("step3",value2)
	})
})

emitter.on("step3",function(value2){
	obj.api3(value2,function(value3){
		emitter.emit("step4",value3)
	})
})

emitter.on("step4",function(value3){
	obj.api4(value3,function(value4){
		callback(value4)
	})
})

emitter.emit("step1")

//promise
promise()
	.then(obj.api1)
	.then(obj.api2)
	.then(obj.api3)
	.then(obj.api4)
	.then(function(value4){
		//do something with value4
	},function(error){
		//handle any error from step1 to step4
	})
	.done()

//alter code to support chain property
var Deferred = function(){
	this.promise = new Promise();
}

//resolve
Deferred.prototype.resolve = function(obj){
	var promise = this.promise;
	var handler;
	while((handler = promise.queue.shift())){
		if(handler && handler.fulfilled){
			var ret = handler.fulfilled(obj);
			if(ret && ret.isPromise){
				ret.queue = promise.queue;
				this.promise = ret;
				return;
			}
		}
	}
}
//fail
Deferred.prototype.reject = function(err){
	var promise = this.promise;
	var handler;
	while((handler = promise.queue.shift())){
		if(handler && handler.error){
			var ret = handler.error(err);
			if(ret && ret.isPromise){
				ret.queue = promise.queue;
				this.promise = ret;
				return;
			}
		}
	}
}

//generate callback
Deferred.prototype.callback = function(){
	var that = this;
	return function(err,file){
		if(err){
			return that,reject(err);
		}
		that.resolve(file);
	}
}

var Promise = function(){
	//the queue for callbacks waiting to be executed
	this.queue = []
	this.isPromise = true;
}

Promise.prototype.then = function(fufillerHandler,errorHandler,progressHandler){
	var handler = {}
	if(typeof fufilledHandler === 'function'){
		handler.fufilled = fufilledHandler;
	}
	if(typeof errorHandler === 'function'){
		handler.error = errorHandler;
	}
	this.queue.push(handler);
	return this;
}