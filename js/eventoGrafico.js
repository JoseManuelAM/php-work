var leyenda = document.getElementById('leyenda');
leyenda.innerHTML=grafico.generateLegend();
  
helpers = Chart.helpers;

helpers.each(leyenda.firstChild.childNodes, function(leyenda, index){
  helpers.addEvent(leyenda, 'mouseover', function(){
    if(grafico.segments!=undefined){//El atributo segments no existe en gráficos de barras
	    var activeSegment = grafico.segments[index];
	    activeSegment.save();
	    activeSegment.fillColor = activeSegment.highlightColor;
	    grafico.showTooltip([activeSegment]);
	    activeSegment.restore();
	}
  });
});
helpers.addEvent(leyenda.firstChild, 'mouseout', function(){
  grafico.draw();
});