/*  yadbmain.js: Main javascript */
$(document).ajaxStart(function(e) {
	if(blockAjax){			
		$.blockUI({ 
			css: {border:'none',padding:'15px','-webkit-border-radius':'10px','-moz-border-radius':'10px',color:'#fff'}
    });
   }			
});
$(document).ajaxStop(function() {
	$.unblockUI();			
});

