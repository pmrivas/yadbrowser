/*  yadbmain.js: Main javascript */
var curPage="";
var DateRanges={
	'Today': [moment(), moment()],
	'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
	'7 Days': [moment().subtract(6, 'days'), moment()],
	'30 Days': [moment().subtract(29, 'days'), moment()],
	'This Month': [moment().startOf('month'), moment().endOf('month')],
	'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
};
var FormatRanges={"format": "MM/DD/YYYY HH:mm","separator": " - ","applyLabel": "Apply","cancelLabel": "Cancel","fromLabel": "From",
        "toLabel": "To","customRangeLabel": "Custom","weekLabel": "W",
        "daysOfWeek": ["Su","Mo","Tu","We","Th","Fr","Sa"],
        "monthNames": ["January","February","March","April","May","June","July","August","September","October","November","December"],
        "firstDay": 1
  }
var lang = new Lang();
lang.dynamic('es', 'js/langpack/es.json');
var StudyBr;
$(function() { //Funcion Main..
	$.ajax({
		type: "GET",dataType:'json',cache:false, url: yadbapi + "init", success: function(dta) {
			lang.init({
				defaultLang: 'en'
			});
			if (dta.footer) {
				$('<div></div>').appendTo(".main-footer").loadTemplate($('#footer'),dta.footer);
			}
			if (dta.user) {
				$('<li class="dropdown user user-menu"></li>').prependTo($('#ulUserMenu')).loadTemplate($('#usermenu'),dta.user);
			}
			if (dta.aMenu) $('<ul class="sidebar-menu"></ul>').appendTo('#secSideBar').loadTemplate($('#menuitems'),dta.aMenu);
			if (dta.sMenues) {
				for (var i=0; i<dta.sMenues.length; i++) {
					$('<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>').appendTo($(dta.sMenues[i]['menuid']).find("a"));
					$('<ul class="treeview-menu"></ul>').appendTo($(dta.sMenues[i]['menuid'])).loadTemplate($('#menuitems'),dta.sMenues[i]['elems']);
				}
			}
			if (dta.title) document.title=dta.title;
			if (dta.LogoMini) $('#LogoMini').html(dta.LogoMini);
			if (dta.LogoLg) $('#LogoLg').html(dta.LogoLg);
			if (dta.lang) {
				window.lang.change(dta.lang);
				$.ajax({dataType: "json",url: "./js/langpack/util." + dta.lang + ".json",success: function (data) {
					DateRanges={
					  [data.langRanges[0]]: [moment(), moment()],
						[data.langRanges[1]]: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
						[data.langRanges[2]]: [moment().subtract(6, 'days'), moment()],
						[data.langRanges[3]]: [moment().subtract(29, 'days'), moment()],
						[data.langRanges[4]]: [moment().startOf('month'), moment().endOf('month')],
						[data.langRanges[5]]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
					}
					FormatRanges=data.formatRanges;
				}});
			}
			_init();
			//$.AdminLTE.layout.fix(); //Fix panels..
			return false;
	}});
	$('#secSideBar').on("click","a",function () {
		if ($(this).attr('alt')) {
			var page=$(this).attr('alt');
			if (curPage!=page) {
				$('#page-wrapper').load(page+".html?rnd=" + escape(Math.random()),function () {
					return afterPage(page);
				});
			} else return afterPage(page);
			$(this).parent().siblings().removeClass('active');
			$(this).parent().addClass('active');
		}
	});
});


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

function afterPage(page) {
	switch (page) {
		case 'browse':
			$('#stDate').daterangepicker({timePicker: true,  "parentEl": "#page-wrapper", timePickerIncrement: 30, ranges: DateRanges, locale: FormatRanges});
			$('#btSearch').click(function (e) {
				return dosearch();
			});
			$('#tblResults').on('click','td.brMore',function () {
				var tr = $(this).closest('tr');
        var row = StudyBr.row( tr );
        if (row.child.isShown()) {
        	row.child.hide();
        } else {
        	StudyBr.rows().every(function () {
        			if (this.child.isShown()) this.child.hide();
        	});
        	if (typeof row.child() !== "undefined") {
        		row.child.show();
        	} else {
	        	$.ajax({type: "POST",dataType:'json',cache:false,data:{stIUID:$(this).attr('stid')}, url: yadbapi + "study", success: function(dta) {
	        		var htmlRow='<table width="100%" class="table table-bordered table-hover"><thead><tr><th lang="en" colspan="3" width="40%">Images</th><th lang="en">Date</th><th lang="en">Series</th><th>Descr</th><th>Imagenes</th></tr></thead><tbody>';
	        		$(dta.res).each(function (i,k) {
	        			htmlRow+='<tr><td><img width="90px" src="' + yadbapi + "wado/" + k.first + '/90"></td><td><img width="90px" src="' + yadbapi + "wado/" + k.middle + '/90"></td><td><img width="90px" src="' + yadbapi + "wado/" + k.last + '/90"></td>';
	        			htmlRow+="<td>" + k.serDate + "</td><td>" + k.seriesNumber + "</td><td>" + k.serDesc + "</td><td>" + k.instCount + "</td></tr>";
	        		});
	        		row.child(htmlRow).show();
/*
	        		var htmlSeries='<table width="100%" class="table table-bordered table-hover"><thead><tr><th lang="en">Date</th><th lang="en">Series</th><th>Descr</th><th>Imagenes</th></tr></thead><tbody>';
	        		var htmlImages='<table width="100%" class="table table-hover">';
	        		$(dta.res).each(function (i,k) {
	        			htmlImages+='<tr><th colspan="3">' + k.serDesc + '</th></tr><tr><td><img width="90px" src="' + yadbapi + "wado/" + k.first + '/90"></td><td><img width="90px" src="' + yadbapi + "wado/" + k.middle + '/90"></td><td><img width="90px" src="' + yadbapi + "wado/" + k.last + '/90"></td></tr>';
	        			htmlSeries+="<tr><td>" + k.serDate + "</td><td>" + k.seriesNumber + "</td><td>" + k.serDesc + "</td><td>" + k.instCount + "</td></tr>";
	        		});
	        		htmlSeries+="</tbody></table>";
	        		htmlImages+="</table>";
	        		row.child('<table width="100%" border="0"><tr><td valign="top" width="40%">' + htmlImages + '</td><td valign="top" width="60%">' + htmlSeries + '</td></tr>').show();
*/
	        	}});
	        }
        }
			});
		break;
	}
}

function dosearch() {
	$('#dvtblResults').hide();
	$.ajax({type: "POST",dataType:'json',cache:false,data:$('#frmQuery').serialize(), url: yadbapi + "search", success: function(dta) {
		if (dta.res) {
			$('#tblResults tbody').html('');
	    $("#tblResults").DataTable().destroy();
			$("#tblResults tbody").loadTemplate('#tplResults',dta.res);
			StudyBr=$("#tblResults").DataTable( {"bAutoWidth": false,
  "aoColumns": [
    { "sWidth": "7%" },
    { "sWidth": "5%" },
    { "sWidth": "3%" },
    { "sWidth": "32%" },
    { "sWidth": "5%" },
    { "sWidth": "20%" },
    { "sWidth": "5%" },
    { "sWidth": "18%" }
  ]} );
			$('#dvtblResults').show();
		}
	}});
}