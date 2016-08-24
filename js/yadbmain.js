/*  yadbmain.js: Main javascript */
var blockAjax=true; // Ajax Loading (blockui) active..
var myApi='api/';
var DdF={}; //Datos por Defecto..
var toCookies=false;
var inicioMP=0;
var dbarticulos = TAFFY();
dbarticulos.settings({onUpdate:function () {insertupdate(this)},onInsert:function () {insertupdate(this);}});

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

