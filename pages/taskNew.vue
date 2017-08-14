<template lang="pug">
	v-layout
		v-flex(xs12 sm12 margin-form)
			v-card
				v-card-media( class="white--text" height="50px" style="background-color:#2196f3;")
					v-container(fill-height fluid)
						v-layout(fill-height)
							v-flex(xs12 flexbox class="centrado-porcentual")
								span(class="headline") Nueva tarea Express				
				v-layout(row wrap)
					v-card-title
						v-flex(xs6 sm6 md6 class="my-3 camp")
							v-layout(row wrap)
								v-flex(xs12)
									v-text-field(
										label="Titulo"
										prepend-icon="account_circle"
										v-model="Titulo"
										max="50"
										@click.native="informacion('Acá deberas colocar el titulo de tu tarea, Recuerda no debe ser tan largo pero muy descriptivo.')"
										single-line)
						v-flex(xs6 sm6 md6 class="my-3 camp")
							v-layout(row wrap)
								v-flex(xs12)
									v-select(
										label="Responsable"
										prepend-icon="portrait"
										v-model="responsable"
										:items="options"
										max="50"
										@click.native="informacion('Deberas elegir el responsable de la tarea por registrar.')"
										single-line
										)
						v-flex(xs12 class="camp")
								v-text-field(
									label="Descripción"
									prepend-icon="comment"
									v-model="descripcion"
									max="1000"
									counter
									@click.native="informacion('Acá deberas añadir una descripcion que sirva de ayuda.')"
									single-line)
				v-slide-y-transition
					v-card-text(v-show="show")
						v-alert(info icon="bookmark_border" v-bind:value="true") {{ mensajes.CampoMarcado }}
				v-card-actions    
					v-btn(flat class="orange--text") Guardar
					v-btn(flat class="orange--text") Cancelar
</template>
<script>
  export default {
	data () {
	  return {
		show: false,
		options:[{
			value:1,
			text:'Pedro Perez'
		},{
			value:2,
			text:'Juan Rodriguez'
		},{
			value:3,
			text:'Hugo Chavez'
		}],
		mensajes: {
			CampoMarcado: ""
		},
	  }
	},
	methods:{
		informacion: function (mensaje){
			this.mensajes.CampoMarcado = mensaje
			this.show = true
		}
	}
  }
</script>

<style lang="sass" scoped>
	.margin-form
		margin: 0px 20px 0px 20px
	.camp
		margin: 0px 0px 0px 0px 

	.centrado-porcentual
	    position: absolute
	    left: 13%
	    top: 50%
	    transform: translate(-50%, -50%)
	    -webkit-transform: translate(-50%, -50%)

</style>