<template lang="pug">
    div(class="container")
        v-card
            v-card-media(class="white--text blue darken-4" height="100px")
                v-container(fill-height fluid)
                    v-layout(fill-height)
                        span(class="display-3") INICIA EN GEST
            form(@submit.prevent="checkErrors")
                v-card-text(class="white-bg")
                    v-text-field(
                        single-line required
                        v-model="form.name"
                        label="Nombre"
                        prepend-icon="account_box"
                        :rules="form.name ? [form.rules.name] : []"
                    )
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
                        :rules="form.password ? [form.rules.password] : []"
                    )
                    v-text-field(
                        single-line required counter
                        v-model.trim="form.repeatPassword"
                        label="Confirmar contraseña"
                        prepend-icon="vpn_key"                       
                        maxlength="25"
                        :append-icon="showRepeatPassword ? 'visibility' : 'visibility_off'"
                        :type="showRepeatPassword ? 'text' : 'password'"
                        :append-icon-cb="() => (showRepeatPassword = !showRepeatPassword)"
                        :rules="form.repeatPassword ? [form.rules.repeatPassword] : []"
                    )
                    div(class="action-secondary")
                        router-link(to="/sign-in")
                            v-btn(light info flat class="cyan--text btn-action-secondary") Ya tengo cuenta
                                v-icon(right class="cyan--text") beenhere
                v-divider
                v-card-row(actions class="white-bg action-primary")
                    v-btn(
                        light
                        class="white--text cyan"
                        type="submit"
                        :loading="loadingAnimation"
                        :disabled="loadingAnimation"
                        @click.native="loader = 'loadingAnimation'"
                    ) Comienza en GEST
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
                    name: null,
                    email: null,
                    password: null,
                    repeatPassword: null,
                    hasError: null,
                    rules: {
                        name: (value) => { return this.regex.name.test(value) || 'Evite los números y caracteres especiales' },
                        email: (value) => { return this.regex.email.test(value) || 'Ingrese un email válido' },
                        password: (value) => { return this.regex.password.test(value) || 'Debe ingresar mínimo ocho caracteres, un número y una letra' },
                        repeatPassword: (value) => { if (this.form.password != value) { return false || 'Las contraseñas no coinciden' } else { return true } }
                    },
                },
                regex: {
                    name: /^\S[A-Za-z\_\-\.\s\xF1\xD1]+$/,
                    email:  /^\S(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    password: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-zA-Z]).*$/,
                },
                showPassword: false,
                showRepeatPassword: false,
                loadingAnimation: false,
                loader: null,
                snackbar: {
                    show: false,
                    message: null
                },
            }
        },
        methods: {
            checkErrors() {
                for (let i in this.regex) {
                    this.regex[i].test(this.form[i]) ? this.form.hasError = false : this.form.hasError = true
                    if (this.form.hasError) { return }
                }
                if (this.form.password == this.form.repeatPassword) { this.signUp() }
            },
            signUp() {
                this.loadingAnimation = true
                const name = this.form.name.trim()
                const email = this.form.email.trim()
                const password = this.form.password
                
                const create_user = auth.createUserWithEmailAndPassword(email, password)
                
                create_user.then(() => {
                    this.loader = null
                    this.loadingAnimation = false

                    const user = auth.currentUser                   
                    const complete_user = user.updateProfile({
                        displayName: name,
                        photoURL: 'static/img/avatar.png'
                    })
                    
                    complete_user.catch((error) => console.log(error))
                })

                create_user.catch((error) => this.showSnackbar(error.code))
            },
            showSnackbar(error) {
                this.snackbar.show = true
                this.loader = null
                this.loadingAnimation = false
                
                switch (error) {
                    case 'auth/email-already-in-use':
                        this.snackbar.message = 'El email ingresado ya se encuentra en uso'
                        break
                    case 'auth/network-request-failed':
                        this.snackbar.message = 'Hemos detectado problemas en su conexión de Internet. Intente de nuevo.'
                        break
                    default:
                        this.snackbar.message = 'Ha ocurrido un error inesperado. Intente de nuevo' 
                        break
                }
            },
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
    .input-group__counter
        padding-right: 40px
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
    .snackbar-icon
        padding-right: 5px
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