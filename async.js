// to many chains
obj.api1(function(value1){
	obj.api2(value1,function(value2){
		obj.api3(value2,function(value3){
			obj.api4(value3,function(value4){
				callback(value4)
			})
		})
	})
})