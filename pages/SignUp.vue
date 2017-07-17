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
                        v-model.trim="form.name"
                        single-line
                        label="Nombre"
                        hint="Debe escribir su nombre real"
                        prepend-icon="account_box"
                        required
                        @blur="hola('name')"
                    )
                    //pre {{ $data }}
                    v-snackbar(top right error v-model="snackbar" v-if="!$v.form.name.alpha && this.permit.name")
                        v-icon(light class="snackbar-icon") cancel
                        | El nombre no puede contener números ni caracteres especiales
                    v-text-field(
                        v-model.trim.lazy="form.email"
                        single-line
                        label="Dirección de correo electrónico"
                        hint="Esta dirección de correo se utilizará para iniciar sesión en GEST"
                        prepend-icon="email"
                        type="email"
                        required
                        @blur="hola('email')"
                    )
                    v-snackbar(top right error v-model="snackbar" v-if="!$v.form.email.email && this.permit.email")
                        v-icon(light class="snackbar-icon") cancel
                        | El email ingresado no es válido
                    v-text-field(
                        v-model.trim="form.password"
                        single-line
                        label="Contraseña"
                        hint="La contraseña debe contener un mínimo de ocho (8) caracteres"
                        prepend-icon="vpn_key"
                        required
                        maxlength="25"
                        counter
                        :append-icon="show_password ? 'visibility' : 'visibility_off'"
                        :type="show_password ? 'text' : 'password'"
                        :append-icon-cb="() => (show_password = !show_password)"
                    )
                    v-text-field(
                        v-model.trim="form.password_confirm"
                        single-line
                        label="Confirmar contraseña"
                        hint="Escriba nuevamente su contraseña"
                        prepend-icon="vpn_key"
                        required
                        maxlength="25"
                        counter
                        :append-icon="show_password_confirm ? 'visibility' : 'visibility_off'"
                        :type="show_password_confirm ? 'text' : 'password'"
                        :append-icon-cb="() => (show_password_confirm = !show_password_confirm)"
                    )
                    div(class="action-secondary")
                        router-link(to="/sign-in")
                            v-btn(light info flat class="cyan--text btn-action-secondary") Ya tengo cuenta
                                v-icon(right class="cyan--text") beenhere
                v-divider
                v-card-row(actions class="white-bg action-primary")
                    v-btn(
                        class="white--text cyan"
                        light
                        :loading="loading_animation"
                        @click.native="loader = 'loading_animation'"
                        :disabled="loading_animation"
                        type="submit") Comienza en GEST
                            span(slot="loader" class="custom-loader")
                                v-icon(light) cached
                    v-snackbar(:class="snackbar.context" top right v-model="snackbar.show") 
                        v-icon(light class="snackbar-icon") {{ snackbar.icon }}
                        | {{ snackbar.message }}                    
        //- pre {{ $data }}
</template>

<script>
    import {auth} from '../assets/firebase'
    
    import Vue from 'vue'
    import Vuelidate from 'vuelidate'
    Vue.use(Vuelidate)
    import { alpha, required, minLength, email } from 'vuelidate/lib/validators'
    
    export default {
        mounted() {
            console.log(auth)
        },
        data () {
            return {
                permit: {
                    email: null,
                    name: null,
                },
                form: {
                    name: null,
                    email: null,
                    password: null,
                    password_confirm: null,

                },
                show_password: false,
                show_password_confirm: false,
                loading_animation: false,
                loader: null,
                snackbar: {
                    show: false,
                    context: null,
                    message: null,
                    icon: null
                },
            }
        },
        validations: {
            form: {
                name: {
                    alpha,
                },
                email: {
                    email
                }
            }
        },
        methods: {
            hola(field) {
                if (field == 'email') {
                    this.permit.email = !this.permit.email
                    this.permit.name = false
                }
                else if (field == 'name') {
                    this.permit.name = !this.permit.name
                    this.permit.email = false
                }
            },
            signUp() {
                this.loading_animation = true
                
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
                this.loading_animation = false
                this.snackbar.context = context
                
                switch (context) {
                    case 'error':
                        this.snackbar.icon = 'cancel'
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