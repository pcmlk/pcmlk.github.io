var xaraSwidgets_slideshowTemplates = {

	entry:		'<div class="thumbnailContainer" data-index="{index}">'
				+'<table width=100% height=100% border=0 cellspacing=0 cellpadding=0><tr><td align=center valign=middle>'
				+'<span class="carouselThumbnailShadow"><img class="carouselThumbnail" src="{thumb}" /></span>'
				+'</td></tr></table>'
				+'</div>',

	image:		'<div class="bigImageContainer bigImageContainer{index}">'
				
				+'<table width=100% height=100% border=0 cellspacing=0 cellpadding=0><tr><td align=center valign=middle>'
				+'<div class="loadingMessage">'
				+'<table width=100% height=100% border=0 cellspacing=0 cellpadding=0><tr><td align=center valign=middle>'
				+'<div class="loadingMessageContainer"><div class="loadingImage"></div> loading image...</div>'
				+'</td></tr></table>'
				+'</div>'
				+'<span class="bigImageShadow bigImageShadow{index}"><img class="bigImage{index} bigImage" data-index="{index}" src="{blanksrc}" /></span>'
				+'</td></tr></table></div>',
	
	main:		
				'{imagehtml}'
				+'<div class="navButtons">'
				+'<div class="slideshowLastButton slideshowButton {ie}"></div>'
				+'<div class="slideshowNextButton slideshowButton {ie}"></div>'
				+'</div>'
				+	'<div class="slideshowCarousel">{entryhtml}</div>'
            
};

function xaraSwidgets_slideshowGetScaledNumber(container, originalWidth, num, min)
{
	var widthRatio = container.width() / originalWidth;
	
	var newNum = Math.round(widthRatio * num);
	
	if(min==null) { min = 1; }
	
	if(newNum<=min) { newNum = min; }
	
	return newNum;
}

function xaraSwidgets_slideshowNavButtonPressed(divID, newDirection)
{
	$('#' + divID).data('CurrentDirection', newDirection);
	
	xaraSwidgets_slideshowTriggerTimeout(divID);
}

function xaraSwidgets_slideshowTriggerTimeout(divID)
{
	if($('#' + divID).data('CurrentThumb')==null) { return; }
	
	var nextThumb;
	
	if($('#' + divID).data('CurrentDirection')>=0)
	{
		nextThumb = $('#' + divID).data('CurrentThumb').next();
	}
	else
	{
		nextThumb = $('#' + divID).data('CurrentThumb').prev();
	}
	
	nextThumb.trigger("click");
	
	$('#' + divID).data('CurrentThumb', nextThumb);
	
	xaraSwidgets_slideshowSetupTimeout(divID);
}


function xaraSwidgets_slideshowClearTimeout(divID)
{
	clearTimeout($('#' + divID).data('CurrentThumbTimeout'));
}

function xaraSwidgets_slideshowSetupTimeout(divID)
{
	xaraSwidgets_slideshowClearTimeout(divID);
	
	var scrollTime = $('#' + divID).data('autoscroll');
	
	if(scrollTime!=null && scrollTime!=0)
	{
		var scrollTime = scrollTime;
		
		if(!$('#' + divID).data('FirstTimeoutDone'))
		{
			scrollTime = 3;
			$('#' + divID).data('FirstTimeoutDone', true);
		}
		
		$('#' + divID).data('CurrentThumbTimeout', setTimeout("xaraSwidgets_slideshowTriggerTimeout('" + divID + "');", scrollTime * 1000));
	}
}

function xaraSwidgets_slideshowTriggerImageDownloaded(divID, imgIndex)
{
	var stageImage = $('#' + divID).find('.bigImage' + imgIndex);
	
	$('#' + divID).data('imagesDownloaded')[imgIndex] = true;
	
	//console.log(stageImage.height());
	
	stageImage.animate(null, 1000, null, function() {
		
		//$(this).trigger('imageLoaded');
			
	});
}
		
