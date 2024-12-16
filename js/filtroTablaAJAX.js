/*
  NUEVO FICHERO 22/09/2015  
  
  -Modo de utilización-
  Teniendo el archivo listado.php dentro de la misma carpeta donde se va a llamar al listado:
  
  <script type="text/javascript">
    $(document).ready(function(){
      listadoTabla("<?php echo $_CONFIG['raiz']; ?>[seccion]/listado.php");
    });
  </script>
*/

function listadoTabla(tabla,rutaListado){
  $(tabla).dataTable({
    'bProcessing': true, 
    'bServerSide': true,
    "stateSave":false,
    "aLengthMenu":[ 10, 25, 100, 500, 1000 ],
    stateSaveCallback:function(settings, data){
        var idTabla=window.location.pathname.replace(/[- ._index.php/]*/g,'');
        if(compruebaAlmacenamientoHTML5()) {
            window.localStorage.setItem(idTabla,JSON.stringify(data));//Guarda el estado de la tabla en el almacenamiento local
        }
    },
    stateLoadCallback: function(settings){
        var idTabla=window.location.pathname.replace(/[- ._index.php/]*/g,'');
        var res=false
        if(compruebaAlmacenamientoHTML5()) {
            res=JSON.parse(window.localStorage.getItem(idTabla));
        }
        return res;
    },
    'sAjaxSource': rutaListado,
    "iDisplayLength":25,
    "oLanguage": {
      "sLengthMenu": "_MENU_ registros por página",
      "sSearch":"Búsqueda:",
      "oPaginate":{"sPrevious":"Atrás","sNext":"Siguiente"},
      "sInfo":"Mostrando _START_ de _END_ registros de un total de _TOTAL_",
      "sEmptyTable":"Aún no hay datos que mostrar",
      "sInfoEmpty":"",
      'sInfoFiltered':"",
      'sZeroRecords':'No se han encontrado coincidencias',
      'sProcessing':'<i class="icon-spinner icon-spin"></i> Procesando...'
    }
  });
}

$('.dataTables_wrapper').find('.dataTables_paginate a').each(function(){
  $(this).addClass('noAjax');
});

function compruebaAlmacenamientoHTML5(){
    try{
        return 'localStorage' in window && window['localStorage'] !== null;
    }
    catch (e){
        return false;
    }
}