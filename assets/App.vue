<template lang="pug"> 
	v-app
		div(v-if="user.signed")
			v-navigation-drawer(
				dark persistent clipped
				v-model="sidebar.self"
				:mini-variant="mini"
			)
				v-list(dense)
					v-subheader(class="mt-3 grey--text text--darken-1") ORGANIZACIÓN
					v-list-tile(ripple v-for="item in menuCompany" :key="menuCompany.key")
						v-list-tile-action
							v-icon(dark) {{ item.icon }}
						v-list-tile-content
							v-list-tile-title {{ item.text }}
					v-subheader(class="mt-3 grey--text text--darken-1") TRABAJO
					v-list-tile(ripple v-for="item in menuTask" :key="menuTask.key")
						v-list-tile-action
							v-icon(dark) {{ item.icon }}
						v-list-tile-content
							v-list-tile-title {{ item.text }}
			v-toolbar(fixed dark class="cyan")
				v-toolbar-side-icon(@click.native.stop="sidebar.self = !sidebar.self")
				v-btn(icon @click.native.stop="sidebar.mini = !sidebar.mini")
					v-icon(v-html="sidebar.mini ? 'chevron_right' : 'chevron_left'")
				v-toolbar-title(v-text="toolbar.title")
				v-spacer
				v-menu(bottom origin="center center" transition="scale-transition")
					v-btn(flat light class="white--text" slot="activator")
						span
							v-list-tile(avatar tag="div" class="list-avatar")
								v-list-tile-avatar
									img(src="https://randomuser.me/api/portraits/men/85.jpg")
								v-list-tile-content
									v-list-tile-title(class="capitalize") {{ user.name }}
					v-list
						v-list-tile(v-for="item in menuUser" :key="menuUser.title")
							v-list-tile-action
								v-icon(light) {{ item.icon }}
							v-list-tile-title {{ item.text }}
				div(v-for="item in icons")
					v-btn(icon)
						v-icon {{ item.icon }}
			main
				v-container fluid
				v-slide-y-transition(mode="out-in")
					router-view
		div(v-else)
			router-view
</template>

<script>
	import {auth} from '../assets/firebase'
	import Meta from 'mixins/meta'
	export default {
		mixins: [Meta],
		created() { 
			auth.onAuthStateChanged((user) => { 
				if (user) {
					this.user.signed = true
					this.user.email = auth.currentUser.email
					this.user.name = auth.currentUser.displayName
					console.log(auth.currentUser)
				} 
				else { this.user.signed = false }
			})
		},
		data () {
			return {
                toolbar: {
                    title: 'GEST ADMIN - Dashboard',
                    menuUser: [
                        { icon: 'account_box', text: 'Mi Perfil' },
                        { icon: 'forward', text: 'Cerrar Sesión' }
                    ],
                    icons: [
                        { icon: 'assignment' },
                        { icon: 'notifications' },
                        { icon: 'star' },
                        { icon: 'settings' },
                    ],
                },
                sidebar: {
                    self: true,
                    mini: false,
                    menuCompany: [
                        { key: true, icon: 'business', text: 'Humanitas de Venezuela' },
                        { key: true, icon: 'extension', text: 'Gerencia de Sistemas' },
                    ],
                    menuTask: [
                        { key: true, icon: 'assignment_ind', text: 'Mis Asignaciones' },
                        { key: true, icon: 'assignment_late', text: 'Sin Asignar' },
                    ],
                },
				user: {
                    signed: null,
					email: null,
					name: null,
				},
			}
		}
	}
</script>

<style lang="stylus">
	@import './stylus/main'
</style>

<style lang="sass" scoped>
	.list-avatar
		list-style: none
		position: relative
		bottom: 10px
	.capitalize
		text-transform: capitalize
</style>
