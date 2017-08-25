<template lang="pug">
	v-layout
		v-flex(xs12 sm12 margin-form)
			v-card
				v-card-media( class="white--text" height="50px" style="background-color:#2196f3;")
					v-container(fill-height fluid)
						v-layout(fill-height)
							v-flex(xs12 flexbox class="centered-percentege")
								span(class="headline") Nueva Tarea Express				
				v-layout(row wrap class="form-border")
						v-flex(xs6 sm6 md6 class="my-3 camp")
							v-layout(row wrap)
								v-flex(xs12)
									v-text-field(
										label="Titulo"
										prepend-icon="account_circle"
										v-model="form.title"
										max="50"
										@click.native="information('Acá deberas colocar el titulo de tu tarea, Recuerda no debe ser tan largo pero muy descriptivo.')"
										single-line)
						v-flex(xs6 sm6 md6 class="my-3 camp")
							v-layout(row wrap)
								v-flex(xs12)
									v-select(
										label="Responsable"
										prepend-icon="portrait"
										v-model="form.responsable"
										:items="options"
										max="50"
										@click.native="information('Deberas elegir el responsable de la tarea por registrar.')"
										single-line)
						v-flex(xs12 sm12 md12 class="my-3 camp")
							v-layout(row wrap)
								v-flex(xs12 class="camp")
										v-text-field(
											label="Descripcion"
											prepend-icon="comment"
											v-model="form.description"
											counter
											max="1000"
											@click.native="information('Aca colocas toda la informacion que sea de interes sobre la tarea por crear.')"
											single-line)
				v-slide-y-transition
					v-card-text(v-show="show")
						v-alert(info icon="priority_high" v-bind:value="true") {{ message.markedField }}
				v-card-actions    
					v-btn(raised secondary class="actions") Registrar Tarea
					v-btn(raised secondary class="actions") Descartar
</template>
<script>
  export default {
	data () {
	  return {
		show: false,
		form:{
			title: null,
			responsable: null,
			description: null,
		},
		options:[
			{ value:1, text:'Pedro Perez' },
			{ value:2, text:'Juan Rodriguez' },
			{ value:3, text:'Hugo Chavez' }
		],
		message: {
			markedField: ""
		},
	  }
	},
	methods:{
		information: function (message){
			this.message.markedField = message
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
	.form-border
		padding: 25px 25px 0px 25px
	.centered-percentege
	    position: absolute
	    left: 130px
	    top: 50%
	    transform: translate(-50%, -50%)
	    -webkit-transform: translate(-50%, -50%)
	.actions
		float: right
</style>