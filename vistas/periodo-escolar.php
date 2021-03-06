<?php
#Se activa el almacenamiento en el buffer
ob_start();
session_start();

if (!isset($_SESSION['usuario'])) {
  header('location: login.html');
}
else {
require_once 'modules/header.php';
?>

<!-- Contenido -->
      <main class="main">
        <div class="animated fadeIn">
          <div class="jumbotron jumbotron-fluid mb-0 fondo-degradado" >
          </div>
          <div class="container panel-principal col-sm-12">
            <div class="card border-light mb-3 shadow p-3 mb-5 bg-white rounded ">

              <div class="card-header pt-0 pb-1 bg-white mb-3"> <!-- Botonera del panel -->
              
                <!-- Botón para mostrar modal Período Escolar -->
                <h1 class="font-weight-normal h5">Período Escolar
                  <button class="btn btn-outline-primary btn-pill shadow-sm" data-toggle="modal" data-target="#periodoModal" id="btnAgregar">
                    <i class="fa fa-plus-circle"></i> Agregar
                  </button>
                </h1>

              </div>
              
              <div class="row" id="listadoregistros">
                <div class="col-sm-12">
                  <div class="table-responsive">
                    <table class="table table-borderless table-striped" id="tblistado">
                      <caption>Lista de períodos escolares</caption>
                      <thead class="fondo-degradado text-white">
                        <tr>
                          <th scope="col">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Opciones&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                          <th scope="col">Período Escolar</th>
                          <th scope="col">Estatus</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                      </tbody>
                    </table>
                  </div>
                </div>  
              </div>
              
              <!-- Modal para crear Período Escolar -->
              <div class="modal fade" id="periodoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog rounded" role="document">
                  <div class="modal-content">
                    
                    <form class="needs-validation" novalidate name="formularioPeriodo" id="formularioregistros"> <!-- Formulario de Período Escolar -->

                      <div class="modal-header fondo-degradado rounded">
                        <h5 class="modal-title text-white" id="exampleModalLabel">Crear Período Escolar</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>

                      <div class="modal-body">

                        <div class="row"> 

                            <div class="form-group col-md-12">
                              <label for="periodo">Período Escolar (*)</label>
                                <div class="input-group ">
                                  <select name="periodo" id="periodo" class="form-control selectpicker" required="true">
                                    
                                  </select>
                                  <div class="invalid-feedback">
                                    Campo Obligatorio
                                  </div>
                                </div>
                            </div>

                        </div> <!-- Fin row -->     
                      
                      </div>

                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="submit" id="btnGuardar" class="btn btn-primary">Guardar</button>
                      </div>


                    </form> <!-- Fin del formulario -->
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </main>
<!-- Fin Contenido -->

<?php 

require_once 'modules/footer.php';
?>
<script src="scripts/periodo-escolar.js"></script>

<?php 
} //Cierre del else que muestra esta vista
ob_end_flush();
?>