function xaraSwidgets_slideshowTriggerImageDownload(divID, imgIndex)
{
	if(imgIndex<0 || imgIndex>=$('#' + divID).find('.bigImage').length) { return; }

	if($('#' + divID).data('imagesDownloaded')[imgIndex]) { return; }
	
	var stageImage = $('#' + divID).find('.bigImage' + imgIndex);
	var imageURL = $('#' + divID).data('imageSrcsToDownload')[imgIndex];
	
	var newImg = new Image();

    newImg.onload = function() {
    	
    	$('#' + divID).data('imagesDownloaded')[imgIndex] = true;
    	
    	var width = newImg.width;
    	var height = newImg.height;
    	
    	stageImage.data('imageWidth', width);
    	stageImage.data('imageHeight', height);
    	
    	stageImage.attr('src', imageURL);
    	
    	stageImage.trigger('imageLoaded');
    	
    }

    newImg.src = imageURL;
    
    if (newImg && (newImg.complete || newImg.readyState === 4)) {
	
		newImg.onload();
		
		//console.log('Image loaded already');			
		
	}
	
}

function xaraSwidgets_slideshowIsVertical(orientation)
{
	return orientation=='left' || orientation=='right';
}

function xaraSwidgets_slideshowTemplateConstructor(divID, data, options)
{
	if(!options) { options = {}; }
	
	var originalWidth = options.width ? options.originalWidth : 600;
	var originalHeight = options.height ? options.originalHeight : 470;
	var originalBigImageWidth = options.bigImageWidth ? options.bigImageWidth : 560;
	var originalBigImageHeight = (originalBigImageWidth / 3) * 2;
	
	var originalThumbnailWidth = options.thumbnailWidth ? options.thumbnailWidth : 90;
	var originalCarouselHeight = options.carouselHeight ? options.carouselHeight : 70;
	var originalButtonWidth = options.buttonWidth ? options.buttonWidth : 200;
	var orientation = options.orientation ? options.orientation : 'bottom';
	var vertical = xaraSwidgets_slideshowIsVertical(orientation);
	
	var imagePadding = 5;
	
	var container = $('#' + divID).parent();
	
	var containerWidth = container.width();
	var containerHeight = container.height();
	
	var widthRatio = containerWidth / originalWidth;
	var heightRatio = containerHeight / originalHeight;
	
	var carouselHeight = Math.round(originalCarouselHeight * heightRatio);
	var thumbnailWidth = Math.round(originalThumbnailWidth * widthRatio);
	var bigImageWidth = Math.round(originalBigImageWidth * widthRatio);
	var buttonWidth = Math.round(originalButtonWidth * widthRatio);
	
	var scaledImageHeight = Math.round(widthRatio * originalBigImageHeight);
	
	var imageHeight = vertical ? containerHeight : containerHeight - carouselHeight;
	
	$('#' + divID).width(containerWidth).height(containerHeight);
	
	var entryHTML = '';
	var imageHTML = '';
	
	$('#' + divID).data('imagesDownloaded', {});
	$('#' + divID).data('imageIndexes', {});
	$('#' + divID).data('imageSrcsToDownload', {});
	$('#' + divID).data('imagesToDownload', {});
	
	var dataLength = data.length-1;
	var minImages = 12;
	var sets = Math.ceil(minImages/dataLength);
	//sets = 1;
	var allData = [];
	
	if(data.length>1)
	{
		for(var setIndex=0; setIndex<sets; setIndex++)
		{
			for(var actualIndex=1; actualIndex<data.length; actualIndex++)
			{
				var actualData = data[actualIndex];
			
				allData.push(actualData);
			}
		}
	}
	
	var configData = data[0];
	
	data = allData;
	
	var fileFolder = 'index_htm_files';
	
	$('script').each(function() {
		
		var src = $(this).attr('src');
		
		if(src)
		{
			var parts = src.split('/');
		
			if(parts[1]=='slideshow_config.js')
			{
				fileFolder = parts[0];
			}
		}
		
	});
	
	var autoScroll = 5;
	
	if(configData && configData.autoscroll!=null)
	{
		val = parseInt(configData.autoscroll);
		
		if(!isNaN(val))
		{
			autoScroll = val;
		}
	}
	
	//console.log(autoScroll);
	
	$('#' + divID).data('autoscroll', autoScroll);
	
	var blanksrc = fileFolder + '/0.gif';
	
	// loop through each entry in the array and compile the entry template for it
	for(var i=0; i<data.length; i++)
	{
		var j = i;
		
		data[i].index = j;
		data[i].blanksrc = blanksrc;
		var imgSrc = data[i].image;
		
		$('#' + divID).data('imageSrcsToDownload')[j] = imgSrc;
		
		entryHTML += xaraSwidgets_compileTemplate(xaraSwidgets_slideshowTemplates.entry, data[i]);
		imageHTML += xaraSwidgets_compileTemplate(xaraSwidgets_slideshowTemplates.image, data[i]);
	}

	// now lets compile the 'main' template which acts as a wrapper for each entry
	var mainData = {
		component_id:divID,
		entryhtml:entryHTML,
		imagehtml:imageHTML,
		//ie:$.browser.msie && $.browser.version <= 8 ? 'ie' : ''
		ie:document.all && !document.addEventListener ? 'ie' : ''
	};
	
	var mainTemplate = xaraSwidgets_compileTemplate(xaraSwidgets_slideshowTemplates.main, mainData);
	
	$('#' + divID).css({
		'overflow':'hidden'
	});
	
	$('#' + divID).html(mainTemplate);
	
	$('#' + divID).find('.navButtons').height(!vertical ? scaledImageHeight : imageHeight);
	
	$('#' + divID).find('.thumbnailContainer').width(thumbnailWidth).height(carouselHeight);
	
	$('#' + divID).find('.slideshowCarousel').carouFredSel({
		auto:false,
		width:vertical ? thumbnailWidth : containerWidth,
		height:vertical ? containerHeight : carouselHeight,
		direction:vertical ? 'up' : 'left',
		circular:true,
		infinite:true,
		//align:vertical ? "top" : null,
		//padding:20,
		items:{
			visible:6,
			width:thumbnailWidth,
			height:carouselHeight
		},
		scroll:{
			onBefore:function()
			{
				$('#' + divID).data('scrollingCarousel', true);
			},
			onAfter:function()
			{
				$('#' + divID).data('scrollingCarousel', false);
			}
		}
		
	},{debug:false});
	var fadeThumbnails = document.all && !document.addEventListener ? 0.5 : 0.5;
	//var fadeThumbnails = $.browser.msie && $.browser.version <= 8 ? 0.5 : 0.5;
	
	$('#' + divID).find('.carouselThumbnail').css({
		'opacity':fadeThumbnails,
		'cursor':'pointer'
	});
	
	$('#' + divID).find('.carouselThumbnail:first').css({
		'opacity':1,
		'border-color':'#999999'
	}).closest('.thumbnailContainer').addClass('active');
	
	/*
	$('#' + divID).find('.loadingMessage').css({
		'opacity':0.5,
		'border-color':'#e5e5e5'
	});
	*/
	
	
	$('#' + divID).find('.slideshowLastButton').hide();
	
	///// the left and right buttons for the big image
	$('#' + divID).find('.slideshowButton').bind('click', function(e) {
		
		if($('#' + divID).data('scrollingCarousel')) { return; }
		
		$('#' + divID).find('.slideshowLastButton').show();
		
		xaraSwidgets_slideshowNavButtonPressed(divID, $(this).hasClass('slideshowNextButton') ? 1 : -1);
		
		
	}).hover(function() {
		
		//$(this).stop(true,true).fadeTo(250,1);
		
	}, function() {
		
		//$(this).stop(true,true).fadeTo(250,0);
		
	}).css({
		'opacity':1,
		'cursor':'pointer'
	}).width(buttonWidth);
		
	///// the big images
	$('#' + divID).find('.bigImageContainer').hover(function(e) {
		
		//$(this).find('.navButtons').show();
		//$(this).find('.navButtons').stop(true,true).fadeTo(250,1);
		
	}, function(e) {
		
		//$(this).find('.navButtons').hide();
		//$(this).find('.navButtons').stop(true,true).fadeTo(250,0);
		
	}).css({
		'cursor':'pointer',
		'position':'absolute',
		'top':'0px',
		'width':(vertical ? containerWidth - thumbnailWidth : containerWidth)+'px',
		'height':(!vertical ? scaledImageHeight : imageHeight)+'px'
		
		
		
	});
	
	$('#' + divID).find('.bigImage').bind('imageLoaded', function() {
		
		var finalImageWidth = $(this).data('imageWidth');
		var finalImageHeight = $(this).data('imageHeight');
		
		//console.log('IMAGE LOADED');
		
		$('#' + divID).find('.loadingMessage').hide();
		
		//$(this).closest('.bigImageContainer').find('.loadingMessage').hide();
		
		if(finalImageHeight > imageHeight)
		{
			$(this).attr('height', imageHeight-20);
		}
			
		//$(this).show();
		
		/*
		$(this).css({
			opacity:1
		});
		*/
		
		
	});//.hide();
	
	
	
	///// the thumbnails
	$('#' + divID).find('.thumbnailContainer').bind('click', function(e) {
		
		if($('#' + divID).data('scrollingCarousel')) { return; }
		
		$('#' + divID).find('.slideshowLastButton').show();
		
		var clickIndex = parseInt($(this).attr('data-index'));
		
		var currentThumb = $('#' + divID).data('CurrentThumb');
		
		if(currentThumb!=null)
		{
			if($(this).prevAll(currentThumb).length !== 0)
			{
				$('#' + divID).data('CurrentDirection', 1);
			}
			else
			{
				$('#' + divID).data('CurrentDirection', -1);	
			}
			
			/*
			var lastCarouselIndex = parseInt(currentThumb.attr('data-index'));
			
			if(clickIndex<lastCarouselIndex)
			{
				
			}
			else
			{
				$('#' + divID).data('CurrentDirection', 1);
			}
			*/
		}
		//console.log($('#' + divID).data('CurrentDirection'));
		$('#' + divID).find('.thumbnailContainer').removeClass('active');
		
		$('#' + divID).find('.carouselThumbnail').css({
			'opacity':fadeThumbnails,
			'border-color':'#e5e5e5'
		});
		
		$(this).addClass('active').find('.carouselThumbnail').css({
			'opacity': 1,
			'border-color':'#999999'
		});
		
		//var carousel = $('#mycarousel' + divID).data('jcarousel');     
		
		//carousel.scroll(carouselIndex-1, true);
		if(document.all && !document.addEventListener)
		//if($.browser.msie && document.documentMode && document.documentMode <= 8)
		{
			$('#' + divID).find('.bigImageShadow').css({
				'-ms-filter': '',
				'filter': '',
				'margin-right':'5px',
				'margin-bottom':'5px'
			});
		}
		
		$('#' + divID).find('.slideshowCarousel').trigger("slideTo", clickIndex-1);
		
		$('#' + divID).find('.bigImageContainer').stop(true,true).fadeTo(500,0);
		
		$('#' + divID).find('.bigImageContainer' + clickIndex).stop(true,true).fadeTo(500,1, function() {
			
			//if($.browser.msie && document.documentMode && document.documentMode <= 8)
			if(document.all && !document.addEventListener)
			{
				$(this).find('.bigImageShadow').css({
					'-ms-filter': 'progid:DXImageTransform.Microsoft.Shadow(Strength=5, Direction=135, Color=\'#999\');',
					'filter': 'progid:DXImageTransform.Microsoft.Shadow(Strength=5, Direction=135, Color=\'#999999\');',
					'margin-right':'0px',
					'margin-bottom':'0px'
					
				});
			}
			
		});
		
		
		
		$('#' + divID).data('CurrentThumb', $(this));
		
		//xaraSwidgets_slideshowSetupTimeout(divID);
		
		var nextImageIndex = clickIndex + $('#' + divID).data('CurrentDirection');
		
		xaraSwidgets_slideshowTriggerImageDownload(divID, clickIndex);
		xaraSwidgets_slideshowTriggerImageDownload(divID, nextImageIndex);
		
		var scrollSetting = $('#' + divID).data('autoscroll');
	
		if(scrollSetting!=null && scrollSetting!=0)
		{
			xaraSwidgets_slideshowSetupTimeout(divID);
		}
		
		//xaraSwidgets_slideshowSetupTimeout(divID);
		//xaraSwidgets_slideshowTriggerImageDownload(divID, clickIndex - 1 + $('#' + divID).data('CurrentDirection'));
		
	}).hover(function(e) {
		
		if($(this).hasClass('active'))
		{
			return;
		}
		
		$(this).find('.carouselThumbnail').stop(true,true).fadeTo(250,1);
		
	}, function(e) {
		
		if($(this).hasClass('active'))
		{
			return;
		}
		
		$(this).find('.carouselThumbnail').stop(true,true).fadeTo(250,fadeThumbnails);
		
	});
	
	//if($.browser.msie && document.documentMode && document.documentMode <= 8)
	if(document.all && !document.addEventListener)
	{
		$('#' + divID).find('.bigImageShadow:first').css({
			'-ms-filter': 'progid:DXImageTransform.Microsoft.Shadow(Strength=5, Direction=135, Color=\'#999\');',
			'filter': 'progid:DXImageTransform.Microsoft.Shadow(Strength=5, Direction=135, Color=\'#999999\');'
		});
		
		$('#' + divID).find('.loadingMessage').hide();
	}
	
	if(orientation=='bottom')
	{
		$('#' + divID).find('.caroufredsel_wrapper').css({
			'position':'absolute',
			'bottom':'0px'
		});
	}
	else if(orientation=='top')
	{
		$('#' + divID).find('.caroufredsel_wrapper').css({
			'position':'absolute',
			'top':'0px'
		});
		
		var carouselHeight = $('#' + divID).find('.slideshowCarousel').height();
		
		var imageHeight = $('#' + divID).find('.bigImageContainer').height();
		
		var topGap = carouselHeight;
		
		if(topGap + imageHeight > container.height())
		{
			topGap -= ((topGap + imageHeight) - container.height());
		}
		
		$('#' + divID).find('.bigImageContainer, .slideshowButton').css({
			'margin-top':topGap + 'px'
		});
		
	}
	else if(orientation=='left')
	{
		$('#' + divID).find('.caroufredsel_wrapper').css({
			'position':'absolute',
			'left':'5px',
			'top':'0px'
		});
		
		$('#' + divID).find('.bigImageContainer').css({
			'left':thumbnailWidth + 'px'
		});
		
		$('#' + divID).find('.slideshowLastButton').css({
			'margin-left':(20 + thumbnailWidth) + 'px'
		});
	}
	else if(orientation=='right')
	{
		$('#' + divID).find('.caroufredsel_wrapper').css({
			'position':'absolute',
			'right':'5px',
			'top':'0px'
		});
		
		$('#' + divID).find('.slideshowNextButton').css({
			'margin-right':(20 + thumbnailWidth) + 'px'
		});
	}
	
	
	
	
	$('#' + divID).find('.bigImageContainer').hide();
	$('#' + divID).find('.bigImageContainer:first').show();
	
	$('#' + divID).data('CurrentDirection', 1);
	$('#' + divID).data('CurrentThumb', $('#' + divID).find('.thumbnailContainer:first'));
	
	var scrollSetting = $('#' + divID).data('autoscroll');
	
	if(scrollSetting!=null && scrollSetting!=0)
	{
		xaraSwidgets_slideshowSetupTimeout(divID);
	}
	
	xaraSwidgets_slideshowTriggerImageDownload(divID, 0);
	xaraSwidgets_slideshowTriggerImageDownload(divID, 1);
}
