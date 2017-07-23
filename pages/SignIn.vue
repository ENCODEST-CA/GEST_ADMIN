<template lang="pug">
    div(class="container")
        v-card
            v-card-media(class="white--text blue darken-4" height="100px")
                v-container(fill-height fluid)
                    v-layout(fill-height)
                        span(class="display-3") GEST ADMIN
            form(@submit.prevent="checkErrors")
                v-card-text(class="white-bg")
                    v-text-field(
                        single-line required
                        v-model="form.email"
                        label="Dirección de correo electrónico"
                        prepend-icon="email"
                        :rules="form.email ? [form.rules.email] : []"
                    )
                    v-text-field(
                        single-line required counter
                        v-model.trim="form.password"
                        label="Contraseña"
                        prepend-icon="vpn_key"
                        maxlength="25"
                        :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                        :type="showPassword ? 'text' : 'password'"
                        :append-icon-cb="() => (showPassword = !showPassword)"
                    )
                    div(class="action-secondary")
                        router-link(to="/sign-up")
                            v-btn(light info flat class="cyan--text btn-action-secondary") Registrarse
                                v-icon(right class="cyan--text") person_add
                v-divider
                v-card-row(actions class="white-bg action-primary")
                    v-btn(
                        light
                        type="submit"
                        class="white--text cyan"
                        :loading="loadingAnimation"
                        :disabled="loadingAnimation"
                        @click.native="loader = 'loadingAnimation'"
                    ) Iniciar Sesión
                            span(slot="loader" class="custom-loader")
                                v-icon(light) cached
                    v-snackbar(top right class="error" v-model="snackbar.show") 
                        v-icon(light class="snackbar-icon") cancel
                        | {{ snackbar.message }}
</template>

<script>
    import {auth} from '../assets/firebase'
    export default {
        data () {
            return {
                form: {
                    email: null,
                    password: null,
                    hasError: null,
                    rules: {
                        email: (value) => { return this.regexEmail.test(value) || 'Ingrese un email válido' }
                    },
                },
                regexEmail: /^\S(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                showPassword: false,
                loadingAnimation: false,
                loader: null,
                snackbar: {
                    show: false,
                    message: null,
                },
            }
        },
        methods: {
            checkErrors() {
                this.regexEmail.test(this.form.email) ? this.form.hasError = false : this.form.hasError = true
                if (!this.form.hasError) { this.signIn() }
            },
            signIn() {
                this.loadingAnimation = true
                const email = this.form.email.trim()
                const password = this.form.password
                
                const auth_user = auth.signInWithEmailAndPassword(email, password)
                
                auth_user.then(() => {
                    this.loader = null
                    this.loadingAnimation = false
                    const user = auth.currentUser
                })

                auth_user.catch((error) => this.showSnackbar(error.code))
            },
            showSnackbar(error) {
                this.snackbar.show = true
                this.loader = null
                this.loadingAnimation = false
                
                switch (error) {
                    case 'auth/user-disabled':
                        this.snackbar.message = 'El usuario ingresado se encuentra inactivo actualmente.'
                        break
                    case 'auth/network-request-failed':
                        this.snackbar.message = 'Hemos detectado problemas en su conexión de Internet. Intente de nuevo.'
                        break
                    default:
                        this.snackbar.message = 'Credenciales incorrectas.'
                        break
                }
            }
        }
    }
</script>

<style lang="sass" scoped>
    .container
        display: grid
        align-items: center
        justify-content: center
        max-width: 100%
        height: 100vh
        background: url('../static/background.png') no-repeat fixed
        background-size: 100% 100%
    .card
        display: grid
        width: 450px
    .white-bg
        background: white
    .input-group
        max-width: 450px
    .action-secondary
        display: grid
        justify-content: center
        flex-wrap: nowrap
    .divider
        background: #eee
    .action-primary
        display: grid
        grid-template-columns: 1fr
    .custom-loader
        animation: loader 1s infinite
        display: flex
    @keyframes loader
        from
            transform: rotate(0)
        to
            transform: rotate(360deg)
</style>
<style lang="sass">
    .center
        display: grid
        align-items: center
        justify-content: center
    a
        text-decoration: none
    .snackbar-icon
        padding-right: 5px
</style>