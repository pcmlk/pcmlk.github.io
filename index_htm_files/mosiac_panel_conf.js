var xaraSwidgets_mosaic_panelTemplates = {


entry:			'<a href="{link}" class="{com_id}_overlay mosaic-overlay"><div class="details">'
	//	+		'<h4>{heading}</h4><p>{text}</p></div></a>' 
		+		'<img class="{com_id}_heading" src="{heading}"   border="none"  />'
		+		'<img class="{com_id}_desc" src="{text}" border="none"  /></div></a>'
		+		'<div class="mosaic-backdrop"><img src="{image}"/></div>',

/*myTheme:			'{theme}',
timeout:			'{pause}',
speed:				'{speed}',
panelTrans: 		'{trans}',
*/
		
		
		main:	'<div id="{component_id}OuterDiv" class="mosaic-block bar" >'
			+ 	'{entryhtml}'
			+	'</div>'
};

	
function xsw_cs_htmlbr(str) {
	if (str == undefined)
		return '';
    var lines = str.split("\n");
    for (var t = 0; t < lines.length; t++) {
        lines[t] = $("<p>").text(lines[t]).html();
    }
    return lines.join("<br/>");
}

function xaraSwidgets_mosaic_panelGetConfig(value, d)
{
	var ret = parseInt(value);
	
	if(!isNaN(ret))
	{
		return ret;
	}
	else
	{
		return d;
	}
}



// this is the constructor for a component
// it loops through each 'entry' in the array of data and compiles the entry template for it
// it then applies the resulting HTML to the main template before writing the whole lot to the div on the page
// it then initialises the actual jquery plugin for the div (that now contains the required HTML as a result of writing the template to it)
function xaraSwidgets_mosaic_panelConstructor(divID, data)
{
	var entryHTML = '';
//	var entryHTML2 = '';


	myTheme = (data[0].theme);
	speed = (data[0].speed);
	panelTrans = (data[0].trans);

	
	
	var useDirection = (data[0].direction);
	var defaultDirection = 1;
	var direction = isNaN(useDirection) ? defaultDirection : useDirection
	
	var effects = [
		
    'top',
    'bottom'

	];

	var effectName = effects[direction];
	
	

	// loop through each entry in the array and compile the entry template for it
	for(var i=1; i<data.length; i++)
	{
	
	entryHTML += xaraSwidgets_compileTemplate(xaraSwidgets_mosaic_panelTemplates.entry, data[i]);
	}
	


	var com1_id=divID;
//	entryHTML = xsw_ea_htmlbr(entryHTML);
	// now lets compile the 'main' template which acts as a wrapper for each entry

	
		// get the speed value 
		var enteredSpeed = parseFloat(speed)*1000;
		var defaultSpeed = '700';
		var speed = isNaN(enteredSpeed) ? defaultSpeed : enteredSpeed

		// get the opacity value for the panel
		var enteredTrans = parseFloat(panelTrans);
		var defaultTrans = '0.8';
		var panelTrans = isNaN(enteredTrans) ? defaultTrans : enteredTrans;
    	var panelTransIE = panelTrans*100;


	
	var mainData = {
		component_id:divID,
		entryhtml:entryHTML,
		com_id:com1_id
	};
	
	


	var mainTemplate = xaraSwidgets_compileTemplate(xaraSwidgets_mosaic_panelTemplates.main, mainData);
	
	
			// find the theme value to determine whether theme colors should be matched.
		
		var defaultTheme = 0;
		var enteredTheme = parseInt(myTheme);
		var theme = isNaN(enteredTheme) ? defaultTheme : enteredTheme
//		var theme = parseInt(myTheme);
		if(!isNaN(theme))
			{
			useTheme = theme;
			}	
		if (theme ==1){
			var $p = $("<p class='xr_c_Theme_Color_1'></p>").hide().appendTo("body");
			
			}
		else if (theme ==0){
			var $p = $("<p class='xr_c_Cyclee_Color_1'></p>").hide().appendTo("body");
			
			} 

	
		var enteredovercolor = $p.css("color");
		var defaultovercolor = '#000';
	//	var overcolor = isNaN(enteredovercolor) ? defaultovercolor : enteredovercolor
		
		if (enteredovercolor !== 'rgb(0, 0, 0)')
		{
		var overcolor= enteredovercolor
		}
		else 
		{
		var overcolor= defaultovercolor;
		}
		
			
    $p.remove();

	
	// now lets apply the resulting HTML for the whole component to the main DIV that was exported by XARA
	
	$('#' + divID).html(mainTemplate);
	
	
	// get the dimensions of the parent div  
	
	var width = $('#' + divID).parent('div').width();
	var height = $('#' + divID).parent('div').height();
	$('#' + divID + 'OuterDiv').css('width',width);
	$('#' + divID + 'OuterDiv').css('height',height);
	$('#' + divID + 'OuterDiv').css('z-index','0');
//	$('.' + divID +'_image').css('width',width);
//	$('.' + divID +'_image').css('height',height);
//	$('#' + divID).parent('div').css('overflow', 'visible');

	
// write the css values to the doc
					
 $('head').append("<style>."+divID+"_overlay {z-index:1; "+effectName+":-50px; height:50px; background:"+overcolor+";  opacity: "+panelTrans+"; /* For IE 5-7 */ filter: progid:DXImageTransform.Microsoft.Alpha(Opacity="+panelTransIE+");    /* For IE 8 */-MS-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity="+panelTransIE+")';}"
   		+   "."+divID+"_heading{border:none; display: block; margin-left: 5px;  margin-top: 5px;}"
	 	+	 "."+divID+"_desc{border:none; display: block; margin-left: 5px;  margin-top: 5px;}"
     	+   "</style>" );

					
	// invoke the effect 
		$('#' + divID + 'OuterDiv').mosaic({
					animation	:	'slide',
					anchor_y	:	effectName,		//Vertical anchor position
					speed 		: 	speed
				
				});

		
					

					
}
