/**
This module is the mother admin module

**/
window.admin=(function(){
	//private

	function checkFilters () {
		// filter check
		if(Modernizr.cssfilters){
			return true
		}else{
			return false;
		}
	}


	//public:
	return{
		init:function(iframe){

		}
	}

}());
