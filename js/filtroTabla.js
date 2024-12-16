$('.datatable').dataTable({
    "sDom": "<'row-fluid arriba'<'span6'l><'span6'f>r>t<'row-fluid abajo'<'span6'i><'span6'p>>",
    "sPaginationType": "bootstrap",
    "stateSave":true,
    stateSaveCallback:function(settings, data){//MODIFICACIÓN 22/09/2015: uso del callback personalizado para que funcione el stateSave
        var idTabla=window.location.pathname.replace(/[- ._index.php/]*/g,'');//Uso como ID de la tabla la ruta de la página donde se encuentra (quitándole el index.php en caso de que existiera, para que no haya diferencias entre el menú y los botones de Volver)
        if(compruebaAlmacenamientoHTML5()) {
            window.localStorage.setItem(idTabla,JSON.stringify(data));//Guarda el estado de la tabla en el almacenamiento local
        }
    },
    stateLoadCallback: function(settings){//MODIFICACIÓN 22/09/2015: uso del callback personalizado para que funcione el stateSave
        var idTabla=window.location.pathname.replace(/[- ._index.php/]*/g,'');
        var res=false
        if(compruebaAlmacenamientoHTML5()) {
            res=JSON.parse(window.localStorage.getItem(idTabla));
        }
        return res;
    },
	"aLengthMenu":[ 10, 25, 100, 500, 1000 ],
    "iDisplayLength":25,
    "oLanguage": {
      "sLengthMenu": "_MENU_ registros por página",
      "sSearch":"Búsqueda:",
      "oPaginate":{"sPrevious":"Atrás","sNext":"Siguiente","sLast":"Último","sFirst":"Primero"},
      "sInfo":"Mostrando _START_ de _END_ registros de un total de _TOTAL_",
      "sEmptyTable":"Aún no hay datos que mostrar",
      "sInfoEmpty":"",
      'sInfoFiltered':"(Filtrado de un total de _MAX_ registros)",
      'sZeroRecords':'No se han encontrado coincidencias'
    }
});

$('.dataTables_wrapper').find('.dataTables_paginate a').each(function(){
  $(this).addClass('noAjax');
});


function compruebaAlmacenamientoHTML5(){//MODIFICACIÓN 22/09/2015: nueva función
    try{
        return 'localStorage' in window && window['localStorage'] !== null;
    }
    catch (e){
        return false;
    }
}