<template lang="pug"> 
	v-app
		div(v-if="login")
			v-navigation-drawer(
				dark
				persistent
				:mini-variant="miniVariant"
				:clipped="clipped"
				v-model="drawer"
			)
				v-list(dense)
					v-subheader(class="mt-3 grey--text text--darken-1") ORGANIZACIÓN
					v-list-tile(ripple v-for="item in items_company" :key="item")
						v-list-tile-action
							v-icon(dark) {{ item.icon }}
						v-list-tile-content
							v-list-tile-title {{ item.text }}
					v-subheader(class="mt-3 grey--text text--darken-1") TRABAJO
					v-list-tile(ripple v-for="item in items_task" :key="item")
						v-list-tile-action
							v-icon(dark) {{ item.icon }}
						v-list-tile-content
							v-list-tile-title {{ item.text }}
			v-toolbar(fixed dark class="cyan")
				v-toolbar-side-icon(@click.native.stop="drawer = !drawer")
				v-btn(icon @click.native.stop="miniVariant = !miniVariant")
					v-icon(v-html="miniVariant ? 'chevron_right' : 'chevron_left'")
				v-toolbar-title(v-text="title")
				v-spacer
			main
				v-container fluid
				v-slide-y-transition(mode="out-in")
					router-view
		div(v-else)
			router-view
</template>

<script>
  import Meta from 'mixins/meta'

  export default {
    mixins: [Meta],
    data () {
      return {
        login: false,
        clipped: true,
        drawer: true,
        fixed: false,
        items_company: [
          { icon: 'business', text: 'Humanitas de Venezuela' },
          { icon: 'extension', text: 'Gerencia de Sistemas' },
        ],
        items_task: [
          { icon: 'assignment_ind', text: 'Mis Asignaciones' },
          { icon: 'assignment_late', text: 'Sin Asignar' },
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'GEST ADMIN - Dashboard'
      }
    }
  }
</script>

<style lang="stylus">
  @import './stylus/main'
</style>
