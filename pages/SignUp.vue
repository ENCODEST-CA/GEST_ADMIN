<template lang="pug">
    div(class="container")
        v-card
            v-card-media(class="white--text blue darken-4" height="100px")
                v-container(fill-height fluid)
                    v-layout(fill-height)
                        span(class="display-3") INICIA EN GEST
            form(@submit.prevent="signUp")
                v-card-text(class="white-bg")
                    v-text-field(
                        single-line required
                        v-model.trim="form.name"
                        label="Nombre"
                        prepend-icon="account_box"
                        :rules="form.name ? [form.rules.alpha] : []"
                    )
                    v-text-field(
                        single-line required
                        v-model.trim="form.email"
                        label="Dirección de correo electrónico"
                        prepend-icon="email"
                        type="email"
                        :rules="form.email ? [form.rules.email] : []"
                    )
                    pre {{ $data.form }}
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
                        :rules="form.repeatPassword ? [form.rules.sameAsPassword] : []"
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
                    v-snackbar(:class="snackbar.context" top right v-model="snackbar.show") 
                        v-icon(light class="snackbar-icon") {{ snackbar.icon }}
                        | {{ snackbar.message }}                    
        //- pre {{ $data }}
</template>

<script>
    import {auth} from '../assets/firebase'
    
    export default {
        mounted() { console.log(auth) },
        data () {
            return {
                form: {
                    name: null,
                    email: null,
                    password: null,
                    repeatPassword: null,
                    hasError: false,
                    rules: {
                        alpha: (value) => {
                            let pattern = /^[A-Za-z\_\-\.\s\xF1\xD1]+$/
                            return pattern.test(value) || 'Evite los números y caracteres especiales'
                        },
                        email: (value) => {
                            let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            return pattern.test(value) || 'Ingrese un email válido'  
                        },
                        password: (value) => {
                            let pattern = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-zA-Z]).*$/
                            return pattern.test(value) || 'Debe ingresar mínimo ocho caracteres, un número y una letra'
                        },
                        sameAsPassword: (value) => {
                            if (this.form.password != value) { 
                                this.form.hasError = true 
                                return false || 'Las contraseñas no coinciden'
                            }
                            else { return true }
                        }
                    },
                },
                showPassword: false,
                showRepeatPassword: false,
                loadingAnimation: false,
                loader: null,
                snackbar: {
                    show: false,
                    context: 'error',
                    icon: 'cancel',
                    message: null
                },
            }
        },
        watch: {
            form: {
                name: function(hola) {
                    console.log(document.getElementById("name").className) 
                }
            }
        },
        methods: {
            // checkErrors(pattern,value) { 
            //    if (!pattern.test(value)) { this.form.hasError = true }
            //    else { this.form.hasError = false }
            // },
            signUp() {
                if (this.form.hasError) {
                    this.snackbar.show = true
                    this.snackbar.message = 'Hay errores en el formulario de registro'
                    return
                }
                this.loadingAnimation = true
                
                const name = this.form.name
                const email = this.form.email
                const password = this.form.password
                
                const create_user = auth.createUserWithEmailAndPassword(email, password)
                
                create_user.catch((error) => { this.snackbarShow('error',error.code) })
                
                create_user.then(() => {
                    let user = auth.currentUser
                    this.snackbarShow('success')
                    
                    const complete_user = user.updateProfile({
                        displayName: name,
                        photoURL: 'static/img/avatar.png'
                    })
                    
                    complete_user.catch((error) => {
                        console.log('Ha ocurrido un error al completar el registro')
                        console.log(error)
                    })
                })
            },
            snackbarShow(context,error) {
                this.snackbar.show = true
                this.loader = null
                this.loadingAnimation = false
                
                switch (context) {
                    case 'error':
                        if (error == 'auth/email-already-in-use') {
                            this.snackbar.message = 'El email ingresado ya se encuentra en uso'
                        }
                        else if (error == 'auth/network-request-failed') {
                            this.snackbar.message = 'Hemos detectado problemas en su conexión de Internet. Intente de nuevo.'          
                        }
                        else { 
                            this.snackbar.message = 'Ha ocurrido un error inesperado. Intente de nuevo' 
                        }
                        break
                    case 'success':
                        this.snackbar.context = 'success'
                        this.snackbar.icon = 'cancel'
                        this.snackbar.message = 'Bienvenido a GEST'
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